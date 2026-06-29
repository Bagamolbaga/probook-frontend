import { FC } from "react";
import Image from "next/image";
import { Link, useTranslations } from "@/i18n";
import Button from "@/components/ui/button";
import { cn } from "@/utils/cn";
import { toSlug } from "@/utils/toSlug";

type Props = {
  company: TCompany<{price_from: string, price_to: string}>;
  isDark?: boolean;
  setHover?: (val?: number) => void;
};

const StoreCard: FC<Props> = ({ company, isDark, setHover }) => {
  const t = useTranslations();
  return (
    <Link
      id={`store_cart_id-${company.id}`}
      href={`/company/${toSlug(company.name)}?storeId=${company._id}`}
      className={cn(
        "flex flex-col rounded-[14px] transition-all border border-[#ECECF2] hover:border-purplePrimary bg-white",
        {
          "border-purplePrimary": isDark,
        }
      )}
      onMouseEnter={() => setHover && setHover(company.id)}
      onMouseLeave={() => setHover && setHover(undefined)}
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
          <div className="absolute top-4 right-4 py-1 px-4 rounded-full border bg-white border-purplePrimary">
            <p className="text-sm font-bold text-grey-800">{company.businessType}</p>
          </div>
        </div>
        <div className="p-4 flex-1 flex flex-col items-start justify-between">
          <div className="w-full mt-1">
            <p
              className={cn(
                "w-full font-bold overflow-hidden text-nowrap text-ellipsis",
                {}
              )}
              title={company.name}
            >
              {company.name}
            </p>
            <div className="py-3 flex items-center justify-between">
              <p className={cn("text-sm text-greyPrimary", {})}>Price</p>
              <p className={cn("text-sm font-semibold text-darkPrimary", {})}>
                {company.priceFrom && company.priceTo ? `From ฿${Number(company.priceFrom)} - To ฿${Number(company.priceTo)}` : "No info"}
              </p>
            </div>
            <div className="py-3 flex items-center justify-between border-t border-greyOutlineSecondary">
              <p className={cn("text-sm text-greyPrimary", {})}>Location</p>
              <p className={cn("text-sm font-semibold text-darkPrimary", {})}>
                {company.city}
              </p>
            </div>
          </div>
          <div className="w-full flex mt-1">
            <Link
              href={`/company/${toSlug(company.name)}/booking-creation?storeId=${company._id}`}
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

export default StoreCard;
