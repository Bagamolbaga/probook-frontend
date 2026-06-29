/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { useCreateCompanySpecialistsQuery } from "@/api/queries/company/specialists";
import Button from "@/components/ui/button";
import StoreIcon from "@/components/ui/icons/Store";
import TextField from "@/components/ui/inputs/TextField";
import Modal from "@/components/ui/modal";
import { FormControl } from "@mui/material";
import { FC, ReactNode, useEffect, useMemo } from "react";
import { Controller, UseFormReturn } from "react-hook-form";
import { CreateSpecialistForm } from "..";
import PersonIcon from "@/components/ui/icons/Person";
import CloseIcon from "@/components/ui/icons/Close";
import FileUploadButton from "@/components/ui/button/FileUploadButton";
import AppSelect from "@/components/ui/inputs/AppSelect";
import { useGetCompanyShiftsQuery } from "@/api/queries/company/shift";
import { TimeManager } from "@/utils/timeManager";
import { SHIFT_COLORS } from "@/constants/shiftColors";
import { useGetCompanyId } from "@/hooks/useGetCompanyId";
import PhoneNumberTextField from "@/components/ui/inputs/PhoneNumberTextField";
import WorkingTimePicker from "@/components/WorkingTimePicker";
import { useGetCompanyDetailsQuery } from "@/api/queries/company";
import { TimeSlotsManager } from "@/utils/timeSlotManager";
import { WEEK_DAYS } from "@/constants/other";
import { cn } from "@/utils/cn";

type Props = {
  isUpdate?: boolean;
  isOpen: boolean;
  headerTitle: string;
  form: UseFormReturn<CreateSpecialistForm>;
  actionButton: ReactNode;
  handleClose: () => void;
};

