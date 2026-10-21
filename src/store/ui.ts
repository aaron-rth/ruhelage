// Flüchtiger UI-Zustand, der von mehreren Stellen aus geöffnet wird (nicht gespeichert).
import { create } from 'zustand';

export const useUi = create<{ statistik: boolean; zeigeStatistik(an: boolean): void }>()((set) => ({
  statistik: false,
  zeigeStatistik: (an) => set({ statistik: an }),
}));
