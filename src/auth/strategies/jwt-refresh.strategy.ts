import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import type { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";

import { JwtPayload } from "auth/interfaces";

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  "jwt-refresh",
) {
  constructor(private readonly configService: ConfigService) {
    const jwt = configService.get("jwt");

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => req.cookies?.refresh_jwt as string,
      ]),
      ignoreExpiration: false,
      secretOrKey: jwt.secret,
    });
  }

  validate(payload: JwtPayload) {
    return { id: payload.sub };
  }
}
