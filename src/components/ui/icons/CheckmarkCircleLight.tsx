import { cn } from "@/utils/cn";

const CheckmarkCircleLight = ({ className }: { className?: string }) => {
  return (
    <svg
      width="65"
      height="64"
      viewBox="0 0 65 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("stroke-greyPrimary", className)}
    >
      <path
        d="M59.1668 31.9999C59.1668 17.2723 47.2276 5.33325 32.5002 5.33325C17.7726 5.33325 5.8335 17.2723 5.8335 31.9999C5.8335 46.7274 17.7726 58.6666 32.5002 58.6666C47.2276 58.6666 59.1668 46.7274 59.1668 31.9999Z"
        stroke="white"
        strokeWidth="1.5"
      />
      <path
        d="M21.8335 33.9999C21.8335 33.9999 26.1002 36.4333 28.2335 39.9999C28.2335 39.9999 34.6335 25.9999 43.1668 21.3333"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default CheckmarkCircleLight;
