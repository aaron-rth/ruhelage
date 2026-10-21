// Flüchtiger UI-Zustand, der von mehreren Stellen aus geöffnet wird (nicht gespeichert).
import { useEffect } from 'react';
import { create } from 'zustand';

export const useUi = create<{
  statistik: boolean;
  zeigeStatistik(an: boolean): void;
  /** Anzahl gerade sichtbarer Lernaktivitäten (Karten, Übungen, Aufgaben, Klausur) */
  lernen: number;
}>()((set) => ({
  statistik: false,
  zeigeStatistik: (an) => set({ statistik: an }),
  lernen: 0,
}));

/** Markiert eine Komponente als „hier wird gelernt“ – nur dann läuft die Lernzeit. */
export function useLernaktivitaet(an = true) {
  useEffect(() => {
    if (!an) return;
    useUi.setState((s) => ({ lernen: s.lernen + 1 }));
    return () => useUi.setState((s) => ({ lernen: Math.max(0, s.lernen - 1) }));
  }, [an]);
}
