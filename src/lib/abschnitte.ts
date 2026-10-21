// „Kurz erklärt“ in Abschnitte zerlegen und den Abschnitt finden, der am besten zu einem Text passt.

export interface Abschnitt {
  titel: string;
  text: string;
}

/** Zerlegt Markdown an den ##-Überschriften (###-Unterabschnitte bleiben im Abschnitt). */
export function abschnitte(md: string): Abschnitt[] {
  const teile: Abschnitt[] = [];
  let aktuell: Abschnitt | null = null;
  for (const zeile of md.split('\n')) {
    const m = /^##\s+(.*)$/.exec(zeile);
    if (m) {
      if (aktuell) teile.push(aktuell);
      aktuell = { titel: m[1].trim(), text: '' };
    } else if (aktuell) {
      aktuell.text += zeile + '\n';
    } else if (zeile.trim()) {
      aktuell = { titel: 'Einleitung', text: zeile + '\n' };
    }
  }
  if (aktuell) teile.push(aktuell);
  return teile.map((a) => ({ ...a, text: a.text.trim() }));
}

const STOPP = new Set(
  'aber also auch beim beide bzw dann dass dein deine denn der des die dies diese diesem dieser doch durch eine einem einen einer eines etwa gibt habe haben hast immer kann kein keine man mehr mit nach nicht noch nur oder ohne sich sie sind soll über und unter viel vom von vor warum was weil welche welcher wenn wer werden wie wird wo zum zur zwei hier dort dabei damit gilt ganz jetzt schon sehr stimmt wieder bei ist ein im in es an auf aus den dem das so zu um am als für'
    .split(' '),
);

/** Wörter (und Formelzeichen-Namen) für den Vergleich. */
export function woerter(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/\\(mathrm|text|frac|dfrac|cdot|left|right|hat|sqrt|displaystyle|quad|,)/g, ' ')
    .replace(/\\([a-z]+)/g, ' $1 ')
    .replace(/[^a-zäöüß0-9]+/g, ' ')
    .split(' ')
    .filter((w) => w.length >= 3 && !STOPP.has(w))
    .map((w) => (w.length > 6 ? w.slice(0, 6) : w));
}

/** Index des passendsten Abschnitts (seltene gemeinsame Wörter zählen mehr). */
export function besterAbschnitt(liste: Abschnitt[], text: string): number {
  if (liste.length <= 1) return 0;
  const saetze = liste.map((a) => new Set(woerter(`${a.titel} ${a.titel} ${a.text}`)));
  const df = new Map<string, number>();
  for (const s of saetze) for (const w of s) df.set(w, (df.get(w) ?? 0) + 1);
  const anfrage = new Set(woerter(text));
  let best = 0;
  let bestWert = -1;
  saetze.forEach((s, i) => {
    let wert = 0;
    for (const w of anfrage) if (s.has(w)) wert += Math.log(1 + liste.length / (df.get(w) ?? 1));
    // längere Abschnitte nicht bevorzugen
    wert /= Math.sqrt(1 + s.size / 60);
    if (wert > bestWert) {
      bestWert = wert;
      best = i;
    }
  });
  return best;
}
