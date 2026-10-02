import { useStore } from "zustand";
import { useSuperAdminStore } from "@/src/stores/superAdmin";
import { getUserCompanies } from "@/src/utils/permissions";
import { useAppSession } from "./useAppSession";

type UseGetCompanyIdArgs = {
  companyId?: string;
};

export const useGetCompanyId = (options?: UseGetCompanyIdArgs) => {
  const { data: session } = useAppSession();

  const setSelectCompany = useStore(useSuperAdminStore, (st) => st.setSelectCompany);
  const activeCompanyId = useStore(useSuperAdminStore, (st) => st.activeCompanyId);
  const setActiveCompanyId = useStore(useSuperAdminStore, (st) => st.setActiveCompanyId);
  const companies = getUserCompanies(session?.user);
  const selectedCompany = companies.find((company) => company.id === activeCompanyId);

  return {
    companyId: options?.companyId || selectedCompany?.id || companies[0]?.id || "",
    setSelectCompany,
    setActiveCompanyId,
    companies,
    activeCompany: selectedCompany || companies[0] || null,
  };
};
