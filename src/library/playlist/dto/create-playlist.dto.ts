import { PlaylistVisibility } from "@prisma/client";
import { IsEnum, IsNotEmpty, IsString } from "class-validator";

export class CreatePlaylistDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsEnum(PlaylistVisibility)
  visibility: PlaylistVisibility;
}
