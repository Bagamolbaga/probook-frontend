/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import Button from "@/components/ui/button";
import PlusRight from "@/components/ui/icons/Plus";
import UserNameWithAvatar from "@/components/ui/table/customCells/UserNameWithAvatar";
import EditIcon from "@/components/ui/icons/Edit";
import DeleteIcon from "@/components/ui/icons/Delete";
import {
  useCreateCompanySpecialistsQuery,
  useDeleteCompanySpecialistsQuery,
  useGetCompanySpecialistsQuery,
  useUpdateCompanySpecialistsQuery,
} from "@/api/queries/company/specialists";
import { useCallback, useEffect, useMemo, useState } from "react";
import CreateUpdateSpecialistModal from "./components/CreateNewSpecialistModal";
import { useForm } from "react-hook-form";
import ListIsEmptyPlaceholderImage from "@/assets/staffManagement/SpecialistListEmptyOverlay.svg";
import Image from "next/image";
import { Player } from "@lottiefiles/react-lottie-player";
import BlackLogoAnimation from "@/assets/lottiefiles/blackLogoAnimation.json";
import { toaster } from "@/components/ui/toaster";
import ConfirmationModal from "@/components/ui/modal/ConfirmationModal";
import { useTranslations } from "next-intl";
import TableDefaultShift from "./components/TableDefaultShift";
import {
  useCreateCompanyShiftQuery,
  useGetCompanyShiftsQuery,
  useUpdateCompanyShiftQuery,
} from "@/api/queries/company/shift";
import { SHIFT_COLORS } from "@/constants/shiftColors";
import { useGetCompanyDetailsQuery } from "@/api/queries/company";
import { useGetCompanyId } from "@/hooks/useGetCompanyId";
import Table from "@/components/ui/table";
import { TCreateCompanySpecialistsArgs } from "@/api/entities/company";
import { TimeManager } from "@/utils/timeManager";

export type CreateSpecialistForm = {
  _specialistId?: string;
  avatar?: string;
  firstName: string;
  lastName: string;
  email: string;
  shift: TShift & {
    workingScheduleWithFromTo: WorkingScheduleWithTimeSlots;
  };
};

type TRowItem = {
  id: string;
  name: {
    name: string;
    avatar: string | null;
  };
  firstName: string;
  lastName: string;
  email: string;
  defaultShift: TShift | null;
};

