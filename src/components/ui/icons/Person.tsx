import { cn } from "@/utils/cn";
import React from "react";

const PersonIcon = ({ className }: { className?: string }) => {
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
        d="M18.3346 10.5C18.3346 15.1023 14.6036 18.8333 10.0013 18.8333C5.39893 18.8333 1.66797 15.1023 1.66797 10.5C1.66797 5.89761 5.39893 2.16666 10.0013 2.16666C14.6036 2.16666 18.3346 5.89761 18.3346 10.5Z"
        stroke=""
        strokeWidth="1.5"
      />
      <path
        d="M12.2904 8.41667C12.2904 9.68233 11.2644 10.7083 9.9987 10.7083C8.73303 10.7083 7.70703 9.68233 7.70703 8.41667C7.70703 7.15102 8.73303 6.125 9.9987 6.125C11.2644 6.125 12.2904 7.15102 12.2904 8.41667Z"
        stroke=""
        strokeWidth="1.5"
      />
      <path
        d="M4.58203 16.3334L5.04903 15.5162C5.79087 14.218 7.17147 13.4167 8.66675 13.4167H11.3307C12.8259 13.4167 14.2065 14.218 14.9483 15.5162L15.4153 16.3334"
        stroke=""
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default PersonIcon;
