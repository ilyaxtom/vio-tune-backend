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

  @Get(":slug")
  @UseInterceptors(PlaylistResponseInterceptor)
  getPlaylist(@Param("slug") slug: string) {
    return this.playlistService.findBySlug(slug);
  }

  @Post()
  @Authenticated()
  createPlaylist(@Body() dto: CreatePlaylistDto, @CurrentUser() user: User) {
    return this.playlistService.create(dto, user.id);
  }

  @Post(":slug/songs")
  @Authenticated()
  addItemToPlaylist(
    @Body() dto: AddItemDto,
    @Param("slug") slug: string,
    @CurrentUser() user: User,
  ) {
    return this.playlistItemService.addItemToPlaylist(dto, slug, user);
  }

  @Patch(":slug")
  @Authenticated()
  updatePlaylist(
    @Body() dto: UpdatePlaylistDto,
    @Param("slug") slug: string,
    @CurrentUser() user: User,
  ) {
    return this.playlistService.update(slug, user, dto);
  }

  @Delete(":slug")
  @Authenticated()
  removePlaylist(@Param("slug") slug: string, @CurrentUser() user: User) {
    return this.playlistService.delete(slug, user);
  }

  @Delete(":slug/songs/:songId")
  @Authenticated()
  removeItemFromPlaylist(
    @Param("slug") slug: string,
    @Param("songId") songId: string,
    @CurrentUser() user: User,
  ) {
    return this.playlistItemService.removeItemFromPlaylist(slug, songId, user);
  }
}
