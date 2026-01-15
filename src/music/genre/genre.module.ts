import { Module } from "@nestjs/common";

import { PrismaModule } from "prisma/prisma.module";

import { GenreController } from "./controllers/genre.controller";
import { GenreService } from "./services/genre.service";

@Module({
  imports: [PrismaModule],
  providers: [GenreService],
  controllers: [GenreController],
})
export class GenreModule {}
