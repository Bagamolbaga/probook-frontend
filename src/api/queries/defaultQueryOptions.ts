import { QueryObserverOptions } from "@tanstack/react-query";

type GetDefaultQueryOptionsArgs = {
  companyId?: number;
};

export const getDefaultQueryOptions = ({
  companyId,
}: GetDefaultQueryOptionsArgs): Omit<QueryObserverOptions, "queryKey"> => {
  return {
    enabled: (companyId && companyId > 0) || false,
  };
};
