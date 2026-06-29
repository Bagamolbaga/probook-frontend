/* eslint-disable @typescript-eslint/no-unused-vars */
// import { createStore } from "zustand";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type SuperAdminStoreState = {
  selectCompany?: TCompany;
};

export type SuperAdminStoreActions = {
  setSelectCompany: (company?: SuperAdminStoreState["selectCompany"]) => void;
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
      setSelectCompany: (company) => set((state) => ({ selectCompany: company })),
    }),
    {
      name: "super-admin-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
