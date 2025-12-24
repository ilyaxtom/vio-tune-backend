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
import { ApiResponse, ApiTags } from "@nestjs/swagger";

import { RequiredImagePipe } from "minio/pipes/required-image.pipe";
import { FileUpload } from "music/artist/decorators/file-upload.decorator";
import { CreateArtistDto } from "music/artist/dto/create-artist.dto";
import { ArtistResponseDto } from "music/artist/dto/response.dto";
import { UpdateArtistDto } from "music/artist/dto/update-artist.dto";
import { PaginatedResponseInterceptor } from "music/artist/interceptors/paginated-response/paginated-response.interceptor";
import { ResponseInterceptor } from "music/artist/interceptors/response/response.interceptor";
import { ValidateArtworkPipe } from "music/artist/pipes/validate-artwork/validate-artwork.pipe";
import { ArtistService } from "music/artist/services/artist/artist.service";
import { PageDto } from "shared/dto/page.dto";
import { PageOptionsDto } from "shared/dto/page-options.dto";

@ApiTags("Artists")
@Controller("artists")
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @Get()
  @UseInterceptors(PaginatedResponseInterceptor)
  @ApiResponse({
    status: 200,
    description: "Artists retrieved successfully",
    type: PageDto<ArtistResponseDto>,
  })
  getArtists(@Query() pageOptions: PageOptionsDto) {
    return this.artistService.findAll(pageOptions);
  }

  @Get(":slug")
  @UseInterceptors(ResponseInterceptor)
  @ApiResponse({
    status: 200,
    description: "Artist retrieved successfully",
    type: ArtistResponseDto,
  })
  @ApiResponse({ status: 404, description: "Artist not found" })
  getArtistById(@Param("slug") slug: string) {
    return this.artistService.findBySlug(slug);
  }

  @Post()
  @UseInterceptors(FileInterceptor("artwork"), ResponseInterceptor)
  @FileUpload("artwork")
  @ApiResponse({ status: 201, description: "Artist created successfully" })
  createArtist(
    @Body() createArtistDto: CreateArtistDto,
    @UploadedFile(RequiredImagePipe, ValidateArtworkPipe)
    file: Express.Multer.File,
  ) {
    return this.artistService.create(createArtistDto, file);
  }

  @Patch(":slug")
  @UseInterceptors(ResponseInterceptor)
  @FileUpload("artwork", false)
  @ApiResponse({ status: 200, description: "Artist updated successfully" })
  @ApiResponse({ status: 404, description: "Artist not found" })
  updateArtist(
    @Param("slug") slug: string,
    @Body() updateArtistDto: UpdateArtistDto,
    @UploadedFile(ValidateArtworkPipe) file: Express.Multer.File,
  ) {
    return this.artistService.update(slug, updateArtistDto, file);
  }

  @Delete(":slug")
  @UseInterceptors(ResponseInterceptor)
  @ApiResponse({ status: 200, description: "Artist deleted successfully" })
  @ApiResponse({ status: 404, description: "Artist not found" })
  deleteArtist(@Param("slug") slug: string) {
    return this.artistService.delete(slug);
  }
}
