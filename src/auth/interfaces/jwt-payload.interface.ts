export interface JwtPayload {
  username: string;
  email: string;
  iat?: number;
  exp?: number;
}
