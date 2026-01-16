import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import {
  Playlist,
  PlaylistVisibility,
  Prisma,
  Role as UserRole,
  User,
} from "@prisma/client";

import { CreatePlaylistDto, UpdatePlaylistDto } from "library/playlist/dto";
import { PrismaService } from "prisma/services/prisma.service";
import { PageDto, PageMetaDto, PageOptionsDto } from "shared/dto";
import { slugify } from "shared/utils/slugify";

@Injectable()
export class PlaylistService {
  constructor(private readonly prismaService: PrismaService) {}

  private async getPlaylistOrFail(slug: string) {
    const playlist = await this.prismaService.playlist.findUnique({
      where: { slug },
    });

    if (!playlist) {
      throw new NotFoundException(`Playlist not found`);
    }

    return playlist;
  }

  private isAdmin(user?: User) {
    return user?.role === UserRole.ADMIN;
  }

  private isOwner(user: User, playlist: Playlist) {
    return user.id === playlist.userId;
  }

  private canModify(user: User, playlist: Playlist) {
    const isAdmin = this.isAdmin(user);
    const isOwner = this.isOwner(user, playlist);

    if (!isAdmin && !isOwner) {
      throw new ForbiddenException("Insufficient permissions");
    }
  }

  async findAll(pageOptions: PageOptionsDto, user?: User) {
    const { page, limit, search, order } = pageOptions;

    const isAdmin = user?.role === UserRole.ADMIN;

    const visivilityWhere = isAdmin
      ? {}
      : user
        ? {
            OR: [
              { visibility: PlaylistVisibility.PUBLIC },
              { userId: user.id },
            ],
          }
        : {
            visibility: PlaylistVisibility.PUBLIC,
          };

    const searchWhere = search
      ? {
          title: {
            contains: search,
            mode: Prisma.QueryMode.insensitive,
          },
        }
      : {};

    const where: Prisma.PlaylistWhereInput = {
      AND: [visivilityWhere, searchWhere],
    };

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

  async findByUser(userId: string) {
    return this.prismaService.playlist.findMany({
      where: {
        userId,
      },
    });
  }

  async findBySlug(slug: string, user?: User) {
    const playlist = await this.prismaService.playlist.findUnique({
      where: { slug },
      include: {
        playlistItem: {
          include: {
            song: true,
          },
        },
      },
    });

    if (!playlist) {
      throw new NotFoundException(`Playlist not found`);
    }

    if (this.isAdmin(user)) {
      console.log("admin");
      return playlist;
    }

    const isOwner = user?.id === playlist.userId;

    if (playlist.visibility === PlaylistVisibility.PRIVATE && !isOwner) {
      throw new ForbiddenException("This playlist is private");
    }

    return playlist;
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

  async update(slug: string, user: User, dto: UpdatePlaylistDto) {
    const playlist = await this.getPlaylistOrFail(slug);

    this.canModify(user, playlist);

    return this.prismaService.playlist.update({
      where: { id: playlist.id },
      data: {
        title: dto.title,
        visibility: dto.visibility,
      },
    });
  }

  async delete(slug: string, user: User) {
    const playlist = await this.getPlaylistOrFail(slug);

    this.canModify(user, playlist);

    return this.prismaService.playlist.delete({
      where: { id: playlist.id },
    });
  }
}
