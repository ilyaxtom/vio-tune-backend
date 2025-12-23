import { Module } from "@nestjs/common";

import { PrismaService } from "prisma/services/prisma.service";

import { ArtistController } from "./controllers/artist.controller";
import { ArtistService } from "./services/artist/artist.service";
import { ArtistArtworkService } from './services/artist-artwork/artist-artwork.service';

@Module({
  controllers: [ArtistController],
  providers: [ArtistService, PrismaService, ArtistArtworkService],
})
export class ArtistModule {}
