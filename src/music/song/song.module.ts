import { Module } from "@nestjs/common";

import { MinioModule } from "minio/minio.module";
import { PrismaService } from "prisma/services/prisma.service";

import { SongController } from "./controllers/song.controller";
import { SongFileService, SongService } from "./services";

@Module({
  imports: [MinioModule],
  controllers: [SongController],
  providers: [SongService, SongFileService, PrismaService],
})
export class SongModule {}
