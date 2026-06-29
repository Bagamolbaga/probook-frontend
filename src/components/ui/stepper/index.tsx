/* eslint-disable @typescript-eslint/ban-ts-comment */
import { FC } from "react";
import { motion, Variants } from "framer-motion";
import { cn } from "@/utils/cn";

export type TStep = {
  id: string;
  text: string;
  icon?: FC;
};

type Props = {
  activeStepId: string;
  steps: TStep[];
  canSelectStep?: boolean
  selectStepHandler?: (step: TStep) => void
};

const Stepper: FC<Props> = ({ activeStepId, steps, canSelectStep, selectStepHandler }) => {
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
    selectStepHandler && selectStepHandler(step)
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
                "relative w-9 h-9 flex items-center justify-center rounded-lg border border-greyOutlineSecondary", {
                  "cursor-pointer hover:text-purplePrimary": canSelectStep
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
                className={cn("absolute top-[calc(100%+12px)] text-sm transition-all text-nowrap", {
                  "": canSelectStep
                })}
              >
                {s.text}
              </motion.p>
            </motion.div>
            {idx !== steps.length - 1 && (
              <div key={"line_" + idx} className="w-[80px] h-[2px] bg-greyOutlineSecondary sm:w-[10px]"></div>
            )}
          </>
        );
      })}
    </div>
  );
};

export default Stepper;
