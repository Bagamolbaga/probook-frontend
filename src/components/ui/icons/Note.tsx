import { cn } from "@/utils/cn";
import React from "react";

const NoteIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      className={cn("stroke-greyPrimary", className)}
      xmlns="http://www.w3.org/2000/svg"
      width="21"
      height="20"
      viewBox="0 0 21 20"
      fill="none"
    >
      <path
        d="M14.6673 1.66669V3.33335M10.5007 1.66669V3.33335M6.33398 1.66669V3.33335"
        stroke=""
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.41602 8.33333C3.41602 5.58347 3.41602 4.20854 4.27029 3.35427C5.12456 2.5 6.49949 2.5 9.24935 2.5H11.7493C14.4992 2.5 15.8741 2.5 16.7284 3.35427C17.5827 4.20854 17.5827 5.58347 17.5827 8.33333V12.5C17.5827 15.2498 17.5827 16.6247 16.7284 17.4791C15.8741 18.3333 14.4992 18.3333 11.7493 18.3333H9.24935C6.49949 18.3333 5.12456 18.3333 4.27029 17.4791C3.41602 16.6247 3.41602 15.2498 3.41602 12.5V8.33333Z"
        stroke=""
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.16602 12.5H10.4993M7.16602 8.33331H13.8327"
        stroke=""
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default NoteIcon;
