"use client";

/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, useEffect, useMemo, useState } from "react";
import { UseQueryResult } from "@tanstack/react-query";
import { Controller, FieldError, UseFormReturn, useForm } from "react-hook-form";
import { FormControl, MenuItem } from "@mui/material";
import { format, isBefore, isToday, setHours } from "date-fns";

import Modal from "@/components/ui/modal";
import Button from "@/components/ui/button";
import CustomSelect from "@/components/ui/inputs/Select";
import TextField from "@/components/ui/inputs/TextField";
import ArrowSecondaryDownIcon from "@/components/ui/icons/ArrowSecondaryDown";
import PersonIcon from "@/components/ui/icons/Person";
import type { FormattedDataItem, UpdateBookingForm } from "..";
import ThreeDotsIcon from "@/components/ui/icons/ThreeDots";
import DatePickerField from "@/components/ui/inputs/DatePickerField";
import Spinner from "@/components/ui/loaders/Spinner";
import { toaster } from "@/components/ui/toaster";
import ClockIcon from "@/components/ui/icons/Clock";
import Actions from "./Actions";
import {
  useDeleteBookingQuery,
  useGetBookingsQuery,
  useUpdateBookingByAdminQuery,
} from "@/api/queries/booking";
import { useTranslations } from "next-intl";
import { useGetCompanyShiftsForDateRangeQuery } from "@/api/queries/company/shift";
import { TimeSlotsManager } from "@/utils/timeSlotManager";
import { useGetCompanyDetailsQuery } from "@/api/queries/company";
import { ConfirmationStatus } from "./ConfirmationStatus";
import { TimeManager } from "@/utils/timeManager";
import { useGetCompanyId } from "@/hooks/useGetCompanyId";
import { EMAIL_REGEXP } from "@/utils/regexps";
import Comments from "./Comments";
import { useGetCompanyServicesQuery } from "@/api/queries/company/services";
import CloseIcon from "@/components/ui/icons/Close";

type Props = {
  isOpen: boolean;
  updateBookingForm: UseFormReturn<UpdateBookingForm>;
  getBookingsQuery: UseQueryResult<TGetResponse<TBooking[]>, Error>;
  getCompanySpecialistsQuery: UseQueryResult<TGetResponse<TSpecialist[]>, Error>;
  servicesQuery: UseQueryResult<TGetResponse<TService[]>, Error>;
  handleClose: () => void;
  revalidateQueries: () => void;
};

