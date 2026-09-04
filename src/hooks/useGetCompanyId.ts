import { useStore } from "zustand";
import { useSuperAdminStore } from "@/stores/superAdmin";
import { getUserCompanies } from "@/utils/permissions";
import { useAppSession } from "./useAppSession";

type UseGetCompanyIdArgs = {
  companyId?: string;
};

export const useGetCompanyId = (options?: UseGetCompanyIdArgs) => {
  const { data: session } = useAppSession();

  console.log({session})

  const setSelectCompany = useStore(useSuperAdminStore, (st) => st.setSelectCompany);
  const activeCompanyId = useStore(useSuperAdminStore, (st) => st.activeCompanyId);
  const setActiveCompanyId = useStore(useSuperAdminStore, (st) => st.setActiveCompanyId);
  const companies = getUserCompanies(session?.user);
  const selectedCompany = companies.find((company) => company.id === activeCompanyId);
  const sessionCompany = session?.user?.company;
  const sessionCompanyId =
    typeof sessionCompany === "string"
      ? sessionCompany
      : sessionCompany && typeof sessionCompany === "object" && "id" in sessionCompany
        ? String(sessionCompany.id)
        : null;

  return {
    companyId:
      options?.companyId ||
      selectedCompany?.id ||
      companies[0]?.id ||
      sessionCompanyId ||
      "",
    setSelectCompany,
    setActiveCompanyId,
    companies,
    activeCompany: selectedCompany || companies[0] || null,
  };
};
