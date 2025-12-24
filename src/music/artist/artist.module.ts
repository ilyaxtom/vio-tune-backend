import { Module } from "@nestjs/common";

import { PrismaService } from "prisma/services/prisma.service";

import { ArtistController } from "./controllers/artist.controller";
import { ArtistArtworkService, ArtistService } from "./services";

@Module({
  controllers: [ArtistController],
  providers: [ArtistService, PrismaService, ArtistArtworkService],
})
export class ArtistModule {}
