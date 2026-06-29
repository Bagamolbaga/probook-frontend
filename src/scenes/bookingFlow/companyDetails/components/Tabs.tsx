import { FC } from "react";
import { motion } from "framer-motion";

export type Tab = {
  id: string;
  text: string;
};

type Props = {
  tabs: Tab[];
  activelTab: Tab;
  handleSelect: (tab: Tab) => void;
};

const Tabs: FC<Props> = ({ tabs, activelTab, handleSelect }) => {
  return (
    <div className="w-full flex items-center justify-between">
      {tabs.map((tab) => (
        <span
          key={tab.id}
          className="relative flex-1 py-2 text-sm font-bold text-center cursor-pointer border-b border-greyOutlineSecondary"
          onClick={() => handleSelect(tab)}
        >
          {tab.text}
          {activelTab.id === tab.id && (
            <motion.div
              layoutId="underline"
              className="absolute bottom-0 left-0 right-0 h-[2px] bg-darkPrimary"
            ></motion.div>
          )}
        </span>
      ))}
    </div>
  );
};

export default Tabs;
