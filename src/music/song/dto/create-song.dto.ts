import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString, Min } from "class-validator";

export class CreateSongDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: "Without Me" })
  title: string;

  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @Min(1)
  @ApiProperty({ description: "Song duration in seconds", example: "290" })
  duration: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: "Album title", example: "The Eminem Show" })
  album: string;
}
