// Fortschritt pro Thema aus Karten und Ergebnissen berechnen.
import type { Status, Thema } from '../content/types';
import type { Daten } from '../store/store';
import { istFaellig, kartenWert } from './leitner';

export const genKey = (id: string) => `gen:${id}`;
export const uebKey = (id: string) => `ueb:${id}`;

/** Trefferquote der letzten Versuche (0–1) oder undefined, wenn nie versucht. */
export function quote(d: Daten, key: string): number | undefined {
  const e = d.ergebnisse[key];
  if (!e || e.verlauf.length === 0) return undefined;
  const letzte = e.verlauf.slice(-4);
  return letzte.reduce((a, b) => a + b, 0) / letzte.length;
}

export interface ThemaFortschritt {
  gesamt: number;
  karten: number;
  aufgaben: number;
  kartenFaellig: number;
  kartenNeu: number;
  versucht: number;
  aufgabenAnzahl: number;
}

export function themaFortschritt(t: Thema, d: Daten, heute: string): ThemaFortschritt {
  const kWerte = t.karten.map((k) => kartenWert(d.karten[k.id]));
  const karten = kWerte.length ? kWerte.reduce((a, b) => a + b, 0) / kWerte.length : 0;
  const keys = [...t.uebungen.map((u) => uebKey(u.id)), ...t.generatoren.map((g) => genKey(g.id))];
  const quoten = keys.map((k) => quote(d, k));
  const versucht = quoten.filter((q) => q !== undefined).length;
  // Nicht versuchte Aufgaben zählen als 0 → Fortschritt wächst mit Abdeckung und Treffern
  const aufgaben = keys.length ? quoten.reduce<number>((a, q) => a + (q ?? 0), 0) / keys.length : 0;
  const hatKarten = t.karten.length > 0;
  const hatAufgaben = keys.length > 0;
  const gesamt = hatKarten && hatAufgaben ? 0.45 * karten + 0.55 * aufgaben : hatKarten ? karten : aufgaben;
  return {
    gesamt,
    karten,
    aufgaben,
    kartenFaellig: t.karten.filter((k) => istFaellig(d.karten[k.id], heute)).length,
    kartenNeu: t.karten.filter((k) => !d.karten[k.id]).length,
    versucht,
    aufgabenAnzahl: keys.length,
  };
}

export function statusVon(t: Thema, d: Daten): Status {
  return d.themen[t.id]?.status ?? t.startStatus;
}

/** Vorschlag aus den Ergebnissen (wird nur als Hinweis gezeigt). */
export function vorschlag(f: ThemaFortschritt): Status {
  if (f.gesamt >= 0.7) return 'kann';
  if (f.gesamt >= 0.35) return 'halb';
  return 'nicht';
}

/** Gewicht für die Auswahl in „Heute“: schwache, wichtige Themen zuerst. */
export function schwaeche(t: Thema, d: Daten, heute: string): number {
  const s = statusVon(t, d);
  const f = themaFortschritt(t, d, heute);
  const statusGewicht = s === 'nicht' ? 1 : s === 'halb' ? 0.6 : 0.2;
  const prio = 1 / (1 + t.prioritaet * 0.08);
  return statusGewicht * (1.2 - f.gesamt) * prio;
}
