import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";

import { CreateArtistDto } from "music/artist/dto/CreateArtist.dto";
import { UpdateArtistDto } from "music/artist/dto/UpdateArtist.dto";
import { PrismaService } from "prisma/services/prisma.service";

@Injectable()
export class ArtistService {
  constructor(private readonly prismaService: PrismaService) {}

  private async handlePrismaErrors<T>(
    action: () => Promise<T>,
    notFoundMessage: string,
  ) {
    try {
      return await action();
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          throw new NotFoundException(notFoundMessage);
        }
      }

      throw error;
    }
  }

  async findAll() {
    return await this.prismaService.artist.findMany();
  }

  async findById(id: string) {
    const artist = await this.prismaService.artist.findUnique({
      where: { id },
    });

    if (!artist) {
      throw new NotFoundException("Artist not found");
    }

    return artist;
  }

  async create(createArtistDto: CreateArtistDto) {
    return await this.prismaService.artist.create({
      data: { ...createArtistDto, artwork: "#" },
    });
  }

  async update(id: string, updateArtistDto: UpdateArtistDto) {
    return this.handlePrismaErrors(
      () =>
        this.prismaService.artist.update({
          where: { id },
          data: updateArtistDto,
        }),
      "Artist not found",
    );
  }

  async delete(id: string) {
    return this.handlePrismaErrors(
      () => this.prismaService.artist.delete({ where: { id } }),
      "Artist not found",
    );
  }
}
