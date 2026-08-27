import { User } from "./user";

declare module "next-auth" {
  interface Session {
    accessToken: string;
    refreshToken: string;
    user: User | null;
    error?: "RefreshAccessTokenError";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
    user?: User;
    error?: "RefreshAccessTokenError";
  }
}
