// Antwortprüfung: Zahl + Einheit tolerant einlesen und mit dem Sollwert vergleichen.
import type { Antwort, TypFehler } from '../content/types';
import { leseAusdruck } from './ausdruck';
import { einheit, findeEinheit, gleicheDim, WINKEL_EINHEITEN } from './einheiten';
import { zahl as zahlText } from './format';

export type PruefStatus = 'richtig' | 'falsch' | 'ungueltig';

export interface Pruefung {
  status: PruefStatus;
  hinweis?: string;
}

const ZAHL_RE =
  /^\s*([+\-−–]?\s*(?:\d+(?:[.,]\d*)?|[.,]\d+))(?:\s*(?:e|E)\s*([+\-−]?\d+)|\s*(?:[·*x×]|\\cdot)\s*10\s*\^\s*\(?\s*([+\-−]?\d+)\s*\)?)?/;

/**
 * Zerlegt "4,2·10^-3 m/s" oder "3/4 s" in Zahl und Einheitentext.
 * Vorne darf ein Rechenausdruck stehen (Brüche, Potenzen, Wurzeln, π …).
 * `rechnung` ist true, wenn es mehr als eine einzelne Zahl war.
 */
export function zerlege(eingabe: string): { zahl: number | null; rest: string; sig: number; rechnung: boolean } {
  const s = eingabe.replace(/\u00a0/g, ' ').trim();
  const g = leseAusdruck(s);
  if (!g) return { zahl: null, rest: s, sig: 0, rechnung: false };
  const teil = s.slice(0, g.laenge).trim();
  const m = ZAHL_RE.exec(teil);
  const einfach = !!m && m[0].trim().length === teil.length;
  const sig = einfach ? gueltigeZiffern(m[1].replace(/\s/g, '').replace(/[−–]/g, '-').replace(',', '.')) : 0;
  return { zahl: g.wert, rest: s.slice(g.laenge).trim(), sig, rechnung: !einfach };
}

/** Anzahl gültiger Ziffern einer Dezimalzahl als Text, z. B. "0.0420" → 3 */
export function gueltigeZiffern(text: string): number {
  return text.replace(/^[+-]/, '').replace('.', '').replace(/^0+/, '').length;
}

/** true, wenn `eingabe` genau dem auf `sig` Stellen gerundeten Sollwert entspricht */
function passtGerundet(eingabe: number, soll: number, sig: number): boolean {
  if (sig < 2 || soll === 0) return false;
  const gerundet = Number(soll.toPrecision(sig));
  return Math.abs(gerundet - eingabe) <= Math.abs(soll) * 1e-9;
}

export function parseZahl(eingabe: string): number | null {
  const { zahl, rest } = zerlege(eingabe);
  return rest === '' ? zahl : null;
}

function passtTypFehler(x: number, fehler: TypFehler[] | undefined, tol: number): string | undefined {
  for (const f of fehler ?? []) {
    if (f.wert === 0 ? Math.abs(x) < 1e-12 : Math.abs(x - f.wert) <= Math.abs(f.wert) * tol) return f.hinweis;
  }
  return undefined;
}

function allgemeinerHinweis(x: number, w: number, tol: number): string | undefined {
  if (w === 0 || x === 0) return undefined;
  if (Math.abs(x + w) <= Math.abs(w) * tol) return 'Der Betrag stimmt – prüfe das Vorzeichen.';
  const q = x / w;
  if (Math.abs(q) > 0) {
    const lg = Math.log10(Math.abs(q));
    const k = Math.round(lg);
    if (k !== 0 && Math.abs(lg - k) < 0.009) return 'Die Ziffern stimmen, aber eine Zehnerpotenz nicht – prüfe Einheit und Vorsilbe.';
  }
  const kandidaten: [number, string][] = [
    [2 * Math.PI, 'Genau um den Faktor 2π daneben – hast du ω und f verwechselt?'],
    [1 / (2 * Math.PI), 'Genau um den Faktor 2π daneben – hast du ω und f verwechselt?'],
    [2, 'Genau doppelt so groß wie richtig – fehlt irgendwo ein Faktor ½?'],
    [0.5, 'Genau halb so groß wie richtig – fehlt irgendwo ein Faktor 2?'],
  ];
  for (const [f, h] of kandidaten) if (Math.abs(q - f) <= Math.abs(f) * tol) return h;
  if (Math.abs(q - 1) <= tol * 3) return 'Knapp daneben – rechne mit ungerundeten Zwischenwerten weiter.';
  return undefined;
}

