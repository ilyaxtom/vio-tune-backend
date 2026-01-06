import { OAuthProvider } from "@prisma/client";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class OAuthUserDto {
  provider: OAuthProvider;

  @IsNotEmpty()
  @IsString()
  providerId: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;
}
