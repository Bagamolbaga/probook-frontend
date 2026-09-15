"use client";

import { Camera, CircleCheck, Info, Languages, ShieldCheck } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  useCustomerProfileQuery,
  useUpdateCustomerAvatarMutation,
  useUpdateCustomerProfileMutation,
} from "@/api/queries/customer";
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
      reset(data);
      toaster.success(t("profile.saved"));
    } catch {
      toaster.error(t("common.error"));
    }
  };

  const uploadAvatar = (file?: File) => {
    if (
      !file ||
      file.size > 5_000_000 ||
      !["image/jpeg", "image/png"].includes(file.type)
    ) {
      toaster.error(t("profile.avatarError"));
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

  const removeAvatar = async () => {
    try {
      await updateAvatar.mutateAsync("");
      toaster.success(t("profile.saved"));
    } catch {
      toaster.error(t("common.error"));
    }
  };

  const fullName = [query.data.firstName, query.data.lastName].filter(Boolean).join(" ");
  const initials = `${query.data.firstName[0] || ""}${query.data.lastName[0] || ""}`;
  const fieldClassName =
    "h-[72px] w-full border-0 border-b border-greyOutlineSecondary bg-transparent px-0 pt-6 text-[13px] font-bold outline-none transition-colors focus:border-purplePrimary focus:ring-0 disabled:text-greyPrimary";

  return (
    <div className="flex min-h-full flex-col gap-6">
      <header className="flex items-end justify-between gap-4">
        <div>
          <h1 className="font-funnel text-[32px] font-bold leading-none tracking-[-0.7px] text-darkPrimary sm:text-[26px]">
            {t("profile.title")}
          </h1>
          <p className="mt-1.5 text-sm text-greyPrimary sm:text-[10px]">
            {t("profile.subtitle")}
          </p>
        </div>
        {!formState.isDirty && !updateProfile.isPending && (
          <span className="flex items-center gap-1.5 rounded-full bg-[#7CE7AC] px-[11px] py-[7px] text-[10px] font-bold sm:hidden">
            <CircleCheck className="size-3.5" />
            {t("profile.allSaved")}
          </span>
        )}
      </header>

      <div className="grid min-h-0 flex-1 grid-cols-[310px_minmax(0,1fr)] gap-6 md:grid-cols-1">
        <aside className="flex flex-col gap-[18px]">
          <section className="flex flex-col items-center gap-[18px] rounded-[18px] border border-greyOutline bg-white p-6">
            <div className="relative size-[126px]">
              <div className="flex size-[116px] items-center justify-center overflow-hidden rounded-full bg-purpleExtraLight font-funnel text-[34px] font-bold text-purplePrimary">
                {query.data.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    className="size-full object-cover"
                    src={query.data.avatar}
                    alt=""
                  />
                ) : (
                  initials
                )}
              </div>
              <label className="absolute bottom-0 right-0 flex size-[42px] cursor-pointer items-center justify-center rounded-full border-[3px] border-white bg-purplePrimary text-white outline-none has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-purplePrimary">
                <Camera className="size-[17px]" />
                <span className="sr-only">{t("profile.uploadAvatar")}</span>
                <input
                  className="sr-only"
                  type="file"
                  accept="image/jpeg,image/png"
                  onChange={(event) => uploadAvatar(event.target.files?.[0])}
                  disabled={updateAvatar.isPending}
                />
              </label>
            </div>
            <div className="text-center">
              <h2 className="font-funnel text-[21px] font-bold">{fullName}</h2>
              <p className="mt-1 break-all text-[11px] text-greyPrimary">
                {query.data.email}
              </p>
            </div>
            <div className="w-full space-y-2">
              <label className="block cursor-pointer rounded-xl bg-greyOutline px-4 py-3 text-center text-xs font-bold outline-none has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-purplePrimary">
                {t("profile.uploadAvatar")}
                <input
                  className="sr-only"
                  type="file"
                  accept="image/jpeg,image/png"
                  onChange={(event) => uploadAvatar(event.target.files?.[0])}
                  disabled={updateAvatar.isPending}
                />
              </label>
              {query.data.avatar && (
                <button
                  type="button"
                  onClick={() => void removeAvatar()}
                  disabled={updateAvatar.isPending}
                  className="w-full rounded-xl px-4 py-3 text-xs font-bold text-[#D80027] outline-none focus-visible:ring-2 focus-visible:ring-[#D80027]"
                >
                  {t("profile.removeAvatar")}
                </button>
              )}
            </div>
            <p className="text-center text-[9px] leading-[1.4] text-greyPrimary">
              {t("profile.avatarHelp")}
            </p>
          </section>
          <section className="rounded-[15px] bg-purpleExtraLight p-[18px]">
            <h2 className="flex items-center gap-2 text-xs font-bold">
              <Languages className="size-[17px] text-purplePrimary" />
              {t("profile.interfaceLanguage")}
            </h2>
            <p className="mt-2.5 text-[10px] leading-[1.4] text-grey-800">
              {t("profile.localeDescription", {
                locale:
                  query.data.preferredLocale === "ru"
                    ? t("profile.russian")
                    : t("profile.english"),
              })}
            </p>
          </section>
        </aside>

        <div className="flex min-w-0 flex-col gap-[18px]">
          <form
            className="rounded-[18px] border border-greyOutline bg-white p-[26px] sm:p-5"
            onSubmit={handleSubmit(save)}
          >
            <h2 className="font-funnel text-xl font-bold">
              {t("profile.personalInformation")}
            </h2>
            <p className="mt-1 text-[11px] text-greyPrimary">
              {t("profile.personalInformationDescription")}
            </p>

            <div className="mt-[22px] grid grid-cols-2 gap-x-[22px] sm:grid-cols-1">
              <label className="relative">
                <span className="absolute top-2.5 text-xs text-greyPrimary">
                  {t("profile.firstName")}
                </span>
                <input
                  className={fieldClassName}
                  {...register("firstName", { required: true })}
                  aria-invalid={Boolean(formState.errors.firstName)}
                />
              </label>
              <label className="relative">
                <span className="absolute top-2.5 text-xs text-greyPrimary">
                  {t("profile.lastName")}
                </span>
                <input
                  className={fieldClassName}
                  {...register("lastName", { required: true })}
                  aria-invalid={Boolean(formState.errors.lastName)}
                />
              </label>
              <label className="relative col-span-2 sm:col-span-1">
                <span className="absolute top-2.5 text-xs text-greyPrimary">
                  {t("profile.phoneNumber")}
                </span>
                <input
                  type="tel"
                  className={fieldClassName}
                  placeholder="+48 512 345 678"
                  {...register("phone", { pattern: /^\+[1-9][\d ]{7,18}$/ })}
                  aria-invalid={Boolean(formState.errors.phone)}
                />
              </label>
              <label className="relative col-span-2 sm:col-span-1">
                <span className="absolute top-2.5 text-xs text-greyPrimary">
                  {t("profile.emailReadonly")}
                </span>
                <input
                  className={fieldClassName}
                  value={query.data.email}
                  disabled
                  readOnly
                />
              </label>
            </div>
            <p className="mt-3 flex items-center gap-2 text-[10px] text-greyPrimary">
              <Info className="size-3.5 shrink-0" />
              {t("profile.phoneHelp")}
            </p>
            <div className="mt-[22px] flex justify-end gap-2.5 sm:flex-col-reverse">
              <button
                type="button"
                onClick={() =>
                  reset({
                    firstName: query.data.firstName,
                    lastName: query.data.lastName,
                    phone: query.data.phone || "",
                  })
                }
                disabled={!formState.isDirty}
                className="rounded-xl bg-greyOutline px-4 py-3 text-xs font-bold disabled:opacity-40"
              >
                {t("profile.discard")}
              </button>
              <button
                type="submit"
                disabled={updateProfile.isPending || !formState.isDirty}
                className="rounded-xl bg-purplePrimary px-4 py-3 text-xs font-bold text-white disabled:opacity-40"
              >
                {t("profile.saveChanges")}
              </button>
            </div>
          </form>
          <section className="flex items-center gap-3 rounded-[15px] bg-purpleExtraLight p-[18px]">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-[11px] bg-white">
              <ShieldCheck className="size-[18px] text-purplePrimary" />
            </span>
            <div>
              <h2 className="text-xs font-bold">{t("profile.securityTitle")}</h2>
              <p className="mt-1 text-[10px] text-grey-800">
                {t("profile.securityDescription")}
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
