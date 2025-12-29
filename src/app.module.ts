import { Module } from "@nestjs/common";

import { MinioModule } from "./minio/minio.module";
import { MusicModule } from "./music/music.module";
import { PrismaModule } from "./prisma/prisma.module";
import { UserModule } from "./user/user.module";

@Module({
  imports: [PrismaModule, MusicModule, MinioModule, UserModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
