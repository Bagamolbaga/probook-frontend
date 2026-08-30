import { BookingCreatedNotification } from "@/api/entities/notification";
import { TIME_SLOTS } from "@/constants/timeSlots";
import CalendarIcon from "@/components/ui/icons/Calendar";
import ClockIcon from "@/components/ui/icons/Clock";
import { formatCurrency } from "@/utils/formatCurrency";
import { useLocale, useTranslations } from "next-intl";

type Props = {
  notification: BookingCreatedNotification;
};

const formatBookingDate = (date: string, locale: string) => {
  const [year, month, day] = date.split("-").map(Number);

  if (!year || !month || !day) return date;

  return new Intl.DateTimeFormat(locale === "ru" ? "ru-RU" : "en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, day)));
};

const getBookingTime = (slots: number[], timeTbd: string) => {
  if (!slots.length) return timeTbd;

  const startSlot = Math.min(...slots);
  const endSlot = Math.max(...slots) + 1;
  const startTime = TIME_SLOTS.find((slot) => slot.slot === startSlot)?.label;
  const endTime =
    endSlot === TIME_SLOTS.length
      ? "24:00"
      : TIME_SLOTS.find((slot) => slot.slot === endSlot)?.label;

  if (!startTime) return timeTbd;

  return endTime ? `${startTime}–${endTime}` : startTime;
};

const getInitials = (name: string) => {
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return initials || "NB";
};

const getServicesLabel = (
  services: string[],
  noServicesSelected: string,
  moreServices: string
) => {
  if (!services.length) return noServicesSelected;
  if (services.length === 1) return services[0];

  return `${services[0]} ${moreServices}`;
};

export const BookingCreatedToast = ({ notification }: Props) => {
  const t = useTranslations();
  const locale = useLocale();
  const { data } = notification;
  const servicesLabel = getServicesLabel(
    data.serviceNames,
    t("ui.components.bookingCreatedToast.noServicesSelected"),
    t("ui.components.bookingCreatedToast.moreServices", {
      count: data.serviceNames.length - 1,
    })
  );

  return (
    <div className="w-[280px] py-1 text-darkPrimary">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-base font-bold leading-5">
            {t("ui.components.bookingCreatedToast.newBooking")}
          </p>
          <p className="mt-0.5 truncate text-xs font-normal text-greyPrimary">
            {data.companyName}
          </p>
        </div>

        <span className="shrink-0 rounded-full bg-greenExtraLight px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-greenPrimary">
          {t("ui.components.bookingCreatedToast.new")}
        </span>
      </div>

      <div className="mt-3 flex items-center gap-2.5 rounded-xl bg-purpleExtraLight p-2">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-purplePrimary text-xs font-bold text-white">
          {getInitials(data.customerName)}
        </div>

        <div className="min-w-0">
          <p className="truncate text-sm font-bold leading-4">{data.customerName}</p>
          <p className=" truncate text-[11px] font-normal text-greyPrimary">
            {t("ui.components.bookingCreatedToast.withSpecialist", {
              name: data.specialistName,
            })}
          </p>
        </div>
      </div>

      <div className="mt-2 grid grid-cols-2 gap-2">
        <div className="flex min-w-0 items-center gap-2 rounded-xl border border-greyOutline px-2.5 py-2">
          <CalendarIcon className="size-4 shrink-0 stroke-purplePrimary" />
          <span className="truncate text-[11px] font-bold">
            {formatBookingDate(data.date, locale)}
          </span>
        </div>

        <div className="flex min-w-0 items-center gap-2 rounded-xl border border-greyOutline px-2.5 py-2">
          <ClockIcon className="size-4 shrink-0 stroke-purplePrimary" />
          <span className="truncate text-[11px] font-bold">
            {getBookingTime(data.slots, t("ui.components.bookingCreatedToast.timeTbd"))}
          </span>
        </div>
      </div>

      <div className="mt-3 flex items-end justify-between gap-4 border-t border-greyOutline pt-2.5">
        <div className="min-w-0">
          <p className="text-[10px] font-normal uppercase tracking-wide text-greyPrimary">
            {t("ui.components.bookingCreatedToast.services")}
          </p>
          <p
            className="mt-0.5 truncate text-xs font-bold"
            title={data.serviceNames.join(", ")}
          >
            {servicesLabel}
          </p>
        </div>

        <div className="shrink-0 text-right">
          <p className="text-[10px] font-normal uppercase tracking-wide text-greyPrimary">
            {t("ui.components.bookingCreatedToast.total")}
          </p>
          <p className="mt-0.5 text-sm font-bold text-purplePrimary">
            {formatCurrency(data.totalPrice, {
              style: "currency",
              currency: "THB",
              locale: locale === "ru" ? "ru-RU" : "th-TH",
              shouldOmitFractions: true,
            })}
          </p>
        </div>
      </div>
    </div>
  );
};
