import { FC } from "react";
import { useForm } from "react-hook-form";
import { isPossiblePhoneNumber, parsePhoneNumber } from "react-phone-number-input/input";
import { Check, Mail, MessageSquare, Phone, UserRound } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import TextField from "@/src/components/ui/inputs/TextField";
import type { AuthForm } from "./AuthModal";

type ContactForm = AuthForm & {
  comment: string;
  consent: boolean;
};

type Props = {
  onSubmit: (data: AuthForm) => void;
  initialClient?: AuthForm;
};

const CustomerDetailsSelection: FC<Props> = ({ onSubmit, initialClient }) => {
  const t = useTranslations();
  const locale = useLocale() as "en" | "ru";
  const { register, handleSubmit, formState, setError } = useForm<ContactForm>({
    defaultValues: {
      ...initialClient,
      preferredLocale: initialClient?.preferredLocale || locale,
      consent: false,
    },
  });

  const handleContactSubmit = ({
    comment: _comment,
    consent: _consent,
    ...data
  }: ContactForm) => {
    const parsedPhone = parsePhoneNumber(data.phone);
    if (!isPossiblePhoneNumber(data.phone) || !parsedPhone?.number) {
      setError("phone", {
        type: "validate",
        message: t("booking.clientInformationStep.phoneNumber.invalid"),
      });
      return;
    }

    onSubmit({ ...data, phone: parsedPhone.number });
  };

  return (
    <form
      id="booking-contact-form"
      onSubmit={handleSubmit(handleContactSubmit)}
      className="flex min-h-[590px] h-[calc(100vh-124px-100px-52px)] w-2/3 flex-col gap-6 border-r border-greyOutlineSecondary pr-6 sm:w-full sm:border-none sm:pr-0 sm:pb-[40px]"
    >
      <div className="flex flex-col gap-2">
        <p className="text-[10px] font-bold tracking-[0.5px] text-purplePrimary">
          {t("booking.clientInformationStep.pageStepLabel" as any)}
        </p>
        <h2 className="font-funnel text-[32px] font-bold leading-tight text-darkPrimary sm:text-[26px]">
          {t("booking.clientInformationStep.pageTitle" as any)}
        </h2>
        <p className="text-[13px] text-greyPrimary">
          {t("booking.clientInformationStep.pageDescription" as any)}
        </p>
      </div>

      <div className="flex flex-col gap-[18px] rounded-2xl border border-greyOutline bg-white p-6">
        <div className="flex gap-[14px] sm:flex-col">
          <div className="flex-1">
            <label className="mb-[7px] block text-[11px] font-semibold text-grey-800">
              {t("booking.clientInformationStep.name.label")}
            </label>
            <TextField
              id="first_name"
              register={register}
              rules={{ required: true }}
              error={formState.errors.first_name}
              showError
              className="h-12 rounded-[10px] border border-greyOutline px-[14px]"
              iconLeft={<UserRound className="size-4 stroke-greyPrimary" />}
            />
          </div>
          <div className="flex-1">
            <label className="mb-[7px] block text-[11px] font-semibold text-grey-800">
              {t("booking.clientInformationStep.lastName")}
            </label>
            <TextField
              id="last_name"
              register={register}
              rules={{ required: true }}
              error={formState.errors.last_name}
              showError
              className="h-12 rounded-[10px] border border-greyOutline px-[14px]"
              iconLeft={<UserRound className="size-4 stroke-greyPrimary" />}
            />
          </div>
        </div>

        <div>
          <label className="mb-[7px] block text-[11px] font-semibold text-grey-800">
            {t("booking.clientInformationStep.phoneNumber.label")}
          </label>
          <TextField
            id="phone"
            type="tel"
            register={register}
            rules={{ required: true }}
            error={formState.errors.phone}
            showError
            className="h-12 rounded-[10px] border border-greyOutline px-[14px]"
            iconLeft={<Phone className="size-4 stroke-greyPrimary" />}
          />
        </div>

        <div>
          <label className="mb-[7px] block text-[11px] font-semibold text-grey-800">
            {t("booking.clientInformationStep.email")}
          </label>
          <TextField
            id="email"
            type="email"
            register={register}
            rules={{ required: true }}
            error={formState.errors.email}
            showError
            className="h-12 rounded-[10px] border border-greyOutline px-[14px]"
            iconLeft={<Mail className="size-4 stroke-greyPrimary" />}
          />
        </div>

        <div>
          <label className="mb-[7px] block text-[11px] font-semibold text-grey-800">
            {t("booking.clientInformationStep.comment")}
          </label>
          <TextField
            id="comment"
            register={register}
            placeholder={t("booking.clientInformationStep.commentPlaceholder")}
            className="h-12 rounded-[10px] border border-greyOutline px-[14px]"
            iconLeft={<MessageSquare className="size-4 stroke-greyPrimary" />}
          />
        </div>

        <label className="flex items-center gap-2.5 text-[10px] text-greyPrimary">
          <input
            type="checkbox"
            {...register("consent", { required: true })}
            className="peer sr-only"
          />
          <span className="flex size-5 shrink-0 items-center justify-center rounded-md border border-greyOutline transition-colors peer-checked:border-purplePrimary peer-checked:bg-purplePrimary">
            <Check className="size-3.5 stroke-white" />
          </span>
          {t("booking.clientInformationStep.consent")}
        </label>
      </div>
    </form>
  );
};

export default CustomerDetailsSelection;
