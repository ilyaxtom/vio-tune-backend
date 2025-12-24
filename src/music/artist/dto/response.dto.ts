import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";

export class ArtistResponseDto {
  @Exclude()
  id: string;

  @Expose()
  @ApiProperty({ example: "Coal Chamber" })
  name: string;

  @Expose()
  @ApiProperty({
    example: "https://vio-tune/artists/artworks/coal-chamber-lCdCYs",
  })
  artwork: string;

  @Expose()
  @ApiProperty({ example: "USA" })
  country: string;

  @Expose()
  @ApiProperty({ example: "coal-chamber-lCdCYs" })
  slug: string;

  @Exclude()
  updatedAt: Date;
}
