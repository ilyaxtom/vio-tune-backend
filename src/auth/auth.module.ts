import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { ScheduleModule } from "@nestjs/schedule";

import { MailService } from "mail/services/mail.service";
import { PrismaService } from "prisma/services/prisma.service";
import { UserModule } from "user/user.module";

import { AuthController } from "./controllers/auth.controller";
import { AuthService, SessionService } from "./services";
import { JwtRefreshStrategy, JwtStrategy, LocalStrategy } from "./strategies";

@Module({
  imports: [
    UserModule,
    PassportModule,
    ScheduleModule.forRoot(),
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
    SessionService,
    PrismaService,
    MailService,
    SessionService,
    LocalStrategy,
    JwtStrategy,
    JwtRefreshStrategy,
  ],
})
export class AuthModule {}
