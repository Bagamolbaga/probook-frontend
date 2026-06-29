"use client";

import React, { FC, PropsWithChildren, useState } from "react";
import { motion, Variants } from "framer-motion";
import clsx from "clsx";
import PlusRight from "../icons/Plus";

type Props = {
  initial?: boolean;
  title: string;
};

const Collapse: FC<PropsWithChildren<Props>> = ({ initial = false, title, children }) => {
  const [isOpen, setIsOpen] = useState(initial);

  const variants: Variants = {
    open: {
      height: "auto",
      marginTop: "16px",
    },
    closed: {
      height: 0,
      marginTop: "0",
    },
  };

  const toggleOpenHandler = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="p-6 rounded-xl border shadow-primary border-greyBackgroundLight">
      <div
        className="flex justify-between items-center gap-5 cursor-pointer"
        onClick={toggleOpenHandler}
      >
        <p className="text-darkPrimary text-lg font-bold">{title}</p>
        <div
          className="flex justify-center items-center cursor-pointer"
          onClick={toggleOpenHandler}
        >
          <PlusRight
            className={clsx("fill-darkPrimary stroke-darkPrimary transition-all", {
              "rotate-45": isOpen,
              "rotate-0": !isOpen,
            })}
          />
        </div>
      </div>
      <motion.div
        className={clsx("overflow-hidden", {})}
        initial={false}
        animate={isOpen ? "open" : "closed"}
        variants={variants}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default Collapse;
