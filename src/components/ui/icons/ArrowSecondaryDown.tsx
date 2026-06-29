import { cn } from "@/utils/cn";
import React from "react";

const ArrowSecondaryDownIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="21"
      viewBox="0 0 20 21"
      fill="none"
      className={cn("stroke-greyPrimary", className)}
    >
      <path
        d="M15 8.00004C15 8.00004 11.3176 13 10 13C8.68233 13 5 8 5 8"
        stroke=""
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default ArrowSecondaryDownIcon;
