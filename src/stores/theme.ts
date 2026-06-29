/* eslint-disable @typescript-eslint/no-unused-vars */
// import { createStore } from "zustand";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type ThemeStoreState = {
  sidebarIsOpen: boolean;
};

export type ThemeStoreActions = {
  toggleOpenSidebar: () => void;
};

export type ThemeStore = ThemeStoreState & ThemeStoreActions;

// export const initialThemeStoreState: ThemeStoreState = {
//   sidebarIsOpen: false,
// };

// export const createThemeStore = (
//   initialState: ThemeStoreState = initialThemeStoreState
// ) => {
//   return createStore<ThemeStore>()((set) => ({
//     ...initialState,
//     toggleOpenSidebar: () => set((state) => ({ sidebarIsOpen: !state.sidebarIsOpen })),
//   }));
// };

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      sidebarIsOpen: true,
      toggleOpenSidebar: () => set((state) => ({ sidebarIsOpen: !state.sidebarIsOpen })),
      // toggleOpenSidebar: () => set((state) => ({ sidebarIsOpen: state.sidebarIsOpen })),
    }),
    {
      name: "theme-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
