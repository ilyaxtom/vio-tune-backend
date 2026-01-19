import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";

export class SongResponseDto {
  @Exclude()
  @ApiProperty({ description: "Song ID" })
  id: string;

  @Expose()
  @ApiProperty({ example: "Without Me" })
  title: string;

  @Expose()
  @ApiProperty({ description: "Song duration in seconds", example: "290" })
  duration: number;

  @Expose()
  @ApiProperty({ description: "URL to song file" })
  fileUrl: string;

  @Expose()
  @ApiProperty({ example: "The Eminem Show" })
  album: string;

  @Expose()
  @ApiProperty({ example: "Eminem" })
  artist: string;

  @Expose()
  @ApiProperty({ description: "URL to album artwork" })
  artwork: string;

  @Expose()
  @ApiProperty({ description: "Song slug" })
  slug: string;
}
