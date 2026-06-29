import { cn } from "@/utils/cn";

const HotIcon = ({ className, strokeColor }: { className?: string, strokeColor?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="21"
      viewBox="0 0 20 21"
      fill="none"
      className={cn(className)}
    >
      <path
        d="M9.99992 18.8337C13.6818 18.8337 16.6666 15.8489 16.6666 12.167C16.6666 7.16699 9.99992 2.16699 9.99992 2.16699C9.67634 4.23943 9.3595 5.35164 8.33325 7.16699C7.33249 6.70441 7.08325 6.33366 6.66659 5.29199C4.99992 7.16699 3.33325 9.66699 3.33325 12.167C3.33325 15.8489 6.31802 18.8337 9.99992 18.8337Z"
        stroke=""
        stroke-width="1.5"
        strokeLinejoin="round"
        className={cn('stroke-darkPrimary',className, strokeColor)}
      />
      <path
        d="M8.33325 14.6663L11.6666 11.333"
        stroke=""
        stroke-width="1.5"
        stroke-linecap="round"
        strokeLinejoin="round"
        className={cn('stroke-darkPrimary',className, strokeColor)}
      />
      <path
        d="M8.33325 11.333H8.34075M11.6591 14.6663H11.6666"
        stroke=""
        stroke-width="2"
        stroke-linecap="round"
        strokeLinejoin="round"
        className={cn('stroke-darkPrimary',className, strokeColor)}
      />
    </svg>
  );
};

export default HotIcon;
