import { usePathname, useRouter } from "@/i18n";
import i18nConfig from "@/i18n/config";
import { useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

type Languages = typeof i18nConfig.locales;

export const useChangeLanguage = () => {
  const pathname = usePathname();
  const router = useRouter();
  const params = useSearchParams();
  const locale = useLocale();

  const [language, setLanguage] = useState(locale);

  useEffect(() => {
    setLanguage(locale);
  }, []);

  const changeLanguage = (lang: Languages[0]["id"]) => {
    setLanguage(lang);

    router.replace(params.size > 0 ? `${pathname}?${params.toString()}` : pathname, {
      locale: lang,
    });
  };

  return { language, changeLanguage };
};
