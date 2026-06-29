"use client";

import { UseFormReturn } from "react-hook-form";
import { SearchForm } from "../..";
// import Search from "../Search";

type Props = {
  form: UseFormReturn<SearchForm>;
};

const MainSection = ({ form }: Props) => {
  return (
    <>
      <div className="w-full mt-[calc(156px+78px)]">
        <h1 className="text-[80px] leading-[90px] font-extrabold text-center">
          Book in Seconds <br />{" "}
          <span className="text-purplePrimary">Enjoy for Hours</span>
        </h1>
        <p className="mt-10 text-[22px] text-center">
          Your glow is just one <span className="text-purplePrimary">booking</span> away
        </p>
      </div>

      {/* <Search form={form} /> */}
    </>
  );
};

export default MainSection;
