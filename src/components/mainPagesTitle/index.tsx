"use client";

import { useThemeStore } from "@/stores/theme";
import { useStore } from "zustand";
import { useSuperAdminStore } from "@/stores/superAdmin";
import { useAppSession } from "@/hooks/useAppSession";
import Badge from "../ui/badge";

const MainPagesTitle = ({ text }: { text: string }) => {
  const { data: session } = useAppSession();

  const toggleOpenSidebar = useStore(useThemeStore, (st) => st.toggleOpenSidebar);
  const selectCompany = useStore(useSuperAdminStore, (st) => st.selectCompany);
  const setSelectCompany = useStore(useSuperAdminStore, (st) => st.setSelectCompany);

  return (
    <div className="flex items-center gap-5">
      <i className="la la-bars mr-5 cursor-pointer sm:hidden sm:pointer-events-none" onClick={toggleOpenSidebar}></i>
      <h5 className="text-xl font-bold text-nowrap">{text}</h5>
      {session?.user?.is_superuser && (
        <Badge
          className="cursor-pointer transition-all border border-transparent hover:border-purplePrimary"
          variant="secondary"
          textBold
          onClick={() => setSelectCompany(undefined)}
        >
          {selectCompany ? selectCompany?.name : "Select salon"}
        </Badge>
      )}
    </div>
  );
};

export default MainPagesTitle;
