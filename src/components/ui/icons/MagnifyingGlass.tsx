import { cn } from "@/utils/cn";
import React from "react";

const MagnifyingGlass = ({ className, strokeColor }: { className?: string; strokeColor?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      className={cn("stroke-greyPrimary", className)}
    >
      <path
        d="M13.0001 13L10.1048 10.1047M10.1048 10.1047C10.6001 9.60939 10.9929 9.02144 11.261 8.37435C11.529 7.72726 11.6669 7.03372 11.6669 6.33332C11.6669 5.63292 11.529 4.93937 11.261 4.29229C10.9929 3.6452 10.6001 3.05724 10.1048 2.56198C9.60955 2.06673 9.02159 1.67387 8.3745 1.40583C7.72742 1.1378 7.03387 0.999847 6.33347 0.999847C5.63307 0.999847 4.93953 1.1378 4.29244 1.40583C3.64535 1.67387 3.0574 2.06673 2.56214 2.56198C1.56192 3.5622 1 4.91879 1 6.33332C1 7.74784 1.56192 9.10443 2.56214 10.1047C3.56236 11.1049 4.91895 11.6668 6.33347 11.6668C7.748 11.6668 9.10458 11.1049 10.1048 10.1047Z"
        stroke=""
        stroke-linecap="round"
        strokeLinejoin="round"
        className={cn("stroke-white", strokeColor)}
      />
    </svg>
  );
};

export default MagnifyingGlass;
