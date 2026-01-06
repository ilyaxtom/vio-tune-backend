import { Module } from "@nestjs/common";
import { MailerModule } from "@nestjs-modules/mailer";

import { MailService } from "./services/mail.service";

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        },
      },
      defaults: {
        from: '"Nest App" xtom38@gmail.com',
      },
    }),
  ],
  providers: [MailService],
})
export class MailModule {}
