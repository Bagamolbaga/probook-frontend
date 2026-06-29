/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import React, { FC, ReactNode, useEffect, useMemo, useState } from "react";
import { Controller, UseFormReturn } from "react-hook-form";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Checkbox, FormControl, FormControlLabel, MenuItem } from "@mui/material";

import Button from "@/components/ui/button";
import TextField from "@/components/ui/inputs/TextField";
import Modal from "@/components/ui/modal";
import { CreateServiceForm } from "..";
import PersonIcon from "@/components/ui/icons/Person";
import FileUploadButton from "@/components/ui/button/FileUploadButton";
import { useCreateCompanyServiceQuery } from "@/api/queries/company/services";
import { useGetCompanyServicesTypesQuery } from "@/api/queries/company/serviceTypes";
import EmployeeIcon from "@/components/ui/icons/Employee";
import FlashIcon from "@/components/ui/icons/Flash";
import ClockIcon from "@/components/ui/icons/Clock";
import MoneyIcon from "@/components/ui/icons/Money";
import CloseIcon from "@/components/ui/icons/Close";
import { SERVICE_TYPES, SERVICE_TYPES_ENUM } from "@/constants/serviceTypes";
import AppSelect from "@/components/ui/inputs/AppSelect";
import FilterVerticalIcon from "@/components/ui/icons/FilterVertical";
import { Switch } from "@/components/ui/inputs/Switch";
import { cn } from "@/utils/cn";
import ServiceVariants from "./ServiceVariants";
import { useGetCompanyId } from "@/hooks/useGetCompanyId";
import PaperIcon from "@/components/ui/icons/Paper";
import NoteIcon from "@/components/ui/icons/Note";
import CustomSelect from "@/components/ui/inputs/Select";
import ArrowSecondaryDownIcon from "@/components/ui/icons/ArrowSecondaryDown";
import CreateUpdateServiceCategoryModal from "../../createCategoryModal";
import SelectCategory from "./SelectCategory";

type Props = {
  isUpdate?: boolean;
  isOpen: boolean;
  headerTitle: string;
  form: UseFormReturn<CreateServiceForm>;
  staffs: TSpecialist[];
  actionButton: ReactNode;
  handleClose: () => void;
};

