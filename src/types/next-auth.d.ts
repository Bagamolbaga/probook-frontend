import { User } from "./user";

declare module "next-auth" {
  interface Session {
    access_token: string;
    refresh_token: string;
    scope: string;
    user: User | null;
  }
}
