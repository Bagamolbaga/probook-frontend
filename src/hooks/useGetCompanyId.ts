import { useStore } from "zustand";
import { useSuperAdminStore } from "@/stores/superAdmin";
import { useAppSession } from "./useAppSession";

type UseGetCompanyIdArgs = {
  companyId?: number;
};

export const useGetCompanyId = (options?: UseGetCompanyIdArgs) => {
  const { data: session } = useAppSession();

  const selectCompany = useStore(useSuperAdminStore, (st) => st.selectCompany);
  const setSelectCompany = useStore(useSuperAdminStore, (st) => st.setSelectCompany);

  return {
    companyId: localStorage.getItem("companyId") || "69659c81f8f44cd8cda03ac8",
    setSelectCompany,
  };
};
