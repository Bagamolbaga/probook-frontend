import axios from "axios";
import type { AuthOptions, User as NextAuthUser } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import type { User } from "@/types/user";

export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: "Bearer";
  user: User;
};

type BackendAuthUser = NextAuthUser & {
  accessToken: string;
  refreshToken: string;
  accessTokenExpires: number;
  backendUser: User;
};

type BackendJwt = {
  accessToken?: string;
  refreshToken?: string;
  accessTokenExpires?: number;
  user?: User;
  error?: "RefreshAccessTokenError";
};

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

async function exchangeGoogleToken(idToken: string): Promise<AuthResponse> {
  const { data } = await axios.post<AuthResponse>(`${apiUrl}/auth/google`, { idToken });
  return data;
}

function toBackendAuthUser(data: AuthResponse): BackendAuthUser {
  return {
    id: String(data.user.id),
    name: data.user.fullName || `${data.user.firstName} ${data.user.lastName}`.trim(),
    email: data.user.email,
    image: data.user.avatar || null,
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
    accessTokenExpires: Date.now() + data.expiresIn * 1000,
    backendUser: data.user,
  };
}

async function refreshAccessToken(token: BackendJwt): Promise<BackendJwt> {
  if (!token.refreshToken) return { ...token, error: "RefreshAccessTokenError" };

  try {
    const { data } = await axios.post<AuthResponse>(`${apiUrl}/auth/refresh`, {
      refreshToken: token.refreshToken,
    });

    return {
      ...token,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      accessTokenExpires: Date.now() + data.expiresIn * 1000,
      user: data.user,
      error: undefined,
    };
  } catch {
    return { ...token, error: "RefreshAccessTokenError" };
  }
}

export const authOptions: AuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  pages: { signIn: "/sign-in", newUser: "/sign-up" },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      authorization: {
        params: {
          prompt: "select_account",
          access_type: "offline",
          response_type: "code",
        },
      },
      httpOptions: { timeout: 10000 },
      async profile(_profile, tokens) {
        if (!tokens.id_token) {
          throw new Error("Google did not return an ID token");
        }

        return toBackendAuthUser(await exchangeGoogleToken(tokens.id_token));
      },
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
        invitationToken: { type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.password) return null;

        try {
          const { data } = credentials.invitationToken
            ? await axios.post<AuthResponse>(
                `${apiUrl}/auth/invitations/${credentials.invitationToken}/register-password`,
                { password: credentials.password }
              )
            : await axios.post<AuthResponse>(`${apiUrl}/auth/login`, {
                email: credentials.email,
                password: credentials.password,
              });

          return toBackendAuthUser(data);
        } catch {
          return null;
        }
      },
    }),
  ],
  cookies: {
    sessionToken: {
      name: "access_token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure:
          process.env.NODE_ENV === "production" &&
          process.env.DISABLE_COOKIE_SECURE !== "true",
      },
    },
  },
  session: { strategy: "jwt", maxAge: 60 * 60 * 10 },
  events: {
    async signOut({ token }) {
      const backendToken = token as BackendJwt;
      if (!backendToken.refreshToken) return;

      try {
        await axios.post(`${apiUrl}/auth/logout`, {
          refreshToken: backendToken.refreshToken,
        });
      } catch {
        // The local NextAuth session is still removed if the backend is unavailable.
      }
    },
  },
  callbacks: {
    async jwt({ token, user, account, trigger }) {
      const backendToken = token as BackendJwt;

      if (
        user &&
        (account?.provider === "credentials" || account?.provider === "google")
      ) {
        const backendUser = user as BackendAuthUser;
        return {
          ...backendToken,
          accessToken: backendUser.accessToken,
          refreshToken: backendUser.refreshToken,
          accessTokenExpires: backendUser.accessTokenExpires,
          user: backendUser.backendUser,
          error: undefined,
        };
      }

      if (trigger === "update" && backendToken.accessToken) {
        try {
          const { data } = await axios.get<{ user: User }>(`${apiUrl}/auth/me`, {
            headers: { Authorization: `Bearer ${backendToken.accessToken}` },
          });
          return { ...backendToken, user: data.user, error: undefined };
        } catch {
          return { ...backendToken, error: "RefreshAccessTokenError" };
        }
      }

      if (
        backendToken.accessToken &&
        backendToken.accessTokenExpires &&
        Date.now() < backendToken.accessTokenExpires - 30_000
      ) {
        return backendToken;
      }

      if (backendToken.refreshToken) return refreshAccessToken(backendToken);

      return backendToken;
    },
    async session({ token, session }) {
      const backendToken = token as BackendJwt;
      session.accessToken = backendToken.accessToken || "";
      session.refreshToken = backendToken.refreshToken || "";
      session.user = backendToken.user || null;
      session.error = backendToken.error;
      return session;
    },
  },
};
