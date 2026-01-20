import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";

import { CreateSongDto, UpdateSongDto } from "music/song/dto";
import { PrismaService } from "prisma/services/prisma.service";
import { PageDto, PageMetaDto, PageOptionsDto } from "shared/dto";
import { slugify } from "shared/utils/slugify";

import { SongFileService } from "./song-file.service";

@Injectable()
export class SongService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly songFileService: SongFileService,
  ) {}

  private async getSongOrFail(slug: string) {
    const song = await this.prismaService.song.findUnique({
      where: { slug },
      include: { album: true, artist: true },
    });

    if (!song) {
      throw new NotFoundException(`Song with slug ${slug} not found`);
    }

    return song;
  }

  async findAll(pageOptions: PageOptionsDto) {
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
      this.prismaService.song.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          title: order,
        },
        include: {
          album: true,
          artist: true,
        },
      }),
      this.prismaService.song.count({ where }),
    ]);

    const pageMeta = new PageMetaDto(pageOptions, count);

    return new PageDto(items, pageMeta);
  }

  async findById(slug: string) {
    return await this.getSongOrFail(slug);
  }

  async create(dto: CreateSongDto, file: Express.Multer.File) {
    const album = await this.prismaService.album.findUnique({
      where: { slug: dto.album },
    });

    if (!album) {
      throw new NotFoundException("Album not found");
    }

    const key = await this.songFileService.upload(dto.title, album.url, file);

    try {
      return await this.prismaService.song.create({
        data: {
          title: dto.title,
          duration: dto.duration,
          fileUrl: key,
          albumId: album.id,
          artistId: album.artistId,
          slug: slugify(dto.title),
        },
        include: {
          album: true,
          artist: true,
        },
      });
    } catch (error) {
      await this.songFileService.delete(key);
      throw error;
    }
  }

  async update(slug: string, dto: UpdateSongDto) {
    return this.prismaService.song.update({
      where: { slug },
      data: dto,
      include: { album: true, artist: true },
    });
  }

  async delete(slug: string) {
    const song = await this.getSongOrFail(slug);

    await this.songFileService.delete(song.fileUrl);

    return this.prismaService.song.delete({
      where: { slug },
      include: { artist: true, album: true },
    });
  }
}
