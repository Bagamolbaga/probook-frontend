/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { cn } from "@/utils/cn";
import React, {
  useRef,
  useState,
  useEffect,
  FC,
  ChangeEvent,
  FocusEvent,
  KeyboardEvent,
  ClipboardEvent,
} from "react";
import Button from "../button";
import CloseIcon from "../icons/Close";

type Props = {
  fields: number;
  isLoading?: boolean;
  isSuccess?: boolean;
  isError?: boolean;
  validRegExp?: RegExp;
  callback: (code: string) => void;
};

const EnterCodeField: FC<Props> = ({
  fields,
  callback,
  isLoading,
  isSuccess,
  isError,
  validRegExp = /^[a-z]+$/,
}) => {
  const [code, setCode] = useState<string>("");

  // Refs to control each digit input element
  const inputRefs = Array.from({ length: fields }).map(() =>
    useRef<HTMLInputElement>(null)
  );

  // Reset all inputs and clear state
  const resetCode = () => {
    inputRefs.forEach((ref) => {
      if (ref.current) {
        ref.current.value = "";
      }
    });

    if (inputRefs[0].current) {
      inputRefs[0].current.focus();
    }
    setCode("");
  };

  // Call our callback when code = 6 chars
  useEffect(() => {
    if (code.length === fields) {
      if (typeof callback === "function") callback(code);
      // resetCode();
    }
  }, [code]); //eslint-disable-line

  // Handle input
  function handleInput(e: ChangeEvent<HTMLInputElement>, index: number) {
    const input = e.target;
    const previousInput = inputRefs[index - 1];
    const nextInput = inputRefs[index + 1];

    // Update code state with single digit
    const newCode = code.split("");
    // Convert lowercase letters to uppercase
    if (validRegExp.test(input.value)) {
      const uc = input.value.toUpperCase();
      newCode[index] = uc;

      if (inputRefs[index] && inputRefs[index].current) {
        //@ts-ignore
        inputRefs[index].current.value = uc;
      }
    } else {
      newCode[index] = input.value;
    }
    setCode(newCode.join(""));

    input.select();

    if (input.value === "") {
      // If the value is deleted, select previous input, if exists
      if (previousInput?.current) {
        previousInput.current.focus();
      }
    } else if (nextInput?.current) {
      // Select next input on entry, if exists
      nextInput.current.select();
    }
  }

  // Select the contents on focus
  function handleFocus(e: FocusEvent<HTMLInputElement>) {
    e.target.select();
  }

  // Handle backspace key
  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>, index: number) {
    const input = e.target;
    const previousInput = inputRefs[index - 1];
    const nextInput = inputRefs[index + 1];

    //@ts-ignore
    if ((e.keyCode === 8 || e.keyCode === 46) && input.value === "") {
      e.preventDefault();
      setCode((prevCode) => prevCode.slice(0, index) + prevCode.slice(index + 1));
      if (previousInput?.current) {
        previousInput.current.focus();
      }
    }
  }

  // Capture pasted characters
  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    const pastedCode = e.clipboardData.getData("text");
    if (pastedCode.length === fields) {
      setCode(pastedCode);
      inputRefs.forEach((inputRef, index) => {
        if (inputRef.current) {
          inputRef.current.value = pastedCode.charAt(index);
        }
      });
    }
  };

  return (
    <div className="pl-9 flex items-center gap-2 relative">
      <div className="flex items-center gap-2 relative">
        {Array.from({ length: fields }).map((_, index) => (
          <input
            className={cn(
              "w-14 h-14 text-3xl text-center rounded-lg flex-1 outline-none bg-transparent autofill:bg-transparent border border-grey/40 focus:border-bluePrimary",
              {
                "text-greyPrimary": isLoading,
                "!border-greenPrimary": isSuccess,
                "!border-redPrimary": isError,
              }
            )}
            key={index}
            type="text"
            maxLength={1}
            onChange={(e) => handleInput(e, index)}
            ref={inputRefs[index]}
            autoFocus={index === 0}
            onFocus={handleFocus}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={handlePaste}
            disabled={isLoading}
          />
        ))}
      </div>
      <Button
        className={cn("w-9 h-9 p-0", {
          visible: code.length,
          invisible: !code.length || isSuccess,
        })}
        variant="resting-active"
        onClick={resetCode}
      >
        <CloseIcon className="w-5 h-5 stroke-greyPrimary" />
      </Button>
    </div>
  );
};

export default EnterCodeField;
