import { useApiClient } from "@/api/context";
import { UndefinedInitialDataOptions, useQuery } from "@tanstack/react-query";

type Options<T> = T & {
  queryOptions?: UndefinedInitialDataOptions;
};

export const useGetPaymentdetailsQuery = (options: Options<object>) => {
  const apiClient = useApiClient();
  const { queryOptions } = options;

  const fetcherFn = async () => {
    return (await apiClient.payments.getPaymentDetailsAndHistory()).data;
  };

  return useQuery({
    queryKey: ["payment_details"],
    queryFn: fetcherFn,
    staleTime: 1000 * 60,
    // ...queryOptions,
  });
};

export const useGetSubscriptionPlansQuery = (options: Options<object>) => {
  const apiClient = useApiClient();
  const { queryOptions } = options;

  const fetcherFn = async () => {
    return (await apiClient.payments.getSubscriptionPlans()).data;
  };

  return useQuery({
    queryKey: ["subscription_plans"],
    queryFn: fetcherFn,
    staleTime: 1000 * 60,
    // ...queryOptions,
  });
};