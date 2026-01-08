import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService, ConfigType } from "@nestjs/config";
import { JwtService, JwtSignOptions } from "@nestjs/jwt";
import { User } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { addMilliseconds } from "date-fns";
import type { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

import { RegisterDto } from "auth/dto";
import authConfig from "config/auth.config";
import jwtConfig from "config/jwt.config";
import { MailService } from "mail/services/mail.service";
import { UserService } from "user/services/user.service";

import { SessionService } from "./session.service";

@Injectable()
export class AuthService {
  private readonly auth: ConfigType<typeof authConfig>;
  private readonly jwt: ConfigType<typeof jwtConfig>;

  constructor(
    private readonly usersService: UserService,
    private readonly sessionService: SessionService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    configService: ConfigService,
  ) {
    this.auth = configService.get("auth")!;
    this.jwt = configService.get("jwt")!;
  }

  async validateUser(username: string, password: string) {
    const user = await this.usersService.findByUsername(username);

    if (!user) {
      return null;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash!);

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

  async login(user: User, req: Request, res: Response) {
    const rawToken = uuidv4();
    const hash = await bcrypt.hash(rawToken, this.auth.bcryptSaltRounds);

    const session = await this.sessionService.save({
      userId: user.id,
      hash,
      userAgent: req.headers["user-agent"],
      expiresAt: addMilliseconds(new Date(), this.auth.refreshToken.ttlMs),
    });

    const refreshJwt = await this.jwtService.signAsync({ sub: user.id }, {
      secret: this.jwt.secret,
      expiresIn: this.auth.refreshToken.expiresIn,
    } as JwtSignOptions);

    res.cookie("refresh_token", `${session.id}.${rawToken}`, {
      ...this.auth.refreshToken.cookie,
      maxAge: this.auth.refreshToken.ttlMs,
    });

    res.cookie("refresh_jwt", refreshJwt, this.auth.refreshToken.cookie);

    return {
      accessToken: await this.createAccessToken(user.id),
    };
  }

  async register(input: RegisterDto) {
    const verificationToken = uuidv4();

    const { password, ...userDto } = input;
    const salt = await bcrypt.genSalt(this.auth.bcryptSaltRounds);
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

  async refreshTokens(refreshToken: string, res: Response) {
    const [sessionId, rawToken] = refreshToken.split(".");

    const session = await this.sessionService.findById(sessionId);

    if (!session) {
      throw new UnauthorizedException();
    }

    const isValid = await bcrypt.compare(rawToken, session.hash);

    if (!isValid || session.expiresAt < new Date()) {
      throw new UnauthorizedException();
    }

    const newRawToken = uuidv4();
    const newHash = await bcrypt.hash(newRawToken, this.auth.bcryptSaltRounds);

    await this.sessionService.update(sessionId, {
      hash: newHash,
      lastUsedAt: new Date(),
    });

    res.cookie(
      "refresh_token",
      `${session.id}.${newRawToken}`,
      this.auth.refreshToken.cookie,
    );

    return {
      accessToken: await this.createAccessToken(session.userId),
    };
  }

  private async createAccessToken(userId: string) {
    return await this.jwtService.signAsync({
      sub: userId,
    });
  }
}
