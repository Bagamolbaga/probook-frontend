/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";
import { withAuth } from "next-auth/middleware";
import createMiddleware from "next-intl/middleware";
import i18nConfig from "@/i18n/config";
import { PUBLIC_ROUTES } from "./constants/navigations";

const intlMiddleware = createMiddleware({
  locales: i18nConfig.locales.map((i) => i.id),
  localePrefix: "always",
  defaultLocale: i18nConfig.defaultLocale,
});

const locales = i18nConfig.locales.map((locale) => locale.id);
const localePrefixRegex = new RegExp(`^/(?:${locales.join("|")})(?=/|$)`, "i");

const normalizePathname = (pathname: string) => {
  const pathnameWithoutLocale = pathname.replace(localePrefixRegex, "") || "/";

  return pathnameWithoutLocale.length > 1
    ? pathnameWithoutLocale.replace(/\/$/, "")
    : pathnameWithoutLocale;
};

const isPublicPathname = (pathname: string) => {
  const normalizedPathname = normalizePathname(pathname);

  return (
    PUBLIC_ROUTES.includes(normalizedPathname) ||
    normalizedPathname === "/about" ||
    normalizedPathname === "/support" ||
    normalizedPathname.startsWith("/company/") ||
    normalizedPathname.startsWith("/recovery-password/") ||
    normalizedPathname.startsWith("/sign-up/")
  );
};

const authMiddleware = withAuth(
  // Note that this callback is only invoked if
  // the `authorized` callback has returned `true`
  // and not for pages listed in `pages`.
  function onSuccess(req) {
    return intlMiddleware(req);
  },
  {
    callbacks: {
      authorized: ({ token }) => Boolean(token?.accessToken && !token.error),
    },
    pages: {
      signIn: "/sign-in",
    },
    cookies: {
      sessionToken: {
        name: "access_token",
      },
    },
  }
);

export default function middleware(req: NextRequest) {
  if (isPublicPathname(req.nextUrl.pathname)) {
    return intlMiddleware(req);
  }

  return (authMiddleware as any)(req);
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
