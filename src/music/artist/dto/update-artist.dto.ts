import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class UpdateArtistDto {
  @IsOptional()
  @ApiPropertyOptional({
    description: "The artist's name",
    example: "Marilyn Manson",
  })
  name?: string;

  @IsOptional()
  @ApiPropertyOptional({
    description: "The artist's country",
    example: "USA",
  })
  country?: string;
}
