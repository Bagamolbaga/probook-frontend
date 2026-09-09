/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { FC, useMemo, useState } from "react";
import { signOut } from "next-auth/react";
import { motion, useMotionValueEvent, useScroll, Variants } from "framer-motion";
import cn from "clsx";
import { Link, usePathname, useRouter, useTranslations } from "@/i18n";

import Button from "@/components/ui/button";
import MenuIcon from "@/components/ui/icons/Menu";
import { LANDING_NAVIGATION, MAIN_NAVIGATION_ENUM } from "@/constants/navigations";
import LogoIcon from "@/components/ui/icons/LogoFull";
import ChangeLanguage from "@/components/ui/button/ChangeLanguage";
import { useAppSession } from "@/hooks/useAppSession";
import { useGetCompanyDetailsQuery } from "@/api/queries/company";
import Spinner from "@/components/ui/loaders/Spinner";
import { useGetCompanyId } from "@/hooks/useGetCompanyId";
import { isOwnerMembership } from "@/utils/permissions";

type Props = {
  color?: "dark" | "white" | "transparent";
  withLanguageSwitcher?: boolean;
  withForCustomersBtn?: boolean;
  withForBusinessBtn?: boolean;
  withUserNameBtn?: boolean;
  withMobileMenu?: boolean;
  withNavigation?: boolean;
};

export const BaseHeader: FC<Props> = ({
  color = "dark",
  withLanguageSwitcher,
  withForCustomersBtn,
  withForBusinessBtn,
  withUserNameBtn,
  withMobileMenu,
  withNavigation,
}) => {
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useAppSession();
  const [mobileMenuIsOpen, setMobileMenuIsOpen] = useState(false);
  const [isTransparent, setIsTransparent] = useState(true);
  const { companyId, activeCompany } = useGetCompanyId();

  const getCompanyDetailsQuery = useGetCompanyDetailsQuery({
    companyId,
  });

  const variants: Variants = {
    open: {
      opacity: 1,
      y: 0,
      transition: {
        ease: "easeInOut",
      },
    },
    closed: {
      opacity: 0,
      y: "-100%",
      transition: {
        ease: "easeInOut",
      },
    },
  };

  const toggleOpenMobileMenuHandler = () => setMobileMenuIsOpen((prev) => !prev);
  const closeMobileMenuHandler = () => setMobileMenuIsOpen(false);

  const isSearchPage = pathname === "/search";

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 100) {
      setIsTransparent(false);
    } else {
      setIsTransparent(true);
    }
  });

  const NAVIGATION_HEADER = useMemo(
    () =>
      LANDING_NAVIGATION.map((i) => ({
        ...i,
        label: t(`navigation.landing.header.${i.i18_id}` as any),
      })),
    []
  );

  const renderSignInOrLogoutBtn = () => {
    if (session?.user && activeCompany) {
      return (
        <Button
          variant="primary"
          rounded
          onClick={() =>
            router.push(
              isOwnerMembership(activeCompany)
                ? MAIN_NAVIGATION_ENUM["/dashboard"].path
                : MAIN_NAVIGATION_ENUM["/booking-management"].path
            )
          }
        >
          {getCompanyDetailsQuery.isPending ? (
            <Spinner className="size-4 !text-purplePrimary fill-white" />
          ) : (
            getCompanyDetailsQuery.data?.name || activeCompany.name
          )}
        </Button>
      );
    }

    if (session?.user) {
      return (
        <Button
          variant="primary"
          rounded
          onClick={() => void signOut({ callbackUrl: "/sign-in" })}
        >
          {`${(session?.user as any).name || `${session?.user.first_name} ${session?.user.last_name}`} | Log out`}
        </Button>
      );
    }

    return (
      <Link href="/sign-in">
        <Button variant="primary" rounded>
          {t("navigation.landing.header.signIn")}
        </Button>
      </Link>
    );
  };

  if (isSearchPage) {
    return null;
  }

  return (
    <header
      className={cn("fixed z-[100] w-full h-header transition-all", {
        "text-white bg-darkPrimary": color === "dark",
        "text-darkPrimary bg-white": color === "white",
        "bg-transparent": color === "transparent",
        // " bg-greyBackgroundLight": isSearchPage && !isTransparent,
        // " bg-transparent": isSearchPage && isTransparent,
      })}
    >
      <div
        className={cn(
          "relative z-20 max-w-content h-full mx-auto bg-darkPrimary px-layoutLeftRight md:px-layoutLeftRight_md sm:px-layoutLeftRight_sm",
          {
            "bg-transparent": color === "white" || color === "transparent",
          }
        )}
      >
        <div className="h-full flex justify-between items-center">
          <div
            className="w-[190px] h-10 cursor-pointer md:w-[140px] sm:w-[100px]"
            onClick={closeMobileMenuHandler}
          >
            <Link href="/">
              <LogoIcon
                className="w-full"
                fillColor={color === "white" ? "fill-darkPrimary" : undefined}
              />
            </Link>
          </div>
          {withNavigation && (
            <nav
              className={cn("flex items-center gap-6 md:gap-3 sm:hidden", {
                hidden: isSearchPage,
              })}
            >
              {NAVIGATION_HEADER.map((i) => (
                <Link
                  key={i.path}
                  href={i.path}
                  className={cn("text-base transition-colors hover:text-purplePrimary", {
                    "text-purplePrimary": pathname === i.path,
                  })}
                >
                  {i.label}
                </Link>
              ))}
            </nav>
          )}
          {(withForCustomersBtn ||
            withForBusinessBtn ||
            withLanguageSwitcher ||
            withUserNameBtn ||
            withMobileMenu) && (
            <div className="flex items-center gap-5 md:gap-3 sm:gap-3">
              {withLanguageSwitcher && <ChangeLanguage />}
              {withForCustomersBtn && (
                <Link href="/search" onClick={closeMobileMenuHandler}>
                  <Button className="" variant="dark">
                    {t("navigation.landing.header.forCustomer")}
                  </Button>
                </Link>
              )}
              {withForBusinessBtn && (
                <Link href="/">
                  <Button variant="dark-outline" rounded>
                    {t("navigation.landing.header.forBusiness")}
                  </Button>
                </Link>
              )}
              {withUserNameBtn && renderSignInOrLogoutBtn()}
              {withMobileMenu && (
                <div
                  className={cn("ignore_click hidden cursor-pointer sm:block", {})}
                  onClick={toggleOpenMobileMenuHandler}
                >
                  <MenuIcon />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {withNavigation && (
        <motion.div
          className="relative z-10 h-screen pt-5 bg-darkPrimary"
          initial={false}
          animate={mobileMenuIsOpen ? "open" : "closed"}
          variants={variants}
        >
          <nav className="flex flex-col items-center gap-6">
            {LANDING_NAVIGATION.map((i) => (
              <Link
                key={i.path}
                href={i.path}
                className={cn("text-base transition-colors hover:text-purplePrimary", {
                  "text-purplePrimary": pathname === i.path,
                })}
                onClick={closeMobileMenuHandler}
              >
                {i.label}
              </Link>
            ))}
          </nav>
        </motion.div>
      )}
    </header>
  );
};

export const BookingFlowHeader = <BaseHeader withLanguageSwitcher />;
export const LandingHeader = (
  <BaseHeader
    withLanguageSwitcher
    withForBusinessBtn
    withForCustomersBtn
    withNavigation
    withMobileMenu
    withUserNameBtn
  />
);
