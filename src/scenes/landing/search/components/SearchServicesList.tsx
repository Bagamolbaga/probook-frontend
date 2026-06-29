import { useTranslations } from "@/i18n";
import { formatCurrency } from "@/utils/formatCurrency";
import { Player } from "@lottiefiles/react-lottie-player";
import React, { FC } from "react";
import BlackLogoAnimation from "@/assets/lottiefiles/blackLogoAnimation.json";
import StoreCart from "./ServiceCart";

type Props = {
  companies: TCompany[];
  isLoading?: boolean;
};

const SearchServicesList: FC<Props> = ({ companies, isLoading }) => {
  const t = useTranslations();
  return (
    <div className="w-full">
      <h5 className="font-bold text-left">
        {t("landingSearch.results")} (
        {formatCurrency(companies.length || 0, {
          locale: "en",
          style: "decimal",
        })}
        )
      </h5>
      {isLoading ? (
        <div className="w-full flex flex-col items-center justify-center">
          <Player
            src={BlackLogoAnimation}
            autoplay
            loop
            className="w-[200px] h-[200px]"
          />
        </div>
      ) : (
        <div className="mt-5 w-full flex items-stretch gap-5">
          {companies.map((c) => (
            <StoreCart key={c.id} company={c as TCompany<{ price_from: string }>} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchServicesList;
