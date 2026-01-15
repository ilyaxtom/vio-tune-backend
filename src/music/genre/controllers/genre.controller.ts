import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { Genre } from "@prisma/client";

import { CreateGenreDto } from "music/genre/dto/create-genre.dto";
import { GenreService } from "music/genre/services/genre.service";
import { PageDto, PageOptionsDto } from "shared/dto";

@ApiTags("Genres")
@Controller("genres")
export class GenreController {
  constructor(private readonly genreService: GenreService) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: "Genres retrieved successfully",
    type: PageDto<Genre>,
  })
  getGenres(@Query() pageOptions: PageOptionsDto) {
    return this.genreService.findAll(pageOptions);
  }

  @Post()
  @ApiResponse({ status: 201, description: "Genre created successfully" })
  createGenre(@Body() dto: CreateGenreDto) {
    return this.genreService.create(dto);
  }

  @Delete(":id")
  @ApiResponse({ status: 200, description: "Genre deleted successfully" })
  @ApiResponse({ status: 404, description: "Genre not found" })
  deleteGenre(@Param("id") id: string) {
    return this.genreService.delete(id);
  }
}
