import { useCreateCustomerQuery } from "@/src/api/queries/users";
import { Button } from "@/src/components/ui/button";
import CloseIcon from "@/src/components/ui/icons/Close";
import PersonIcon from "@/src/components/ui/icons/Person";
import PlusRight from "@/src/components/ui/icons/Plus";
import PhoneTextInput from "@/src/components/ui/inputs/PhoneTextInput";
import TextField from "@/src/components/ui/inputs/TextField";
import Modal from "@/src/components/ui/modal";
import { toaster } from "@/src/components/ui/toaster";
import { useGetCompanyId } from "@/src/hooks/useGetCompanyId";
import { EMAIL_REGEXP } from "@/src/utils/regexps";
import { useTranslations } from "next-intl";
import { FC, ReactNode, useEffect } from "react";
import { useForm } from "react-hook-form";
import { isPossiblePhoneNumber, parsePhoneNumber } from "react-phone-number-input";

export type CreateCustomerForm = {
  name: string;
  phone?: string;
  email?: string;
};

type Props = {
  isOpen: boolean;
  headerTitle: string;
  handleClose: () => void;
};

const CreateCustomerModal: FC<Props> = ({ isOpen, headerTitle, handleClose }) => {
  const t = useTranslations();
  const { companyId } = useGetCompanyId();

  const form = useForm<CreateCustomerForm>({
    defaultValues: {
      name: "",
      phone: "",
    },
  });

  const createCustomerQuery = useCreateCustomerQuery();

  useEffect(() => {
    if (form.watch("phone")?.length) {
      form.setValue("email", "");
    }
  }, [form.watch("phone")]);

  useEffect(() => {
    if (form.watch("email")?.length) {
      form.setValue("phone", "");
    }
  }, [form.watch("email")]);

  const createCustomerWithPhoneHandler = async (formData: CreateCustomerForm) => {
    try {
      if (!isPossiblePhoneNumber(formData.phone!)) {
        form.setError("phone", { type: "validate", message: "Phone is not valid" });
      } else {
        const parsedPhone = parsePhoneNumber(formData.phone!);
        const phone = parsedPhone?.number;

        if (phone) {
          const res = await createCustomerQuery.mutateAsync({
            companyId,
            data: {
              first_name: formData.name,
              last_name: formData.name,
              phone,
            },
          });

          if (res.data) {
            form.reset();

            toaster.success("Customer created successfully");
          }
        }
      }
    } catch (error) {
      toaster.error(t("ui.errors.wentWrong"));
    }
  };

  const createCustomerWithEmailHandler = async (formData: CreateCustomerForm) => {
    try {
      if (formData.email) {
        const res = await createCustomerQuery.mutateAsync({
          companyId,
          data: {
            first_name: formData.name,
            last_name: formData.name,
            email: formData.email,
          },
        });

        if (res.data) {
          form.reset();

          toaster.success("Customer created successfully");
        }
      }
    } catch (error) {
      toaster.error(t("ui.errors.wentWrong"));
    }
  };

  const createCustomerHandler = async (formData: CreateCustomerForm) => {
    if (formData.phone) {
      await createCustomerWithPhoneHandler(formData);
    } else {
      await createCustomerWithEmailHandler(formData);
    }

    localCloseHandler();
  };

  const localCloseHandler = () => {
    form.reset();
    handleClose();
  };

  return (
    <Modal isOpen={isOpen} handleClose={localCloseHandler}>
      <div className="w-[620px] p-6 sm:w-full sm:p-5">
        <div className="flex items-center justify-between">
          <h5 className="text-sm font-bold text-greyPrimary">{headerTitle}</h5>
          <div className="flex items-center gap-4">
            <Button
              className="w-9 h-9 p-0"
              variant="outline"
              onClick={localCloseHandler}
            >
              <CloseIcon className="w-5 h-5 stroke-greyPrimary" />
            </Button>
          </div>
        </div>

        <div className="mt-5">
          <p className="mb-2 text-sm text-greyPrimary">
            {t("customerDatabase.createUpdateModal.name.label")}{" "}
            <span className="text-redPrimary">*</span>
          </p>
          <TextField
            className="px-3 rounded-xl border border-greyOutline"
            id="name"
            placeholder={t("customerDatabase.createUpdateModal.name.placeholder")}
            register={form.register}
            error={form.formState.errors.name}
            rules={{
              required: t("ui.errors.fieldIsRequired"),
            }}
            showError
            highlightFullBorderWhenFocus
            iconLeft={<PersonIcon />}
          />

          <p className="mt-3 mb-2 text-sm text-greyPrimary">
            {t("customerDatabase.createUpdateModal.phone.label")}
          </p>
          <PhoneTextInput
            className="py-[6px]"
            id="phone"
            setValue={(value: string) => form.setValue("phone", value)}
            register={form.register}
            error={form.formState.errors.phone}
          />

          <div className="w-full my-5 flex items-center justify-center">
            <div className="flex-1 h-[1px] bg-greyOutlineSecondary"></div>
            <p className="text-sm font-bold text-greyPrimary">Or</p>
            <div className="flex-1 h-[1px] bg-greyOutlineSecondary"></div>
          </div>

          <p className="mt-3 mb-2 text-sm text-greyPrimary">{t("ui.labels.email")}</p>
          <TextField
            className="px-3 rounded-xl border border-greyOutline"
            id="email"
            register={form.register}
            error={form.formState.errors.email}
            rules={{
              pattern: EMAIL_REGEXP,
            }}
            showError
            highlightFullBorderWhenFocus
            iconLeft={<PersonIcon />}
          />
        </div>
      </div>

      <div className="mt-5 p-6 flex items-center justify-between gap-5">
        <Button variant="outline" onClick={localCloseHandler}>
          {t("ui.actions.cancel")}
        </Button>
        <Button
          className="flex items-center gap-3"
          variant="outline"
          onClick={form.handleSubmit(createCustomerHandler)}
          disabled={createCustomerQuery.isPending}
        >
          <PlusRight />
          <p className="text-sm text-white ">{t("customerDatabase.createNewBtn")}</p>
        </Button>
      </div>
    </Modal>
  );
};

export default CreateCustomerModal;
