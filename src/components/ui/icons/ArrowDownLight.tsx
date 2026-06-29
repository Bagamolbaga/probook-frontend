import React from "react";

const ArrowDownLight = ({ className }: { className?: string }) => {
  return (
    <svg
      width="35"
      height="46"
      viewBox="0 0 35 46"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M17.5703 44.3333L33.5703 28.3333M17.5703 44.3333L1.57031 28.3333M17.5703 44.3333L17.5703 16.3333M17.5703 1.66668V8.33334"
        stroke="url(#paint0_linear_2092_66)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient
          id="paint0_linear_2092_66"
          x1="17.5703"
          y1="1.66668"
          x2="17.5703"
          y2="44.3333"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#603FEF" stopOpacity="0" />
          <stop offset="1" stopColor="#603FEF" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default ArrowDownLight;
