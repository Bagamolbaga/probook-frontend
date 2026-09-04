/* eslint-disable @typescript-eslint/no-unused-vars */
// import { createStore } from "zustand";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type SuperAdminStoreState = {
  selectCompany?: TCompany;
  activeCompanyId?: string;
};

export type SuperAdminStoreActions = {
  setSelectCompany: (company?: SuperAdminStoreState["selectCompany"]) => void;
  setActiveCompanyId: (companyId?: string) => void;
};

export type SuperAdminStore = SuperAdminStoreState & SuperAdminStoreActions;

// export const initialSuperAdminStoreState: SuperAdminStoreState = {
//   sidebarIsOpen: false,
// };

// export const createSuperAdminStore = (
//   initialState: SuperAdminStoreState = initialSuperAdminStoreState
// ) => {
//   return createStore<SuperAdminStore>()((set) => ({
//     ...initialState,
//     toggleOpenSidebar: () => set((state) => ({ sidebarIsOpen: !state.sidebarIsOpen })),
//   }));
// };

export const useSuperAdminStore = create<SuperAdminStore>()(
  persist(
    (set, get) => ({
      selectCompany: undefined,
      activeCompanyId: undefined,
      setSelectCompany: (company) => set((state) => ({ selectCompany: company })),
      setActiveCompanyId: (activeCompanyId) => {
        if (typeof document !== "undefined") {
          document.cookie = activeCompanyId
            ? `active_company_id=${encodeURIComponent(activeCompanyId)}; path=/; max-age=31536000; samesite=lax`
            : "active_company_id=; path=/; max-age=0; samesite=lax";
        }
        set({ activeCompanyId });
      },
    }),
    {
      name: "super-admin-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
