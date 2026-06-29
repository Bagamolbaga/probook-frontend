import { FC } from "react";
import { cn } from "@/utils/cn";
import Spinner from "@/components/ui/loaders/Spinner";

type Props = {
  color: "green" | "purple" | "orange";
  title: string;
  subTitle: string;
  rightText: string | number;
  percentDone: number;
  isLoading?: boolean;
  forSideBar?: boolean
};

const StatisticWithLine: FC<Props> = ({
  title,
  subTitle,
  rightText,
  percentDone,
  color,
  isLoading,
  forSideBar
}) => {
  return (
    <div className={cn("flex-1 flex flex-col py-6 px-[26px] rounded-[20px] bg-white", {
      "flex-none py-4 px-5 rounded-xl bg-greyBackgroundLight/50": forSideBar
    })}>
      <div className="flex items-center justify-between">
        <div>
          <p className={cn("text-lg font-bold", {
            "text-sm": forSideBar
          })}>{title}</p>
          <p className={cn("text-sm text-greyPrimary", {
            "text-xs": forSideBar
          })}>{subTitle}</p>
        </div>
        <div className="flex items-center gap-2">
          {isLoading ? <Spinner className="w-6 h-6" /> : <p className={cn("text-xl font-bold", {
            "text-lg": forSideBar
          })}>{rightText}</p>}
        </div>
      </div>
      <div className="w-full h-1 mt-4 relative rounded-md overflow-hidden bg-greyOutline">
        <div
          className={cn("absolute top-0 left-0 bottom-0 rounded-md", {
            "bg-greenPrimary": color === "green",
            "bg-purplePrimary": color === "purple",
            "bg-redPrimary/70": color === "orange",
          })}
          style={{ width: `${percentDone}%` }}
        ></div>
      </div>
    </div>
  );
};

export default StatisticWithLine;
