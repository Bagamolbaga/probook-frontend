import { cn } from "@/utils/cn";

const Sad = ({className}: {className?: string}) => {
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("stroke-white", className)}
    >
      <path
        d="M14.25 32.5275C15.4485 32.8359 16.7052 33 18 33C26.2842 33 33 26.2842 33 18C33 9.71572 26.2842 3 18 3C9.71572 3 3 9.71572 3 18C3 18.5063 3.02508 19.0066 3.07407 19.5"
        stroke=""
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M7.53192 21L4.2906 24.1239C2.54991 25.8306 2.57994 28.5785 4.32064 30.2561C6.09136 31.9338 8.94249 31.9049 10.6832 30.2273C12.4539 28.5206 12.4239 25.7727 10.6832 24.0949L7.53192 21Z"
        stroke=""
        stroke-width="1.5"
        stroke-linejoin="round"
      />
      <path
        d="M12.0135 12.6631H12M24 12.6631H23.9865"
        stroke=""
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M22.5 24C21.2466 23.0581 19.6884 22.5 18 22.5C16.6339 22.5 15.3531 22.8654 14.25 23.5038"
        stroke=""
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

export default Sad;
