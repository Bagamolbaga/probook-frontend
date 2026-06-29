import { format} from "date-fns";
import { cn } from "@/utils/cn";
import CheckmarkCircleFilled from "@/components/ui/icons/CheckmarkCircleFilled";

type Props = {
  status: TBooking["status"];
  updatedAt: string;
};

export const ConfirmationStatus = ({ status, updatedAt }: Props) => {
  return (
    <div className="px-6 py-6">
      <div
        className={cn("w-full py-5 px-6 rounded-xl flex items-center gap-2", {
          "bg-yellowExtraLight": status === "PENDING",
          "bg-greenExtraLight": status === "COMPLETED" || status === "CONFIRMED" || status === "WALK_IN",
        })}
      >
        {status === "PENDING" && (
          <>
            <div
              className={cn("size-[18px] rounded-full border-[5px] border-yellowPrimary")}
            ></div>
            <p className="text-sm font-bold">Awaiting Confirmation</p>
          </>
        )}
        {(status === "COMPLETED" || status === "CONFIRMED") && (
          <div className="w-full flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckmarkCircleFilled className="size-[18px]" />
              <p className="text-sm font-bold">Customer Confirmed</p>
            </div>
            <p className="text-sm text-greyPrimary">
              {format(updatedAt, "HH:mm dd MMM yyyy")}
            </p>
          </div>
        )}
        {status === "WALK_IN" && (
          <div className="w-full flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckmarkCircleFilled className="size-[18px]" />
              <p className="text-sm font-bold">Customer Walk-In</p>
            </div>
            <p className="text-sm text-greyPrimary">
              {format(updatedAt.split(".")[0], "HH:mm dd MMM yyyy")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
