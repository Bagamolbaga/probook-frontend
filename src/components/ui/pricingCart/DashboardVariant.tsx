import { FC } from "react";
import CheckmarkCircle from "../icons/CheckmarkCircle";
import XCircle from "../icons/XCircle";
import { cn } from "@/utils/cn";
import Button from "../button";

type Props = {
  planName: string;
  mainPrice?: string;
  desc: string;
  planItems: {
    id: number;
    text: string;
    include?: boolean;
  }[];
  mainPricePeriod?: string;
  variant?: "selected" | "default";
  onClickHandler: () => void;
};

export const DashboardVariant: FC<Props> = ({
  planName,
  mainPrice,
  desc,
  planItems,
  mainPricePeriod,
  variant = "default",
  onClickHandler,
}) => {
  const handleSelectPlan = () => {
    if (variant !== "selected") {
      onClickHandler();
    }
  };
  return (
    <div
      className={cn(
        "w-1/3 p-5 flex flex-col justify-between rounded-xl border border-greyOutlineSecondary",
        {
          "border-darkPrimary": variant === "selected",
        }
      )}
    >
      <div className="flex flex-col">
        <span className="text-purplePrimary font-bold">{planName}</span>
        <div className="mt-2 flex items-end gap-2">
          <span className="text-[32px] font-bold leading-[34px]">{mainPrice}</span>
          <span className="text-sm text-greyPrimary">{mainPricePeriod}</span>
        </div>
        <p className="mt-6">{desc}</p>
        <div className="w-full h-[1px] my-6 bg-greyOutlineSecondary"></div>
        <div className="flex flex-col gap-4">
          {planItems.map((i) => (
            <div key={i.id} className="flex items-start gap-3">
              {i.include ? (
                <CheckmarkCircle className="min-w-6 min-h-6 fill-greenPrimary stroke-white" />
              ) : (
                <XCircle className="min-w-6 min-h-6" />
              )}
              <p>{i.text}</p>
            </div>
          ))}
        </div>
      </div>
      <Button
        variant={variant === "selected" ? "resting" : "primary"}
        className="mt-8"
        onClick={handleSelectPlan}
      >
        {variant === "selected" ? "Current plan" : "Upgrade"}
      </Button>
    </div>
  );
};
