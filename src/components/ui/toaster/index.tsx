import { FC, ReactNode } from "react";
import { toast, ToastOptions } from "react-toastify";
import { cn } from "@/utils/cn";
import ToastInfoIcon from "../icons/ToastInfo";
import ToastSuccessIcon from "../icons/ToastSuccess";
import ToastWarnIcon from "../icons/ToastWarn";
import ToastErrorIcon from "../icons/ToastError";

type MessageProps = {
  variant?: "info" | "success" | "warn" | "error";
  children?: ReactNode;
};

const CustomMessage: FC<MessageProps> = ({ variant, children }) => {
  return (
    <div
      className={cn(
        "min-w-[150px] py-2 px-4 flex items-center gap-2 rounded-[20px] bg-white shadow-toast cursor-pointer"
      )}
    >
      <div className="min-w-6 w-6 min-h-6 h-6 flex items-center justify-center">
        {variant === "info" && <ToastInfoIcon className="w-full h-full" />}
        {variant === "success" && <ToastSuccessIcon className="w-full h-full" />}
        {variant === "warn" && (
          <ToastWarnIcon className="w-full max-w-5 h-full max-h-5" />
        )}
        {variant === "error" && <ToastErrorIcon className="w-full h-full" />}
      </div>

      <span className="text-sm font-bold text-greyPrimary">{children}</span>
    </div>
  );
};

export const toaster = (message: string, options?: ToastOptions) => {
  toast(<CustomMessage variant="info">{message}</CustomMessage>, options);
};

toaster.success = (message: string, options?: ToastOptions) => {
  toast.success(<CustomMessage variant="success">{message}</CustomMessage>, options);
};

toaster.warn = (message: string, options?: ToastOptions) => {
  toast.warn(<CustomMessage variant="warn">{message}</CustomMessage>, options);
};

toaster.error = (message: string, options?: ToastOptions) => {
  toast.error(<CustomMessage variant="error">{message}</CustomMessage>, options);
};
