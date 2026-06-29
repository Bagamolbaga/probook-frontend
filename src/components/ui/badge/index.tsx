import React, { FC, ReactNode } from "react";
import { cn } from "@/utils/cn";

type Props = {
  variant?: "primary" | "secondary";
  rounded?: "full" | "default" | "sm";
  color?: "primary" | "green" | "yellow" | "red" | "grey" | "black";
  textBold?: boolean;
  leftContent?: ReactNode;
  children?: ReactNode;
  className?: string;
  onClick?: () => void
};

const Badge: FC<Props> = ({
  variant = "primary",
  rounded = "default",
  color = "primary",
  textBold = false,
  leftContent,
  children,
  className,
  onClick
}) => {
  return (
    <div
      className={cn(
        "w-full h-fit py-[3px] px-3 flex justify-center items-center gap-2",
        className,
        {
          "bg-greyBackgroundLight text-darkPrimary": color === "primary",
          "bg-greenExtraLight text-greenPrimary": color === "green",
          "bg-yellowExtraLight text-yellowPrimary": color === "yellow",
          "bg-redExtraLight text-redPrimary": color === "red",
          "bg-greyBackgroundLight text-greyPrimary": color === "grey",
          "bg-darkPrimary text-white": color === "black",
          "bg-purplePrimary/10 text-purplePrimary":
            variant === "secondary" && color === "primary",
          "rounded-full": rounded === "full",
          "rounded-md": rounded === "default",
          "rounded-[3px]": rounded === "sm",
          "font-bold": textBold,
          "text-sm font-bold": variant === "secondary" && textBold,
        }
      )}
      onClick={onClick && onClick}
    >
      {variant === "primary" && leftContent && leftContent}
      {variant === "primary" && !leftContent && (
        <div
          className={cn("min-w-2 min-h-2 rounded-full", {
            "bg-purplePrimary": color === "primary",
            "bg-greenPrimary": color === "green",
            "bg-yellowPrimary": color === "yellow",
            "bg-redPrimary": color === "red",
          })}
        ></div>
      )}
      {children}
    </div>
  );
};

export default Badge;
