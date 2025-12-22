import { IsOptional } from "class-validator";

export class UpdateArtistDto {
  @IsOptional()
  name?: string;

  @IsOptional()
  country?: string;
}
