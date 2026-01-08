import { registerAs } from "@nestjs/config";
import * as process from "node:process";

export default registerAs("minio", () => ({
  endpoint: process.env.MINIO_ENDPOINT,
  port: process.env.MINIO_PORT,
  publicEndpoint: process.env.MINIO_PUBLIC_ENDPOINT,
  bucket: process.env.MINIO_BUCKET,
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY,
  useSSL: process.env.MINIO_USE_SSL,
  region: process.env.MINIO_REGION,
}));
