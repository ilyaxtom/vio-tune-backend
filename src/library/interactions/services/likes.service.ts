import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { User } from "@prisma/client";

import { LIKE_CONFIG } from "library/interactions/constants/like-config";
import { LikeDto } from "library/interactions/dto/like.dto";
import { Like } from "library/interactions/interfaces/like.interface";
import { PrismaService } from "prisma/services/prisma.service";

type SlugModel = {
  findUnique: (args: {
    where: { slug: string };
    select: { id: true };
  }) => Promise<{ id: string } | null>;
};

@Injectable()
export class LikesService {
  constructor(private readonly prismaService: PrismaService) {}

  async handleLike(dto: LikeDto, user: User) {
    const { slug, type } = dto;

    const resourceId = await this.getResourceIdBySlug(type, slug);

    return this.toggleLike(type, resourceId, user.id);
  }

  private async getResourceIdBySlug(type: Like, slug: string): Promise<string> {
    const config = LIKE_CONFIG[type];

    const model: SlugModel = this.prismaService[config.model];

    if (!model) {
      throw new BadRequestException(`Invalid type: ${type}`);
    }

    const resource = await model.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!resource) {
      throw new NotFoundException(`Resource not found`);
    }

    return resource.id;
  }

  private async toggleLike(type: Like, resourceId: string, userId: string) {
    const config = LIKE_CONFIG[type];
    const modelName = config.joinModel;
    const resourceKey = config.resourceKey;
    const typeLabel = type.toLowerCase();

    const compositeKeyName = `userId_${resourceKey}`;

    const where = {
      [compositeKeyName]: {
        userId,
        [resourceKey]: resourceId,
      },
    };

    await this.prismaService.$transaction(async (tx) => {
      const existing = await tx[modelName].findUnique({ where });

      if (existing) {
        await tx[modelName].delete({ where });

        return {
          status: "unliked",
          message: `Unliked the ${typeLabel}`,
        };
      }

      await tx[modelName].create({
        data: {
          userId,
          [resourceKey]: resourceId,
        },
      });

      return { status: "liked", message: `Unliked the ${typeLabel}` };
    });
  }
}
