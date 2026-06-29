import ArrowSecondaryDownIcon from "@/components/ui/icons/ArrowSecondaryDown";
import CustomSelect from "@/components/ui/inputs/Select";
import { FormControl, MenuItem } from "@mui/material";
import { Controller, UseFormReturn } from "react-hook-form";
import { CreateServiceForm } from "..";
import {
  useDeleteCompanyServicesTypeQuery,
  useGetCompanyServicesTypesQuery,
} from "@/api/queries/company/serviceTypes";
import { useMemo, useState } from "react";
import CreateUpdateServiceCategoryModal from "../../createCategoryModal";
import EditIcon from "@/components/ui/icons/Edit";
import DeleteIcon from "@/components/ui/icons/Delete";

type Props = {
  companyId: string;
  form: UseFormReturn<CreateServiceForm>;
};

const SelectCategory = ({ companyId, form }: Props) => {
  const [isOpenCategoryModal, setIsOpenCategoryModal] = useState(false);
  const [selectedCategoryForUpdate, setSelectedCategoryForUpdate] =
    useState<TServiceType_new>();

  const getCompanyServicesTypesQuery = useGetCompanyServicesTypesQuery({
    companyId,
  });

  const deleteCompanyServicesTypeQuery = useDeleteCompanyServicesTypeQuery();

  const serviceTypes = useMemo(() => {
    if (getCompanyServicesTypesQuery.data?.results) {
      return getCompanyServicesTypesQuery.data.results;
    }

    return [];
  }, [getCompanyServicesTypesQuery.data]);

  const openCategoryModalHander = (category?: TServiceType_new) => {
    setSelectedCategoryForUpdate(category);
    setIsOpenCategoryModal(true);
  };

  const closeCategoryModalHander = () => {
    setIsOpenCategoryModal(false);
  };

  const deleteCategoryHandler = async (serviceTypeId: TServiceType_new["id"]) => {
    void deleteCompanyServicesTypeQuery.mutateAsync({
      companyId,
      serviceTypeId,
    });

    if (form.getValues("service_type.id") === serviceTypeId) {
      form.setValue("service_type", undefined);
    }
  };

  const afterCreateCategoryHandler = (category?: TServiceType_new) => {
    if (category) {
      form.setValue("service_type", category);
      void getCompanyServicesTypesQuery.refetch();
    }
  };

  const afterUpdateCategoryHandler = (category?: TServiceType_new) => {
    if (category) {
      form.setValue("service_type", category);
      void getCompanyServicesTypesQuery.refetch();
    }
  };

  return (
    <div>
      <CreateUpdateServiceCategoryModal
        isOpen={isOpenCategoryModal}
        actionType="create"
        headerTitle={"Add Service Category"}
        closeHandler={closeCategoryModalHander}
        afterActionHandler={afterCreateCategoryHandler}
      />
      <CreateUpdateServiceCategoryModal
        isOpen={Boolean(isOpenCategoryModal && selectedCategoryForUpdate)}
        defaultValue={selectedCategoryForUpdate}
        actionType="update"
        headerTitle={"Add Service Category"}
        closeHandler={closeCategoryModalHander}
        afterActionHandler={afterUpdateCategoryHandler}
      />
      <FormControl fullWidth>
        <p className="mb-2 text-sm text-greyPrimary">Service Category</p>
        <Controller
          render={({ field, formState }) => {
            return (
              <CustomSelect
                IconComponent={ArrowSecondaryDownIcon}
                id={"service_type"}
                {...field}
                value={form.watch("service_type")?.name}
                onChange={(e) => {
                  field.onChange(serviceTypes.find((i) => i.name === e.target.value));
                }}
                renderValue={(value) => <p>{value as TServiceType_new["name"]}</p>}
              >
                {serviceTypes.map((st) => (
                  <MenuItem
                    key={st.name}
                    value={st.name}
                    className="w-full flex !items-center !justify-between"
                  >
                    {st.name}
                    <div className="flex items-center">
                      <div
                        className="ml-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          openCategoryModalHander(st);
                        }}
                      >
                        <EditIcon className="cursor-pointer transition-all hover:stroke-purplePrimary" />
                      </div>
                      <div
                        className="ml-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          void deleteCategoryHandler(st.id);
                        }}
                      >
                        <DeleteIcon className="cursor-pointer transition-all hover:stroke-redPrimary" />
                      </div>
                    </div>
                  </MenuItem>
                ))}
              </CustomSelect>
            );
          }}
          name="service_type"
          control={form.control}
        />
      </FormControl>
      <p
        className="mt-3 text-xs font-extrabold uppercase cursor-pointer text-purplePrimary"
        onClick={() => openCategoryModalHander()}
      >
        add new category
      </p>
    </div>
  );
};

export default SelectCategory;
