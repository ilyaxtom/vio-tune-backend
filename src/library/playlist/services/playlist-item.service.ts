import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";

import { AddItemDto } from "library/playlist/dto/add-item.dto";
import { PrismaService } from "prisma/services/prisma.service";

@Injectable()
export class PlaylistItemService {
  constructor(private readonly prismaService: PrismaService) {}

  async addItemToPlaylist(
    { songId }: AddItemDto,
    playlistId: string,
    userId: string,
  ) {
    const [playlist, song] = await this.prismaService.$transaction([
      this.prismaService.playlist.findUnique({ where: { id: playlistId } }),
      this.prismaService.song.findUnique({ where: { id: songId } }),
    ]);

    if (!playlist) {
      throw new BadRequestException("Playlist not found");
    }

    if (playlist.userId !== userId) {
      throw new UnauthorizedException();
    }

    if (!song) {
      throw new BadRequestException("Song not found");
    }

    await this.prismaService.playlistItem.create({
      data: { playlistId, songId },
    });

    return `${song.title} added to ${playlist.title} playlist`;
  }

  async removeItemFromPlaylist(playlistId: string, songId: string) {
    await this.prismaService.playlistItem.delete({
      where: { playlistId_songId: { playlistId, songId } },
    });

    return "Song removed from playlist";
  }
}