/** Prüft eine Zahl-Antwort. `gewaehlt` ist die im Menü gewählte Einheit; eine eingetippte Einheit hat Vorrang. */
export function pruefeZahl(eingabe: string, gewaehlt: string, a: Extract<Antwort, { art: 'zahl' }>): Pruefung {
  const { zahl, rest, sig } = zerlege(eingabe);
  if (zahl === null) return { status: 'ungueltig', hinweis: 'Das kann ich nicht lesen. Beispiele: 0,42 · 3/4 · 4,2·10^-3 · 2π/5 · √2 (Hilfe über das ?).' };
  let eh = einheit(gewaehlt);
  if (rest) {
    const gefunden = findeEinheit(rest);
    if (!gefunden) return { status: 'ungueltig', hinweis: `Die Einheit „${rest}“ kenne ich nicht. Wähle sie lieber im Menü aus.` };
    eh = gefunden;
  }
  const soll = einheit(a.einheit);
  if (!gleicheDim(eh.dim, soll.dim)) {
    return { status: 'falsch', hinweis: `Die Einheit ${eh.anzeige} passt nicht zur gesuchten Größe.` };
  }
  const x = zahl * eh.faktor;
  const w = a.wert;
  const tol = a.toleranz ?? 0.02;
  const ok = w === 0 ? Math.abs(x) < 1e-9 : Math.abs(x - w) <= Math.abs(w) * tol;
  if (ok) return { status: 'richtig' };
  // Korrekt gerundet, aber mit wenigen Stellen (z. B. 0,12 statt 0,115) – zählt als richtig
  if (passtGerundet(zahl, w / eh.faktor, sig)) {
    return { status: 'richtig', hinweis: 'Richtig gerundet – mit einer Stelle mehr bist du auf der sicheren Seite.' };
  }
  return { status: 'falsch', hinweis: passtTypFehler(x, a.typischeFehler, tol) ?? allgemeinerHinweis(x, w, tol) };
}

export function normWinkel(phi: number): number {
  const z = 2 * Math.PI;
  return ((phi % z) + z) % z;
}

function winkelAbstand(a: number, b: number, periodisch: boolean): number {
  if (!periodisch) return Math.abs(a - b);
  const d = Math.abs(normWinkel(a) - normWinkel(b));
  return Math.min(d, 2 * Math.PI - d);
}

export function pruefeWinkel(eingabe: string, gewaehlt: 'rad' | '°', a: Extract<Antwort, { art: 'winkel' }>): Pruefung {
  const { zahl, rest } = zerlege(eingabe);
  if (zahl === null) return { status: 'ungueltig', hinweis: 'Bitte eine Zahl eingeben.' };
  let ehKey: 'rad' | '°' = gewaehlt;
  if (rest) {
    const r = rest.toLowerCase();
    if (r === 'rad') ehKey = 'rad';
    else if (r === '°' || r === 'grad' || r === 'deg') ehKey = '°';
    else return { status: 'ungueltig', hinweis: `Die Einheit „${rest}“ passt nicht – nimm rad oder °.` };
  }
  const faktor = WINKEL_EINHEITEN.find((e) => e.key === ehKey)!.faktor;
  const x = zahl * faktor;
  const per = a.periodisch ?? true;
  const tol = a.toleranz ?? 0.03;
  if (winkelAbstand(x, a.wert, per) <= tol) return { status: 'richtig' };
  for (const f of a.typischeFehler ?? []) {
    if (winkelAbstand(x, f.wert, per) <= tol) return { status: 'falsch', hinweis: f.hinweis };
  }
  // Grad/Bogenmaß verwechselt?
  const andersrum = ehKey === 'rad' ? zahl * (Math.PI / 180) : zahl;
  if (ehKey === 'rad' && winkelAbstand(andersrum, a.wert, per) <= tol) {
    return { status: 'falsch', hinweis: 'Die Zahl passt in Grad – du hast aber rad gewählt.' };
  }
  if (ehKey === '°' && winkelAbstand(zahl, a.wert, per) <= tol) {
    return { status: 'falsch', hinweis: 'Die Zahl passt im Bogenmaß – du hast aber ° gewählt.' };
  }
  if (per && winkelAbstand(x + Math.PI, a.wert, per) <= tol) {
    return { status: 'falsch', hinweis: 'Um genau π daneben – prüfe den Quadranten (Vorzeichen von sin φ₀ und cos φ₀).' };
  }
  if (per && winkelAbstand(Math.PI - x, a.wert, per) <= tol) {
    return { status: 'falsch', hinweis: 'Das ist der „andere“ Winkel mit gleichem Sinus – prüfe das Vorzeichen von cos φ₀ (Quadrant!).' };
  }
  return { status: 'falsch' };
}

