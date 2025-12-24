import { S3Client } from "@aws-sdk/client-s3";

export const S3_PROVIDER = "S3_PROVIDER";

const endpoint = process.env.MINIO_ENDPOINT;
const port = process.env.MINIO_PORT;
const accessKey = process.env.MINIO_ACCESS_KEY;
const secretKey = process.env.MINIO_SECRET_KEY;
const protocol = process.env.MINIO_USE_SSL === "true" ? "https" : "http";
const region = process.env.MINIO_REGION;

export const S3Provider = {
  provide: S3_PROVIDER,
  useFactory: () => {
    if (!endpoint || !port || !accessKey || !secretKey) {
      throw new Error("Missing required MinIO environment variables");
    }

    return new S3Client({
      region: region ?? "eu-central-1",
      endpoint: `${protocol}://${endpoint}:${port}`,
      credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretKey,
      },
      forcePathStyle: true,
    });
  },
};
