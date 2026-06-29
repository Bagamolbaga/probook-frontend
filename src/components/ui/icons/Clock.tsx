import { cn } from "@/utils/cn";
import React from "react";

const ClockIcon = ({ className }: { className?: string }) => {
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
        d="M9.99996 18.8337C14.6023 18.8337 18.3333 15.1027 18.3333 10.5003C18.3333 5.89795 14.6023 2.16699 9.99996 2.16699C5.39759 2.16699 1.66663 5.89795 1.66663 10.5003C1.66663 15.1027 5.39759 18.8337 9.99996 18.8337Z"
        stroke=""
        strokeWidth="1.5"
      />
      <path
        d="M10 7.16699V10.5003L11.6667 12.167"
        stroke=""
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default ClockIcon;
