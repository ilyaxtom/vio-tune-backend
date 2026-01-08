import * as Joi from "joi";

export const validationSchema = Joi.object({
  // App
  PORT: Joi.number().default(3000),
  NODE_ENV: Joi.string(),
  BCRYPT_SALT_ROUNDS: Joi.number().default(12),

  // Auth
  REFRESH_TOKEN_TTL_MS: Joi.number().default(12000),
  REFRESH_JWT_EXPIRES_IN: Joi.string().default("2m"),
  JWT_ACCESS_EXPIRES_IN: Joi.string().default("15m"),

  // Database
  DATABASE_URL: Joi.string().required(),
  POSTGRES_DB: Joi.string().required(),
  POSTGRES_USER: Joi.string().required(),
  POSTGRES_PASSWORD: Joi.string().required(),
  POSTGRES_HOST: Joi.string().required(),
  POSTGRES_PORT: Joi.number().required(),

  // Google Client
  GOOGLE_CLIENT_SECRET: Joi.string().required(),
  GOOGLE_CLIENT_ID: Joi.string().required(),
  GOOGLE_CALLBACK_URL: Joi.string().required(),

  // Jwt
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.string().default("10m"),
  REFRESH_EXPIRES_IN: Joi.string().default("30d"),

  // Mail
  MAIL_USER: Joi.string().required(),
  MAIL_PASSWORD: Joi.string().required(),
  FRONTEND_URL: Joi.string().required(),

  // Minio
  MINIO_ENDPOINT: Joi.string().required(),
  MINIO_PORT: Joi.string().required(),
  MINIO_PUBLIC_ENDPOINT: Joi.string().required(),
  MINIO_BUCKET: Joi.string().required(),
  MINIO_ACCESS_KEY: Joi.string().required(),
  MINIO_SECRET_KEY: Joi.string().required(),
  MINIO_USE_SSL: Joi.string().required(),
  MINIO_REGION: Joi.string().required(),
});
