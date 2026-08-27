import { CSSProperties } from "react";

import { cn } from "@/utils/cn";

type SemanticVariant = "working" | "break" | "neutral";
type TimeBadgeVariant = SemanticVariant | "shift";

type BaseProps = {
  text: string;
  className?: string;
};

type TimeBadgeProps = BaseProps &
  (
    | {
        variant: "shift";
        color: string;
      }
    | {
        variant?: SemanticVariant;
        color?: never;
      }
  );

type VariantStyles = {
  container: string;
  text: string;
};

const VARIANT_STYLES: Record<SemanticVariant, VariantStyles> = {
  working: {
    container: "border-[#ABEFC6] bg-[#ECFDF3]",
    text: "text-[#067647]",
  },
  break: {
    container: "border-[#FEDF89] bg-[#FFF7E6]",
    text: "text-[#B54708]",
  },
  neutral: {
    container: "border-transparent bg-greyPrimary/10",
    text: "text-greyPrimary",
  },
};

const getShiftStyle = (color: string): CSSProperties => ({
  color,
  borderColor: `color-mix(in srgb, ${color} 35%, transparent)`,
  backgroundColor: `color-mix(in srgb, ${color} 12%, transparent)`,
});

const TimeBadge = (props: TimeBadgeProps) => {
  const { text, className } = props;
  const semanticStyles =
    props.variant === "shift" ? null : VARIANT_STYLES[props.variant ?? "neutral"];
  const shiftStyle = props.variant === "shift" ? getShiftStyle(props.color) : undefined;

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div
        className={cn(
          "w-full py-2 flex items-center justify-center overflow-hidden rounded border",
          semanticStyles?.container,
          className
        )}
        style={shiftStyle}
      >
        <span className={cn("text-sm font-bold", semanticStyles?.text)}>{text}</span>
      </div>
    </div>
  );
};

export type { TimeBadgeProps, TimeBadgeVariant };
export default TimeBadge;