const CreateUpdateSpecialistModal: FC<Props> = ({
  isUpdate,
  isOpen,
  headerTitle,
  form,
  actionButton,
  handleClose,
}) => {
  const { companyId } = useGetCompanyId();

  const getCompanyDetailsQuery = useGetCompanyDetailsQuery({
    companyId,
  });
  const getCompanyShiftsQuery = useGetCompanyShiftsQuery({
    companyId,
  });
  const createCompanySpecialistsQuery = useCreateCompanySpecialistsQuery();

  const localCloseHandler = () => {
    form.reset();
    handleClose();
  };

  const shiftPresets = useMemo(() => {
    if (getCompanyShiftsQuery.data) {
      // const presets = getCompanyShiftsQuery.data.results
      //   .filter((s) => s.is_default && !s.specialist)
      //   .sort((a, b) => a.id - b.id);

      // const onlyForCurrStaff = getCompanyShiftsQuery.data.results
      //   .filter(
      //     (s) => s.specialist === form.watch("_specialistId") && s.name === "CUSTOM"
      //   )
      //   .sort((a, b) => a.id - b.id);

      // const arr = [].map((s) => {
      //   const tm = new TimeManager();

      //   const workingScheduleWithFromTo = tm.getWorkingScheduleWithFromAndToPropertys(
      //     s.working_schedule
      //   );

      //   return {
      //     ...s,
      //     workingScheduleWithFromTo,
      //   };
      // });

      return [
        {
          id: -1,
          name: "Custom time",
          color: "",
        },
      ];
    }

    return [];
  }, [getCompanyShiftsQuery.data, form.watch("_specialistId")]);

  const companyWorkingTimeSlots = useMemo(() => {
    const workingSchedule = getCompanyDetailsQuery?.data?.working_schedule;

    if (workingSchedule) {
      const slotManager = new TimeSlotsManager();
      const slots = slotManager
        .getWorkingTimeSlotsCompany(workingSchedule)
        .filter((s) => s.minute === 0 || s.minute === 30);

      return slots;
    }

    return [];
  }, [getCompanyDetailsQuery?.data?.working_schedule]);

  return (
    <Modal isOpen={isOpen} handleClose={localCloseHandler}>
      <div className="w-[720px] max-h-[calc(100vh-80px)] overflow-y-scroll p-6">
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

        <div className="w-full pt-12 pb-9 flex justify-center items-center">
          <FileUploadButton
            accept="image/png, image/jpg, image/jpeg"
            onSelected={(file) => {
              form.setValue("avatar", file);
            }}
            renderChildren={({ fileBase64, handleClick }) => (
              <div
                className="w-[108px] h-[108px] flex justify-center items-center rounded-lg cursor-pointer overflow-hidden bg-purpleLightSecondary transition-all hover:bg-purpleExtraLight"
                onClick={handleClick}
              >
                {fileBase64 ? (
                  <img className="w-full h-full object-cover" src={fileBase64} />
                ) : typeof form.getValues("avatar") === "string" ? (
                  <img
                    className="w-full h-full object-cover"
                    src={form.getValues("avatar") as string}
                  />
                ) : (
                  <PersonIcon className="w-10 h-10 stroke-blueDark" />
                )}
              </div>
            )}
          />
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
          <div className="mt-5 flex justify-between gap-5">
            <TextField
              className="mb-2 !py-1"
              id="email"
              label="Email"
              placeholder="Email..."
              register={form.register}
              // rules={{ required: true }}
              // disabled={isUpdate}
              error={form.formState.errors.email}
            />
            <PhoneNumberTextField
              className="mb-2 !py-1"
              id="phone"
              label="Phone"
              control={form.control as any}
              // disabled={isUpdate}
              // rules={{ required: true }}
              error={form.formState.errors.phone}
            />
          </div>
          <div className="mt-5">
            <FormControl fullWidth>
              <p className="mb-2 text-sm text-greyPrimary">Working Shifts</p>
              <Controller
                render={() => (
                  <AppSelect
                    classNames={{
                      container: "!py-0",
                      selectContainer: "min-w-[50%]",
                    }}
                    id="shift"
                    variant="no-border"
                    selectDropdownPosition="top"
                    options={shiftPresets}
                    setValue={form.setValue}
                    selectedOption={form.watch("shift")}
                    renderOption={(option: (typeof shiftPresets)[number]) => {
                      let textColor = option.color || SHIFT_COLORS.at(-1)!;

                      if (option.id === -1) {
                        textColor = "";
                      }

                      const days =
                        option.name === "CUSTOM"
                          ? WEEK_DAYS.map((day) => ({
                              isWorking: Boolean(
                                option.working_schedule[day.id].slots.length
                              ),
                              day: day.id,
                            }))
                          : [];

                      return (
                        <div
                          className="pl-2 flex items-center gap-2"
                          style={{ color: textColor }}
                        >
                          {option.name === "CUSTOM" ? "" : option.name}
                          {option.name === "CUSTOM" && (
                            <div className="min-h-3 flex items-center gap-1">
                              {days.map((i) => (
                                <span
                                  key={i.day}
                                  className={cn("text-sm text-greyPrimary/70", {
                                    "text-purplePrimary": i.isWorking,
                                  })}
                                >
                                  {i.day[0]}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    }}
                    renderOptionSelected={(option) => {
                      if (!option) {
                        return (
                          <div className="flex items-center gap-2 text-greyPrimary">
                            <StoreIcon className="stroke-darkPrimary" />
                            Select default shift
                          </div>
                        );
                      }

                      let textColor = (option as any).color || SHIFT_COLORS.at(-1)!;

                      if (option.id === -1) {
                        textColor = undefined;
                      }

                      return (
                        <div
                          className="flex items-center gap-2"
                          style={{ color: textColor }}
                        >
                          <StoreIcon className="stroke-darkPrimary" />
                          {option.name}
                        </div>
                      );
                    }}
                  />
                )}
                name="shift"
                control={form.control}
                rules={{ required: true }}
              />
            </FormControl>

            {(form.watch("shift.id") === -1 || form.watch("shift.name") === "CUSTOM") && (
              <div className="w-full flex flex-col">
                {WEEK_DAYS.map((wd) => {
                  const curr = form.watch(`shift.workingScheduleWithFromTo.${wd.id}`);

                  const from = curr?.slots.from;
                  const to = curr?.slots.to;
                  const breakFrom = curr?.breaks.from;
                  const breakTo = curr?.breaks.to;

                  return (
                    <div
                      key={wd.id + form.watch("shift.id")}
                      className="w-full flex items-center gap-5"
                    >
                      <span className="min-w-[100px] mt-5">{wd.id}</span>
                      <WorkingTimePicker
                        options={companyWorkingTimeSlots}
                        defaultValue={{
                          from,
                          to,
                          breakFrom,
                          breakTo,
                        }}
                        handleSelectFrom={(slot) =>
                          form.setValue(
                            `shift.workingScheduleWithFromTo.${wd.id}.slots.from`,
                            slot
                          )
                        }
                        handleSelectTo={(slot) =>
                          form.setValue(
                            `shift.workingScheduleWithFromTo.${wd.id}.slots.to`,
                            slot
                          )
                        }
                        handleSelectBreakFrom={(slot) =>
                          form.setValue(
                            `shift.workingScheduleWithFromTo.${wd.id}.breaks.from`,
                            slot
                          )
                        }
                        handleSelectBreakTo={(slot) =>
                          form.setValue(
                            `shift.workingScheduleWithFromTo.${wd.id}.breaks.to`,
                            slot
                          )
                        }
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between gap-5">
          <Button
            variant="resting"
            onClick={localCloseHandler}
            disabled={createCompanySpecialistsQuery.isPending}
          >
            Cancel
          </Button>
          {actionButton}
        </div>
      </div>
    </Modal>
  );
};

export default CreateUpdateSpecialistModal;
