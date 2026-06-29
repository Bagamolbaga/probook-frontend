import React, { FC, PropsWithChildren } from "react";
import { Modal as ModalMUI } from "@mui/material";
import { cn } from "@/utils/cn";

type Props = {
  isOpen: boolean;
  enableMobile?: boolean;
  handleClose: () => void;
};

const Modal: FC<PropsWithChildren<Props>> = ({ isOpen, enableMobile, handleClose, children }) => {
  return (
    <ModalMUI open={isOpen}>
      <div
        className="w-full h-screen overflow-y-auto py-[70px] px-5 content-center cursor-pointer md:py-[56px] sm:py-10"
        onClick={handleClose}
      >
        <div
          className={cn("w-fit h-fit mx-auto rounded-xl bg-white cursor-default sm:w-full sm:h-auto", {
            "sm:w-full sm:h-auto": enableMobile
          })}
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      </div>
    </ModalMUI>
  );
};

export default Modal;
