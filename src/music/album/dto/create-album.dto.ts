import { ApiProperty } from "@nestjs/swagger";
import { AlbumType } from "@prisma/client";
import { IsDateString, IsEnum, IsNotEmpty, IsString } from "class-validator";

export class CreateAlbumDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: "The Nothing" })
  title: string;

  @IsNotEmpty()
  @IsDateString()
  @ApiProperty()
  releaseDate: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: "Warner Music ©" })
  copyright: string;

  @IsNotEmpty()
  @IsEnum(AlbumType)
  @ApiProperty({ example: "ALBUM" })
  type: AlbumType;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: "Warner Music" })
  recordLabel: string;
}
