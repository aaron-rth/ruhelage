// Fortschritt in localStorage (versioniert). Export/Import als JSON.
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { Status } from '../content/types';
import { heute, plusTage } from '../lib/datum';
import { bewerte, type Bewertung, type KartenStand } from '../lib/leitner';

export const SCHEMA_VERSION = 1;

export interface Ergebnis {
  versuche: number;
  richtig: number;
  /** letzte Ergebnisse, 1 = richtig, 0 = falsch (max. 8) */
  verlauf: number[];
  zuletzt: string;
}

export interface NochmalEintrag {
  key: string;
  art: 'karte' | 'uebung' | 'aufgabe';
  /** Karten-, Übungs- oder Generator-Id */
  ref: string;
  themaId: string;
  seed?: number;
  seit: string;
}

export interface TagesStand {
  xp: number;
  sekunden: number;
  karten: number;
  aufgaben: number;
  /** davon richtig (seit Version mit Statistik) */
  richtig?: number;
}

export interface Einstellungen {
  zielMinuten: number;
  zielKarten: number;
  zielAufgaben: number;
  countdown: boolean;
  theme: 'dark' | 'light';
  klausurDatum: string;
  /** Einführung und kurze Hinweise anzeigen */
  hinweise: boolean;
}

export interface Daten {
  themen: Record<string, { status: Status }>;
  karten: Record<string, KartenStand>;
  ergebnisse: Record<string, Ergebnis>;
  nochmal: NochmalEintrag[];
  tage: Record<string, TagesStand>;
  xp: number;
  einstellungen: Einstellungen;
  /** Spielwiese: gelöste Mini-Aufgaben */
  spielwiese: string[];
  /** Hinweise, die schon weggeklickt wurden */
  gesehen: string[];
}

export const STANDARD_EINSTELLUNGEN: Einstellungen = {
  zielMinuten: 20,
  zielKarten: 20,
  zielAufgaben: 5,
  countdown: true,
  theme: 'dark',
  klausurDatum: '2026-11-06',
  hinweise: true,
};

export function leereDaten(): Daten {
  return {
    themen: {},
    karten: {},
    ergebnisse: {},
    nochmal: [],
    tage: {},
    xp: 0,
    einstellungen: { ...STANDARD_EINSTELLUNGEN },
    spielwiese: [],
    gesehen: [],
  };
}

interface Aktionen {
  setzeStatus(themaId: string, status: Status): void;
  /** Mit `korrektur` wird eine frühere Bewertung ersetzt (ohne erneut XP zu vergeben). */
  bewerteKarte(kartenId: string, themaId: string, b: Bewertung, korrektur?: { vorher: KartenStand | null }): void;
  /** Ergebnis einer Übung/Aufgabe speichern. key z. B. "gen:faden-periode" */
  speichereErgebnis(key: string, themaId: string, richtig: boolean, xp: number, nochmal?: Omit<NochmalEintrag, 'seit' | 'themaId'>): void;
  entferneNochmal(key: string): void;
  addSekunden(s: number): void;
  addXp(xp: number): void;
  setzeEinstellung<K extends keyof Einstellungen>(k: K, v: Einstellungen[K]): void;
  spielwieseGeloest(id: string): void;
  hinweisGesehen(id: string): void;
  hinweiseZuruecksetzen(): void;
  importiere(d: Daten): void;
  zuruecksetzen(): void;
}

export type Store = Daten & Aktionen;

function tag(d: Daten): TagesStand {
  return d.tage[heute()] ?? { xp: 0, sekunden: 0, karten: 0, aufgaben: 0 };
}

export function migriere(alt: unknown, version: number): Daten {
  const basis = leereDaten();
  if (!alt || typeof alt !== 'object') return basis;
  const d = alt as Partial<Daten>;
  // Version 1 ist die erste; spätere Versionen ergänzen hier ihre Schritte.
  void version;
  return {
    ...basis,
    ...d,
    einstellungen: { ...basis.einstellungen, ...(d.einstellungen ?? {}) },
    spielwiese: d.spielwiese ?? [],
    gesehen: d.gesehen ?? [],
  };
}