// ---------- einheitliche Prüfung für alle Antwortarten ----------
export type Eingabe =
  | { art: 'zahl'; text: string; einheit: string }
  | { art: 'winkel'; text: string; einheit: 'rad' | '°' }
  | { art: 'auswahl'; wahl: number | null }
  | { art: 'klick'; x: number | null };

export function leereEingabe(a: Antwort): Eingabe {
  switch (a.art) {
    case 'zahl':
      return { art: 'zahl', text: '', einheit: a.einheit };
    case 'winkel':
      return { art: 'winkel', text: '', einheit: a.einheit ?? 'rad' };
    case 'auswahl':
      return { art: 'auswahl', wahl: null };
    case 'klick':
      return { art: 'klick', x: null };
  }
}

export function istLeer(e: Eingabe): boolean {
  if (e.art === 'zahl' || e.art === 'winkel') return e.text.trim() === '';
  if (e.art === 'auswahl') return e.wahl === null;
  return e.x === null;
}

export function pruefe(a: Antwort, e: Eingabe): Pruefung {
  if (a.art === 'zahl' && e.art === 'zahl') return pruefeZahl(e.text, e.einheit, a);
  if (a.art === 'winkel' && e.art === 'winkel') return pruefeWinkel(e.text, e.einheit, a);
  if (a.art === 'auswahl' && e.art === 'auswahl') {
    if (e.wahl === null) return { status: 'ungueltig', hinweis: 'Bitte eine Antwort wählen.' };
    return { status: e.wahl === a.richtig ? 'richtig' : 'falsch' };
  }
  if (a.art === 'klick' && e.art === 'klick') {
    if (e.x === null) return { status: 'ungueltig', hinweis: 'Klicke in das Diagramm.' };
    const ok = a.ziele.some((z) => Math.abs(z - e.x!) <= a.toleranz);
    return { status: ok ? 'richtig' : 'falsch' };
  }
  return { status: 'ungueltig' };
}

/** Sollantwort als kurzer Text (Markdown/TeX) für Auswertungen. */
export function sollText(a: Antwort): string {
  if (a.art === 'zahl') {
    const e = einheit(a.einheit);
    const s = zahlText(a.wert / e.faktor, 3);
    return e.key === '' ? s : `${s} ${e.anzeige}`;
  }
  if (a.art === 'winkel') {
    return `${zahlText(a.wert, 3)} rad (${Math.round((a.wert * 180) / Math.PI)}°)`;
  }
  if (a.art === 'auswahl') return `${String.fromCharCode(65 + a.richtig)}: ${a.optionen[a.richtig]}`;
  return `t ≈ ${a.ziele.map((z) => Number(z.toPrecision(3)).toString().replace('.', ',')).join(' oder ')} s`;
}

/** Eingabe als kurzer Text für Auswertungen. */
export function eingabeText(e: Eingabe, a: Antwort): string {
  if (e.art === 'zahl' || e.art === 'winkel') {
    if (!e.text.trim()) return '–';
    const eh = e.art === 'zahl' ? einheit(e.einheit).anzeige : e.einheit;
    return /[a-zA-Zµ°%²³/]/.test(e.text.replace(/e[+-]?\d/i, '')) ? e.text : `${e.text} ${eh === '(ohne)' ? '' : eh}`.trim();
  }
  if (e.art === 'auswahl') return e.wahl === null ? '–' : a.art === 'auswahl' ? `${String.fromCharCode(65 + e.wahl)}: ${a.optionen[e.wahl]}` : '–';
  return e.x === null ? '–' : `t ≈ ${e.x.toFixed(2).replace('.', ',')} s`;
}
