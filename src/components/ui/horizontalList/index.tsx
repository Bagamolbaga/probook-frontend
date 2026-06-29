/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import React, { FC, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";
import Button from "../button";
import ArrowSecondaryDownIcon from "../icons/ArrowSecondaryDown";
import { cn } from "@/utils/cn";

type Tab = {
  id: string | number;
  text: string;
};

type Props = {
  activelTabId?: Tab["id"];
  tabs: Tab[];
  onSelect: (tab: Tab) => void;
};

const HorizontalList: FC<Props> = ({ activelTabId, tabs, onSelect }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollableRef = useRef<HTMLDivElement>(null);

  const [offset, setOffset] = useState(0)

  const scroll = (direction: "left" | "right") => {
    if (!scrollableRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = scrollableRef.current;

    let newScrollLeft = scrollLeft;

    if (direction === "left") {
      // Скролл влево: перемещаемся на ширину видимой области или до начала
      newScrollLeft = Math.max(scrollLeft - clientWidth, 0);
    } else if (direction === "right") {
      // Скролл вправо: перемещаемся на ширину видимой области или до конца
      newScrollLeft = Math.min(scrollLeft + clientWidth, scrollWidth - clientWidth);
    }


    scrollableRef.current.scrollLeft = newScrollLeft;
    setOffset(newScrollLeft);
  };

  const selectLocal = (tab: Tab) => {
    const tabElement = document.querySelector(`[data-tab-id="${tab.id}"]`) as HTMLElement | null;

    if (tabElement && scrollableRef.current) {
      const { scrollLeft, clientWidth } = scrollableRef.current;
      const tabRect = tabElement.getBoundingClientRect();
      const scrollableRect = scrollableRef.current.getBoundingClientRect();

      // Проверяем, находится ли элемент полностью в видимой области
      const isFullyVisible =
        tabRect.left >= scrollableRect.left && tabRect.right <= scrollableRect.right;

      if (!isFullyVisible) {
        // Вычисляем новое значение скролла, чтобы элемент был полностью виден
        const newScrollLeft =
          tabRect.left < scrollableRect.left
            ? scrollLeft - (scrollableRect.left - tabRect.left)
            : scrollLeft + (tabRect.right - scrollableRect.right);

        scrollableRef.current.scrollLeft = newScrollLeft;
        setOffset(newScrollLeft);
      }

      // Вызываем внешний обработчик onSelect
      onSelect(tab);
    }
  };

  const isScrollable = useMemo(() => {
    if (!containerRef.current || !scrollableRef.current) return false;
    return containerRef.current.clientWidth < scrollableRef.current.scrollWidth;
  }, [containerRef.current?.clientWidth, scrollableRef.current?.scrollWidth]);

  const showLeftButton = useMemo(() => {
    return scrollableRef.current?.scrollLeft && scrollableRef.current.scrollLeft > 0;
  }, [scrollableRef.current?.scrollLeft]);

  const showRightButton = useMemo(() => {
    if (!scrollableRef.current) return false;
    const { scrollLeft, scrollWidth, clientWidth } = scrollableRef.current;
    return scrollLeft + clientWidth < scrollWidth;
  }, [scrollableRef.current?.scrollLeft]);

  return (
    <div ref={containerRef} className="relative flex items-center">
      <div
        className={cn("h-[calc(100%-2px)] pr-1 bg-white flex items-center", {
          hidden: !isScrollable,
          "opacity-40 pointer-events-none": !showLeftButton,
        })}
      >
        <Button
          variant="resting-active"
          className="!p-0 !rounded !border-none"
          onClick={() => scroll("left")}
        >
          <ArrowSecondaryDownIcon className="rotate-90" />
        </Button>
      </div>
      <div
        ref={scrollableRef}
        className="relative flex items-center rounded-[24px] overflow-hidden"
      >
        {tabs.map((t) => (
          <div
            data-tab-id={t.id}
            key={t.id}
            className={clsx(
              "relative z-10 py-2 px-4 text-sm font-bold rounded-[24px] cursor-pointer text-nowrap",
              {
                "text-white": activelTabId === t.id,
                " text-greyPrimary transition-colors hover:text-purplePrimary":
                  activelTabId !== t.id,
              }
            )}
            onClick={() => {
              selectLocal(t);
            }}
          >
            {t.text}
            {activelTabId === t.id && (
              <motion.div
                layoutId="background"
                className="absolute -z-[1] top-0 left-0 w-full h-full rounded-[24px] bg-purplePrimary"
              ></motion.div>
            )}
          </div>
        ))}
      </div>
      <div
        className={cn("h-[calc(100%-2px)] pl-1 bg-white flex items-center", {
          hidden: !isScrollable,
          "opacity-40 pointer-events-none": !showRightButton,
        })}
      >
        <Button
          variant="resting-active"
          className="!p-0 !rounded !border-none"
          onClick={() => scroll("right")}
        >
          <ArrowSecondaryDownIcon className="-rotate-90" />
        </Button>
      </div>
    </div>
  );
};

export default HorizontalList;
