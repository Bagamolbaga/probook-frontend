import { FC, ReactNode, useMemo } from "react";
import { format } from "date-fns";
import { DATE_FNS_LOCALES, Link, useLocale, useTranslations } from "@/i18n";
import Image from "next/image";
import Button from "@/components/ui/button";
import ArrowRightIcon from "@/components/ui/icons/ArrowRight";
import CalendarIcon from "@/components/ui/icons/Calendar";
import CheckmarkCircle from "@/components/ui/icons/CheckmarkCircle";
import ClockIcon from "@/components/ui/icons/Clock";
import EmployeeIcon from "@/components/ui/icons/Employee";
import { TimeManager } from "@/utils/timeManager";
import { formatCurrency } from "@/utils/formatCurrency";

type Props = { booking: TApiBooking; company: TCompany };

const SuccessBooked: FC<Props> = ({ company, booking }) => {
  const t = useTranslations();
  const locale = useLocale();
  const time = useMemo(() => {
    const slots = new TimeManager().getFullSlotsFromArr(booking.slots);
    const endSlot = new TimeManager().getFullSlotsFromArr([
      (booking.slots.at(-1) ?? -1) + 1,
    ])[0];

    return `${slots[0]?.label || ""}–${endSlot?.label || ""}`;
  }, [booking.slots]);
  const date = useMemo(
    () =>
      format(booking.date, "EEEE, d MMMM", {
        locale: DATE_FNS_LOCALES[locale],
      }),
    [booking.date, locale]
  );
  const service = booking.services[0];
  const duration = service?.selectedOption.duration || 0;
  const specialist = booking.specialist;
  const progressSteps = [
    t("booking.steps.services"),
    t("booking.steps.staffs"),
    t("booking.steps.dateTime"),
    t("booking.steps.data"),
    t("booking.steps.code"),
    t("booking.steps.done"),
  ];

  return (
    <div className="min-h-screen w-full bg-greyBackgroundLight">
      <header className="flex h-[76px] items-center justify-between bg-white px-[100px] shadow-[0_4px_21px_rgba(153,155,168,0.08)] sm:px-5">
        <div className="flex items-center gap-3">
          {company.logo ? (
            <Image
              src={company.logo}
              alt={company.name}
              width={42}
              height={42}
              className="size-[42px] rounded-[14px] object-cover"
            />
          ) : (
            <div className="flex size-[42px] items-center justify-center rounded-[14px] bg-purplePrimary font-bold text-white">
              {company.name.slice(0, 1)}
            </div>
          )}
          <span className="font-heading text-[15px] font-bold text-darkPrimary">
            {company.name}
          </span>
        </div>
        <span className="font-heading text-xs text-greyPrimary">ProBook</span>
      </header>
      <nav className="flex h-[104px] items-center justify-center gap-4 bg-white px-5 sm:h-[92px] sm:gap-2">
        {progressSteps.map((label, index) => (
          <div key={label} className="flex items-center gap-3 sm:gap-1.5">
            <span className="flex size-9 items-center justify-center rounded-full bg-purplePrimary font-heading text-[13px] font-bold text-white sm:size-8 sm:text-xs">
              {index + 1}
            </span>
            <span className="hidden font-heading text-xs font-semibold text-darkPrimary md:inline">
              {label}
            </span>
            {index < 5 && <span className="h-px w-10 bg-purplePrimary sm:w-3" />}
          </div>
        ))}
      </nav>
      <div className="px-5 py-14 sm:py-7">
        <main className="mx-auto flex w-full max-w-[900px] flex-col items-center gap-7">
          <div className="flex size-20 items-center justify-center rounded-full bg-greenPrimary">
            <CheckmarkCircle className="size-[38px] stroke-white" />
          </div>
          <div className="flex w-full max-w-[700px] flex-col items-center gap-3 text-center">
            <span className="font-heading text-xs font-bold text-purplePrimary">
              {t("booking.bookedSuccessStep.bookingNumber", { id: booking.id })}
            </span>
            <h1 className="font-heading text-4xl font-bold text-darkPrimary sm:text-[28px]">
              {t("booking.bookedSuccessStep.confirmedTitle")}
            </h1>
            <p className="text-sm text-greyPrimary">
              {t("booking.bookedSuccessStep.confirmationSent", {
                email:
                  booking.customer?.email || t("booking.bookedSuccessStep.yourEmail"),
              })}
            </p>
          </div>

          <section className="flex w-[760px] max-w-full flex-col gap-6 rounded-[20px] border border-greyOutlineSecondary bg-white p-[30px] shadow-[0_8px_24px_rgba(41,38,74,0.05)] sm:p-5">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex size-12 items-center justify-center rounded-[16px] bg-purplePrimary text-2xl font-bold text-white">
                  {company.name.slice(0, 1)}
                </div>
                <div>
                  <h2 className="font-heading text-base font-bold text-darkPrimary">
                    {company.name}
                  </h2>
                  <p className="font-heading text-xs text-greyPrimary">
                    {company.address1}
                  </p>
                </div>
              </div>
              <span className="flex h-8 items-center gap-1.5 rounded-full bg-greenPrimary/20 px-3 font-heading text-xs font-bold text-greenPrimary">
                <CheckmarkCircle className="size-4 stroke-greenPrimary" />
                {t("booking.bookedSuccessStep.confirmed")}
              </span>
            </div>
            <div className="h-px w-full bg-greyOutlineSecondary" />
            <div className="grid grid-cols-3 gap-7 sm:grid-cols-1 sm:gap-5">
              <Detail
                icon={<CalendarIcon />}
                label={t("booking.bookedSuccessStep.date")}
                value={date}
              />
              <Detail
                icon={<ClockIcon />}
                label={t("booking.bookedSuccessStep.time")}
                value={time}
                valueClassName="whitespace-nowrap"
              />
              <Detail
                icon={<EmployeeIcon />}
                label={t("booking.bookedSuccessStep.specialist")}
                value={`${specialist.firstName} ${specialist.lastName}`}
              />
            </div>
            <div className="flex items-center justify-between gap-4 rounded-2xl bg-greyBackgroundLight p-[18px]">
              <div>
                <p className="font-heading text-sm font-bold text-darkPrimary">
                  {service?.selectedOption.name || service?.name}
                </p>
                <p className="mt-1 font-heading text-xs text-greyPrimary">
                  {t("booking.bookedSuccessStep.duration", { duration })}
                </p>
              </div>
              <p className="font-heading text-base font-bold text-darkPrimary">
                {formatCurrency(service?.selectedOption.price || 0, {
                  currency: "RUB",
                  locale: locale === "ru" ? "ru-RU" : "en-US",
                  shouldOmitFractions: true,
                })}
              </p>
            </div>
          </section>

          <div className="flex gap-4 sm:w-full sm:flex-col">
            <Button
              variant="resting-active"
              className="h-[52px] rounded-full border border-purplePrimary px-6 text-sm"
            >
              <CalendarIcon className="mr-2 size-[18px] stroke-purplePrimary" />
              {t("booking.bookedSuccessStep.addToCalendar")}
            </Button>
            <Link href={`/cabinet`} className="sm:w-full">
              <Button
                variant="primary"
                className="h-[52px] w-full rounded-full px-6 text-sm"
              >
                {t("booking.bookedSuccessStep.myBookings")}
                <ArrowRightIcon className="ml-2 size-[18px] stroke-white" />
              </Button>
            </Link>
          </div>
          <p className="text-center text-xs text-greyPrimary">
            {t("booking.bookedSuccessStep.manageInCabinet")}
          </p>
        </main>
      </div>
    </div>
  );
};

const Detail = ({
  icon,
  label,
  value,
  valueClassName,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  valueClassName?: string;
}) => (
  <div className="min-w-0 flex flex-col gap-2">
    <div className="flex items-center gap-2 font-heading text-[11px] font-bold text-greyPrimary">
      <span className="text-purplePrimary [&>svg]:size-4">{icon}</span>
      {label}
    </div>
    <p
      className={`font-heading text-sm font-bold text-darkPrimary ${valueClassName || ""}`}
    >
      {value}
    </p>
  </div>
);

export default SuccessBooked;
