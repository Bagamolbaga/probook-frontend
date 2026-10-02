/* eslint-disable @typescript-eslint/ban-ts-comment */
import { FC } from "react";
import { motion, Variants } from "framer-motion";
import { cn } from "@/src/utils/cn";

export type TStep = {
  id: string;
  text: string;
  icon?: FC;
  disabled?: boolean;
};

type Props = {
  activeStepId: string;
  steps: TStep[];
  canSelectStep?: boolean;
  selectStepHandler?: (step: TStep) => void;
  variant?: "default" | "booking-progress";
};

const Stepper: FC<Props> = ({
  activeStepId,
  steps,
  canSelectStep,
  selectStepHandler,
  variant = "default",
}) => {
  const variantsIcon: Variants = {
    active: {
      background: "#1c1d21",
    },
    default: {
      background: "#ffffff",
    },
  };

  const variantsText: Variants = {
    active: {
      color: "#1c1d21",
      fontWeight: 700,
    },
    default: {
      color: "#8181a5",
      fontWeight: 400,
    },
  };

  const handleSelectStep = (step: TStep) => {
    selectStepHandler && selectStepHandler(step);
  };

  if (variant === "booking-progress") {
    return (
      <div
        aria-label="Booking progress"
        className="flex h-[86px] w-full items-center justify-between gap-4 font-funnel sm:h-auto sm:gap-2"
      >
        {steps.map((step, index) => {
          const isActive = activeStepId === step.id;
          const isClickable = Boolean(
            canSelectStep && selectStepHandler && !step.disabled
          );

          return (
            <div key={step.id} className="flex min-w-0 flex-1 items-center gap-2">
              <button
                type="button"
                aria-current={isActive ? "step" : undefined}
                disabled={!isClickable}
                onClick={() => handleSelectStep(step)}
                className={cn(
                  "flex min-w-0 items-center gap-2 text-left disabled:cursor-default",
                  {
                    "cursor-pointer": isClickable,
                    "opacity-50": step.disabled,
                  }
                )}
              >
                <span
                  className={cn(
                    "flex size-10 shrink-0 items-center justify-center rounded-full text-base font-bold",
                    {
                      "bg-purplePrimary text-white": isActive,
                      "bg-greyOutline text-greyPrimary": !isActive,
                      "bg-purplePrimary/50 text-white": isClickable && !isActive,
                    }
                  )}
                >
                  {index + 1}
                </span>
                <span
                  className={cn("truncate text-sm", {
                    "font-bold text-darkPrimary": isActive,
                    "font-medium text-greyPrimary": !isActive,
                  })}
                >
                  {step.text}
                </span>
              </button>
              {index !== steps.length - 1 && (
                <span className="h-px min-w-3 flex-1 bg-greyOutline sm:max-w-3" />
              )}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="relative w-full flex items-center justify-center gap-5">
      {steps.map((s, idx) => {
        const Icon = s.icon;
        return (
          <>
            <motion.div
              key={s.id}
              initial={false}
              variants={variantsIcon}
              animate={activeStepId === s.id ? "active" : "default"}
              className={cn(
                "relative w-9 h-9 flex items-center justify-center rounded-lg border border-greyOutlineSecondary",
                {
                  "cursor-pointer hover:text-purplePrimary": canSelectStep,
                }
              )}
              onClick={() => handleSelectStep(s)}
            >
              {Icon && (
                <Icon
                  //@ts-ignore
                  className={cn({
                    "stroke-white": activeStepId === s.id,
                  })}
                />
              )}
              <motion.p
                variants={variantsText}
                animate={activeStepId === s.id ? "active" : "default"}
                className={cn(
                  "absolute top-[calc(100%+12px)] text-sm transition-all text-nowrap",
                  {
                    "": canSelectStep,
                  }
                )}
              >
                {s.text}
              </motion.p>
            </motion.div>
            {idx !== steps.length - 1 && (
              <div
                key={"line_" + idx}
                className="w-[80px] h-[2px] bg-greyOutlineSecondary sm:w-[10px]"
              ></div>
            )}
          </>
        );
      })}
    </div>
  );
};

export default Stepper;
