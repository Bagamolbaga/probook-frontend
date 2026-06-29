"use client";

import Link from "next/link";
import LogoIcon from "@/components/ui/icons/LogoFull";
import Button from "@/components/ui/button";
import Facebook from "@/components/ui/icons/Facebook";
import XTwitter from "@/components/ui/icons/XTwitter";
import LinkedIn from "@/components/ui/icons/LinkedIn";
import Instagram from "@/components/ui/icons/Instagram";
import Line from "@/components/ui/icons/Line";
import { useTranslations } from "next-intl";

const LandingFooter = () => {
  const t = useTranslations();
  return (
    <footer className="relative z-20 w-full px-layoutLeftRight md:px-layoutLeftRight_md sm:px-layoutLeftRight_sm bg-darkPrimary text-white">
      <div className="w-content h-full mx-auto">
        <div className="h-full pt-10 flex justify-center items-start gap-[100px] sm:flex-col sm:items-center md:gap-[60px] sm:gap-[50px] sm:text-center">
          <div className="w-[190px] cursor-pointer md:w-[140px] sm:w-[200px]">
            <Link href="/">
              <LogoIcon className="w-full" />
            </Link>
            <Link href="/contact">
              <Button
                variant="transparent"
                className="w-full mt-[52px] border !rounded-full"
              >
                Connect with us
              </Button>
            </Link>
          </div>

          {/* <div className="flex flex-col gap-4 sm:mt-5">
            <p className="mb-1 text-lg font-semibold text-white">About Bowers</p>
            <Link className="transition-all hover:text-purplePrimary" href="/">
              Careers
            </Link>
            <Link className="transition-all hover:text-purplePrimary" href="/">
              Customer Support
            </Link>
            <Link className="transition-all hover:text-purplePrimary" href="/">
              Blog
            </Link>
            <Link className="transition-all hover:text-purplePrimary" href="/">
              Sitemap
            </Link>
          </div> */}

          {/* <div className=" flex flex-col gap-4">
            <p className="mb-1 text-lg font-semibold text-white">
              {t("navigation.landing.footer.forBusiness")}
            </p> */}
          {/* <Link className="transition-all hover:text-purplePrimary" href="/">
              For partner
            </Link> */}
          {/* <Link className="transition-all hover:text-purplePrimary" href="/pricing">
              {t("navigation.landing.footer.pricing")}
            </Link> */}
          {/* <Link className="transition-all hover:text-purplePrimary" href="/">
              Support
            </Link> */}
          {/* </div> */}

          <div className=" flex flex-col gap-4">
            <p className="mb-1 text-lg font-semibold text-white">
              {t("navigation.landing.footer.legal")}
            </p>
            <Link
              className="transition-all hover:text-purplePrimary"
              href="/privacy-policy"
            >
              {t("navigation.landing.footer.privacy-policy")}
            </Link>
            <Link
              className="transition-all hover:text-purplePrimary"
              href="/terms-of-use"
            >
              Terms of Use
            </Link>
            <Link
              className="transition-all hover:text-purplePrimary"
              href="/terms-of-service"
            >
              Terms of Service
            </Link>
          </div>

          <div className="w-fit flex flex-col items-center gap-4">
            <p className="mb-1 text-lg font-semibold text-white">
              Connect
            </p>
            <Link
              href="https://www.facebook.com/profile.php?id=61567849531148"
              target="_blank"
            >
              <Facebook />
            </Link>{" "}
            <Link href="https://lin.ee/4QVTuS6" target="_blank">
              <Line className="w-8 h-8" />
            </Link>{" "}
            <Link href="https://www.linkedin.com/company/104975009" target="_blank">
              <LinkedIn />
            </Link>{" "}
            <Link href="https://www.instagram.com/bowers.app" target="_blank">
              <Instagram />
            </Link>
          </div>
        </div>
        <div className="mt-[74px] pb-[50px]">
          <p className="text-center text-white">
            {t("navigation.landing.footer.allRightReserved")}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
