import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { Role as UserRole, User } from "@prisma/client";

import { AddItemDto } from "library/playlist/dto/add-item.dto";
import { PrismaService } from "prisma/services/prisma.service";

@Injectable()
export class PlaylistItemService {
  constructor(private readonly prismaService: PrismaService) {}

  async addItemToPlaylist(
    { songId }: AddItemDto,
    playlistId: string,
    user: User,
  ) {
    const [playlist, song] = await this.prismaService.$transaction([
      this.prismaService.playlist.findUnique({ where: { id: playlistId } }),
      this.prismaService.song.findUnique({ where: { id: songId } }),
    ]);

    if (!playlist) {
      throw new BadRequestException("Playlist not found");
    }

    if (!song) {
      throw new BadRequestException("Song not found");
    }

    const isAdmin = user.role === UserRole.ADMIN;
    const isOwner = user.id === playlist.userId;

    if (!isAdmin && !isOwner) {
      throw new ForbiddenException(
        "You don't have permission to add item to this playlist",
      );
    }

    await this.prismaService.playlistItem.create({
      data: { playlistId, songId },
    });

    return `${song.title} added to ${playlist.title} playlist`;
  }

  async removeItemFromPlaylist(playlistId: string, songId: string, user: User) {
    const [playlist, song] = await this.prismaService.$transaction([
      this.prismaService.playlist.findUnique({ where: { id: playlistId } }),
      this.prismaService.song.findUnique({ where: { id: songId } }),
    ]);

    if (!playlist) {
      throw new BadRequestException("Playlist not found");
    }

    if (!song) {
      throw new BadRequestException("Song not found");
    }

    const isAdmin = user.role === UserRole.ADMIN;
    const isOwner = user.id === playlist.userId;

    if (!isAdmin && !isOwner) {
      throw new ForbiddenException(
        "You don't have permission to delete item from this playlist",
      );
    }

    await this.prismaService.playlistItem.delete({
      where: { playlistId_songId: { playlistId, songId } },
    });

    return "Song removed from playlist";
  }
}
