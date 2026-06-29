import { FC } from "react";
import Modal from ".";
import Button from "../button";
import DeleteIcon from "../icons/Delete";

type Props = {
  isOpen: boolean;
  title: string;
  subTitle?: string;
  pozitiveHandler: () => void;
  negativeHandler: () => void;
};

const ConfirmationModal: FC<Props> = ({
  isOpen,
  title,
  subTitle,
  negativeHandler,
  pozitiveHandler,
}) => {
  return (
    <Modal isOpen={isOpen} handleClose={negativeHandler}>
      <div className="max-w-[414px] p-6 flex flex-col items-center sm:max-w-full">
        <div className="w-16 h-16 rounded-lg flex items-center justify-center bg-redPrimary">
          <DeleteIcon className="w-9 h-9 stroke-white" />
        </div>
        <h5 className="mt-5 text-[26px] font-bold text-center">{title}</h5>
        <p className="mt-4  text-center text-greyPrimary">{subTitle}</p>
        <div className="w-full mt-[76px] flex justify-between">
          <Button className="px-10" variant="resting" onClick={negativeHandler}>
            Cancel
          </Button>
          <Button className="px-10" variant="dark" onClick={pozitiveHandler}>
            Confirm
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
