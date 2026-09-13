"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  useCustomerProfileQuery,
  useUpdateCustomerAvatarMutation,
  useUpdateCustomerProfileMutation,
} from "@/api/queries/customer";
import Button from "@/components/ui/button";
import TextField from "@/components/ui/inputs/TextField";
import { toaster } from "@/components/ui/toaster";
import { useTranslations } from "@/i18n";
import QueryState from "./components/QueryState";

type ProfileForm = {
  firstName: string;
  lastName: string;
  phone: string;
};

export default function CustomerProfileScene() {
  const t = useTranslations("customerCabinet");
  const query = useCustomerProfileQuery();
  const updateProfile = useUpdateCustomerProfileMutation();
  const updateAvatar = useUpdateCustomerAvatarMutation();
  const { register, handleSubmit, reset, formState } = useForm<ProfileForm>();

  useEffect(() => {
    if (!query.data) return;
    reset({
      firstName: query.data.firstName,
      lastName: query.data.lastName,
      phone: query.data.phone || "",
    });
  }, [query.data, reset]);

  if (query.isLoading || query.isError || !query.data) {
    return (
      <QueryState
        loading={query.isLoading}
        error={query.isError}
        onRetry={() => void query.refetch()}
      />
    );
  }

  const save = async (data: ProfileForm) => {
    try {
      await updateProfile.mutateAsync({ ...data, phone: data.phone || undefined });
      toaster.success(t("profile.saved"));
    } catch {
      toaster.error(t("common.error"));
    }
  };

  const uploadAvatar = (file?: File) => {
    if (!file || file.size > 1_500_000 || !file.type.startsWith("image/")) {
      toaster.error(t("common.error"));
      return;
    }
    const reader = new FileReader();
    reader.onload = async () => {
      if (typeof reader.result !== "string") return;
      try {
        await updateAvatar.mutateAsync(reader.result);
        toaster.success(t("profile.saved"));
      } catch {
        toaster.error(t("common.error"));
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-9">
      <header className="max-w-[720px]">
        <h1 className="font-[Georgia,serif] text-[48px] font-normal leading-[1.08] tracking-[-0.025em] text-darkPrimary sm:text-[38px]">
          {t("profile.title")}
        </h1>
        <p className="mt-3 text-lg leading-7 text-greyPrimary sm:text-base">
          {t("profile.subtitle")}
        </p>
      </header>

      <div className="grid grid-cols-[280px_minmax(0,620px)] gap-6 sm:grid-cols-1">
        <section className="flex min-h-[320px] flex-col rounded-[24px] bg-darkPrimary p-7 text-white sm:min-h-0">
          <div className="flex size-24 items-center justify-center overflow-hidden rounded-[28px] bg-purplePrimary text-[34px] font-bold text-white">
            {query.data.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img className="size-full object-cover" src={query.data.avatar} alt="" />
            ) : (
              `${query.data.firstName[0] || ""}${query.data.lastName[0] || ""}`
            )}
          </div>
          <p className="mt-6 font-[Georgia,serif] text-[28px] leading-tight text-white">
            {[query.data.firstName, query.data.lastName].filter(Boolean).join(" ")}
          </p>
          <p className="mt-2 break-all text-sm text-white/60">{query.data.email}</p>

          <label className="mt-auto cursor-pointer rounded-xl border border-white/20 px-4 py-3 text-center text-sm font-bold text-white outline-none transition-colors hover:border-white/50 hover:bg-white/5 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-white sm:mt-7">
            {t("profile.avatar")}
            <input
              className="sr-only"
              type="file"
              accept="image/*"
              onChange={(event) => uploadAvatar(event.target.files?.[0])}
              disabled={updateAvatar.isPending}
            />
          </label>
        </section>

        <form
          className="rounded-[24px] border border-greyOutlineSecondary bg-white p-8 sm:p-5"
          onSubmit={handleSubmit(save)}
        >
          <div className="grid grid-cols-2 gap-x-5 gap-y-4 sm:grid-cols-1">
            <div className="col-span-2 sm:col-span-1">
              <TextField
                id="email"
                label={t("profile.email")}
                value={query.data.email}
                disabled
                readOnly
                className="rounded-xl border px-4"
                highlightFullBorderWhenFocus
              />
            </div>
            <TextField
              id="firstName"
              label={t("profile.firstName")}
              register={register}
              rules={{ required: true }}
              error={formState.errors.firstName}
              showError
              className="rounded-xl border px-4"
              highlightFullBorderWhenFocus
            />
            <TextField
              id="lastName"
              label={t("profile.lastName")}
              register={register}
              rules={{ required: true }}
              error={formState.errors.lastName}
              showError
              className="rounded-xl border px-4"
              highlightFullBorderWhenFocus
            />
            <div className="col-span-2 sm:col-span-1">
              <TextField
                id="phone"
                label={t("profile.phone")}
                type="tel"
                placeholder="+48123123123"
                register={register}
                rules={{
                  pattern: {
                    value: /^\+[1-9]\d{7,14}$/,
                    message: t("profile.phone"),
                  },
                }}
                error={formState.errors.phone}
                showError
                className="rounded-xl border px-4"
                highlightFullBorderWhenFocus
              />
            </div>
          </div>

          <Button
            className="mt-8 min-w-[160px] rounded-xl"
            variant="primary"
            type="submit"
            disabled={updateProfile.isPending}
          >
            {t("profile.save")}
          </Button>
        </form>
      </div>
    </div>
  );
}
