import { ForbiddenException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { User } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

import { MailService } from "mail/services/mail.service";
import { UserService } from "user/services/user.service";

import { RegisterDto } from "../dto/register.dto";
import { JwtPayload } from "../interfaces/jwt-payload.interface";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.usersService.findByUsername(username);

    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (user && isMatch) {
      if (!user.isVerified) {
        throw new ForbiddenException(
          "Please verify your email before logging in",
        );
      }

      return user;
    }

    return null;
  }

  async login(user: User) {
    const tokenPayload: JwtPayload = {
      username: user.username,
      email: user.email,
    };

    const accessToken = await this.jwtService.signAsync(tokenPayload);

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
    const salt = await bcrypt.genSalt();
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

    await this.usersService.verifyEmail(user.id);

    return { message: "Email verified successfully. You can now log in." };
  }
}
