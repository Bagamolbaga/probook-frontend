"use client";

import { useMemo } from "react";
import { Link } from "@/i18n";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useGetCustomersQuery } from "@/api/queries/users";
import UserNameWithAvatar from "@/components/ui/table/customCells/UserNameWithAvatar";
import Button from "@/components/ui/button";
import { formatCurrency } from "@/utils/formatCurrency";
import { useGetCompanyId } from "@/hooks/useGetCompanyId";

type TRowItem = {
  id: string | number;
  name: string;
  email: string | null;
  phone: string | null;
  booking_id: number;
  moneySpent: number;
};

const CustomerDatabase = () => {
  const { companyId } = useGetCompanyId();
  const getCustomersQuery = useGetCustomersQuery({
    companyId,
    queryParams: {
      limit: "5",
    },
  });

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: "name",
        headerName: "Name",
        minWidth: 200,
        flex: 0.2,
        renderCell: ({ value }: { value?: string }) => {
          return <UserNameWithAvatar name={value || ""} />;
        },
      },
      {
        field: "email",
        headerName: "Email",
        type: "string",
        minWidth: 200,
        flex: 0.1,
        renderCell: ({ value }) => {
          return <div className="h-full flex items-center text-base">{value}</div>;
        },
      },
      {
        field: "phone",
        headerName: "Phone",
        type: "string",
        minWidth: 200,
        flex: 0.1,
        renderCell: ({ value }) => {
          return <div className="h-full flex items-center text-base">{value}</div>;
        },
      },
      {
        field: "booking_id",
        headerName: "No. of booking",
        type: "string",
        minWidth: 150,
        flex: 0.1,
        renderCell: (params) => {
          return <div className="h-full flex items-center text-base">{params.value}</div>;
        },
      },
      {
        field: "moneySpent",
        headerName: "Money spent",
        type: "string",
        minWidth: 150,
        flex: 0.1,
        renderCell: (params) => {
          return (
            <div className="h-full flex items-center text-base">
              {formatCurrency(params.value as string)}
            </div>
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

  const rows: TRowItem[] = useMemo(() => {
    return (
      getCustomersQuery.data?.results.map((c) => {
        return {
          id: c.id,
          name: c.name,
          email: c.email,
          phone: c.phone,
          booking_id: c.bookings_count,
          moneySpent: Number(c.money_spent),
        };
      }) || []
    );
  }, [getCustomersQuery.data]);

  return (
    <div className="w-full flex flex-col p-6 pb-11 rounded-[20px] bg-white">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-bold">Customer Database</h4>
        <div className="flex items-center gap-1">
          <Link href="/customer-database">
            <Button className="flex items-center gap-3" variant="resting-active">
              View all
            </Button>
          </Link>
        </div>
      </div>
      <div className="flex mt-5 rounded-xl h-full ">
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
            footerContainer: "!hidden",
          }}
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 4 },
            },
          }}
          rowSelection={false}
          loading={getCustomersQuery.isPending}
        />
      </div>
    </div>
  );
};

export default CustomerDatabase;
