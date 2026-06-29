import Button from "@/components/ui/button";
import Collapse from "@/components/ui/collapse";
import ArrowRight from "@/components/ui/icons/ArrowRight";
import PricingCart from "@/components/ui/pricingCart";
import { getTranslations, Link } from "@/i18n";
import Pricing from "../home/components/Pricing";

const PricingScene: any = async () => {
  const t = await getTranslations();

  return (
    <div className="relative w-full">
      <Pricing className="bg-purpleExtraLight" />
      <section className="w-full py-[112px] bg-white md:py-[60px] sm:py-[60px]">
        <div className="max-w-content mx-auto px-layoutLeftRight md:px-layoutLeftRight_md sm:px-layoutLeftRight_sm">
          <div className="flex justify-between gap-24 md:gap-12 sm:flex-col sm:items-center sm:gap-12">
            <div className="w-[45%] flex flex-col items-start justify-between sm:w-full">
              <div>
                <h3>{t("landingPricing.faq.title")}</h3>
                <p className="mt-6 text-greyPrimary">{t("landingPricing.faq.title")}</p>
              </div>
              <Button className="sm:mt-10" iconRight={<ArrowRight />}>
                {t("landingPricing.faq.btn")}
              </Button>
            </div>
            <div className="w-[55%] flex flex-col gap-4 sm:w-full">
              <Collapse initial title={t("landingPricing.faq.items.1.title")}>
                <p>{t("landingPricing.faq.items.1.text")}</p>
              </Collapse>
              <Collapse title={t("landingPricing.faq.items.2.title")}>
                <p>{t("landingPricing.faq.items.2.text")}</p>
              </Collapse>
              <Collapse title={t("landingPricing.faq.items.3.title")}>
                <p>{t("landingPricing.faq.items.3.text")}</p>
              </Collapse>
              <Collapse title={t("landingPricing.faq.items.4.title")}>
                <p>{t("landingPricing.faq.items.4.text")}</p>
              </Collapse>
              <Collapse title={t("landingPricing.faq.items.5.title")}>
                <p>{t("landingPricing.faq.items.5.text")}</p>
              </Collapse>
            </div>
          </div>
        </div>
      </section>
      <section className="w-full py-[112px] bg-white sm:py-[80px]">
        <div className="max-w-content mx-auto px-layoutLeftRight md:px-layoutLeftRight_md sm:px-layoutLeftRight_sm">
          <div className="py-20 px-5 flex flex-col items-center rounded-xl text-center bg-purplePrimary sm:py-16">
            <h3 className="text-white">{t("landingPricing.purpleSection.title")}</h3>
            <p className="mt-6 text-center text-white">
              {t("landingPricing.purpleSection.title")}
            </p>
            <Link href="/contact">
              <Button className="mt-9" variant="dark">
                {t("landingPricing.purpleSection.btn")}
              </Button>
            </Link>
          </div>
        </div>
      </section>
      <div className="w-full h-[80px] bg-darkPrimary"></div>
    </div>
  );
};

export default PricingScene;