const StaffListTable = () => {
  const t = useTranslations();
  const { companyId } = useGetCompanyId();

  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });
  const [firstLoading, setFirstLoading] = useState(true);
  const [remainingStaffLimit, setRemainingStaffLimit] = useState<{
    limit: number;
    currentlyAdded: number;
    remaining: number;
  } | null>(null);

  const getCompanyDetailsQuery = useGetCompanyDetailsQuery({ companyId });

  const getCompanySpecialistsQuery = useGetCompanySpecialistsQuery({
    companyId,
    queryParams: {
      limit: paginationModel.pageSize.toString(),
      offset: (paginationModel.pageSize * paginationModel.page).toString(),
    },
  });
  const getCompanyShiftsQuery = useGetCompanyShiftsQuery({ companyId });
  const createCompanyShiftQuery = useCreateCompanyShiftQuery();
  const updateCompanyShiftQuery = useUpdateCompanyShiftQuery();

  const createCompanySpecialistsQuery = useCreateCompanySpecialistsQuery();
  const updateCompanySpecialistsQuery = useUpdateCompanySpecialistsQuery();
  const deleteCompanySpecialistsQuery = useDeleteCompanySpecialistsQuery();

  const [isOpenCreateModal, setIsOpenCreateModal] = useState(false);
  const [isOpenUpdateModal, setIsOpenUpdateModal] = useState(false);
  const [specialistIdDeleteConfirmModal, setSpecialistIdDeleteConfirmModal] = useState<
    string | null
  >(null);

  const createSpecialistForm = useForm<CreateSpecialistForm>({ mode: "onChange" });

  useEffect(() => {
    if (getCompanySpecialistsQuery.data) {
      setFirstLoading(false);
    }
  }, [getCompanySpecialistsQuery.data]);

  useEffect(() => {
    if (getCompanyDetailsQuery.data && getCompanySpecialistsQuery.data) {
      const numEmployees = Number(getCompanyDetailsQuery.data.staffLimit);

      if (isNaN(numEmployees)) {
        setRemainingStaffLimit(null);
      }

      setRemainingStaffLimit({
        limit: numEmployees,
        currentlyAdded: getCompanySpecialistsQuery.data.count,
        remaining: Math.max(...[0, numEmployees - getCompanySpecialistsQuery.data.count]),
      });
    }
  }, [getCompanySpecialistsQuery.data, getCompanyDetailsQuery.data]);

  const rows: TRowItem[] = useMemo(() => {
    if (getCompanySpecialistsQuery.data?.results) {
      return getCompanySpecialistsQuery.data.results.map((specialist) => {
        const populatedDefaultShift =
          specialist.defaultShift && typeof specialist.defaultShift === "object"
            ? specialist.defaultShift
            : null;
        const defaultShiftId =
          typeof specialist.defaultShift === "string"
            ? specialist.defaultShift
            : populatedDefaultShift?.id;
        const defaultShift =
          populatedDefaultShift ||
          getCompanyShiftsQuery.data?.results.find(
            (shift) => String(shift.id) === defaultShiftId
          ) ||
          null;

        return {
          id: specialist.id,
          name: {
            name:
              specialist.fullName ||
              `${specialist.firstName} ${specialist.lastName}`.trim(),
            avatar: specialist.avatar || null,
          },
          firstName: specialist.firstName,
          lastName: specialist.lastName,
          email: specialist.email,
          defaultShift,
        } satisfies TRowItem;
      });
    }

    return [];
  }, [getCompanySpecialistsQuery.data, getCompanyShiftsQuery.data]);

  const showCreateModalHandler = () => {
    setIsOpenCreateModal(true);
  };

  const hideCreateModalHandler = () => {
    createSpecialistForm.reset();

    setIsOpenCreateModal(false);
  };

  const hideUpdateModalHandler = () => {
    createSpecialistForm.reset();

    setIsOpenUpdateModal(false);
  };

  const showUpdateModalHandler = useCallback(
    (rowData: TRowItem) => {
      createSpecialistForm.setValue("_specialistId", rowData.id);
      rowData.name.avatar && createSpecialistForm.setValue("avatar", rowData.name.avatar);
      createSpecialistForm.setValue("firstName", rowData.firstName);
      createSpecialistForm.setValue("lastName", rowData.lastName);
      createSpecialistForm.setValue("email", rowData.email);

      if (rowData.defaultShift) {
        const tm = new TimeManager();
        createSpecialistForm.setValue("shift", {
          ...rowData.defaultShift,
          workingScheduleWithFromTo: tm.getWorkingScheduleWithFromAndToPropertys(
            rowData.defaultShift.working_schedule
          ),
        });
      } else {
        createSpecialistForm.resetField("shift");
      }

      setIsOpenUpdateModal(true);
    },
    [createSpecialistForm]
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

  const createNewSpecialistHandler = async (
    formData: CreateSpecialistForm,
    customShiftId?: TShift["id"]
  ) => {
    try {
      const bodyDefaultData: TCreateCompanySpecialistsArgs["data"] = {
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        defaultShift: String(customShiftId || formData.shift.id),
        services: [],
      };

      const { data } = await createCompanySpecialistsQuery.mutateAsync({
        data: bodyDefaultData,
      });

      if (data) {
        hideCreateModalHandler();
        toaster.success("Specialist created");
      }
    } catch (error) {
      toaster.error(t("ui.errors.wentWrong"));
    }
  };

  const updateSpecialistHandler = async (
    formData: CreateSpecialistForm,
    customShiftId?: TShift["id"]
  ) => {
    try {
      const initData = getCompanySpecialistsQuery.data?.results.find(
        (s) => s.id === formData._specialistId
      );

      if (initData && formData._specialistId) {
        const body = {
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          defaultShift: String(customShiftId || formData.shift.id),
        };

        const { data } = await updateCompanySpecialistsQuery.mutateAsync({
          specialistId: formData._specialistId,
          data: body,
        });
        if (data) {
          hideUpdateModalHandler();
          toaster.success("Specialist updated");
        }
      }
    } catch (error) {
      toaster.error(t("ui.errors.wentWrong"));
    }
  };

  const createCustomShift = async ({
    workingScheduleWithFromTo,
  }: {
    workingScheduleWithFromTo: WorkingScheduleWithTimeSlots;
  }) => {
    try {
      const body = {
        name: "CUSTOM",
        description: "custom",
        description_thai: "custom",
        color: SHIFT_COLORS.at(-1)!,
        working_schedule: {} as WorkingSchedule,
        is_default: false, //Operation Hours if true
      };

      const tm = new TimeManager();

      Object.entries(workingScheduleWithFromTo || {}).forEach(([weekDay, value]) => {
        const slots =
          value.slots.from && value.slots.to
            ? tm.getSlotsInRange(value.slots.from.slot, value.slots.to.slot)
            : [];

        const breaks =
          value.breaks.from && value.breaks.to
            ? tm.getSlotsInRange(value.breaks.from.slot, value.breaks.to.slot)
            : [];

        body.working_schedule[weekDay as keyof WorkingSchedule] = {
          slots,
          breaks,
        };
      });

      const firstWorkingDay = tm.getWorkingScheduleFirstWeekDaySlots(
        body.working_schedule
      );

      const res = await createCompanyShiftQuery.mutateAsync({
        companyId,
        body: {
          name: body.name,
          description: body.description,
          color: body.color,
          workingSlots: firstWorkingDay.workings.map((slot) => slot.slot),
          breakSlots: firstWorkingDay.breaks.map((slot) => slot.slot),
        },
      });

      if (res.data) {
        return res.data.shift;
      }
    } catch (error) {
      toaster.error("Something went wrong");
    }
  };

  const updateCustomShift = async ({
    workingScheduleWithFromTo,
    shiftId,
  }: {
    workingScheduleWithFromTo: WorkingScheduleWithTimeSlots;
    shiftId: TShift["id"];
  }) => {
    try {
      const body = {
        name: "CUSTOM",
        description: "custom",
        description_thai: "custom",
        color: SHIFT_COLORS.at(-1)!,
        working_schedule: {} as WorkingSchedule,
        is_default: false, //Operation Hours if true
      };

      const tm = new TimeManager();

      Object.entries(workingScheduleWithFromTo || {}).forEach(([weekDay, value]) => {
        const slots =
          value.slots.from && value.slots.to
            ? tm.getSlotsInRange(value.slots.from.slot, value.slots.to.slot)
            : [];

        const breaks =
          value.breaks.from && value.breaks.to
            ? tm.getSlotsInRange(value.breaks.from.slot, value.breaks.to.slot)
            : [];

        body.working_schedule[weekDay as keyof WorkingSchedule] = {
          slots,
          breaks,
        };
      });

      const firstWorkingDay = tm.getWorkingScheduleFirstWeekDaySlots(
        body.working_schedule
      );

      const res = await updateCompanyShiftQuery.mutateAsync({
        companyId,
        shiftId,
        body: {
          name: body.name,
          description: body.description,
          color: body.color,
          workingSlots: firstWorkingDay.workings.map((slot) => slot.slot),
          breakSlots: firstWorkingDay.breaks.map((slot) => slot.slot),
        },
      });

      if (res.data) {
        return res.data.shift;
      }
    } catch (error) {
      toaster.error("Something went wrong");
    }
  };

  const createSpecialistMainHandler = async (formData: CreateSpecialistForm) => {
    if (formData.shift.id === -1) {
      //Selected custom time
      const newShift = await createCustomShift({
        workingScheduleWithFromTo: formData.shift.workingScheduleWithFromTo,
      });
      if (newShift) {
        await createNewSpecialistHandler(formData, newShift.id);
      }
    } else {
      await createNewSpecialistHandler(formData);
    }
  };

  const updateSpecialistMainHandler = async (formData: CreateSpecialistForm) => {
    const rowData = rows.find((item) => item.id === formData._specialistId);

    if (rowData && formData._specialistId) {
      if (formData.shift.id === -1) {
        //Selected custom time
        const newShift = await createCustomShift({
          workingScheduleWithFromTo: formData.shift.workingScheduleWithFromTo,
        });

        if (newShift) {
          await updateSpecialistHandler(formData, newShift.id);
        }
      } else if (formData.shift.name === "CUSTOM") {
        //update shift
        //update staff
        await updateCustomShift({
          workingScheduleWithFromTo: formData.shift.workingScheduleWithFromTo,
          shiftId: formData.shift.id,
        });
        await updateSpecialistHandler(formData, formData.shift.id);
      } else {
        await updateSpecialistHandler(formData);
      }
    }
  };

  const deleteCompanySpecialistsHandler = async () => {
    try {
      if (specialistIdDeleteConfirmModal) {
        await deleteCompanySpecialistsQuery.mutateAsync({
          specialistId: specialistIdDeleteConfirmModal,
        });
        setSpecialistIdDeleteConfirmModal(null);
        toaster.success("Specialist deleted");
      }
    } catch (error) {
      toaster.error(t("ui.errors.wentWrong"));
    }
  };

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: "name",
        headerName: t("staffManagement.staffList.table.headerLabels.name"),
        minWidth: 150,
        flex: 0.2,
        renderCell: ({ value }) => {
          return <UserNameWithAvatar name={value.name} avatar={value.avatar} />;
        },
      },
      {
        field: "email",
        headerName: t("staffManagement.staffList.table.headerLabels.email"),
        type: "string",
        minWidth: 200,
        flex: 0.2,
        renderCell: (params) => {
          return <div className="h-full flex items-center text-base">{params.value}</div>;
        },
      },
      {
        field: "defaultShift",
        headerName: t("staffManagement.staffList.table.headerLabels.defaultShift"),
        type: "string",
        minWidth: 150,
        flex: 0.1,
        renderCell: ({ row }) => {
          if (!row.defaultShift) {
            return <div className="h-full flex items-center text-greyPrimary">—</div>;
          }

          return (
            <TableDefaultShift
              currentShift={row.defaultShift}
              shiftPresets={getCompanyShiftsQuery.data?.results || []}
            />
          );
        },
      },
      // {
      //   field: "work_by",
      //   headerName: "Work by",
      //   type: "string",
      //   flex: 0.1,
      //   renderCell: (params) => {
      //     return (
      //       <div className="h-full flex items-center">
      //         <Badge className="h-8">{params.value}</Badge>
      //       </div>
      //     );
      //   },
      // },
      // {
      //   field: "no_of_client",
      //   headerName: "No. of client",
      //   type: "number",
      //   flex: 0.1,
      //   renderCell: (params) => {
      //     return (
      //       <div className="h-full flex items-center justify-center text-base">
      //         {params.value}
      //       </div>
      //     );
      //   },
      // },
      // {
      //   field: "work_status",
      //   headerName: "Work status",
      //   flex: 0.1,
      //   renderCell: (params) => {
      //     return (
      //       <div className="h-full flex items-center">
      //         <Badge className="h-10" variant="secondary" textBold>
      //           {params.value.name}
      //         </Badge>
      //       </div>
      //     );
      //   },
      // },
      {
        field: "actions",
        headerName: t("staffManagement.staffList.table.headerLabels.action"),
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
                onClick={() => setSpecialistIdDeleteConfirmModal(row.id)}
              >
                <DeleteIcon className="w-5 h-5" />
              </Button>
            </div>
          );
        },
      },
    ],
    [getCompanyShiftsQuery.data, showUpdateModalHandler, t]
  );

  const formData = createSpecialistForm.watch();
  const formIsValid = Boolean(
    formData.firstName && formData.lastName && formData.email && formData.shift
  );
  const createNewStaffBtnIsActive =
    !createCompanySpecialistsQuery.isPending && formIsValid;
  const updateStaffBtnIsActive = !updateCompanySpecialistsQuery.isPending && formIsValid;

  if (firstLoading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center">
        <Player src={BlackLogoAnimation} autoplay loop className="w-[200px] h-[200px]" />
      </div>
    );
  }

  if (
    !getCompanySpecialistsQuery.isPending &&
    !getCompanySpecialistsQuery.data?.results.length
  ) {
    return (
      <>
        <CreateUpdateSpecialistModal
          headerTitle={t("staffManagement.staffList.updateModal.createTitle")}
          isOpen={isOpenCreateModal}
          form={createSpecialistForm}
          handleClose={hideCreateModalHandler}
          actionButton={
            <Button
              className="flex items-center gap-3"
              variant="dark"
              onClick={createSpecialistForm.handleSubmit(createSpecialistMainHandler)}
              disabled={!createNewStaffBtnIsActive}
            >
              <PlusRight />
              <p className="text-sm text-white ">
                {t("staffManagement.staffList.createNewBtn")}
              </p>
            </Button>
          }
        />
        <div className="w-full h-full flex flex-col items-center justify-center">
          <div>
            <Image src={ListIsEmptyPlaceholderImage} alt="No employees found?" />
          </div>
          <h4 className="text-[32px] font-bold text-center">
            {t("staffManagement.staffList.empty.title")}
          </h4>
          <p className="mt-3 text-sm text-center text-greyPrimary">
            {t.rich("staffManagement.staffList.empty.subTitle", {
              br: () => <br />,
            })}
          </p>
          <Button
            className="mt-6 flex items-center gap-3"
            variant="dark"
            onClick={() => setIsOpenCreateModal(true)}
            disabled={createCompanySpecialistsQuery.isPending}
          >
            <PlusRight />
            <p className="text-sm text-white">
              {t("staffManagement.staffList.createNewBtn")}
            </p>
          </Button>
        </div>
      </>
    );
  }

  return (
    <>
      <CreateUpdateSpecialistModal
        headerTitle={t("staffManagement.staffList.updateModal.createTitle")}
        isOpen={isOpenCreateModal}
        form={createSpecialistForm}
        handleClose={hideCreateModalHandler}
        actionButton={
          <Button
            className="flex items-center gap-3"
            variant="dark"
            onClick={createSpecialistForm.handleSubmit(createSpecialistMainHandler)}
            disabled={!createNewStaffBtnIsActive}
          >
            <PlusRight />
            <p className="text-sm text-white ">
              {t("staffManagement.staffList.createNewBtn")}
            </p>
          </Button>
        }
      />
      <CreateUpdateSpecialistModal
        isUpdate
        headerTitle={t("staffManagement.staffList.updateModal.updateTitle")}
        isOpen={isOpenUpdateModal}
        form={createSpecialistForm}
        handleClose={hideUpdateModalHandler}
        actionButton={
          <Button
            className="flex items-center gap-3"
            variant="dark"
            onClick={createSpecialistForm.handleSubmit(updateSpecialistMainHandler)}
            disabled={!updateStaffBtnIsActive}
          >
            <p className="text-sm text-white ">{t("ui.actions.update")}</p>
          </Button>
        }
      />
      <ConfirmationModal
        isOpen={Boolean(specialistIdDeleteConfirmModal)}
        title={t("staffManagement.staffList.deleteModal.title")}
        subTitle={t("staffManagement.staffList.deleteModal.subTitle")}
        pozitiveHandler={deleteCompanySpecialistsHandler}
        negativeHandler={() => setSpecialistIdDeleteConfirmModal(null)}
      />
      <div className="w-full h-full flex flex-col px-7 pt-6 pb-4 rounded-xl bg-white sm:px-5 sm:py-6">
        <div className="flex items-center justify-between sm:flex-col">
          {/* <div className="text-xl font-bold">
            <Button
              className="px-[10px] py-[10px] flex items-center gap-2"
              variant="dark"
              onClick={() => {}}
            >
              <PlusRight />
              <p className="text-sm font-bold text-white">LIST</p>
            </Button>
          </div> */}
          <div className="flex rounded-lg border border-greyOutlineSecondary">
            <div className="p-[10px] border-r border-greyOutlineSecondary">
              <p className="text-sm text-purplePrimary">
                Staff limit: {remainingStaffLimit?.limit}
              </p>
            </div>
            <div className="p-[10px] border-r border-greyOutlineSecondary">
              <p className="text-sm">
                Currently added: {remainingStaffLimit?.currentlyAdded}
              </p>
            </div>
            <div className="p-[10px]">
              <p className="text-sm">
                Remaining: <span className="">{remainingStaffLimit?.remaining}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-5 sm:w-full sm:mt-3 sm:justify-end">
            <Button
              className="flex items-center gap-3"
              variant="dark"
              onClick={showCreateModalHandler}
              disabled={Boolean((remainingStaffLimit?.remaining || 0) <= 0)}
            >
              <PlusRight />
              <p className="text-sm text-white ">
                {t("staffManagement.staffList.createNewBtn")}
              </p>
            </Button>
          </div>
        </div>
        <div className="flex mt-9 rounded-xl h-full sm:mt-5">
          <Table
            autoPageSize
            _enablePagination
            _onSelectRowModel={onSelectRowHandler}
            rows={rows}
            rowCount={getCompanySpecialistsQuery.data?.count}
            columns={columns}
            paginationModel={paginationModel}
            paginationMode="server"
            onPaginationModelChange={setPaginationModel}
            rowSelection={true}
            loading={
              getCompanySpecialistsQuery.isPending ||
              createCompanySpecialistsQuery.isPending ||
              updateCompanySpecialistsQuery.isPending ||
              deleteCompanySpecialistsQuery.isPending
            }
          />
        </div>
      </div>
    </>
  );
};

export default StaffListTable;
