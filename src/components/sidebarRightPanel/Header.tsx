import React, { PropsWithChildren } from "react";
import { useStore } from "zustand";
import { useThemeStore } from "@/stores/theme";
import useWindowWidth from "@/hooks/useWindowWidth";
import ArrowSecondaryDownIcon from "../ui/icons/ArrowSecondaryDown";

const Header = ({ children }: PropsWithChildren) => {
  const { toggleOpenSidebar } = useStore(useThemeStore, (st) => st);
  const { deviceType } = useWindowWidth();

  return (
    <div className="w-full px-7 py-6 flex justify-between items-center  border-b border-b-greyOutline">
      {children}
      {deviceType === "tablet" && (
        <div
          className="w-9 h-9 flex justify-center items-center rounded-md cursor-pointer transition-all bg-greyPrimary/10 hover:bg-greyPrimary/20"
          onClick={toggleOpenSidebar}
        >
          <ArrowSecondaryDownIcon className="stroke-greyPrimary" />
        </div>
      )}
    </div>
  );
};

export default Header;
