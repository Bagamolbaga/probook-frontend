import { FC, useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { FormControl } from "@mui/material";
import { useTranslations } from "next-intl";

import { useGetCompanyDetailsQuery } from "@/api/queries/company";
import { useGetAllBookingsQuery } from "@/api/queries/booking";
import {
  useCreateCompanyShiftQuery,
  useUpdateCompanyShiftQuery,
} from "@/api/queries/company/shift";
import Button from "@/components/ui/button";
import CloseIcon from "@/components/ui/icons/Close";
import AppSelect from "@/components/ui/inputs/AppSelect";
import Modal from "@/components/ui/modal";
import { toaster } from "@/components/ui/toaster";
import { FormattedDataItem } from "..";
import { TimeSlotsManager } from "@/utils/timeSlotManager";
import { cn } from "@/utils/cn";
import { TIME_SLOTS, TTimeSlot } from "@/constants/timeSlots";
import { TimeManager } from "@/utils/timeManager";
import { SHIFT_COLORS } from "@/constants/shiftColors";
import { TCreateCompanyShift, TUpdateCompanyShift } from "@/api/entities/company/shift";
import { useGetCompanyId } from "@/hooks/useGetCompanyId";
import { format } from "date-fns";

const POPUP_MAX_HEIGHT = 505;

type Props = {
  isOpen: boolean;
  row: FormattedDataItem;
  currentDate: Date;
  handleClose: () => void;
};

type Form = {
  breakFrom?: TTimeSlot;
  breakTo?: TTimeSlot;
};

const ChangeDailyBreakTimePopup: FC<Props> = ({
  isOpen,
  row,
  currentDate,
  handleClose,
}) => {
  const t = useTranslations();
  const { companyId } = useGetCompanyId();

  const form = useForm<Form>({
    defaultValues: async () => {
      const tm = new TimeManager();
      const times = tm.getWorkingScheduleSlotsByWeekDay({
        workingSchedule:
          row.customWorkingShift?.working_schedule ||
          row.specialist.default_shift.working_schedule,
        date: currentDate,
      });

      return {
        breakFrom: times?.breaks[0],
        breakTo: times?.breaks.at(-1),
      };
    },
  });

  const getCompanyDetailsQuery = useGetCompanyDetailsQuery({
    companyId,
  });

  const getAllBookingsQuery = useGetAllBookingsQuery({
    companyId,
    queryParams: {
      start_date: currentDate,
      end_date: currentDate,
      limit: 50,
      offset: 0,
    },
  });

  const createCompanyShiftQuery = useCreateCompanyShiftQuery();
  const updateCompanyShiftQuery = useUpdateCompanyShiftQuery();

  // useEffect(() => {
  //   let breakSlots = row.specialist.default_shift.daily_break;

  //   if (row.customWorkingShift) {
  //     breakSlots = row.customWorkingShift.daily_break;
  //   }

  //   const fullFromSlot = TIME_SLOTS.find((s) => s.slot === breakSlots[0]);
  //   const fullToSlot = TIME_SLOTS.find(
  //     (s) => s.slot === breakSlots[breakSlots.length - 1]
  //   );
  //   fullFromSlot && form.setValue("breakFrom", fullFromSlot);
  //   fullToSlot && form.setValue("breakTo", fullToSlot);
  // }, [row.specialist.default_shift, row.customWorkingShift]);

  const createCustomShiftHandler = async () => {
    try {
      const bodyData: TCreateCompanyShift["body"] = {
        name: "CUSTOM",
        description: "desc",
        description_thai: "desc",
        date: currentDate,
        color: SHIFT_COLORS.at(-1)!,
        specialist: row.specialist.id,
        working_schedule: {} as WorkingSchedule,
      };

      const tm = new TimeManager();
      const timeSlots = tm.getWorkingScheduleSlotsByWeekDay({
        workingSchedule: row.specialist.default_shift.working_schedule,
        date: currentDate,
      });
      const breakSlots = tm.getSlotsInRange(
        form.watch("breakFrom.slot"),
        form.watch("breakTo.slot")
      );

      bodyData.working_schedule = tm.createWorkingScheduleFromSlots({
        workingDays: [format(currentDate, "EEEE") as keyof WorkingSchedule],
        slots: timeSlots?.slots.map((s) => s.slot) || [],
        breaks: breakSlots,
      });

      const { status } = await createCompanyShiftQuery.mutateAsync({
        companyId,
        body: bodyData,
      });

      if (status === 201) {
        toaster.success("Daily break changed");
        handleClose();
      }
    } catch (error) {
      toaster.error("Something went wrong");
    }
  };

  const updateCustomShiftHandler = async () => {
    try {
      const bodyData: TUpdateCompanyShift["body"] = {
        name: "CUSTOM",
        description: "desc",
        description_thai: "desc",
        date: currentDate,
        specialist: row.specialist.id,
        working_schedule: {} as WorkingSchedule,
      };

      const tm = new TimeManager();
      const timeSlots = tm.getWorkingScheduleSlotsByWeekDay({
        workingSchedule:
          row.customWorkingShift?.working_schedule ||
          row.specialist.default_shift.working_schedule,
        date: currentDate,
      });
      const breakSlots = tm.getSlotsInRange(
        form.watch("breakFrom.slot"),
        form.watch("breakTo.slot")
      );

      bodyData.working_schedule = tm.createWorkingScheduleFromSlots({
        workingDays: [format(currentDate, "EEEE") as keyof WorkingSchedule],
        slots: timeSlots?.slots.map((s) => s.slot) || [],
        breaks: breakSlots,
      });

      const { status } = await updateCompanyShiftQuery.mutateAsync({
        companyId,
        shiftId: row.customWorkingShift!.id,
        body: bodyData,
      });

      if (status === 200) {
        toaster.success("Daily break changed");
        handleClose();
      }
    } catch (error) {
      toaster.error("Something went wrong");
    }
  };

  const mainActionHandler = async () => {
    if (row.customWorkingShift) {
      await updateCustomShiftHandler();
    } else {
      await createCustomShiftHandler();
    }
  };

  const allBookings = useMemo(() => {
    let arr: TBooking[] = [];

    getAllBookingsQuery.forEach((q) => {
      if (q.data?.results) {
        arr = [...arr, ...q.data.results];
      }
    });

    return arr.filter((b) => b.specialist.id === row.specialist.id);
  }, [getAllBookingsQuery, row]);

  const currentShift = useMemo(() => {
    if (row.customWorkingShift) {
      return row.customWorkingShift;
    }

    return row.specialist.default_shift;
  }, [row]);

  const companyWorkingTimeSlots = useMemo(() => {
    const workingSchedule = getCompanyDetailsQuery?.data?.working_schedule;

    if (workingSchedule) {
      const slotManager = new TimeManager();
      const slots = slotManager
        .getWorkingTimeSlotsCompany(workingSchedule)
        .filter((s) => s.minute === 0 || s.minute === 30);

      return slots;
    }

    return [];
  }, [getCompanyDetailsQuery?.data?.working_schedule]);

  const alreadyUsedSlots = useMemo(() => {
    const tm = new TimeManager();
    const timeSlotsAlreadyUsed = tm.getAlreadyUsedSlotsInBookings({
      bookings: allBookings.map((b) => {
        // if (b.slots[0] === currentShift.slots[0]) {
        //   return { ...b, slots: b.slots.slice(1) };
        // }

        return { ...b, slots: b.slots.slice(1, -1) };
      }),
      date: currentDate,
      staffId: row.specialist.id,
    });

    const timeSlotsAlreadyUsedWithTimeBreaks = [...timeSlotsAlreadyUsed].sort(
      (a, b) => a - b
    );

    return timeSlotsAlreadyUsedWithTimeBreaks;
  }, [allBookings, companyWorkingTimeSlots, currentShift]);

  const breakTimeOptions = useMemo(() => {
    const fullSlots = new TimeManager().getFullSlotsFromArr(
      new TimeManager()
        .getWorkingScheduleFirstWeekDaySlots(currentShift.working_schedule)
        .workings.map((s) => s.slot)
    );

    return fullSlots.filter((s) => !alreadyUsedSlots.includes(s.slot) && s.minute === 0);
  }, [alreadyUsedSlots, currentShift]);

  const selectedBreakTimeOption = useMemo(() => {
    const from = form.watch("breakFrom");
    const to = form.watch("breakTo");

    const fullFrom = from && { ...from, id: from.label };
    const fullTo = to && { ...to, id: to.label };

    return {
      fullFrom,
      fullTo,
      fromOptions: breakTimeOptions.map((s) => ({ ...s, id: s.label })),
      toOptions: breakTimeOptions.map((s) => ({ ...s, id: s.label })),
    };
  }, [breakTimeOptions, form.watch("breakFrom"), form.watch("breakTo")]);

  const breakFromIsError = () => {
    const breakFrom = form.watch("breakFrom");
    const breakTo = form.watch("breakTo");

    if (!breakFrom) return true;

    if (breakFrom && breakTo && breakFrom.slot === breakTo.slot) return true;

    if (breakFrom && breakTo && breakFrom.slot > breakTo.slot) return true;

    if (breakFrom && breakTo) {
      return !!alreadyUsedSlots.filter((s) => s >= breakFrom.slot && s <= breakTo.slot)
        .length;
    }

    return false;
  };

  const breakToIsError = () => {
    const breakFrom = form.watch("breakFrom");
    const breakTo = form.watch("breakTo");

    if (!breakTo) return true;

    if (breakTo && breakFrom && breakFrom.slot === breakTo.slot) return true;

    if (breakTo && breakFrom && breakTo.slot < breakFrom.slot) return true;

    if (breakFrom && breakTo) {
      return !!alreadyUsedSlots.filter((s) => s >= breakFrom.slot && s <= breakTo.slot)
        .length;
    }

    return false;
  };

  return (
    <Modal isOpen={isOpen} handleClose={handleClose}>
      <div
        className={cn(
          "relative w-[320px] h-fit p-4 rounded-lg shadow-secondary bg-white"
        )}
      >
        <div className="flex justify-between items-center">
          <span className="text-sm font-bold text-greyPrimary">Change Break Time</span>
          <Button className="size-8 p-0" variant="resting-active" onClick={handleClose}>
            <CloseIcon className="w-5 h-5 stroke-greyPrimary" />
          </Button>
        </div>
        <div className="mt-4 flex flex-col gap-3">
          <div className="flex flex-col">
            <p className="mb-1 text-sm text-greyPrimary">From time</p>
            <FormControl fullWidth>
              <Controller
                render={() => (
                  <AppSelect
                    id={"breakFrom"}
                    classNames={{
                      selectContainer: "w-full",
                    }}
                    selectDropdownPosition="top"
                    options={selectedBreakTimeOption.fromOptions}
                    selectedOption={selectedBreakTimeOption.fullFrom}
                    setValue={form.setValue}
                    renderOption={(option) => (
                      <p className={cn("text-sm")}>{option.label}</p>
                    )}
                    renderOptionSelected={(option) => (
                      <p className={cn("text-sm")}>{option ? option.label : "Break"}</p>
                    )}
                    renderEmptyOption={() => (
                      <div className="py-[6px] pl-2 pr-1">
                        <p className={"text-sm text-greyPrimary"}>No option</p>
                      </div>
                    )}
                    error={breakFromIsError()}
                  />
                )}
                name={"breakFrom"}
                rules={{ required: true }}
                control={form.control}
              />
            </FormControl>
          </div>
          <div className="flex flex-col">
            <p className="mb-1 text-sm text-greyPrimary">To time</p>
            <FormControl fullWidth>
              <Controller
                render={() => (
                  <AppSelect
                    id={"breakTo"}
                    classNames={{
                      selectContainer: "w-full",
                    }}
                    selectDropdownPosition="top"
                    options={selectedBreakTimeOption.toOptions}
                    selectedOption={selectedBreakTimeOption.fullTo}
                    setValue={form.setValue}
                    renderOption={(option) => (
                      <p className={cn("text-sm")}>{option.label}</p>
                    )}
                    renderOptionSelected={(option) => (
                      <p className={cn("text-sm")}>{option ? option.label : "Break"}</p>
                    )}
                    renderEmptyOption={() => (
                      <div className="py-[6px] pl-2 pr-1">
                        <p className={"text-sm text-greyPrimary"}>No option</p>
                      </div>
                    )}
                    error={breakToIsError()}
                  />
                )}
                name={"breakTo"}
                rules={{ required: true }}
                control={form.control}
              />
            </FormControl>
          </div>
        </div>

        <div className="mt-6 flex justify-between gap-2">
          <Button className="w-full h-9 p-0" variant="resting" onClick={handleClose}>
            {t("ui.actions.cancel")}
          </Button>
          <Button
            className="w-full h-9 p-0"
            variant="dark"
            disabled={
              breakFromIsError() ||
              breakToIsError() ||
              createCompanyShiftQuery.isPending ||
              updateCompanyShiftQuery.isPending
            }
            onClick={form.handleSubmit(mainActionHandler)}
          >
            {t("ui.actions.save")}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ChangeDailyBreakTimePopup;
