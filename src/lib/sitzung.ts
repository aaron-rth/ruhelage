// Reine Logik einer Lernsitzung (Karten, Übungen, Aufgaben nacheinander).
// Der Stand ist serialisierbar, damit er Seitenwechsel und Neuladen überlebt.
import type { Bewertung, KartenStand } from './leitner';

export type SitzungsItem = { art: 'karte'; id: string } | { art: 'uebung'; id: string } | { art: 'aufgabe'; id: string; seed: number };

export interface SitzungsBilanz {
  karten: { gewusst: number; halb: number; nicht: number };
  aufgaben: { richtig: number; gesamt: number };
}

export interface SitzungsStand {
  items: SitzungsItem[];
  pos: number;
  /** weitester erreichter Index */
  maxPos: number;
  bilanz: SitzungsBilanz;
  /** Karten, die nach „nicht gewusst“ hinten angehängt wurden */
  wiederholt: string[];
  /** Bewertung je Position – mit dem Leitner-Stand davor, damit sich eine Bewertung korrigieren lässt */
  bewertet: Record<number, { b: Bewertung; vorher: KartenStand | null }>;
  /** Positionen von Übungen/Aufgaben, die schon ausgewertet sind */
  erledigt: number[];
  pausiert: boolean;
  /** Tag, an dem die Sitzung begonnen hat */
  datum: string;
  fertig: boolean;
}

export function neueSitzung(items: SitzungsItem[], datum: string): SitzungsStand {
  return {
    items,
    pos: 0,
    maxPos: 0,
    bilanz: { karten: { gewusst: 0, halb: 0, nicht: 0 }, aufgaben: { richtig: 0, gesamt: 0 } },
    wiederholt: [],
    bewertet: {},
    erledigt: [],
    pausiert: false,
    datum,
    fertig: false,
  };
}

function gehe(s: SitzungsStand, pos: number): SitzungsStand {
  if (pos >= s.items.length) return { ...s, fertig: true };
  return { ...s, pos, maxPos: Math.max(s.maxPos, pos) };
}

/** Karte an der aktuellen Position bewerten (auch erneut, dann wird korrigiert) und weitergehen. */
export function karteBewerten(s: SitzungsStand, b: Bewertung, vorher: KartenStand | null): SitzungsStand {
  const item = s.items[s.pos];
  if (!item || item.art !== 'karte') return s;
  const alt = s.bewertet[s.pos];
  const karten = { ...s.bilanz.karten };
  if (alt) karten[alt.b]--;
  karten[b]++;

  let items = s.items;
  let wiederholt = s.wiederholt;
  // „nicht gewusst“ kommt am Ende der Sitzung noch einmal (einmal pro Karte)
  if (b === 'nicht' && !wiederholt.includes(item.id)) {
    items = [...items, item];
    wiederholt = [...wiederholt, item.id];
  } else if (alt?.b === 'nicht' && b !== 'nicht') {
    // Korrektur: die angehängte Wiederholung entfernen, solange sie noch nicht dran war
    let j = -1;
    for (let i = items.length - 1; i > s.pos; i--) {
      const it = items[i];
      if (it.art === 'karte' && it.id === item.id) {
        j = i;
        break;
      }
    }
    if (j > s.maxPos) {
      items = items.filter((_, i) => i !== j);
      wiederholt = wiederholt.filter((id) => id !== item.id);
    }
  }

  const neu: SitzungsStand = {
    ...s,
    items,
    wiederholt,
    bilanz: { ...s.bilanz, karten },
    bewertet: { ...s.bewertet, [s.pos]: { b, vorher: alt ? alt.vorher : vorher } },
  };
  return gehe(neu, s.pos + 1);
}

/** Ergebnis einer Übung/Aufgabe an der aktuellen Position (nur einmal gezählt). */
export function ergebnisMerken(s: SitzungsStand, richtig: boolean): SitzungsStand {
  if (s.erledigt.includes(s.pos)) return s;
  return {
    ...s,
    erledigt: [...s.erledigt, s.pos],
    bilanz: { ...s.bilanz, aufgaben: { richtig: s.bilanz.aufgaben.richtig + (richtig ? 1 : 0), gesamt: s.bilanz.aufgaben.gesamt + 1 } },
  };
}

/** Eins weiter – unbewertete Karten werden dabei übersprungen. */
export function weiter(s: SitzungsStand): SitzungsStand {
  return gehe(s, s.pos + 1);
}

/** Zur vorherigen Karte (Übungen und Aufgaben dazwischen werden ausgelassen). */
export function zurueck(s: SitzungsStand): SitzungsStand {
  for (let i = s.pos - 1; i >= 0; i--) {
    if (s.items[i].art === 'karte') return { ...s, pos: i };
  }
  return s;
}

export function kannZurueck(s: SitzungsStand): boolean {
  return s.items.slice(0, s.pos).some((i) => i.art === 'karte');
}

export function standText(s: SitzungsStand): string {
  const nurKarten = s.items.every((i) => i.art === 'karte');
  return `${nurKarten ? 'Karte' : 'Schritt'} ${Math.min(s.pos + 1, s.items.length)} von ${s.items.length}`;
}
