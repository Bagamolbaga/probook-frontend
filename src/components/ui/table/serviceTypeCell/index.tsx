/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { FC } from "react";
import {
  useGetCompanyServicesTypesQuery,
} from "@/api/queries/company/serviceTypes";
import { useGetCompanyId } from "@/hooks/useGetCompanyId";

type Props = {
  serviceTypeId: string;
};

const ServiceTypeCell: FC<Props> = ({ serviceTypeId }) => {
  const {companyId} = useGetCompanyId()
  const getCompanyServicesTypesQuery = useGetCompanyServicesTypesQuery({companyId});

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

  return <div>Not found type</div>;
};

export default ServiceTypeCell;
