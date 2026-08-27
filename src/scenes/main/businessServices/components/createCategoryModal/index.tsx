import {
  useCreateCompanyServiceCategoryQuery,
  useUpdateCompanyServiceCategoryQuery,
} from "@/api/queries/company/serviceCategories";
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
import { toaster } from "@/components/ui/toaster";
import { AxiosError } from "axios";

type Props = {
  actionType: "create" | "update";
  isOpen?: boolean;
  headerTitle: string;
  defaultValue?: TServiceCategory;
  closeHandler: () => void;
  afterActionHandler?: (category?: TServiceCategory) => void;
};

type CategoryForm = {
  name: string;
};

type ApiError = {
  message?: string | string[];
};

const getErrorMessage = (error: unknown) => {
  const message = (error as AxiosError<ApiError>).response?.data?.message;

  return Array.isArray(message) ? message.join(", ") : message;
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

  const createCompanyServiceCategoryQuery = useCreateCompanyServiceCategoryQuery();
  const updateCompanyServiceCategoryQuery = useUpdateCompanyServiceCategoryQuery();

  useEffect(() => {
    form.reset({ name: defaultValue?.name || "" });
  }, [defaultValue, form, isOpen]);

  const localCloseHandler = () => {
    form.reset();
    closeHandler();
  };

  const createServiceTypeHandler = async (formData: CategoryForm) => {
    try {
      const res = await createCompanyServiceCategoryQuery.mutateAsync({
        companyId,
        data: formData,
      });

      if (res.data) {
        afterActionHandler?.(res.data);
      }

      localCloseHandler();
    } catch (error) {
      toaster.error(getErrorMessage(error) || "Could not create category");
    }
  };

  const updateServiceTypeHandler = async (formData: CategoryForm) => {
    if (defaultValue) {
      try {
        const res = await updateCompanyServiceCategoryQuery.mutateAsync({
          companyId,
          categoryId: defaultValue.id,
          data: formData,
        });

        if (res.data) {
          afterActionHandler?.(res.data);
        }

        localCloseHandler();
      } catch (error) {
        toaster.error(getErrorMessage(error) || "Could not update category");
      }
    }
  };

  const createBtnActive =
    (form.watch("name") || "").trim().length > 0 &&
    !createCompanyServiceCategoryQuery.isPending;
  const updateBtnActive =
    (form.watch("name") || "").trim().length > 0 &&
    !updateCompanyServiceCategoryQuery.isPending;

  return (
    <Modal isOpen={!!isOpen} handleClose={localCloseHandler}>
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
            rules={{ required: true, maxLength: 255 }}
          />

          <div className="w-full mt-12 flex items-center justify-between">
            <Button variant="resting" onClick={localCloseHandler}>
              Cancel
            </Button>

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
