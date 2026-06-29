import { cn } from "@/utils/cn";
import React from "react";

const CheckmarkCircle = ({ className }: { className?: string }) => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("stroke-greyPrimary", className)}
    >
      <g id="Icon/checkmark-circle-02">
        <path
          id="Vector"
          d="M18.3346 9.99999C18.3346 5.39761 14.6036 1.66666 10.0013 1.66666C5.39893 1.66666 1.66797 5.39761 1.66797 9.99999C1.66797 14.6023 5.39893 18.3333 10.0013 18.3333C14.6036 18.3333 18.3346 14.6023 18.3346 9.99999Z"
          stroke=""
          strokeWidth="1.5"
        />
        <path
          id="Vector_2"
          d="M6.66797 10.4167L8.7513 12.5L13.3346 7.5"
          stroke=""
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
};

export default CheckmarkCircle;
