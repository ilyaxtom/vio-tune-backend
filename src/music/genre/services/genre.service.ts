import {
  BadRequestException,
  Delete,
  Injectable,
  Logger,
  Param,
} from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";

import { CreateGenreDto } from "music/genre/dto/create-genre.dto";
import { PrismaService } from "prisma/services/prisma.service";
import { PageDto, PageMetaDto, PageOptionsDto } from "shared/dto";

@Injectable()
export class GenreService {
  private readonly logger = new Logger(GenreService.name);

  constructor(private readonly prismaService: PrismaService) {}

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
      this.prismaService.genre.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          name: order,
        },
      }),
      this.prismaService.genre.count({ where }),
    ]);

    const pageMeta = new PageMetaDto(pageOptions, count);

    return new PageDto(items, pageMeta);
  }

  async create(dto: CreateGenreDto) {
    return this.prismaService.genre.create({
      data: dto,
    });
  }

  async delete(id: string) {
    return this.prismaService.genre.delete({
      where: { id },
    });
  }
}
