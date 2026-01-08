import { ApiProperty } from "@nestjs/swagger";
import { AlbumType } from "@prisma/client";
import { IsDate, IsEnum, IsOptional, IsString } from "class-validator";

export class UpdateAlbumDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ example: "The Nothing" })
  title?: string;

  @IsOptional()
  @IsDate()
  @ApiProperty()
  releaseDate?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: "Warner Music ©" })
  copyright?: string;

  @IsOptional()
  @IsEnum(AlbumType)
  @ApiProperty({ example: "ALBUM" })
  type?: AlbumType;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: "Warner Music" })
  recordLabel?: string;
}
