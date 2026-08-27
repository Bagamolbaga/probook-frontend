/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { GridColDef, GridRowSelectionModel, GridSortModel } from "@mui/x-data-grid";
import { Player } from "@lottiefiles/react-lottie-player";
import { differenceInSeconds } from "date-fns";

import { useGetCompanySpecialistsQuery } from "@/api/queries/company/specialists";
import {
  useCreateCompanyServiceQuery,
  useDeleteCompanyServiceQuery,
  useGetCompanyServicesQuery,
  useUpdateCompanyServiceQuery,
} from "@/api/queries/company/services";
import { useGetCompanyServiceCategoriesQuery } from "@/api/queries/company/serviceCategories";

// import CreateUpdateServiceModal from "./components/CreateNewServiceModal";
import CreateUpdateServiceModal from "./components/CreateServiceModal";

import Button from "@/components/ui/button";
import ConfirmationModal from "@/components/ui/modal/ConfirmationModal";
import TimeCell from "@/components/ui/table/customCells/Time";
import PriceCell from "@/components/ui/table/customCells/Price";
import { toaster } from "@/components/ui/toaster";

import EditIcon from "@/components/ui/icons/Edit";
import PlusRight from "@/components/ui/icons/Plus";
import DeleteIcon from "@/components/ui/icons/Delete";
import PersonIcon from "@/components/ui/icons/Person";
import BlackLogoAnimation from "@/assets/lottiefiles/blackLogoAnimation.json";
import ServicesListEmptyImage from "@/assets/businessServices/ServicesListEmptyOverlay.svg";
import { useTranslations } from "next-intl";
import { useGetCompanyId } from "@/hooks/useGetCompanyId";
import Table from "@/components/ui/table";

export type CreateServiceForm = {
  _serviceId?: TService["_id"];
  avatar?: File | string;
  name: string;
  name_thai: string;
  description?: string;
  description_thai?: string;
  options: (Omit<TServiceOption, "id"> & { id?: number })[];
  category: TServiceCategory | null;
  specialists: TSpecialist[];
  showSpecialists: boolean;
  featured: boolean;
};

type TRowItem = Omit<TService, "options" | "specialists"> & {
  options: TServiceOption[];
  specialists: TSpecialist[];
};

