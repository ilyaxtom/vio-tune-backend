import { Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt";

import { RefreshTokenDto } from "auth/dto";
import { PrismaService } from "prisma/services/prisma.service";

@Injectable()
export class RefreshTokenService {
  constructor(private readonly prismaService: PrismaService) {}

  async findRefreshToken(refreshToken: string, userId: string) {
    const refreshTokens = await this.prismaService.refreshToken.findMany({
      where: { userId },
    });

    for (const token of refreshTokens) {
      if (await bcrypt.compare(refreshToken, token.hash)) {
        return token;
      }
    }

    return null;
  }

  async saveRefreshToken(refreshToken: RefreshTokenDto) {
    return await this.prismaService.refreshToken.create({ data: refreshToken });
  }

  async deleteRefreshToken(id: string) {
    return await this.prismaService.refreshToken.delete({ where: { id } });
  }
}
