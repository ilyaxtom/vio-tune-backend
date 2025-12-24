import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateArtistDto {
  @IsNotEmpty()
  @ApiProperty({
    description: "The artist's name",
    example: "Marilyn Manson",
  })
  name: string;

  @IsNotEmpty()
  @ApiProperty({
    description: "The artist's country",
    example: "USA",
  })
  country: string;
}
