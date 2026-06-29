import { cn } from "@/utils/cn";

const CloseIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      className={cn("stroke-greyPrimary", className)}
    >
      <path
        d="M15 5L10 10M10 10L5 15M10 10L15 15M10 10L5 5"
        stroke=""
        stroke-width="1.5"
        stroke-linecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default CloseIcon;
