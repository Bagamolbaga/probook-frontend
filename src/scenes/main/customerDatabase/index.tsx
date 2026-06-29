/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { GridColDef, GridRowSelectionModel, GridSortModel } from "@mui/x-data-grid";
import { Player } from "@lottiefiles/react-lottie-player";

import useStore from "@/hooks/useStore";
import { useThemeStore } from "@/stores/theme";
import Button from "@/components/ui/button";
import PersonIcon from "@/components/ui/icons/Person";
import PlusRight from "@/components/ui/icons/Plus";
import UserNameWithAvatar from "@/components/ui/table/customCells/UserNameWithAvatar";
import ListItemEmptyPlaceholder from "@/assets/customerDatabase/ListItemEmptyPlaceholder.svg";
import BlackLogoAnimation from "@/assets/lottiefiles/blackLogoAnimation.json";
import { useGetCustomersQuery } from "@/api/queries/users";
import CreateCustomerModal from "./components/CreateCustomerModal";
import { useTranslations } from "next-intl";
import { formatCurrency } from "@/utils/formatCurrency";
import SubscriptionChecker from "@/components/subscriptionChecker";
import MainPagesTitle from "@/components/mainPagesTitle";
import { useGetCompanyId } from "@/hooks/useGetCompanyId";
import { useRouter } from "@/i18n";
import { MAIN_NAVIGATION_ENUM } from "@/constants/navigations";
import Table from "@/components/ui/table";
import TextField from "@/components/ui/inputs/TextField";
import SearchIcon from "@/components/ui/icons/Search";
import { useForm } from "react-hook-form";
import Spinner from "@/components/ui/loaders/Spinner";

type TRowItem = TCustomer;

type SerachForm = {
  searchByName: string;
};

