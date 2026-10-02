import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/src/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground font-[500] shadow hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        transparent: "bg-transparent text-darkPrimary hover:bg-accent",
        primary: "bg-purplePrimary text-white hover:bg-purplePrimary_hover",
        resting: "bg-greyBackground text-greyPrimary hover:text-darkPrimary",
        "resting-active":
          "bg-white text-darkPrimary border border-greyOutlineSecondary hover:border-greyPrimary/30",
        "primary-resting":
          "bg-purpleExtraLight text-purplePrimary border border-purpleExtraLight",
        dark: "bg-darkPrimary text-white hover:bg-purplePrimary",
        "dark-outline":
          "bg-white text-darkPrimary border border-darkPrimary hover:border-purplePrimary",
        "red-outline": "bg-white text-redPrimary border border-redPrimary",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  color?: "dark" | "white" | "primary" | "red";
  textBold?: boolean;
  rounded?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      color,
      textBold,
      rounded = true,
      iconLeft,
      iconRight,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, className }),
          !rounded && "rounded-none",
          textBold && "font-bold",
          color === "dark" && "text-darkPrimary",
          color === "white" && "text-white",
          color === "primary" && "text-purplePrimary",
          color === "red" && "text-redPrimary"
        )}
        ref={ref}
        {...props}
      >
        {iconLeft}
        {children}
        {iconRight}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
export default Button;
