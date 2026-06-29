import { memo, useEffect, useState } from "react";
import { DataGrid, DataGridProps, GridRowSelectionModel } from "@mui/x-data-grid";
import { Player } from "@lottiefiles/react-lottie-player";

import TablePagination from "./pagination";
import BlackLogoAnimation from "@/assets/lottiefiles/blackLogoAnimation.json";

type Props = {
  _enablePagination?: boolean;
  _onSelectRowModel?: (model: GridRowSelectionModel) => void;
};

const Table = ({
  _enablePagination,
  _onSelectRowModel,
  ...props
}: Props & DataGridProps) => {
  const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);

  useEffect(() => {
    if (props.rowSelection && rowSelectionModel.length) {
      _onSelectRowModel && _onSelectRowModel(rowSelectionModel);
      setRowSelectionModel([]);
    }
  }, [props.rowSelection, rowSelectionModel, _onSelectRowModel]);

  return (
    <DataGrid
      rowHeight={88}
      onRowSelectionModelChange={(newRowSelectionModel) => {
        setRowSelectionModel(newRowSelectionModel);
      }}
      rowSelectionModel={rowSelectionModel}
      {...props}
      sx={{
        "& .MuiDataGrid-topContainer::after": {
          display: "none",
        },
        "& .MuiDataGrid-topContainer": {
          background: "white",
        },
        "& .MuiDataGrid-filler": {
          display: "none",
        },
        "& .MuiDataGrid-selectedRowCount": {
          display: "none",
        },
        "& .MuiTablePagination-selectLabel": {
          display: "none !important",
        },
        "& .MuiTablePagination-input": {
          display: "none !important",
        },
        ...props.sx,
      }}
      classes={{
        root: "!border-0",
        columnHeaders: "!px-0 [&>div]:!bg-greyBackgroundLight/40",
        virtualScrollerContent: "!h-auto mt-5",
        virtualScrollerRenderZone: "!relative gap-2",
        row: `!px-[10px] rounded-[12px] border border-greyOutlineSecondary hover:!bg-greyBackgroundLight/40 ${props.rowSelection ? "cursor-pointer" : ""}`,
        cell: "!border-t-0 focus:!outline-none",
        filler: "!hidden !h-0",
        footerContainer: "!border-0",
        ...props.classes,
      }}
      slots={{
        loadingOverlay: () => (
          <div className="h-full flex flex-col items-center justify-center">
            <Player
              src={BlackLogoAnimation}
              autoplay
              loop
              className="w-[100px] h-[100px]"
            />
          </div>
        ),
        pagination: (props) =>
          _enablePagination ? <TablePagination className="!py-0" {...props} /> : null,
        ...props.slots,
      }}
    />
  );
};

export default memo(Table);
