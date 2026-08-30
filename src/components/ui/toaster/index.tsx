import { FC, ReactNode } from "react";
import { toast, ToastOptions } from "react-toastify";
import { cn } from "@/utils/cn";
import ToastInfoIcon from "../icons/ToastInfo";
import ToastSuccessIcon from "../icons/ToastSuccess";
import ToastWarnIcon from "../icons/ToastWarn";
import ToastErrorIcon from "../icons/ToastError";

type MessageProps = {
  variant?: "info" | "success" | "warn" | "error";
  disableIcon?: boolean;
  children?: ReactNode;
};

const CustomMessage: FC<MessageProps> = ({ variant, disableIcon, children }) => {
  return (
    <div
      className={cn(
        "min-w-[150px] py-2 px-4 flex items-center gap-2 rounded-[12px] bg-white shadow-toast cursor-pointer"
      )}
    >
      {!disableIcon && (
        <div className="min-w-6 w-6 min-h-6 h-6 flex items-center justify-center">
          {variant === "info" && <ToastInfoIcon className="w-full h-full" />}
          {variant === "success" && <ToastSuccessIcon className="w-full h-full" />}
          {variant === "warn" && (
            <ToastWarnIcon className="w-full max-w-5 h-full max-h-5" />
          )}
          {variant === "error" && <ToastErrorIcon className="w-full h-full" />}
        </div>
      )}
      <div className="w-full text-sm font-bold text-greyPrimary">{children}</div>
    </div>
  );
};

type ToasterOptions = ToastOptions & {
  disableIcon?: boolean;
};

export const toaster = (message: string | ReactNode, options?: ToasterOptions) => {
  toast(
    <CustomMessage variant="info" disableIcon={options?.disableIcon}>
      {message}
    </CustomMessage>,
    options
  );
};

toaster.success = (message: string | ReactNode, options?: ToasterOptions) => {
  toast.success(
    <CustomMessage variant="success" disableIcon={options?.disableIcon}>
      {message}
    </CustomMessage>,
    options
  );
};

toaster.warn = (message: string | ReactNode, options?: ToasterOptions) => {
  toast.warn(
    <CustomMessage variant="warn" disableIcon={options?.disableIcon}>
      {message}
    </CustomMessage>,
    options
  );
};

toaster.error = (message: string | ReactNode, options?: ToasterOptions) => {
  toast.error(
    <CustomMessage variant="error" disableIcon={options?.disableIcon}>
      {message}
    </CustomMessage>,
    options
  );
};
