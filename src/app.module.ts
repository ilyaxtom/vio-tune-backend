import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { validationSchema } from "config/validation.schema";

import { AuthModule } from "./auth/auth.module";
import appConfig from "./config/app.config";
import authConfig from "./config/auth.config";
import databaseConfig from "./config/database.config";
import googleClientConfig from "./config/google-client.config";
import jwtConfig from "./config/jwt.config";
import mailConfig from "./config/mail.config";
import minioConfig from "./config/minio.config";
import { MailModule } from "./mail/mail.module";
import { MinioModule } from "./minio/minio.module";
import { MusicModule } from "./music/music.module";
import { PrismaModule } from "./prisma/prisma.module";
import { UserModule } from "./user/user.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        appConfig,
        authConfig,
        databaseConfig,
        googleClientConfig,
        jwtConfig,
        mailConfig,
        minioConfig,
      ],
      validationSchema,
      expandVariables: true,
    }),
    PrismaModule,
    MusicModule,
    MinioModule,
    UserModule,
    AuthModule,
    MailModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
