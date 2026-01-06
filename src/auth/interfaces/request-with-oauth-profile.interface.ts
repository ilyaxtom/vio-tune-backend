import { OAuthProvider } from "@prisma/client";
import { Request } from "express";

export interface RequestWithOAuthProfile extends Request {
  user: {
    email: string;
    providerId: string;
    provider: OAuthProvider;
  };
}
