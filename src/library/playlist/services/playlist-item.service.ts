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

  private async getPlaylistOrFail(slug: string) {
    const playlist = await this.prismaService.playlist.findUnique({
      where: { slug },
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

  async addItemToPlaylist({ songId }: AddItemDto, slug: string, user: User) {
    const playlist = await this.getPlaylistOrFail(slug);

    this.canModify(user, playlist);

    const song = await this.getSongOrFail(songId);

    await this.prismaService.playlistItem.create({
      data: { playlistId: playlist.id, songId },
    });

    return { message: `${song.title} added to ${playlist.title} playlist` };
  }

  async removeItemFromPlaylist(slug: string, songId: string, user: User) {
    const playlist = await this.getPlaylistOrFail(slug);

    this.canModify(user, playlist);

    await this.getSongOrFail(songId);

    const item = await this.prismaService.playlistItem.findUnique({
      where: { playlistId_songId: { playlistId: playlist.id, songId } },
    });

    if (!item) {
      throw new BadRequestException("Song is not in playlist");
    }

    await this.prismaService.playlistItem.delete({
      where: { playlistId_songId: { playlistId: playlist.id, songId } },
    });

    return { message: "Song removed from playlist" };
  }
}
