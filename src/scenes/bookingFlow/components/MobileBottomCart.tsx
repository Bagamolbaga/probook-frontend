"use client";

import { FC, ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { motion, PanInfo, Variants } from "framer-motion";
import { createPortal } from "react-dom";
import { formatCurrency } from "@/utils/formatCurrency";
import { cn } from "@/utils/cn";
import CustomScrollbar from "@/styles/scrollbar.module.sass";
import CalendarIcon from "@/components/ui/icons/Calendar";
import ClockIcon from "@/components/ui/icons/Clock";
import { format } from "date-fns";
import { useTranslations } from "next-intl";
import { TIME_SLOTS } from "@/constants/timeSlots";

type Props = {
  isDashboard?: boolean
  _stepId: string;
  company?: TCompany;
  selectedServices: TServiceAndSelectedOption[];
  selectedStaff?: TSpecialist | "ANY";
  selectedDate: Date;
  selectedTime?: (typeof TIME_SLOTS)[0];
  renderContinueButton?: ReactNode;
};

const MobileBottomCart: FC<Props> = ({
  isDashboard,
  _stepId,
  selectedServices,
  selectedStaff,
  selectedDate,
  selectedTime,
  renderContinueButton,
}) => {
  const t = useTranslations();
  const contentContainer = useRef<HTMLDivElement>(null)

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
  }, [isOpen]);

  const closeHandler = () => setIsOpen(false);

  const onDragHandle = (e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.y <= -70) {
      setIsOpen(true);
    }

    if (info.offset.y >= 70) {
      setIsOpen(false);
    }
  };

  const variantsBg: Variants = {
    open: {
      height: "100vh",
      borderRadius: "0",
    },
    close: {
      height: "94px",
      borderRadius: "20px 20px 0 0",
    },
    fullClose: {
      height: 0,
      overflow: "hidden",
    },
  };

  const variantsSwiper: Variants = {
    open: {
      height: "auto",
    },
    close: {
      height: "94px",
    },
    fullClose: {
      height: 0,
    },
  };

  const variantsBgAnimate = useMemo(() => {
    if (_stepId === "confirm") {
      return "fullClose";
    }

    if (isOpen) {
      return "open";
    }

    return "close";
  }, [isOpen, _stepId]);

  const variantsSwiperAnimate = useMemo(() => {
    if (_stepId === "confirm") {
      return "fullClose";
    }

    if (isOpen) {
      return "open";
    }

    return "close";
  }, [isOpen, _stepId]);

  return (
    <>
      {createPortal(
        <motion.div
          className={cn("fixed bottom-0 left-0 right-0 z-50 w-full flex-col justify-end bg-darkPrimary/35 hidden sm:flex", {
            "bottom-[64px]": isDashboard
          })}
          variants={variantsBg}
          animate={variantsBgAnimate}
          onClick={closeHandler}
        >
          <motion.div
            className="w-full pt-2 pb-6 px-6 flex flex-col items-center rounded-t-[20px] border-t border-greyOutlineSecondary bg-white"
            variants={variantsSwiper}
            animate={variantsSwiperAnimate}
          >
            <motion.div
              className="w-full h-6 flex justify-center rounded-full"
              drag="y"
              dragConstraints={{ bottom: 0, top: 0 }}
              onDrag={onDragHandle}
            >
              <div className="w-[42px] h-1 rounded-full bg-greyLight"></div>
            </motion.div>
            <div className="w-full flex justify-between">
              <div>
                <p className="text-xs text-greyPrimary">
                  {selectedServices.length} {t("booking.steps.services").toLowerCase()} -{" "}
                  {selectedServices.reduce(
                    (acc, c) => (acc += c.selectedOption.duration),
                    0
                  )}{" "}
                  {t("booking.servicesStep.mins")}
                </p>
                <h6 className="font-bold">
                  {formatCurrency(
                    selectedServices.reduce(
                      (acc, c) => (acc += Number(c.selectedOption.price)),
                      0
                    )
                  )}
                </h6>
              </div>
              {renderContinueButton}
            </div>
            {isOpen && (
              <div className="w-full h-[1px] my-6 bg-greyOutlineSecondary"></div>
            )}

            {isOpen && (
              <div
                className={cn(
                  "w-full pr-1 flex flex-col calc(60vh-96px) overflow-y-auto",
                  CustomScrollbar.CustomScrollbar
                )}
              >
                {/* <div className="w-full">
                  <div className="w-full  flex items-center gap-2">
                    {company?.logo ? (
                      <div className="min-w-[76px] min-h-[76px] w-[76px] h-[76px] rounded-lg bg-greyLight overflow-hidden">
                        <Image
                          className="!relative w-full h-full object-cover"
                          fill
                          src={company.logo}
                          alt={company.name}
                        />
                      </div>
                    ) : (
                      <div className="min-w-[76px] min-h-[76px] rounded-lg bg-greyLight"></div>
                    )}
                    <div>
                      <h5 className="ml-5 text-base font-bold">{company?.name}</h5>
                      <p className="mt-1 flex items-start gap-1 text-sm text-greyPrimary">
                        <LocationIcon className="min-w-4 min-h-4" />
                        {company?.address1}
                      </p>
                    </div>
                  </div>
                </div> */}
                {!!selectedServices.length && (
                  <div className="w-full flex flex-col">
                    {/* <div className="w-full h-[1px] my-6 bg-greyOutlineSecondary"></div> */}
                    {selectedDate && (
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="stroke-darkPrimary" />
                        <p className="text-sm text-greyPrimary">
                          {format(selectedDate, "EEEE d MMM")}
                        </p>
                      </div>
                    )}
                    {selectedTime && (
                      <div className="mt-2 flex items-center gap-2">
                        <ClockIcon className="stroke-darkPrimary" />
                        <p className="text-sm text-greyPrimary">{selectedTime?.label}</p>
                      </div>
                    )}
                    <p className="mt-2 text-sm">{t("booking.bookingCard.services")}</p>
                    <div
                      className={cn(
                        "max-h-[227px] mt-2 pr-2 flex flex-col gap-2 overflow-y-auto",
                        CustomScrollbar.CustomScrollbar
                      )}
                    >
                      {selectedServices.map((s) => (
                        <div key={s.id} className="flex items-center gap-2">
                          <div className="size-5 rounded-full border-2 border-greyLight"></div>

                          <div className="flex-1 flex flex-col gap-1">
                            <p className="text-sm font-bold">{s.selectedOption.name}</p>
                            <p className="text-sm text-greyPrimary">
                              {s.selectedOption.duration} {t("booking.servicesStep.mins")}
                            </p>
                          </div>
                          <div>
                            <p className="font-bold">
                              {formatCurrency(s.selectedOption.price)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    {selectedStaff && selectedStaff === "ANY" && (
                      <div className="mt-4">
                        <p className="text-sm">{t("booking.bookingCard.professional")}</p>
                        <div className="mt-2 flex items-center gap-2">
                          <div className="size-5 rounded-full border-2 border-greyLight"></div>

                          <div className="flex-1 flex flex-col gap-1">
                            <p className="text-sm font-bold">
                              {t("booking.professionalStep.anyProf")}
                            </p>
                            <p className="text-sm text-greyPrimary">
                              {t("booking.professionalStep.forMaxAvailability")}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    {selectedStaff && selectedStaff !== "ANY" && (
                      <div className="mt-4">
                        <p className="text-sm">{t("booking.bookingCard.professional")}</p>
                        <div className="mt-2 flex items-center gap-2">
                          <div className="size-5 rounded-full border-2 border-greyLight"></div>

                          <div className="flex-1 flex flex-col gap-1">
                            <p className="text-sm font-bold">{selectedStaff.full_name}</p>
                            <p className="text-sm text-greyPrimary">
                              {/* {selectedStaff.bio} */}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </motion.div>,
        document.body
      )}
    </>
  );
};

export default MobileBottomCart;
