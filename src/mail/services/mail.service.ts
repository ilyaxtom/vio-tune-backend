import { Injectable } from "@nestjs/common";
import { MailerService } from "@nestjs-modules/mailer";

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendVerificationEmail(
    to: string,
    verificationToken: string,
  ): Promise<any> {
    await this.mailerService.sendMail({
      to,
      subject: "Email Verification",
      text: "To verify your email click the link below",
      html: `<a href="http://localhost:3000/api/auth/verify?token=${verificationToken}">Hello World</a>`,
    });
  }
}
