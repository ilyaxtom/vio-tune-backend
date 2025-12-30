import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { User } from "@prisma/client";
import { compare } from "bcrypt";

import { UserService } from "user/services/user.service";

import { JwtPayload } from "../interfaces/jwt-payload.interface";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.usersService.findByUsername(username);

    const isMatch = await compare(password, user.passwordHash);

    if (user && isMatch) {
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
}
