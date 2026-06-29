import React, { MouseEvent, ReactNode, useRef, useState } from "react";
import { UseFormSetValue } from "react-hook-form";
import ArrowSecondaryDownIcon from "../icons/ArrowSecondaryDown";
import CustomScrollbarStyles from "@/styles/scrollbar.module.sass";
import { cn } from "@/utils/cn";
import { useClickOutside } from "@/hooks/useClickOutside";

type PropsBase<T> = {
  id: string;
  multiple?: boolean;
  options: T[];
  variant?: "no-border" | "border-bottom";
  size?: "sm";
  selectDropdownPosition?: "top" | "bottom";
  classNames?: {
    container?: string;
    selectContainer?: string;
  };
  error?: boolean;
  setValue: UseFormSetValue<any>;
  renderLeftIcon?: () => ReactNode;
  renderOption: (option: T) => ReactNode;
  renderEmptyOption?: () => ReactNode;
};

type PropsSingle<T> = PropsBase<T> & {
  multiple?: never;
  selectedOption?: T;
  renderOptionSelected: (option?: T) => ReactNode;
};

type PropsMultiple<T> = PropsBase<T> & {
  multiple: true;
  selectedOption?: T[];
  renderOptionSelected: (option?: T[]) => ReactNode;
};

const AppSelect = <T extends { id: string | number } & Record<string, any>>({
  id,
  variant,
  size,
  multiple,
  options,
  selectedOption,
  classNames,
  selectDropdownPosition,
  error,
  renderLeftIcon,
  renderOption,
  renderEmptyOption,
  renderOptionSelected,
  setValue,
}: PropsSingle<T> | PropsMultiple<T>) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const multipleOnChangeHandler = (option: T) => {
    if (selectedOption) {
      const finded = (selectedOption as T[]).find((o) => o.id === option.id);

      if (finded) {
        setValue(
          id,
          (selectedOption as T[]).filter((o) => o.id !== option.id)
        );
      } else {
        setValue(id, [...(selectedOption as T[]), option]);
      }
    } else {
      setValue(id, [option]);
    }
  };

  const onChange = (e: MouseEvent, option: T) => {
    e.stopPropagation();

    if (multiple) {
      multipleOnChangeHandler(option);
    } else {
      setValue(id, option);
    }
    !multiple && handleClose();
  };

  useClickOutside(containerRef, handleClose);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full min-h-9 py-3 px-3 flex items-center rounded-lg border transition-all border-greyOutlineSecondary hover:border-greyLight",
        {
          "py-2 px-2": size === "sm",
          "border-greyLight": isOpen,
          "!border-transparent px-0": variant === "no-border",
          "rounded-none border-[0px] border-b": variant === "border-bottom",
          "border-redPrimary hover:border-redPrimary": error,
        },
        classNames?.container
      )}
      onClick={handleOpen}
    >
      <div className="w-full h-full flex items-center justify-between cursor-pointer">
        {renderLeftIcon && renderLeftIcon()}
        <div
          className={cn(
            "w-full h-full mx-1 flex items-center justify-between overflow-x-auto",
            [CustomScrollbarStyles.CustomScrollbar_Horizontal]
          )}
        >
          {renderOptionSelected(selectedOption as T & T[])}
        </div>

        <ArrowSecondaryDownIcon
          className={cn("transition-all", {
            "rotate-180": isOpen,
          })}
        />
      </div>

      {isOpen && (
        <div
          className={cn(
            "absolute z-50 left-0 w-full rounded-lg overflow-hidden shadow-primary border border-greyOutlineSecondary bg-white",
            classNames?.selectContainer,
            {
              "top-[calc(100%+4px)]":
                !selectDropdownPosition || selectDropdownPosition === "bottom",
              "bottom-[calc(100%+4px)]": selectDropdownPosition === "top",
            }
          )}
        >
          <div
            className={cn(
              "w-auto h-full max-h-[280px] py-[6px] flex flex-col overflow-y-auto",
              [CustomScrollbarStyles.CustomScrollbar]
            )}
          >
            {options.length
              ? options.map((i) => (
                  <div
                    key={i.id}
                    className={cn(
                      "py-[6px] pl-2 pr-1 _h-[50px] cursor-pointer hover:bg-greyBackgroundLight",
                      {
                        "bg-greyBackgroundLight": multiple
                          ? selectedOption?.some((s) => s.id === i.id)
                          : selectedOption?.id === i.id,
                      }
                    )}
                    onClick={(e) => onChange(e, i)}
                  >
                    {renderOption(i)}
                  </div>
                ))
              : renderEmptyOption && renderEmptyOption()}
          </div>
        </div>
      )}
    </div>
  );
};

export default AppSelect;