const UpdateBookingModal: FC<Props> = ({
  isOpen,
  updateBookingForm,
  getBookingsQuery,
  getCompanySpecialistsQuery,
  servicesQuery,
  handleClose,
  revalidateQueries,
}) => {
  const { companyId } = useGetCompanyId();

  const t = useTranslations();
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    getValues,
    reset,
    formState,
  } = updateBookingForm;

  const [showOptions, setShowOptions] = useState(false);

  const prevBookingData = useForm({ defaultValues: updateBookingForm.getValues() });

  const getCompanyDetailsQuery = useGetCompanyDetailsQuery({
    companyId,
  });
  const getBookingsQueryForCurrentDate = useGetBookingsQuery({
    companyId,
    queryParams: {
      start_date: updateBookingForm.getValues("date") || new Date(),
      end_date: updateBookingForm.getValues("date") || new Date(),
    },
  });

  const getCompanyServicesQuery = useGetCompanyServicesQuery({
    companyId,
    queryParams: {
      limit: "100",
      offset: "0",
    },
  });

  const getCompanyShiftsForDateRangeQuery = useGetCompanyShiftsForDateRangeQuery({
    companyId,
    start: updateBookingForm.getValues("date") || new Date(),
    end: updateBookingForm.getValues("date") || new Date(),
  });

  const updateBookingByAdminQuery = useUpdateBookingByAdminQuery();
  const deleteBookingQuery = useDeleteBookingQuery();

  const [updateBookingLoading, setUpdateBookingLoading] = useState(false);

  const updateBookingHandler = async () => {
    try {
      const data = updateBookingForm.getValues();

      if (
        data.customer &&
        data.assignee &&
        data.time &&
        data.date &&
        data.services.length
      ) {
        setUpdateBookingLoading(true);

        await updateBookingByAdminQuery.mutateAsync({
          data: {
            bookingId: data.bookingId,
            date: data.date,
            services: data.services.map((s) => ({
              id: s.service.id,
              option_id: s.option.id,
            })),
            slots: data.time.slots,
            specialist: data.assignee.id,
          },
        });

        revalidateQueries();
        toaster.success("Booking updated successfully");
      }
    } catch (error) {
      toaster.error("Something went wrong");
    } finally {
      setUpdateBookingLoading(false);
    }
  };

  const deleteBookingHandler = async () => {
    try {
      await deleteBookingQuery.mutateAsync({
        companyId: getValues("companyId"),
        bookingId: getValues("bookingId"),
      });

      handleClose();

      toaster.success("Booking deleted successfully");
    } catch (error) {
      toaster.error("Something went wrong");
    }
  };

  const changeCustomerName = (name: string) => {
    const [firstName, lastName] = name.split(" ");

    if (firstName) {
      updateBookingForm.setValue("customer.first_name", firstName);
    }

    if (lastName) {
      updateBookingForm.setValue("customer.last_name", lastName);
    } else {
      updateBookingForm.setValue("customer.last_name", "");
    }
  };

  const currStaffBookings = useMemo(() => {
    if (getBookingsQueryForCurrentDate.data) {
      return getBookingsQueryForCurrentDate.data.results.filter(
        (b) => b.specialist.id === updateBookingForm.watch("assignee")?.id
      );
    }

    return [];
  }, [getBookingsQueryForCurrentDate.data, updateBookingForm.watch("assignee")]);

  const servicesCanSelect = useMemo(() => {
    if (getCompanyServicesQuery.data) {
      const staff = updateBookingForm.watch("assignee");

      if (staff) {
        const arr: {
          service: TService;
          option: TService["options"][number];
        }[] = [];

        getCompanyServicesQuery.data.results
          .filter((s) => s.specialists.includes(staff.id))
          .forEach((s) => {
            if (s.options.length) {
              s.options.forEach((o) => {
                arr.push({ service: s, option: o });
              });
            } else {
              arr.push({ service: s, option: s.options[0] });
            }
          });

        return arr;
      }

      return [] as {
        service: TService;
        option: TService["options"][number];
      }[];
    }

    return [] as {
      service: TService;
      option: TService["options"][number];
    }[];
  }, [getCompanyServicesQuery.data, updateBookingForm.watch("assignee")]);

  const staffShiftInSelectedDate = useMemo(() => {
    const newAssignee = updateBookingForm.watch("assignee");
    const date = updateBookingForm.watch("date");

    const shift = getCompanyShiftsForDateRangeQuery.data?.results.find(
      (s) => s.id === newAssignee?.id
    );

    if (shift) {
      if (shift.shifts.length) {
        const finded = shift.shifts.find((s) => s.date === format(date, "yyyy-MM-dd"));

        if (finded) {
          const times = new TimeManager().getWorkingScheduleSlotsByWeekDay({
            workingSchedule: finded.working_schedule,
            date,
          });

          return times;
        }
      }

      const times = new TimeManager().getWorkingScheduleSlotsByWeekDay({
        workingSchedule: shift.default_shift.working_schedule,
        date,
      });

      return times;
    }
  }, [
    getCompanyShiftsForDateRangeQuery.data,
    updateBookingForm.watch("assignee"),
    updateBookingForm.watch("date"),
  ]);

  const specialistsCanSelect = useMemo(() => {
    const specialists: TSpecialist[] = [];

    getCompanySpecialistsQuery.data?.results.forEach((s) => {
      const shift = getCompanyShiftsForDateRangeQuery.data?.results.find(
        (shift) => shift.id === s.id
      );
      const defaultShiftIsWorking =
        shift &&
        new TimeManager().getWorkingScheduleSlotsByWeekDay({
          workingSchedule: shift.default_shift.working_schedule,
          date: watch("date"),
        })?.slots.length;
      const customShiftIsWorking = shift?.shifts.find(
        (s) => s.date === format(watch("date"), "yyyy-MM-dd")
      );

      const isHaveWorkingTime = defaultShiftIsWorking || customShiftIsWorking;
      const isHaveServices = getCompanyServicesQuery.data?.results.filter(service => service.specialists.includes(s.id)).length;

      if (isHaveWorkingTime && isHaveServices) {
        specialists.push(s);
      }
    });

    return specialists;
  }, [
    getCompanySpecialistsQuery.data,
    getCompanyServicesQuery.data,
    getCompanyShiftsForDateRangeQuery.data,
    watch("date"),
    watch("services"),
  ]);

  useEffect(() => {
    const newAssignee = updateBookingForm.watch("assignee");
    const time = updateBookingForm.watch("time");
    const date = updateBookingForm.watch("date");

    if (newAssignee && newAssignee.id === prevBookingData.watch("assignee.id")) return;

    let newAssigneeIsCanTakeThisBooking = false;

    if (
      getCompanySpecialistsQuery.data &&
      getBookingsQueryForCurrentDate.data &&
      getCompanyShiftsForDateRangeQuery.data &&
      staffShiftInSelectedDate &&
      newAssignee &&
      time &&
      date
    ) {
      const tm = new TimeManager();
      const timeSlotsAlreadyUsed = tm.getAlreadyUsedSlotsInBookings({
        bookings: currStaffBookings.filter(
          (b) => b.id !== updateBookingForm.watch("bookingId")
        ),
        date,
        staffId: newAssignee.id,
      });
      const slots = tm.getFullSlotsFromArr(time.slots);

      const timeSlotsAlreadyUsedWithTimeBreaks = [
        ...timeSlotsAlreadyUsed,
        ...staffShiftInSelectedDate.breaks.map((s) => s.slot).slice(0, -1),
      ].sort((a, b) => a - b);

      const alreadyUsedSlots = tm.getFullSlotsFromArr(timeSlotsAlreadyUsedWithTimeBreaks);

      const timeSlotsManager = new TimeSlotsManager({
        services: updateBookingForm.watch("services").map((s) => s.service),
        slotsAlreadyUsed: alreadyUsedSlots,
      });

      const selectedTimeInStaffShift = time.slots.every((s) =>
        staffShiftInSelectedDate.slots.map((s) => s.slot).includes(s)
      );
      const selectedTimeSlotsIsFree = time.slots.every(
        (s) => !timeSlotsManager.isAlreadyUsed(s)
      );
      const selectedTimeIsBefore = isBefore(
        setHours(date, slots[0].hour).setMinutes(slots[0].minute),
        new Date()
      );

      if (selectedTimeInStaffShift && selectedTimeSlotsIsFree && !selectedTimeIsBefore) {
        newAssigneeIsCanTakeThisBooking = true;
      }
    }

    if (!newAssigneeIsCanTakeThisBooking) {
      time && updateBookingForm.setValue("time", null);
    }

    const dateIsBefore = isBefore(date, new Date());
    const dateIsToday = isToday(date);
    if (dateIsBefore && !dateIsToday) {
      time && updateBookingForm.setValue("time", null);
      // updateBookingForm.setValue("date", null);
    }
  }, [
    prevBookingData,
    getBookingsQueryForCurrentDate,
    getCompanySpecialistsQuery,
    getCompanyShiftsForDateRangeQuery,
    watch("assignee"),
  ]);

  useEffect(() => {
    const date = updateBookingForm.watch("date");
    const prevDate = prevBookingData.watch("date");

    if (format(prevDate, "yyyy-MM-dd") !== format(date, "yyyy-MM-dd")) {
      updateBookingForm.setValue("time", null);
    }
  }, [prevBookingData, updateBookingForm.watch("date")]);

  useEffect(() => {
    const services = updateBookingForm
      .watch("services")
      .map((s) => s.service);
   
    const prevServices = prevBookingData
      .watch("services")
      .map((s) => s.service);
    
    const options = updateBookingForm
      .watch("services")
      .map((s) => s.option);
   
    const prevOptions = prevBookingData
      .watch("services")
      .map((s) => s.option);

    const specialist = watch("assignee");

    if (!services.every(s => prevServices.find(ps => ps.id === s.id)) || !options.every(s => prevOptions.find(ps => ps.id === s.id))) {
      // const time = options.map(o => o.)
      updateBookingForm.setValue("time", null);
    }

    if (specialist && services.length) {
      const isSpecialistHaveSelectedServices = services.every((service) => service.specialists.includes(specialist.id));

      !isSpecialistHaveSelectedServices &&
        updateBookingForm.setValue("assignee", undefined);
    }

    if (services && prevServices) {
      const isChanged = !services.every((s) =>
        prevServices.find((ps) => ps.id === s.id)
      );

      // isChanged && updateBookingForm.setValue("time", null);
    }
  }, [prevBookingData, watch("services")]);

  useEffect(() => {
    const specialist = watch("assignee");
    const services = watch("services");

    if (specialist && services.length) {
      const specialistHaveSelectedServices = services.every((s) => s.service.specialists.includes(specialist.id));

      if (!specialistHaveSelectedServices) {
        updateBookingForm.setValue("services", []);
      }
    }
  }, [watch("assignee")]);

  const timeDoubleSlotsV2 = useMemo(() => {
    const bookingId = updateBookingForm.watch("bookingId");
    const newAssignee = updateBookingForm.watch("assignee");
    const services = updateBookingForm
      .watch("services")
      .map((s) => s);
    const date = updateBookingForm.watch("date");

    if (
      newAssignee &&
      getBookingsQueryForCurrentDate.data?.results &&
      staffShiftInSelectedDate
    ) {
      const tm = new TimeManager();
      const timeSlotsAlreadyUsed = tm.getAlreadyUsedSlotsInBookings({
        bookings: currStaffBookings.filter(
          (b) => b.id !== updateBookingForm.watch("bookingId")
        ),
        date,
        staffId: newAssignee.id,
      });

      const timeSlotsAlreadyUsedWithTimeBreaks = [
        ...timeSlotsAlreadyUsed,
        ...staffShiftInSelectedDate.breaks.map((s) => s.slot).slice(0, -1),
      ].sort((a, b) => a - b);

      const alreadyUsedSlots = tm.getFullSlotsFromArr(timeSlotsAlreadyUsedWithTimeBreaks);

      const timeSlotsManager = new TimeSlotsManager({
        services: services.map(s => s.service),
        slotsAlreadyUsed: [...alreadyUsedSlots],
      });

      const doubleSlots2 = timeSlotsManager.getDoubledSlotsV2({
        options: services.map((s) => s.option),
        shift: {
          name: "",
          slots: staffShiftInSelectedDate.slots.map((s) => s.slot),
          breaks: staffShiftInSelectedDate.breaks.map((s) => s.slot),
        },
        staffBookingsUsedSlots: alreadyUsedSlots.map((s) => s.slot),
        duration: services.reduce((acc, s) => (acc += s.option.duration), 0),
      });

      if (isToday(date)) {
        return doubleSlots2.filter(
          ([f, l]) => !isBefore(setHours(date, f.hour).setMinutes(f.minute), new Date())
        );
      }

      return doubleSlots2;
    }

    return [];
  }, [
    currStaffBookings,
    getBookingsQueryForCurrentDate.data?.results,
    staffShiftInSelectedDate,
    updateBookingForm,
    updateBookingForm.watch("assignee"),
    updateBookingForm.watch("services"),
    updateBookingForm.watch("date"),
  ]);

  const hideOptionsHandler = () => {
    setShowOptions(false);
  };

  const toggleShowOptionsHandler = () => {
    setShowOptions((p) => !p);
  };

  // const mappedDataForModal: FormattedDataItem[] = useMemo(() => {
  //   if (!getCompanySpecialistsQuery.data || !getBookingsQuery.data) {
  //     return [];
  //   }

  //   const data: FormattedDataItem[] = [];

  //   getCompanySpecialistsQuery.data.results.forEach((s) => {
  //     data.push({
  //       id: s.id,
  //       company: s.company,
  //       specialist: s,
  //       shifts: [],
  //       revalidateQueries: () => {},
  //     });
  //   });

  //   getBookingsQuery.data.results.forEach((item) => {
  //     const findedIdx = data.findIndex((i) => i?.id === item.specialist?.id);

  //     if (findedIdx >= 0) {
  //       data[findedIdx].shifts.push({
  //         id: item.id,
  //         client: item.client,
  //         slots: item.slots,
  //         date: item.date,
  //         status: item.status,
  //         updatedAt: item.updated_at,
  //         services: item.services.map((s) => ({
  //           ...s.service,
  //           selectedOption: s.service_option,
  //         })),
  //       });
  //     }
  //   });

  //   // return data;
  //   return data.map((i) => ({
  //     ...i,
  //     shifts: watch("date")
  //       ? i.shifts.filter((i) => i.date === format(watch("date"), "yyyy-MM-dd"))
  //       : i.shifts,
  //   }));
  // }, [getCompanySpecialistsQuery.data, getBookingsQuery.data, watch("date")]);

  const status = useMemo(() => watch("status"), [watch("status")]);
  const updatedAt = useMemo(() => watch("updatedAt"), [watch("updatedAt")]);
  const customerData = useMemo(() => watch("customer"), [watch("customer")]);
  const assigneeData = useMemo(() => watch("assignee"), [watch("assignee")]);
  const time = useMemo(() => watch("time"), [watch("time")]);

  const bookingDataIsChanged = useMemo(() => {
    const curr = updateBookingForm.watch();
    const prev = prevBookingData.watch();

    const customerChanged =
      curr.customer.first_name + curr.customer.last_name !==
        prev.customer.first_name + prev.customer.last_name ||
      curr.customer.username !== prev.customer.username;

    const staffChanged = curr.assignee?.id !== prev.assignee?.id;
    const emailChanged = curr.customer.email !== prev.customer.email;

    const timeChanged =
      curr.time && prev.time
        ? curr.time.slots[0] !== prev.time.slots[0] ||
          curr.time.slots.at(-1) !== prev.time.slots.at(-1)
        : false;

    const dateChanged =
      format(curr.date, "yyyy-MM-dd") !== format(prev.date, "yyyy-MM-dd");

    const servicesChanged = !curr.services.every((s) =>
      prev.services.find((ps) => ps.service.id === s.service.id && ps.option.id === s.option.id)
    );

    return (
      customerChanged ||
      emailChanged ||
      staffChanged ||
      timeChanged ||
      dateChanged ||
      servicesChanged
    );
  }, [updateBookingForm.watch(), prevBookingData.watch()]);

  const disableDatePickerDate = (date: Date) => {
    let isWeekendDay = false;

    const workingSchedule = getCompanyDetailsQuery.data?.working_schedule;
    if (workingSchedule) {
      const day = format(date, "EEEE") as keyof typeof workingSchedule;

      if (workingSchedule[day]?.times.length === 0) {
        isWeekendDay = true;
      }
    }

    return isWeekendDay || isBefore(date, new Date());
  };

  return (
    <Modal isOpen={isOpen} handleClose={handleClose}>
      <div className="relative w-[620px] sm:w-full">
        <div className="py-4 px-6 flex items-center justify-between border-b border-b-greyOutline">
          <h5 className="text-xl font-bold">
            {format(getValues("date") || new Date(), "MMMM dd")}, {time?.start} -{" "}
            {time?.end}
          </h5>
          <div className="relative flex items-center gap-4">
            {/* <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-greyOutline"></div>
              <span className="text-sm font-bold cursor-pointer text-greyPrimary">
                Mark as Complete
              </span>
            </div> */}
            <Button variant="resting-active" onClick={toggleShowOptionsHandler}>
              <ThreeDotsIcon className="w-3 h-3 fill-greyPrimary" />
            </Button>
            <Button
              variant="primary"
              disabled={
                !bookingDataIsChanged ||
                !updateBookingForm.formState.isValid ||
                !watch("services").length
              }
              onClick={updateBookingForm.handleSubmit(updateBookingHandler)}
            >
              {updateBookingLoading ? (
                <Spinner className="size-4" />
              ) : (
                t("bookingManagement.actions.save")
              )}
            </Button>
            {showOptions && (
              <Actions
                handleClose={hideOptionsHandler}
                handleDelete={deleteBookingHandler}
              />
            )}
            <Button
              className="w-9 h-9 p-0"
              variant="resting-active"
              onClick={handleClose}
            >
              <CloseIcon className="w-5 h-5 stroke-greyPrimary" />
            </Button>
          </div>
        </div>

        <ConfirmationStatus status={status} updatedAt={updatedAt} />

        {/* calc(100vh-py-header-bottom) */}
        <div className="max-h-[calc(100vh-140px-83px-100px)] overflow-y-auto">
          <div className="pb-4 px-6">
            <p className="text-lg font-bold">
              {t("bookingManagement.form.customerInformation.title")}
            </p>
            <div className="mt-5 flex justify-between gap-5">
              <FormControl fullWidth>
                <p className="mb-2 text-sm text-greyPrimary">
                  {t("bookingManagement.form.customerInformation.name")}
                </p>

                <TextField
                  id="customer.name"
                  value={`${customerData.first_name} ${customerData.last_name}`}
                  onChange={(e) => changeCustomerName(e.target.value)}
                  iconLeft={<PersonIcon className="min-w-5 min-h-5 stroke-darkPrimary" />}
                />
              </FormControl>
            </div>

            <div className="mt-5 flex justify-between gap-5 sm:flex-col">
              <FormControl fullWidth>
                <p className="mb-2 text-sm text-greyPrimary">
                  {t("bookingManagement.form.customerInformation.email")}
                </p>

                <TextField
                  id="customer.email"
                  placeholder="Email"
                  value={customerData.email}
                  register={updateBookingForm.register}
                  error={formState.errors.customer?.email}
                  rules={{
                    pattern: EMAIL_REGEXP,
                  }}
                  iconLeft={<PersonIcon className="min-w-5 min-h-5 stroke-darkPrimary" />}
                />
              </FormControl>
              <FormControl fullWidth>
                <p className="mb-2 text-sm text-greyPrimary">
                  {t("bookingManagement.form.customerInformation.phone")}
                </p>
                <TextField
                  id="customer.phone"
                  placeholder="Phone number"
                  value={customerData.phone}
                  onChange={(e) =>
                    updateBookingForm.setValue("customer.phone", e.target.value)
                  }
                  iconLeft={<PersonIcon className="min-w-5 min-h-5 stroke-darkPrimary" />}
                />
              </FormControl>
            </div>
          </div>

          <div className="py-4 px-6">
            <p className="text-lg font-bold">
              {t("bookingManagement.form.bookingInformation.title")}
            </p>
            <div className="mt-5 flex justify-between gap-5 sm:flex-col">
              <FormControl fullWidth>
                <p className="mb-2 text-sm text-greyPrimary">
                  {t("bookingManagement.form.bookingInformation.employess")}
                </p>
                <Controller
                  render={({ field, formState }) => (
                    <CustomSelect
                      id="assignee"
                      placeholder="Assignee..."
                      IconComponent={ArrowSecondaryDownIcon}
                      error={!!formState.errors.assignee}
                      renderValue={(value: any) => {
                        return (
                          <div className="flex items-center gap-2">
                            <PersonIcon className="stroke-darkPrimary" />
                            {assigneeData?.specialist_details.first_name}{" "}
                            {assigneeData?.specialist_details.last_name}
                          </div>
                        );
                      }}
                      {...field}
                    >
                      {specialistsCanSelect.map((item) => (
                        <MenuItem key={item.id} value={item as any}>
                          {item.specialist_details.first_name}{" "}
                          {item.specialist_details.last_name}
                        </MenuItem>
                      ))}
                    </CustomSelect>
                  )}
                  name="assignee"
                  control={control}
                  rules={{ required: true }}
                />
              </FormControl>
              <FormControl fullWidth>
                <p className="mb-2 text-sm text-greyPrimary">
                  {t("bookingManagement.form.bookingInformation.email")}
                </p>
                <Controller
                  render={({ field, formState }) => (
                    <CustomSelect
                      disabled
                      id="assignee"
                      placeholder="Email..."
                      IconComponent={null as any}
                      error={!!formState.errors.assignee?.specialist_details?.email}
                      renderValue={(value: any) => {
                        return (
                          <div className="flex items-center gap-2">
                            <PersonIcon className="stroke-darkPrimary" />
                            {value.specialist_details.email}
                          </div>
                        );
                      }}
                      {...field}
                    ></CustomSelect>
                  )}
                  name="assignee"
                  control={control}
                  rules={{ required: true }}
                />
              </FormControl>
            </div>

            <div className="mt-5 flex justify-between gap-5 sm:flex-col">
              <FormControl fullWidth>
                <p className="mb-2 text-sm text-greyPrimary">
                  {t("bookingManagement.form.bookingInformation.time")}
                </p>
                <Controller
                  render={({ field, formState }) => (
                    <CustomSelect
                      id="time"
                      placeholder="Time..."
                      IconComponent={ArrowSecondaryDownIcon}
                      error={!!formState.errors.time || !updateBookingForm.watch("time")}
                      renderValue={(value: any) => {
                        return (
                          <div className="flex items-center gap-2">
                            <ClockIcon className="stroke-darkPrimary" />
                            {value.start} - {value.end}
                          </div>
                        );
                      }}
                      {...field}
                    >
                      {timeDoubleSlotsV2.length ? (
                        timeDoubleSlotsV2.map(([s, e]) => {
                          const timeSlotsManager = new TimeSlotsManager();

                          const slots = timeSlotsManager.getSlotsInRange(s.slot, e.slot);
                          return (
                            <MenuItem
                              key={s.slot}
                              value={
                                {
                                  start: s.label,
                                  end: e.label,
                                  slots,
                                } as any
                              }
                            >
                              {s.label} - {e.label}
                            </MenuItem>
                          );
                        })
                      ) : (
                        <MenuItem key={-1} value={undefined}>
                          No time options
                        </MenuItem>
                      )}
                    </CustomSelect>
                  )}
                  name="time"
                  control={control}
                  rules={{ required: true }}
                />
              </FormControl>
              <div className="w-full">
                <DatePickerField
                  value={watch("date")}
                  formSetValue={updateBookingForm.setValue}
                  textField={{
                    id: "date",
                    register,
                    label: t("bookingManagement.form.bookingInformation.date"),
                    className: "pt-0",
                    error: (format(prevBookingData.watch("date"), "yyyy-MM-dd") !==
                      format(updateBookingForm.watch("date"), "yyyy-MM-dd") &&
                    isBefore(watch("date"), new Date())
                      ? true
                      : undefined) as unknown as FieldError,
                    // disabled: true,
                  }}
                  datePicker={{
                    mode: "single",
                    disabled: (date) => disableDatePickerDate(date),
                    selected: getValues("date") || undefined,
                  }}
                />
              </div>
            </div>

            <div className="mt-5 flex justify-between gap-5 sm:flex-col">
              <FormControl fullWidth>
                <p className="mb-2 text-sm text-greyPrimary">
                  {t("bookingManagement.form.bookingInformation.location")}
                </p>
                <Controller
                  render={({ field, formState }) => (
                    <CustomSelect
                      disabled
                      id="location"
                      placeholder="Location..."
                      IconComponent={ArrowSecondaryDownIcon}
                      error={!!formState.errors.location}
                      renderValue={(value: any) => {
                        return (
                          <div className="flex items-center gap-2">
                            <PersonIcon className="stroke-darkPrimary" />
                            {value}
                          </div>
                        );
                      }}
                      {...field}
                    >
                      <MenuItem key={1} value={"Store 1"}>
                        Store 1
                      </MenuItem>
                      <MenuItem key={2} value={"Store 2"}>
                        Store 2
                      </MenuItem>
                    </CustomSelect>
                  )}
                  name="location"
                  control={control}
                  rules={{ required: true }}
                />
              </FormControl>
              <FormControl fullWidth>
                <p className="mb-2 text-sm text-greyPrimary">
                  {t("bookingManagement.form.bookingInformation.services")}
                </p>
                <Controller
                  render={({ field, formState }) => (
                    <CustomSelect
                      // disabled
                      // multiple
                      id="servicesId"
                      placeholder="Services..."
                      IconComponent={ArrowSecondaryDownIcon}
                      error={!!formState.errors.services}
                      {...field}
                      onChange={(e) => {
                        const target = e.target.value as string
                        const sId = Number(target.split("-")[0])
                        const oId = Number(target.split("-")[1])
                        const service = servicesCanSelect.find(s => s.service.id === sId && s.option.id === oId)
                        console.log({target});

                        field.onChange(e);
                        setValue(
                          "services",
                          service ? [service] : [] //TODO it can be crash in runtime. get selected option and create new function
                        );
                      }}
                    >
                      {servicesCanSelect.map((i) => (
                        <MenuItem key={`${i.service.id}-${i.option.id}`} value={`${i.service.id}-${i.option.id}`}>
                          {i.service.name}
                          {i.option && ` ${i.option.name}`}
                          <span className="ml-1 text-xs text-greyPrimary">{`(${i.option?.duration} mins)`}</span>
                        </MenuItem>
                      ))}
                    </CustomSelect>
                  )}
                  name="servicesId"
                  control={control}
                  rules={{ required: true }}
                />
              </FormControl>
            </div>
          </div>

          <Comments bookingId={getValues("bookingId")} />
        </div>
      </div>
    </Modal>
  );
};

export default UpdateBookingModal;
