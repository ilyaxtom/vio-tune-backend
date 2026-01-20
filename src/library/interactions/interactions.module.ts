import { Module } from "@nestjs/common";

import { PrismaModule } from "prisma/prisma.module";

import { InteractionController } from "./controllers/interaction.controller";
import { LikesService } from "./services/likes.service";

@Module({
  imports: [PrismaModule],
  controllers: [InteractionController],
  providers: [LikesService],
})
export class InteractionsModule {}
