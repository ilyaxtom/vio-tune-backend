import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";

import { CreateSongDto, UpdateSongDto } from "music/song/dto";
import { PrismaService } from "prisma/services/prisma.service";
import { PageDto, PageMetaDto, PageOptionsDto } from "shared/dto";

import { SongFileService } from "./song-file.service";

@Injectable()
export class SongService {
  private readonly logger = new Logger(SongService.name);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly songFileService: SongFileService,
  ) {}

  private async getSongOrFail(id: string) {
    const song = await this.prismaService.song.findUnique({
      where: { id: id },
      include: { album: true, artist: true },
    });

    if (!song) {
      throw new NotFoundException(`Song with id ${id} not found`);
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

  async findById(id: string) {
    return await this.getSongOrFail(id);
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

  async update(id: string, dto: UpdateSongDto) {
    return this.prismaService.song.update({
      where: { id },
      data: dto,
      include: { album: true, artist: true },
    });
  }

  async delete(id: string) {
    const song = await this.getSongOrFail(id);

    await this.songFileService.delete(song.fileUrl);

    return this.prismaService.song.delete({
      where: { id },
      include: { artist: true, album: true },
    });
  }
}
