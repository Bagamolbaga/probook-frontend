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

const authMiddleware = withAuth(
  // Note that this callback is only invoked if
  // the `authorized` callback has returned `true`
  // and not for pages listed in `pages`.
  function onSuccess(req) {
    return intlMiddleware(req);
  },
  {
    // callbacks: {
    //   authorized: ({ token }) => {
    //     return token !== null;
    //   },
    // },
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
  const publicPathnameRegex = RegExp(
    `^(/(${i18nConfig.locales.map((i) => i.id).join("|")}))?(${PUBLIC_ROUTES.flatMap(
      (p) => (p === "/" ? ["", "/"] : p)
    ).join("|")})/?$`,
    "i"
  );

  const [slash, ...publicRoutesWithoutSlash] = PUBLIC_ROUTES
  const isPublicPage =
    publicPathnameRegex.test(req.nextUrl.pathname) ||
    publicRoutesWithoutSlash.some((r) => req.nextUrl.pathname.includes(r));
    return intlMiddleware(req);

  if (isPublicPage) {
    return intlMiddleware(req);
  } else {
    return (authMiddleware as any)(req);
  }
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
