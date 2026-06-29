import { useApiClient } from "@/api/context";
import {
  TGetCompanySalesAndCustomerStat,
  TGetCompanySalesAndCustomerStatRes,
} from "@/api/entities/company";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";

type CustomUseQueryOptions<TRes> = Omit<UseQueryOptions<TRes, Error>, "queryKey">;

type Options<TArgs, TRes> = {
  queryOptions?: CustomUseQueryOptions<TRes>;
} & TArgs;

export const useGetCompanySalesAndCustomerStatForAdminAppQuery = (
  options: Options<TGetCompanySalesAndCustomerStat, TGetCompanySalesAndCustomerStatRes>
) => {
  const apiClient = useApiClient();
  const { queryOptions, companyId, ...args } = options;

  const fetcherFn = async () => {
    return (
      await apiClient.admin.company.getCompanySalesAndCustomerStat({ companyId, ...args })
    ).data;
  };

  return useQuery({
    queryKey: ["sales_and_customer_stat", companyId, args.startDate, args.endDate],
    queryFn: fetcherFn,
    staleTime: 1000 * 60,
    enabled: companyId > 0,
    // ...queryOptions,
  });
};
