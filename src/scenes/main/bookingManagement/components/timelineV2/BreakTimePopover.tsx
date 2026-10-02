"use client";

import { type ReactNode, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";

import type { TCreateCompanyShift } from "@/src/api/entities/company/shift";
import {
  useCreateCompanyShiftQuery,
  useUpdateCompanyShiftQuery,
} from "@/src/api/queries/company/shift";
import { Button } from "@/src/components/ui/button";
import AppSelect from "@/src/components/ui/inputs/AppSelect";
import { Popover, PopoverContent, PopoverTrigger } from "@/src/components/ui/popover";
import { toaster } from "@/src/components/ui/toaster";
import { TIME_SLOTS, type TTimeSlot } from "@/src/constants/timeSlots";
import { useGetCompanyId } from "@/src/hooks/useGetCompanyId";
import { isOwnerMembership } from "@/src/utils/permissions";
import { TimeManager } from "@/src/utils/timeManager";

type BreakTimeForm = {
  breakFrom?: TTimeSlot;
  breakTo?: TTimeSlot;
};

type BreakTimePopoverProps = {
  children: ReactNode;
  specialist: TSpecialist;
  effectiveShift?: TShift;
  workingSlots: number[];
  breakSlots: number[];
  bookings: TApiBooking[];
  currentDate: Date;
};

const timeManager = new TimeManager();

const BreakTimePopover = ({
  children,
  specialist,
  effectiveShift,
  workingSlots,
  breakSlots,
  bookings,
  currentDate,
}: BreakTimePopoverProps) => {
  const t = useTranslations();
  const { companyId, activeCompany } = useGetCompanyId();
  const [isOpen, setIsOpen] = useState(false);
  const createShift = useCreateCompanyShiftQuery();
  const updateShift = useUpdateCompanyShiftQuery();
  const canEditSchedule = isOwnerMembership(activeCompany);
  const form = useForm<BreakTimeForm>({
    defaultValues: {
      breakFrom: TIME_SLOTS.find((slot) => slot.slot === breakSlots[0]),
      breakTo: TIME_SLOTS.find((slot) => slot.slot === breakSlots.at(-1)),
    },
  });

  const options = useMemo(() => {
    const workingSlotIds = new Set(workingSlots);
    return TIME_SLOTS.filter((slot) => workingSlotIds.has(slot.slot)).map((slot) => ({
      ...slot,
      id: slot.label,
    }));
  }, [workingSlots]);

  const busySlots = useMemo(
    () =>
      timeManager.getAlreadyUsedSlotsInBookings({
        bookings,
        date: currentDate,
        staffId: specialist.id,
      }),
    [bookings, currentDate, specialist.id]
  );

  const selectedFrom = form.watch("breakFrom");
  const selectedTo = form.watch("breakTo");
  const selectedBreakSlots =
    selectedFrom && selectedTo
      ? timeManager.getSlotsInRange(selectedFrom.slot, selectedTo.slot)
      : [];
  const occupiedBreakSlots = timeManager.getBreakIntervalSlots(selectedBreakSlots);
  const hasError =
    !selectedFrom ||
    !selectedTo ||
    selectedFrom.slot >= selectedTo.slot ||
    occupiedBreakSlots.some((slot) => busySlots.includes(slot));
  const isSaving = createShift.isPending || updateShift.isPending;

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      form.reset({
        breakFrom: TIME_SLOTS.find((slot) => slot.slot === breakSlots[0]),
        breakTo: TIME_SLOTS.find((slot) => slot.slot === breakSlots.at(-1)),
      });
    }
    setIsOpen(nextOpen);
  };

  const save = async () => {
    if (hasError) return;

    try {
      if (effectiveShift?.kind === "override") {
        await updateShift.mutateAsync({
          companyId,
          shiftId: effectiveShift.id,
          body: { breakSlots: selectedBreakSlots },
        });
      } else {
        const body: TCreateCompanyShift["body"] = {
          name: "Custom",
          color: "#6C5CE7",
          specialistId: specialist.id,
          date: currentDate,
          workingSlots,
          breakSlots: selectedBreakSlots,
        };
        await createShift.mutateAsync({ companyId, body });
      }

      toaster.success(t("bookingManagement.calendar.dailyBreakChanged"));
      setIsOpen(false);
    } catch {
      toaster.error(t("ui.errors.wentWrong"));
    }
  };

  if (!canEditSchedule) {
    return <div className="flex h-full w-full items-center px-2.5">{children}</div>;
  }

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="flex h-full w-full items-center px-2.5 text-left hover:bg-greyPrimary/10"
        >
          {children}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[320px] p-4" align="center" sideOffset={8}>
        <p className="text-sm font-bold text-darkPrimary">
          {t("bookingManagement.calendar.changeBreakTime")}
        </p>

        <div className="mt-4 flex flex-col gap-3">
          {(["breakFrom", "breakTo"] as const).map((fieldName) => {
            const selectedOption = fieldName === "breakFrom" ? selectedFrom : selectedTo;

            return (
              <div key={fieldName} className="flex flex-col gap-1">
                <p className="text-sm text-greyPrimary">
                  {fieldName === "breakFrom"
                    ? t("ui.timeSelectInput.fromTime")
                    : t("ui.timeSelectInput.toTime")}
                </p>
                <AppSelect
                  id={fieldName}
                  options={options}
                  selectedOption={
                    selectedOption && { ...selectedOption, id: selectedOption.label }
                  }
                  setValue={form.setValue}
                  renderOption={(option) => <p className="text-sm">{option.label}</p>}
                  renderOptionSelected={(option) => (
                    <p className="text-sm">
                      {option?.label || t("bookingManagement.calendar.noOption")}
                    </p>
                  )}
                  error={hasError}
                />
              </div>
            );
          })}
        </div>

        <div className="mt-5 flex gap-2">
          <Button
            type="button"
            className="h-9 flex-1"
            variant="outline"
            onClick={() => setIsOpen(false)}
          >
            {t("ui.actions.cancel")}
          </Button>
          <Button
            type="button"
            className="h-9 flex-1"
            disabled={hasError || isSaving}
            onClick={() => void save()}
          >
            {t("ui.actions.save")}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default BreakTimePopover;
