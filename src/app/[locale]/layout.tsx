/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { PropsWithChildren } from "react";
import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import { Lato } from "next/font/google";

import Providers from "@/components/providers";
import getDictionary, { NextIntlClientProvider, getTranslations } from "@/i18n";
import { authOptions } from "@/lib/auth";
import { cn } from "@/utils/cn";
import Sentry from "@sentry/nextjs"

import "line-awesome/dist/line-awesome/css/line-awesome.min.css";
import "react-toastify/dist/ReactToastify.css";
import "@/styles/globals.sass";

const lato = Lato({
  weight: ["100", "300", "400", "700", "900"],
  subsets: ["latin"],
  display: "swap",
});
// const zillaSlab = Zilla_Slab({
//   weight: ["300", "400", "500", "600", "700"],
//   subsets: ["latin"],
//   display: "swap",
// });

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({
    locale: params.locale,
    namespace: "metadata",
  });

  return {
    title: t("pages.default.title"),
    description: t("pages.default.description"),
    keywords: t("pages.default.keywords"),
    robots: "index, follow",
  };
}

export default async function RootLayout({
  children,
  params,
}: PropsWithChildren<{
  params: {
    locale: string;
  };
}>) {
  const session = await getServerSession(authOptions);
  const { locale } = params;
  let dictionary: any;

  if (session?.user?.company_id) {
    Sentry.setTag("auth_user_store_id", session?.user?.company_id)
  }

  try {
    //@ts-ignore
    dictionary = await getDictionary({ locale });
  } catch (error) {
    notFound();
  }

  return (
    <html lang={locale}>
      <body className={cn(lato.className)}>
        <NextIntlClientProvider locale={locale} messages={dictionary.messages}>
          <Providers session={session}>{children}</Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
