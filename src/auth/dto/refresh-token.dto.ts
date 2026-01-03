export class RefreshTokenDto {
  userId: string;
  hash: string;
  expiresAt: Date;
}
