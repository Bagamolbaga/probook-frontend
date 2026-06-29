import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import flags from "react-phone-number-input/flags";
import Image from "next/image";

const LANGS = [
  {
    id: "en",
    text: "En",
  },
  {
    id: "th",
    text: "Thai",
  },
];

import i18nConfig from "@/i18n/config"
import { useChangeLanguage } from "@/hooks/useChangeLanguage";

const ChangeLanguage = () => {
  const {language, changeLanguage} = useChangeLanguage()

  return (
    <div className="relative flex items-center rounded-[24px] border-2 border-greyBackground bg-white overflow-x-hidden">
      {i18nConfig.locales.map((t) => {
        return (
          <div
            key={t.id}
            className={cn(
              "relative z-10 py- px-2 flex items-center gap-1 text-sm font-bold rounded-[24px] cursor-pointer text-nowrap",
              {
                "text-white": language === t.id,
                " text-greyPrimary transition-colors hover:text-purplePrimary":
                language !== t.id,
              }
            )}
            onClick={() => {
              changeLanguage(t.id);
            }}
          >
            <div className="w-[28px] h-[28px] rounded-xl overflow-hidden sm:size-[24px]">
              <Image
                width={30}
                height={30}
                src={`https://flagsapi.com/${t.iconFlagId.toUpperCase()}/flat/64.png`}
                alt={t.name}
              />
            </div>
            {t.name}
            {language === t.id && (
              <motion.div
                initial
                layoutId="background"
                className="absolute -z-[1] top-0 left-0 w-full h-full rounded-[24px] bg-purplePrimary"
              ></motion.div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ChangeLanguage;
