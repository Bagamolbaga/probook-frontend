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
import { format, isBefore, isToday, parse, setHours } from "date-fns";

import Modal from "@/components/ui/modal";
import Button from "@/components/ui/button";
import CustomSelect from "@/components/ui/inputs/Select";
import TextField from "@/components/ui/inputs/TextField";
import PersonIcon from "@/components/ui/icons/Person";
import DatePickerField from "@/components/ui/inputs/DatePickerField";
import ClockIcon from "@/components/ui/icons/Clock";
import { useTranslations } from "next-intl";
import { TimeManager } from "@/utils/timeManager";
import CloseIcon from "@/components/ui/icons/Close";
import { ConfirmationStatus } from "@/scenes/main/bookingManagement/components/timeLineCalendar/components/ConfirmationStatus";
import Comments from "@/scenes/main/bookingManagement/components/timeLineCalendar/components/Comments";

type Props = {
  isOpen: boolean;
  company: TCompany
  booking: TBooking;
  handleClose: () => void;
};

const BookingDetailsModal: FC<Props> = ({ isOpen, company, booking, handleClose }) => {
  const t = useTranslations();

  const [showOptions, setShowOptions] = useState(false);

  const status = useMemo(() => booking.status, [booking.status]);
  const updatedAt = useMemo(() => booking.updated_at, [booking.updated_at]);
  const customerData = useMemo(() => booking.client, [booking.client]);
  const assigneeData = useMemo(() => booking.specialist, [booking.specialist]);
  const time = useMemo(() => {
    const tm = new TimeManager();
    const fullSlots = tm.getFullSlotsFromArr(booking.slots);

    return {
      start: fullSlots[0],
      end: fullSlots.at(-1)!,
    };
  }, [booking.slots]);

  return (
    <Modal isOpen={isOpen} handleClose={handleClose}>
      <div className="relative w-[620px]">
        <div className="py-4 px-6 flex items-center justify-between border-b border-b-greyOutline">
          <h5 className="text-xl font-bold">
            {format(booking.date || new Date(), "MMMM dd")}, {time?.start.label} -{" "}
            {time?.end?.label}
          </h5>
          <div className="relative flex items-center gap-4">
            {/* <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-greyOutline"></div>
              <span className="text-sm font-bold cursor-pointer text-greyPrimary">
                Mark as Complete
              </span>
            </div> */}
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
                  iconLeft={<PersonIcon className="min-w-5 min-h-5 stroke-darkPrimary" />}
                  disabled
                />
              </FormControl>
            </div>

            <div className="mt-5 flex justify-between gap-5">
              <FormControl fullWidth>
                <p className="mb-2 text-sm text-greyPrimary">
                  {t("bookingManagement.form.customerInformation.email")}
                </p>

                <TextField
                  id="customer.email"
                  placeholder="Email"
                  value={customerData.email}
                  iconLeft={<PersonIcon className="min-w-5 min-h-5 stroke-darkPrimary" />}
                  disabled
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
                  iconLeft={<PersonIcon className="min-w-5 min-h-5 stroke-darkPrimary" />}
                  disabled
                />
              </FormControl>
            </div>
          </div>

          <div className="py-4 px-6">
            <p className="text-lg font-bold">
              {t("bookingManagement.form.bookingInformation.title")}
            </p>
            <div className="mt-5 flex justify-between gap-5">
              <FormControl fullWidth>
                <p className="mb-2 text-sm text-greyPrimary">
                  {t("bookingManagement.form.bookingInformation.employess")}
                </p>

                <CustomSelect
                  disabled
                  id="assignee"
                  placeholder="Assignee..."
                  IconComponent={() => (null)}
                  value={assigneeData}
                  renderValue={(value: any) => {
                    return (
                      <div className="flex items-center gap-2">
                        <PersonIcon className="stroke-darkPrimary" />
                        {value.specialist_details.first_name}{" "}
                        {value.specialist_details.last_name}
                      </div>
                    );
                  }}
                ></CustomSelect>
              </FormControl>
              <FormControl fullWidth>
                <p className="mb-2 text-sm text-greyPrimary">
                  {t("bookingManagement.form.bookingInformation.email")}
                </p>

                <CustomSelect
                  disabled
                  id="assignee"
                  placeholder="Email..."
                  IconComponent={null as any}
                  value={assigneeData}
                  renderValue={(value: any) => {
                    return (
                      <div className="flex items-center gap-2">
                        <PersonIcon className="stroke-darkPrimary" />
                        {value.specialist_details.email}
                      </div>
                    );
                  }}
                ></CustomSelect>
              </FormControl>
            </div>

            <div className="mt-5 flex justify-between gap-5">
              <FormControl fullWidth>
                <p className="mb-2 text-sm text-greyPrimary">
                  {t("bookingManagement.form.bookingInformation.time")}
                </p>

                <CustomSelect
                  disabled
                  id="time"
                  placeholder="Time..."
                  IconComponent={() => (null)}
                  value={time}
                  renderValue={(value: any) => {
                    return (
                      <div className="flex items-center gap-2">
                        <ClockIcon className="stroke-darkPrimary" />
                        {value.start.label} - {value.end.label}
                      </div>
                    );
                  }}
                >
                  <MenuItem
                    value={
                      {
                        start: time.start.label,
                        end: time.end.label,
                      } as any
                    }
                  >
                    {time.start.label} - {time.end.label}
                  </MenuItem>
                </CustomSelect>
              </FormControl>
              <div className="w-full">
                <DatePickerField
                  value={parse(booking.date, "yyyy-MM-dd", new Date())}
                  formSetValue={() => {}}
                  textField={{
                    id: "date",
                    label: t("bookingManagement.form.bookingInformation.date"),
                    className: "pt-0",
                    disabled: true,
                  }}
                  datePicker={{
                    mode: "single",
                    disabled: true,
                    selected: parse(booking.date, "yyyy-MM-dd", new Date()),
                  }}
                />
              </div>
            </div>

            <div className="mt-5 flex justify-between gap-5">
              <FormControl fullWidth>
                <p className="mb-2 text-sm text-greyPrimary">
                  {t("bookingManagement.form.bookingInformation.location")}
                </p>

                <CustomSelect
                  disabled
                  id="location"
                  placeholder="Location..."
                  IconComponent={() => (null)}
                  value={company.address1}
                  renderValue={(value: any) => {
                    return (
                      <div className="flex items-center gap-2 overflow-x-auto">
                        <PersonIcon className="stroke-darkPrimary" />
                        {value}
                      </div>
                    );
                  }}
                >
                </CustomSelect>
              </FormControl>
              <FormControl fullWidth>
                <p className="mb-2 text-sm text-greyPrimary">
                  {t("bookingManagement.form.bookingInformation.services")}
                </p>

                <CustomSelect
                  disabled
                  id="servicesId"
                  placeholder="Services..."
                  IconComponent={() => (null)}
                  value={booking.services[0]?.service_option}
                  //@ts-ignore
                  renderValue={(value: TServiceOption) => (
                    <div className="w-full flex items-center">
                      {value.name}{" "}
                      <span className="ml-1 text-xs text-greyPrimary">{`(${value.duration} mins)`}</span>
                    </div>
                  )}
                >
                  {booking.services.map((s) => (
                    <MenuItem key={s.service_option.id} value={s.service_option.id}>
                      {s.service_option.name}{" "}
                      <span className="ml-1 text-xs text-greyPrimary">{`(${s.service_option.duration} mins)`}</span>
                    </MenuItem>
                  ))}
                </CustomSelect>
              </FormControl>
            </div>
          </div>

          <Comments bookingId={booking.id} />
        </div>
      </div>
    </Modal>
  );
};

export default BookingDetailsModal;
