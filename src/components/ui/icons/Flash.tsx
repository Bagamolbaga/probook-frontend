import React from "react";

const FlashIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="21"
      viewBox="0 0 20 21"
      fill="none"
      className={className}
    >
      <path
        d="M4.35476 9.94149L10.1866 2.45575C10.6427 1.8703 11.4976 2.23469 11.4976 3.01455V8.80861C11.4976 9.27574 11.8329 9.65449 12.2465 9.65449H15.083C15.7274 9.65449 16.0709 10.5127 15.6451 11.0592L9.81329 18.5449C9.35721 19.1303 8.50229 18.766 8.50229 17.9861V12.1921C8.50229 11.7249 8.16703 11.3462 7.75346 11.3462H4.91692C4.27255 11.3462 3.92908 10.4879 4.35476 9.94149Z"
        stroke="#141B34"
        stroke-width="1.5"
        stroke-linecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default FlashIcon;
