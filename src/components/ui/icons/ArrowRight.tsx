import React from "react";

const ArrowRight = ({ className }: { className?: string }) => {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g id="Icon/Outline/arrow-right">
        <path
          id="Icon"
          d="M10.5 3.75L15.75 9M15.75 9L10.5 14.25M15.75 9L2.25 9"
          stroke=""
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
};

export default ArrowRight;
