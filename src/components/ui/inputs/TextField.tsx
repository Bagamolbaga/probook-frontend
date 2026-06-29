"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  FC,
  FocusEvent,
  HTMLInputTypeAttribute,
  ReactNode,
  useMemo,
  useRef,
  useState,
} from "react";
import { FieldError, RegisterOptions, UseFormRegister } from "react-hook-form";
import EyeOpenIcon from "../icons/EyeOpen";
import EyeCloseIcon from "../icons/EyeClose";
import { cn } from "@/utils/cn";
import CustomScrollbarStyles from "@/styles/scrollbar.module.sass";
import { useClickOutside } from "@/hooks/useClickOutside";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: "select" | "no-border";
  id: string;
  label?: string;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  withSelect?: boolean;
  renderSelectContent?: ReactNode;
  register?: UseFormRegister<any>;
  rules?: RegisterOptions;
  error?: FieldError;
  showError?: boolean;
  requiredHideSymbol?: boolean;
  className?: string;
  labelClassName?: string;
  inputClassName?: string;
  highlightFullBorderWhenFocus?: boolean
}

const TextField: FC<Props> = ({
  id,
  variant,
  label,
  iconLeft,
  iconRight,
  withSelect,
  renderSelectContent,
  register,
  rules,
  error,
  showError,
  autoFocus,
  requiredHideSymbol,
  className,
  labelClassName,
  inputClassName,
  highlightFullBorderWhenFocus,
  ...props
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFocus, setIsFocus] = useState(autoFocus);
  const [passwordShow, setPasswordShow] = useState(false);

  const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
    setIsFocus(true);

    props?.onFocus && props.onFocus(e);
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    !withSelect && setIsFocus(false);

    props?.onBlur && props.onBlur(e);
  };

  const handleToggleShowPassword = () => {
    setPasswordShow((prev) => !prev);
  };

  useClickOutside(containerRef, () => setIsFocus(false));

  const IconRight = useMemo(() => {
    if (props?.type === "password") {
      if (passwordShow) {
        return <EyeOpenIcon className="stroke-greyPrimary" />;
      }

      return <EyeCloseIcon className="stroke-greyPrimary" />;
    }

    return iconRight;
  }, [props.type, iconRight, passwordShow]);

  const inputType: HTMLInputTypeAttribute | undefined = useMemo(() => {
    if (props?.type === "password") {
      if (passwordShow) {
        return "text";
      }

      return "password";
    }

    return props.type;
  }, [passwordShow, props.type]);

  return (
    <div ref={containerRef} className="w-full relative">
      <div
        className={cn("w-full py-3 flex flex-col items-start border-b", className, {
          "border-none": variant === "no-border",
          "border-b-greyOutline": !error,
          "!border-b-bluePrimary": isFocus,
          "border-b-redPrimary": error,
          "border-greyOutline": !error,
          "!border-bluePrimary": isFocus && highlightFullBorderWhenFocus,
          "border-redPrimary": error && highlightFullBorderWhenFocus,
        })}
      >
        {label && (
        <label className={cn("mb-2 text-sm text-greyPrimary", labelClassName)} htmlFor="input">
          {label}{" "}
          {rules?.required && !requiredHideSymbol && (
            <span className="ml-[2px] text-redPrimary">*</span>
          )}
        </label>
        )}
        <div className="w-full flex items-center">
          {iconLeft && (
            <div
              className={cn("mr-2", {
                "fill-darkPrimary stroke-darkPrimary": !props.disabled,
                "fill-greyPrimary stroke-greyPrimary": props.disabled,
              })}
            >
              {iconLeft}
            </div>
          )}
          <input
            className={cn(
              "flex-1 outline-none bg-transparent autofill:bg-transparent focus:border-b-bluePrimary",
              {
                "text-greyPrimary": props.disabled,
              },
              inputClassName
            )}
            {...(register && register(id, rules))}
            {...props}
            type={inputType}
            autoFocus={autoFocus}
            onFocus={handleFocus}
            onBlur={handleBlur}
            autoCorrect={props.type === "email" ? "off" : undefined}
            autoCapitalize={props.type === "email" ? "none" : undefined}
          />
          {IconRight && (
            <div
              className={cn("mr-2", {
                "cursor-pointer": props?.type === "password",
              })}
              onClick={props?.type === "password" ? handleToggleShowPassword : undefined}
            >
              {IconRight}
            </div>
          )}
        </div>
      </div>
      {showError && error && error.message && (
        <span className="mt-1 text-sm text-redPrimary">{error.message}</span>
      )}

      {withSelect && isFocus && renderSelectContent && (
        <div className="absolute z-50 top-[calc(100%+4px)] min-w-[280px] max-h-[300px] rounded-lg overflow-hidden shadow-primary border border-greyOutlineSecondary bg-white">
          <div
            className={cn(
              "w-full h-full max-h-[280px] py-[6px] flex flex-col overflow-y-auto",
              [CustomScrollbarStyles.CustomScrollbar]
            )}
          >
            {renderSelectContent}
          </div>
        </div>
      )}
    </div>
  );
};

export default TextField;
