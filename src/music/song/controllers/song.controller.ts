import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiConsumes, ApiResponse, ApiTags } from "@nestjs/swagger";

import { CreateSongDto, SongResponseDto, UpdateSongDto } from "music/song/dto";
import {
  SongPaginatedResponseInterceptor,
  SongResponseInterceptor,
} from "music/song/interceptors";
import { SongService } from "music/song/services";
import { PageDto, PageOptionsDto } from "shared/dto";
import { RequiredFilePipe } from "shared/pipes";

@ApiTags("Songs")
@Controller("songs")
export class SongController {
  constructor(private readonly songService: SongService) {}

  @Get()
  @UseInterceptors(SongPaginatedResponseInterceptor)
  @ApiResponse({
    status: 200,
    description: "Song retrieved successfully",
    type: PageDto<SongResponseDto>,
  })
  getSongs(@Query() pageOptions: PageOptionsDto) {
    return this.songService.findAll(pageOptions);
  }

  @Get(":id")
  @UseInterceptors(SongResponseInterceptor)
  @ApiResponse({
    status: 200,
    description: "Song retrieved successfully",
    type: SongResponseDto,
  })
  @ApiResponse({ status: 404, description: "Album not found" })
  getSong(@Param("id") id: string) {
    return this.songService.findById(id);
  }

  @Post()
  @UseInterceptors(FileInterceptor("file"), SongResponseInterceptor)
  @ApiConsumes("multipart/form-data")
  @ApiResponse({ status: 201, description: "Song created successfully" })
  createSong(
    @Body() dto: CreateSongDto,
    @UploadedFile(RequiredFilePipe) file: Express.Multer.File,
  ) {
    return this.songService.create(dto, file);
  }

  @Patch(":id")
  @UseInterceptors(SongResponseInterceptor)
  @ApiResponse({ status: 200, description: "Song updated successfully" })
  @ApiResponse({ status: 404, description: "Song not found" })
  updateSong(@Param("id") id: string, @Body() dto: UpdateSongDto) {
    return this.songService.update(id, dto);
  }

  @Delete(":id")
  @UseInterceptors(SongResponseInterceptor)
  @ApiResponse({ status: 200, description: "Song deleted successfully" })
  @ApiResponse({ status: 404, description: "Song not found" })
  deleteSong(@Param("id") id: string) {
    return this.songService.delete(id);
  }
}
