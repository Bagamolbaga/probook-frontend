"use client";

import Button from "@/components/ui/button";
import DeleteIcon from "@/components/ui/icons/Delete";
import EditIcon from "@/components/ui/icons/Edit";
import { Player } from "@lottiefiles/react-lottie-player";
import { GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import { useCallback, useEffect, useMemo, useState } from "react";
import BlackLogoAnimation from "@/assets/lottiefiles/blackLogoAnimation.json";
import ListIsEmptyPlaceholderImage from "@/assets/staffManagement/SpecialistListEmptyOverlay.svg";
import PlusRight from "@/components/ui/icons/Plus";
import Image from "next/image";
import Badge from "./components/TimeBadge";
import { TimeManager } from "@/utils/timeManager";
import { TTimeSlot } from "@/constants/timeSlots";
import { useForm, useWatch } from "react-hook-form";
import CreateUpdateModal from "./components/CreateUpdateModal";
import { toaster } from "@/components/ui/toaster";
import {
  useCreateCompanyShiftQuery,
  useDeleteCompanyShiftQuery,
  useGetCompanyShiftsQuery,
  useUpdateCompanyShiftQuery,
} from "@/api/queries/company/shift";
import { useTranslations } from "next-intl";
import ConfirmationModal from "@/components/ui/modal/ConfirmationModal";
import { useGetCompanyId } from "@/hooks/useGetCompanyId";
import Table from "@/components/ui/table";
import { useQueryClient } from "@tanstack/react-query";
import { useGetCompanyDetailsQuery } from "@/api/queries/company";

export type CreateUpdateOpeationHour = {
  id: TShift["id"];
  name: string;
  color: string;
  time: {
    from?: TTimeSlot;
    to?: TTimeSlot;
    breakFrom?: TTimeSlot;
    breakTo?: TTimeSlot;
  };
};

type TRowItem = {
  id: TShift["id"];
  name: string;
  color: string;
  workingSlots: number[];
  breakSlots: number[];
  _initial: TShift;
};

const OperationHours = () => {
  const t = useTranslations();
  const { companyId } = useGetCompanyId();

  const form = useForm<CreateUpdateOpeationHour>({
    mode: "onChange",
  });

  const [paginationModel, setPaginationModel] = useState({
    pageSize: 50,
    page: 0,
  });

  const [firstLoading, setFirstLoading] = useState(true);

  const [isOpenCreateModal, setIsOpenCreateModal] = useState(false);
  const [isOpenUpdateModal, setIsOpenUpdateModal] = useState(false);
  const [shiftIdDeleteConfirmModal, setShiftIdDeleteConfirmModal] = useState<
    TShift["id"] | null
  >(null);

  const queryClient = useQueryClient();
  const getCompanyDetailsQuery = useGetCompanyDetailsQuery({
    companyId,
  });
  const getCompanyShiftsQuery = useGetCompanyShiftsQuery({
    companyId,
    queryParams: {
      limit: paginationModel.pageSize.toString(),
      offset: (paginationModel.pageSize * paginationModel.page).toString(),
    },
  });
  const createCompanyShiftQuery = useCreateCompanyShiftQuery();
  const updateCompanyShiftQuery = useUpdateCompanyShiftQuery();
  const deleteCompanyShiftQuery = useDeleteCompanyShiftQuery();

  useEffect(() => {
    if (getCompanyShiftsQuery.data) {
      setFirstLoading(false);
    }
  }, [getCompanyShiftsQuery.data]);

  const rows: TRowItem[] = useMemo(() => {
    if (getCompanyShiftsQuery.data) {
      return getCompanyShiftsQuery.data.results
        .filter((shift) => shift.kind === "default" && !shift.specialistId)
        .map<TRowItem>((s) => ({
          _initial: s,
          id: s.id,
          name: s.name,
          color: s.color,
          workingSlots: s.workingSlots,
          breakSlots: s.breakSlots,
        }));
    }

    return [];
  }, [getCompanyShiftsQuery.data]);

  const showCreateModalHandler = () => {
    setIsOpenCreateModal(true);
  };

  const hideCreateModalHandler = () => {
    form.reset();

    setIsOpenCreateModal(false);
  };

  const hideUpdateModalHandler = () => {
    form.reset();

    setIsOpenUpdateModal(false);
  };

  const showUpdateModalHandler = useCallback(
    (rowData: TRowItem) => {
      form.setValue("id", rowData.id);
      form.setValue("name", rowData.name);
      form.setValue("color", rowData.color);

      const slotManager = new TimeManager();
      const from = slotManager.SLOTS.find((s) => s.slot === rowData.workingSlots[0]);
      const to = slotManager.SLOTS.find(
        (s) => s.slot === rowData.workingSlots[rowData.workingSlots.length - 1]
      );
      const breakFrom = slotManager.SLOTS.find((s) => s.slot === rowData.breakSlots[0]);
      const breakTo = slotManager.SLOTS.find(
        (s) => s.slot === rowData.breakSlots[rowData.breakSlots.length - 1]
      );

      form.setValue("time.from", from);
      form.setValue("time.to", to);
      form.setValue("time.breakFrom", breakFrom);
      form.setValue("time.breakTo", breakTo);

      setIsOpenUpdateModal(true);
    },
    [form]
  );

  const onSelectRowHandler = useCallback(
    (model: GridRowSelectionModel) => {
      if (model.length) {
        const row = rows.find((r) => r.id === model[0]);

        if (row) {
          showUpdateModalHandler(row);
        }
      }
    },
    [rows, showUpdateModalHandler]
  );

  const createNewOperationHourHandler = async (formData: CreateUpdateOpeationHour) => {
    try {
      const slotManager = new TimeManager();
      const body = {
        name: formData.name,
        description: `${formData.name} shift`,
        color: formData.color,
        workingSlots:
          formData.time.from && formData.time.to
            ? slotManager.getSlotsInRange(formData.time.from.slot, formData.time.to.slot)
            : [],
        breakSlots:
          formData.time.breakFrom && formData.time.breakTo
            ? slotManager.getSlotsInRange(
                formData.time.breakFrom.slot,
                formData.time.breakTo.slot
              )
            : [],
      };

      const { data } = await createCompanyShiftQuery.mutateAsync({
        companyId,
        body,
      });

      if (data) {
        hideCreateModalHandler();
        toaster.success("Operation hour created successfully");
      }
    } catch (error) {
      toaster.error(t("ui.errors.wentWrong"));
    }
  };

  const updateOpearationHourHandler = async (formData: CreateUpdateOpeationHour) => {
    try {
      const slotManager = new TimeManager();
      const body = {
        name: formData.name,
        description: `${formData.name} shift`,
        color: formData.color,
        workingSlots:
          formData.time.from && formData.time.to
            ? slotManager.getSlotsInRange(formData.time.from.slot, formData.time.to.slot)
            : [],
        breakSlots:
          formData.time.breakFrom && formData.time.breakTo
            ? slotManager.getSlotsInRange(
                formData.time.breakFrom.slot,
                formData.time.breakTo.slot
              )
            : [],
      };

      const { data } = await updateCompanyShiftQuery.mutateAsync({
        companyId,
        shiftId: formData.id,
        body,
      });

      if (data) {
        void queryClient.refetchQueries({ queryKey: ["shifts", companyId] });
        hideUpdateModalHandler();
        toaster.success("Operation hour updated successfully");
      }
    } catch (error) {
      toaster.error(t("ui.errors.wentWrong"));
    }
  };

  const deleteOpearationHourHandler = async () => {
    try {
      if (shiftIdDeleteConfirmModal) {
        await deleteCompanyShiftQuery.mutateAsync({
          companyId,
          shiftId: shiftIdDeleteConfirmModal,
        });
        setShiftIdDeleteConfirmModal(null);
        toaster.success("Operation hour deleted");
      }
    } catch (error) {
      toaster.error(t("ui.errors.wentWrong"));
    }
  };

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: "name",
        headerName: t("staffManagement.operationHours.table.headerLabels.name"),
        minWidth: 150,
        flex: 0.2,
        renderCell: ({ value }) => {
          return (
            <div className="h-full flex items-center text-base font-bold">{value}</div>
          );
        },
      },
      {
        field: "workingSlots",
        headerName: t("staffManagement.operationHours.table.headerLabels.time"),
        type: "string",
        minWidth: 150,
        flex: 0.2,
        renderCell: (params) => {
          const value = params.value as TRowItem["workingSlots"];
          const from = value[0];
          const to = value[value.length - 1];

          const fullSlots = new TimeManager().getFullSlotsInRange(from, to);

          const fullFrom = fullSlots[0];
          const fullTo = fullSlots[fullSlots.length - 1];

          if (fullFrom && fullTo) {
            return (
              <Badge text={`${fullFrom.label} - ${fullTo.label}`} variant="working" />
            );
          }

          return <Badge text="Off" variant="neutral" />;
        },
      },
      {
        field: "breakSlots",
        headerName: t("staffManagement.operationHours.table.headerLabels.breakTime"),
        type: "string",
        minWidth: 150,
        flex: 0.2,
        renderCell: (params) => {
          const value = params.value as TRowItem["breakSlots"];
          const from = value[0];
          const to = value[value.length - 1];

          const fullSlots = new TimeManager().getFullSlotsInRange(from, to);

          const fullFrom = fullSlots[0];
          const fullTo = fullSlots[fullSlots.length - 1];

          if (fullFrom && fullTo) {
            return <Badge text={`${fullFrom.label} - ${fullTo.label}`} variant="break" />;
          }

          return <Badge text="Off" variant="neutral" />;
        },
      },
      {
        field: "color",
        headerName: "Color",
        type: "string",
        minWidth: 150,
        flex: 0.2,
        renderCell: (params) => {
          const color = params.value as TRowItem["color"];
          const row = params.row as TRowItem;

          return <Badge text={row.name} variant="shift" color={color} />;
        },
      },
      {
        field: "actions",
        headerName: t("staffManagement.operationHours.table.headerLabels.action"),
        type: "actions",
        minWidth: 100,
        flex: 0.1,
        renderCell: ({ row }) => {
          return (
            <div className="w-auto flex items-center gap-2">
              <Button
                className="w-9 h-9 p-0"
                variant="resting-active"
                onClick={() => showUpdateModalHandler(row as TRowItem)}
              >
                <EditIcon className="w-5 h-5" />
              </Button>
              <Button
                className="w-9 h-9 p-0"
                variant="resting-active"
                onClick={() => setShiftIdDeleteConfirmModal((row as TRowItem).id)}
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

  const rowsCount = useMemo(() => {
    if (getCompanyShiftsQuery.data?.count) {
      return getCompanyShiftsQuery.data.count;
    }

    return 0;
  }, [getCompanyShiftsQuery.data?.count]);

  const formValues = useWatch({ control: form.control });
  const actionBtnIsDisabled =
    !formValues.name ||
    !formValues.color ||
    !formValues.time?.from ||
    !formValues.time?.to;

  if (firstLoading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center">
        <Player src={BlackLogoAnimation} autoplay loop className="w-[200px] h-[200px]" />
      </div>
    );
  }

  if (!rows.length) {
    return (
      <>
        <CreateUpdateModal
          companyWorkingSchedule={getCompanyDetailsQuery.data?.workingSchedule}
          headerTitle={t("staffManagement.operationHours.updateModal.createTitle")}
          isOpen={isOpenCreateModal}
          form={form}
          handleClose={hideCreateModalHandler}
          actionButton={
            <Button
              className="flex items-center gap-3"
              variant="dark"
              onClick={form.handleSubmit(createNewOperationHourHandler)}
              disabled={actionBtnIsDisabled || createCompanyShiftQuery.isPending}
            >
              <PlusRight />
              <p className="text-sm text-white ">
                {t("staffManagement.operationHours.createNewBtn")}
              </p>
            </Button>
          }
        />
        <div className="w-full h-full flex flex-col items-center justify-center">
          <div>
            <Image
              src={ListIsEmptyPlaceholderImage as string}
              alt="No employees found?"
            />
          </div>
          <h4 className="text-[32px] font-bold text-center">
            {t("staffManagement.operationHours.empty.title")}
          </h4>
          <p className="mt-3 text-sm text-center text-greyPrimary">
            {t.rich("staffManagement.operationHours.empty.subTitle", {
              br: () => <br />,
            })}
          </p>
          <Button
            className="mt-6 flex items-center gap-3"
            variant="dark"
            onClick={() => setIsOpenCreateModal(true)}
            disabled={createCompanyShiftQuery.isPending}
          >
            <PlusRight />
            <p className="text-sm text-white">
              {t("staffManagement.operationHours.createNewBtn")}
            </p>
          </Button>
        </div>
      </>
    );
  }

  return (
    <>
      <CreateUpdateModal
        companyWorkingSchedule={getCompanyDetailsQuery.data?.workingSchedule}
        headerTitle={t("staffManagement.operationHours.updateModal.createTitle")}
        isOpen={isOpenCreateModal}
        form={form}
        handleClose={hideCreateModalHandler}
        actionButton={
          <Button
            className="flex items-center gap-3"
            variant="dark"
            onClick={form.handleSubmit(createNewOperationHourHandler)}
            disabled={actionBtnIsDisabled || createCompanyShiftQuery.isPending}
          >
            <PlusRight />
            <p className="text-sm text-white ">
              {t("staffManagement.operationHours.createNewBtn")}
            </p>
          </Button>
        }
      />
      <CreateUpdateModal
        companyWorkingSchedule={getCompanyDetailsQuery.data?.workingSchedule}
        headerTitle={t("staffManagement.operationHours.updateModal.updateTitle")}
        isOpen={isOpenUpdateModal}
        form={form}
        handleClose={hideUpdateModalHandler}
        actionButton={
          <Button
            className="flex items-center gap-3"
            variant="dark"
            onClick={form.handleSubmit(updateOpearationHourHandler)}
            disabled={actionBtnIsDisabled || updateCompanyShiftQuery.isPending}
          >
            <PlusRight />
            <p className="text-sm text-white ">{t("ui.actions.update")}</p>
          </Button>
        }
      />
      <ConfirmationModal
        isOpen={Boolean(shiftIdDeleteConfirmModal)}
        title={t("staffManagement.operationHours.deleteModal.title")}
        subTitle={t("staffManagement.operationHours.deleteModal.subTitle")}
        pozitiveHandler={deleteOpearationHourHandler}
        negativeHandler={() => setShiftIdDeleteConfirmModal(null)}
      />
      <div className="w-full h-full flex flex-col px-7 pt-6 pb-4 rounded-xl bg-white sm:px-5 sm:py-6">
        <div className="flex items-center justify-end">
          <Button
            className="flex items-center gap-3"
            variant="dark"
            onClick={showCreateModalHandler}
          >
            <PlusRight />
            <p className="text-sm text-white ">
              {t("staffManagement.operationHours.createNewBtn")}
            </p>
          </Button>
        </div>
        <div className="flex mt-9 rounded-xl h-full sm:mt-5">
          <Table
            _enablePagination
            _onSelectRowModel={onSelectRowHandler}
            rows={rows}
            rowCount={rowsCount}
            columns={columns}
            paginationModel={paginationModel}
            paginationMode="server"
            onPaginationModelChange={setPaginationModel}
            rowSelection={true}
            loading={
              getCompanyShiftsQuery.isPending ||
              createCompanyShiftQuery.isPending ||
              updateCompanyShiftQuery.isPending ||
              deleteCompanyShiftQuery.isPending
            }
          />
        </div>
      </div>
    </>
  );
};

export default OperationHours;
