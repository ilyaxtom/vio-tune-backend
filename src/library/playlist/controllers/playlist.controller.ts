import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import type { User } from "@prisma/client";

import { Authenticated } from "auth/decorators";
import { CurrentUser } from "auth/decorators/current-user.decorator";
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
  getPlaylists(@Query() pageOptions: PageOptionsDto) {
    return this.playlistService.findAll(pageOptions);
  }

  @Get("me")
  @Authenticated()
  getUserPlaylists(@CurrentUser() user: User) {
    return this.playlistService.findByUser(user.id);
  }

  @Get(":id")
  @UseInterceptors(PlaylistResponseInterceptor)
  getPlaylist(@Param("id") id: string) {
    return this.playlistService.findById(id);
  }

  @Post()
  @Authenticated()
  createPlaylist(@Body() dto: CreatePlaylistDto, @CurrentUser() user: User) {
    return this.playlistService.create(dto, user.id);
  }

  @Post(":id/songs")
  @Authenticated()
  addItemToPlaylist(
    @Body() dto: AddItemDto,
    @Param("id") playlistId: string,
    @CurrentUser() user: User,
  ) {
    return this.playlistItemService.addItemToPlaylist(dto, playlistId, user);
  }

  @Patch(":id")
  @Authenticated()
  updatePlaylist(
    @Body() dto: UpdatePlaylistDto,
    @Param("id") playlistId: string,
    @CurrentUser() user: User,
  ) {
    return this.playlistService.update(playlistId, user, dto);
  }

  @Delete(":id")
  @Authenticated()
  removePlaylist(@Param("id") playlistId: string, @CurrentUser() user: User) {
    return this.playlistService.delete(playlistId, user);
  }

  @Delete(":id/songs/:songId")
  @Authenticated()
  removeItemFromPlaylist(
    @Param("id") id: string,
    @Param("songId") songId: string,
    @CurrentUser() user: User,
  ) {
    return this.playlistItemService.removeItemFromPlaylist(id, songId, user);
  }
}
