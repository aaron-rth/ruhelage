// Zwei Speicherstände (z. B. Handy und Laptop) zusammenführen, ohne Fortschritt zu verlieren.
import type { Daten, Ergebnis, NochmalEintrag, TagesStand } from '../store/store';
import type { KartenStand } from './leitner';

function neuere(a: KartenStand, b: KartenStand): KartenStand {
  if (a.zuletzt !== b.zuletzt) return a.zuletzt > b.zuletzt ? a : b;
  return a.wiederholungen >= b.wiederholungen ? a : b;
}

function mehrVersuche(a: Ergebnis, b: Ergebnis): Ergebnis {
  if (a.versuche !== b.versuche) return a.versuche > b.versuche ? a : b;
  return a.zuletzt >= b.zuletzt ? a : b;
}

function tagMax(a: TagesStand, b: TagesStand): TagesStand {
  return {
    xp: Math.max(a.xp, b.xp),
    sekunden: Math.max(a.sekunden, b.sekunden),
    karten: Math.max(a.karten, b.karten),
    aufgaben: Math.max(a.aufgaben, b.aufgaben),
    richtig: Math.max(a.richtig ?? 0, b.richtig ?? 0),
  };
}

function vereine<T>(a: Record<string, T>, b: Record<string, T>, waehle: (x: T, y: T) => T): Record<string, T> {
  const out: Record<string, T> = { ...a };
  for (const [k, v] of Object.entries(b)) out[k] = k in out ? waehle(out[k], v) : v;
  return out;
}

/**
 * Führt `lokal` und `cloud` zusammen. Lernstände: jeweils der neuere bzw. weiter fortgeschrittene;
 * Tageswerte: Maximum; Listen: vereinigt. Einstellungen bleiben die des Geräts.
 */
export function fuehreZusammen(lokal: Daten, cloud: Daten): Daten {
  const karten = vereine(lokal.karten, cloud.karten, neuere);
  const nochmalMap = new Map<string, NochmalEintrag>();
  for (const n of [...cloud.nochmal, ...lokal.nochmal]) {
    const alt = nochmalMap.get(n.key);
    if (!alt || n.seit < alt.seit) nochmalMap.set(n.key, n);
  }
  // Karten, die nach dem Eintrag gewusst wurden, gehören nicht mehr in den Stapel
  const nochmal = [...nochmalMap.values()].filter((n) => {
    if (n.art !== 'karte') return true;
    const k = karten[n.ref];
    return !(k && k.zuletzt > n.seit && k.fach >= 2);
  });
  return {
    themen: { ...cloud.themen, ...lokal.themen },
    karten,
    ergebnisse: vereine(lokal.ergebnisse, cloud.ergebnisse, mehrVersuche),
    nochmal,
    tage: vereine(lokal.tage, cloud.tage, tagMax),
    xp: Math.max(lokal.xp, cloud.xp),
    einstellungen: lokal.einstellungen,
    spielwiese: [...new Set([...lokal.spielwiese, ...cloud.spielwiese])],
    gesehen: [...new Set([...lokal.gesehen, ...cloud.gesehen])],
  };
}

/** Hat dieser Speicherstand überhaupt Lernfortschritt? */
export function istLeer(d: Daten): boolean {
  return Object.keys(d.karten).length === 0 && Object.keys(d.ergebnisse).length === 0 && d.xp === 0;
}
