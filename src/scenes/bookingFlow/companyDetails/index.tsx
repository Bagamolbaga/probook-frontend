"use client";

import { FC, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Link } from "@/src/i18n";

import { useCompanyReviewsQuery, useGetCompanyDetailsQuery } from "@/src/api/queries/company";
import { useGetCompanyServicesQuery } from "@/src/api/queries/company/services";
import { useGetCompanySpecialistsQuery } from "@/src/api/queries/company/specialists";
import { TServiceAndSelectedOption } from "@/src/scenes/main/bookingCreation/components/BookingCreation";
import ImagesSwiper from "./components/ImagesSwiper";
import Tabs, { Tab } from "./components/Tabs";
import { toSlug } from "@/src/utils/toSlug";
import { formatCurrency } from "@/src/utils/formatCurrency";
import { Button } from "@/src/components/ui/button";
import LocationIcon from "@/src/components/ui/icons/Location";
import ShareIcon from "@/src/components/ui/icons/Share";
import CopyIcon from "@/src/components/ui/icons/Copy";
import Modal from "@/src/components/ui/modal";
import { toaster } from "@/src/components/ui/toaster";
import { cn } from "@/src/utils/cn";
import RadioButton from "@/src/components/ui/inputs/RadioButton";
import { TimeManager } from "@/src/utils/timeManager";
import { getYandexMapsUrl, getYandexMapsWidgetUrl } from "@/src/utils/getYandexMapsUrl";
import { Star } from "lucide-react";

const tabs: Tab[] = [
  { id: "our-service", text: "Услуги" },
  { id: "team", text: "Команда" },
  { id: "working-hours", text: "Часы работы" },
];

type Props = {
  companyId: string;
};

const formatDuration = (duration?: number) => (duration ? `${duration} минут` : "—");

const workingHoursTimeManager = new TimeManager();

const weekDayLabels: Partial<Record<WorkingScheduleWeekDays, string>> = {
  Monday: "Понедельник",
  Tuesday: "Вторник",
  Wednesday: "Среда",
  Thursday: "Четверг",
  Friday: "Пятница",
  Saturday: "Суббота",
  Sunday: "Воскресенье",
};

const formatWorkingHours = (workingSlots: number[]) => {
  const slots = workingHoursTimeManager.getFullSlots(workingSlots);

  if (!slots.length) return "Закрыто";

  return `${slots[0].label}–${slots.at(-1)?.label}`;
};

export const PublicCompanyFooter = () => (
  <footer className="w-full bg-darkPrimary text-white">
    <div className="mx-auto flex min-h-[132px] max-w-content items-end justify-between px-layoutLeftRight py-8 md:px-layoutLeftRight_md sm:flex-col sm:items-start sm:gap-8 sm:px-layoutLeftRight_sm">
      <div className="flex gap-10 text-base font-bold sm:flex-col sm:gap-4">
        <Link href="/support">Поддержка</Link>
        <Link href="/terms-of-use">Условия использования</Link>
      </div>
      <div className="flex items-center gap-2 font-funnel text-xl font-bold">
        <span className="flex size-[34px] items-center justify-center rounded-[11px] bg-purplePrimary text-sm">
          PB
        </span>
        ProBook
      </div>
    </div>
  </footer>
);

