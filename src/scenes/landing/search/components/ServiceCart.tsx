import { FC } from "react";
import Image from "next/image";
import { Link, useTranslations } from "@/i18n";
import Button from "@/components/ui/button";
import { cn } from "@/utils/cn";
import { toSlug } from "@/utils/toSlug";

type Props = {
  company: TCompany<{ price_from: string }>;
  isDark?: boolean;
};

const StoreCart: FC<Props> = ({ company, isDark }) => {
  const t = useTranslations();
  return (
    <Link
      href={`/company/${toSlug(company.name)}?storeId=${company.id}`}
      className={cn(
        "min-w-[calc(25%-15px)] w-[calc(25%-15px)] md:min-w-[calc(33.3333%-15px)] md:w-[calc(33.3333%-15px)] sm:min-w-[calc(100%-15px)] sm:w-[calc(100%-15px)] rounded-[14px] transition-all border border-[#ECECF2] hover:border-purplePrimary bg-white",
        {
          "bg-transparent border-black": isDark,
        }
      )}
    >
      <div className="h-full flex flex-col">
        <div className="relative w-full h-[240px] rounded-t-[14px] overflow-hidden">
          {company.logo ? (
            <Image
              fill
              className="w-full h-full object-cover"
              src={company.logo}
              alt={company.name}
            />
          ) : (
            <div className="w-full h-full bg-greyPrimary/50"></div>
          )}
          <div className="absolute top-4 right-4 py-3 px-4 rounded-full bg-white border-[#CFDBD5]/60">
            <p className="text-sm font-bold text-grey-800">{company.business_type}</p>
          </div>
        </div>
        <div className="p-4 flex-1 flex flex-col items-start justify-between">
          <div className="w-full mt-1">
            <p
              className={cn(
                "w-full font-bold overflow-hidden text-nowrap text-ellipsis",
                {
                  "text-white": isDark,
                }
              )}
              title={company.name}
            >
              {company.name}
            </p>
            <div className="py-3 flex items-center justify-between">
              <p
                className={cn("text-sm text-greyPrimary", {
                  "text-greyPrimary": isDark,
                })}
              >
                Price
              </p>
              <p
                className={cn("text-sm font-semibold text-darkPrimary", {
                  "text-greyPrimary": isDark,
                })}
              >
                From {company.price_from ? `฿${company.price_from}` : <span className="text-greyPrimary">No info</span>}
              </p>
            </div>
            <div className="py-3 flex items-center justify-between border-t border-greyOutlineSecondary">
              <p
                className={cn("text-sm text-greyPrimary", {
                  "text-greyPrimary": isDark,
                })}
              >
                Location
              </p>
              <p
                className={cn("text-sm font-semibold text-darkPrimary", {
                  "text-greyPrimary": isDark,
                })}
              >
                {company.city}
              </p>
            </div>
          </div>
          <div className="w-full flex mt-1">
            <Link
              href={`/company/${toSlug(company.name)}/booking-creation?storeId=${company.id}`}
              className="w-full"
            >
              <Button
                variant="outline"
                className="w-full !py-3 font-bold !rounded-full border transition-all border-purplePrimary text-purplePrimary hover:bg-purplePrimary hover:text-white"
              >
                {t("landingSearch.bookNow")}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default StoreCart;
