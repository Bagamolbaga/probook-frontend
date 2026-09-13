import { QueryClient } from "@tanstack/react-query";
import type { CompanyDataType } from "@/api/entities/realtime";

const COMPANY_DATA_QUERY_KEYS: Record<CompanyDataType, string[]> = {
  specialists: ["specialists", "services", "booking_availability"],
  shifts: ["shifts", "operation_hour_shifts", "booking_availability"],
  services: ["services", "specialists"],
};

export const invalidateCompanyDataQueries = (
  queryClient: QueryClient,
  companyId: string,
  entity: CompanyDataType
) =>
  Promise.all(
    COMPANY_DATA_QUERY_KEYS[entity].map((queryKey) =>
      queryClient.invalidateQueries({ queryKey: [queryKey, companyId] })
    )
  );
