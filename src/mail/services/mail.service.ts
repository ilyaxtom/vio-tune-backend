import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { MailerService } from "@nestjs-modules/mailer";

import { MailOptions } from "mail/interfaces/mail-options.interface";

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  private async sendMail(options: MailOptions) {
    try {
      await this.mailerService.sendMail(options);
    } catch (error) {
      this.logger.error("Failed to send mail", error);
      throw new InternalServerErrorException("Failed to send mail");
    }
  }

  async sendVerificationEmail(to: string, verificationToken: string) {
    const verificationUrl = `${this.configService.get("FRONTEND_URL")}/api/auth/verify?token=${verificationToken};`;

    await this.sendMail({
      to,
      subject: "Email Verification",
      text: "To verify your email click the link below",
      html: `<a href=${verificationUrl}>Verify Email</a>`,
    });
  }
}
