import { motion } from "framer-motion";
import { Dispatch, ReactNode, SetStateAction, useRef, useState } from "react";
import { useClickOutside } from "@/hooks/useClickOutside";

type Props = {
  isAnimated?: boolean;
  handleFocusField: (val: boolean) => void;
  renderField: (
    setFocus: Dispatch<SetStateAction<boolean>>,
    isFocus: boolean
  ) => ReactNode;
};

const FieldContainer = ({ isAnimated, handleFocusField, renderField }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isFocus, setIsFocus] = useState(false);

  const handleFocusFieldLocal = (val: boolean) => {
    setIsFocus(val);
    handleFocusField(val);
  };

  useClickOutside(ref, () => handleFocusFieldLocal(false));

  return (
    <motion.div
      ref={ref}
      className="relative flex-1 px-6 py-[6px] flex flex-col items-start justify-center rounded-full cursor-pointer sm:w-full"
      animate={{
        background: isAnimated && isFocus ? "#fff" : "transparent",
      }}
      onClick={() => handleFocusFieldLocal(true)}
    >
      {renderField(() => {}, isFocus)}
    </motion.div>
  );
};

export default FieldContainer;
