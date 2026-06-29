/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import Button from "@/components/ui/button";
import TextField from "@/components/ui/inputs/TextField";
import Modal from "@/components/ui/modal";
import React, { FC, ReactNode, useMemo } from "react";
import { UseFormReturn } from "react-hook-form";
import CloseIcon from "@/components/ui/icons/Close";
import { CreateUpdateOpeationHour } from "..";
import { SHIFT_COLORS } from "@/constants/shiftColors";
import { cn } from "@/utils/cn";
import { TimeSlotsManager } from "@/utils/timeSlotManager";
import WorkingTimePicker from "@/components/WorkingTimePicker";
import { WEEK_DAYS } from "@/constants/other";

type Props = {
  isOpen: boolean;
  headerTitle: string;
  form: UseFormReturn<CreateUpdateOpeationHour>;
  companyWorkingSchedule?: TCompany["working_schedule"];
  actionButton: ReactNode;
  handleClose: () => void;
};

const CreateUpdateModal: FC<Props> = ({
  isOpen,
  headerTitle,
  form,
  companyWorkingSchedule,
  actionButton,
  handleClose,
}) => {
  const selectColorHandler = (c: string) => {
    form.setValue("color", c);
  };

  const selectDayHandler = (d: (typeof WEEK_DAYS)[number]) => {
    const prev = form.getValues("weekDays");

    if (prev.find((p) => p.id === d.id)) {
      form.setValue(
        "weekDays",
        prev.filter((p) => p.id !== d.id)
      );
    } else {
      form.setValue("weekDays", [...prev, d]);
    }
  };

  const localCloseHandler = () => {
    form.reset();
    handleClose();
  };

  const companyWorkingTimeSlots = useMemo(() => {
    const workingSchedule = companyWorkingSchedule;

    if (workingSchedule) {
      const slotManager = new TimeSlotsManager();
      const slots = slotManager
        .getWorkingTimeSlotsCompany(workingSchedule)
        .filter((s) => s.minute === 0 || s.minute === 30);

      return slots;
    }

    return [];
  }, [companyWorkingSchedule]);

  return (
    <Modal isOpen={isOpen} handleClose={localCloseHandler}>
      <div className="w-[620px] p-6 sm:p-5 sm:w-full">
        <div className="flex items-center justify-between">
          <h5 className="text-sm font-bold text-greyPrimary">{headerTitle}</h5>
          <div className="flex items-center gap-4">
            <Button
              className="w-9 h-9 p-0"
              variant="resting-active"
              onClick={localCloseHandler}
            >
              <CloseIcon className="w-5 h-5 stroke-greyPrimary" />
            </Button>
          </div>
        </div>

        <div className="mt-5">
          <div className="w-full">
            <TextField
              className="mb-2 !py-1"
              id="name"
              label="Name"
              placeholder="Name..."
              register={form.register}
              rules={{ required: true }}
              error={form.formState.errors.name}
            />
          </div>

          <div className="mt-5 flex items-center gap-2">
            {SHIFT_COLORS.map((c) => (
              <div
                key={c}
                className={cn(`size-7 rounded cursor-pointer transition-all`, {
                  "scale-[1.1] border border-purplePrimary": form.watch("color") === c,
                })}
                style={{
                  backgroundColor: c,
                }}
                onClick={() => selectColorHandler(c)}
              ></div>
            ))}
          </div>

          <div className="mt-5 flex items-center gap-2 sm:flex-wrap">
            {WEEK_DAYS.map((d) => (
              <div
                key={d.id}
                className={cn(
                  "py-2 flex-1 flex flex-col items-center rounded-lg cursor-pointer border transition-all border-greyOutlineSecondary hover:border-purplePrimary",
                  "sm:min-w-12 sm:max-w-[60px]",
                  {
                    "font-bold text-white border-purplePrimary bg-purplePrimary": form
                      .watch("weekDays")
                      .find((p) => p.id === d.id),
                  }
                )}
                onClick={() => selectDayHandler(d)}
              >
                <p className="text-sm text-[inherit]">{d.shortText}</p>
              </div>
            ))}
          </div>

          <div className="mt-5">
            <WorkingTimePicker
              options={companyWorkingTimeSlots}
              defaultValue={form.watch("time")}
              handleSelectFrom={(slot) => form.setValue("time.from", slot)}
              handleSelectTo={(slot) => form.setValue("time.to", slot)}
              handleSelectBreakFrom={(slot) => form.setValue("time.breakFrom", slot)}
              handleSelectBreakTo={(slot) => form.setValue("time.breakTo", slot)}
            />
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between gap-5">
          <Button variant="resting" onClick={localCloseHandler}>
            Cancel
          </Button>
          {actionButton}
        </div>
      </div>
    </Modal>
  );
};

export default CreateUpdateModal;
