import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import type { Request, Response } from "express";

import { RegisterDto, VerifyEmailDto } from "auth/dto";
import type { RequestWithUser } from "auth/interfaces/request-with-user.interface";
import { AuthService } from "auth/services/auth/auth.service";
import { ResponseInterceptor } from "user/interceptors";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  @UseGuards(AuthGuard("local"))
  @HttpCode(HttpStatus.OK)
  async login(
    @Req() req: RequestWithUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.login(req.user, res);
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

  @Post("verify")
  async verifyEmail(@Body() input: VerifyEmailDto) {
    return this.authService.verifyEmail(input.token);
  }

  @Post("refresh")
  @UseGuards(AuthGuard("jwt"))
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Req() req: RequestWithUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.refreshTokens(req, res);
  }
}
