"use client";
/* eslint-disable @typescript-eslint/no-unused-vars */

import { PropsWithChildren } from "react";
import { Variants, motion } from "framer-motion";
import clsx from "clsx";
import { useStore } from "zustand";

import { useThemeStore } from "@/stores/theme";
import useWindowWidth from "@/hooks/useWindowWidth";
import Sidebar from "@/components/sidebar";
import SidebarRightPanel from "@/components/sidebarRightPanel";
import MobileSidebar from "@/components/sidebar/MobileSidebar";

export default function DashboardLayout({ children }: PropsWithChildren) {
  const { sidebarIsOpen, toggleOpenSidebar } = useStore(useThemeStore, (state) => state);
  const { deviceType } = useWindowWidth();
  const isMobileOrTablet = deviceType === "mobile" || deviceType === "tablet";
  const isMobile = deviceType === "mobile";

  const variantsSidebar: Variants = {
    open: {
      width: deviceType === "desctop" ? 242 : 84,
      transition: {
        ease: "easeInOut",
      },
    },
    closed: {
      width: 84,
      transition: {
        ease: "easeInOut",
      },
    },
  };

  const variantsSidebarSecondary: Variants = {
    open: {
      width: 386,
      display: "block",
      pointerEvents: "auto",
      transition: {
        ease: "easeInOut",
      },
    },
    closed: {
      width: 0,
      display: "none",
      pointerEvents: "none",
      transition: {
        ease: "easeInOut",
      },
    },
  };

  const variantsContent: Variants = {
    open: {
      paddingLeft: isMobileOrTablet ? 84 : isMobile ? 0 : 242,
      transition: {
        ease: "easeInOut",
      },
    },
    closed: {
      paddingLeft: isMobileOrTablet ? 84 : isMobile ? 0 : 470,
      transition: {
        ease: "easeInOut",
      },
    },
  };

  const toggleOpenSidebarHandler = () => {
    toggleOpenSidebar();
    // setSidebarIsOpen((prev) => !prev);
  };
  // const closeMobileMenuHandler = () => setSidebarIsOpen(false);

  if (isMobile) {
    return (
      <div className="relative w-full flex">
        {children}
        <MobileSidebar />
      </div>
    );
  }

  return (
    <div className="relative w-full flex">
      <div className="fixed top-0 left-0 h-full z-50 flex">
        <motion.div
          className="relative h-full bg-darkPrimary"
          initial={false}
          animate={sidebarIsOpen && deviceType === "desctop" ? "open" : "closed"}
          hidden={isMobile}
          variants={variantsSidebar}
        >
          <Sidebar />
        </motion.div>
        <motion.div
          className="relative h-full bg-white"
          initial={false}
          animate={sidebarIsOpen ? "closed" : "open"}
          variants={variantsSidebarSecondary}
          hidden
        >
          <SidebarRightPanel />
        </motion.div>
      </div>
      <motion.div
        className={clsx("min-h-[100vh] w-full", {})}
        initial={false}
        animate={sidebarIsOpen ? "open" : "closed"}
        variants={variantsContent}
      >
        {children}
      </motion.div>
    </div>
  );
}
