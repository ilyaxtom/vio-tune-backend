import { registerAs } from "@nestjs/config";

export default registerAs("mail", () => ({
  user: process.env.MAIL_USER,
  password: process.env.MAIL_PASSWORD,
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: process.env.MAIL_SECURE,
  from: process.env.MAIL_FROM,
  frontendUrl: process.env.FRONTEND_URL,
}));
