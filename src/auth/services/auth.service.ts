import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { User } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { addMinutes } from "date-fns";
import type { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

import { RegisterDto } from "auth/dto";
import { MailService } from "mail/services/mail.service";
import { UserService } from "user/services/user.service";

import { SessionService } from "./session.service";

const REFRESH_TOKEN_TTL = 2 * 60 * 1000;
const BCRYPT_SALT_ROUNDS = 12;

const REFRESH_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/",
  maxAge: REFRESH_TOKEN_TTL,
};

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly sessionService: SessionService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

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
    const hash = await bcrypt.hash(rawToken, BCRYPT_SALT_ROUNDS);

    const session = await this.sessionService.save({
      userId: user.id,
      hash,
      userAgent: req.headers["user-agent"],
      expiresAt: addMinutes(new Date(), 2),
    });

    const refreshJwt = await this.jwtService.signAsync(
      { sub: user.id },
      {
        secret: process.env.JWT_SECRET,
        expiresIn: "2m",
      },
    );

    res.cookie("refresh_token", `${session.id}.${rawToken}`, REFRESH_OPTIONS);

    res.cookie("refresh_jwt", refreshJwt, REFRESH_OPTIONS);

    return {
      accessToken: await this.createAccessToken(user.id),
    };
  }

  async register(input: RegisterDto) {
    const verificationToken = uuidv4();

    const { password, ...userDto } = input;
    const salt = await bcrypt.genSalt(BCRYPT_SALT_ROUNDS);
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
    const newHash = await bcrypt.hash(newRawToken, BCRYPT_SALT_ROUNDS);

    await this.sessionService.update(sessionId, {
      hash: newHash,
      lastUsedAt: new Date(),
    });

    res.cookie(
      "refresh_token",
      `${session.id}.${newRawToken}`,
      REFRESH_OPTIONS,
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
