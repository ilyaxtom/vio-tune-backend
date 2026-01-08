import { Exclude, Expose } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { AlbumType } from "@prisma/client";

export class AlbumResponseDto {
  @Exclude()
  id: string;

  @Expose()
  @ApiProperty({ example: "The Nothing" })
  title: string;

  @Expose()
  @ApiProperty()
  releaseDate: Date;

  @Expose()
  @ApiProperty({
    example: "https://vio-tune/albums/artworks/the-nothing-lsknso",
  })
  artwork: string;

  @Expose()
  @ApiProperty({ example: "Warner Music ©" })
  copyright: string;

  @Expose()
  @ApiProperty({ example: "ALBUM" })
  type: AlbumType;

  @Expose()
  @ApiProperty({ example: "Warner Music" })
  recordLabel: string;

  @Expose()
  @ApiProperty({ example: "https://vio-tune/albums/the-nothing-lCdCYs" })
  url: string;

  @Expose()
  @ApiProperty({ example: "the-nothing-lkafj2" })
  slug: string;
}
