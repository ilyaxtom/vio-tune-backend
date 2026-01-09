import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";

import { CreateAlbumDto, UpdateAlbumDto } from "music/album/dto";
import { PrismaService } from "prisma/services/prisma.service";
import { PageDto, PageMetaDto, PageOptionsDto } from "shared/dto";
import { slugify } from "shared/utils/slugify";

import { AlbumArtworkService } from "./album-artwork.service";

@Injectable()
export class AlbumService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly albumArtworkService: AlbumArtworkService,
  ) {}

  private async getAlbumOrFail(slug: string) {
    const album = await this.prismaService.album.findUnique({
      where: { slug },
      include: { artist: true, genre: true },
    });

    if (!album) {
      throw new NotFoundException("Album not found");
    }

    return album;
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
      this.prismaService.album.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          title: order,
        },
        include: {
          artist: true,
          genre: true,
        },
      }),
      this.prismaService.album.count({ where }),
    ]);

    const pageMeta = new PageMetaDto(pageOptions, count);

    return new PageDto(items, pageMeta);
  }

  async findBySlug(slug: string) {
    return await this.getAlbumOrFail(slug);
  }

  async create(dto: CreateAlbumDto, artwork: Express.Multer.File) {
    const [artist, genre] = await Promise.all([
      this.prismaService.artist.findUnique({
        where: { slug: dto.artist },
      }),
      dto.genre
        ? this.prismaService.genre.findUnique({
            where: { name: dto.genre ?? "" },
          })
        : null,
    ]);

    if (!artist) {
      throw new NotFoundException("Artist not found");
    }

    if (dto.genre && !genre) {
      throw new NotFoundException("Genre not found");
    }

    const slug = slugify(dto.title);

    const key = await this.albumArtworkService.upload(dto.title, artwork);

    return await this.prismaService.album.create({
      data: {
        title: dto.title,
        slug,
        releaseDate: new Date(dto.releaseDate),
        artwork: key,
        url: "#",
        artistId: artist.id,
        genreId: genre?.id,
        copyright: dto.copyright,
        type: dto.type,
        recordLabel: dto.recordLabel,
      },
      include: {
        artist: true,
        genre: true,
      },
    });
  }

  async update(
    slug: string,
    dto: UpdateAlbumDto,
    artwork: Express.Multer.File,
  ) {
    const album = await this.getAlbumOrFail(slug);

    const updates = { ...dto };

    if (artwork) {
      const key = await this.albumArtworkService.upload(
        dto.title || album.title,
        artwork,
      );

      Object.assign(updates, { artwork: key });

      await this.albumArtworkService.delete(album.artwork);
    }

    if (updates.releaseDate) {
      Object.assign(updates, { releaseDate: new Date(updates.releaseDate) });
    }

    return this.prismaService.album.update({
      where: { slug },
      data: updates,
      include: { artist: true, genre: true },
    });
  }

  async delete(slug: string) {
    const album = await this.getAlbumOrFail(slug);

    await this.albumArtworkService.delete(album.artwork);

    return this.prismaService.album.delete({
      where: { slug },
      include: { artist: true, genre: true },
    });
  }
}
