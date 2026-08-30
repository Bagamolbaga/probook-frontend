import { useStore } from "zustand";
import { useSuperAdminStore } from "@/stores/superAdmin";
import { useAppSession } from "./useAppSession";

type UseGetCompanyIdArgs = {
  companyId?: string;
};

export const useGetCompanyId = (options?: UseGetCompanyIdArgs) => {
  const { data: session } = useAppSession();

  const selectCompany = useStore(useSuperAdminStore, (st) => st.selectCompany);
  const setSelectCompany = useStore(useSuperAdminStore, (st) => st.setSelectCompany);
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
      sessionCompanyId || "",
    setSelectCompany,
  };
};
