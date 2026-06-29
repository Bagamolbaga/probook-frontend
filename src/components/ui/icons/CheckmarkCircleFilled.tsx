import { cn } from "@/utils/cn";

const CheckmarkCircleFilled = ({ className }: { className?: string }) => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("fill-greenPrimary", className)}
    >
      <rect width="20" height="20" rx="10" fill="" />
      <path
        d="M15.1804 6.10448C14.8442 5.7919 14.2983 5.79209 13.9617 6.10448L8.47663 11.1979L6.03877 8.93421C5.70215 8.62163 5.15648 8.62163 4.81985 8.93421C4.48323 9.24679 4.48323 9.75348 4.81985 10.0661L7.86705 12.8956C8.03525 13.0518 8.25582 13.1301 8.4764 13.1301C8.69698 13.1301 8.91776 13.052 9.08596 12.8956L15.1804 7.23631C15.517 6.92395 15.517 6.41704 15.1804 6.10448Z"
        fill="white"
      />
    </svg>
  );
};

export default CheckmarkCircleFilled;
