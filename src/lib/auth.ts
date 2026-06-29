/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/require-await */
import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import axios from "axios";
import { User } from "@/types/user";

type LoginRes = {
  access_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
  refresh_token: string;
};

export const authOptions: AuthOptions = {
  // trustHost: true,
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/sign-in",
    newUser: "/sign-up",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
      httpOptions: {
        timeout: 10000
      }
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID || "",
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "credentials",
      type: "credentials",
      credentials: {
        email: { type: "text" },
        password: { type: "password" },
      },
      async authorize(credentials) {
        if (credentials) {
          const sendData = {
            grant_type: "password",
            username: credentials.email,
            password: credentials.password,
            client_id: process.env.CLIENT_ID_BUSINESS,
            client_secret: process.env.CLIENT_SECRET_BUSINESS,
          };

          const { data } = await axios.post<LoginRes>(
            `${process.env.NEXT_PUBLIC_API_URL}/o/token/`,
            sendData,
            {
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
              },
            }
          );

          return data as any;
        }

        return null;
      },
    }),
  ],
  cookies: {
    sessionToken: {
      name: "access_token",
      options: {
        httpOnly: true,
        sameSite: "strict",
        path: "/",
        secure: process.env.DISABLE_COOKIE_SECURE === "true" ? false : true,
      },
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 10,
  },
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === "google" || account?.provider === "facebook") {
        if (!account.access_token || !profile) {
          return false;
        }

        return true;
      }

      return true;
    },
    //@ts-ignore
    async jwt({ trigger, token, user, account, profile }) {

      if (user) {
        token.access_token = (user as any).access_token as string;
        token.refresh_token = (user as any).refresh_token as string;
        token.scope = (user as any).scope as string;
        token.user = (user as any).user as User;
        token.exp = 36000;

        if (account?.provider === "google" || account?.provider === "facebook") {
          token.user = {
            ...user,
            first_name: (profile as any).given_name,
            last_name: (profile as any).family_name,
          };
        }
      }

      if (trigger === "update") {
        const { data } = await axios.get<{ user: User }>(
          `${process.env.NEXT_PUBLIC_API_URL}/users/session`,
          {
            headers: {
              Authorization: `Bearer ${(token as any).access_token}`,
            },
          }
        );


        token.user = data.user;
      }

      return token;
    },

    async session({ token, session }) {

      if (token) {
        // if ("access_token" in token) {
        session.access_token = token.access_token as string;
        session.refresh_token = token.refresh_token as string;
        session.scope = token.scope as string;
        session.user = token.user as User;
        // }
      }

      return session;
    },
  },
};
