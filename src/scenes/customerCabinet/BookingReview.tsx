"use client";

import {
  ArrowLeft,
  Building2,
  CalendarDays,
  Check,
  CircleCheck,
  Cloud,
  Eye,
  MessageSquare,
  ShieldCheck,
  Star,
  UserRound,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  useCreateCustomerBookingReviewMutation,
  useCustomerBookingQuery,
} from "@/src/api/queries/customer";
import { useAppSession } from "@/src/hooks/useAppSession";
import { Link, useLocale, useTranslations } from "@/src/i18n";
import { formatBookingTime } from "./components/BookingCard";
import QueryState from "./components/QueryState";

const highlights = [
  "professionalism",
  "politeness",
  "result",
  "cleanliness",
  "timing",
] as const;
type Highlight = (typeof highlights)[number];
const guidelines = [
  { icon: CircleCheck, key: "experience" },
  { icon: ShieldCheck, key: "privacy" },
  { icon: MessageSquare, key: "respect" },
] as const;

export default function CustomerBookingReviewScene({ bookingId }: { bookingId: string }) {
  const t = useTranslations("customerCabinet");
  const locale = useLocale();
  const { data: session } = useAppSession();
  const query = useCustomerBookingQuery(bookingId);
  const createReview = useCreateCustomerBookingReviewMutation();
  const storageKey = `customer-review-draft:${bookingId}`;
  const [rating, setRating] = useState(0);
  const [selected, setSelected] = useState<Highlight[]>([]);
  const [comment, setComment] = useState("");
  const [recommended, setRecommended] = useState<boolean | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const saved = sessionStorage.getItem(storageKey);
    if (!saved) return;
    try {
      const draft = JSON.parse(saved) as {
        rating?: number;
        selected?: Highlight[];
        comment?: string;
        recommended?: boolean | null;
      };
      setRating(draft.rating ?? 0);
      setSelected(draft.selected?.filter((item) => highlights.includes(item)) ?? []);
      setComment(draft.comment ?? "");
      setRecommended(draft.recommended ?? null);
    } catch {
      sessionStorage.removeItem(storageKey);
    }
  }, [storageKey]);

  useEffect(() => {
    if (!rating && !selected.length && !comment && recommended === null) return;
    sessionStorage.setItem(
      storageKey,
      JSON.stringify({ rating, selected, comment, recommended })
    );
  }, [comment, rating, recommended, selected, storageKey]);

  const initials = useMemo(() => {
    const name = [session?.user?.firstName, session?.user?.lastName]
      .filter(Boolean)
      .join(" ");
    return (
      name
        .split(" ")
        .map((part) => part[0])
        .slice(0, 2)
        .join("") || "—"
    );
  }, [session?.user?.firstName, session?.user?.lastName]);

  if (query.isLoading || query.isError || !query.data) {
    return (
      <QueryState
        loading={query.isLoading}
        error={query.isError}
        onRetry={() => void query.refetch()}
      />
    );
  }

  const booking = query.data;
  const formattedDate = new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${booking.date}T12:00:00`));
  const reference = booking.id.slice(-8).toUpperCase();
  const author =
    [session?.user?.firstName, session?.user?.lastName].filter(Boolean).join(" ") ||
    session?.user?.email ||
    t("navigation.customerPortal");

  if (submitted) {
    return (
      <div className="flex min-h-[calc(100vh-120px)] items-center justify-center py-8">
        <section className="flex w-full max-w-[650px] flex-col items-center gap-5 rounded-[20px] border border-greyOutline bg-white p-[34px] shadow-[0_3px_14px_#0000000A] sm:p-5">
          <span className="flex size-[68px] items-center justify-center rounded-full bg-[#7CE7AC]">
            <Check className="size-[30px]" />
          </span>
          <div className="text-center">
            <h1 className="font-funnel text-[28px] font-bold">
              {t("review.successTitle")}
            </h1>
            <p className="mt-2 text-xs leading-[1.45] text-greyPrimary">
              {t("review.successDescription")}
            </p>
          </div>
          <div className="w-full rounded-[14px] border border-greyOutline bg-greyBackgroundLight p-[18px]">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <span className="flex size-[34px] items-center justify-center rounded-full bg-purpleExtraLight text-[10px] font-bold text-purplePrimary">
                  {initials}
                </span>
                <span>
                  <strong className="block text-[11px]">{author}</strong>
                  <span className="block text-[8px] text-greyPrimary">
                    {t("review.today")}
                  </span>
                </span>
              </div>
              <div
                className="flex gap-1"
                aria-label={t("review.ratingValue", { rating })}
              >
                {[1, 2, 3, 4, 5].map((value) => (
                  <Star
                    key={value}
                    className={`size-4 ${value <= rating ? "fill-purplePrimary text-purplePrimary" : "text-greyPrimary"}`}
                  />
                ))}
              </div>
            </div>
            {comment && (
              <p className="mt-3 text-[11px] leading-[1.45] text-grey-800">{comment}</p>
            )}
            {selected.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {selected.map((item) => (
                  <span
                    key={item}
                    className="rounded-full bg-purpleExtraLight px-2 py-1 text-[8px] font-semibold"
                  >
                    {t(`review.highlights.${item}`)}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="flex gap-2.5 sm:w-full sm:flex-col">
            <Link
              href="/cabinet/bookings"
              className="rounded-xl bg-purplePrimary px-4 py-3 text-center text-xs font-bold text-white"
            >
              {t("review.backToBookings")}
            </Link>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="flex min-h-full flex-col gap-6">
      <header className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            href={`/cabinet/bookings/${booking.id}`}
            aria-label={t("review.backToBooking")}
            className="flex size-[42px] shrink-0 items-center justify-center rounded-full border border-greyOutline bg-white outline-none focus-visible:ring-2 focus-visible:ring-purplePrimary"
          >
            <ArrowLeft className="size-[18px]" />
          </Link>
          <div className="min-w-0">
            <h1 className="font-funnel text-[29px] font-bold leading-none sm:text-xl">
              {t("review.title")}
            </h1>
            <p className="mt-1 truncate text-[11px] text-greyPrimary">
              {t("review.subtitle", { reference, date: formattedDate })}
            </p>
          </div>
        </div>
        <span className="flex items-center gap-1.5 rounded-full bg-greyOutline px-[11px] py-[7px] text-[9px] font-semibold text-grey-800 sm:hidden">
          <Cloud className="size-3.5 text-greyPrimary" /> {t("review.draftSaved")}
        </span>
      </header>

      <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)_380px] gap-[22px] md:grid-cols-1">
        <form
          className="flex flex-col gap-[21px] rounded-[18px] border border-greyOutline bg-white p-[26px] sm:p-4"
          onSubmit={(event) => {
            event.preventDefault();
            if (!rating || createReview.isPending) return;
            void createReview
              .mutateAsync({
                bookingId,
                rating,
                highlights: selected,
                comment: comment.trim() || undefined,
                recommended: recommended ?? undefined,
              })
              .then(() => {
                sessionStorage.removeItem(storageKey);
                setSubmitted(true);
              });
          }}
        >
          <fieldset>
            <div className="flex items-center justify-between gap-4">
              <div>
                <legend className="text-[13px] font-bold">
                  {t("review.overallRating")}
                </legend>
                <p className="mt-1 text-[10px] text-greyPrimary">
                  {t("review.ratingHelp")}
                </p>
              </div>
              <span className="text-[8px] font-semibold text-greyPrimary">
                {t("review.required")}
              </span>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-[9px]">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  aria-label={t("review.setRating", { rating: value })}
                  aria-pressed={rating === value}
                  onClick={() => setRating(value)}
                  className={`flex size-12 items-center justify-center rounded-xl border-2 outline-none focus-visible:ring-2 focus-visible:ring-purplePrimary ${value <= rating ? "border-purplePrimary bg-purpleExtraLight text-purplePrimary" : "border-transparent bg-greyOutline text-greyPrimary"}`}
                >
                  <Star
                    className={`size-[22px] ${value <= rating ? "fill-purplePrimary" : ""}`}
                  />
                </button>
              ))}
              {rating > 0 && (
                <span className="text-[10px] font-semibold text-grey-800">
                  {t("review.ratingValue", { rating })}
                </span>
              )}
            </div>
          </fieldset>

          <fieldset>
            <legend className="text-[13px] font-bold">
              {t("review.highlightsLabel")}
            </legend>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {highlights.map((item) => {
                const active = selected.includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    aria-pressed={active}
                    onClick={() =>
                      setSelected((current) =>
                        active
                          ? current.filter((value) => value !== item)
                          : [...current, item]
                      )
                    }
                    className={`flex h-[38px] items-center gap-1.5 rounded-full border px-3 text-[9px] outline-none focus-visible:ring-2 focus-visible:ring-purplePrimary ${active ? "border-purplePrimary bg-purpleExtraLight font-bold" : "border-greyOutline text-greyPrimary"}`}
                  >
                    {active && <Check className="size-[13px] text-purplePrimary" />}
                    {t(`review.highlights.${item}`)}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <label className="text-[13px] font-bold">
            <span className="flex justify-between">
              <span>{t("review.comment")}</span>
              <span className="text-[8px] font-normal text-greyPrimary">
                {comment.length} / 1000
              </span>
            </span>
            <textarea
              value={comment}
              maxLength={1000}
              onChange={(event) => setComment(event.target.value)}
              className="mt-2 h-28 w-full resize-y rounded-lg border border-greyOutline p-3 text-[11px] font-normal leading-[1.45] outline-none focus:border-purplePrimary focus:ring-2 focus:ring-purpleExtraLight"
            />
          </label>

          <fieldset className="flex items-center justify-between gap-4 sm:flex-col sm:items-stretch">
            <div>
              <legend className="text-xs font-bold">{t("review.recommend")}</legend>
              <p className="mt-1 text-[9px] text-greyPrimary">
                {t("review.recommendHelp")}
              </p>
            </div>
            <div className="flex h-10 rounded-[10px] bg-greyOutline p-[3px]">
              {[true, false].map((value) => (
                <button
                  key={String(value)}
                  type="button"
                  aria-pressed={recommended === value}
                  onClick={() => setRecommended(value)}
                  className={`flex flex-1 items-center justify-center gap-1 rounded-lg px-6 text-[9px] ${recommended === value ? "bg-white font-bold text-darkPrimary" : "text-greyPrimary"}`}
                >
                  {recommended === value && (
                    <Check className="size-3 text-purplePrimary" />
                  )}
                  {value ? t("review.yes") : t("review.no")}
                </button>
              ))}
            </div>
          </fieldset>

          <div className="mt-auto flex justify-end gap-2.5 sm:flex-col-reverse">
            <Link
              href={`/cabinet/bookings/${booking.id}`}
              className="rounded-xl bg-greyOutline px-4 py-3 text-center text-xs font-bold"
            >
              {t("review.backToBooking")}
            </Link>
            <button
              type="submit"
              disabled={!rating || createReview.isPending}
              className="rounded-xl bg-purplePrimary px-4 py-3 text-xs font-bold text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              {createReview.isPending ? t("review.publishing") : t("review.publish")}
            </button>
          </div>
          {createReview.isError && (
            <p className="text-right text-[10px] text-redPrimary" role="alert">
              {t("review.submissionError")}
            </p>
          )}
        </form>

        <aside className="flex flex-col gap-4">
          <section className="rounded-2xl bg-darkPrimary p-5 text-white">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold tracking-[0.7px] text-greyPrimary">
                {t("review.youRate")}
              </span>
              <span className="flex items-center gap-1 rounded-full bg-[#7CE7AC] px-2 py-1 text-xs font-bold text-darkPrimary">
                <Check className="size-3" />
                {t("status.COMPLETED")}
              </span>
            </div>
            <p className="mt-4 text-sm font-bold leading-[1.3] text-white">
              {booking.services.map((service) => service.name).join(", ")}
            </p>
            <div className="mt-4 space-y-2 text-[9px] text-greyPrimary">
              <p className="flex items-center gap-2 text-white">
                <CalendarDays className="size-4 text-greyPrimary" />
                {formattedDate} · {formatBookingTime(booking)}
              </p>
              <p className="flex items-center gap-2 text-white">
                <UserRound className="size-4 text-greyPrimary" />
                {booking.specialist.fullName}
              </p>
              <p className="flex items-center gap-2 text-white">
                <Building2 className="size-4 text-greyPrimary" />
                {booking.company.name}
              </p>
            </div>
          </section>
          <section className="rounded-2xl border border-greyOutline bg-white p-[18px]">
            <h2 className="font-funnel text-lg font-bold">{t("review.guidelines")}</h2>
            <div className="mt-3 space-y-3">
              {guidelines.map(({ icon: ItemIcon, key }) => (
                <p key={key} className="flex items-center gap-2 text-sm text-grey-800">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-[9px] bg-greyOutline">
                    <ItemIcon className="size-[13px] text-purplePrimary" />
                  </span>
                  {t(`review.guidelineItems.${key}`)}
                </p>
              ))}
            </div>
          </section>
          <section className="rounded-[14px] bg-purpleExtraLight p-4">
            <h2 className="flex items-center gap-2 text-sm font-bold">
              <Eye className="size-[15px] text-purplePrimary" />
              {t("review.visibility")}
            </h2>
            <p className="mt-2 text-xs leading-[1.4] text-grey-800">
              {t("review.visibilityText")}
            </p>
          </section>
        </aside>
      </div>
    </div>
  );
}
