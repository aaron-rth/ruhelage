// Zusammenstellung der täglichen Mischsession
import type { SitzungsItem } from './sitzung';
import type { Kurs, Thema } from '../content/types';
import type { Daten } from '../store/store';
import { genKey, quote, schwaeche, uebKey } from './fortschritt';
import { istFaellig } from './leitner';
import { erzeugeRng } from './rng';

export interface HeutePlan {
  items: SitzungsItem[];
  faellig: number;
  neu: number;
  aufgaben: number;
  nochmal: number;
  themen: Thema[];
  minuten: number;
}

export function schwacheThemen(kurs: Kurs, d: Daten, h: string): Thema[] {
  return [...kurs.themen].sort((a, b) => schwaeche(b, d, h) - schwaeche(a, d, h));
}

/** `fokus`: Themen, die laut Lernplan heute dran sind – ihre Aufgaben kommen zuerst. */
export function baueHeute(kurs: Kurs, d: Daten, h: string, seed: number, fokus: Thema[] = []): HeutePlan {
  const rng = erzeugeRng(seed);
  const e = d.einstellungen;
  const sortiert = schwacheThemen(kurs, d, h);
  const rang = new Map(sortiert.map((t, i) => [t.id, i]));

  // 1) fällige Karten – schwache Themen und niedrige Fächer zuerst
  const faellige = kurs.themen
    .flatMap((t) => t.karten.filter((k) => istFaellig(d.karten[k.id], h)).map((k) => ({ k, t })))
    .sort((a, b) => rang.get(a.t.id)! - rang.get(b.t.id)! || d.karten[a.k.id].fach - d.karten[b.k.id].fach)
    .slice(0, e.zielKarten);

  // 2) neue Karten aus den schwächsten Themen auffüllen
  const neueKarten: { id: string }[] = [];
  const platz = Math.max(0, e.zielKarten - faellige.length);
  for (const t of sortiert) {
    if (neueKarten.length >= platz) break;
    for (const k of t.karten) {
      if (neueKarten.length >= platz) break;
      if (!d.karten[k.id]) neueKarten.push({ id: k.id });
    }
  }

  // 3) Aufgaben aus den drei schwächsten Themen (mit Aufgaben), wenig geübte zuerst
  const fokusIds = new Set(fokus.map((t) => t.id));
  const mitAufgaben = [...sortiert.filter((t) => fokusIds.has(t.id)), ...sortiert.filter((t) => !fokusIds.has(t.id))]
    .filter((t) => t.generatoren.length + t.uebungen.length > 0)
    .slice(0, 3);
  const kandidaten = mitAufgaben.flatMap((t, ti) => [
    ...t.generatoren.map((g) => ({ item: { art: 'aufgabe' as const, id: g.id, seed: rng.int(1, 2 ** 30) }, q: quote(d, genKey(g.id)), ti })),
    ...t.uebungen.map((u) => ({ item: { art: 'uebung' as const, id: u.id }, q: quote(d, uebKey(u.id)), ti })),
  ]);
  const gewicht = (q: number | undefined, ti: number) => (q === undefined ? 0.35 : q) + ti * 0.15 + rng.next() * 0.3;
  const aufgaben = kandidaten
    .map((c) => ({ ...c, w: gewicht(c.q, c.ti) }))
    .sort((a, b) => a.w - b.w)
    .slice(0, e.zielAufgaben)
    .map((c) => c.item);

  // 4) Nochmal-Stapel (älteste zuerst, max. 4)
  const nochmal: SitzungsItem[] = [...d.nochmal]
    .sort((a, b) => a.seit.localeCompare(b.seit))
    .filter((n) => n.art !== 'karte' || !faellige.some((f) => f.k.id === n.ref))
    .slice(0, 4)
    .map((n) => (n.art === 'aufgabe' ? { art: 'aufgabe', id: n.ref, seed: n.seed ?? 1 } : { art: n.art, id: n.ref }));

  // Mischen: Karten in Blöcken, dazwischen eine Aufgabe
  const karten: SitzungsItem[] = [...faellige.map((f) => ({ art: 'karte' as const, id: f.k.id })), ...neueKarten.map((n) => ({ art: 'karte' as const, id: n.id }))];
  const items: SitzungsItem[] = [];
  const rest = [...aufgaben];
  for (let i = 0; i < karten.length; i++) {
    items.push(karten[i]);
    if ((i + 1) % 5 === 0 && rest.length) items.push(rest.shift()!);
  }
  items.push(...rest, ...nochmal);

  const minuten = Math.round(karten.length * 0.4 + aufgaben.length * 2.5 + nochmal.length * 1.5);
  return {
    items,
    faellig: faellige.length,
    neu: neueKarten.length,
    aufgaben: aufgaben.length,
    nochmal: nochmal.length,
    themen: mitAufgaben,
    minuten,
  };
}

/** Karteikarten aus allen Themen: fällige zuerst, dann neue aus den schwächsten Themen. */
export function mischKarten(kurs: Kurs, d: Daten, h: string, anzahl: number): SitzungsItem[] {
  const sortiert = schwacheThemen(kurs, d, h);
  const faellig = sortiert.flatMap((t) => t.karten.filter((k) => istFaellig(d.karten[k.id], h)));
  const neu = sortiert.flatMap((t) => t.karten.filter((k) => !d.karten[k.id]));
  return [...faellig, ...neu].slice(0, anzahl).map((k) => ({ art: 'karte' as const, id: k.id }));
}

/** Übungen bzw. Rechenaufgaben gemischt aus den schwächsten Themen, wenig geübte zuerst. */
export function mischAufgaben(kurs: Kurs, d: Daten, h: string, seed: number, art: 'uebungen' | 'rechnen', anzahl: number): SitzungsItem[] {
  const rng = erzeugeRng(seed);
  const themen = schwacheThemen(kurs, d, h).slice(0, 4);
  const kandidaten: { item: SitzungsItem; w: number }[] = themen.flatMap((t, ti) =>
    art === 'rechnen'
      ? t.generatoren.filter((g) => g.art === 'rechnen').map((g) => ({ item: { art: 'aufgabe' as const, id: g.id, seed: rng.int(1, 2 ** 30) }, w: (quote(d, genKey(g.id)) ?? 0.3) + ti * 0.12 + rng.next() * 0.3 }))
      : [
          ...t.uebungen.map((u) => ({ item: { art: 'uebung' as const, id: u.id }, w: (quote(d, uebKey(u.id)) ?? 0.3) + ti * 0.12 + rng.next() * 0.3 })),
          ...t.generatoren.filter((g) => g.art === 'diagramm').map((g) => ({ item: { art: 'aufgabe' as const, id: g.id, seed: rng.int(1, 2 ** 30) }, w: (quote(d, genKey(g.id)) ?? 0.3) + ti * 0.12 + rng.next() * 0.3 })),
        ],
  );
  return kandidaten.sort((a, b) => a.w - b.w).slice(0, anzahl).map((k) => k.item);
}
