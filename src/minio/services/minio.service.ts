import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { Inject, Injectable, Logger } from "@nestjs/common";
import * as process from "node:process";

@Injectable()
export class MinioService {
  private readonly bucket: string;
  private readonly publicEndpoint: string;
  private readonly logger = new Logger(MinioService.name);

  constructor(@Inject("S3_PROVIDER") private readonly s3: S3Client) {
    this.bucket = process.env.MINIO_BUCKET!;
    this.publicEndpoint = process.env.MINIO_PUBLIC_ENDPOINT!;

    if (!this.bucket || !this.publicEndpoint) {
      throw new Error("Missing required MinIO environment variables");
    }
  }

  getPublicUrl(key: string) {
    return `${this.publicEndpoint}/${process.env.MINIO_BUCKET}/${key}`;
  }

  async upload(key: string, body: Buffer, contentType: string) {
    try {
      await this.s3.send(
        new PutObjectCommand({
          Bucket: process.env.MINIO_BUCKET!,
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
          Bucket: process.env.MINIO_BUCKET!,
          Key: key,
        }),
      );
    } catch (error) {
      this.logger.error(`Failed to delete ${key}`, error);
      throw new Error("Delete failed");
    }
  }
}
