import { Module } from "@nestjs/common";

import { MinioModule } from "./minio/minio.module";
import { MusicModule } from "./music/music.module";
import { PrismaModule } from "./prisma/prisma.module";

@Module({
  imports: [PrismaModule, MusicModule, MinioModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
