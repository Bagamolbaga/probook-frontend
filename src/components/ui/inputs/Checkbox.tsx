import { cn } from "@/utils/cn";
import React, { ChangeEvent, FC } from "react";

type Props = {
  variant?: "default" | "delete";
  name?: string;
  className?: string;
  checked?: boolean;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
};

const Checkbox: FC<Props> = ({ variant, name, className, checked, onChange }) => {
  return (
    <label htmlFor={name || "checkbox"} className={cn("relative", className)}>
      <input
        type="checkbox"
        name={name || "checkbox"}
        id={name || "checkbox"}
        className="absolute opacity-0"
        onChange={onChange}
      />
      <div
        className={cn(
          "w-6 h-6 flex items-center justify-center rounded bg-transparent border border-greyOutlineSecondary",
          {
            "bg-purplePrimary border-purplePrimary": checked,
            "bg-redPrimary border-redPrimary": checked && variant === "delete",
          }
        )}
      >
        {checked && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="9"
            viewBox="0 0 12 9"
            fill="none"
          >
            <path
              d="M11.1794 1.10436C10.8432 0.791776 10.2973 0.791973 9.96069 1.10436L4.47566 6.1978L2.0378 3.93409C1.70117 3.62151 1.1555 3.62151 0.818876 3.93409C0.48225 4.24667 0.48225 4.75336 0.818876 5.06594L3.86607 7.89548C4.03428 8.05167 4.25484 8.12996 4.47542 8.12996C4.69601 8.12996 4.91678 8.05187 5.08499 7.89548L11.1794 2.23619C11.516 1.92383 11.516 1.41692 11.1794 1.10436Z"
              fill="white"
            />
          </svg>
        )}
      </div>
    </label>
  );
};

export default Checkbox;
