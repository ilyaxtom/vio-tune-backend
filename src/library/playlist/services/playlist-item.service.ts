import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Playlist, Role as UserRole, User } from "@prisma/client";

import { AddItemDto } from "library/playlist/dto/add-item.dto";
import { PrismaService } from "prisma/services/prisma.service";

@Injectable()
export class PlaylistItemService {
  constructor(private readonly prismaService: PrismaService) {}

  private async getPlaylistOrFail(id: string) {
    const playlist = await this.prismaService.playlist.findUnique({
      where: { id },
    });

    if (!playlist) {
      throw new NotFoundException("Playlist not found");
    }

    return playlist;
  }

  private async getSongOrFail(id: string) {
    const song = await this.prismaService.song.findUnique({ where: { id } });

    if (!song) {
      throw new NotFoundException("Song not found");
    }

    return song;
  }

  private canModify(user: User, playlist: Playlist) {
    const isAdmin = user.role === UserRole.ADMIN;
    const isOwner = user.id === playlist.userId;

    if (!isAdmin && !isOwner) {
      throw new ForbiddenException("Insufficient permissions");
    }
  }

  async addItemToPlaylist(
    { songId }: AddItemDto,
    playlistId: string,
    user: User,
  ) {
    const playlist = await this.getPlaylistOrFail(playlistId);

    this.canModify(user, playlist);

    const song = await this.getSongOrFail(songId);

    await this.prismaService.playlistItem.create({
      data: { playlistId, songId },
    });

    return { message: `${song.title} added to ${playlist.title} playlist` };
  }

  async removeItemFromPlaylist(playlistId: string, songId: string, user: User) {
    const playlist = await this.getPlaylistOrFail(playlistId);

    this.canModify(user, playlist);

    await this.getSongOrFail(songId);

    const item = await this.prismaService.playlistItem.findUnique({
      where: { playlistId_songId: { playlistId, songId } },
    });

    if (!item) {
      throw new BadRequestException("Song is not in playlist");
    }

    await this.prismaService.playlistItem.delete({
      where: { playlistId_songId: { playlistId, songId } },
    });

    return { message: "Song removed from playlist" };
  }
}
