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

import { RequiredImagePipe } from "minio/pipes/required-image.pipe";
import { CreateArtistDto } from "music/artist/dto/create-artist.dto";
import { UpdateArtistDto } from "music/artist/dto/update-artist.dto";
import { PaginatedResponseInterceptor } from "music/artist/interceptors/paginated-response/paginated-response.interceptor";
import { ResponseInterceptor } from "music/artist/interceptors/response/response.interceptor";
import { ValidateArtworkPipe } from "music/artist/pipes/validate-artwork/validate-artwork.pipe";
import { ArtistService } from "music/artist/services/artist/artist.service";
import { PageOptionsDto } from "shared/dto/page-options.dto";

@Controller("artists")
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @Get()
  @UseInterceptors(PaginatedResponseInterceptor)
  getArtists(@Query() pageOptions: PageOptionsDto) {
    return this.artistService.findAll(pageOptions);
  }

  @Get(":slug")
  @UseInterceptors(ResponseInterceptor)
  getArtistById(@Param("slug") slug: string) {
    return this.artistService.findBySlug(slug);
  }

  @Post()
  @UseInterceptors(FileInterceptor("artwork"), ResponseInterceptor)
  createArtist(
    @Body() createArtistDto: CreateArtistDto,
    @UploadedFile(RequiredImagePipe, ValidateArtworkPipe)
    file: Express.Multer.File,
  ) {
    return this.artistService.create(createArtistDto, file);
  }

  @Patch(":slug")
  @UseInterceptors(FileInterceptor("artwork"), ResponseInterceptor)
  updateArtist(
    @Param("slug") slug: string,
    @Body() updateArtistDto: UpdateArtistDto,
    @UploadedFile(ValidateArtworkPipe) file: Express.Multer.File,
  ) {
    return this.artistService.update(slug, updateArtistDto, file);
  }

  @Delete(":slug")
  @UseInterceptors(ResponseInterceptor)
  deleteArtist(@Param("slug") slug: string) {
    return this.artistService.delete(slug);
  }
}
