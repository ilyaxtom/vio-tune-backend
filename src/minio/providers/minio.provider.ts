import { S3Client } from "@aws-sdk/client-s3";
import { ConfigModule, ConfigService } from "@nestjs/config";

export const S3_PROVIDER = "S3_PROVIDER";

export const S3Provider = {
  imports: [ConfigModule],
  inject: [ConfigService],
  provide: S3_PROVIDER,
  useFactory: (configService: ConfigService) => {
    const minio = configService.get("minio");

    return new S3Client({
      region: minio.region,
      endpoint: `${minio.protocol}://${minio.endpoint}:${minio.port}`,
      credentials: {
        accessKeyId: minio.accessKey,
        secretAccessKey: minio.secretKey,
      },
      forcePathStyle: true,
    });
  },
};
