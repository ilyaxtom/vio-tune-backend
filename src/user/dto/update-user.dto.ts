import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class UpdateUserDto {
  @ApiPropertyOptional({ example: "John" })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  firstName?: string;

  @ApiPropertyOptional({ example: "Doe" })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  lastName?: string;

  @ApiPropertyOptional({ example: "USA" })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({ example: "English" })
  @IsOptional()
  @IsString()
  language?: string;

  @ApiPropertyOptional({ example: "Software Developer from NY" })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;
}
