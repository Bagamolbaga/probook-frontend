import { cn } from "@/utils/cn";

const BookingStatusCell = ({ value }: { value: BookingStatus }) => {
  return (
    <div className="h-full px-5 flex flex-col items-center justify-center">
      <div
        className={cn("w-full mx-3 py-2 flex justify-center rounded-lg text-base", {
          "bg-purpleExtraLight": value === "PENDING",
          "bg-redExtraLight": value === "BLOCKED",
          "bg-greyLight/20": value === "OFF",
          "bg-greenExtraLight": value === "COMPLETED" || value === "WALK_IN",
        })}
      >
        <p
          className={cn("text-sm font-bold", {
            "text-purplePrimary": value === "PENDING",
            "text-redPrimary": value === "BLOCKED",
            "text-greyPrimary": value === "OFF",
            "text-greenPrimary": value === "COMPLETED" || value === "WALK_IN",
          })}
        >
          {value === "PENDING" && "Pending"}
          {value === "BLOCKED" && "Failed"}
          {value === "OFF" && "Canceled"}
          {(value === "COMPLETED" || value === "WALK_IN") && "Success"}
        </p>
      </div>
    </div>
  );
};

export default BookingStatusCell;
