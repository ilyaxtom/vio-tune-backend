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
import {
  AlbumPaginatedResponseInterceptor,
  AlbumResponseInterceptor,
} from "music/album/interceptors";
import { AlbumService } from "music/album/services";
import { PageDto, PageOptionsDto } from "shared/dto";
import { RequiredFilePipe, ValidateArtworkPipe } from "shared/pipes";

@ApiTags("Albums")
@Controller("albums")
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @Get()
  @UseInterceptors(AlbumPaginatedResponseInterceptor)
  @ApiResponse({
    status: 200,
    description: "Albums retrieved successfully",
    type: PageDto<AlbumResponseDto>,
  })
  getAlbums(@Query() pageOptions: PageOptionsDto) {
    return this.albumService.findAll(pageOptions);
  }

  @Get(":slug")
  @UseInterceptors(AlbumResponseInterceptor)
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
  @UseInterceptors(FileInterceptor("artwork"), AlbumResponseInterceptor)
  @ApiConsumes("multipart/form-data")
  @ApiResponse({ status: 201, description: "Album created successfully" })
  createAlbum(
    @Body() createAlbumDto: CreateAlbumDto,
    @UploadedFile(RequiredFilePipe, ValidateArtworkPipe)
    file: Express.Multer.File,
  ) {
    return this.albumService.create(createAlbumDto, file);
  }

  @Patch(":slug")
  @UseInterceptors(FileInterceptor("artwork"), AlbumResponseInterceptor)
  @ApiConsumes("multipart/form-data")
  @ApiResponse({ status: 200, description: "Album updated successfully" })
  @ApiResponse({ status: 404, description: "Album not found" })
  updateAlbum(
    @Param("slug") slug: string,
    @Body() updateAlbumDto: UpdateAlbumDto,
    @UploadedFile(ValidateArtworkPipe) file: Express.Multer.File,
  ) {
    return this.albumService.update(slug, updateAlbumDto, file);
  }

  @Delete(":slug")
  @UseInterceptors(AlbumResponseInterceptor)
  @ApiResponse({ status: 200, description: "Album deleted successfully" })
  @ApiResponse({ status: 404, description: "Album not found" })
  deleteAlbum(@Param("slug") slug: string) {
    return this.albumService.delete(slug);
  }
}
