import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Request,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

import { RegisterDto } from "auth/dto/register.dto";
import type { RequestWithUser } from "auth/interfaces/request-with-user.interface";
import { AuthService } from "auth/services/auth.service";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard("local"))
  @Post("login")
  async login(@Request() req: RequestWithUser) {
    return this.authService.login(req.user);
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("profile")
  getProfile(@Request() req: RequestWithUser) {
    return req.user;
  }

  @Post("register")
  async register(@Body() input: RegisterDto) {
    return this.authService.register(input);
  }

  @Get("verify")
  async verifyEmail(@Query("token") token: string) {
    return this.authService.verifyEmail(token);
  }
}
