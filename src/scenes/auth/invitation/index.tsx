"use client";

import axios from "axios";
import { getSession, signIn, useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useLocale, useTranslations } from "next-intl";
import Button from "@/components/ui/button";
import TextField from "@/components/ui/inputs/TextField";
import GoogleBrandIcon from "@/components/ui/icons/GoogleBrand";
import { useInvitationPreviewQuery } from "@/api/queries/invitations";
import { PASSWORD_REGEXP } from "@/utils/regexps";
import { toaster } from "@/components/ui/toaster";

type RegistrationForm = { password: string };

const InvitationScene = () => {
  const t = useTranslations("auth.invitation");
  const locale = useLocale();
  const router = useRouter();
  const params = useParams<{ token: string }>();
  const token = params.token;
  const { data: session, update } = useSession();
  const previewQuery = useInvitationPreviewQuery(token);
  const form = useForm<RegistrationForm>({ mode: "onChange" });

  const callbackUrl = `/${locale}/invitations/${encodeURIComponent(token)}`;

  const acceptWithCurrentSession = async () => {
    const currentSession = await getSession();
    if (!currentSession?.accessToken) {
      router.push(`/${locale}/sign-in?callbackUrl=${encodeURIComponent(callbackUrl)}`);
      return;
    }

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/invitations/${token}/accept`,
        undefined,
        { headers: { Authorization: `Bearer ${currentSession.accessToken}` } }
      );
      await update();
      toaster.success(t("accepted"));
      router.replace(`/${locale}/booking-management`);
    } catch {
      toaster.error(t("registrationFailed"));
    }
  };

  const registerAndAccept = form.handleSubmit(async (values) => {
    const result = await signIn("credentials", {
      redirect: false,
      invitationToken: token,
      ...values,
    });

    if (!result?.ok) {
      toaster.error(t("registrationFailed"));
      return;
    }

    toaster.success(t("accepted"));
    router.replace(`/${locale}/booking-management`);
    router.refresh();
  });

  if (previewQuery.isPending) {
    return <div className="min-h-screen grid place-items-center">{t("loading")}</div>;
  }

  const invitation = previewQuery.data;
  if (!invitation) {
    return (
      <div className="min-h-screen grid place-items-center px-5 bg-greyOutline">
        <div className="max-w-lg p-8 rounded-xl bg-white text-center">
          <h1 className="text-2xl font-bold">{t("unavailableTitle")}</h1>
          <p className="mt-3 text-greyPrimary">{t("unavailableDescription")}</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen grid place-items-center px-5 py-10 bg-greyOutline">
      <section className="w-full max-w-xl p-8 rounded-xl bg-white">
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <p className="mt-3 text-greyPrimary">
          {t("description", {
            company: invitation.companyName,
            email: invitation.email,
          })}
        </p>

        {session?.user ? (
          <Button
            className="mt-8 w-full"
            variant="primary"
            onClick={acceptWithCurrentSession}
          >
            {t("accept")}
          </Button>
        ) : !invitation.passwordSetupAvailable ? (
          <div className="mt-8">
            <p className="text-sm text-greyPrimary">{t("existingAccount")}</p>
            <div className="mt-4 flex gap-3">
              <Button
                className="flex-1"
                variant="primary"
                onClick={() =>
                  router.push(
                    `/${locale}/sign-in?callbackUrl=${encodeURIComponent(callbackUrl)}`
                  )
                }
              >
                {t("signIn")}
              </Button>
              <Button
                className="flex-1 gap-2"
                variant="resting-active"
                onClick={() => void signIn("google", { callbackUrl })}
              >
                <GoogleBrandIcon className="w-5 h-5" />
                Google
              </Button>
            </div>
          </div>
        ) : (
          <form className="mt-8 space-y-4" onSubmit={registerAndAccept}>
            <TextField
              id="password"
              type="password"
              label={t("password")}
              register={form.register}
              rules={{ required: true, pattern: PASSWORD_REGEXP }}
              error={form.formState.errors.password}
            />
            <Button
              className="w-full"
              type="submit"
              variant="primary"
              disabled={form.formState.isSubmitting || !form.formState.isValid}
            >
              {t("createAndAccept")}
            </Button>
            <Button
              className="w-full gap-2"
              type="button"
              variant="resting-active"
              onClick={() => void signIn("google", { callbackUrl })}
            >
              <GoogleBrandIcon className="w-5 h-5" />
              {t("continueGoogle")}
            </Button>
          </form>
        )}
      </section>
    </main>
  );
};

export default InvitationScene;
