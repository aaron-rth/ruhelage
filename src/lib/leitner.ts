// Leitner-System mit 5 Fächern (wie Phase6), Abstände bis zur Klausur verkürzt.
import { plusTage } from './datum';

export type Bewertung = 'gewusst' | 'halb' | 'nicht';
export type Fach = 1 | 2 | 3 | 4 | 5;

export interface KartenStand {
  fach: Fach;
  /** ab diesem Tag (YYYY-MM-DD) wieder fällig */
  faellig: string;
  wiederholungen: number;
  zuletzt: string;
}

export type Intervalle = Record<Fach, number>;
export type Takt = 'sehrKurz' | 'kurz' | 'standard' | 'lang';

/** Wählbare Wiederholungsabstände (Tage bis zur nächsten Wiederholung je Fach). */
export const TAKTE: Record<Takt, { label: string; text: string; intervalle: Intervalle }> = {
  sehrKurz: { label: 'Sehr kurz', text: 'kurz vor der Klausur: fast alles kommt nach 0–2 Tagen wieder', intervalle: { 1: 0, 2: 0, 3: 1, 4: 1, 5: 2 } },
  kurz: { label: 'Kurz', text: 'häufiger wiederholen', intervalle: { 1: 0, 2: 1, 3: 1, 4: 2, 5: 4 } },
  standard: { label: 'Standard', text: 'ausgewogen bis zur Klausur', intervalle: { 1: 0, 2: 1, 3: 2, 4: 4, 5: 7 } },
  lang: { label: 'Lang', text: 'für langfristiges Behalten, z. B. nach der Klausur', intervalle: { 1: 0, 2: 2, 3: 5, 4: 10, 5: 21 } },
};

/** Tage bis zur nächsten Wiederholung, je Fach (Index = Fach) – Standard. */
export const INTERVALLE: Intervalle = TAKTE.standard.intervalle;

export function intervallText(i: Intervalle): string {
  return [1, 2, 3, 4, 5].map((f) => i[f as Fach]).join(' / ');
}

/** Nach einem Wechsel des Takts: Fälligkeiten der schon gelernten Karten neu berechnen. */
export function neuTakten(karten: Record<string, KartenStand>, i: Intervalle): Record<string, KartenStand> {
  return Object.fromEntries(
    Object.entries(karten).map(([id, k]) => [id, k.fach >= 2 ? { ...k, faellig: plusTage(k.zuletzt, i[k.fach]) } : k]),
  );
}

export function bewerte(stand: KartenStand | undefined, b: Bewertung, heute: string, intervalle: Intervalle = INTERVALLE): KartenStand {
  const alt: Fach = stand?.fach ?? 1;
  const wiederholungen = (stand?.wiederholungen ?? 0) + 1;
  if (b === 'gewusst') {
    const fach = Math.min(5, alt + 1) as Fach;
    return { fach, faellig: plusTage(heute, intervalle[fach]), wiederholungen, zuletzt: heute };
  }
  if (b === 'halb') {
    // bleibt im Fach, kommt bald wieder (morgen bzw. beim kürzesten Takt noch heute)
    return { fach: alt, faellig: plusTage(heute, Math.min(1, intervalle[2])), wiederholungen, zuletzt: heute };
  }
  return { fach: 1, faellig: heute, wiederholungen, zuletzt: heute };
}

export function istNeu(stand: KartenStand | undefined): boolean {
  return !stand;
}

export function istFaellig(stand: KartenStand | undefined, heute: string): boolean {
  return !!stand && stand.faellig <= heute;
}

/** Lernstand einer Karte von 0 (neu) bis 1 (Fach 5). */
export function kartenWert(stand: KartenStand | undefined): number {
  if (!stand) return 0;
  return (stand.fach - 1) / 4;
}
