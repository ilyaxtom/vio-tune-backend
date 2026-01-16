import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Prisma, Role as UserRole, User } from "@prisma/client";

import { CreatePlaylistDto, UpdatePlaylistDto } from "library/playlist/dto";
import { PrismaService } from "prisma/services/prisma.service";
import { PageDto, PageMetaDto, PageOptionsDto } from "shared/dto";
import { slugify } from "shared/utils/slugify";

@Injectable()
export class PlaylistService {
  constructor(private readonly prismaService: PrismaService) {}

  private async getPlaylistOrFail(id: string) {
    const playlist = await this.prismaService.playlist.findUnique({
      where: { id },
    });

    if (!playlist) {
      throw new NotFoundException(`Playlist with id ${id} not found`);
    }

    return playlist;
  }

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

  async update(id: string, user: User, dto: UpdatePlaylistDto) {
    const playlist = await this.getPlaylistOrFail(id);

    const isAdmin = user.role === UserRole.ADMIN;
    const isOwner = user.id === playlist.userId;

    if (!isAdmin && !isOwner) {
      throw new ForbiddenException(
        "You don't have permission to update this playlist",
      );
    }

    return this.prismaService.playlist.update({
      where: { id: playlist.id },
      data: dto,
    });
  }

  async delete(id: string, user: User) {
    const playlist = await this.getPlaylistOrFail(id);

    const isAdmin = user.role === UserRole.ADMIN;
    const isOwner = user.id === playlist.userId;

    if (!isAdmin && !isOwner) {
      throw new ForbiddenException(
        "You don't have permission to delete this playlist",
      );
    }

    return this.prismaService.playlist.delete({
      where: { id: playlist.id },
    });
  }
}
