import { FC } from "react";
import { FieldError, RegisterOptions, UseFormRegister } from "react-hook-form";
import { CountrySelector, usePhoneInput } from "react-international-phone";
import TextField from "./TextField";
import "react-international-phone/style.css";
import { cn } from "@/utils/cn";

type Props = {
  id: string;
  setValue: (val: string) => void;
  register: UseFormRegister<any>;
  error?: FieldError;
  rules?: RegisterOptions;
  className?: string;
};

const PhoneTextInput: FC<Props> = ({
  id,
  error,
  setValue,
  register,
  rules,
  className,
}) => {
  const { inputValue, phone, country, setCountry, handlePhoneValueChange, inputRef } =
    usePhoneInput({
      defaultCountry: "th",
      value: "",
      onChange: ({ phone, inputValue, country }) => {
        setValue(inputValue);
      },
    });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;

    if (!val.startsWith("+66")) {
      val = "+66" + val.replace(/^(\+6)/, "").replace(/\D/g, "");
    } else {
      const digitsOnly = val.replace(/^(\+66)/, "").replace(/\D/g, "");
      val = "+66" + digitsOnly;
    }

    setValue(val);
  };

  return (
    <TextField
      className={cn("px-3 rounded-xl border border-greyOutline", className)}
      id={id}
      register={register}
      error={error}
      rules={rules}
      showError
      highlightFullBorderWhenFocus
      iconLeft={
        <div className="flex items-center gap-1">
          <CountrySelector
            dropdownStyleProps={{
              className: "outline-none border border-greyBackgroundLight",
            }}
            buttonClassName="!border-none"
            buttonContentWrapperClassName="!border-none"
            className="bgnh"
            selectedCountry={country.iso2}
            // onSelect={({ iso2 }) => setCountry(iso2)}
            disabled
          />
          <div className="w-[1px] h-[30px] bg-greyOutline" />
        </div>
      }
      onChange={handleChange}
    />
  );
};

export default PhoneTextInput;
