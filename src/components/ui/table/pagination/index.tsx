/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  useGridApiContext,
  useGridSelector,
  gridPageCountSelector,
  gridPageSelector,
  GridPagination,
} from "@mui/x-data-grid";
import { cn } from "@/src/utils/cn";
// import {Button} from "@/src/components/ui/button"
import ArrowSecondaryDownIcon from "../../icons/ArrowSecondaryDown";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

function Pagination() {
  const t = useTranslations()
  const apiRef = useGridApiContext();
  const pageCount = useGridSelector(apiRef, gridPageCountSelector);
  const pageCurrent = useGridSelector(apiRef, gridPageSelector);

  const selectPageHandler = (idx: number) => {
    apiRef.current.setPage(idx);
  };

  const prevPageHandler = () => {
    apiRef.current.setPage(pageCurrent - 1);
  };

  const nextPageHandler = () => {
    apiRef.current.setPage(pageCurrent + 1);
  };

  return (
    <div className="w-full flex justify-between items-center">
      <div className="flex items-center gap-2">
        <Button variant="secondary" className="w-10 h-10 p-0" onClick={prevPageHandler}>
          <ArrowSecondaryDownIcon className="rotate-90" />
        </Button>
        <span className="text-sm text-greyPrimary">{t("ui.actions.prev")}</span>
      </div>
      <div className="flex items-center gap-2">
        {Array.from(new Array(pageCount)).map((_, idx) => (
          <Button
            key={idx}
            variant={pageCurrent === idx ? "default" : "secondary"}
            className={cn("w-8 h-8 text-sm !border-0", {
              "font-bold text-white": pageCurrent === idx,
              "font-normal text-muted-foreground": pageCurrent !== idx,
            })}
            onClick={() => selectPageHandler(idx)}
          >
            {idx + 1}
          </Button>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-greyPrimary">{t("ui.actions.next")}</span>
        <Button variant="secondary" className="w-10 h-10 p-0" onClick={nextPageHandler}>
          <ArrowSecondaryDownIcon className="-rotate-90" />
        </Button>
      </div>
    </div>
  );
}

const TablePagination = ({ className, ...props }: any) => {
  return (
    <GridPagination
      className={cn("w-full mt-6 !py-[14px]", className)}
      sx={{
        "& .MuiTablePagination-toolbar": {
          px: 0,
        },
        "& .MuiTablePagination-spacer": {
          display: "none",
        },
        "& .MuiTablePagination-displayedRows": {
          display: "none",
        },
      }}
      ActionsComponent={Pagination}
      {...props}
    />
  );
};

export default TablePagination;
