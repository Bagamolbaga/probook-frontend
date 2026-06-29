import { FC, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useClickOutside } from "@/hooks/useClickOutside";
import ConfirmationModal from "@/components/ui/modal/ConfirmationModal";

type Props = {
  handleClose: () => void;
  handleDelete: () => void;
};

const Actions: FC<Props> = ({ handleClose, handleDelete }) => {
  const t = useTranslations();
  const containerRef = useRef<HTMLDivElement>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const deleteHandler = () => {
    handleDelete();
    setShowConfirmDelete(false);
  };

  const clickOutsideHandler = () => {
    handleClose();
  };

  useClickOutside(containerRef, clickOutsideHandler);

  return (
    <>
      <div
        ref={showConfirmDelete ? null : containerRef}
        className="absolute z-50 top-0 right-[calc(100%+8px)] w-max px-2 py-2 flex flex-col gap-2 rounded-lg border shadow-primary bg-white border-greyOutlineSecondary"
      >
        <p
          className="cursor-pointer text-sm font-normal text-redPrimary/70 hover:text-redPrimary"
          onClick={() => setShowConfirmDelete(true)}
        >
          {t("bookingManagement.actions.delete")}
        </p>
      </div>
      <ConfirmationModal
        isOpen={showConfirmDelete}
        title={t("bookingManagement.deleteModal.title")}
        subTitle={t("bookingManagement.deleteModal.subTitle")}
        negativeHandler={handleClose}
        pozitiveHandler={deleteHandler}
      />
    </>
  );
};

export default Actions;
