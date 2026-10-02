/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { FC, useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { parsePhoneNumber, isPossiblePhoneNumber } from "react-phone-number-input/input";
import PhoneTextInput from "@/src/components/ui/inputs/PhoneTextInput";
import { Button } from "@/src/components/ui/button";
import CloseIcon from "@/src/components/ui/icons/Close";
import TextField from "@/src/components/ui/inputs/TextField";
import Modal from "@/src/components/ui/modal";
import PersonIcon from "@/src/components/ui/icons/Person";
import { useLocale, useTranslations } from "next-intl";
import GoogleIcon from "@/src/components/ui/icons/GoogleIcon";
import { signIn } from "next-auth/react";
import { Link, usePathname } from "@/src/i18n";
import { useSearchParams } from "next/navigation";
import { useAppSession } from "@/src/hooks/useAppSession";
import Spinner from "@/src/components/ui/loaders/Spinner";
import FacebookIcon from "@/src/components/ui/icons/FacebookIcon";
import { getUserCompanies } from "@/src/utils/permissions";
import {
  useLookupCustomerByEmailQuery,
  useLookupCustomersQuery,
} from "@/src/api/queries/users";
import type { TCustomerLookupItem } from "@/src/api/entities/user/customer";
import { useDebounce } from "@/src/hooks/useDebounce";

export type AuthForm = {
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  preferredLocale: "en" | "ru";
};

const normalizePhone = (phone: string) => {
  const trimmedPhone = phone.trim();
  return trimmedPhone && !trimmedPhone.startsWith("+")
    ? `+${trimmedPhone}`
    : trimmedPhone;
};

type Props = {
  isDashboard?: boolean;
  companyId?: string;
  hideLabelRequiredSymbol?: boolean;
  nameInputPlaceholder?: string;
  isOpen: boolean;
  isLoading: boolean;
  handleContinue: (formData: AuthForm) => void;
  handleClose: () => void;
};

const AuthModal: FC<Props> = ({
  isDashboard,
  companyId = "",
  hideLabelRequiredSymbol,
  nameInputPlaceholder,
  isLoading,
  isOpen,
  handleContinue,
  handleClose,
}) => {
  const t = useTranslations();
  const currentLocale = useLocale() as "en" | "ru";
  const { data: session } = useAppSession();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const socialAuth = searchParams.get("socialAuth");
  const storeId = searchParams.get("storeId");

  const { control, handleSubmit, register, setError, setValue, formState } =
    useForm<AuthForm>({ defaultValues: { preferredLocale: currentLocale } });
  const email = useWatch({ control, name: "email", defaultValue: "" });
  const normalizedEmail = email.trim().toLowerCase();
  const debouncedEmail = useDebounce(normalizedEmail, 350);
  const [selectedCustomerEmail, setSelectedCustomerEmail] = useState("");
  const isCompleteEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(debouncedEmail);
  const lookupEnabled = Boolean(
    isDashboard &&
    isOpen &&
    companyId &&
    debouncedEmail.length >= 3 &&
    selectedCustomerEmail !== normalizedEmail
  );
  const customerLookupQuery = useLookupCustomersQuery({
    companyId,
    search: debouncedEmail,
    limit: 5,
    enabled: lookupEnabled,
  });
  const companyMatches = useMemo(
    () => customerLookupQuery.data?.results ?? [],
    [customerLookupQuery.data?.results]
  );
  const globalLookupQuery = useLookupCustomerByEmailQuery({
    companyId,
    email: debouncedEmail,
    enabled: Boolean(lookupEnabled && isCompleteEmail),
  });
  const customerSuggestions = useMemo(() => {
    if (!globalLookupQuery.data) return companyMatches;
    return [
      globalLookupQuery.data,
      ...companyMatches.filter((customer) => customer.id !== globalLookupQuery.data?.id),
    ].slice(0, 5);
  }, [companyMatches, globalLookupQuery.data]);
  const isCustomerLookupPending =
    customerLookupQuery.isFetching || globalLookupQuery.isFetching;

  useEffect(() => {
    if (selectedCustomerEmail && normalizedEmail !== selectedCustomerEmail) {
      setSelectedCustomerEmail("");
      setValue("preferredLocale", currentLocale);
    }
  }, [currentLocale, normalizedEmail, selectedCustomerEmail, setValue]);

  useEffect(() => {
    if (socialAuth === "google" || socialAuth === "facebook") {
      setValue("first_name", (session?.user as any)?.name || "");
      setValue("email", session?.user?.email || "");
      setValue("preferredLocale", session?.user?.preferredLocale || currentLocale);
    }
  }, [currentLocale, session?.user, setValue, socialAuth]);

  useEffect(() => {
    if (session?.user?.email && getUserCompanies(session.user).length === 0) {
      setValue("first_name", (session?.user as any)?.name || "");
      setValue("email", session?.user?.email || "");
      setValue("preferredLocale", session.user.preferredLocale || currentLocale);
    }
  }, [currentLocale, session, setValue]);

  const continueWithPreferredLocale = (formData: AuthForm) => {
    handleContinue({
      ...formData,
      preferredLocale: formData.preferredLocale || currentLocale,
    });
  };

  const handleContinueWithPhone = (formData: AuthForm) => {
    const phone = normalizePhone(formData.phone);

    if (!isPossiblePhoneNumber(phone)) {
      setError("phone", { type: "validate", message: "Phone is not valid" });
    } else {
      const parsedPhone = parsePhoneNumber(phone);
      const normalizedPhone = parsedPhone?.number;

      if (normalizedPhone) {
        continueWithPreferredLocale({ ...formData, phone: normalizedPhone });
      }
    }
  };

  const selectCustomer = (customer: TCustomerLookupItem) => {
    const customerEmail = customer.email.trim().toLowerCase();
    setValue("first_name", customer.firstName || "", { shouldValidate: true });
    setValue("last_name", customer.lastName || "", { shouldValidate: true });
    setValue("email", customer.email, { shouldValidate: true });
    setValue("phone", customer.phone || "", { shouldValidate: true });
    setValue("preferredLocale", customer.preferredLocale || currentLocale, {
      shouldValidate: true,
    });
    setSelectedCustomerEmail(customerEmail);
  };

  const renderCustomerSuggestions = () => {
    if (isCustomerLookupPending) {
      return (
        <div className="flex min-h-12 items-center justify-center">
          <Spinner className="h-5" />
        </div>
      );
    }

    if (!customerSuggestions.length) return null;

    return (
      <div role="listbox" aria-label="Customer suggestions">
        {customerSuggestions.map((customer) => {
          const name = `${customer.firstName || ""} ${customer.lastName || ""}`.trim();
          return (
            <button
              key={customer.id}
              type="button"
              role="option"
              aria-selected={selectedCustomerEmail === customer.email.toLowerCase()}
              className="w-full px-3 py-2 text-left hover:bg-greyBg"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => selectCustomer(customer)}
            >
              {name && <span className="block text-sm font-bold">{name}</span>}
              <span className="block text-sm text-greyPrimary">{customer.email}</span>
              {customer.phone && (
                <span className="block text-xs text-greyPrimary">{customer.phone}</span>
              )}
            </button>
          );
        })}
      </div>
    );
  };

  const handleSubmitWithPhoneHandler = (formData: AuthForm) => {
    if (isDashboard) {
      if (formData.phone && formData.phone.length > 4) {
        handleContinueWithPhone(formData);
      } else {
        continueWithPreferredLocale({ ...formData, phone: "" });
      }
    } else {
      if (formData.phone && formData.phone.length > 4) {
        if (!isPossiblePhoneNumber(formData.phone)) {
          setError("phone", { type: "validate", message: "Phone is not valid" });
        } else {
          handleContinueWithPhone(formData);
        }
      }
    }
  };

  const handleSubmitWithEmailHandler = (formData: AuthForm) => {
    continueWithPreferredLocale(formData);
  };

  const authWithSocial = useMemo(() => {
    if (socialAuth === "google" || socialAuth === "facebook") return true;

    if (session?.user?.email && getUserCompanies(session.user).length === 0) return true;
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
            type="email"
            autoComplete="off"
            register={register}
            error={formState.errors.email}
            rules={{
              required: "Field is required",
            }}
            showError
            highlightFullBorderWhenFocus
            iconLeft={<PersonIcon />}
            withSelect={
              lookupEnabled && (isCustomerLookupPending || customerSuggestions.length > 0)
            }
            renderSelectContent={renderCustomerSuggestions()}
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={
              lookupEnabled && (isCustomerLookupPending || customerSuggestions.length > 0)
            }
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
              minLength: 10,
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
              variant="outline"
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
            variant="outline"
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
                variant="outline"
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
                variant="outline"
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
