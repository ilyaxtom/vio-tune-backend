import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MailerModule } from "@nestjs-modules/mailer";

import { MailService } from "./services/mail.service";

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const mail = configService.get("mail");

        return {
          transport: {
            host: mail.host,
            port: mail.port,
            secure: mail.secure,
            auth: {
              user: mail.user,
              pass: mail.password,
            },
          },
          defaults: {
            from: mail.from,
          },
        };
      },
    }),
  ],
  providers: [MailService],
})
export class MailModule {}
