import { FC, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { FormControl } from "@mui/material";
import { format } from "date-fns";
import { useTranslations } from "next-intl";

import type { TCreateCompanyShift } from "@/api/entities/company/shift";
import { useGetBookingsQuery } from "@/api/queries/booking";
import { useGetCompanyDetailsQuery } from "@/api/queries/company";
import {
  useCreateCompanyShiftQuery,
  useUpdateCompanyShiftQuery,
} from "@/api/queries/company/shift";
import Button from "@/components/ui/button";
import CloseIcon from "@/components/ui/icons/Close";
import AppSelect from "@/components/ui/inputs/AppSelect";
import Modal from "@/components/ui/modal";
import { toaster } from "@/components/ui/toaster";
import { TIME_SLOTS, TTimeSlot } from "@/constants/timeSlots";
import { useGetCompanyId } from "@/hooks/useGetCompanyId";
import { cn } from "@/utils/cn";
import { TimeManager } from "@/utils/timeManager";
import type { FormattedDataItem } from "../../components/types";

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
  const timeManager = useMemo(() => new TimeManager(), []);
  const companyQuery = useGetCompanyDetailsQuery({ companyId });
  const bookingsQuery = useGetBookingsQuery({
    companyId,
    queryParams: { start_date: currentDate, end_date: currentDate },
  });
  const createShift = useCreateCompanyShiftQuery();
  const updateShift = useUpdateCompanyShiftQuery();

  const weekDay = format(currentDate, "EEEE") as WorkingScheduleWeekDays;
  const { workingSlots, currentBreakSlots } = useMemo(() => {
    const companyDay = companyQuery.data?.workingSchedule?.[weekDay];
    return {
      workingSlots:
        row.customWorkingShift?.workingSlots || companyDay?.workingSlots || [],
      currentBreakSlots:
        row.customWorkingShift?.breakSlots || companyDay?.breakSlots || [],
    };
  }, [companyQuery.data, row.customWorkingShift, weekDay]);
  const form = useForm<Form>({
    defaultValues: {
      breakFrom: TIME_SLOTS.find((slot) => slot.slot === currentBreakSlots[0]),
      breakTo: TIME_SLOTS.find((slot) => slot.slot === currentBreakSlots.at(-1)),
    },
  });

  const busySlots = useMemo(
    () =>
      timeManager.getAlreadyUsedSlotsInBookings({
        bookings: bookingsQuery.data?.results || [],
        date: currentDate,
        staffId: row.specialist.id,
      }),
    [bookingsQuery.data, currentDate, row.specialist.id, timeManager]
  );

  const options = useMemo(
    () =>
      timeManager
        .getFullSlots(workingSlots)
        .filter((slot) => slot.minute === 0 || slot.minute === 30)
        .map((slot) => ({ ...slot, id: slot.label })),
    [timeManager, workingSlots]
  );

  const selectedFrom = form.watch("breakFrom");
  const selectedTo = form.watch("breakTo");
  const selectedBreakSlots =
    selectedFrom && selectedTo
      ? timeManager.getSlotsInRange(selectedFrom.slot, selectedTo.slot)
      : [];
  const occupiedBreakIntervals = timeManager.getBreakIntervalSlots(selectedBreakSlots);
  const hasError =
    !selectedFrom ||
    !selectedTo ||
    selectedFrom.slot >= selectedTo.slot ||
    occupiedBreakIntervals.some((slot) => busySlots.includes(slot));

  const save = async () => {
    if (hasError) return;

    try {
      if (row.customWorkingShift?.kind === "override") {
        await updateShift.mutateAsync({
          companyId,
          shiftId: row.customWorkingShift.id,
          body: { breakSlots: selectedBreakSlots },
        });
      } else {
        const body: TCreateCompanyShift["body"] = {
          name: "Custom",
          color: "#6C5CE7",
          specialistId: row.specialist.id,
          date: currentDate,
          workingSlots,
          breakSlots: selectedBreakSlots,
        };
        await createShift.mutateAsync({ companyId, body });
      }

      toaster.success(t("bookingManagement.calendar.dailyBreakChanged"));
      handleClose();
    } catch {
      toaster.error(t("ui.errors.wentWrong"));
    }
  };

  return (
    <Modal isOpen={isOpen} handleClose={handleClose}>
      <div className="relative w-[320px] h-fit p-4 rounded-lg shadow-secondary bg-white">
        <div className="flex justify-between items-center">
          <span className="text-sm font-bold text-greyPrimary">
            {t("bookingManagement.calendar.changeBreakTime")}
          </span>
          <Button className="size-8 p-0" variant="resting-active" onClick={handleClose}>
            <CloseIcon className="w-5 h-5 stroke-greyPrimary" />
          </Button>
        </div>

        <div className="mt-4 flex flex-col gap-3">
          {(["breakFrom", "breakTo"] as const).map((fieldName) => (
            <div key={fieldName} className="flex flex-col">
              <p className="mb-1 text-sm text-greyPrimary">
                {fieldName === "breakFrom"
                  ? t("ui.timeSelectInput.fromTime")
                  : t("ui.timeSelectInput.toTime")}
              </p>
              <FormControl fullWidth>
                <Controller
                  name={fieldName}
                  control={form.control}
                  rules={{ required: true }}
                  render={() => (
                    <AppSelect
                      id={fieldName}
                      classNames={{ selectContainer: "w-full" }}
                      selectDropdownPosition="top"
                      options={options}
                      selectedOption={
                        fieldName === "breakFrom"
                          ? selectedFrom && { ...selectedFrom, id: selectedFrom.label }
                          : selectedTo && { ...selectedTo, id: selectedTo.label }
                      }
                      setValue={form.setValue}
                      renderOption={(option) => <p className="text-sm">{option.label}</p>}
                      renderOptionSelected={(option) => (
                        <p className="text-sm">
                          {option?.label || t("bookingManagement.calendar.break")}
                        </p>
                      )}
                      renderEmptyOption={() => (
                        <div className="py-[6px] pl-2 pr-1">
                          <p className="text-sm text-greyPrimary">
                            {t("bookingManagement.calendar.noOption")}
                          </p>
                        </div>
                      )}
                      error={hasError}
                    />
                  )}
                />
              </FormControl>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-between gap-2">
          <Button className="w-full h-9 p-0" variant="resting" onClick={handleClose}>
            {t("ui.actions.cancel")}
          </Button>
          <Button
            className={cn("w-full h-9 p-0")}
            variant="dark"
            disabled={hasError || createShift.isPending || updateShift.isPending}
            onClick={form.handleSubmit(save)}
          >
            {t("ui.actions.save")}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ChangeDailyBreakTimePopup;
