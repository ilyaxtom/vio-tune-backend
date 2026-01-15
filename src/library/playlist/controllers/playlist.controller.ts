import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

import type { RequestWithUser } from "auth/interfaces";
import { AddItemDto } from "library/playlist/dto/add-item.dto";
import { CreatePlaylistDto } from "library/playlist/dto/create-playlist.dto";
import { PlaylistResponseInterceptor } from "library/playlist/interceptors/playlist-response.interceptor";
import {
  PlaylistItemService,
  PlaylistService,
} from "library/playlist/services";
import { PageOptionsDto } from "shared/dto";

@ApiTags("Playlists")
@Controller("playlists")
export class PlaylistController {
  constructor(
    private readonly playlistService: PlaylistService,
    private readonly playlistItemService: PlaylistItemService,
  ) {}

  @Get()
  getPlaylists(@Body() pageOptions: PageOptionsDto) {
    return this.playlistService.getPlaylists(pageOptions);
  }

  @Get("me")
  @UseGuards(AuthGuard("jwt"))
  getUserPlaylists(@Req() req: RequestWithUser) {
    return this.playlistService.getUserPlaylists(req.user.id);
  }

  @Get(":id")
  @UseInterceptors(PlaylistResponseInterceptor)
  getPlaylist(@Param("id") id: string) {
    return this.playlistService.getPlaylistById(id);
  }

  @Post()
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth("access-token")
  createPlaylist(@Body() dto: CreatePlaylistDto, @Req() req: RequestWithUser) {
    return this.playlistService.create(dto, req.user.id);
  }

  @Post(":id/songs")
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth("access-token")
  addItemToPlaylist(
    @Body() dto: AddItemDto,
    @Param("id") playlistId: string,
    @Req() req: RequestWithUser,
  ) {
    return this.playlistItemService.addItemToPlaylist(
      dto,
      playlistId,
      req.user.id,
    );
  }

  @Delete(":id/songs/:songId")
  removeItemFromPlaylist(
    @Param("id") id: string,
    @Param("songId") songId: string,
  ) {
    return this.playlistItemService.removeItemFromPlaylist(id, songId);
  }
}
