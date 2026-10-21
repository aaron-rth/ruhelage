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

/** Tage bis zur nächsten Wiederholung, je Fach (Index = Fach). */
export const INTERVALLE: Record<Fach, number> = { 1: 0, 2: 1, 3: 2, 4: 4, 5: 7 };

export function bewerte(stand: KartenStand | undefined, b: Bewertung, heute: string): KartenStand {
  const alt: Fach = stand?.fach ?? 1;
  const wiederholungen = (stand?.wiederholungen ?? 0) + 1;
  if (b === 'gewusst') {
    const fach = Math.min(5, alt + 1) as Fach;
    return { fach, faellig: plusTage(heute, INTERVALLE[fach]), wiederholungen, zuletzt: heute };
  }
  if (b === 'halb') {
    // bleibt im Fach, kommt morgen wieder
    return { fach: alt, faellig: plusTage(heute, 1), wiederholungen, zuletzt: heute };
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
