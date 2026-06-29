import { FC } from "react";
import Modal from "@/components/ui/modal";
import Button from "@/components/ui/button";
import CloseIcon from "@/components/ui/icons/Close";

type Props = {
  isOpen: boolean;
  handleContinue: () => void;
  handleClose: () => void;
  handleDelete: () => void;
};

const DraftModal: FC<Props> = ({ isOpen, handleContinue, handleClose, handleDelete }) => {
  return (
    <Modal enableMobile isOpen={isOpen} handleClose={handleClose}>
      <div className="w-[430px] p-6 sm:w-full">
        <div className="flex items-center justify-between">
          <h4 className="font-bold">Draft booking</h4>
          <div className="flex items-center gap-4">
            <Button
              className="w-9 h-9 p-0"
              variant="resting-active"
              onClick={handleClose}
            >
              <CloseIcon className="w-5 h-5 stroke-greyPrimary" />
            </Button>
          </div>
        </div>
        <p className="mt-2 text text-greyPrimary">You have unconfirmed draft booking</p>
        <Button variant="dark" className="w-full mt-10" onClick={handleContinue}>
          Continue
        </Button>
        <Button variant="dark-outline" className="w-full mt-2" onClick={handleDelete}>
          Create new booking
        </Button>
      </div>
    </Modal>
  );
};

export default DraftModal;
