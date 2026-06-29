import { Dispatch, FC, SetStateAction } from "react";
import Button from "@/components/ui/button";
import ArrowSecondaryDownIcon from "@/components/ui/icons/ArrowSecondaryDown";
import { cn } from "@/utils/cn";

type Props = {
  totalCount: number;
  pagination: {
    page: number;
    limit: number;
    offset: number;
  };
  setPagination: Dispatch<
    SetStateAction<{
      page: number;
      limit: number;
      offset: number;
    }>
  >;
  className?: string;
  buttonWithText?: boolean;
};

const Pagination: FC<Props> = ({
  buttonWithText,
  className,
  totalCount,
  pagination,
  setPagination,
}) => {
  const selectPageHandler = (page: number) => {
    const offset = page === 0 ? 0 : page * pagination.limit;

    setPagination((p) => ({
      ...p,
      page: page + 1,
      offset,
    }));
  };

  const prevPageHandler = () => {
    setPagination((p) => ({
      ...p,
      page: p.page - 1,
      offset: p.offset - p.limit,
    }));
  };

  const nextPageHandler = () => {
    setPagination((p) => ({
      ...p,
      page: p.page + 1,
      offset: p.offset + p.limit,
    }));
  };

  const btnCounts = Math.ceil(totalCount / pagination.limit);

  return (
    <div className={cn("w-full flex justify-between items-center", className)}>
      <div className="flex items-center gap-2">
        <Button
          variant="resting"
          className="w-10 h-10 p-0"
          onClick={prevPageHandler}
          disabled={pagination.page === 1}
        >
          <ArrowSecondaryDownIcon className="rotate-90" />
        </Button>
        {buttonWithText && <span className="text-sm text-greyPrimary">Prev</span>}
      </div>
      <div className="flex items-center gap-2">
        {Array.from(new Array(btnCounts)).map((_, idx: number) => (
          <Button
            key={idx}
            variant={pagination.page === idx + 1 ? "primary-resting" : "resting"}
            className={cn("w-8 h-8 text-sm !border-0", {
              "font-bold text-purplePrimary": pagination.page === idx + 1,
              "font-normal text-greyPrimary": pagination.page !== idx + 1,
            })}
            onClick={() => selectPageHandler(idx)}
          >
            {idx + 1}
          </Button>
        ))}
      </div>
      <div className="flex items-center gap-2">
        {buttonWithText && <span className="text-sm text-greyPrimary">Next</span>}
        <Button
          variant="resting"
          className="w-10 h-10 p-0"
          onClick={nextPageHandler}
          disabled={pagination.page === btnCounts}
        >
          <ArrowSecondaryDownIcon className="-rotate-90" />
        </Button>
      </div>
    </div>
  );
};

export default Pagination;
