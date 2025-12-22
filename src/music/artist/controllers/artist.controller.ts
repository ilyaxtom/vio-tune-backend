import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";

import { CreateArtistDto } from "music/artist/dto/CreateArtist.dto";
import { UpdateArtistDto } from "music/artist/dto/UpdateArtist.dto";
import { ArtistService } from "music/artist/services/artist.service";

@Controller("artists")
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @Get()
  getArtists() {
    return this.artistService.findAll();
  }

  @Get(":id")
  getArtistById(@Param("id") id: string) {
    return this.artistService.findById(id);
  }

  @Post()
  createArtist(@Body() createArtistDto: CreateArtistDto) {
    return this.artistService.create(createArtistDto);
  }

  @Patch(":id")
  updateArtist(
    @Param("id") id: string,
    @Body() updateArtistDto: UpdateArtistDto,
  ) {
    return this.artistService.update(id, updateArtistDto);
  }

  @Delete(":id")
  deleteArtist(@Param("id") id: string) {
    return this.artistService.delete(id);
  }
}
