/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { FC, useEffect, useMemo } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { parsePhoneNumber, isPossiblePhoneNumber } from "react-phone-number-input/input";
import PhoneTextInput from "@/components/ui/inputs/PhoneTextInput";
import Button from "@/components/ui/button";
import CloseIcon from "@/components/ui/icons/Close";
import TextField from "@/components/ui/inputs/TextField";
import Modal from "@/components/ui/modal";
import { CreateBookingForm } from "../bookingCreation";
import PersonIcon from "@/components/ui/icons/Person";
import { useTranslations } from "next-intl";
import GoogleBrandIcon from "@/components/ui/icons/GoogleBrand";
import GoogleIcon from "@/components/ui/icons/GoogleIcon";
import { signIn } from "next-auth/react";
import { Link, usePathname } from "@/i18n";
import { useSearchParams } from "next/navigation";
import { useAppSession } from "@/hooks/useAppSession";
import Spinner from "@/components/ui/loaders/Spinner";
import FacebookIcon from "@/components/ui/icons/FacebookIcon";

export type AuthForm = {
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
};

type Props = {
  isDashboard?: boolean;
  hideLabelRequiredSymbol?: boolean;
  nameInputPlaceholder?: string;
  isOpen: boolean;
  isLoading: boolean;
  handleContinue: (formData: AuthForm) => void;
  handleClose: () => void;
};

