// Eingetippte Antworten bei Karteikarten tolerant prüfen: Groß/klein, Satzzeichen und Leerzeichen egal,
// Varianten („Haus, Gebäude“ oder „house / home“) zählen einzeln, kleine Tippfehler sind „fast“ richtig.
export type TippErgebnis = 'richtig' | 'fast' | 'falsch';

const ARTIKEL = /^(der|die|das|ein|eine|the|a|an|to|le|la|les|l|un|une|el|los|las)\s+/;

export function normal(s: string): string {
  return s
    .toLowerCase()
    .replace(/\$/g, '')
    .replace(/[.,!?;:"„“”'’`´()[\]{}]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Varianten der Lösung; Klammerteile sind optional: „(to) go“ → „to go“ und „go“ */
export function varianten(soll: string): string[] {
  const teile = soll.split(/[,;/]| oder /).map((t) => t.trim()).filter(Boolean);
  const out = new Set<string>();
  for (const t of teile.length ? teile : [soll]) {
    out.add(normal(t));
    out.add(normal(t.replace(/\([^)]*\)/g, ' ')));
  }
  out.add(normal(soll));
  // Artikel am Anfang sind optional („das Haus“ → auch „Haus“, „to go“ → auch „go“)
  for (const v of [...out]) out.add(v.replace(ARTIKEL, ''));
  return [...out].filter(Boolean);
}

export function abstand(a: string, b: string): number {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[a.length][b.length];
}

export function pruefeTippen(eingabe: string, soll: string): TippErgebnis {
  const e = normal(eingabe).replace(ARTIKEL, '');
  if (!e) return 'falsch';
  const vs = varianten(soll);
  if (vs.includes(e)) return 'richtig';
  // kleine Tippfehler: 1 Zeichen bei kurzen, 2 bei längeren Wörtern
  if (vs.some((v) => abstand(e, v) <= (v.length <= 6 ? 1 : 2) && v.length >= 3)) return 'fast';
  return 'falsch';
}
