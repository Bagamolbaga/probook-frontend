import {
  useCreateCompanyServicesTypeQuery,
  useUpdateCompanyServicesTypeQuery,
} from "@/api/queries/company/serviceTypes";
import Button from "@/components/ui/button";
import ArrowSecondaryDownIcon from "@/components/ui/icons/ArrowSecondaryDown";
import CloseIcon from "@/components/ui/icons/Close";
import FlashIcon from "@/components/ui/icons/Flash";
import PlusRight from "@/components/ui/icons/Plus";
import TextField from "@/components/ui/inputs/TextField";
import Modal from "@/components/ui/modal";
import { useGetCompanyId } from "@/hooks/useGetCompanyId";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

type Props = {
  actionType: "create" | "update";
  isOpen?: boolean;
  headerTitle: string;
  defaultValue?: TServiceType_new;
  closeHandler: () => void;
  afterActionHandler?: (category?: TServiceType_new) => void;
};

type CategoryForm = {
  name: string;
};

const CreateUpdateServiceCategoryModal = ({
  isOpen,
  actionType,
  headerTitle,
  defaultValue,
  closeHandler,
  afterActionHandler,
}: Props) => {
  const { companyId } = useGetCompanyId();

  const form = useForm<CategoryForm>({});

  const createCompanyServicesTypeQuery = useCreateCompanyServicesTypeQuery();
  const updateCompanyServicesTypeQuery = useUpdateCompanyServicesTypeQuery();

  useEffect(() => {
    if (defaultValue) {
      form.setValue("name", defaultValue.name);
    }
  }, [defaultValue]);

  const localCloseHandler = () => {
    form.reset();
    closeHandler();
  };

  const createServiceTypeHandler = async (formData: CategoryForm) => {
    const res = await createCompanyServicesTypeQuery.mutateAsync({
      companyId,
      data: formData,
    });

    if (res.data) {
      afterActionHandler && afterActionHandler(res.data);
    }

    localCloseHandler();
  };

  const updateServiceTypeHandler = async (formData: CategoryForm) => {
    if (defaultValue) {
      const res = await updateCompanyServicesTypeQuery.mutateAsync({
        companyId,
        serviceTypeId: defaultValue.id,
        data: formData,
      });

      if (res.data) {
        afterActionHandler && afterActionHandler(res.data);
      }

      localCloseHandler();
    }
  };

  const createBtnActive = form.watch("name") && !createCompanyServicesTypeQuery.isPending;
  const updateBtnActive = form.watch("name") && !updateCompanyServicesTypeQuery.isPending;

  return (
    <Modal isOpen={!!isOpen} handleClose={closeHandler}>
      <div className="w-[620px] py-6 sm:w-full">
        <div className="px-6 flex items-center justify-between sm:px-5">
          <div className="flex items-center gap-4">
            <Button className="w-9 h-9 p-0" variant="resting" onClick={localCloseHandler}>
              <ArrowSecondaryDownIcon className="w-5 h-5 rotate-90 stroke-greyPrimary" />
            </Button>
            <h5 className="text-sm font-bold text-greyPrimary">{headerTitle}</h5>
          </div>
          <Button
            className="w-9 h-9 p-0"
            variant="resting-active"
            onClick={localCloseHandler}
          >
            <CloseIcon className="w-5 h-5 stroke-greyPrimary" />
          </Button>
        </div>

        <div className="w-full mt-12 px-6 max-h-[calc(100vh-140px)] overflow-auto sm:px-5">
          <TextField
            className="mb-2 !py-1"
            id="name"
            label={"Type of Service Category "}
            placeholder={"Name"}
            iconLeft={<FlashIcon />}
            register={form.register}
          />

          <div className="w-full mt-12 flex items-center justify-between">
            <Button variant="resting">Cancel</Button>

            {actionType === "create" && (
              <Button
                variant="dark"
                className="flex items-center gap-2"
                disabled={!createBtnActive}
                onClick={form.handleSubmit(createServiceTypeHandler)}
              >
                <PlusRight />
                Create
              </Button>
            )}
            {actionType === "update" && (
              <Button
                variant="dark"
                className="flex items-center gap-2"
                disabled={!updateBtnActive}
                onClick={form.handleSubmit(updateServiceTypeHandler)}
              >
                Update
              </Button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CreateUpdateServiceCategoryModal;
