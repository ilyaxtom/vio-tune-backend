import { Module } from "@nestjs/common";

import { PrismaService } from "prisma/services/prisma.service";

import { ArtistController } from "./controllers/artist.controller";
import { ArtistService } from "./services/artist.service";

@Module({
  controllers: [ArtistController],
  providers: [ArtistService, PrismaService],
})
export class ArtistModule {}
