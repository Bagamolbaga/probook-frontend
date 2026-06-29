import { FC } from "react";
import Star from "../icons/Star";
import { cn } from "@/utils/cn";

type Props = {
  raiting: number;
  size?: "sm" | "md" | "lg";
};

const StarRating: FC<Props> = ({ raiting, size }) => {
  const percentFilled = Math.max(Math.min((100 / 5) * raiting, 100), 0);

  const starColored = (
    <div
      className={cn("min-w-3 min-h-3 max-w-3 max-h-3", {
        "min-w-5 min-h-5 max-w-5 max-h-5": size === "md",
        "min-w-8 min-h-8 max-w-8 max-h-8": size === "md",
      })}
    >
      <Star fillColor="fill-purplePrimary" />
    </div>
  );

  const starDefault = (
    <div
      className={cn("min-w-3 min-h-3 max-w-3 max-h-3", {
        "min-w-5 min-h-5 max-w-5 max-h-5": size === "md",
        "min-w-8 min-h-8 max-w-8 max-h-8": size === "md",
      })}
    >
      <Star fillColor="fill-greyPrimary" />
    </div>
  );

  return (
    <div className="relative flex items-center">
      <div
        className={cn("absolute z-10 top-0 left-0 flex items-center overflow-hidden")}
        style={{ width: `${percentFilled}%` }}
      >
        {starColored}
        {starColored}
        {starColored}
        {starColored}
        {starColored}
      </div>

      <div className="w-fit flex items-center">
        {starDefault}
        {starDefault}
        {starDefault}
        {starDefault}
        {starDefault}
      </div>
    </div>
  );
};

export default StarRating;
