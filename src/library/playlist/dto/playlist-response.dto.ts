import { PlaylistVisibility } from "@prisma/client";
import { Exclude, Expose, Type } from "class-transformer";

export class PlaylistResponseDto {
  @Exclude()
  id: string;

  @Expose()
  title: string;

  @Expose()
  slug: string;

  @Expose()
  visibility: PlaylistVisibility;

  @Expose()
  createdAt: Date;

  @Exclude()
  userId: string;

  @Exclude()
  playlistItem: any;

  @Expose()
  @Type(() => PlaylistItem)
  songs: PlaylistItem[];
}

export class PlaylistItem {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  duration: number;

  @Expose()
  fileUrl: string;

  @Exclude()
  albumId: string;

  @Exclude()
  artistId: string;
}
