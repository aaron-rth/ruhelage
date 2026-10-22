// Typen für alle Lerninhalte. Inhalte liegen in src/content/<kurs>/<thema>/ und
// werden über die Registry (src/content/kurse.ts) eingebunden.
import type { Rng } from '../lib/rng';

/** 'offen' = noch nicht selbst eingeschätzt */
export type Status = 'kann' | 'halb' | 'nicht' | 'offen';

// ---------- Karteikarten ----------
export type KartenTyp = 'begriff' | 'formel' | 'warum' | 'wasPassiert' | 'herleitung' | 'fehler';

export interface Karte {
  id: string;
  typ: KartenTyp;
  /** Vorderseite – Markdown mit $…$-Formeln */
  vorne: string;
  /** Rückseite – Markdown mit $…$-Formeln */
  hinten: string;
  quelle: string;
  /** „Genauer erklärt“ – ausführlichere Erklärung (Markdown) */
  mehr?: string;
}

// ---------- Übungen (statisch) ----------
interface UebungBasis {
  id: string;
  frage: string;
  quelle: string;
  /** Erklärung, die nach dem Prüfen angezeigt wird */
  erklaerung?: string;
}

export interface MCUebung extends UebungBasis {
  typ: 'mc';
  /** genau eine Option ist richtig; jede Option erklärt, warum sie (nicht) stimmt */
  optionen: { text: string; richtig?: boolean; warum: string }[];
}

export interface ReihenfolgeUebung extends UebungBasis {
  typ: 'reihenfolge';
  /** in der richtigen Reihenfolge – wird zur Anzeige gemischt */
  schritte: string[];
}

export interface LueckeUebung extends UebungBasis {
  typ: 'luecke';
  /** Text mit Platzhaltern [[0]], [[1]], … */
  text: string;
  luecken: { optionen: string[]; richtig: number }[];
}

export interface FehlerUebung extends UebungBasis {
  typ: 'fehler';
  schritte: string[];
  /** Index des fehlerhaften Schritts */
  fehler: number;
  erklaerung: string;
}

export interface ZuordnenUebung extends UebungBasis {
  typ: 'zuordnen';
  paare: { links: string; rechts: string }[];
}

export interface KlassifizierenUebung extends UebungBasis {
  typ: 'klassifizieren';
  kategorien: string[];
  items: { text: string; kategorie: number; warum?: string }[];
}

export type Uebung =
  | MCUebung
  | ReihenfolgeUebung
  | LueckeUebung
  | FehlerUebung
  | ZuordnenUebung
  | KlassifizierenUebung;

// ---------- Diagramme ----------
export type KurvenStil = 'akzent' | 'koralle' | 'neutral' | 'blau' | 'gelb';

export interface PlotKurve {
  f: (x: number) => number;
  stil?: KurvenStil;
  gestrichelt?: boolean;
  label?: string;
  /** nur in diesem x-Bereich zeichnen */
  von?: number;
  bis?: number;
}

export interface PlotSpec {
  x: [number, number];
  y: [number, number];
  xLabel: string;
  yLabel: string;
  xSchritt: number;
  ySchritt: number;
  /** Feinraster (Kästchen) für genaues Ablesen */
  xFein?: number;
  yFein?: number;
  kurven: PlotKurve[];
  punkte?: { x: number; y: number }[];
  markierungen?: { x: number; y: number; label?: string }[];
  /** gleiche Einheitenlänge auf beiden Achsen (z. B. für den Einheitskreis) */
  quadratisch?: boolean;
  /** Achsenbeschriftungen als Dezimalzahl mit so vielen Nachkommastellen */
  xNachkomma?: number;
  yNachkomma?: number;
}

// ---------- Aufgaben aus Generatoren ----------
export interface TypFehler {
  /** Wert in SI (bzw. rad bei Winkeln) */
  wert: number;
  hinweis: string;
}

export type Antwort =
  | {
      art: 'zahl';
      /** Sollwert in SI-Einheit */
      wert: number;
      /** vorgeschlagene Eingabeeinheit (Schlüssel aus einheiten.ts) */
      einheit: string;
      /** relative Toleranz, Standard 0,02 */
      toleranz?: number;
      typischeFehler?: TypFehler[];
    }
  | {
      art: 'winkel';
      /** Sollwert in rad */
      wert: number;
      /** true: Vergleich modulo 2π */
      periodisch?: boolean;
      einheit?: 'rad' | '°';
      /** absolute Toleranz in rad, Standard 0,03 */
      toleranz?: number;
      typischeFehler?: TypFehler[];
    }
  | { art: 'auswahl'; optionen: string[]; richtig: number; plots?: PlotSpec[] }
  | { art: 'klick'; ziele: number[]; toleranz: number; achse?: string };

export interface Teil {
  frage: string;
  antwort: Antwort;
  /** gestufte Hilfen: 1. Gegeben/Gesucht + Formel, 2. Ansatz, 3. Zwischenergebnis */
  hilfen: [string, string, string];
  /** vollständiger Lösungsweg (Markdown + TeX) */
  loesung: string;
  plot?: PlotSpec;
}

export interface Aufgabe {
  titel: string;
  kontext: string;
  plot?: PlotSpec;
  teile: Teil[];
  /** interne Werte für Tests (physikalische Konsistenz) */
  werte?: Record<string, number>;
}

export interface Generator {
  id: string;
  titel: string;
  art: 'rechnen' | 'diagramm';
  schwierigkeit: 1 | 2 | 3;
  quelle: string;
  /** im Klausurmodus verwendbar */
  klausur?: boolean;
  erzeuge: (rng: Rng) => Aufgabe;
}

// ---------- Formeln ----------
export interface Formel {
  name: string;
  tex: string;
  hinweis?: string;
}

// ---------- Thema und Kurs ----------
export interface Thema {
  id: string;
  nr: string;
  titel: string;
  untertitel: string;
  /** Ids der Themen, die vorher sitzen sollten */
  abhaengig: string[];
  /** Startwert der Selbsteinschätzung – ohne Angabe „noch nicht eingeschätzt“ */
  startStatus?: Status;
  /** Markiert Themen, die im Unterricht noch neu sind */
  neu?: boolean;
  /** kleiner = wichtiger für „Heute“ (Schwachstellen zuerst) */
  prioritaet: number;
  erklaerung: string;
  quelleErklaerung: string;
  karten: Karte[];
  uebungen: Uebung[];
  generatoren: Generator[];
  formeln: Formel[];
}

export interface Kurs {
  id: string;
  /** Schulfach, z. B. „Physik“ */
  fach: string;
  /** Klassenstufe, z. B. „K1“ oder „Klasse 9“ */
  klasse: string;
  titel: string;
  klausur?: { datum: string; titel: string };
  themen: Thema[];
  /** Layout des Lernpfads: Zeilen mit Themen-Ids */
  pfad: string[][];
}
