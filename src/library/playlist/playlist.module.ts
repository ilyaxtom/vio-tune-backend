import { Module } from "@nestjs/common";

import { PrismaModule } from "prisma/prisma.module";

import { PlaylistController } from "./controllers/playlist.controller";
import { PlaylistItemService, PlaylistService } from "./services";

@Module({
  imports: [PrismaModule],
  providers: [PlaylistService, PlaylistItemService],
  controllers: [PlaylistController],
})
export class PlaylistModule {}
