import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import type { Response } from "express";

import { RegisterDto, VerifyEmailDto } from "auth/dto";
import type { RequestWithOAuthProfile, RequestWithUser } from "auth/interfaces";
import { AuthService, GoogleAuthService } from "auth/services";
import { ResponseInterceptor } from "user/interceptors";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly googleAuthService: GoogleAuthService,
  ) {}

  @Post("login")
  @UseGuards(AuthGuard("local"))
  @HttpCode(HttpStatus.OK)
  async login(
    @Req() req: RequestWithUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.login(req.user, req, res);
  }

  @Get("profile")
  @UseGuards(AuthGuard("jwt"))
  @UseInterceptors(ResponseInterceptor)
  getProfile(@Req() req: RequestWithUser) {
    return req.user;
  }

  @Post("register")
  async register(@Body() input: RegisterDto) {
    return this.authService.register(input);
  }

  @Post("verify-email")
  async verifyEmail(@Body() input: VerifyEmailDto) {
    return this.authService.verifyEmail(input.token);
  }

  @Post("refresh")
  @UseGuards(AuthGuard("jwt-refresh"))
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Req() req: RequestWithUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies?.refresh_token as string;

    if (!refreshToken) {
      throw new UnauthorizedException();
    }

    return this.authService.refreshTokens(refreshToken, res);
  }

  @Get("google/login")
  @UseGuards(AuthGuard("google"))
  googleLogin(): void {
    // Redirect handles by passport
  }

  @Get("google/callback")
  @UseGuards(AuthGuard("google"))
  googleCallback(
    @Req() req: RequestWithOAuthProfile,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.googleAuthService.login(req, res);
  }
}
