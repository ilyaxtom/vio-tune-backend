import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class RegisterDto {
  @ApiProperty({ example: "johndoe", description: "Unique username" })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({
    example: "john@example.com",
    description: "User email address",
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: "password123",
    description: "User password (min 6 chars)",
    format: "password",
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;
}
