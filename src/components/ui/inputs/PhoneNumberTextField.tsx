import { useClickOutside } from "@/hooks/useClickOutside";
import { cn } from "@/utils/cn";
import { FC, FocusEvent, ReactNode, useRef, useState } from "react";
import { Control, FieldError, FieldValues, RegisterOptions } from "react-hook-form";
import PhoneInput2 from "react-phone-number-input/react-hook-form-input";

type Props = {
  variant?: "no-border";
  id: string;
  control: Control<FieldValues>;
  rules?: RegisterOptions;
  error?: FieldError;
  label?: string;
  showError?: boolean;
  requiredHideSymbol?: boolean;
  disabled?: boolean;
  className?: string;
};

const PhoneNumberTextField: FC<Props> = ({
  variant,
  id,
  control,
  rules,
  error,
  className,
  label,
  requiredHideSymbol,
  showError,
  disabled,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const [isFocus, setIsFocus] = useState(false);

  const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
    setIsFocus(true);
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    setIsFocus(false);
  };

  useClickOutside(containerRef, () => setIsFocus(false));

  return (
    <div ref={containerRef} className="w-full relative">
      <div
        className={cn("w-full py-3 flex flex-col items-start border-b", className, {
          "border-none": variant === "no-border",
          "border-b-greyOutline": !error,
          "!border-b-bluePrimary": isFocus,
          "border-b-redPrimary": error,
        })}
      >
        <label className="mb-2 text-sm text-greyPrimary" htmlFor="input">
          {label}{" "}
          {rules?.required && !requiredHideSymbol && (
            <span className="ml-[2px] text-redPrimary">*</span>
          )}
        </label>
        <div className="w-full flex items-center">
          <PhoneInput2
            className={cn(
              "flex-1 outline-none bg-transparent autofill:bg-transparent focus:border-b-bluePrimary",
              {
                "text-greyPrimary": disabled,
              }
            )}
            country="TH"
            international={false}
            control={control}
            rules={rules}
            placeholder="(66) 23 456 7890"
            name={id}
            type={"tel"}
            autoCorrect={"tel"}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        </div>
      </div>
      {showError && error && error.message && (
        <span className="mt-1 text-sm text-redPrimary">{error.message}</span>
      )}
    </div>
  );
};

export default PhoneNumberTextField;
