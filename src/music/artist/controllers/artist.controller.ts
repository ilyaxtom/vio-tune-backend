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
import { ApiResponse, ApiTags } from "@nestjs/swagger";

import { FileUpload } from "music/artist/decorators/file-upload.decorator";
import {
  ArtistResponseDto,
  CreateArtistDto,
  UpdateArtistDto,
} from "music/artist/dto";
import {
  PaginatedResponseInterceptor,
  ResponseInterceptor,
} from "music/artist/interceptors";
import { ArtistService } from "music/artist/services";
import { PageDto, PageOptionsDto } from "shared/dto";
import { RequiredFilePipe, ValidateArtworkPipe } from "shared/pipes";

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
  @UseInterceptors(ResponseInterceptor)
  @FileUpload("artwork")
  @ApiResponse({ status: 201, description: "Artist created successfully" })
  createArtist(
    @Body() createArtistDto: CreateArtistDto,
    @UploadedFile(RequiredFilePipe, ValidateArtworkPipe)
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
