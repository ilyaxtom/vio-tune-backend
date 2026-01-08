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

import { CreateAlbumDto, UpdateAlbumDto } from "music/album/dto";
import { AlbumResponseDto } from "music/album/dto/response.dto";
import { AlbumService } from "music/album/services";
import { PageDto, PageOptionsDto } from "shared/dto";

@ApiTags("Albums")
@Controller("albums")
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: "Albums retrieved successfully",
    type: PageDto<AlbumResponseDto>,
  })
  getAlbums(@Query() pageOptions: PageOptionsDto) {
    return this.albumService.findAll(pageOptions);
  }

  @Get(":slug")
  @ApiResponse({
    status: 200,
    description: "Album retrieved successfully",
    type: AlbumResponseDto,
  })
  @ApiResponse({ status: 404, description: "Album not found" })
  getAlbum(@Param("slug") slug: string) {
    return this.albumService.findBySlug(slug);
  }

  @Post()
  @UseInterceptors(FileInterceptor("artwork"))
  @ApiConsumes("multipart/form-data")
  @ApiResponse({ status: 201, description: "Album created successfully" })
  createAlbum(
    @Body() createAlbumDto: CreateAlbumDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.albumService.create(createAlbumDto, file);
  }

  @Patch(":slug")
  @UseInterceptors(FileInterceptor("artwork"))
  @ApiConsumes("multipart/form-data")
  @ApiResponse({ status: 200, description: "Album updated successfully" })
  @ApiResponse({ status: 404, description: "Album not found" })
  updateAlbum(
    @Param("slug") slug: string,
    @Body() updateAlbumDto: UpdateAlbumDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.albumService.update(slug, updateAlbumDto, file);
  }

  @Delete(":slug")
  @ApiResponse({ status: 200, description: "Album deleted successfully" })
  @ApiResponse({ status: 404, description: "Album not found" })
  deleteAlbum(@Param("slug") slug: string) {
    return this.albumService.delete(slug);
  }
}
