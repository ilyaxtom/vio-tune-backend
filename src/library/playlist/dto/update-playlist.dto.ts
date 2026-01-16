import { PlaylistVisibility } from "@prisma/client";
import { IsEnum, IsOptional, IsString } from "class-validator";

export class UpdatePlaylistDto {
  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsEnum(PlaylistVisibility)
  visibility: PlaylistVisibility;
}
