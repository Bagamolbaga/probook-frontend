import { useTranslations } from "@/i18n";
import CheckmarkCircleLight from "@/components/ui/icons/CheckmarkCircleLight";

const AccountCreatedStep = () => {
  const t = useTranslations();
  return (
    <div className="absolute w-full h-screen flex flex-col items-center justify-center bg-fromTopLeftToBottomRight">
      <CheckmarkCircleLight className="w-20 h-20" />
      <h4 className="mt-5 text-[32px] font-bold text-center text-white">
        Account Create Successfully
      </h4>
      <p className="text-center text-white">We will send a confirmation via your email</p>
    </div>
  );
};

export default AccountCreatedStep;
