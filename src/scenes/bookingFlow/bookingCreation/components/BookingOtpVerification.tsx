import { FC, useEffect, useRef, useState } from "react";
import Button from "@/components/ui/button";
import ArrowRightIcon from "@/components/ui/icons/ArrowRight";
import CheckmarkCircle from "@/components/ui/icons/CheckmarkCircle";
import EmailIcon from "@/components/ui/icons/Email";

type Props = {
  email?: string;
  handleCodeVerify: (data: { code: string }) => Promise<boolean>;
  handleResend: () => Promise<boolean>;
  handleEdit: () => void;
  handleComplete: () => void;
};

const BookingOtpVerification: FC<Props> = ({
  email,
  handleCodeVerify,
  handleResend,
  handleEdit,
  handleComplete,
}) => {
  const [code, setCode] = useState<string[]>(Array(6).fill(""));
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [seconds, setSeconds] = useState(30);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (seconds === 0) return;
    const timer = window.setInterval(() => setSeconds((value) => value - 1), 1000);
    return () => window.clearInterval(timer);
  }, [seconds]);

  const verifyCode = async (nextCode: string[]) => {
    if (nextCode.some((value) => !value)) return;
    setIsLoading(true);
    try {
      setIsVerified(await handleCodeVerify({ code: nextCode.join("") }));
    } finally {
      setIsLoading(false);
    }
  };

  const changeCode = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const nextCode = [...code];
    nextCode[index] = digit;
    setCode(nextCode);
    if (digit && index < 5) inputRefs.current[index + 1]?.focus();
    void verifyCode(nextCode);
  };

  const resend = async () => {
    if (seconds > 0) return;
    if (await handleResend()) setSeconds(30);
  };

  return (
    <section className="w-full flex flex-col items-center gap-[22px] px-[100px] py-12 sm:px-5 sm:py-8">
      <div className="flex size-[68px] items-center justify-center rounded-full bg-purplePrimary/10">
        <EmailIcon className="size-8 stroke-purplePrimary" />
      </div>
      <div className="flex w-full max-w-[600px] flex-col items-center gap-2 text-center">
        <span className="font-heading text-[10px] font-bold uppercase text-purplePrimary">
          Шаг 5 из 5
        </span>
        <h1 className="font-heading text-[30px] font-bold text-darkPrimary sm:text-2xl">
          Подтвердите email
        </h1>
        <p className="text-[13px] text-greyPrimary">
          Мы отправили шестизначный код на {email || "указанный email"}
        </p>
      </div>
      <div className="flex w-[560px] max-w-full flex-col items-center gap-[22px] rounded-[18px] border border-greyOutlineSecondary bg-white p-7 shadow-[0_8px_24px_rgba(41,38,74,0.05)] sm:p-5">
        <p className="font-heading text-[11px] font-semibold text-greyPrimary">
          Код из сообщения
        </p>
        <div className="flex gap-2.5 sm:gap-1.5">
          {code.map((value, index) => (
            <input
              key={index}
              ref={(element) => {
                inputRefs.current[index] = element;
              }}
              value={value}
              onChange={(event) => changeCode(index, event.target.value)}
              onFocus={(event) => event.currentTarget.select()}
              inputMode="numeric"
              maxLength={1}
              aria-label={`Цифра ${index + 1}`}
              className="size-[54px] rounded-xl border border-greyOutlineSecondary bg-greyBackgroundLight text-center font-heading text-xl font-bold text-darkPrimary outline-none focus:border-2 focus:border-purplePrimary sm:size-11"
            />
          ))}
        </div>
        {isVerified && (
          <div className="flex h-[34px] items-center gap-1.5 rounded-full bg-greenPrimary/20 px-3 text-[11px] font-bold text-greenPrimary">
            <CheckmarkCircle className="size-4 stroke-greenPrimary" /> Код подтверждён
          </div>
        )}
        <div className="flex gap-1.5 text-[11px] text-greyPrimary">
          <span>Не пришёл код?</span>
          <button
            className="font-bold text-purplePrimary disabled:opacity-50"
            disabled={seconds > 0}
            onClick={resend}
          >
            Отправить снова{seconds > 0 ? ` (${seconds}с)` : ""}
          </button>
        </div>
      </div>
      <div className="flex gap-3 sm:w-full sm:flex-col-reverse">
        <Button
          variant="resting-active"
          className="h-12 rounded-full border border-greyOutlineSecondary px-[22px]"
          onClick={handleEdit}
        >
          Изменить email
        </Button>
        <Button
          variant="primary"
          className="h-12 rounded-full px-6"
          disabled={!isVerified || isLoading}
          onClick={handleComplete}
        >
          Завершить запись <ArrowRightIcon className="ml-2 size-[17px] stroke-white" />
        </Button>
      </div>
      <p className="text-center text-[10px] text-greyPrimary">
        Код действует 5 минут. Проверьте также папку «Спам».
      </p>
    </section>
  );
};

export default BookingOtpVerification;