const CompanyDetailsScene: FC<Props> = ({ companyId }) => {
  const [selectedTab, setSelectedTab] = useState(tabs[2]);
  const [isOpenShareModal, setIsOpenShareModal] = useState(false);
  const [selectedServices, setSelectedServices] = useState<TServiceAndSelectedOption[]>(
    []
  );
  const workingHoursRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLElement>(null);
  const teamRef = useRef<HTMLElement>(null);

  const companyQuery = useGetCompanyDetailsQuery({ companyId });
  const servicesQuery = useGetCompanyServicesQuery({ companyId });
  const specialistsQuery = useGetCompanySpecialistsQuery({ companyId });
  const reviewsQuery = useCompanyReviewsQuery(companyId);
  const company = companyQuery.data;
  const services = servicesQuery.data?.results || [];
  const specialists = specialistsQuery.data?.results || [];
  const reviewPages = reviewsQuery.data?.pages || [];
  const reviews = reviewPages.flatMap((page) => page.items);
  const reviewSummary = reviewPages[0]?.summary;

  const location = useMemo(
    () => [company?.city, company?.country?.name].filter(Boolean).join(", "),
    [company?.city, company?.country?.name]
  );

  const images = company?.images?.map((image) => image.image) || [];
  const companyHref = `/company/${toSlug(company?.name)}?storeId=${company?.id}`;
  const yandexMapsWidgetUrl = getYandexMapsWidgetUrl({
    lat: company?.pos?.lat ?? null,
    lng: company?.pos?.lng ?? null,
  });
  const shareLink = () => window.location.href || companyHref;

  const handleCopyShareLink = () => {
    void navigator.clipboard.writeText(shareLink());
    toaster.success("Ссылка скопирована");
  };

  const handleSelectService = (service: TService) => {
    const selected = selectedServices.find((item) => item.id === service.id);

    if (selected) {
      setSelectedServices(selectedServices.filter((item) => item.id !== service.id));
      return;
    }

    if (service.options[0]) {
      setSelectedServices([{ ...service, selectedOption: service.options[0] }]);
    }
  };

  const handleSelectTab = (tab: Tab) => {
    setSelectedTab(tab);

    const target = {
      "our-service": servicesRef.current,
      team: teamRef.current,
      "working-hours": workingHoursRef.current,
    }[tab.id];

    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    const sections = [
      ["working-hours", workingHoursRef.current],
      ["our-service", servicesRef.current],
      ["team", teamRef.current],
    ] as const;

    const observer = new IntersectionObserver(
      (entries) => {
        const activeEntry = entries.find((entry) => entry.isIntersecting);
        const activeTab = tabs.find((tab) => tab.id === activeEntry?.target.id);

        if (activeTab) setSelectedTab(activeTab);
      },
      { rootMargin: "-20% 0px -65%" }
    );

    sections.forEach(([, section]) => section && observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="w-full bg-white text-darkPrimary">
      <Modal isOpen={isOpenShareModal} handleClose={() => setIsOpenShareModal(false)}>
        <div className="w-[450px] p-6 sm:w-full">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Поделиться</h2>
            <Button
              variant="outline"
              className="size-9 !rounded-full p-0"
              onClick={() => setIsOpenShareModal(false)}
            >
              ×
            </Button>
          </div>
          <p className="mt-6 break-all rounded-xl border border-greyOutlineSecondary p-3 text-sm">
            {shareLink()}
          </p>
          <Button
            variant="default"
            className="mt-4 w-full !rounded-full"
            iconLeft={<CopyIcon className="size-5 fill-white" />}
            onClick={handleCopyShareLink}
          >
            Скопировать ссылку
          </Button>
        </div>
      </Modal>

      <section className="flex w-full gap-10 py-10 md:gap-6 sm:flex-col">
        <div className="relative h-[736px] w-[736px] shrink-0 overflow-hidden rounded-2xl bg-greyBackgroundLight md:w-[58%] sm:h-[420px] sm:w-full">
          {images.length ? (
            <ImagesSwiper images={images} />
          ) : company?.logo ? (
            <Image fill src={company.logo} alt={company.name} className="object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-greyPrimary">
              Фото компании пока нет
            </div>
          )}
          <div className="absolute right-4 top-4 z-10 flex flex-wrap justify-end gap-3">
            {company?.businessType?.split(",").map((type) => (
              <span
                key={type}
                className="rounded-full bg-white px-4 py-3 text-sm font-bold"
              >
                {type.trim()}
              </span>
            ))}
          </div>
        </div>

        <div className="flex h-[736px] w-[464px] flex-1 flex-col gap-6 sm:h-auto sm:w-full">
          <div>
            <div className="flex items-start justify-between gap-4">
              <h1 className="max-w-[464px] font-funnel text-[26px] font-bold leading-[38px] sm:text-2xl">
                {company?.name || "Компания"}
              </h1>
              <Button
                variant="secondary"
                className="shrink-0 !rounded-full !px-4 !py-3"
                iconLeft={<ShareIcon className="stroke-darkPrimary" />}
                onClick={() => setIsOpenShareModal(true)}
              >
                Поделиться
              </Button>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-greyPrimary">
              <p className="flex items-center gap-1">
                <LocationIcon className="size-4" />
                {location || "Адрес не указан"}
              </p>
              {company?.pos.lat && (
                <Link
                  target="_blank"
                  href={getYandexMapsUrl(company.pos) || ""}
                  className="font-bold text-purplePrimary"
                >
                  Построить маршрут
                </Link>
              )}
            </div>
          </div>

          <p className="max-w-[464px] text-sm leading-6 text-greyPrimary">
            {company?.address || company?.address || "Описание компании появится здесь."}
          </p>

          <Tabs tabs={tabs} activelTab={selectedTab} handleSelect={handleSelectTab} />

          <div
            ref={workingHoursRef}
            id="working-hours"
            className="min-h-[180px] scroll-mt-10 overflow-hidden rounded-xl border border-greyOutlineSecondary bg-[#F5F5FA]"
          >
            {yandexMapsWidgetUrl ? (
              <iframe
                title={`Карта: ${company?.name || "компания"}`}
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                src={yandexMapsWidgetUrl}
                loading="lazy"
                className="block h-[280px] w-full border-0"
              />
            ) : (
              <div className="flex min-h-[180px] flex-col items-center justify-center px-6 text-center">
                <div className="flex size-10 items-center justify-center rounded-full bg-white text-purplePrimary">
                  <LocationIcon className="size-5" />
                </div>
                <p className="mt-3 text-sm font-bold">Координаты компании не указаны</p>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            {Object.entries(company?.workingSchedule || {}).map(([day, schedule]) => (
              <div key={day} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <span
                    className={cn("size-2 rounded-full", {
                      "bg-greenPrimary": schedule.workingSlots.length,
                      "bg-greyLight": !schedule.workingSlots.length,
                    })}
                  />
                  <span
                    className={cn({ "text-greyPrimary": !schedule.workingSlots.length })}
                  >
                    {weekDayLabels[day as WorkingScheduleWeekDays] || day}
                  </span>
                </span>
                <span
                  className={cn({ "text-greyPrimary": !schedule.workingSlots.length })}
                >
                  {formatWorkingHours(schedule.workingSlots)}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-auto flex items-center justify-between gap-4 border-t border-greyOutlineSecondary pt-6">
            <span className="text-sm text-greyPrimary">
              {selectedServices.length
                ? `${selectedServices.length} услуга выбрана`
                : "Выберите услугу ниже"}
            </span>
            <div className="hidden">
              <Button variant="default" className="!rounded-full px-8">
                Записаться
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section
        ref={servicesRef}
        id="our-service"
        className="w-full scroll-mt-10 bg-greyBackgroundLight py-14"
      >
        <div className="w-full">
          <p className="text-[10px] font-bold tracking-[1px] text-purplePrimary">
            УСЛУГИ И ЦЕНЫ
          </p>
          <div className="mt-2 flex items-end justify-between gap-6 sm:flex-col sm:items-start">
            <div>
              <h2 className="font-funnel text-[30px] font-bold leading-10">
                Выберите подходящую программу
              </h2>
              <p className="mt-2 text-xs text-greyPrimary">
                Каждая запись включает выбранный вариант, продолжительность и
                фиксированную стоимость.
              </p>
            </div>
            <div className="rounded-full border border-greyOutlineSecondary bg-white px-4 py-3 text-sm font-semibold">
              Все направления
            </div>
          </div>
          <div className="mt-6 flex flex-col gap-2">
            {services.map((service) => {
              const option = service.options[0];
              const isSelected = selectedServices.some((item) => item.id === service.id);

              return (
                <button
                  key={service.id}
                  type="button"
                  onClick={() => handleSelectService(service)}
                  className={cn(
                    "flex min-h-20 w-full items-center gap-5 rounded-xl border border-greyOutlineSecondary bg-white px-4 py-3 text-left transition-colors hover:border-purplePrimary",
                    { "border-purplePrimary bg-purpleExtraLight": isSelected }
                  )}
                >
                  <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-greyBackgroundLight">
                    {service.image ? (
                      <Image
                        width={48}
                        height={48}
                        src={service.image}
                        alt=""
                        className="size-full object-cover"
                      />
                    ) : null}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold">{service.name}</p>
                    <p className="mt-1 text-xs text-greyPrimary">
                      {formatDuration(option?.duration)}
                    </p>
                  </div>
                  <p className="shrink-0 text-sm font-bold">
                    {option ? formatCurrency(option.price) : "—"}
                  </p>
                  <RadioButton checked={isSelected} className="pointer-events-none" />
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section ref={teamRef} id="team" className="w-full scroll-mt-10 py-14">
        <p className="text-[10px] font-bold tracking-[1px] text-purplePrimary">КОМАНДА</p>
        <h2 className="mt-2 font-funnel text-[30px] font-bold leading-10">
          Специалисты, которым доверяют
        </h2>
        <p className="mt-2 text-xs text-greyPrimary">
          Показаны только активные специалисты, доступные для выбранных услуг.
        </p>
        <div className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-2">
          {specialists.map((specialist) => (
            <div
              key={specialist.id}
              className="min-h-[196px] rounded-xl border border-greyOutlineSecondary bg-white p-3 text-center"
            >
              <div className="mx-auto size-16 overflow-hidden rounded-lg bg-greyLight">
                {specialist.avatar ? (
                  <Image
                    width={64}
                    height={64}
                    src={specialist.avatar}
                    alt={specialist.fullName}
                    className="size-full object-cover"
                  />
                ) : null}
              </div>
              <p className="mt-3 text-base font-bold">{specialist.fullName}</p>
              <p className="mt-1 truncate text-sm text-greyPrimary">
                {specialist.specialties?.[0] || specialist.role}
              </p>
              <div className="mt-3 flex justify-between text-sm text-greyPrimary">
                <span>★ {specialist.rating || "—"}</span>
                <span>от {formatCurrency(0)}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="w-full bg-greyBackgroundLight py-14">
        <div className="max-w-[920px]">
          <p className="text-[10px] font-bold tracking-[1px] text-purplePrimary">
            {
              "\u041e\u0422\u0417\u042b\u0412\u042b \u041a\u041b\u0418\u0415\u041d\u0422\u041e\u0412"
            }
          </p>
          <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-funnel text-[30px] font-bold leading-10">
                {"\u041e\u0442\u0437\u044b\u0432\u044b"}
              </h2>
              <p className="mt-2 text-xs text-greyPrimary">
                {
                  "\u041e\u0442\u0437\u044b\u0432\u044b \u043e\u0441\u0442\u0430\u0432\u043b\u044f\u044e\u0442 \u0442\u043e\u043b\u044c\u043a\u043e \u043a\u043b\u0438\u0435\u043d\u0442\u044b \u0441 \u0437\u0430\u0432\u0435\u0440\u0448\u0451\u043d\u043d\u044b\u043c\u0438 \u0437\u0430\u043f\u0438\u0441\u044f\u043c\u0438."
                }
              </p>
            </div>
            {reviewSummary && (
              <div className="flex items-center gap-2 rounded-xl border border-greyOutlineSecondary bg-white px-4 py-3">
                <Star className="size-5 fill-purplePrimary text-purplePrimary" />
                <strong>{reviewSummary.averageRating ?? "—"}</strong>
                <span className="text-sm text-greyPrimary">({reviewSummary.count})</span>
              </div>
            )}
          </div>

          {reviewsQuery.isLoading ? (
            <p className="mt-6 text-sm text-greyPrimary">
              {
                "\u0417\u0430\u0433\u0440\u0443\u0437\u043a\u0430 \u043e\u0442\u0437\u044b\u0432\u043e\u0432..."
              }
            </p>
          ) : reviewsQuery.isError ? (
            <p className="mt-6 text-sm text-redPrimary">
              {
                "\u041d\u0435 \u0443\u0434\u0430\u043b\u043e\u0441\u044c \u0437\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044c \u043e\u0442\u0437\u044b\u0432\u044b."
              }
            </p>
          ) : reviews.length ? (
            <div className="mt-6 space-y-3">
              {reviews.map((review) => (
                <article
                  key={review.id}
                  className="rounded-xl border border-greyOutlineSecondary bg-white p-5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-bold">{review.authorName}</p>
                      <p className="mt-1 text-xs text-greyPrimary">
                        {review.specialistName} ·{" "}
                        {new Intl.DateTimeFormat("ru", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        }).format(new Date(review.createdAt))}
                      </p>
                    </div>
                    <div className="flex gap-1" aria-label={`${review.rating} / 5`}>
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <Star
                          key={rating}
                          className={`size-4 ${rating <= review.rating ? "fill-purplePrimary text-purplePrimary" : "text-greyPrimary"}`}
                        />
                      ))}
                    </div>
                  </div>
                  {review.comment && (
                    <p className="mt-3 text-sm leading-6">{review.comment}</p>
                  )}
                  {review.highlights.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {review.highlights.map((highlight) => (
                        <span
                          key={highlight}
                          className="rounded-full bg-purpleExtraLight px-2.5 py-1 text-[10px] font-semibold"
                        >
                          {highlight}
                        </span>
                      ))}
                    </div>
                  )}
                </article>
              ))}
              {reviewsQuery.hasNextPage && (
                <button
                  type="button"
                  onClick={() => void reviewsQuery.fetchNextPage()}
                  disabled={reviewsQuery.isFetchingNextPage}
                  className="rounded-xl border border-greyOutlineSecondary bg-white px-4 py-2.5 text-sm font-bold disabled:opacity-50"
                >
                  {reviewsQuery.isFetchingNextPage
                    ? "\u0417\u0430\u0433\u0440\u0443\u0436\u0430\u0435\u043c..."
                    : "\u041f\u043e\u043a\u0430\u0437\u0430\u0442\u044c \u0435\u0449\u0451"}
                </button>
              )}
            </div>
          ) : (
            <p className="mt-6 text-sm text-greyPrimary">
              {
                "\u041f\u043e\u043a\u0430 \u043d\u0435\u0442 \u043e\u0442\u0437\u044b\u0432\u043e\u0432."
              }
            </p>
          )}
        </div>
      </section>
    </div>
  );
};

export default CompanyDetailsScene;
