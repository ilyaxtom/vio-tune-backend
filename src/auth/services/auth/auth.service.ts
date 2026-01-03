import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { User } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { addMinutes } from "date-fns";
import type { Response } from "express";
import { v4 as uuidv4 } from "uuid";

import { RegisterDto } from "auth/dto";
import { JwtPayload } from "auth/interfaces/jwt-payload.interface";
import { RefreshTokenService } from "auth/services";
import { MailService } from "mail/services/mail.service";
import { UserService } from "user/services/user.service";

import { RequestWithUser } from "../../interfaces/request-with-user.interface";

const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: false,
  sameSite: "strict" as const,
  path: "/",
};

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.usersService.findByUsername(username);

    if (!user) {
      return null;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
      return null;
    }

    if (!user.isVerified) {
      throw new ForbiddenException(
        "Please verify your email before logging in",
      );
    }

    return user;
  }

  async login(user: User, res: Response) {
    const tokenPayload: JwtPayload = {
      sub: user.id,
    };

    const accessToken = await this.jwtService.signAsync(tokenPayload);

    const refreshToken = await this.createRefreshToken(user.id);

    res.cookie("refresh_token", refreshToken, {
      ...REFRESH_COOKIE_OPTIONS,
      maxAge: 2 * 60 * 1000,
    });

    return {
      accessToken,
      user: {
        username: user.username,
        email: user.email,
      },
    };
  }

  async register(input: RegisterDto) {
    const verificationToken = uuidv4();

    const { password, ...userDto } = input;
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = await this.usersService.create({
      ...userDto,
      passwordHash,
      verificationToken,
    });

    await this.mailService.sendVerificationEmail(
      newUser.email,
      verificationToken,
    );

    return { message: "Please check you email to verify your account" };
  }

  async verifyEmail(token: string) {
    const user = await this.usersService.findByVerificationToken(token);

    if (!user) {
      throw new ForbiddenException("Invalid or expired verification token");
    }

    await this.usersService.verifyEmail(user.id);

    return { message: "Email verified successfully. You can now log in." };
  }

  private async createRefreshToken(userId: string) {
    const token = uuidv4();
    const hash = await bcrypt.hash(token, 10);

    await this.refreshTokenService.saveRefreshToken({
      userId,
      hash,
      expiresAt: addMinutes(new Date(), 2),
    });

    return token;
  }

  async refreshTokens(req: RequestWithUser, res: Response) {
    const refreshToken = req.cookies?.refresh_token as string;

    if (!refreshToken) {
      throw new UnauthorizedException();
    }

    const storedToken = await this.refreshTokenService.findRefreshToken(
      refreshToken,
      req.user.id,
    );

    if (!storedToken) {
      throw new UnauthorizedException();
    }

    const isValid = await bcrypt.compare(refreshToken, storedToken.hash);

    if (!isValid || storedToken.expiresAt < new Date()) {
      throw new UnauthorizedException();
    }

    await this.refreshTokenService.deleteRefreshToken(storedToken.id);

    const newRefreshToken = await this.createRefreshToken(storedToken.userId);

    const accessToken = await this.jwtService.signAsync({
      sub: storedToken.userId,
    });

    res.cookie("refresh_token", newRefreshToken, {
      ...REFRESH_COOKIE_OPTIONS,
      maxAge: 2 * 60 * 1000,
    });

    return { accessToken };
  }
}
