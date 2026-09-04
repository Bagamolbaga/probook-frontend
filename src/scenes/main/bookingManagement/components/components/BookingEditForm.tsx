"use client";

import { useEffect, useMemo, useState } from "react";
import { format, parse } from "date-fns";
import { MenuItem, Popover } from "@mui/material";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { useTranslations } from "next-intl";

import {
  useGetBookingAvailabilityQuery,
  useRescheduleOwnBookingMutation,
  useUpdateApiBookingQuery,
} from "@/api/queries/booking";
import { useGetCompanyServicesQuery } from "@/api/queries/company/services";
import { useGetCompanySpecialistsQuery } from "@/api/queries/company/specialists";
import DatePicker from "@/components/ui/DatePicker";
import Button from "@/components/ui/button";
import CalendarIcon from "@/components/ui/icons/Calendar";
import UiSelect from "@/components/ui/inputs/Select";
import { BOOKING_STATUSES } from "@/constants/bookingStatuses";
import { TIME_SLOTS } from "@/constants/timeSlots";
import { formatCurrency } from "@/utils/formatCurrency";
import type { UseFormReturn } from "react-hook-form";
import type { UpdateBookingForm } from "./types";

type ServiceSelection = {
  serviceId: string;
  optionId: string;
};

type EditBookingFormValues = {
  specialistId: string;
  services: ServiceSelection[];
  date: string;
  startSlot: string;
  status: TApiBooking["status"];
};

type Props = {
  updateBookingForm: UseFormReturn<UpdateBookingForm>;
  onCancel: () => void;
  onSaved: () => void;
  onDirtyChange: (isDirty: boolean) => void;
  specialistMode?: boolean;
};

const EMPTY_SERVICE_SELECTIONS: ServiceSelection[] = [];
const EMPTY_SERVICES: TService[] = [];
const EMPTY_SPECIALISTS: TSpecialist[] = [];

const getEntityId = (entity: { id: string | number; _id?: string }) =>
  String(entity._id || entity.id);

const getSpecialistReferenceId = (specialist: string | TServiceSpecialist) =>
  typeof specialist === "string" ? specialist : specialist.id;

const getSlotLabel = (slot: number) => {
  if (slot === TIME_SLOTS.length) return "24:00";
  return TIME_SLOTS.find((item) => item.slot === slot)?.label || "";
};

const toViewFormValues = (booking: TApiBooking, companyId: string): UpdateBookingForm => {
  const firstSlot = booking.slots.length ? Math.min(...booking.slots) : -1;
  const lastSlot = booking.slots.length ? Math.max(...booking.slots) + 1 : -1;

  return {
    companyId,
    bookingId: booking.id,
    status: booking.status,
    totalPrice: booking.totalPrice,
    createdAt: booking.createdAt,
    updatedAt: booking.updatedAt,
    assignee: booking.specialist,
    customer: booking.customer,
    time: booking.slots.length
      ? {
          start: getSlotLabel(firstSlot),
          end: getSlotLabel(lastSlot),
          slots: booking.slots,
        }
      : null,
    date: parse(booking.date, "yyyy-MM-dd", new Date()),
    location: "",
    servicesId: booking.services.map((service) => service.id),
    services: booking.services,
  };
};

