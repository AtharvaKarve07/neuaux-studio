import { create } from "zustand";

interface UiState {
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  toggleMenu: () => void;
}

export const useUi = create<UiState>((set) => ({
  menuOpen: false,
  setMenuOpen: (menuOpen) => set({ menuOpen }),
  toggleMenu: () => set((state) => ({ menuOpen: !state.menuOpen })),
}));