const sichererSpeicher = createJSONStorage(() => {
  try {
    const t = '__ruhelage_test__';
    localStorage.setItem(t, t);
    localStorage.removeItem(t);
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

export const useStore = create<Store>()(
  persist(
    (set) => ({
      ...leereDaten(),

      setzeStatus: (themaId, status) => set((s) => ({ themen: { ...s.themen, [themaId]: { status } } })),

      bewerteKarte: (kartenId, themaId, b, korrektur) =>
        set((s) => {
          const h = heute();
          const t = tag(s);
          const xp = korrektur ? 0 : b === 'gewusst' ? 2 : 1;
          const key = `karte:${kartenId}`;
          let nochmal = s.nochmal;
          if (b === 'nicht' && !nochmal.some((n) => n.key === key)) {
            nochmal = [...nochmal, { key, art: 'karte', ref: kartenId, themaId, seit: h }];
          } else if (b === 'gewusst' || korrektur) {
            nochmal = nochmal.filter((n) => n.key !== key);
          }
          const basis = korrektur ? (korrektur.vorher ?? undefined) : s.karten[kartenId];
          return {
            karten: { ...s.karten, [kartenId]: bewerte(basis, b, h) },
            nochmal,
            xp: s.xp + xp,
            tage: { ...s.tage, [h]: { ...t, xp: t.xp + xp, karten: t.karten + (korrektur ? 0 : 1) } },
          };
        }),

      speichereErgebnis: (key, themaId, richtig, xp, eintrag) =>
        set((s) => {
          const h = heute();
          const alt = s.ergebnisse[key] ?? { versuche: 0, richtig: 0, verlauf: [], zuletzt: h };
          const neu: Ergebnis = {
            versuche: alt.versuche + 1,
            richtig: alt.richtig + (richtig ? 1 : 0),
            verlauf: [...alt.verlauf, richtig ? 1 : 0].slice(-8),
            zuletzt: h,
          };
          const t = tag(s);
          let nochmal = s.nochmal;
          if (eintrag) {
            if (!richtig && !nochmal.some((n) => n.key === eintrag.key)) {
              nochmal = [...nochmal, { ...eintrag, themaId, seit: h }];
            }
          }
          return {
            ergebnisse: { ...s.ergebnisse, [key]: neu },
            nochmal,
            xp: s.xp + xp,
            tage: { ...s.tage, [h]: { ...t, xp: t.xp + xp, aufgaben: t.aufgaben + 1, richtig: (t.richtig ?? 0) + (richtig ? 1 : 0) } },
          };
        }),

      entferneNochmal: (key) => set((s) => ({ nochmal: s.nochmal.filter((n) => n.key !== key) })),

      addSekunden: (sek) =>
        set((s) => {
          const h = heute();
          const t = tag(s);
          return { tage: { ...s.tage, [h]: { ...t, sekunden: t.sekunden + sek } } };
        }),

      addXp: (xp) =>
        set((s) => {
          const h = heute();
          const t = tag(s);
          return { xp: s.xp + xp, tage: { ...s.tage, [h]: { ...t, xp: t.xp + xp } } };
        }),

      setzeEinstellung: (k, v) => set((s) => ({ einstellungen: { ...s.einstellungen, [k]: v } })),

      spielwieseGeloest: (id) =>
        set((s) => (s.spielwiese.includes(id) ? s : { spielwiese: [...s.spielwiese, id] })),

      hinweisGesehen: (id) => set((s) => (s.gesehen.includes(id) ? s : { gesehen: [...s.gesehen, id] })),

      hinweiseZuruecksetzen: () => set(() => ({ gesehen: [] })),

      importiere: (d) => set(() => migriere(d, SCHEMA_VERSION)),

      zuruecksetzen: () => set(() => leereDaten()),
    }),
    {
      name: 'ruhelage-fortschritt',
      version: SCHEMA_VERSION,
      storage: sichererSpeicher,
      migrate: (alt, version) => migriere(alt, version) as unknown as Store,
      // auch ohne Versionswechsel neue Felder (z. B. Einstellungen) mit Standardwerten auffüllen
      merge: (gespeichert, aktuell) => ({ ...aktuell, ...migriere(gespeichert, SCHEMA_VERSION) }),
      partialize: (s) => datenAus(s) as unknown as Store,
    },
  ),
);

export function datenAus(s: Daten): Daten {
  return {
    themen: s.themen,
    karten: s.karten,
    ergebnisse: s.ergebnisse,
    nochmal: s.nochmal,
    tage: s.tage,
    xp: s.xp,
    einstellungen: s.einstellungen,
    spielwiese: s.spielwiese,
    gesehen: s.gesehen,
  };
}

// ---------- Export / Import ----------
export interface ExportDatei {
  app: 'ruhelage';
  schema: number;
  exportiert: string;
  daten: Daten;
}

export function exportiere(s: Daten): ExportDatei {
  return { app: 'ruhelage', schema: SCHEMA_VERSION, exportiert: new Date().toISOString(), daten: datenAus(s) };
}

export function liesImport(text: string): Daten {
  const obj = JSON.parse(text) as Partial<ExportDatei>;
  if (obj.app !== 'ruhelage' || !obj.daten) throw new Error('Das ist keine Ruhelage-Sicherung.');
  if ((obj.schema ?? 0) > SCHEMA_VERSION) throw new Error('Die Sicherung stammt aus einer neueren App-Version.');
  return migriere(obj.daten, obj.schema ?? 1);
}

/**
 * Zählt ein Tag für die Serie? Nur Öffnen reicht nicht – man muss etwas gelernt haben:
 * mindestens 3 Karteikarten bewertet oder eine Übung/Aufgabe bearbeitet.
 */
export function tagZaehlt(t: TagesStand | undefined): boolean {
  return !!t && (t.karten >= 3 || t.aufgaben >= 1);
}

/** Streak: aufeinanderfolgende Tage (bis heute oder gestern), die zählen. */
export function streak(tage: Record<string, TagesStand>, h: string): number {
  let n = 0;
  let d = tagZaehlt(tage[h]) ? h : plusTage(h, -1);
  while (tagZaehlt(tage[d])) {
    n++;
    d = plusTage(d, -1);
  }
  return n;
}

/** Längste Serie überhaupt. */
export function laengsteSerie(tage: Record<string, TagesStand>): number {
  const tageMit = Object.keys(tage)
    .filter((d) => tagZaehlt(tage[d]))
    .sort();
  let best = 0;
  let lauf = 0;
  let vorher = '';
  for (const d of tageMit) {
    lauf = vorher && plusTage(vorher, 1) === d ? lauf + 1 : 1;
    best = Math.max(best, lauf);
    vorher = d;
  }
  return best;
}
