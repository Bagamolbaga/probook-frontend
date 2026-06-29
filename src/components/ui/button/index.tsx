import { FC, ReactNode } from "react";
import { cn } from "@/utils/cn";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "transparent"
    | "primary"
    | "resting"
    | "resting-active"
    | "primary-resting"
    | "dark"
    | "dark-outline"
    | "red-outline"
    | "outline";
  color?: "dark" | "white" | "primary" | "red";
  size?: "sm";
  textBold?: boolean;
  rounded?: boolean;
  className?: string;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
}

const Button: FC<Props> = ({
  variant,
  color,
  size,
  textBold = false,
  rounded = true,
  className,
  iconLeft,
  iconRight,
  children,
  ...other
}) => {
  return (
    <button
      className={cn(
        "relative px-[14px] py-[14px] flex items-center justify-center transition-all text-sm font-bold sm:py-2 sm:px-2 sm:text-sm",
        className,
        {
          "text-darkPrimary fill-darkPrimary stroke-darkPrimary":
            !variant && !other.disabled,
          "text-greyPrimary fill-greyPrimary stroke-greyPrimary pointer-events-none":
            !variant && other.disabled,

          "bg-white border-[1px] border-darkPrimary text-darkPrimary fill-darkPrimary stroke-darkPrimary hover:border-purplePrimary":
            variant === "dark-outline" && !other.disabled,
          "bg-white border-[1px] border-greyPrimary text-greyPrimary fill-greyPrimary stroke-greyPrimary pointer-events-none":
            variant === "dark-outline" && other.disabled,

          "bg-white border-[1px] border-redPrimary text-redPrimary fill-redPrimary stroke-redPrimary":
            variant === "red-outline" && !other.disabled,
          "bg-white border-[1px] border-redPrimary/60 text-redPrimary/60 fill-redPrimary/60 stroke-redPrimary/60 pointer-events-none ":
            variant === "red-outline" && other.disabled,

          "bg-white border-[1px] border-purplePrimary text-purplePrimary fill-purplePrimary stroke-purplePrimary":
            variant === "outline" && !other.disabled,
          "bg-white border-[1px] border-greyPrimary text-greyPrimary fill-greyPrimary stroke-greyPrimary pointer-events-none  ":
            variant === "outline" && other.disabled,

          "bg-purplePrimary border-[1px] border-purplePrimary text-white fill-white stroke-white hover:bg-purplePrimary_hover hover:border-purplePrimary_hover":
            variant === "primary" && !other.disabled,

          "bg-purpleExtraLight border-[1px] border-purpleExtraLight text-purplePrimary fill-purplePrimary stroke-purplePrimary":
            variant === "primary-resting" && !other.disabled,

          "bg-greyBackground border-[1px] border-greyBackground text-greyPrimary fill-greyPrimary stroke-greyPrimary hover:text-darkPrimary":
            variant === "resting" && !other.disabled,

          "bg-white border-[1px] border-greyOutlineSecondary text-darkPrimary fill-darkPrimary stroke-darkPrimary hover:border-greyPrimary/30":
            variant === "resting-active" && !other.disabled,

          "bg-greyBackground border-[1px] border-greyBackground text-greyPrimary fill-greyPrimary stroke-greyPrimary pointer-events-none":
            (variant === "primary" || variant === "primary-resting") && other.disabled,

          "bg-darkPrimary border-[1px] border-darkPrimary text-white fill-white stroke-white hover:bg-purplePrimary hover:border-purplePrimary":
            variant === "dark" && !other.disabled,
            
          "bg-darkPrimary/80 border-[1px] border-darkPrimary/80 text-white/80 fill-white/80 stroke-white/80 pointer-events-none":
            variant === "dark" && other.disabled,
          "rounded-lg": rounded,
          "font-bold": textBold,
          // "text-sm font-bold": variant === 'primary',
          // "text-base font-normal": variant !== 'primary' && !textBold,
          "px-[10px] py-[10px] text-sm": size === "sm",
          "gap-2": iconLeft || iconRight,
        }
      )}
      {...other}
    >
      {iconLeft && <div className="">{iconLeft}</div>}
      {children}
      {iconRight && <div className="">{iconRight}</div>}
    </button>
  );
};

export default Button;
