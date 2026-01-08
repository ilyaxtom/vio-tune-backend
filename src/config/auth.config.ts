import { registerAs } from "@nestjs/config";

export default registerAs("auth", () => ({
  bcryptSaltRounds: Number(process.env.BCRYPT_SALT_ROUNDS),

  refreshToken: {
    ttlMs: Number(process.env.REFRESH_TOKEN_TTL_MS),
    expiresIn: process.env.REFRESH_JWT_EXPIRES_IN,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict" as const,
      path: "/",
      maxAge: Number(process.env.REFRESH_TOKEN_TTL_MS),
    },
  },

  jwt: {
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
  },
}));
