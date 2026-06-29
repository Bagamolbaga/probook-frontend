import React from "react";

const ToastInfoIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 14.397 2.84334 16.597 4.2495 18.3195L2.29245 20.2929C1.66771 20.9229 2.11018 22 2.9937 22H12ZM7.5 10C7.5 9.44772 7.94772 9 8.5 9H15.5C16.0523 9 16.5 9.44772 16.5 10C16.5 10.5523 16.0523 11 15.5 11H8.5C7.94772 11 7.5 10.5523 7.5 10ZM8.5 13C7.94772 13 7.5 13.4477 7.5 14C7.5 14.5523 7.94772 15 8.5 15H11.5C12.0523 15 12.5 14.5523 12.5 14C12.5 13.4477 12.0523 13 11.5 13H8.5Z"
        fill="#603FEF"
      />
    </svg>
  );
};

export default ToastInfoIcon;
