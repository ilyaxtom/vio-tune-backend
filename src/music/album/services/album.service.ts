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
      }),
      this.prismaService.album.count({ where }),
    ]);

    const pageMeta = new PageMetaDto(pageOptions, count);

    return new PageDto(items, pageMeta);
  }

  async findBySlug(slug: string) {
    return await this.getAlbumOrFail(slug);
  }

  async create(createAlbumDto: CreateAlbumDto, artwork: Express.Multer.File) {
    const slug = slugify(createAlbumDto.title);

    const key = await this.albumArtworkService.upload(
      createAlbumDto.title,
      artwork,
    );

    return await this.prismaService.album.create({
      data: {
        ...createAlbumDto,
        releaseDate: new Date(createAlbumDto.releaseDate),
        slug,
        artwork: key,
        url: "#",
        artistId: "7b62c939-56fa-44b0-a962-3ee3a77115f6",
      },
    });
  }

  async update(
    slug: string,
    updateAlbumDto: UpdateAlbumDto,
    artwork: Express.Multer.File,
  ) {
    const album = await this.getAlbumOrFail(slug);

    const updates = { ...updateAlbumDto };

    if (artwork) {
      const key = await this.albumArtworkService.upload(
        updateAlbumDto.title || album.title,
        artwork,
      );

      Object.assign(updates, { artwork: key });

      await this.albumArtworkService.delete(album.artwork);
    }

    if (updates.releaseDate) {
      Object.assign(updates, { releaseDate: new Date(updates.releaseDate) });
    }

    return this.prismaService.album.update({ where: { slug }, data: updates });
  }

  async delete(slug: string) {
    const album = await this.getAlbumOrFail(slug);

    await this.albumArtworkService.delete(album.artwork);

    return this.prismaService.album.delete({ where: { slug } });
  }
}
