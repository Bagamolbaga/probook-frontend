"use client";

import { useThemeStore } from "@/src/stores/theme";
import { useStore } from "zustand";
import { useSuperAdminStore } from "@/src/stores/superAdmin";
import { useAppSession } from "@/src/hooks/useAppSession";
import CompanySelector from "../companySelector";

const MainPagesTitle = ({ text }: { text: string }) => {
  const { data: session } = useAppSession();

  const toggleOpenSidebar = useStore(useThemeStore, (st) => st.toggleOpenSidebar);
  const selectCompany = useStore(useSuperAdminStore, (st) => st.selectCompany);
  const setSelectCompany = useStore(useSuperAdminStore, (st) => st.setSelectCompany);

  return (
    <div className="flex items-center gap-5">
      <i
        className="la la-bars mr-5 cursor-pointer sm:hidden sm:pointer-events-none"
        onClick={toggleOpenSidebar}
      ></i>
      <h5 className="text-xl font-medium text-nowrap">{text}</h5>
      <CompanySelector className="sm:min-w-0 sm:max-w-[180px]" />
    </div>
  );
};

export default MainPagesTitle;
