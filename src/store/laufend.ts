// Angefangene Sachen: Sitzungsstände, offene Aufgaben und die Liste für „Aktuell“.
// Eigener Speicher, damit der eigentliche Lernfortschritt (Export/Import) schlank bleibt.
import { useCallback } from 'react';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type AktuellArt = 'heute' | 'karten' | 'nochmal' | 'uebungen' | 'rechnen' | 'lesen' | 'mischung';

export interface AktuellEintrag {
  key: string;
  art: AktuellArt;
  titel: string;
  /** z. B. „Karte 7 von 26“ */
  stand?: string;
  /** 0–1 für den Fortschrittsbalken */
  anteil?: number;
  pfad: string;
  zeit: number;
}

interface Gemerkt {
  wert: unknown;
  zeit: number;
}

interface LaufendStore {
  merk: Record<string, Gemerkt>;
  aktuell: Record<string, AktuellEintrag>;
  merke(key: string, wert: unknown): void;
  vergiss(praefix: string): void;
  setzeAktuell(e: Omit<AktuellEintrag, 'zeit'>): void;
  entferneAktuell(key: string): void;
}

const MAX_MERK = 60;
const MAX_ALTER_MS = 14 * 24 * 3600 * 1000;

function aufraeumen(merk: Record<string, Gemerkt>): Record<string, Gemerkt> {
  const jetzt = Date.now();
  const eintraege = Object.entries(merk)
    .filter(([, g]) => jetzt - g.zeit < MAX_ALTER_MS)
    .sort((a, b) => b[1].zeit - a[1].zeit)
    .slice(0, MAX_MERK);
  return Object.fromEntries(eintraege);
}

const speicher = createJSONStorage(() => {
  try {
    localStorage.setItem('__ruhelage_test__', '1');
    localStorage.removeItem('__ruhelage_test__');
    return localStorage;
  } catch {
    const mem = new Map<string, string>();
    return {
      getItem: (k: string) => mem.get(k) ?? null,
      setItem: (k: string, v: string) => void mem.set(k, v),
      removeItem: (k: string) => void mem.delete(k),
    };
  }
});

export const useLaufend = create<LaufendStore>()(
  persist(
    (set) => ({
      merk: {},
      aktuell: {},
      merke: (key, wert) => set((s) => ({ merk: aufraeumen({ ...s.merk, [key]: { wert, zeit: Date.now() } }) })),
      vergiss: (praefix) =>
        set((s) => ({ merk: Object.fromEntries(Object.entries(s.merk).filter(([k]) => !k.startsWith(praefix))) })),
      setzeAktuell: (e) => set((s) => ({ aktuell: { ...s.aktuell, [e.key]: { ...e, zeit: Date.now() } } })),
      entferneAktuell: (key) =>
        set((s) => {
          const rest = { ...s.aktuell };
          delete rest[key];
          return { aktuell: rest };
        }),
    }),
    {
      name: 'ruhelage-laufend',
      version: 1,
      storage: speicher,
      partialize: (s) => ({ merk: s.merk, aktuell: s.aktuell }) as unknown as LaufendStore,
    },
  ),
);

export function liesGemerkt<T>(key: string): T | undefined {
  return useLaufend.getState().merk[key]?.wert as T | undefined;
}

/**
 * Wie useState, aber der Wert überlebt Seitenwechsel und Neuladen.
 * `gueltig` verwirft gespeicherte Werte, die nicht mehr passen (z. B. andere Aufgabe).
 */
export function useGemerkt<T>(key: string, start: () => T, gueltig?: (w: T) => boolean): [T, (neu: T | ((alt: T) => T)) => void] {
  const gespeichert = useLaufend((s) => s.merk[key]?.wert as T | undefined);
  const merke = useLaufend((s) => s.merke);
  const wert = gespeichert !== undefined && (!gueltig || gueltig(gespeichert)) ? gespeichert : undefined;
  const setze = useCallback(
    (neu: T | ((alt: T) => T)) => {
      const alt = (useLaufend.getState().merk[key]?.wert as T | undefined) ?? start();
      merke(key, typeof neu === 'function' ? (neu as (a: T) => T)(alt) : neu);
    },
    // start ist bewusst nicht in den Abhängigkeiten: es dient nur als Startwert
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [key, merke],
  );
  return [wert ?? start(), setze];
}

/** „vor 5 min“, „gestern“ … */
export function zeitText(zeit: number, jetzt = Date.now()): string {
  const min = Math.round((jetzt - zeit) / 60000);
  if (min < 1) return 'gerade eben';
  if (min < 60) return `vor ${min} min`;
  const std = Math.round(min / 60);
  if (std < 24) return `vor ${std} ${std === 1 ? 'Stunde' : 'Stunden'}`;
  const tage = Math.round(std / 24);
  return tage === 1 ? 'gestern' : `vor ${tage} Tagen`;
}
