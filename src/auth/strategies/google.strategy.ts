import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { OAuthProvider } from "@prisma/client";
import { Profile, Strategy } from "passport-google-oauth20";

import { GoogleAuthService } from "auth/services";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(ConfigService) configService: ConfigService,
    @Inject(GoogleAuthService)
    private readonly googleAuthService: GoogleAuthService,
  ) {
    super({
      clientID: configService.get("GOOGLE_CLIENT_ID") as string,
      clientSecret: configService.get("GOOGLE_CLIENT_SECRET") as string,
      callbackURL: configService.get("GOOGLE_CALLBACK_URL") as string,
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
