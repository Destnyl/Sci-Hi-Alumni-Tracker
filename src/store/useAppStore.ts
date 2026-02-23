import { create } from "zustand";

export type PageRoute = "home" | "trace" | "abm" | "stem" | "researchers" | "registrar" | "login" | "alumni-registration";

interface AppState {
  isAuthenticated: boolean;
  currentPage: PageRoute;
  setAuthenticated: (value: boolean) => void;
  setCurrentPage: (page: PageRoute) => void;
}

export const useAppStore = create<AppState>((set) => ({
  isAuthenticated: false,
  currentPage: "home",
  setAuthenticated: (value) => set({ isAuthenticated: value }),
  setCurrentPage: (page) => set({ currentPage: page }),
}));
