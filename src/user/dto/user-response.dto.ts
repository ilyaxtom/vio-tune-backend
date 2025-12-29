import { ApiProperty } from "@nestjs/swagger";
import { Role } from "@prisma/client";
import { Exclude, Expose } from "class-transformer";

export class UserResponseDto {
  @Exclude()
  id: string;

  @ApiProperty({ example: "John" })
  @Expose()
  firstName: string;

  @ApiProperty({ example: "Doe" })
  @Expose()
  lastName: string;

  @ApiProperty({ example: "johndoe" })
  @Expose()
  username: string;

  @Exclude()
  passwordHash: string;

  @ApiProperty({ example: "john@example.com" })
  @Expose()
  email: string;

  @ApiProperty({ example: "USA", required: false })
  @Expose()
  country: string;

  @ApiProperty({ example: "en", required: false })
  @Expose()
  language: string;

  @ApiProperty({ example: "Bio description" })
  @Expose()
  description: string;

  @ApiProperty({ example: "user", enum: ["user", "artist", "admin"] })
  @Expose()
  role: Role;
}
