import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

import type { RequestWithUser } from "auth/interfaces";
import {
  AddItemDto,
  CreatePlaylistDto,
  UpdatePlaylistDto,
} from "library/playlist/dto";
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
      req.user,
    );
  }

  @Patch(":id")
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth("access-token")
  updatePlaylist(
    @Body() dto: UpdatePlaylistDto,
    @Param("id") playlistId: string,
    @Req() req: RequestWithUser,
  ) {
    return this.playlistService.update(playlistId, req.user, dto);
  }

  @Delete(":id")
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth("access-token")
  removePlaylist(@Param("id") playlistId: string, @Req() req: RequestWithUser) {
    return this.playlistService.delete(playlistId, req.user);
  }

  @Delete(":id/songs/:songId")
  removeItemFromPlaylist(
    @Param("id") id: string,
    @Param("songId") songId: string,
    @Req() req: RequestWithUser,
  ) {
    return this.playlistItemService.removeItemFromPlaylist(
      id,
      songId,
      req.user,
    );
  }
}