const AuthModal: FC<Props> = ({
  isDashboard,
  hideLabelRequiredSymbol,
  nameInputPlaceholder,
  isLoading,
  isOpen,
  handleContinue,
  handleClose,
}) => {
  const t = useTranslations();
  const { data: session } = useAppSession();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const socialAuth = searchParams.get("socialAuth");
  const storeId = searchParams.get("storeId");


  const { handleSubmit, register, setError, setValue, watch, control, formState } =
    useForm<AuthForm>();

  useEffect(() => {
    if (socialAuth === "google" || socialAuth === "facebook") {
      setValue("first_name", (session?.user as any)?.name || "");
      setValue("email", session?.user?.email || "");
    }
  }, [socialAuth]);

  useEffect(() => {
    if (session && !session.user?.company_id && session.user?.email) {
      setValue("first_name", (session?.user as any)?.name || "");
      setValue("email", session?.user?.email || "");
    }
  }, [session]);

  useEffect(() => {
    if (isDashboard && watch("phone")?.length) {
      setValue("email", "");
    }
  }, [watch("phone")]);

  useEffect(() => {
    if (isDashboard && watch("email")?.length) {
      setValue("phone", "");
    }
  }, [watch("email")]);

  const handleContinueWithPhone = (formData: AuthForm) => {
    if (!isPossiblePhoneNumber(formData.phone)) {
      setError("phone", { type: "validate", message: "Phone is not valid" });
    } else {
      const parsedPhone = parsePhoneNumber(formData.phone);
      const phone = parsedPhone?.number.replace("+", "");

      if (phone) {
        handleContinue({ ...formData, phone });
      }
    }
  };

  const handleSubmitWithPhoneHandler = (formData: AuthForm) => {
    if (isDashboard) {
      if (formData.phone && formData.phone.length > 4) {
        handleContinueWithPhone(formData);
      } else if (formData.email) {
        handleContinue({ ...formData, email: formData.email });
      } else {
        handleContinue({ ...formData, phone: "", email: "" });
      }
    } else {
      if (formData.phone && formData.phone.length > 4) {
        if (!isPossiblePhoneNumber(formData.phone)) {
          setError("phone", { type: "validate", message: "Phone is not valid" });
        } else {
          handleContinueWithPhone(formData)
        }
      }
    }
  };

  const handleSubmitWithEmailHandler = (formData: AuthForm) => {
    handleContinue({ ...formData });
  };

  const authWithSocial = useMemo(() => {
    if (socialAuth === "google" || socialAuth === "facebook") return true;

    if (session && !session.user?.company_id && session.user?.email) return true;
  }, [socialAuth, session]);

  const renderEmailOrPhoneInput = () => {
    if (isDashboard) {
      return (
        <>
          <p className="mt-3 mb-2 text-sm text-greyPrimary">
            {t("booking.clientInformationStep.phoneNumber.label")}{" "}
            {!hideLabelRequiredSymbol && <span className="text-redPrimary">*</span>}
          </p>
          <PhoneTextInput
            className="py-[6px]"
            id="phone"
            setValue={(value: string) => setValue("phone", value)}
            register={register}
            // rules={{
            //   minLength: 10
            // }}
            error={formState.errors.phone}
          />

          <div className="w-full my-5 flex items-center justify-center">
            <div className="flex-1 h-[1px] bg-greyOutlineSecondary"></div>
            <p className="text-sm font-bold text-greyPrimary">Or</p>
            <div className="flex-1 h-[1px] bg-greyOutlineSecondary"></div>
          </div>

          <p className="mt-3 mb-2 text-sm text-greyPrimary">
            {t("ui.labels.email")}{" "}
            {!hideLabelRequiredSymbol && <span className="text-redPrimary">*</span>}
          </p>
          <TextField
            className="px-3 rounded-xl border border-greyOutline"
            id="email"
            register={register}
            error={formState.errors.email}
            showError
            highlightFullBorderWhenFocus
            iconLeft={<PersonIcon />}
          />
        </>
      );
    }

    if (authWithSocial) {
      return (
        <>
          {/* <p className="mt-3 mb-2 text-sm text-greyPrimary">
            {t("ui.labels.email")}{" "}
            {!hideLabelRequiredSymbol && <span className="text-redPrimary">*</span>}
          </p>
          <TextField
            disabled
            className="px-3 rounded-xl border border-greyOutline"
            id="email"
            register={register}
            error={formState.errors.email}
            rules={{
              required: "Field is required",
            }}
            showError
            highlightFullBorderWhenFocus
            iconLeft={<PersonIcon />}
          /> */}
        </>
      );
    } else {
      return (
        <>
          <p className="mt-3 mb-2 text-sm text-greyPrimary">
            {t("booking.clientInformationStep.phoneNumber.label")}{" "}
            {!hideLabelRequiredSymbol && <span className="text-redPrimary">*</span>}
          </p>
          <PhoneTextInput
            className="py-[6px]"
            id="phone"
            setValue={(value: string) => setValue("phone", value)}
            register={register}
            rules={{
              minLength: 10
            }}
            error={formState.errors.phone}
          />
        </>
      );
    }
  };

  return (
    <Modal enableMobile isOpen={isOpen} handleClose={handleClose}>
      <div className="w-[430px] p-6 sm:w-full">
        <div className="flex items-center justify-between">
          <h4 className="font-bold">
            {t("booking.clientInformationStep.clientInformation")}
          </h4>
          <div className="flex items-center gap-4">
            <Button
              className="w-9 h-9 p-0"
              variant="resting-active"
              onClick={handleClose}
            >
              <CloseIcon className="w-5 h-5 stroke-greyPrimary" />
            </Button>
          </div>
        </div>
        <p className="mt-2 text-sm text-greyPrimary">
          {t("booking.clientInformationStep.desc")}
        </p>

        <div className="mt-5">
          <p className="mb-2 text-sm text-greyPrimary">
            {t("booking.clientInformationStep.name.label")}{" "}
            {!hideLabelRequiredSymbol && <span className="text-redPrimary">*</span>}
          </p>
          <TextField
            className="px-3 rounded-xl border border-greyOutline"
            id="first_name"
            placeholder={
              nameInputPlaceholder || t("booking.clientInformationStep.name.placeholder")
            }
            register={register}
            error={formState.errors.first_name}
            rules={{
              required: "Field is required",
            }}
            showError
            highlightFullBorderWhenFocus
            iconLeft={<PersonIcon />}
          />
          {/* <TextField
            id="last_name"
            label="Last name"
            placeholder="Your last name..."
            register={register}
            error={formState.errors.last_name}
            rules={{
              required: "Field is required",
            }}
            showError
          /> */}

          {renderEmailOrPhoneInput()}

          {/* <PhoneNumberTextField
            id="phone"
            label="Phone"
            control={control as any}
            error={formState.errors.phone}
            rules={{
              required: "Field is required",
            }}
            showError
            disabled={
              (form.watch("client")?.phone && form.watch("isPhoneVerified")) || false
            }
            className={cn({
              "pointer-events-none":
                form.watch("client")?.phone && form.watch("isPhoneVerified"),
            })}
          /> */}

          <Button
            variant="dark"
            className="w-full mt-8"
            onClick={handleSubmit(
              authWithSocial ? handleSubmitWithEmailHandler : handleSubmitWithPhoneHandler
            )}
            disabled={isLoading}
          >
            {isLoading ? (
              <Spinner className="h-[20px]" />
            ) : (
              t("booking.clientInformationStep.continueBtn")
            )}
          </Button>

          {!isDashboard && (
            <>
              <div className="w-full my-5 flex items-center justify-center">
                <div className="flex-1 h-[1px] bg-greyOutlineSecondary"></div>
                <p className="text-sm font-bold text-greyPrimary">Or</p>
                <div className="flex-1 h-[1px] bg-greyOutlineSecondary"></div>
              </div>
              <Button
                variant="dark-outline"
                className="w-full mt-3"
                onClick={() =>
                  signIn("google", {
                    callbackUrl: `${pathname}?storeId=${storeId}&socialAuth=google&showAuthModal=true`,
                  })
                }
              >
                <GoogleIcon className="mr-3" />
                Continue with Google
              </Button>
              <Button
                variant="dark-outline"
                className="w-full mt-3"
                onClick={() =>
                  signIn("facebook", {
                    callbackUrl: `${pathname}?storeId=${storeId}&socialAuth=facebook&showAuthModal=true`,
                  })
                }
              >
                <FacebookIcon className="mr-3" />
                Continue with Facebook
              </Button>

              <p className="mt-8 text-sm text-center">
                By continuing, you agree to our{" "}
                <Link href={"/terms-of-service"} className="text-purplePrimary">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href={"/privacy-policy"} className="text-purplePrimary">
                  Privacy Policy
                </Link>
                , including consent to share your booking information
              </p>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default AuthModal;
