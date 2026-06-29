/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import FieldContainer from "./FieldContainer";
import TextField from "@/components/ui/inputs/TextField";
import { SERVICE_TYPES } from "@/constants/serviceTypes";
import { cn } from "@/utils/cn";
import { motion } from "framer-motion";
import { UseFormReturn } from "react-hook-form";
import { SearchForm } from "..";
import { TSearchCompanysRes } from "@/api/entities/company";
import StoreIcon from "@/components/ui/icons/Store";
import CustomScrollbar from "@/styles/scrollbar.module.sass";
import { HighlightText } from "@/components/ui/HighlightText";
import Image from "next/image";
import { Link } from "@/i18n";
import { toSlug } from "@/utils/toSlug";
import MainLoader from "@/components/ui/loaders/MainLoader";

type Props = {
  form: UseFormReturn<SearchForm>;
  findedStores: TCompany[];
  isAnimated?: boolean;
  isLoading?: boolean;
  getFieldLabelAnimate: () => any;
  handleFocusField: (val: boolean) => void;
};

const StoreOrServiceField = ({
  form,
  isAnimated,
  isLoading,
  findedStores,
  getFieldLabelAnimate,
  handleFocusField,
}: Props) => {
  const handleSelectServiceType = (st: TServiceType) => {
    const prev = form.watch("serviceTypes");

    if (prev.find((p) => p.id === st.id)) {
      form.setValue(
        "serviceTypes",
        prev.filter((p) => p.id !== st.id)
      );
    } else {
      form.setValue("serviceTypes", [...prev, st]);
    }
  };

  const isShowFindedStoresPopUp = Boolean(form.watch("search")?.length);
  const isShowServiceTypesPopUp = Boolean(!form.watch("search")?.length);

  return (
    <FieldContainer
      isAnimated={isAnimated}
      handleFocusField={handleFocusField}
      renderField={(setFocus, isFocus) => (
        <div>
          <motion.label
            htmlFor="search"
            className="flex text-sm cursor-pointer text-darkPrimary"
            animate={getFieldLabelAnimate() as any}
          >
            Search
          </motion.label>
          <TextField
            withSelect
            variant="no-border"
            id="search"
            className="!pb-0 !pt-[0px]"
            inputClassName="w-[inherit]"
            placeholder={"Store or services"}
            autoComplete="off"
            register={form.register}
            error={form.formState.errors.search}
            // onFocus={() => {
            //   setFocus(true);
            //   handleFocusField(true);
            // }}
            // onBlur={() => {
            //   setFocus(false);
            //   handleFocusField(false);
            // }}
          />

          {isFocus && isShowServiceTypesPopUp && (
            <div
              className={cn(
                "absolute z-[10] top-[calc(100%+12px)] left-0 min-w-[300px] p-4 flex flex-wrap gap-3 rounded-lg",
                "shadow-secondary border border-greyOutlineSecondary bg-white"
              )}
            >
              {SERVICE_TYPES.map((st) => {
                const Icon = st.icon;

                const isSelected = form
                  .watch("serviceTypes")
                  .find((fst) => fst.id === st.id);
                return (
                  <div
                    key={st.id}
                    className={cn(
                      "h-fit px-3 py-2 flex items-center gap-2 rounded-full transition-all cursor-pointer",
                      "border border-greyOutlineSecondary hover:border-purplePrimary hover:bg-purpleLightSecondary",
                      {
                        "border-purplePrimary/80 bg-purpleLightSecondary": isSelected,
                      }
                    )}
                    onClick={() => handleSelectServiceType(st)}
                  >
                    <Icon />
                    <p className="text-sm">{st.shortLabel}</p>
                  </div>
                );
              })}
            </div>
          )}

          {isFocus && isShowFindedStoresPopUp && (
            <div
              className={cn(
                CustomScrollbar.CustomScrollbar,
                "absolute z-[10] top-[calc(100%+12px)] left-0 min-w-[300px] p-4 flex flex-col gap-3 rounded-lg",
                "overflow-y-scroll max-h-[300px]",
                "shadow-secondary border border-greyOutlineSecondary bg-white"
              )}
              style={{
                width: "-webkit-fill-available",
              }}
            >
              {isLoading && (
                <div className="w-full flex justify-center">
                  <MainLoader className="size-10"/>
                </div>
              )}
              {!isLoading && !findedStores.length ? (
                <div className="">
                  <h6 className="text-sm">No stores found</h6>
                  <p className="flex items-center gap-1 text-xs text-nowrap text-ellipsis text-greyPrimary">
                    No stores found
                  </p>
                </div>
              ) : null}
              {!isLoading && !!findedStores.length && findedStores.map((c) => (
                <Link
                  key={c.id}
                  href={`/company/${toSlug(c.name)}?storeId=${c.id}`}
                  className={cn(
                    "overflow-hidden min-h-11 flex items-center gap-2 cursor-pointer rounded",
                    "hover:bg-greyBackgroundLight"
                  )}
                >
                  <div className="relative min-w-11 min-h-11 flex items-center justify-center rounded overflow-hidden bg-greyBackgroundLight">
                    {c.logo ? (
                      <Image fill src={c.logo} alt={`${c.name} | Bowers`} />
                    ) : (
                      <StoreIcon className="min-w-5 min-h-5 stroke-greyPrimary" />
                    )}
                  </div>
                  <div className="">
                    <h6 className="text-sm">
                      <HighlightText text={c.name} highlight={form.watch("search")} />
                    </h6>
                    <p className="flex items-center gap-1 text-xs text-nowrap text-ellipsis text-greyPrimary">
                      {c.city}
                      <div className="min-w-[3px] min-h-[3px] rounded bg-greyPrimary" />{" "}
                      {c.address1}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    />
  );
};

export default StoreOrServiceField;
