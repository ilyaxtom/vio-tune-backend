import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNumber, IsOptional, IsString, Min } from "class-validator";

export class UpdateSongDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ example: "Without Me" })
  title: string;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @Min(1)
  @ApiProperty({ description: "Song duration in seconds", example: "290" })
  duration: number;
}
