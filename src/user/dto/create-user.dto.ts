import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateUserDto {
  @IsOptional()
  @IsString()
  username?: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  passwordHash?: string;

  @IsOptional()
  isVerified?: boolean;

  @IsOptional()
  @IsString()
  verificationToken?: string;
}
