import { FC } from "react";
import { cn } from "@/utils/cn";

type HighlightProps = {
  text: string;
  highlight?: string | RegExp;
  highlightClassName?: string;
};

export const HighlightText: FC<HighlightProps> = ({ text, highlight, highlightClassName }) => {
  if (!highlight || !text) return <>{text}</>;

  const regex =
    typeof highlight === "string" ? new RegExp(`(${highlight})`, "gi") : highlight;

  const parts = text.split(regex);

  return (
    <>
      {parts
        .filter((part) => part)
        .map((part, i) =>
          regex.test(part) ? (
            <span
              key={i}
              className={cn("font-bold text-purplePrimary", highlightClassName)}
            >
              {part}
            </span>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
    </>
  );
};
