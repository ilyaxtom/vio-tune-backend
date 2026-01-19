import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { User } from "@prisma/client";

import { LikeDto } from "library/interactions/dto/like.dto";
import { Like } from "library/interactions/interfaces/like.interface";
import { PrismaService } from "prisma/services/prisma.service";

@Injectable()
export class LikesService {
  constructor(private readonly prismaService: PrismaService) {}

  async handleLike(dto: LikeDto, user: User) {
    const { slug, type } = dto;

    const resourceId = await this.getId(type, slug);

    return this.toggleLike(type, resourceId, user.id);
  }

  private async getId(type: Like, slug: string): Promise<string> {
    const modelMap = {
      [Like.SONG]: this.prismaService.song,
      [Like.ALBUM]: this.prismaService.album,
      [Like.PLAYLIST]: this.prismaService.playlist,
    };

    const model = modelMap[type] as any;
    if (!model) {
      throw new BadRequestException(`Invalid type: ${type}`);
    }

    const resource = await model.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!resource) {
      throw new NotFoundException(`${type} with slug ${slug} not found`);
    }

    return resource.id as string;
  }

  private async toggleLike(type: Like, resourceId: string, userId: string) {
    const modelName = this.getJoinModelName(type);
    const joinModel = this.prismaService[modelName];

    const resourceKey = `${type.toLowerCase()}Id`;
    const compositeKeyName = `userId_${resourceKey}`;

    const whereCondition = {
      [compositeKeyName]: {
        userId,
        [resourceKey]: resourceId,
      },
    };

    const resource = await joinModel.findUnique({ where: whereCondition });

    if (!resource) {
      await joinModel.create({
        data: {
          userId,
          [resourceKey]: resourceId,
        },
      });
      return {
        status: "liked",
        message: `Successfully liked the ${type.toLowerCase()}`,
      };
    }

    await joinModel.delete({ where: whereCondition });
    return {
      status: "unliked",
      message: `Successfully unliked the ${type.toLowerCase()}`,
    };
  }

  private getJoinModelName(type: Like) {
    const camelType =
      type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
    return `userLike${camelType}`;
  }
}
