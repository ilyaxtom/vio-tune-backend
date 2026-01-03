import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";

import { MailService } from "mail/services/mail.service";
import { PrismaService } from "prisma/services/prisma.service";
import { UserModule } from "user/user.module";

import { AuthController } from "./controllers/auth.controller";
import { AuthService, RefreshTokenService } from "./services";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { LocalStrategy } from "./strategies/local.strategy";

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get("JWT_SECRET"),
        signOptions: {
          expiresIn: "1m",
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    RefreshTokenService,
    PrismaService,
    LocalStrategy,
    JwtStrategy,
    MailService,
    RefreshTokenService,
  ],
})
export class AuthModule {}
