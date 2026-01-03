import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import joi from "joi";

import { AuthModule } from "./auth/auth.module";
import { MailModule } from "./mail/mail.module";
import { MinioModule } from "./minio/minio.module";
import { MusicModule } from "./music/music.module";
import { PrismaModule } from "./prisma/prisma.module";
import { UserModule } from "./user/user.module";

@Module({
  imports: [
    PrismaModule,
    MusicModule,
    MinioModule,
    UserModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: joi.object({
        JWT_SECRET: joi.string().required(),
        JWT_EXPIRES_IN: joi.string().default("1d"),
        PORT: joi.number().default(3000),
      }),
    }),
    MailModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