const BookingEditForm = ({
  updateBookingForm,
  onCancel,
  onSaved,
  onDirtyChange,
  specialistMode = false,
}: Props) => {
  const t = useTranslations("bookingManagement.detailModal.edit");
  const booking = updateBookingForm.getValues();
  const companyId = booking.companyId;
  const form = useForm<EditBookingFormValues>({
    defaultValues: {
      specialistId: booking.assignee?.id || "",
      services: booking.services.map((service) => ({
        serviceId: service.id,
        optionId: service.selectedOption.id,
      })),
      date: format(booking.date, "yyyy-MM-dd"),
      startSlot: booking.time?.slots[0]?.toString() || "",
      status: booking.status,
    },
  });
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "services",
  });
  const specialistId = useWatch({ control: form.control, name: "specialistId" });
  const serviceSelections =
    useWatch({ control: form.control, name: "services" }) || EMPTY_SERVICE_SELECTIONS;
  const date = useWatch({ control: form.control, name: "date" });
  const startSlot = useWatch({ control: form.control, name: "startSlot" });
  const status = useWatch({ control: form.control, name: "status" });
  const specialistsQuery = useGetCompanySpecialistsQuery({
    companyId,
    enabled: !specialistMode,
  });
  const servicesQuery = useGetCompanyServicesQuery({
    companyId,
    enabled: !specialistMode,
  });
  const availabilityQuery = useGetBookingAvailabilityQuery({
    companyId,
    bookingId: booking.bookingId,
    specialistId,
    date,
  });
  const updateBookingMutation = useUpdateApiBookingQuery();
  const rescheduleOwnBookingMutation = useRescheduleOwnBookingMutation();
  const services = specialistMode
    ? booking.services.map((service) => ({
        ...service,
        options: [service.selectedOption],
        specialists: [booking.assignee!],
      }))
    : servicesQuery.data?.results || EMPTY_SERVICES;
  const specialists = specialistMode
    ? booking.assignee
      ? [booking.assignee]
      : EMPTY_SPECIALISTS
    : specialistsQuery.data?.results || EMPTY_SPECIALISTS;
  const [datePickerAnchor, setDatePickerAnchor] = useState<HTMLElement | null>(null);
  const selectedDate = date ? parse(date, "yyyy-MM-dd", new Date()) : undefined;

  useEffect(() => {
    onDirtyChange(form.formState.isDirty);
  }, [form.formState.isDirty, onDirtyChange]);

  const selectedServices = useMemo(
    () =>
      serviceSelections.map((selection) => {
        const service = services.find(
          (item) => getEntityId(item) === selection.serviceId
        );
        const option = service?.options.find(
          (item) => getEntityId(item) === selection.optionId
        );

        return { service, option };
      }),
    [serviceSelections, services]
  );
  const totalDuration = selectedServices.reduce(
    (total, selection) => total + (selection.option?.duration || 0),
    0
  );
  const totalPrice = selectedServices.reduce(
    (total, selection) => total + (selection.option?.price || 0),
    0
  );
  const slotsNeeded = Math.ceil(totalDuration / 15);
  const servicesAreSupported = selectedServices.every(({ service }) => {
    if (!service || !specialistId) return false;
    return (
      service.specialists.length === 0 ||
      service.specialists.some(
        (specialist) => getSpecialistReferenceId(specialist) === specialistId
      )
    );
  });
  const availableStartSlots = useMemo(() => {
    if (!availabilityQuery.data || slotsNeeded === 0) return [];

    const availableSlots = new Set(availabilityQuery.data.availableSlots);
    return Array.from(availableSlots)
      .filter((slot) =>
        Array.from({ length: slotsNeeded }, (_, index) => slot + index).every(
          (requestedSlot) => availableSlots.has(requestedSlot)
        )
      )
      .sort((left, right) => left - right);
  }, [availabilityQuery.data, slotsNeeded]);
  const selectedStartSlot = Number(startSlot);
  const hasValidStartSlot =
    startSlot !== "" && availableStartSlots.includes(selectedStartSlot);
  const canSubmit =
    Boolean(specialistId && date && status) &&
    serviceSelections.length > 0 &&
    selectedServices.every(({ service, option }) => Boolean(service && option)) &&
    servicesAreSupported &&
    slotsNeeded > 0 &&
    hasValidStartSlot &&
    !updateBookingMutation.isPending &&
    !rescheduleOwnBookingMutation.isPending;

  const resetTime = () => form.setValue("startSlot", "", { shouldDirty: true });

  const handleServiceChange = (index: number, serviceId: string) => {
    const service = services.find((item) => getEntityId(item) === serviceId);
    form.setValue(`services.${index}.serviceId`, serviceId, { shouldDirty: true });
    form.setValue(
      `services.${index}.optionId`,
      service?.options[0] ? getEntityId(service.options[0]) : "",
      { shouldDirty: true }
    );
    resetTime();
  };

  const handleAddService = () => {
    const selectedIds = new Set(serviceSelections.map((item) => item.serviceId));
    const service = services.find(
      (item) =>
        !selectedIds.has(getEntityId(item)) &&
        (item.specialists.length === 0 ||
          item.specialists.some(
            (specialist) => getSpecialistReferenceId(specialist) === specialistId
          ))
    );

    if (!service?.options[0]) return;
    append({
      serviceId: getEntityId(service),
      optionId: getEntityId(service.options[0]),
    });
    resetTime();
  };

  const handleSubmit = form.handleSubmit(async (values) => {
    if (!canSubmit) return;

    const slots = Array.from(
      { length: slotsNeeded },
      (_, index) => Number(values.startSlot) + index
    );

    try {
      if (specialistMode) {
        const wasRescheduled =
          values.date !== format(booking.date, "yyyy-MM-dd") ||
          slots.some((slot, index) => slot !== booking.time?.slots[index]);
        let response = wasRescheduled
          ? await rescheduleOwnBookingMutation.mutateAsync({
              companyId,
              bookingId: booking.bookingId,
              data: { date: values.date, slots },
            })
          : null;

        if (values.status !== booking.status) {
          response = await updateBookingMutation.mutateAsync({
            companyId,
            bookingId: booking.bookingId,
            data: {
              specialistId: values.specialistId,
              services: values.services,
              date: values.date,
              slots,
              status: values.status,
            },
          });
        }

        if (response) updateBookingForm.reset(toViewFormValues(response.data, companyId));
        onSaved();
        return;
      }

      const response = await updateBookingMutation.mutateAsync({
        companyId,
        bookingId: booking.bookingId,
        data: {
          specialistId: values.specialistId,
          services: values.services,
          date: values.date,
          slots,
          status: values.status,
        },
      });

      updateBookingForm.reset(toViewFormValues(response.data, companyId));
      onSaved();
    } catch {
      // The mutation state renders the localized error below the form.
    }
  });

  return (
    <form
      className="max-h-[calc(100vh-160px)] overflow-y-auto bg-greyBackground/30 px-5 py-4 sm:px-4"
      onSubmit={handleSubmit}
    >
      <div className="space-y-3">
        <section className="rounded-lg border border-greyOutline bg-white p-4">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-1">
            {!specialistMode ? (
              <label className="text-xs font-bold text-darkPrimary">
                {t("specialist")}
                <UiSelect
                  className="mt-2"
                  displayEmpty
                  fullWidth
                  size="small"
                  value={specialistId}
                  onChange={(event) => {
                    form.setValue("specialistId", String(event.target.value), {
                      shouldDirty: true,
                    });
                    resetTime();
                  }}
                >
                  <MenuItem value="">{t("selectSpecialist")}</MenuItem>
                  {specialists.map((specialist) => (
                    <MenuItem key={specialist.id} value={specialist.id}>
                      {specialist.fullName}
                    </MenuItem>
                  ))}
                </UiSelect>
              </label>
            ) : null}

            <label className="text-xs font-bold text-darkPrimary">
              {t("status")}
              <UiSelect
                className="mt-2"
                fullWidth
                size="small"
                value={status}
                onChange={(event) =>
                  form.setValue(
                    "status",
                    String(event.target.value) as TApiBooking["status"],
                    {
                      shouldDirty: true,
                    }
                  )
                }
              >
                {(specialistMode
                  ? [
                      status,
                      ...(status === "PENDING" ? (["CONFIRMED"] as const) : []),
                      ...(status === "CONFIRMED" ? (["COMPLETED"] as const) : []),
                    ]
                  : BOOKING_STATUSES
                ).map((option) => (
                  <MenuItem key={option} value={option}>
                    {t(`statuses.${option}`)}
                  </MenuItem>
                ))}
              </UiSelect>
            </label>
          </div>
        </section>

        {!specialistMode ? (
          <section className="rounded-lg border border-greyOutline bg-white p-4">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-bold text-darkPrimary">{t("services")}</h3>
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={!specialistId || services.length <= fields.length}
                onClick={handleAddService}
              >
                {t("addService")}
              </Button>
            </div>

            <div className="mt-3 space-y-3">
              {fields.map((field, index) => {
                const selection = serviceSelections[index];
                const selectedService = services.find(
                  (service) => getEntityId(service) === selection?.serviceId
                );

                return (
                  <div
                    className="grid grid-cols-[1fr_1fr_auto] gap-2 sm:grid-cols-1"
                    key={field.id}
                  >
                    <UiSelect
                      aria-label={t("service")}
                      fullWidth
                      size="small"
                      value={selection?.serviceId || ""}
                      onChange={(event) =>
                        handleServiceChange(index, String(event.target.value))
                      }
                    >
                      <MenuItem value="">{t("selectService")}</MenuItem>
                      {services.map((service) => (
                        <MenuItem key={service.id} value={getEntityId(service)}>
                          {service.name}
                        </MenuItem>
                      ))}
                    </UiSelect>

                    <UiSelect
                      aria-label={t("serviceOption")}
                      fullWidth
                      size="small"
                      value={selection?.optionId || ""}
                      onChange={(event) => {
                        form.setValue(
                          `services.${index}.optionId`,
                          String(event.target.value),
                          {
                            shouldDirty: true,
                          }
                        );
                        resetTime();
                      }}
                    >
                      <MenuItem value="">{t("selectOption")}</MenuItem>
                      {selectedService?.options.map((option) => (
                        <MenuItem key={getEntityId(option)} value={getEntityId(option)}>
                          {option.name || selectedService.name} · {option.duration}{" "}
                          {t("min")}
                        </MenuItem>
                      ))}
                    </UiSelect>

                    <Button
                      type="button"
                      size="sm"
                      variant="red-outline"
                      disabled={fields.length === 1}
                      onClick={() => {
                        remove(index);
                        resetTime();
                      }}
                    >
                      {t("remove")}
                    </Button>
                  </div>
                );
              })}
            </div>

            {!servicesAreSupported && specialistId ? (
              <p className="mt-3 text-xs text-redPrimary">{t("unsupportedService")}</p>
            ) : null}

            <div className="mt-3 flex justify-end gap-4 border-t border-greyOutline pt-3 text-xs text-greyPrimary">
              <span>{t("duration", { count: totalDuration })}</span>
              <span className="font-bold text-darkPrimary">
                {formatCurrency(totalPrice)}
              </span>
            </div>
          </section>
        ) : null}

        <section className="rounded-lg border border-greyOutline bg-white p-4">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-1">
            <label className="text-xs font-bold text-darkPrimary">
              {t("date")}
              <div className="mt-2">
                <Button
                  className="h-10 w-full justify-between px-3 py-2 font-normal"
                  type="button"
                  variant="resting-active"
                  onClick={(event) =>
                    setDatePickerAnchor((anchor) => (anchor ? null : event.currentTarget))
                  }
                >
                  <span>{selectedDate ? format(selectedDate, "dd/MM/yyyy") : ""}</span>
                  <CalendarIcon className="size-5 shrink-0" />
                </Button>

                <Popover
                  open={Boolean(datePickerAnchor)}
                  anchorEl={datePickerAnchor}
                  onClose={() => setDatePickerAnchor(null)}
                  anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                  transformOrigin={{ vertical: "top", horizontal: "left" }}
                  disableScrollLock
                  PaperProps={{ className: "mt-2 overflow-visible rounded-lg" }}
                >
                  <DatePicker
                    mode="single"
                    selected={selectedDate}
                    defaultMonth={selectedDate}
                    onSelect={(nextDate) => {
                      if (!nextDate) return;
                      form.setValue("date", format(nextDate, "yyyy-MM-dd"), {
                        shouldDirty: true,
                      });
                      resetTime();
                      setDatePickerAnchor(null);
                    }}
                  />
                </Popover>
              </div>
            </label>

            <label className="text-xs font-bold text-darkPrimary">
              {t("time")}
              <UiSelect
                className="mt-2"
                displayEmpty
                fullWidth
                size="small"
                value={startSlot}
                disabled={
                  !specialistId ||
                  !date ||
                  slotsNeeded === 0 ||
                  availabilityQuery.isPending
                }
                onChange={(event) =>
                  form.setValue("startSlot", String(event.target.value), {
                    shouldDirty: true,
                  })
                }
              >
                <MenuItem value="">
                  {availabilityQuery.isPending ? t("loadingTime") : t("selectTime")}
                </MenuItem>
                {availableStartSlots.map((slot) => (
                  <MenuItem key={slot} value={slot.toString()}>
                    {getSlotLabel(slot)}–{getSlotLabel(slot + slotsNeeded)}
                  </MenuItem>
                ))}
              </UiSelect>
            </label>
          </div>

          {availabilityQuery.isError ? (
            <p className="mt-3 text-xs text-redPrimary">{t("availabilityError")}</p>
          ) : null}
          {!availabilityQuery.isPending &&
          availabilityQuery.data &&
          availableStartSlots.length === 0 ? (
            <p className="mt-3 text-xs text-greyPrimary">{t("noAvailableTime")}</p>
          ) : null}
        </section>
      </div>

      {updateBookingMutation.isError ? (
        <p className="mt-3 text-xs text-redPrimary">{t("saveError")}</p>
      ) : null}

      <div className="mt-4 flex justify-end gap-2 border-t border-greyOutline pt-4">
        <Button type="button" variant="resting-active" onClick={onCancel}>
          {t("cancel")}
        </Button>
        <Button type="submit" variant="primary" disabled={!canSubmit}>
          {updateBookingMutation.isPending ? t("saving") : t("save")}
        </Button>
      </div>
    </form>
  );
};

export default BookingEditForm;
