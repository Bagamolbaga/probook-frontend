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
import { TimeManager } from "@/utils/timeManager";
import WorkingTimePicker from "@/components/WorkingTimePicker";

type Props = {
  isOpen: boolean;
  headerTitle: string;
  form: UseFormReturn<CreateUpdateOpeationHour>;
  companyWorkingSchedule?: TCompany["workingSchedule"];
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

  const localCloseHandler = () => {
    form.reset();
    handleClose();
  };

  const companyWorkingTimeSlots = useMemo(() => {
    const workingSchedule = companyWorkingSchedule;

    if (workingSchedule) {
      const slotManager = new TimeManager();
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
