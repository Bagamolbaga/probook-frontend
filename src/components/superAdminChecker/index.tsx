"use client";

import { useGetCompaniesQuery } from "@/api/queries/company";
import { DataGrid, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import { PropsWithChildren, useEffect, useMemo, useRef, useState } from "react";
import TablePagination from "../ui/table/pagination";
import { useSuperAdminStore } from "@/stores/superAdmin";
import { useStore } from "zustand";
import { useAppSession } from "@/hooks/useAppSession";

const SuperAdminChecker = ({ children }: PropsWithChildren) => {
  // return children

  const { data: session } = useAppSession();
  const selectCompany = useStore(useSuperAdminStore, (st) => st.selectCompany);
  const setSelectCompany = useStore(useSuperAdminStore, (st) => st.setSelectCompany);

  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });
  const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);

  const getCompaniesQuery = useGetCompaniesQuery({
    queryParams: {
      limit: paginationModel.pageSize.toString(),
      offset: (paginationModel.pageSize * paginationModel.page).toString(),
    },
  });

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: "id",
        headerName: "ID",
        flex: 0.1,
        renderCell: ({ value }: { value?: string }) => {
          return <div className="h-full flex items-center text-base">{value}</div>;
        },
      },
      {
        field: "name",
        headerName: "Name",
        type: "string",
        flex: 0.1,
        renderCell: ({ value }) => {
          return <div className="h-full flex items-center text-base">{value}</div>;
        },
      },
      {
        field: "address1",
        headerName: "Address",
        type: "string",
        flex: 0.1,
        renderCell: ({ value }) => {
          return (
            <div className="h-full flex items-center text-base text-wrap">{value}</div>
          );
        },
      },

      // {
      //   field: "actions",
      //   headerName: "Action",
      //   type: "actions",
      //   flex: 0.1,
      //   renderCell: ({ row }) => {
      //     return (
      //       <div className="w-auto flex items-center gap-2">
      //         <Button
      //           className="w-9 h-9 p-0"
      //           variant="resting-active"
      //           // onClick={() => showUpdateModalHandler(row)}
      //         >
      //           <EditIcon className="w-5 h-5" />
      //         </Button>
      //         <Button
      //           className="w-9 h-9 p-0"
      //           variant="resting-active"
      //           // onClick={() => setSpecialistIdDeleteConfirmModal(row.id)}
      //         >
      //           <DeleteIcon className="w-5 h-5" />
      //         </Button>
      //       </div>
      //     );
      //   },
      // },
    ],
    []
  );

  const rows = useMemo(() => {
    return (
      getCompaniesQuery.data?.results.map((c) => {
        return c;
      }) || []
    );
  }, [getCompaniesQuery.data]);

  useEffect(() => {
    if (rowSelectionModel.length) {
      const selectedCompany = rows.find((c) => c.id === Number(rowSelectionModel[0]));

      if (selectedCompany) {
        setSelectCompany(selectedCompany);
      }
    }
  }, [rowSelectionModel, rows]);

  const rowCountRef = useRef(getCompaniesQuery.data?.count || 0);

  const rowCount = useMemo(() => {
    if (getCompaniesQuery.data?.count !== undefined) {
      rowCountRef.current = getCompaniesQuery.data?.count;
    }
    return rowCountRef.current;
  }, [getCompaniesQuery.data?.count]);

  if (session?.user?.is_superuser && !selectCompany) {
    return (
      <div className="w-full h-full px-7 py-10 rounded-xl bg-white">
        <div className="flex mt-6 h-full ">
          <DataGrid
            autoHeight
            rowHeight={88}
            sx={{
              "& .MuiDataGrid-topContainer::after": {
                display: "none",
              },
            }}
            classes={{
              root: "!border-0",
              columnHeaders: "!px-0 [&>div]:!bg-greyBackgroundLight/40",
              virtualScrollerContent: "!h-auto mt-5",
              virtualScrollerRenderZone: "!relative gap-2",
              row: "!px-[10px] rounded-[12px] border border-greyOutlineSecondary hover:!bg-greyBackgroundLight/40",
              cell: "!border-t-0 focus:!outline-none",
              footerContainer: "!border-0",
            }}
            rows={rows}
            rowCount={rowCount}
            columns={columns}
            paginationMode="server"
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            onRowSelectionModelChange={(newRowSelectionModel) => {
              setRowSelectionModel(newRowSelectionModel);
            }}
            rowSelectionModel={rowSelectionModel}
            rowSelection={true}
            slots={{
              pagination: (props) => <TablePagination className="!py-0" {...props} />,
            }}
            loading={getCompaniesQuery.isPending}
          />
        </div>
      </div>
    );
  }

  return children;
};

export default SuperAdminChecker;
