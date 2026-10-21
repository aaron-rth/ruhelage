// Kleine Helfer zum Schreiben von Aufgaben-Generatoren.
import type { Antwort, PlotSpec, Teil, TypFehler } from './types';

export function zahl(wert: number, einheit: string, typischeFehler?: TypFehler[], toleranz?: number): Antwort {
  // Fehlerwerte, die zufällig (fast) mit der Lösung zusammenfallen, wären irreführend
  const tol = (toleranz ?? 0.02) * 2;
  const fehler = typischeFehler?.filter((f) => Math.abs(f.wert - wert) > Math.abs(wert) * tol);
  return { art: 'zahl', wert, einheit, typischeFehler: fehler, toleranz };
}

export function winkel(wert: number, typischeFehler?: TypFehler[], einheit: 'rad' | '°' = 'rad'): Antwort {
  return { art: 'winkel', wert, periodisch: true, einheit, typischeFehler };
}

export function auswahl(optionen: string[], richtig: number, plots?: PlotSpec[]): Antwort {
  return { art: 'auswahl', optionen, richtig, plots };
}

export function teil(frage: string, antwort: Antwort, hilfen: [string, string, string], loesung: string, plot?: PlotSpec): Teil {
  return { frage, antwort, hilfen, loesung, plot };
}

/** Mischt Antwortoptionen und liefert den neuen Index der richtigen Option. */
export function mischeOptionen(optionen: string[], richtig: number, mische: <T>(a: readonly T[]) => T[]): { optionen: string[]; richtig: number } {
  const idx = mische(optionen.map((_, i) => i));
  return { optionen: idx.map((i) => optionen[i]), richtig: idx.indexOf(richtig) };
}

/** Gegeben/Gesucht-Zeile für die erste Hilfestufe */
export function gg(gegeben: string, gesucht: string, formel?: string): string {
  return `**Gegeben:** ${gegeben}  \n**Gesucht:** ${gesucht}${formel ? `  \n**Passende Formel:** ${formel}` : ''}`;
}

/** Sinus-artige Achsenbereiche: schöne Obergrenze für |y| */
export function schoeneGrenze(maxAbs: number): { grenze: number; schritt: number } {
  const roh = maxAbs * 1.15;
  const p = 10 ** Math.floor(Math.log10(roh));
  for (const k of [1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10]) {
    if (k * p >= roh) {
      const grenze = k * p;
      const schritt = [1, 2, 4, 8].includes(k) || k === 10 ? grenze / 4 : k === 1.5 || k === 3 || k === 6 ? grenze / 3 : grenze / 5;
      return { grenze, schritt };
    }
  }
  return { grenze: 10 * p, schritt: 2.5 * p };
}