const BusinessServicesListTable = () => {
  const t = useTranslations();
  const { companyId } = useGetCompanyId();

  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });
  const [sortModel, setSortModel] = useState<GridSortModel>([
    { field: "id", sort: "asc" },
  ]);
  const [firstLoading, setFirstLoading] = useState(true);

  const getCompanyServicesQuery = useGetCompanyServicesQuery({
    companyId,
    queryParams: {
      limit: paginationModel.pageSize.toString(),
      offset: (paginationModel.pageSize * paginationModel.page).toString(),
      ordering:
        `${sortModel[0]?.sort === "asc" ? "" : "-"}${sortModel[0]?.field}` as OrderingFields<TService>,
    },
  });
  const getCompanyServiceCategoriesQuery = useGetCompanyServiceCategoriesQuery({
    companyId,
  });

  const getCompanySpecialistsQuery = useGetCompanySpecialistsQuery({
    companyId,
    queryParams: {
      limit: "100",
      offset: "0",
    },
  });

  const createCompanyServiceQuery = useCreateCompanyServiceQuery();
  const updateCompanyServiceQuery = useUpdateCompanyServiceQuery();
  const deleteCompanyServiceQuery = useDeleteCompanyServiceQuery();

  const [isOpenCreateModal, setIsOpenCreateModal] = useState(false);
  const [isOpenUpdateModal, setIsOpenUpdateModal] = useState(false);
  const [serviceIdDeleteConfirmModal, setServiceIdDeleteConfirmModal] = useState<
    string | null
  >(null);

  const createServiceForm = useForm<CreateServiceForm>({
    defaultValues: {
      specialists: [],
      category: null,
      showSpecialists: false,
      options: [{ name: "", duration: 0 }],
    },
  });

  useEffect(() => {
    if (getCompanyServicesQuery.data) {
      setFirstLoading(false);
    }
  }, [getCompanyServicesQuery.data]);

  const rows: TRowItem[] = useMemo(() => {
    return [
      ...(getCompanyServicesQuery.data?.results.map((s) => ({
        ...s,
        id: s.id || s._id || "",
        options: (s.options as TServiceOption[]).map((so) => ({
          ...so,
          price: Number(so.price),
        })),
        specialists: s.specialists as TSpecialist[],
      })) || []),
    ].sort((a, b) => differenceInSeconds(a.createdAt, b.createdAt));
  }, [getCompanyServicesQuery.data]);

  const showCreateModalHandler = () => {
    setIsOpenCreateModal(true);
  };

  const hideCreateModalHandler = () => {
    createServiceForm.reset();
    void getCompanyServicesQuery.refetch();
    void getCompanySpecialistsQuery.refetch();

    setIsOpenCreateModal(false);
  };

  const hideUpdateModalHandler = () => {
    createServiceForm.reset();
    void getCompanyServicesQuery.refetch();
    void getCompanySpecialistsQuery.refetch();

    setIsOpenUpdateModal(false);
  };

  const showUpdateModalHandler = useCallback(
    (rowData: TRowItem) => {
      createServiceForm.setValue("_serviceId", rowData._id || rowData.id);
      rowData.image && createServiceForm.setValue("avatar", rowData.image);
      createServiceForm.setValue("name", rowData.name);
      createServiceForm.setValue("description", rowData.description);
      // createServiceForm.setValue("featured", rowData.featured);

      createServiceForm.setValue(
        "options",
        rowData.options.map((so) => ({
          ...so,
          name: so.name || "",
          price: so.price,
        }))
      );

      const rowCategoryId = rowData.category
        ? typeof rowData.category === "string"
          ? rowData.category
          : rowData.category.id || rowData.category._id
        : undefined;
      const category = getCompanyServiceCategoriesQuery.data?.results.find(
        (item) => item.id === rowCategoryId || item._id === rowCategoryId
      );

      createServiceForm.setValue(
        "category",
        category ||
          (!rowData.category || typeof rowData.category === "string"
            ? null
            : rowData.category)
      );

      const specialists = rowData.specialists;

      // createServiceForm.setValue("showSpecialists", rowData.show_specialist);
      createServiceForm.setValue("specialists", specialists);

      setIsOpenUpdateModal(true);
    },
    [createServiceForm, getCompanyServiceCategoriesQuery.data?.results]
  );

  const onSelectRowHandler = useCallback(
    (model: GridRowSelectionModel) => {
      if (model.length) {
        const row = rows.find((r) => r.id === model[0] || r._id === model[0]);

        if (row) {
          showUpdateModalHandler(row);
        }
      }
    },
    [rows, showUpdateModalHandler]
  );

  const createNewServiceHandler = async (formData: CreateServiceForm) => {
    try {
      if (!formData.category) {
        toaster.error("Select a service category");
        return;
      }

      const body = {
        companyId,
        categoryId: formData.category.id,
        name: formData.name,
        description: formData.description,
        specialistIds: formData.specialists.map((s) => s.id),
        options: formData.options.map((so) => ({
          name: so.name || "",
          duration: so.duration,
          price: Number(so.price),
        })),
      };

      const { data } = await createCompanyServiceQuery.mutateAsync({
        data: body,
      });

      if (data) {
        hideCreateModalHandler();
        toaster.success("Service created");
      }
    } catch (error) {
      toaster.error(t("ui.errors.wentWrong"));
    }
  };

  const updateServiceHandler = async (formData: CreateServiceForm) => {
    try {
      if (!formData.category) {
        toaster.error("Select a service category");
        return;
      }

      const initData = getCompanyServicesQuery.data?.results.find(
        (s) => s._id === formData._serviceId
      );
      if (initData) {
        const { data } = await updateCompanyServiceQuery.mutateAsync({
          serviceId: formData._serviceId!,
          data: {
            companyId,
            categoryId: formData.category.id,
            name: formData.name,
            description: formData.description,
            specialistIds: formData.specialists.map((s) => s.id),
            options: formData.options.map((so) => ({
              name: so.name || "",
              duration: so.duration,
              price: Number(so.price),
            })),
          },
        });
        if (data) {
          hideUpdateModalHandler();
          toaster.success("Service updated");
        }
      }
    } catch (error) {
      console.error({ error });
      toaster.error(t("ui.errors.wentWrong"));
    }
  };

  const deleteServiceHandler = async () => {
    try {
      if (serviceIdDeleteConfirmModal) {
        await deleteCompanyServiceQuery.mutateAsync({
          serviceId: serviceIdDeleteConfirmModal,
          companyId: companyId,
        });
        setServiceIdDeleteConfirmModal(null);
        toaster.success("Services deleted");
      }
    } catch (error) {
      toaster.error(t("ui.errors.wentWrong"));
    }
  };

  const staffCell = (rowData: TRowItem) => {
    const SHOW_ITEMS = 3;
    const staff = rowData.specialists || [];

    let hiddenStaff = -1;
    const slicedStaff = staff.length > SHOW_ITEMS ? staff.slice(0, SHOW_ITEMS) : staff;

    if (staff.length > SHOW_ITEMS) {
      hiddenStaff = staff.length - slicedStaff.length;
    }

    return (
      <div className="w-full h-full flex items-center gap-1">
        {slicedStaff.map((s) => {
          if (s.avatar) {
            return (
              <div key={s.id} className="relative w-9 h-9 rounded-md overflow-hidden">
                <Image
                  className="w-full h-full object-cover"
                  fill
                  src={s.avatar}
                  alt={s.fullName}
                />
              </div>
            );
          }

          return (
            <div key={s.id} className="w-9 h-9 rounded-md overflow-hidden">
              <div className="w-full h-full flex justify-center items-center bg-greyOutline">
                <PersonIcon className="w-7 h-7 stroke-greyPrimary" />
              </div>
            </div>
          );
        })}
        {hiddenStaff > 0 && (
          <div className="w-9 h-9 flex items-center justify-center rounded-md border border-greyLight">
            +{hiddenStaff}
          </div>
        )}
      </div>
    );
  };

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: "name",
        headerName: t("businessServices.table.headerLabels.name"),
        minWidth: 200,
        flex: 0.2,
        renderCell: ({ row }) => {
          return (
            <div className="h-full flex items-center text-base font-bold">{row.name}</div>
          );
        },
      },
      {
        field: "time_in_minutes",
        headerName: t("businessServices.table.headerLabels.time"),
        type: "number",
        minWidth: 150,
        flex: 0.1,
        valueGetter: (_, row: TRowItem) => {
          return row.options[0]?.duration;
        },
        renderCell: (params) => {
          return <TimeCell value={params.row.options[0]?.duration} />;
        },
      },
      {
        field: "price",
        headerName: t("businessServices.table.headerLabels.price"),
        type: "number",
        minWidth: 150,
        flex: 0.1,
        valueGetter: (_, row: TRowItem) => {
          return row.options[0]?.price;
        },
        renderCell: (params) => {
          return <PriceCell value={params.row.options[0]?.price} />;
        },
      },
      {
        field: "category",
        headerName: t("businessServices.table.headerLabels.serviceType"),
        type: "string",
        minWidth: 200,
        flex: 0.2,
        valueGetter: (_, row: TRowItem) => {
          if (!row.category) return "";

          return typeof row.category === "string" ? row.category : row.category.name;
        },
        renderCell: ({ row }: { row: TRowItem }) => {
          const categoryName = !row.category
            ? "—"
            : typeof row.category === "string"
              ? row.category
              : row.category.name;

          return <div className="h-full flex items-center">{categoryName}</div>;
        },
      },
      {
        field: "staff",
        headerName: t("businessServices.table.headerLabels.staff"),
        type: "number",
        minWidth: 200,
        flex: 0.2,
        sortComparator: (v1, v2) => {
          return v1.specialists.length - v2.specialists.length;
        },
        renderCell: ({ row }) => {
          return staffCell(row);
        },
      },
      {
        field: "actions",
        headerName: t("businessServices.table.headerLabels.action"),
        type: "actions",
        minWidth: 100,
        flex: 0.1,
        renderCell: ({ row }) => {
          return (
            <div className="w-auto flex items-center gap-2">
              <Button
                className="w-9 h-9 p-0"
                variant="resting-active"
                onClick={() => showUpdateModalHandler(row)}
              >
                <EditIcon className="w-5 h-5" />
              </Button>
              <Button
                className="w-9 h-9 p-0"
                variant="resting-active"
                onClick={() => setServiceIdDeleteConfirmModal(row.id)}
              >
                <DeleteIcon className="w-5 h-5" />
              </Button>
            </div>
          );
        },
      },
    ],
    [showUpdateModalHandler, t]
  );

  const formData = createServiceForm.watch();
  const formIsReady = Boolean(
    formData.name &&
    formData.category &&
    formData.options?.length &&
    formData.specialists?.length
  );
  const createBtnIsActive = formIsReady && !createCompanyServiceQuery.isPending;
  const updateBtnIsActive = formIsReady && !updateCompanyServiceQuery.isPending;

  if (firstLoading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center">
        <Player src={BlackLogoAnimation} autoplay loop className="w-[200px] h-[200px]" />
      </div>
    );
  }

  if (!getCompanyServicesQuery.isPending && !getCompanyServicesQuery.data?.count) {
    return (
      <>
        <CreateUpdateServiceModal
          headerTitle={t("businessServices.createUpdateModal.createTitle")}
          isOpen={isOpenCreateModal}
          form={createServiceForm}
          staffs={getCompanySpecialistsQuery.data?.results || []}
          categories={getCompanyServiceCategoriesQuery.data?.results || []}
          handleClose={hideCreateModalHandler}
          actionButton={
            <Button
              className="flex items-center gap-3"
              variant="dark"
              onClick={createServiceForm.handleSubmit(createNewServiceHandler)}
              disabled={!createBtnIsActive}
            >
              <PlusRight />
              <p className="text-sm text-white ">{t("businessServices.createNewBtn")}</p>
            </Button>
          }
        />
        <div className="w-full h-full flex flex-col items-center justify-center">
          <div>
            <Image src={ServicesListEmptyImage} alt={t("businessServices.empty.title")} />
          </div>
          <h4 className="text-[32px] font-bold text-center">
            {t("businessServices.empty.title")}
          </h4>
          <p className="mt-3 text-sm text-center text-greyPrimary">
            {t.rich("businessServices.empty.subTitle", {
              br: () => <br />,
            })}
          </p>
          <Button
            className="mt-6 flex items-center gap-3"
            variant="primary"
            onClick={() => setIsOpenCreateModal(true)}
            disabled={createCompanyServiceQuery.isPending}
          >
            <PlusRight />
            <p className="text-sm text-white">
              {t("businessServices.createUpdateModal.createTitle")}
            </p>
          </Button>
        </div>
      </>
    );
  }

  return (
    <>
      <CreateUpdateServiceModal
        headerTitle={t("businessServices.createUpdateModal.createTitle")}
        isOpen={isOpenCreateModal}
        form={createServiceForm}
        staffs={getCompanySpecialistsQuery.data?.results || []}
        categories={getCompanyServiceCategoriesQuery.data?.results || []}
        handleClose={hideCreateModalHandler}
        actionButton={
          <Button
            className="flex items-center gap-3"
            variant="dark"
            onClick={createServiceForm.handleSubmit(createNewServiceHandler)}
            disabled={!createBtnIsActive}
          >
            <PlusRight />
            <p className="text-sm text-white ">{t("businessServices.createNewBtn")}</p>
          </Button>
        }
      />
      <CreateUpdateServiceModal
        headerTitle={t("businessServices.createUpdateModal.updateTitle")}
        isOpen={isOpenUpdateModal}
        form={createServiceForm}
        staffs={getCompanySpecialistsQuery.data?.results || []}
        categories={getCompanyServiceCategoriesQuery.data?.results || []}
        handleClose={hideUpdateModalHandler}
        actionButton={
          <Button
            className="flex items-center gap-3"
            variant="dark"
            onClick={createServiceForm.handleSubmit(updateServiceHandler)}
            disabled={!updateBtnIsActive}
          >
            <p className="text-sm text-white ">{t("ui.actions.update")}</p>
          </Button>
        }
      />
      <ConfirmationModal
        isOpen={Boolean(serviceIdDeleteConfirmModal)}
        title={t("businessServices.deleteModal.title")}
        subTitle={t("businessServices.deleteModal.subTitle")}
        pozitiveHandler={deleteServiceHandler}
        negativeHandler={() => setServiceIdDeleteConfirmModal(null)}
      />
      <div className="w-full h-full flex flex-col px-7 pt-6 pb-4 rounded-xl bg-white sm:px-5 sm:py-6">
        <div className="flex items-center justify-between">
          <div className="text-xl font-bold">
            {/* <Button
              className="px-[10px] py-[10px] flex items-center gap-2"
              variant="dark"
              onClick={() => {}}
            >
              <PlusRight />
              <p className="text-sm font-bold text-white">LIST</p>
            </Button> */}
          </div>
          <div className="flex items-center gap-1">
            <Button
              className="flex items-center gap-3"
              variant="dark"
              onClick={showCreateModalHandler}
            >
              <PlusRight />
              <p className="text-sm text-white ">{t("businessServices.createNewBtn")}</p>
            </Button>
          </div>
        </div>
        <div className="flex mt-9 rounded-xl h-full ">
          <Table
            // autoPageSize
            _enablePagination
            _onSelectRowModel={onSelectRowHandler}
            rows={rows}
            rowCount={getCompanyServicesQuery.data?.count}
            columns={columns}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            sortModel={sortModel}
            onSortModelChange={(newModel) => setSortModel(newModel)}
            paginationMode="server"
            rowSelection={true}
            loading={
              getCompanySpecialistsQuery.isPending ||
              getCompanyServiceCategoriesQuery.isPending ||
              createCompanyServiceQuery.isPending ||
              updateCompanyServiceQuery.isPending ||
              deleteCompanyServiceQuery.isPending
            }
          />
        </div>
      </div>
    </>
  );
};

export default BusinessServicesListTable;
