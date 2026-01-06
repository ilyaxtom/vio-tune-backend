import { Injectable, UnauthorizedException } from "@nestjs/common";
import type { Response } from "express";

import { RequestWithOAuthProfile } from "auth/interfaces";
import { UserService } from "user/services/user.service";

import { AuthService } from "./auth.service";

@Injectable()
export class GoogleAuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly authService: AuthService,
  ) {}

  async login(req: RequestWithOAuthProfile, res: Response) {
    const { email, providerId, provider } = req.user;

    if (!provider || !providerId) {
      throw new UnauthorizedException("Invalid OAuth profile");
    }

    const user = await this.usersService.findOrCreateOAuthUser({
      provider,
      providerId,
      email,
    });

    return this.authService.login(user, req, res);
  }
}
