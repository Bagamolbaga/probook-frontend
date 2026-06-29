/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import useWindowWidth from "@/hooks/useWindowWidth";
import { Link, usePathname } from "@/i18n";
import { useThemeStore } from "@/stores/theme";
import clsx from "clsx";
import React, { FC } from "react";
import { useStore } from "zustand";

type Props = {
  mobile?: boolean;
  path: string;
  label: string;
  icon: any;
  isActive?: boolean
};

const NavItem: FC<Props> = ({ mobile, path, label, icon: Icon, isActive }) => {
  const pathname = usePathname();
  const sidebarIsOpen = useStore(useThemeStore, (state) => state.sidebarIsOpen);
  const { deviceType } = useWindowWidth();

  const isMobileOrTablet = deviceType === "mobile" || deviceType === "tablet";
  const isActiveLocal = isActive || path === pathname;

  return (
    <div
      className={clsx("relative py-2", {
        "px-[18px]": !mobile,
        "px-0": mobile,
        "after:absolute after:top-2 after:bottom-2 after:right-0 after:w-[2px] after:rounded-sm after:bg-white":
          isActiveLocal && !mobile,
        "after:absolute after:top-0 after:left-2 after:right-2 after:h-[2px] after:rounded-sm after:bg-white":
          isActiveLocal && mobile,
      })}
    >
      <Link
        href={path}
        className={clsx(
          "group/item h-12 pl-[14px] flex justify-start items-center rounded overflow-hidden sm:h-10 sm:pl-[10px]",
          {
            "bg-white text-darkPrimary": isActiveLocal && !mobile,
            "bg-transparent transition-colors text-white hover:bg-greyLight hover:text-darkPrimary":
              !isActiveLocal && !mobile,
            "pr-[10px] bg-white text-darkPrimary": isActiveLocal && mobile,
            "pr-[10px] bg-transparent transition-colors text-white hover:bg-greyLight hover:text-darkPrimary":
              !isActiveLocal && mobile,
          }
        )}
      >
        <div className="min-w-5 min-h-5 w-5 h-5 flex justify-center items-center">
          <Icon
            className={clsx("w-full h-full transition-all", {
              "stroke-darkPrimary": isActiveLocal,
              "stroke-white group-hover/item:stroke-darkPrimary": !isActiveLocal,
            })}
          />
        </div>
        {sidebarIsOpen && !isMobileOrTablet && (
          <span className="ml-3 text-nowrap">{label}</span>
        )}
      </Link>
    </div>
  );
};

export default NavItem;
