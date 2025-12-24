import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { nanoid } from "nanoid";
import slugify from "slugify";

import { CreateArtistDto } from "music/artist/dto/create-artist.dto";
import { UpdateArtistDto } from "music/artist/dto/update-artist.dto";
import { ArtistArtworkService } from "music/artist/services/artist-artwork/artist-artwork.service";
import { PrismaService } from "prisma/services/prisma.service";
import { PageDto } from "shared/dto/page.dto";
import { PageMetaDto } from "shared/dto/page-meta.dto";
import { PageOptionsDto } from "shared/dto/page-options.dto";

@Injectable()
export class ArtistService {
  private readonly logger = new Logger(ArtistService.name);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly artistArtworkService: ArtistArtworkService,
  ) {}

  private async getArtistOrFail(slug: string) {
    const artist = await this.prismaService.artist.findUnique({
      where: { slug },
    });

    if (!artist) {
      throw new NotFoundException("Artist not found");
    }

    return artist;
  }

  async findAll(pageOptions: PageOptionsDto) {
    const { page, limit, search, order } = pageOptions;

    const where = search
      ? {
          name: {
            contains: search,
            mode: Prisma.QueryMode.insensitive,
          },
        }
      : undefined;

    const [items, count] = await this.prismaService.$transaction([
      this.prismaService.artist.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          name: order,
        },
      }),
      this.prismaService.artist.count({ where }),
    ]);

    const pageMeta = new PageMetaDto(pageOptions, count);

    return new PageDto(items, pageMeta);
  }

  async findBySlug(slug: string) {
    const artist = await this.prismaService.artist.findUnique({
      where: { slug },
    });

    if (!artist) {
      throw new NotFoundException("Artist not found");
    }

    return artist;
  }

  async create(createArtistDto: CreateArtistDto, artwork: Express.Multer.File) {
    const baseSlug = slugify(createArtistDto.name, {
      lower: true,
      strict: true,
    });
    const slug = `${baseSlug}-${nanoid(6)}`;

    const key = await this.artistArtworkService.upload(
      createArtistDto.name,
      artwork,
    );

    return await this.prismaService.artist.create({
      data: { ...createArtistDto, slug, artwork: key },
    });
  }

  async update(
    slug: string,
    updateArtistDto: UpdateArtistDto,
    artwork: Express.Multer.File,
  ) {
    const artist = await this.getArtistOrFail(slug);

    const updates = { ...updateArtistDto };

    if (artwork) {
      const key = await this.artistArtworkService.upload(
        updateArtistDto.name || artist.name,
        artwork,
      );

      Object.assign(updates, { artwork: key });

      await this.artistArtworkService.delete(artist.artwork);
    }

    return this.prismaService.artist.update({ where: { slug }, data: updates });
  }

  async delete(slug: string) {
    const artist = await this.getArtistOrFail(slug);

    await this.artistArtworkService.delete(artist.artwork);

    return this.prismaService.artist.delete({ where: { slug } });
  }
}
