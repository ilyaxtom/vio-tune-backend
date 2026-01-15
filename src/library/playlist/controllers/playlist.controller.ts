import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

import type { RequestWithUser } from "auth/interfaces";
import { CreatePlaylistDto } from "library/playlist/dto/create-playlist.dto";
import { PlaylistService } from "library/playlist/services";
import { PageOptionsDto } from "shared/dto";

@ApiTags("Playlists")
@Controller("playlists")
export class PlaylistController {
  constructor(private readonly playlistService: PlaylistService) {}

  @Get()
  getPlaylists(@Body() pageOptions: PageOptionsDto) {
    return this.playlistService.getPlaylists(pageOptions);
  }

  @Get("me")
  @UseGuards(AuthGuard("jwt"))
  getUserPlaylists(@Req() req: RequestWithUser) {
    return this.playlistService.getUserPlaylists(req.user.id);
  }

  @Post()
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth("access-token")
  createPlaylist(@Body() dto: CreatePlaylistDto, @Req() req: RequestWithUser) {
    return this.playlistService.create(dto, req.user.id);
  }
}
