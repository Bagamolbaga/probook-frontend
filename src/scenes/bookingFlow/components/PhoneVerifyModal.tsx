/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { formatPhoneNumberIntl } from "react-phone-number-input";
import Button from "@/components/ui/button";
import CloseIcon from "@/components/ui/icons/Close";
import Modal from "@/components/ui/modal";
import EnterCodeField from "@/components/ui/inputs/EnterCodeField";
import { useTranslations } from "next-intl";

export type PhoneVerifyForm = {
  code: string;
};

type Props = {
  isOpen: boolean;
  phone: string;
  handleCodeVerify: (formData: PhoneVerifyForm) => Promise<boolean>;
  handleResendCodeVerify: () => Promise<boolean>;
  handleContinue: (formData: PhoneVerifyForm) => void;
  handleClose: () => void;
};

const PhoneVerifyModal: FC<Props> = ({
  isOpen,
  phone,
  handleCodeVerify,
  handleResendCodeVerify,
  handleContinue,
  handleClose,
}) => {
  const t = useTranslations();
  const { handleSubmit } = useForm<PhoneVerifyForm>();
  const [isLoading, setIsLoading] = useState(false);
  const [phoneVerifiedSuccess, setPhoneVerifiedSuccess] = useState(false);
  const [phoneVerifiedError, setPhoneVerifiedError] = useState(false);

  const [seconds, setSeconds] = useState(30);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (seconds > 0) {
        setSeconds((prevSeconds) => prevSeconds - 1);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const handleVerify = async (code: string) => {
    try {
      setIsLoading(true);
      const res = await handleCodeVerify({ code });
      if (res) {
        setPhoneVerifiedSuccess(true);
        setPhoneVerifiedError(false)
      }
    } catch (error) {
      setPhoneVerifiedError(true)
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    const res = await handleResendCodeVerify();

    if (res) {
      setSeconds(30)
    }
  };

  const handleSubmitHandler = (formData: PhoneVerifyForm) => {
    handleContinue(formData);
  };

  return (
    <Modal enableMobile isOpen={isOpen} handleClose={handleClose}>
      <div className="w-[430px] p-6 sm:w-full">
        <div className="flex items-center justify-between">
          <h4 className="font-bold">{t("booking.verifyPhoneNumberStep.title")}</h4>
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
          {t.rich("booking.verifyPhoneNumberStep.desc", {
            phone_number: formatPhoneNumberIntl(`+${phone}`),
            black: (t) => <span className="text-darkPrimary">{t}</span>,
          })}
        </p>
        <div className="w-full my-5 flex items-center justify-center">
          <EnterCodeField
            fields={4}
            isLoading={isLoading}
            isSuccess={phoneVerifiedSuccess}
            isError={phoneVerifiedError}
            callback={(code) => handleVerify(code)}
          />
        </div>

        {seconds > 0 ? (
          <p className="text-center text-sm text-greyPrimary">
            Resend code in <span className="text-purplePrimary">{seconds}s</span>
          </p>
        ) : (
          <p className="text-center text-sm cursor-pointer text-purplePrimary" onClick={handleResendCode}>
            Resend code
          </p>
        )}

        <Button
          variant="dark"
          className="w-full mt-10"
          disabled={!phoneVerifiedSuccess}
          onClick={handleSubmit(handleSubmitHandler)}
        >
          {t("booking.verifyPhoneNumberStep.continueBtn")}
        </Button>
      </div>
    </Modal>
  );
};

export default PhoneVerifyModal;
