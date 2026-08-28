"use client";

import UserNameWithAvatar from "@/components/ui/table/customCells/UserNameWithAvatar";
import { Player } from "@lottiefiles/react-lottie-player";
import { GridColDef, GridSortModel } from "@mui/x-data-grid";
import { useMemo, useRef, useState } from "react";
import BlackLogoAnimation from "@/assets/lottiefiles/blackLogoAnimation.json";
import Button from "@/components/ui/button";
import ArrowRight from "@/components/ui/icons/ArrowRight";
import Image from "next/image";
import ListItemEmptyPlaceholder from "@/assets/customerDatabase/ListItemEmptyPlaceholder.svg";
import { useRouter } from "@/i18n";
import { AxiosError } from "axios";
import SceneTitle from "@/components/sceneHeader/SceneTitle";
import Table from "@/components/ui/table";
import CustomerDetailsWidget from "./components/CustomerDetailsWidget";
import {
  useGetCustomerBookingsHistoryQuery,
  useGetCustomerDetailsQuery,
} from "@/api/queries/users";
import { useGetCompanyId } from "@/hooks/useGetCompanyId";
import { format } from "date-fns";
import ScrollableCell from "@/components/ui/table/customCells/ScrollableCell";
import { formatCurrency } from "@/utils/formatCurrency";
import PriceCell from "@/components/ui/table/customCells/Price";
import BookingStatusCell from "@/components/ui/table/customCells/BookingStatus";
import MoneyIcon from "@/components/ui/icons/Money";
import CalendarIcon from "@/components/ui/icons/Calendar";
import { cn } from "@/utils/cn";
import type { TCustomerBookingOrdering } from "@/api/entities/user/customer";
import { useGetCompanyDetailsQuery } from "@/api/queries/company";

type TCustomerVisitHistoryTableRowItem = {
  id: string | number;
  name: string;
  companyLogo: string | null;
  specialist: string;
  services: string;
  date: string;
  amount: number;
  status: BookingStatus;
};

type Props = {
  customerId: string;
};