const CreateUpdateServiceModal_123: FC<Props> = ({
  isUpdate,
  isOpen,
  headerTitle,
  form,
  staffs,
  actionButton,
  handleClose,
}) => {
  const t = useTranslations();
  const { companyId } = useGetCompanyId();

  const createCompanyServiceQuery = useCreateCompanyServiceQuery();

  const staffAssigneed = useMemo(() => {
    const staffs = form.watch("specialists");
    return staffs;
  }, [form.watch("specialists")]);

  const staffOptions = useMemo(() => staffs, [staffs]);

  const localCloseHandler = () => {
    form.reset();
    handleClose();
  };

  const isShowSpecialists = form.watch("showSpecialists");
  const isFeatured = form.watch("featured");

  const handleToggleSelectAny = () => {
    const prev = isShowSpecialists;
    form.setValue("showSpecialists", !prev);
  };

  const handleToggleSelectAll = () => {
    const isSameLength = staffOptions.length === staffAssigneed.length;

    if (isSameLength) {
      form.setValue("specialists", []);
    } else {
      form.setValue("specialists", staffs);
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} handleClose={localCloseHandler}>
        <div className="w-[620px] py-6 sm:w-full">
          <div className="px-6 flex items-center justify-between sm:px-5">
            <h5 className="text-sm font-bold text-greyPrimary">{headerTitle}</h5>
            <div className="flex items-center gap-4">
              <Button
                className="w-9 h-9 p-0"
                variant="resting-active"
                onClick={localCloseHandler}
              >
                <CloseIcon className="w-5 h-5 stroke-greyPrimary" />
              </Button>
            </div>
          </div>

          <div className="w-full px-6 max-h-[calc(100vh-140px)] overflow-auto sm:px-5">
            <div className="mt-5">
              <div className="w-full">
                <TextField
                  className="mb-2 !py-1"
                  id="name"
                  label={t("businessServices.createUpdateModal.name.label")}
                  placeholder={t("businessServices.createUpdateModal.name.placeholder")}
                  iconLeft={<FlashIcon />}
                  register={form.register}
                />
              </div>

              <div className="mt-5">
                <SelectCategory companyId={companyId} form={form} />
              </div>

              <div className="mt-5 flex justify-between gap-5">
                <FormControlLabel
                  className="!ml-0"
                  checked={isFeatured}
                  labelPlacement="start"
                  label={
                    <p className="mr-2 text-sm text-greyPrimary">Mark as Featured</p>
                  }
                  control={<Switch {...form.register("featured")} />}
                />
              </div>

              <div className="w-full mt-5">
                <TextField
                  className="mb-2 !py-1"
                  id="description"
                  label={"Description"}
                  placeholder={"Enter Description"}
                  iconLeft={<NoteIcon />}
                  register={form.register}
                />

                <div>
                  <ServiceVariants form={form} />
                </div>
                <div className="mt-5 flex justify-between gap-5">
                  <FormControlLabel
                    className="!ml-0"
                    checked={isShowSpecialists}
                    labelPlacement="start"
                    label={
                      <p className="mr-2 text-sm text-greyPrimary">
                        Display Professional Profile
                      </p>
                    }
                    control={<Switch onClick={handleToggleSelectAny} />}
                  />
                </div>

                <div className="mt-5 flex justify-between gap-5">
                  <FormControl fullWidth>
                    <p className="mb-2 text-sm text-greyPrimary">
                      {t("businessServices.createUpdateModal.staff.label")}
                    </p>
                    <Controller
                      render={({ field, formState }) => {
                        return (
                          <AppSelect
                            multiple
                            classNames={{
                              container: "!py-0",
                              selectContainer: "w-full",
                            }}
                            selectDropdownPosition="top"
                            id="specialists"
                            variant="no-border"
                            options={[{ id: "all_staff" } as const, ...staffOptions]}
                            setValue={form.setValue}
                            selectedOption={form.watch("specialists")}
                            renderLeftIcon={() => (
                              <EmployeeIcon className="min-w-5 stroke-darkPrimary" />
                            )}
                            renderOption={(option) => {
                              if (option.id === "all_staff") {
                                return (
                                  <div
                                    className="flex items-center gap-2"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleToggleSelectAll();
                                    }}
                                  >
                                    <Checkbox
                                      className="w-4 h-4"
                                      checked={
                                        staffAssigneed.length === staffOptions.length
                                      }
                                    />
                                    <div className="w-5 h-5 rounded overflow-hidden">
                                      <div className="w-full h-full flex items-center justify-center bg-purpleLightSecondary">
                                        <PersonIcon className="w-3 h-3 stroke-blueDark" />
                                      </div>
                                    </div>
                                    All staff
                                  </div>
                                );
                              }

                              option = option as TSpecialist;

                              return (
                                <div className="flex items-center gap-2">
                                  <Checkbox
                                    className="w-4 h-4"
                                    checked={
                                      !!staffAssigneed.find((s) => s.id === option.id)
                                    }
                                  />
                                  <div className="relative w-5 h-5 rounded overflow-hidden">
                                    {option.avatar ? (
                                      <Image
                                        className="w-full h-full object-cover"
                                        fill
                                        src={option.avatar}
                                        alt={option.fullName}
                                      />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center bg-purpleLightSecondary">
                                        <PersonIcon className="w-3 h-3 stroke-blueDark" />
                                      </div>
                                    )}
                                  </div>
                                  {option.fullName}
                                </div>
                              );
                            }}
                            renderOptionSelected={(option) => {
                              if (!option?.length) {
                                return (
                                  <div className="flex items-center gap-2 text-greyPrimary">
                                    {/* <EmployeeIcon className="stroke-darkPrimary" /> */}
                                    {t(
                                      "businessServices.createUpdateModal.staff.placeholder"
                                    )}
                                  </div>
                                );
                              }
                              return (
                                <div className="flex items-center gap-2">
                                  {/* <EmployeeIcon className="stroke-darkPrimary" /> */}
                                  <div className="flex items-center gap-2">
                                    {staffAssigneed.map((item) => (
                                      <div
                                        key={item.id}
                                        className="relative w-6 h-6 rounded overflow-hidden"
                                      >
                                        {item.avatar ? (
                                          <Image
                                            className="w-full h-full object-cover"
                                            fill
                                            src={item.avatar}
                                            alt={item.fullName}
                                          />
                                        ) : (
                                          <div className="w-full h-full flex items-center justify-center bg-purpleLightSecondary">
                                            <PersonIcon className="w-3 h-3 stroke-blueDark" />
                                          </div>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              );
                            }}
                          />
                        );
                      }}
                      name="specialists"
                      control={form.control}
                      rules={{ required: true }}
                    />
                  </FormControl>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between gap-5">
                <Button
                  variant="resting"
                  onClick={localCloseHandler}
                  disabled={createCompanyServiceQuery.isPending}
                >
                  {t("ui.actions.cancel")}
                </Button>
                {actionButton}
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default CreateUpdateServiceModal_123;
