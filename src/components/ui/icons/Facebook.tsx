import { cn } from "@/utils/cn";

interface Props {
  fillColor?: string;
}

export default function Facebook({ fillColor }: Props) {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M27.3337 14C27.3337 6.64 21.3603 0.666672 14.0003 0.666672C6.64033 0.666672 0.666992 6.64 0.666992 14C0.666992 20.4533 5.25366 25.8267 11.3337 27.0667V18H8.66699V14H11.3337V10.6667C11.3337 8.09334 13.427 6 16.0003 6H19.3337V10H16.667C15.9337 10 15.3337 10.6 15.3337 11.3333V14H19.3337V18H15.3337V27.2667C22.067 26.6 27.3337 20.92 27.3337 14Z"
        className={cn("transition fill-white", fillColor)}
      />
    </svg>
  );
}
