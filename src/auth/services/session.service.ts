import { Injectable } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";

import { SessionDto, UpdateSessionDto } from "auth/dto";
import { PrismaService } from "prisma/services/prisma.service";

@Injectable()
export class SessionService {
  constructor(private readonly prismaService: PrismaService) {}

  async save(data: SessionDto) {
    return this.prismaService.session.create({ data });
  }

  async findById(id: string) {
    return this.prismaService.session.findUnique({ where: { id } });
  }

  async update(id: string, data: UpdateSessionDto) {
    return this.prismaService.session.update({ where: { id }, data });
  }

  @Cron("0 */6 * * *")
  async cleanupExpiredSessions() {
    await this.prismaService.session.deleteMany({
      where: {
        expiresAt: { lt: new Date() },
      },
    });
  }
}
