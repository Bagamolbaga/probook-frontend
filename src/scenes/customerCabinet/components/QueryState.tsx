"use client";

import Button from "@/components/ui/button";
import Spinner from "@/components/ui/loaders/Spinner";
import { useTranslations } from "@/i18n";

export default function QueryState({
  loading,
  error,
  empty,
  onRetry,
}: {
  loading?: boolean;
  error?: boolean;
  empty?: boolean;
  onRetry?: () => void;
}) {
  const t = useTranslations("customerCabinet.common");

  if (loading) {
    return (
      <div
        className="flex min-h-[260px] items-center justify-center rounded-[24px] border border-greyOutlineSecondary bg-white"
        role="status"
      >
        <Spinner />
        <span className="sr-only">{t("loading")}</span>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="rounded-[24px] border border-redPrimary/20 bg-white p-8 sm:p-6"
        role="alert"
      >
        <p className="max-w-lg font-bold">{t("error")}</p>
        {onRetry ? (
          <Button className="mt-5" variant="outline" onClick={onRetry}>
            {t("retry")}
          </Button>
        ) : null}
      </div>
    );
  }

  if (empty) {
    return (
      <p className="rounded-[24px] border border-dashed border-greyOutlineSecondary bg-white p-10 text-center text-greyPrimary sm:p-7">
        {t("empty")}
      </p>
    );
  }

  return null;
}
