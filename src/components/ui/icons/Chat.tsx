import React from "react";

const ChatIcon = ({ className }: { className?: string }) => {
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
        d="M18.3346 10.1389C18.3346 14.5416 14.6031 18.1112 10.0013 18.1112C9.46022 18.1119 8.92064 18.0619 8.38914 17.9621C8.00658 17.8902 7.81529 17.8543 7.68174 17.8747C7.54819 17.8951 7.35895 17.9957 6.98046 18.197C5.90975 18.7664 4.66126 18.9675 3.46056 18.7442C3.91692 18.1829 4.22859 17.5094 4.36612 16.7874C4.44945 16.3457 4.24297 15.9167 3.93371 15.6026C2.52908 14.1763 1.66797 12.2543 1.66797 10.1389C1.66797 5.73633 5.39945 2.16669 10.0013 2.16669C14.6031 2.16669 18.3346 5.73633 18.3346 10.1389Z"
        stroke=""
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M9.99755 10.5H10.0051M13.3271 10.5H13.3346M6.66797 10.5H6.67544"
        stroke=""
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default ChatIcon;
