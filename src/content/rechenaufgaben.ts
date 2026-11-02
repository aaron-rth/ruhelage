// Rechenaufgaben aus Inhaltspaketen (JSON) → Generatoren für den Rechentrainer.
// Werte werden zufällig gewählt, Texte und Ergebnisse über kleine Formeln berechnet (lib/formel.ts).
import { fuelle, rechne } from '../lib/formel';
import type { Rng } from '../lib/rng';
import { erzeugeRng } from '../lib/rng';
import type { Aufgabe, Generator, Teil } from './types';

type Bereich = [number, number] | { von: number; bis: number; schritt?: number; ohne?: number[] } | { aus: number[] };

export interface RechenaufgabeJson {
  id: string;
  titel: string;
  schwierigkeit?: 1 | 2 | 3;
  quelle?: string;
  klausur?: boolean;
  /** Zufallswerte: [min, max] (ganze Zahlen), {von, bis, schritt, ohne} oder {aus: [...]} */
  werte: Record<string, Bereich>;
  /** abgeleitete Werte, der Reihe nach berechnet, z. B. {"m": "2*a*x0"} */
  berechnet?: Record<string, string>;
  /** neu würfeln, bis die Bedingung gilt, z. B. "a != b" */
  bedingung?: string;
  kontext: string;
  teile: {
    frage: string;
    ergebnis: string;
    /** Einheit für die Eingabe (Schlüssel aus einheiten.ts), leer = ohne */
    einheit?: string;
    /** relative Toleranz, Standard 0,01 */
    toleranz?: number;
    hilfen: [string, string, string];
    loesung: string;
    typischeFehler?: { ergebnis: string; hinweis: string }[];
  }[];
}

function wuerfle(b: Bereich, rng: Rng): number {
  if (Array.isArray(b)) return rng.int(b[0], b[1]);
  if ('aus' in b) return rng.wahl(b.aus);
  for (let i = 0; i < 50; i++) {
    const x = rng.zahl(b.von, b.bis, b.schritt ?? 1);
    if (!b.ohne?.some((o) => Math.abs(o - x) < 1e-9)) return x;
  }
  return rng.zahl(b.von, b.bis, b.schritt ?? 1);
}

/** Werte für eine Runde (mit Bedingung, höchstens 100 Versuche) */
export function waehleWerte(a: RechenaufgabeJson, rng: Rng): Record<string, number> {
  let w: Record<string, number> = {};
  for (let versuch = 0; versuch < 100; versuch++) {
    w = {};
    for (const [k, b] of Object.entries(a.werte)) w[k] = wuerfle(b, rng);
    for (const [k, f] of Object.entries(a.berechnet ?? {})) w[k] = rechne(f, w);
    if (!a.bedingung || rechne(a.bedingung, w)) return w;
  }
  throw new Error(`Bedingung „${a.bedingung}“ ist kaum erfüllbar`);
}

export function alsGenerator(a: RechenaufgabeJson): Generator {
  return {
    id: a.id,
    titel: a.titel,
    art: 'rechnen',
    schwierigkeit: a.schwierigkeit ?? 2,
    quelle: a.quelle ?? '',
    klausur: a.klausur,
    erzeuge(rng: Rng): Aufgabe {
      const w = waehleWerte(a, rng);
      const teile: Teil[] = a.teile.map((t) => {
        const wert = rechne(t.ergebnis, w);
        const toleranz = t.toleranz ?? 0.01;
        // ein „typischer Fehler“, der bei diesen Zahlen zufällig richtig ist, wäre irreführend
        const daneben = (x: number) => (wert === 0 ? Math.abs(x) > 1e-9 : Math.abs(x - wert) > Math.abs(wert) * toleranz * 2);
        return {
          frage: fuelle(t.frage, w),
          antwort: {
            art: 'zahl',
            wert,
            einheit: t.einheit ?? '',
            toleranz,
            typischeFehler: t.typischeFehler?.map((f) => ({ wert: rechne(f.ergebnis, w), hinweis: fuelle(f.hinweis, w) })).filter((f) => daneben(f.wert)),
          },
          hilfen: t.hilfen.map((h) => fuelle(h, w)) as [string, string, string],
          loesung: fuelle(t.loesung, w),
        };
      });
      return { titel: a.titel, kontext: fuelle(a.kontext, w), teile, werte: w };
    },
  };
}

/** Prüft eine Rechenaufgabe mit vielen Zufallswerten: alles berechenbar, endlich, Texte ohne Reste. */
export function pruefeRechenaufgabe(a: RechenaufgabeJson, durchlaeufe = 200): string[] {
  const g = alsGenerator(a);
  for (let s = 1; s <= durchlaeufe; s++) {
    let auf: Aufgabe;
    try {
      auf = g.erzeuge(erzeugeRng(s * 7919));
    } catch (e) {
      return [`Fehler beim Erzeugen (Durchlauf ${s}): ${e instanceof Error ? e.message : String(e)}`];
    }
    for (const [i, t] of auf.teile.entries()) {
      if (t.antwort.art !== 'zahl') continue;
      if (!Number.isFinite(t.antwort.wert)) return [`teile[${i}].ergebnis ist nicht endlich (z. B. Division durch 0) bei ${JSON.stringify(auf.werte)}`];
      if (Math.abs(t.antwort.wert) < 1e-12) return [`teile[${i}].ergebnis ist 0 bei ${JSON.stringify(auf.werte)} – solche Fälle mit „bedingung“ ausschließen`];
    }
    const texte = [auf.kontext, ...auf.teile.flatMap((t) => [t.frage, t.loesung, ...t.hilfen])];
    const rest = texte.find((x) => /NaN|Infinity|undefined/.test(x));
    if (rest) return [`Text enthält NaN/Infinity bei ${JSON.stringify(auf.werte)}: „${rest.slice(0, 80)}“`];
  }
  return [];
}
