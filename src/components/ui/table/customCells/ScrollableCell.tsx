import { PropsWithChildren } from "react";
import { cn } from "@/src/utils/cn";
import scrollStyles from "@/src/styles/scrollbar.module.sass";

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