const CustomerDatabaseScene = () => {
  const t = useTranslations();
  const { companyId } = useGetCompanyId();
  const router = useRouter();
  const toggleOpenSidebar = useStore(useThemeStore, (st) => st.toggleOpenSidebar);

  const form = useForm<SerachForm>({
    defaultValues: {
      searchByName: "",
    },
  });

  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });
  const [sortModel, setSortModel] = useState<GridSortModel>([
    { field: "id", sort: "asc" },
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [firstLoading, setFirstLoading] = useState(true);

  const getCustomersQuery = useGetCustomersQuery({
    companyId,
    queryParams: {
      limit: paginationModel.pageSize.toString(),
      offset: (paginationModel.pageSize * paginationModel.page).toString(),
      ordering: `${sortModel[0]?.sort === "asc" ? "" : "-"}${sortModel[0]?.field}` as any,
      search: form.watch("searchByName"),
    },
  });

  useEffect(() => {
    if (getCustomersQuery.data) {
      setFirstLoading(false);
    }
  }, [getCustomersQuery.data]);

  const openCreateModalHandler = () => {
    setShowCreateModal(true);
  };

  const closeCreateModalHandler = () => {
    setShowCreateModal(false);
  };

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: "name",
        headerName: t("customerDatabase.table.headerLabels.name"),
        type: "string",
        minWidth: 200,
        flex: 0.2,
        renderCell: ({ row }) => {
          return <UserNameWithAvatar name={`${row.firstName} ${row.lastName}` || ""} />;
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
        headerName: t("customerDatabase.table.headerLabels.phone"),
        type: "string",
        minWidth: 200,
        flex: 0.1,
        renderCell: ({ value }) => {
          return <div className="h-full flex items-center text-base">{value || "-"}</div>;
        },
      },
      {
        field: "bookingsCount",
        headerName: t("customerDatabase.table.headerLabels.noOfBooking"),
        type: "number",
        minWidth: 150,
        flex: 0.1,
        renderCell: (params) => {
          return <div className="h-full flex items-center text-base">{params.value}</div>;
        },
      },
      {
        field: "moneySpent",
        headerName: t("customerDatabase.table.headerLabels.moneySpent"),
        type: "number",
        minWidth: 150,
        flex: 0.1,
        valueFormatter: (value) => Number(value),
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
    return getCustomersQuery.data?.results || [];
  }, [getCustomersQuery.data]);

  const rowCountRef = useRef(getCustomersQuery.data?.count || 0);

  const rowCount = useMemo(() => {
    if (getCustomersQuery.data?.count !== undefined) {
      rowCountRef.current = getCustomersQuery.data?.count;
    }
    return rowCountRef.current;
  }, [getCustomersQuery.data?.count]);

  const openCustomerDetailsPage = (row: TRowItem) => {
    router.push(`${MAIN_NAVIGATION_ENUM["/customer-database"]["path"]}/${row.id}`);
  };

  const onSelectRowHandler = useCallback(
    (selectionModel: GridRowSelectionModel) => {
      const row = rows.find((r) => r.id === selectionModel[0]);

      if (row) {
        openCustomerDetailsPage(row);
      }
    },
    [rows]
  );

  if (firstLoading) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center">
        <Player src={BlackLogoAnimation} autoplay loop className="w-[200px] h-[200px]" />
      </div>
    );
  }

  if (
    !getCustomersQuery.isPending &&
    !getCustomersQuery.data?.count &&
    !form.watch("searchByName")
  ) {
    return (
      <div className="w-full min-h-[100vh] px-7 py-6 bg-greyOutline">
        <div className="pb-6 flex justify-between items-center">
          <div className="flex items-center">
            <i className="la la-bars mr-5 cursor-pointer" onClick={toggleOpenSidebar}></i>
            <h5 className="text-xl font-bold">{t("customerDatabase.title")}</h5>
          </div>
        </div>
        <div className="w-full min-h-[calc(100vh-62px-52px)] flex flex-col items-center justify-center rounded-xl bg-white">
          <div>
            <Image
              src={ListItemEmptyPlaceholder}
              alt={t("customerDatabase.empty.title")}
            />
          </div>
          <h4 className="text-[32px] font-bold text-center">
            {t("customerDatabase.empty.title")}
          </h4>
          <p className="mt-3 text-sm text-center text-greyPrimary">
            {t("customerDatabase.empty.subTitle")}
          </p>
          <Button
            className="mt-6 flex items-center gap-3"
            variant="primary"
            // onClick={() => setIsOpenCreateModal(true)}
            // disabled={createCompanySpecialistsQuery.isPending}
          >
            <PlusRight />
            <p className="text-sm text-white">{t("customerDatabase.empty.createList")}</p>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <CreateCustomerModal
        isOpen={showCreateModal}
        headerTitle={t("customerDatabase.createUpdateModal.createTitle")}
        handleClose={closeCreateModalHandler}
      />
      <div className="w-full min-h-[100vh] px-7 py-6 bg-greyOutline sm:px-5 sm:py-6 sm:pb-[64px]">
        <div className="pb-6 flex justify-between items-center">
          <MainPagesTitle text={t("customerDatabase.title")} />
        </div>
        <div className="w-full min-h-[calc(100vh-62px-52px)] flex sm:min-h-[calc(100vh-62px-86px)] sm:pb-5">
          <div className="w-full flex flex-col px-7 pt-6 pb-4 rounded-xl bg-white sm:px-5 sm:py-6">
            <div className="flex justify-end items-center gap-4 sm:flex-col">
              <TextField
                className="px-3 py-2 rounded-xl border border-greyOutline"
                id="searchByName"
                register={form.register}
                error={form.formState.errors.searchByName}
                highlightFullBorderWhenFocus
                iconLeft={<SearchIcon />}
              />
              <div className="flex items-center gap-3 sm:w-full sm:justify-end">
                <div className="w-fit flex items-center flex-nowrap p-3 gap-2 rounded-lg bg-greyOutline sm:p-2">
                  <PersonIcon className="stroke-darkPrimary" />
                  <p className="flex items-center gap-2 text-xs font-extrabold text-nowrap">
                    TOTAL:{" "}
                    {getCustomersQuery.isPending ? (
                      <Spinner className="size-3" color="black" />
                    ) : (
                      getCustomersQuery.data?.count
                    )}
                  </p>
                </div>
                <Button
                  className="text-nowrap"
                  variant="dark"
                  iconLeft={<PlusRight />}
                  onClick={openCreateModalHandler}
                >
                  {t("customerDatabase.createNewBtn")}
                </Button>
              </div>
            </div>
            <div className="flex mt-6 h-full sm:mt-5">
              <Table
                _enablePagination
                rowHeight={88}
                rows={rows}
                rowCount={rowCount}
                columns={columns}
                paginationMode="server"
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                rowSelection={true}
                loading={getCustomersQuery.isPending}
                _onSelectRowModel={onSelectRowHandler}
                sortModel={sortModel}
                onSortModelChange={(newModel) => setSortModel(newModel)}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomerDatabaseScene;
