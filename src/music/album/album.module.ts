import { Module } from "@nestjs/common";

import { PrismaService } from "prisma/services/prisma.service";

import { AlbumController } from "./controllers/album.controller";
import { AlbumArtworkService, AlbumService } from "./services";

@Module({
  controllers: [AlbumController],
  providers: [AlbumService, AlbumArtworkService, PrismaService],
})
export class AlbumModule {}