const CustomerDatabaseDetailsScene = ({ customerId }: Props) => {
  const { companyId } = useGetCompanyId();
  const router = useRouter();

  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });
  const [sortModel, setSortModel] = useState<GridSortModel>([
    { field: "id", sort: "asc" },
  ]);

  const getCustomerDetailsQuery = useGetCustomerDetailsQuery({ companyId, customerId });
  const getCompanyDetailsQuery = useGetCompanyDetailsQuery({ companyId });
  const activeSort = sortModel[0];
  const ordering = activeSort
    ? (`${activeSort.sort === "desc" ? "-" : ""}${activeSort.field}` as TCustomerBookingOrdering)
    : "-createdAt";
  const getCustomerBookingHistoryQuery = useGetCustomerBookingsHistoryQuery({
    companyId,
    customerId,
    queryParams: {
      limit: paginationModel.pageSize.toString(),
      offset: (paginationModel.pageSize * paginationModel.page).toString(),
      ordering,
    },
  });

  const goBackHandler = () => router.back();

  const rows: TCustomerVisitHistoryTableRowItem[] = useMemo(() => {
    if (getCustomerBookingHistoryQuery.data?.results) {
      return getCustomerBookingHistoryQuery.data.results.map((b) => ({
        id: b.id,
        name: b.company.name || getCompanyDetailsQuery.data?.name || "",
        companyLogo: b.company.logo || getCompanyDetailsQuery.data?.logo || null,
        specialist: `${b.specialist.firstName} ${b.specialist.lastName}`,
        services: b.services.map((service) => service.name).join(", "),
        date: format(new Date(`${b.date}T00:00:00`), "dd MMM yyyy"),
        amount: b.totalPrice ?? 0,
        status: b.status,
      }));
    }

    return [];
  }, [getCompanyDetailsQuery.data, getCustomerBookingHistoryQuery.data]);

  const rowCountRef = useRef(0);

  const rowCount = useMemo(() => {
    if (getCustomerBookingHistoryQuery.data?.count !== undefined) {
      rowCountRef.current = getCustomerBookingHistoryQuery.data?.count;
    }
    return rowCountRef.current;
  }, [getCustomerBookingHistoryQuery.data?.count]);

  const columns: GridColDef<TCustomerVisitHistoryTableRowItem>[] = useMemo(
    () => [
      {
        field: "name",
        headerName: "Name",
        minWidth: 200,
        flex: 0.1,
        renderCell: ({ row }) => {
          return (
            <UserNameWithAvatar name={row.name} avatar={row.companyLogo || undefined} />
          );
        },
      },
      {
        field: "specialist",
        headerName: "Specialist",
        type: "string",
        minWidth: 200,
        flex: 0.1,
        renderCell: ({ row }) => {
          return (
            <ScrollableCell>
              <div className="h-full flex items-center text-base">{row.specialist}</div>
            </ScrollableCell>
          );
        },
      },
      {
        field: "date",
        headerName: "Date",
        type: "string",
        minWidth: 150,
        flex: 0.1,
        renderCell: ({ row }) => {
          return <div className="h-full flex items-center text-base">{row.date}</div>;
        },
      },
      {
        field: "amount",
        headerName: "Amounts",
        type: "number",
        minWidth: 100,
        flex: 0.1,
        renderCell: ({ row }) => {
          return <PriceCell value={row.amount} />;
        },
      },
      {
        field: "status",
        headerName: "Status",
        type: "string",
        minWidth: 150,
        flex: 0.1,
        renderCell: ({ row }) => {
          return <BookingStatusCell value={row.status} />;
        },
      },
      // {
      //   field: "services",
      //   headerName: "Services",
      //   type: "string",
      //   flex: 0.1,
      //   renderCell: ({ value }) => {
      //     return (
      //       <ScrollableCell>
      //         <div className="h-full flex items-center text-base">{value}</div>
      //       </ScrollableCell>
      //     );
      //   },
      // },
    ],
    []
  );

  if (getCustomerDetailsQuery.isLoading) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center">
        <Player src={BlackLogoAnimation} autoplay loop className="w-[200px] h-[200px]" />
      </div>
    );
  }

  if ((getCustomerDetailsQuery.error as AxiosError | null)?.response?.status === 404) {
    return (
      <div className="w-full min-h-[100vh] px-7 py-6 bg-greyOutline">
        <div className="pb-6 flex justify-between items-center">
          <SceneTitle>
            <div className="flex items-center gap-5">
              <Button
                variant="resting-active"
                className="size-9 p-2"
                onClick={goBackHandler}
              >
                <ArrowRight className="rotate-180 stroke-greyPrimary" />
              </Button>
              User details
            </div>
          </SceneTitle>
        </div>
        <div className="w-full min-h-[calc(100vh-62px-52px)] px-7 pt-6 pb-6 flex flex-col items-center justify-center rounded-xl bg-white">
          <div>
            <Image src={ListItemEmptyPlaceholder as string} alt={"Company not found"} />
          </div>
          <h4 className="text-[32px] font-bold text-center">No customer found?</h4>
          <p className="mt-3 text-sm text-center text-greyPrimary">
            Try to select another customer
          </p>
          <Button
            className="mt-6 flex items-center gap-3"
            variant="primary"
            onClick={goBackHandler}
          >
            <p className="text-sm text-white">Go back</p>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[100vh] px-7 py-6 bg-greyOutline sm:p-5 sm:pb-[64px]">
      <div className="pb-6 flex justify-between items-center">
        <SceneTitle>
          <div className="flex items-center gap-5">
            <Button
              variant="resting-active"
              className="size-9 p-2"
              onClick={goBackHandler}
            >
              <ArrowRight className="rotate-180 stroke-greyPrimary" />
            </Button>
            User details
          </div>
        </SceneTitle>
      </div>
      <div
        className={cn(
          "w-full min-h-[calc(100vh-62px-52px)] px-7 pt-6 pb-6 flex rounded-xl bg-white",
          "md:flex-col md:min-h-[calc(100vh-62px-68px)] md:p-5",
          "sm:flex-col sm:min-h-[calc(100vh-62px-106px)] sm:p-5"
        )}
      >
        <div
          className={cn(
            "w-1/3 pr-6 border-r border-greyOutlineSecondary",
            "md:min-w-0 md:w-full md:pr-0 md:pb-3 md:border-r-0 md:border-b",
            "sm:min-w-0 sm:w-full sm:pr-0 sm:pb-3 sm:border-r-0 sm:border-b"
          )}
        >
          <CustomerDetailsWidget
            customer={getCustomerDetailsQuery.data}
            bowersUsage={
              getCustomerDetailsQuery.data?.firstBooking
                ? new Date(getCustomerDetailsQuery.data.firstBooking)
                : undefined
            }
          />
        </div>

        <div className="w-2/3 pl-6 flex flex-col md:w-full md:mt-3 md:pl-0 sm:w-full sm:mt-3 sm:pl-0">
          <div className="w-full flex gap-5 md:flex-col sm:flex-col">
            <div className="w-1/2 px-6 py-5 flex items-center justify-between rounded-xl bg-greyBackgroundLight md:w-full sm:w-full">
              <div>
                <p className="text-sm text-greyPrimary">Revenue tracking</p>
                <h4 className="text-xl">
                  {formatCurrency(getCustomerDetailsQuery.data?.moneySpent || 0)}
                </h4>
              </div>
              <div className="size-[52px] flex items-center justify-center rounded-xl bg-greenExtraLight">
                <MoneyIcon className="stroke-greenPrimary" />
              </div>
            </div>
            <div className="w-1/2 px-6 py-5 flex items-center justify-between rounded-xl bg-greyBackgroundLight md:w-full sm:w-full">
              <div>
                <p className="text-sm text-greyPrimary">No. of booking</p>
                <h4 className="text-xl">{getCustomerDetailsQuery.data?.bookingsCount}</h4>
              </div>
              <div className="size-[52px] flex items-center justify-center rounded-xl bg-redExtraLight">
                <CalendarIcon className="stroke-redPrimary" />
              </div>
            </div>
          </div>

          <h4 className="mt-6 text-lg font-bold">Store Visit History</h4>

          <div className="mt-3 flex h-full">
            <Table
              _enablePagination
              rowHeight={64}
              rows={rows}
              rowCount={rowCount}
              columns={columns}
              loading={getCustomerBookingHistoryQuery.isPending}
              // rowSelection={false}
              paginationMode="server"
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              sortModel={sortModel}
              onSortModelChange={(newModel) => setSortModel(newModel)}
            />
          </div>
        </div>
      </div>
      <div className="w-full h-5"></div>
    </div>
  );
};

export default CustomerDatabaseDetailsScene;
