/* eslint-disable @typescript-eslint/no-floating-promises */
import { memo, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/utils/cn";
import Button from "@/components/ui/button";
import { useClickOutside } from "@/hooks/useClickOutside";
import {
  useCreateCompanyShiftForDateQuery,
  useCreateCompanyShiftQuery,
  useGetCompanyShiftsQuery,
  useUpdateCompanyShiftForDateQuery,
  useUpdateCompanyShiftQuery,
} from "@/api/queries/company/shift";
import { toaster } from "@/components/ui/toaster";
import CloseIcon from "@/components/ui/icons/Close";
import { useTranslations } from "next-intl";
import { FormControl } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import AppSelect from "@/components/ui/inputs/AppSelect";
import { TTimeSlot } from "@/constants/timeSlots";
import { useGetCompanyDetailsQuery } from "@/api/queries/company";
import { useGetAllBookingsQuery } from "@/api/queries/booking";
import { SHIFT_COLORS } from "@/constants/shiftColors";
import { TimeManager } from "@/utils/timeManager";
import { format } from "date-fns";
import { useGetCompanyId } from "@/hooks/useGetCompanyId";

const POPUP_MAX_HEIGHT = 550;

type Props = {
  specialistId: TSpecialist["id"];
  customShift?: TShift;
  defaultShift: TShift;
  date: Date;
  col: number;
  revalidateQueries: () => void;
};

type Form = {
  id: TShift["id"];
  from?: TTimeSlot;
  to?: TTimeSlot;
  breakFrom?: TTimeSlot;
  breakTo?: TTimeSlot;
  selectedPreset?: {
    id: number;
    name: string;
    color: string;
    slots: number[];
    break: number[];
  };
};

type ShiftPreset = {
  id: number;
  name: string;
  color: string;
  from: TTimeSlot;
  to: TTimeSlot;
  breakFrom: TTimeSlot;
  breakTo: TTimeSlot;
  slots: number[];
  break: number[];
};

const ShiftItem = memo(
  ({ specialistId, defaultShift, customShift, date, col, revalidateQueries }: Props) => {
    const t = useTranslations();
    const { companyId } = useGetCompanyId();

    const ref = useRef<HTMLDivElement>(null);

    const [isHover, setIsHover] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [popupPosition, setPopupPosition] = useState<"top" | "center" | "bottom">(
      "center"
    );
    const [selectedNewShiftTypeId, setSelectedNewShiftTypeId] = useState<TShift["id"]>();

    const getCompanyDetailsQuery = useGetCompanyDetailsQuery({
      companyId,
    });
    const getCompanyShiftsQuery = useGetCompanyShiftsQuery({
      companyId,
    });
    const getAllBookingsQuery = useGetAllBookingsQuery({
      companyId,
      queryParams: {
        start_date: date,
        end_date: date,
        limit: 50,
        offset: 0,
      },
    });

    const createCompanyShiftForDateQuery = useCreateCompanyShiftForDateQuery();
    const updateCompanyShiftForDateQuery = useUpdateCompanyShiftForDateQuery();

    const createCompanyShiftQuery = useCreateCompanyShiftQuery();
    const updateCompanyShiftQuery = useUpdateCompanyShiftQuery();

    const form = useForm<Form>();

    const shiftPresets: ShiftPreset[] = useMemo(() => {
      if (getCompanyShiftsQuery.data) {
        const presets = getCompanyShiftsQuery.data.results
          .filter((s) => s.is_default && !s.specialist)
          .sort((a, b) => String(a.id).localeCompare(String(b.id)));

        // const arr = presets.map((s) => {
        //   const slots = s.slots;
        //   const dbreak = s.daily_break;

        //   const tm = new TimeManager();
        //   const fullSlots = tm.getwo(
        //     s.slots[0],
        //     s.slots[s.slots.length - 1]
        //   );
        //   const fullBreakSlots = tm.getFullSlotsInRange(
        //     s.daily_break[0],
        //     s.daily_break[s.daily_break.length - 1]
        //   );

        //   const name = `${fullSlots[0].label} - ${fullSlots.at(-1)?.label}`;

        //   return {
        //     id: s.id,
        //     name: name,
        //     color: s.color,
        //     from: fullSlots[0],
        //     to: fullSlots[fullSlots.length - 1],
        //     breakFrom: fullBreakSlots[0],
        //     breakTo: fullBreakSlots[fullBreakSlots.length - 1],
        //     slots,
        //     break: dbreak,
        //   };
        // });

        return [
          {
            id: -1,
            name: "Off",
            color: "",
            slots: [],
            break: [],
          } as unknown as ShiftPreset,
        ];
      }

      return [];
    }, [getCompanyShiftsQuery.data]);

    const allBookings = useMemo(() => {
      let arr: TBooking[] = [];

      getAllBookingsQuery.forEach((q) => {
        if (q.data?.results) {
          arr = [...arr, ...(q.data.results as unknown as TBooking[])];
        }
      });

      return arr;
    }, [getAllBookingsQuery]);

    const currentShift = useMemo(() => {
      if (customShift) return customShift;

      return defaultShift;
    }, [defaultShift, customShift]);

    useEffect(() => {
      // if (isOpen && type === "CUSTOM") {
      //   const dts = getDefaultTimeSlots({
      //     defaultShift: currentShift,
      //   });
      //   if (dts) {
      //     const { id, from, to, breakFrom, breakTo } = dts;
      //     form.setValue("id", id);
      //     form.setValue("from", from);
      //     form.setValue("to", to);
      //     form.setValue("breakFrom", breakFrom);
      //     form.setValue("breakTo", breakTo);
      //   }
      // }
    }, [isOpen, currentShift]);

    useEffect(() => {
      const dts = getDefaultTimeSlots({
        defaultShift: currentShift,
      });

      if (dts) {
        const { id, from, to, breakFrom, breakTo } = dts;

        form.setValue("id", id);
        form.setValue("from", from);
        form.setValue("to", to);
        form.setValue("breakFrom", breakFrom);
        form.setValue("breakTo", breakTo);
      }
    }, [isOpen, currentShift]);

    const openPopupHandler = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const distanceFromBottom = viewportHeight - rect.bottom;

        setIsOpen(true);

        if (distanceFromBottom <= POPUP_MAX_HEIGHT / 2) {
          setPopupPosition("top");
          return;
        }

        if (rect.top <= POPUP_MAX_HEIGHT / 2) {
          setPopupPosition("bottom");
        } else {
          setPopupPosition("center");
        }
      }
    };

    const closePopupHandler = () => {
      form.reset();
      revalidateQueries();
      setSelectedNewShiftTypeId(undefined);
      setIsOpen(false);
    };

    const selectPresetHandler = (s: ShiftPreset) => {
      // setSelectedNewShiftTypeId(s.id);

      const tm = new TimeManager();
      const fullSlots = tm.getFullSlotsFromArr(s.slots);
      const fullSlotsBreak = tm.getFullSlotsFromArr(s.break);

      form.setValue("selectedPreset", s);
      form.setValue("from", fullSlots[0]);
      form.setValue("to", fullSlots.at(-1));
      form.setValue("breakFrom", fullSlotsBreak[0]);
      form.setValue("breakTo", fullSlotsBreak.at(-1));
    };

    const createCustomShift = async () => {
      try {
        const body = {
          name: "CUSTOM",
          description: "custom",
          color: SHIFT_COLORS.at(-1)!,
          workingSlots: [] as number[],
          breakSlots: [] as number[],
          date: date,
          specialistId,
        };

        const tm = new TimeManager();
        const slots =
          form.getValues("from") && form.getValues("to")
            ? tm.getSlotsInRange(form.getValues("from")!.slot, form.getValues("to")!.slot)
            : [];
        const breaks =
          form.getValues("breakFrom") && form.getValues("breakTo")
            ? tm.getSlotsInRange(
                form.getValues("breakFrom")!.slot,
                form.getValues("breakTo")!.slot
              )
            : [];

        body.workingSlots = slots;
        body.breakSlots = breaks;

        const res = await createCompanyShiftQuery.mutateAsync({
          companyId,
          body,
        });

        if (res.data) {
          toaster.success("Custom shift created");
          closePopupHandler();
        }
      } catch (error) {
        toaster.error("Something went wrong");
      }
    };

    const updateCustomShift = async () => {
      try {
        if (customShift) {
          const body = {
            name: "CUSTOM",
            description: "custom",
            color: SHIFT_COLORS.at(-1)!,
            workingSlots: [] as number[],
            breakSlots: [] as number[],
          };

          const tm = new TimeManager();
          const slots =
            form.getValues("from") && form.getValues("to")
              ? tm.getSlotsInRange(
                  form.getValues("from")!.slot,
                  form.getValues("to")!.slot
                )
              : [];
          const breaks =
            form.getValues("breakFrom") && form.getValues("breakTo")
              ? tm.getSlotsInRange(
                  form.getValues("breakFrom")!.slot,
                  form.getValues("breakTo")!.slot
                )
              : [];

          body.workingSlots = slots;
          body.breakSlots = breaks;

          const res = await updateCompanyShiftQuery.mutateAsync({
            companyId,
            shiftId: customShift.id,
            body,
          });

          if (res.data) {
            toaster.success("Custom shift updated");
            closePopupHandler();
          }
        }
      } catch (error) {
        toaster.error("Something went wrong");
      }
    };

    // const createCustomShiftFromPreset = async () => {
    //   console.log({ form: form.getValues("selectedPreset") });
    //   try {
    //     if (
    //       form.getValues("selectedPreset.name") &&
    //       form.getValues("selectedPreset.color") &&
    //       form.getValues("selectedPreset.slots")
    //     ) {
    //       const body = {
    //         name: form.getValues("selectedPreset.name"),
    //         description: "custom",
    //         description_thai: "custom",
    //         color: form.getValues("selectedPreset.color"),
    //         slots: form.getValues("selectedPreset.slots"),
    //         daily_break: form.getValues("selectedPreset.break")
    //           ? form.getValues("selectedPreset.break")
    //           : [],
    //         date: date,
    //         is_default: false,
    //         specialist: specialistId,
    //       };

    //       const res = await createCompanyShiftQuery.mutateAsync({
    //         companyId,
    //         body,
    //       });

    //       if (res.data) {
    //         toaster.success("Custom shift created");
    //         closePopupHandler();
    //       }
    //     }
    //   } catch (error) {
    //     toaster.error("Something went wrong");
    //   }
    // };

    // const updateCustomShiftFromPreset = async () => {
    //   try {
    //     if (
    //       customShift &&
    //       form.getValues("selectedPreset.name") &&
    //       form.getValues("selectedPreset.color") &&
    //       form.getValues("selectedPreset.slots")
    //     ) {
    //       const body = {
    //         name: form.getValues("selectedPreset.name"),
    //         description: "custom",
    //         description_thai: "custom",
    //         color: form.getValues("selectedPreset.color"),
    //         slots: form.getValues("selectedPreset.slots"),
    //         daily_break: form.getValues("selectedPreset.break")
    //           ? form.getValues("selectedPreset.break")
    //           : [],
    //         date: date,
    //         is_default: false,
    //         specialist: specialistId,
    //       };

    //       const res = await updateCompanyShiftQuery.mutateAsync({
    //         companyId,
    //         shiftId: customShift.id,
    //         body,
    //       });

    //       if (res.data) {
    //         toaster.success("Custom shift updated");
    //         closePopupHandler();
    //       }
    //     }
    //   } catch (error) {
    //     toaster.error("Something went wrong");
    //   }
    // };

    const mainActionHandler = () => {
      if (currentShift.specialist && currentShift.date) {
        updateCustomShift();
      } else {
        createCustomShift();
      }

      // if (type === "CUSTOM") {
      //   if (customShift) {
      //     if (form.getValues("selectedPreset.id")) {
      //       updateCustomShiftFromPreset();
      //     } else {
      //       updateCustomShift();
      //     }
      //   } else {
      //     if (selectedNewShiftTypeId === -1) {
      //       createCustomShift();
      //     } else {
      //       if (selectedNewShiftTypeId !== currentShift.id) {
      //         createCustomShiftFromPreset();
      //       }
      //     }
      //   }
      // } else {
      //   if (selectedNewShiftTypeId === -1) {
      //     createCustomShift();
      //   } else {
      //     if (selectedNewShiftTypeId !== currentShift.id) {
      //       createCustomShiftFromPreset();
      //     }
      //   }
      // }
    };

    useClickOutside(ref, isOpen ? closePopupHandler : () => {});

    const getDefaultTimeSlots = ({
      defaultShift,
      customShift,
    }: {
      defaultShift: TShift;
      customShift?: TShift;
    }) => {
      const tm = new TimeManager();
      const workingSlots = tm.getFullSlotsFromArr(defaultShift.workingSlots);
      const breakSlots = tm.getFullSlotsFromArr(defaultShift.breakSlots);

      const from = workingSlots[0];
      const to = workingSlots.at(-1)!;
      const breakFrom = breakSlots[0];
      const breakTo = breakSlots.at(-1)!;

      // if (customShift) {
      //   from = customShift.slots[0];
      //   to = customShift.slots.at(-1)!;
      //   dbreaks = customShift.daily_break;
      // }

      return {
        id: customShift ? customShift.id : defaultShift.id,
        from,
        to,
        breakFrom,
        breakTo,
      };
    };

    const customShiftFromToTime = useMemo(() => {
      return getDefaultTimeSlots({
        defaultShift: currentShift,
      });
    }, [currentShift]);

    const companyWorkingTimeSlots = useMemo(() => {
      const workingSchedule = getCompanyDetailsQuery?.data?.workingSchedule;

      if (workingSchedule) {
        const slotManager = new TimeManager();
        const slots = slotManager
          .getWorkingTimeSlotsCompany(workingSchedule)
          .filter((s) => s.minute === 0 || s.minute === 30);

        return slots;
      }

      return [];
    }, [getCompanyDetailsQuery?.data?.workingSchedule]);

    const fromTimeOptions = useMemo(() => {
      const mostEarlyBookSlot = allBookings
        .filter((b) => b.specialist.id === specialistId)
        .reduce<number[]>((acc, b) => [...acc, ...b.slots], [])
        .sort((a, b) => a - b)[0];

      if (mostEarlyBookSlot) {
        return companyWorkingTimeSlots.filter((s) => s.slot <= mostEarlyBookSlot);
      }

      return form.watch("to")
        ? companyWorkingTimeSlots.filter((s) => s.slot < form.watch("to")!.slot)
        : companyWorkingTimeSlots;
    }, [companyWorkingTimeSlots, form.watch("to"), allBookings, specialistId]);

    const toTimeOptions = useMemo(() => {
      const mostLateBookSlot = allBookings
        .filter((b) => b.specialist.id === specialistId)
        .reduce<number[]>((acc, b) => [...acc, ...b.slots], [])
        .sort((a, b) => a - b)
        .at(-1);

      if (mostLateBookSlot) {
        return companyWorkingTimeSlots.filter((s) => s.slot >= mostLateBookSlot);
      }

      return form.watch("from")
        ? companyWorkingTimeSlots.filter((s) => s.slot > form.watch("from")!.slot)
        : companyWorkingTimeSlots;
    }, [companyWorkingTimeSlots, form.watch("from"), allBookings, specialistId]);

    const breakTimeOptions = useMemo(() => {
      if (form.watch("from") && form.watch("to")) {
        return companyWorkingTimeSlots.filter(
          (s) => s.slot > form.watch("from")!.slot && s.slot < form.watch("to")!.slot
        );
      }

      return companyWorkingTimeSlots;
    }, [companyWorkingTimeSlots, form.watch("from.slot"), form.watch("to.slot")]);

    const selectedOptionShiftTimeSlots = useMemo(() => {
      const from = form.watch("from");
      const to = form.watch("to");
      const breakFrom = form.watch("breakFrom");
      const breakTo = form.watch("breakTo");

      const fromTimeSlot = from && { ...from, id: from.label };
      const toTimeSlot = to && { ...to, id: to.label };
      const breakFromTimeSlot = breakFrom && { ...breakFrom, id: breakFrom.label };
      const breakToTimeSlot = breakTo && { ...breakTo, id: breakTo.label };

      return {
        fromTimeSlot,
        toTimeSlot,
        breakFromTimeSlot,
        breakToTimeSlot,
      };
    }, [
      form.watch("from"),
      form.watch("to"),
      form.watch("breakFrom"),
      form.watch("breakTo"),
    ]);

    const actionBtnIsActive = useMemo(() => {
      // if (isOpen && selectedNewShiftTypeId) {
      //   // if (
      //   //   type !== "CUSTOM" &&
      //   //   selectedNewShiftTypeId !== -1 &&
      //   //   type === selectedNewShiftTypeId
      //   // ) {
      //   //   return false;
      //   // }

      //   if (customShift && selectedNewShiftTypeId !== customShift.id) {
      //     return true;
      //   }

      //   if (selectedNewShiftTypeId !== defaultShift.id) {
      //     return true;
      //   }
      // }
      return true;

      // if (
      //   isOpen &&
      //   type === "CUSTOM" &&
      //   (!selectedNewShiftTypeId || selectedNewShiftTypeId === -1) &&
      //   form.watch("from")
      // ) {
      //   const curFrom = form.watch("from.slot");
      //   const curTo = form.watch("to.slot");
      //   const curBreakFrom = form.watch("breakFrom.slot");
      //   const curBreakTo = form.watch("breakTo.slot");

      //   if (customShift) {
      //     const dts = getDefaultTimeSlots({ defaultShift: customShift });
      //     const from = dts?.from.slot;
      //     const to = dts?.to.slot;
      //     const breakFrom = dts?.breakFrom.slot;
      //     const breakTo = dts?.breakTo.slot;

      //     if (
      //       curFrom !== from ||
      //       curTo !== to ||
      //       curBreakFrom !== breakFrom ||
      //       curBreakTo !== breakTo
      //     ) {
      //       return true;
      //     }
      //   }

      //   if (defaultShift) {
      //     const dts = getDefaultTimeSlots({ defaultShift });
      //     const from = dts?.from.slot;
      //     const to = dts?.to.slot;
      //     const breakFrom = dts?.breakFrom.slot;
      //     const breakTo = dts?.breakTo.slot;

      //     if (
      //       curFrom !== from ||
      //       curTo !== to ||
      //       curBreakFrom !== breakFrom ||
      //       curBreakTo !== breakTo
      //     ) {
      //       return true;
      //     }
      //   }
      // }

      return false;
    }, [isOpen, customShift, defaultShift, selectedNewShiftTypeId, form.watch()]);

    const isShowTimePicker = () => {
      if (selectedNewShiftTypeId === -1) {
        return true;
      }

      if (!selectedNewShiftTypeId) {
        return true;
      }

      return false;
    };

    const getShiftName = () => {
      if (!customShiftFromToTime?.from) {
        return "Off";
      }

      if (
        (currentShift.date && currentShift.specialistId) ||
        currentShift.name === "CUSTOM"
      ) {
        return `${customShiftFromToTime?.from?.label} - ${customShiftFromToTime?.to?.label}`;
      }

      return currentShift.name;
    };

    const getShiftColor = () => {
      if (!customShiftFromToTime?.from) {
        return "#d8d8d8";
      }

      if (
        (currentShift.date && currentShift.specialistId) ||
        currentShift.name === "CUSTOM"
      ) {
        return SHIFT_COLORS.at(-1)!;
      }

      return currentShift.color || SHIFT_COLORS.at(-1)!;
    };

    return (
      <div
        ref={ref}
        className={cn("relative w-full h-full px-[6px] py-[6px] bggre")}
        onClick={openPopupHandler}
      >
        {isOpen && (
          <div
            className={cn(
              "absolute z-[20] w-[250px] h-fit p-4 rounded-lg shadow-secondary bg-white",
              {
                "left-[0]": col <= 3,
                "right-[0]": col > 3,
                "bottom-full": popupPosition === "top",
                "top-1/2 -translate-y-1/2": popupPosition === "center",
                "top-full": popupPosition === "bottom",
              }
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-greyPrimary">
                {t("staffManagement.shiftManagement.addShift")}
              </span>
              <Button
                className="size-8 p-0"
                variant="resting-active"
                onClick={closePopupHandler}
              >
                <CloseIcon className="w-5 h-5 stroke-greyPrimary" />
              </Button>
            </div>
            <div className="mt-2 flex flex-col">
              {shiftPresets.map((t) => (
                <div
                  key={t.id}
                  className={cn(
                    "w-full px-2 py-2 rounded-lg transition-all cursor-pointer hover:bg-greyBackground"
                  )}
                  style={{
                    color: t.color,
                    backgroundColor:
                      selectedNewShiftTypeId === t.id
                        ? `${t.color}30`
                        : currentShift.id === t.id
                          ? `${t.color}20`
                          : undefined,
                  }}
                  onClick={() => selectPresetHandler(t)}
                >
                  {t.name}
                </div>
              ))}
            </div>

            <div className="mt-4 flex flex-col gap-2">
              <div className="flex flex-col">
                <p className="mb-1 text-xs text-greyPrimary">Working Time</p>
                <FormControl fullWidth>
                  <Controller
                    render={() => (
                      <AppSelect
                        id={"from"}
                        size="sm"
                        classNames={{
                          selectContainer: "w-full",
                        }}
                        selectDropdownPosition="top"
                        options={fromTimeOptions.map((s) => ({ id: s.label, ...s }))}
                        selectedOption={selectedOptionShiftTimeSlots?.fromTimeSlot}
                        setValue={form.setValue}
                        renderOption={(option) => (
                          <p className={cn("text-sm")}>{option.label}</p>
                        )}
                        renderOptionSelected={(option) => (
                          <p className={cn("text-sm")}>
                            {option ? option.label : t("ui.timeSelectInput.from")}
                          </p>
                        )}
                      />
                    )}
                    name={"from"}
                    control={form.control}
                  />
                </FormControl>
                <FormControl fullWidth className="!mt-2">
                  <Controller
                    render={() => (
                      <AppSelect
                        id={"to"}
                        size="sm"
                        classNames={{
                          selectContainer: "w-full",
                        }}
                        selectDropdownPosition="top"
                        options={toTimeOptions.map((s) => ({ id: s.label, ...s }))}
                        selectedOption={selectedOptionShiftTimeSlots?.toTimeSlot}
                        setValue={form.setValue}
                        renderOption={(option) => (
                          <p className={cn("text-sm")}>{option.label}</p>
                        )}
                        renderOptionSelected={(option) => (
                          <p className={cn("text-sm")}>
                            {option ? option.label : t("ui.timeSelectInput.to")}
                          </p>
                        )}
                      />
                    )}
                    name={"to"}
                    control={form.control}
                  />
                </FormControl>
              </div>
              <div className="flex flex-col">
                <p className="mb-1 text-xs text-greyPrimary">Break Time</p>
                <FormControl fullWidth>
                  <Controller
                    render={() => (
                      <AppSelect
                        id={"breakFrom"}
                        size="sm"
                        classNames={{
                          selectContainer: "w-full",
                        }}
                        selectDropdownPosition="top"
                        options={breakTimeOptions.map((s) => ({ id: s.label, ...s }))}
                        selectedOption={selectedOptionShiftTimeSlots?.breakFromTimeSlot}
                        setValue={form.setValue}
                        renderOption={(option) => (
                          <p className={cn("text-sm")}>{option.label}</p>
                        )}
                        renderOptionSelected={(option) => (
                          <p className={cn("text-sm")}>
                            {option ? option.label : "Break"}
                          </p>
                        )}
                        renderEmptyOption={() => (
                          <div className="py-[6px] pl-2 pr-1">
                            <p className={"text-sm text-greyPrimary"}>No option</p>
                          </div>
                        )}
                        // error={!form.watch("breakFrom")}
                      />
                    )}
                    name={"breakFrom"}
                    control={form.control}
                  />
                </FormControl>
                <FormControl fullWidth className="!mt-2">
                  <Controller
                    render={() => (
                      <AppSelect
                        id={"breakTo"}
                        size="sm"
                        classNames={{
                          selectContainer: "w-full",
                        }}
                        selectDropdownPosition="top"
                        options={breakTimeOptions.map((s) => ({ id: s.label, ...s }))}
                        selectedOption={selectedOptionShiftTimeSlots?.breakToTimeSlot}
                        setValue={form.setValue}
                        renderOption={(option) => (
                          <p className={cn("text-sm")}>{option.label}</p>
                        )}
                        renderOptionSelected={(option) => (
                          <p className={cn("text-sm")}>
                            {option ? option.label : "Break"}
                          </p>
                        )}
                        renderEmptyOption={() => (
                          <div className="py-[6px] pl-2 pr-1">
                            <p className={"text-sm text-greyPrimary"}>No option</p>
                          </div>
                        )}
                        // error={!form.watch("breakTo")}
                      />
                    )}
                    name={"breakTo"}
                    control={form.control}
                  />
                </FormControl>
              </div>
            </div>

            <div className="mt-6 flex justify-between gap-2">
              <Button
                className="w-full h-9 p-0"
                variant="resting"
                onClick={closePopupHandler}
              >
                {t("ui.actions.cancel")}
              </Button>
              <Button
                className="w-full h-9 p-0"
                variant="dark"
                disabled={
                  !actionBtnIsActive ||
                  createCompanyShiftForDateQuery.isPending ||
                  updateCompanyShiftForDateQuery.isPending
                }
                onClick={mainActionHandler}
              >
                {t("ui.actions.save")}
              </Button>
            </div>
          </div>
        )}
        <div
          className={cn(
            "w-full h-full flex justify-center items-center rounded overflow-hidden cursor-pointer "
          )}
          style={{
            backgroundColor: isHover ? `${getShiftColor()}30` : `${getShiftColor()}20`,
          }}
          onMouseMove={() => setIsHover(true)}
          onMouseLeave={() => setIsHover(false)}
        >
          <p
            className={cn("text-sm font-bold", {})}
            style={{
              color: getShiftColor(),
            }}
          >
            {getShiftName()}
          </p>
        </div>
      </div>
    );
  }
);

ShiftItem.displayName = "ShiftItem";
export default ShiftItem;
