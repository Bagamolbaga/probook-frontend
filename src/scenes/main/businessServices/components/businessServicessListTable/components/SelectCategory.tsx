import ArrowSecondaryDownIcon from "@/components/ui/icons/ArrowSecondaryDown";
import CustomSelect from "@/components/ui/inputs/Select";
import { FormControl, MenuItem } from "@mui/material";
import { Controller, UseFormReturn } from "react-hook-form";
import { CreateServiceForm } from "..";
import { useState } from "react";
import CreateUpdateServiceCategoryModal from "../../createCategoryModal";
import EditIcon from "@/components/ui/icons/Edit";
import DeleteIcon from "@/components/ui/icons/Delete";
import { useDeleteCompanyServiceCategoryQuery } from "@/api/queries/company/serviceCategories";
import { toaster } from "@/components/ui/toaster";
import { AxiosError } from "axios";

type Props = {
  companyId: string;
  form: UseFormReturn<CreateServiceForm>;
  categories: TServiceCategory[];
};

type ApiError = {
  message?: string | string[];
};

const getErrorMessage = (error: unknown) => {
  const message = (error as AxiosError<ApiError>).response?.data?.message;

  return Array.isArray(message) ? message.join(", ") : message;
};

const SelectCategory = ({ companyId, form, categories }: Props) => {
  const [isOpenCategoryModal, setIsOpenCategoryModal] = useState(false);
  const [selectedCategoryForUpdate, setSelectedCategoryForUpdate] =
    useState<TServiceCategory>();

  const deleteCompanyServiceCategoryQuery = useDeleteCompanyServiceCategoryQuery();

  const openCategoryModalHandler = (category?: TServiceCategory) => {
    setSelectedCategoryForUpdate(category);
    setIsOpenCategoryModal(true);
  };

  const closeCategoryModalHandler = () => {
    setSelectedCategoryForUpdate(undefined);
    setIsOpenCategoryModal(false);
  };

  const deleteCategoryHandler = async (categoryId: TServiceCategory["id"]) => {
    try {
      await deleteCompanyServiceCategoryQuery.mutateAsync({
        companyId,
        categoryId,
      });

      if (form.getValues("category")?.id === categoryId) {
        form.setValue("category", null, { shouldValidate: true });
      }
    } catch (error) {
      toaster.error(getErrorMessage(error) || "Could not delete category");
    }
  };

  const afterCreateCategoryHandler = (category?: TServiceCategory) => {
    if (category) {
      form.setValue("category", category, { shouldValidate: true });
    }
  };

  const afterUpdateCategoryHandler = (category?: TServiceCategory) => {
    if (category) {
      form.setValue("category", category, { shouldValidate: true });
    }
  };

  return (
    <div>
      <CreateUpdateServiceCategoryModal
        isOpen={isOpenCategoryModal}
        actionType={selectedCategoryForUpdate ? "update" : "create"}
        defaultValue={selectedCategoryForUpdate}
        headerTitle={
          selectedCategoryForUpdate ? "Update Service Category" : "Add Service Category"
        }
        closeHandler={closeCategoryModalHandler}
        afterActionHandler={
          selectedCategoryForUpdate
            ? afterUpdateCategoryHandler
            : afterCreateCategoryHandler
        }
      />
      <FormControl fullWidth>
        <p className="mb-2 text-sm text-greyPrimary">Service Category</p>
        <Controller
          render={({ field }) => {
            return (
              <CustomSelect
                IconComponent={ArrowSecondaryDownIcon}
                id="category"
                {...field}
                value={field.value?.id || ""}
                onChange={(e) => {
                  field.onChange(
                    categories.find((category) => category.id === e.target.value) || null
                  );
                }}
                renderValue={(value) => (
                  <p>{categories.find((category) => category.id === value)?.name}</p>
                )}
              >
                {categories.map((category) => (
                  <MenuItem
                    key={category.id}
                    value={category.id}
                    className="w-full flex !items-center !justify-between"
                  >
                    {category.name}
                    {!category.isGlobal && category.company !== null ? (
                      <div className="flex items-center">
                        <div
                          className="ml-2"
                          onClick={(event) => {
                            event.stopPropagation();
                            openCategoryModalHandler(category);
                          }}
                        >
                          <EditIcon className="cursor-pointer transition-all hover:stroke-purplePrimary" />
                        </div>
                        <div
                          className="ml-2"
                          onClick={(event) => {
                            event.stopPropagation();
                            void deleteCategoryHandler(category.id);
                          }}
                        >
                          <DeleteIcon className="cursor-pointer transition-all hover:stroke-redPrimary" />
                        </div>
                      </div>
                    ) : null}
                  </MenuItem>
                ))}
              </CustomSelect>
            );
          }}
          name="category"
          control={form.control}
          rules={{ required: true }}
        />
      </FormControl>
      <p
        className="mt-3 text-xs font-extrabold uppercase cursor-pointer text-purplePrimary"
        onClick={() => openCategoryModalHandler()}
      >
        add new category
      </p>
    </div>
  );
};

export default SelectCategory;
