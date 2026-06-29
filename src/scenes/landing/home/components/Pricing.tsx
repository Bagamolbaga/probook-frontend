"use client";

import PriceCart from "@/components/ui/pricingCart";
import { cn } from "@/utils/cn";
import { useTranslations } from "next-intl";
import { useMemo } from "react";

const Pricing = ({className}: {className?: string}) => {
  const t = useTranslations();
  const includeItems1 = useMemo(
    () =>
      ["1", "2", "3"].map((key) =>
        t(`landingHome.pricingSection.items.item1.includeItems.${key}` as any)
      ),
    []
  );
  const includeItems2 = useMemo(
    () =>
      ["1", "2", "3", "4"].map((key) =>
        t(`landingHome.pricingSection.items.item2.includeItems.${key}` as any)
      ),
    []
  );
  const includeItems3 = useMemo(
    () =>
      ["1", "2", "3", "4", "5"].map((key) =>
        t(`landingHome.pricingSection.items.item3.includeItems.${key}` as any)
      ),
    []
  );

  return (
    <section className={cn("w-full py-[96px] pb-[360px] bg-greyBackgroundLight md:py-[60px] sm:py-[60px]", className)}>
      <div className="max-w-content mx-auto px-layoutLeftRight md:px-layoutLeftRight_md sm:px-layoutLeftRight_sm text-center">
        <h3>{t("landingHome.pricingSection.title")}</h3>
        <p className="mt-6 text-greyPrimary">{t("landingHome.pricingSection.text")}</p>
        <div className="mt-16 flex justify-center items-stretch gap-5 sm:mt-12 sm:flex-col sm:items-center sm:gap-5">
          <PriceCart.LandingVariant
            variant="default"
            planName={t("landingHome.pricingSection.items.item1.planName")}
            mainPrice="฿3390"
            mainPricePeriod={t("landingHome.pricingSection.items.item1.month")}
            includesLabel={t("landingHome.pricingSection.items.item1.whatsIncluded")}
            desc={t("landingHome.pricingSection.items.item1.text")}
            planItems={includeItems1}
          />
          <PriceCart.LandingVariant
            variant="primary"
            planName={t("landingHome.pricingSection.items.item2.planName")}
            mainPrice="฿5450"
            mainPricePeriod={t("landingHome.pricingSection.items.item2.month")}
            includesLabel={t("landingHome.pricingSection.items.item2.whatsIncluded")}
            planItems={includeItems2}
            desc={t("landingHome.pricingSection.items.item2.text")}
          />
          <PriceCart.LandingVariant
            variant="default"
            planName={t("landingHome.pricingSection.items.item3.planName")}
            mainPrice={t("landingHome.pricingSection.items.item3.customPrice")}
            mainPricePeriod={t("landingHome.pricingSection.items.item3.month")}
            includesLabel={t("landingHome.pricingSection.items.item3.whatsIncluded")}
            planItems={includeItems3}
            desc={t("landingHome.pricingSection.items.item3.text")}
          />
        </div>
      </div>
    </section>
  );
};

export default Pricing;
