/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-floating-promises */
"use client";

import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import { MAIN_NAVIGATION } from "@/constants/navigations";
import { useStore } from "zustand";
import { Link, usePathname, useTranslations } from "@/i18n";
import clsx from "clsx";

import { useThemeStore } from "@/stores/theme";
import useWindowWidth from "@/hooks/useWindowWidth";
import NavItem from "./NavItem";
import LogoFullIcon from "../ui/icons/LogoFull";
import LogoWithoutSymbolsIcon from "../ui/icons/LogoWithoutSymbols";

import MockAvatar from "@/assets/home_page_section_7_3.png";
import { useMemo } from "react";
import { useGetCompanyDetailsQuery } from "@/api/queries/company";
import { useGetCompanyId } from "@/hooks/useGetCompanyId";

const Sidebar = () => {
  const t = useTranslations();
  const { data: session } = useSession();
  const { deviceType } = useWindowWidth();
  const sidebarIsOpen = useStore(useThemeStore, (state) => state.sidebarIsOpen);
  const {companyId} = useGetCompanyId()

  const getCompanyDetailsQuery = useGetCompanyDetailsQuery({
    companyId
  });

  const isMobileOrTablet = deviceType === "mobile" || deviceType === "tablet";

  const MAIN_NAVIGATION_i18n = useMemo(
    () =>
      MAIN_NAVIGATION.map((i) => ({
        ...i,
        label: t(`navigation.sidebar.${i.i18_id}` as any),
      })),
    []
  );

  const companyDetails = useMemo(
    () => getCompanyDetailsQuery.data,
    [getCompanyDetailsQuery.data]
  );

  console.log({user: session?.user});

  return (
    <nav className="h-full pt-[26px] pb-[28px] flex flex-col">
      <Link href="/" className="relative h-[30px] mb-[26px]">
        <LogoFullIcon
          className={clsx("absolute top-0 left-[30px] w-fit h-full transition-all", {
            "opacity-100": sidebarIsOpen,
            "opacity-0 pointer-events-none": !sidebarIsOpen,
            "hidden pointer-events-none": isMobileOrTablet,
          })}
        />
        <LogoWithoutSymbolsIcon
          className={clsx("absolute top-0 left-[30px] w-fit h-full transition-all", {
            "opacity-0 pointer-events-none": sidebarIsOpen,
            "opacity-100": !sidebarIsOpen,
            "!opacity-100 ": isMobileOrTablet,
          })}
        />
      </Link>
      <div className="h-full flex flex-col justify-between">
        <div className="flex flex-col">
          {MAIN_NAVIGATION_i18n.map((i) => (
            <NavItem key={i.path} {...i} />
          ))}
        </div>

        <NavItem
          label={companyDetails?.name || ""}
          path="/account"
          isActive={usePathname().includes("/account")}
          icon={() =>
            companyDetails?.logo ? (
              <Image
                className="w-full h-full object-cover"
                src={session?.user?.avatar || ""}
                width={30}
                height={30}
                alt={companyDetails.name}
              />
            ) : null
          }
        />
      </div>
    </nav>
  );
};

export default Sidebar;
