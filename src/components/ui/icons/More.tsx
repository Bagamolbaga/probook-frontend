import { cn } from "@/utils/cn";

const MoreIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      width="16"
      height="5"
      viewBox="0 0 16 5"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("fill-white", className)}
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M2.64694 0.820312C1.55614 0.820312 0.671875 1.70458 0.671875 2.79538C0.671875 3.88618 1.55614 4.77045 2.64694 4.77045C3.73774 4.77045 4.62201 3.88618 4.62201 2.79538C4.62201 1.70458 3.73774 0.820312 2.64694 0.820312Z"
        fill=""
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M6.59668 2.79538C6.59668 1.70458 7.48095 0.820312 8.57175 0.820312C9.66255 0.820312 10.5468 1.70458 10.5468 2.79538C10.5468 3.88618 9.66255 4.77045 8.57175 4.77045C7.48095 4.77045 6.59668 3.88618 6.59668 2.79538Z"
        fill=""
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M12.522 2.79538C12.522 1.70458 13.4062 0.820312 14.497 0.820312C15.5878 0.820312 16.4721 1.70458 16.4721 2.79538C16.4721 3.88618 15.5878 4.77045 14.497 4.77045C13.4062 4.77045 12.522 3.88618 12.522 2.79538Z"
        fill=""
      />
    </svg>
  );
};

export default MoreIcon;
