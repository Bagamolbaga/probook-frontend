import React, { FC, useRef } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";
import Button from "../button";
import ArrowSecondaryDownIcon from "../icons/ArrowSecondaryDown";

type Tab = {
  id: string;
  text: string;
};

type Props = {
  activelTabId: Tab["id"];
  tabs: Tab[];
  onSelect: (tab: Tab) => void;
};

const Tabs: FC<Props> = ({ activelTabId, tabs, onSelect }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollableRef = useRef<HTMLDivElement>(null);

  const scroll = (scrolloffset: number) => {
    if (scrollableRef.current) {
      scrollableRef.current.scrollLeft += scrolloffset;
    }
  };

  const isScrollable =
    containerRef.current &&
    scrollableRef.current &&
    containerRef.current?.clientWidth < scrollableRef.current?.scrollWidth;

  return (
    <div ref={containerRef} className="relative">
      <div
        ref={scrollableRef}
        className="relative flex items-center rounded-[24px] border border-greyLight overflow-x-hidden"
      >
        {tabs.map((t) => (
          <div
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
              onSelect(t);
            }}
          >
            {t.text}
            {activelTabId === t.id && (
              <motion.div
                layoutId={tabs.map(i => i.id).join("_")}
                className="absolute -z-[1] top-0 left-0 right-0 bottom-0 w-full h-full rounded-[24px] bg-purplePrimary"
              ></motion.div>
            )}
          </div>
        ))}
        {isScrollable && <div className="relative min-w-[52px] min-h-full z-10"></div>}
      </div>
      {isScrollable && (
        <div className="absolute z-10 right-0 top-[1px] bottom-[1px] h-[calc(100%-2px)] pl-2 bg-white flex items-center">
          <Button
            variant="resting-active"
            className="!p-0 !rounded"
            onClick={() => scroll(-300)}
          >
            <ArrowSecondaryDownIcon className="rotate-90" />
          </Button>
          <Button
            variant="resting-active"
            className="!p-0 !rounded"
            onClick={() => scroll(300)}
          >
            <ArrowSecondaryDownIcon className="-rotate-90" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default Tabs;
