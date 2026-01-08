import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { OAuthProvider } from "@prisma/client";
import { Profile, Strategy } from "passport-google-oauth20";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    const googleClient = configService.get("googleClient");

    super({
      clientID: googleClient.clientId,
      clientSecret: googleClient.clientSecret,
      callbackURL: googleClient.callbackUrl,
      scope: ["email", "profile"],
    });
  }

  validate(_, __, profile: Profile) {
    const email = profile.emails?.[0].value;

    if (!email) {
      throw new UnauthorizedException("Google profile has no email");
    }

    return {
      email,
      providerId: profile.id,
      provider: OAuthProvider.GOOGLE,
    };
  }
}
