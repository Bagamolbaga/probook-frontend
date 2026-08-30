/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { notFound } from "next/navigation";
import { getRequestConfig } from "next-intl/server";
import { createSharedPathnamesNavigation } from "next-intl/navigation";
import i18nConfig from "./config";
import { AbstractIntlMessages } from "next-intl";
import { enUS, ru, th } from "date-fns/locale";

export { NextIntlClientProvider, useTranslations, useLocale } from "next-intl";

export { getTranslations } from "next-intl/server";

export const DATE_FNS_LOCALES = {
  en: enUS,
  ru,
};

export default getRequestConfig(async ({ locale }) => {
  if (!i18nConfig.locales.map((i) => i.id).includes(locale)) notFound();

  return {
    messages: (await import(`./dictionaries/${locale}/index.ts`)).default as
      AbstractIntlMessages | undefined,
  };
});

export const { Link, redirect, usePathname, useRouter } = createSharedPathnamesNavigation(
  {
    locales: i18nConfig.locales.map((i) => i.id),
  }
);
