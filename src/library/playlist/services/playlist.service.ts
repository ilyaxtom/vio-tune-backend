import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";

import { CreatePlaylistDto } from "library/playlist/dto/create-playlist.dto";
import { PrismaService } from "prisma/services/prisma.service";
import { PageDto, PageMetaDto, PageOptionsDto } from "shared/dto";
import { slugify } from "shared/utils/slugify";

@Injectable()
export class PlaylistService {
  constructor(private readonly prismaService: PrismaService) {}

  async getPlaylists(pageOptions: PageOptionsDto) {
    const { page, limit, search, order } = pageOptions;

    const where = search
      ? {
          title: {
            contains: search,
            mode: Prisma.QueryMode.insensitive,
          },
        }
      : undefined;

    const [items, count] = await this.prismaService.$transaction([
      this.prismaService.playlist.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          title: order,
        },
      }),
      this.prismaService.playlist.count({ where }),
    ]);

    const pageMeta = new PageMetaDto(pageOptions, count);

    return new PageDto(items, pageMeta);
  }

  async getUserPlaylists(userId: string) {
    return this.prismaService.playlist.findMany({
      where: {
        userId,
      },
    });
  }

  getPlaylistById(id: string) {
    return this.prismaService.playlist.findUnique({
      where: { id },
      include: {
        playlistItem: {
          include: {
            song: true,
          },
        },
      },
    });
  }

  create(dto: CreatePlaylistDto, userId: string) {
    const slug = slugify(dto.title);

    return this.prismaService.playlist.create({
      data: {
        ...dto,
        userId,
        slug,
      },
    });
  }
}
