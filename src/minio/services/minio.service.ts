import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class MinioService {
  private readonly bucket: string;
  private readonly publicEndpoint: string;
  private readonly logger = new Logger(MinioService.name);

  constructor(
    @Inject("S3_PROVIDER") private readonly s3: S3Client,
    configService: ConfigService,
  ) {
    const { bucket, publicEndpoint } = configService.get("minio");
    this.bucket = bucket;
    this.publicEndpoint = publicEndpoint;
  }

  getPublicUrl(key: string) {
    return `${this.publicEndpoint}/${this.bucket}/${key}`;
  }

  async upload(key: string, body: Buffer, contentType: string) {
    try {
      await this.s3.send(
        new PutObjectCommand({
          Bucket: this.bucket,
          Key: key,
          Body: body,
          ContentType: contentType,
        }),
      );
    } catch (error) {
      this.logger.error(`Failed to upload ${key}`, error);
      throw new Error("Upload failed");
    }
  }

  async delete(key: string) {
    try {
      await this.s3.send(
        new DeleteObjectCommand({
          Bucket: this.bucket,
          Key: key,
        }),
      );
    } catch (error) {
      this.logger.error(`Failed to delete ${key}`, error);
      throw new Error("Delete failed");
    }
  }
}
