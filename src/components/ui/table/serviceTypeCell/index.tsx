/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { FC } from "react";
import { useGetCompanyServicesTypesQuery } from "@/api/queries/company/serviceTypes";
import { useGetCompanyId } from "@/hooks/useGetCompanyId";
import { useTranslations } from "next-intl";

type Props = {
  serviceTypeId: string;
};

const ServiceTypeCell: FC<Props> = ({ serviceTypeId }) => {
  const t = useTranslations();
  const { companyId } = useGetCompanyId();
  const getCompanyServicesTypesQuery = useGetCompanyServicesTypesQuery({ companyId });

  const findedType = (getCompanyServicesTypesQuery.data?.results || []).find(
    (s) => s.name === serviceTypeId
  );

  if (findedType) {
    return (
      <div className="h-full flex items-center gap-2">
        <p>{findedType.name}</p>
      </div>
    );
  }

  return <div>{t("ui.components.serviceTypeCell.notFound")}</div>;
};

export default ServiceTypeCell;
