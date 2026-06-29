import { cn } from "@/utils/cn";

const SpeedIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      width="20"
      height="21"
      viewBox="0 0 20 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("stroke-greyPrimary", className)}
    >
      <path
        d="M10 18C11.3807 18 12.5 16.8807 12.5 15.5C12.5 14.1193 11.3807 13 10 13C8.61929 13 7.5 14.1193 7.5 15.5C7.5 16.8807 8.61929 18 10 18Z"
        stroke="#8181A5"
        stroke-width="1.5"
      />
      <path
        d="M10 13V8.83331"
        stroke="#8181A5"
        stroke-width="1.5"
        stroke-linecap="round"
      />
      <path
        d="M18.3327 11.3333C18.3327 6.73096 14.6017 3 9.99935 3C5.39697 3 1.66602 6.73096 1.66602 11.3333"
        stroke="#8181A5"
        stroke-width="1.5"
        stroke-linecap="round"
      />
    </svg>
  );
};

export default SpeedIcon;
