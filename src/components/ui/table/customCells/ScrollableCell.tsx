import { PropsWithChildren } from "react";
import { cn } from "@/utils/cn";
import scrollStyles from "@/styles/scrollbar.module.sass";

const ScrollableCell = ({ children }: PropsWithChildren) => {
  return (
    <div
      className={cn("w-full h-[calc(100%-5px)] flex items-center overflow-x-auto", scrollStyles.CustomScrollbar_Horizontal)}
    >
      {children}
    </div>
  );
};

export default ScrollableCell;
