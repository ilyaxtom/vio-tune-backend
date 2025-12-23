import { Exclude, Expose } from "class-transformer";

export class ArtistResponseDto {
  @Exclude()
  id: string;

  @Expose()
  name: string;

  @Expose()
  artwork: string;

  @Expose()
  country: string;

  @Exclude()
  updatedAt: Date;
}
