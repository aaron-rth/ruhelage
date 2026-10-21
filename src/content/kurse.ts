// Registry aller Kurse. Ein neuer Kurs (z. B. „Wellen“) wird hier ergänzt.
import { schwingungen } from './schwingungen';
import type { Generator, Karte, Kurs, Thema, Uebung } from './types';

export const KURSE: Kurs[] = [schwingungen];

/** Der aktuell angezeigte Kurs (später auswählbar) */
export const AKTIVER_KURS: Kurs = schwingungen;

export const alleThemen = (): Thema[] => KURSE.flatMap((k) => k.themen);

const themenIndex = new Map<string, Thema>();
const kartenIndex = new Map<string, { karte: Karte; thema: Thema }>();
const uebungsIndex = new Map<string, { uebung: Uebung; thema: Thema }>();
const generatorIndex = new Map<string, { generator: Generator; thema: Thema }>();

for (const t of alleThemen()) {
  if (themenIndex.has(t.id)) throw new Error(`Doppelte Themen-Id: ${t.id}`);
  themenIndex.set(t.id, t);
  for (const k of t.karten) kartenIndex.set(k.id, { karte: k, thema: t });
  for (const u of t.uebungen) uebungsIndex.set(u.id, { uebung: u, thema: t });
  for (const g of t.generatoren) generatorIndex.set(g.id, { generator: g, thema: t });
}

export const findeThema = (id: string) => themenIndex.get(id);
export const findeKarte = (id: string) => kartenIndex.get(id);
export const findeUebung = (id: string) => uebungsIndex.get(id);
export const findeGenerator = (id: string) => generatorIndex.get(id);
