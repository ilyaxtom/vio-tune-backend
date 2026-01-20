import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsString } from "class-validator";

import { Like } from "../interfaces/like.interface";

export class LikeDto {
  @ApiProperty({
    description: "The type of resource you want to like",
    enum: Like,
    example: Like.SONG,
  })
  @IsNotEmpty()
  @IsEnum(Like)
  type: Like;

  @ApiProperty({
    description: "The unique slug of the resource",
    example: "midnight-city-sdlkm2",
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  slug: string;
}
