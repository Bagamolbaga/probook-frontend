/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
"use client";

import { useEffect, useRef, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { motion, Variant } from "framer-motion";
import { isBefore, isSameDay } from "date-fns";

import Button from "@/components/ui/button";
import SearchIcon from "@/components/ui/icons/Search";
import DatePickerField from "@/components/ui/inputs/DatePickerField";
import TimePicker from "@/components/ui/inputs/TimePicker";
import useWindowWidth from "@/hooks/useWindowWidth";
import ArrowSecondaryDownIcon from "@/components/ui/icons/ArrowSecondaryDown";
import { SearchForm } from "..";
import FieldContainer from "./FieldContainer";
import StoreOrServiceField from "./StoreOrServiceField";
import { cn } from "@/utils/cn";

type VariantKeys =
  | "small"
  | "default"
  | "smallWithFocus"
  | "mobileDefault"
  | "mobileSmall"
  | "mobileCollapsed";

type TVariant = {
  [key in VariantKeys]?: Variant;
};

type Props = {
  isLoading?: boolean;
  form: UseFormReturn<SearchForm>;
  findedStores: TCompany[];
  className?: string;
  handleSearch: () => void;
};

const Search = ({ isLoading, form, findedStores, className, handleSearch }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const { deviceType } = useWindowWidth();
  const [isAnimated, setIsAnimated] = useState(false);
  const [isFocusedField, setIsFocusedField] = useState(false);
  const [isCoollapsedOnMobile, setIsCoollapsedOnMobile] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      if (ref.current) {
        const elementTop = ref.current.getBoundingClientRect().top;

        const topPaddings: Record<typeof deviceType, number> = {
          desctop: 20,
          tablet: 20,
          mobile: 68,
        };

        // Если элемент попал в область верхней части экрана
        if (deviceType !== "mobile") {
          if (
            elementTop <= topPaddings[deviceType] &&
            elementTop >= -ref.current.offsetHeight
          ) {
            setIsAnimated(true);
            form.setValue("_formInHeader", true);
          } else {
            setIsAnimated(false);
            form.setValue("_formInHeader", false);
          }
        } else {
          if (elementTop <= topPaddings[deviceType]) {
            setIsAnimated(true);
            form.setValue("_formInHeader", true);
          } else {
            setIsAnimated(false);
            form.setValue("_formInHeader", false);
          }
        }
      }
    };

    onScroll();
    window.addEventListener("scroll", onScroll);
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [deviceType]);

  const handleFocusField = (val: boolean) => {
    setIsFocusedField(val);
  };

  const containerVariant: TVariant = {
    default: {
      padding: "6px",
    },
    small: {
      padding: "1px",
    },
    mobileSmall: {
      padding: "2px",
      // height: "202px",
    },
    mobileCollapsed: {
      padding: "2px",
      // height: "50px",
      // overflow: "hidden"
    },
  };

  const searchBtnVariant: TVariant = {
    default: {
      width: "75px",
      height: "46px",
    },
    mobileDefault: {
      width: "100%",
      height: "46px",
    },
    small: {
      width: "32px",
      height: "32px",
    },
  };

  const getContainerTopPositionAnimate = () => {
    if (isFocusedField) {
      if (deviceType === "desctop" || deviceType === "tablet") {
        return {
          top: 10,
        };
      }
    }

    if (deviceType === "mobile") {
      return {
        top: 68,
      };
    }

    return {
      top: 20,
    };
  };

  const getContainerAnimate = (): Variant | undefined => {
    if (isAnimated) {
      if (deviceType === "mobile") {
        return containerVariant.default;
      }

      return containerVariant.small;
    }

    return containerVariant.default;
  };

  const getSearchBtnAnimate = (): Variant | undefined => {
    if (isAnimated) {
      if (deviceType === "mobile") {
        return searchBtnVariant.mobileDefault;
      }

      return searchBtnVariant.small;
    }

    if (deviceType === "mobile") {
      return searchBtnVariant.mobileDefault;
    }

    return searchBtnVariant.default;
  };

  const getSearchBtnAnimateInitial = (): Variant | undefined => {
    if (deviceType === "mobile") {
      return searchBtnVariant.mobileDefault;
    }
  };

  const searchBtnTextVariant: TVariant = {
    default: {
      opacity: 1,
      width: "fit-content",
    },
    small: {
      opacity: 0,
      width: "0px",
    },
  };

  const searchBtnIconVariant: TVariant = {
    default: {
      opacity: 0,
    },
    small: {
      opacity: 1,
    },
  };

  const getContainerLeftPadding = () => {
    if (isAnimated) {
      if (deviceType === "mobile") {
        return 0;
      }

      if (deviceType === "tablet") {
        return 150;
      }

      return 200;
    }

    return 0;
  };

  const getContainerRightPadding = () => {
    if (isAnimated) {
      if (deviceType === "mobile") {
        return 0;
      }

      return 150;
    }

    return 0;
  };

  const getFieldLabelAnimate = () => {
    if (deviceType === "mobile") {
      return {
        opacity: 1,
        height: "auto",
      };
    }

    if (isAnimated) {
      if (isFocusedField) {
        return {
          opacity: 1,
          height: "auto",
        };
      }

      return {
        opacity: 0,
        height: "0px",
      };
    }

    return {
      opacity: 1,
      height: "auto",
    };
  };

  return (
    <motion.div
      ref={ref}
      className={cn(
        "sticky z-[100] pointer-events-none 1top-[20px] max-w-content w-full h-[70px] mt-20 px-layoutLeftRight md:px-layoutLeftRight_md sm:px-layoutLeftRight_sm sm:static sm:z-[90]",
        className
      )}
      animate={getContainerTopPositionAnimate()}
    >
      <motion.div
        className="w-full"
        animate={{
          paddingLeft: getContainerLeftPadding(),
          paddingRight: getContainerRightPadding(),
        }}
      >
        <motion.div
          className={cn(
            "pointer-events-auto p-[6px] flex items-center justify-center rounded-full md:rounded-[26px] sm:rounded-[20px]",
            "transition-all bg-gradient-to-r from-[#F679EF50] to-purplePrimary/50"
          )}
          animate={{
            ...getContainerAnimate(),
          }}
        >
          <motion.div
            className="w-full h-full 1p-[6px] flex items-center justify-between gap-3 rounded-full sm: sm:flex-col sm:rounded-[17px]"
            animate={{
              background: isAnimated ? "#f5f5fa" : "#ffffff",
            }}
          >
            <StoreOrServiceField
              form={form}
              isLoading={isLoading}
              isAnimated={isAnimated}
              findedStores={findedStores}
              getFieldLabelAnimate={getFieldLabelAnimate}
              handleFocusField={handleFocusField}
            />

            <FieldContainer
              isAnimated={isAnimated}
              handleFocusField={handleFocusField}
              renderField={(setFocus, isFocus) => (
                <div>
                  <motion.label
                    htmlFor="date"
                    className="flex text-sm cursor-pointer text-darkPrimary"
                    animate={getFieldLabelAnimate()}
                  >
                    Date
                  </motion.label>
                  <DatePickerField
                    key={form.watch("date")?.toISOString()}
                    isOpen={isFocus}
                    value={form.watch("date") ?? null}
                    formSetValue={form.setValue}
                    showHeaderButtons
                    textField={{
                      variant: "no-border",
                      id: "date",
                      placeholder: "Pick a date",
                      register: form.register,
                      className: "py-[0px]",
                      inputClassName: "w-[inherit]",
                      autoComplete: "off",
                      // onFocus: () => {
                      //   setFocus(true);
                      //   handleFocusField(true);
                      // },
                      // onBlur: () => {
                      //   setFocus(false);
                      //   handleFocusField(false);
                      // },
                    }}
                    datePicker={{
                      mode: "single",
                      selected: form.watch("date"),
                      disabled: (d) =>
                        isBefore(d, new Date()) && !isSameDay(d, new Date()),
                    }}
                  />
                </div>
              )}
            />

            <FieldContainer
              isAnimated={isAnimated}
              handleFocusField={handleFocusField}
              renderField={(setFocus, isFocus) => (
                <>
                  <motion.label
                    htmlFor="time"
                    className="flex text-sm cursor-pointer text-darkPrimary"
                    animate={getFieldLabelAnimate()}
                  >
                    Time
                  </motion.label>
                  <TimePicker
                    isOpen={isFocus}
                    withIcon={false}
                    fromId="time.from"
                    toId="time.to"
                    from={
                      form.watch("time.from")
                        ? {
                            ...form.watch("time.from"),
                            id: form.watch("time.from")!.label,
                          }
                        : undefined
                    }
                    to={
                      form.watch("time.to")
                        ? { ...form.watch("time.to"), id: form.watch("time.to")!.label }
                        : undefined
                    }
                    setValue={form.setValue}
                    register={form.register}
                    control={form.control}
                    textFieldProps={{
                      variant: "no-border",
                      className: "p-0",
                      inputClassName: "w-[inherit]",
                      id: "time",
                      register: form.register,
                      // onFocus: () => {
                      //   setFocus(true);
                      //   handleFocusField(true);
                      // },
                      // onBlur: () => {
                      //   setFocus(false);
                      //   handleFocusField(false);
                      // },
                    }}
                  />
                </>
              )}
            />

            <div className="h-full pl-0 p-[6px] flex items-center gap-2 sm:p-[6px] sm:w-full">
              <motion.button
                className={cn(
                  "relative px-4 py-3 flex items-center justify-center rounded-full transition-all bg-purplePrimary hover:bg-purpleDark"
                )}
                initial={deviceType === "mobile" ? false : undefined}
                animate={{
                  ...getSearchBtnAnimate(),
                }}
                onClick={handleSearch}
              >
                <motion.p
                  className={cn("text-sm font-semibold text-white")}
                  // variants={searchBtnTextVariant}
                  // animate={isAnimated ? "small" : "default"}
                  transition={{
                    duration: 0.1,
                  }}
                >
                  {isAnimated && deviceType !== "mobile" ? (
                    <SearchIcon className="fill-white" />
                  ) : (
                    "Search"
                  )}
                </motion.p>
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Search;
