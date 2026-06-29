import { cn } from "@/utils/cn";
import React from "react";

const CalendarIcon = ({ className }: { className?: string }) => {
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
        d="M15.5 1.66669V3.33335M5.5 1.66669V3.33335"
        stroke=""
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.4956 10.8333H10.5031M10.4956 14.1666H10.5031M13.8252 10.8333H13.8327M7.16602 10.8333H7.17349M7.16602 14.1666H7.17349"
        stroke=""
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.41602 6.66669H17.5827"
        stroke=""
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.58398 10.2027C2.58398 6.57162 2.58398 4.75607 3.62742 3.62803C4.67085 2.5 6.35023 2.5 9.70898 2.5H11.2923C14.6511 2.5 16.3305 2.5 17.3739 3.62803C18.4173 4.75607 18.4173 6.57162 18.4173 10.2027V10.6307C18.4173 14.2617 18.4173 16.0773 17.3739 17.2053C16.3305 18.3333 14.6511 18.3333 11.2923 18.3333H9.70898C6.35023 18.3333 4.67085 18.3333 3.62742 17.2053C2.58398 16.0773 2.58398 14.2617 2.58398 10.6307V10.2027Z"
        stroke=""
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3 6.66669H18"
        stroke=""
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default CalendarIcon;
