// Zwei Speicherstände (z. B. Handy und Laptop) zusammenführen, ohne Fortschritt zu verlieren.
import type { Daten, Einstellungen, Ergebnis, NochmalEintrag, TagesStand } from '../store/store';
import type { KartenStand } from './leitner';
import { aufraeumen, type LaufendDaten } from '../store/laufend';

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

/** Gehören zum Gerät (Handy anders als Laptop) und werden nicht abgeglichen */
const GERAET: (keyof Einstellungen)[] = ['kurs', 'theme', 'ton', 'tonBereiche', 'tonTrotzStumm', 'haptik', 'wischen', 'wischUmgekehrt', 'fokus'];
/** werden gesondert zusammengeführt */
const BESONDERS: (keyof Einstellungen)[] = ['klausurDatum', 'klausurDaten', 'tagesrunde', 'gelesen', 'meineKurse', 'fertigeKurse', 'ausgeblendeteThemen', 'geaendert'];

const zeit = (e: Einstellungen, k: string) => e.geaendert?.[k] ?? 0;
const vereinigt = (a: string[] = [], b: string[] = []) => [...new Set([...a, ...b])];

/** Klausurtermine je Kurs; der Termin des aktiven Kurses steht (ältere Versionen) nur in klausurDatum */
function termine(e: Einstellungen): Record<string, string> {
  return { ...(e.klausurDaten ?? {}), [e.kurs]: e.klausurDatum };
}

/** Pro Schlüssel den zuletzt geänderten Wert nehmen; fehlt er auf einer Seite, den vorhandenen. */
function proSchluessel<T>(l: Record<string, T>, c: Record<string, T>, praefix: string, el: Einstellungen, ec: Einstellungen): Record<string, T> {
  const out: Record<string, T> = { ...c, ...l };
  for (const k of Object.keys(c)) if (k in l && zeit(ec, `${praefix}:${k}`) > zeit(el, `${praefix}:${k}`)) out[k] = c[k];
  return out;
}

/** Liste: die zuletzt geänderte gewinnt; ohne Zeitstempel (ältere Versionen) beide vereinigen */
function liste(l: Einstellungen, c: Einstellungen, k: 'fertigeKurse' | 'ausgeblendeteThemen'): string[] {
  const tl = zeit(l, k);
  const tc = zeit(c, k);
  if (tl === tc) return vereinigt(l[k], c[k]);
  return (tc > tl ? c[k] : l[k]) ?? [];
}

/**
 * Einstellungen zweier Geräte: Geräte-Einstellungen (aktives Fach, Design, Töne …) bleiben lokal,
 * alles Fachliche (Termine, meine Fächer, ausgeblendete Themen …) kommt vom zuletzt geänderten Stand.
 */
export function fuehreEinstellungenZusammen(l: Einstellungen, c: Einstellungen): Einstellungen {
  const out = { ...l } as Record<string, unknown>;
  for (const k of Object.keys(c) as (keyof Einstellungen)[]) {
    if (GERAET.includes(k) || BESONDERS.includes(k)) continue;
    if (zeit(c, k) > zeit(l, k)) out[k] = c[k];
  }
  const klausurDaten = proSchluessel(termine(l), termine(c), 'klausurDaten', l, c);
  const geaendert = { ...c.geaendert };
  for (const [k, v] of Object.entries(l.geaendert ?? {})) geaendert[k] = Math.max(v, geaendert[k] ?? 0);
  return {
    ...(out as unknown as Einstellungen),
    klausurDaten,
    klausurDatum: klausurDaten[l.kurs] ?? l.klausurDatum,
    tagesrunde: proSchluessel(l.tagesrunde ?? {}, c.tagesrunde ?? {}, 'tagesrunde', l, c),
    gelesen: vereinigt(l.gelesen, c.gelesen),
    meineKurse: vereinigt(l.meineKurse, c.meineKurse),
    fertigeKurse: liste(l, c, 'fertigeKurse'),
    ausgeblendeteThemen: liste(l, c, 'ausgeblendeteThemen'),
    geaendert,
  };
}

/**
 * Führt `lokal` und `cloud` zusammen. Lernstände: jeweils der neuere bzw. weiter fortgeschrittene;
 * Tageswerte: Maximum; Listen: vereinigt; Einstellungen siehe oben.
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
    einstellungen: fuehreEinstellungenZusammen(lokal.einstellungen, cloud.einstellungen),
    spielwiese: [...new Set([...lokal.spielwiese, ...cloud.spielwiese])],
    gesehen: [...new Set([...lokal.gesehen, ...cloud.gesehen])],
  };
}

/** Hat dieser Speicherstand überhaupt Lernfortschritt? */
export function istLeer(d: Daten): boolean {
  return Object.keys(d.karten).length === 0 && Object.keys(d.ergebnisse).length === 0 && d.xp === 0;
}

/** Angefangenes (Sitzungen, offene Aufgaben, „Angefangen“-Liste): je Eintrag der neuere; Gelöschtes bleibt gelöscht. */
export function fuehreLaufendZusammen(l: LaufendDaten, c: LaufendDaten): LaufendDaten {
  const weg: Record<string, number> = { ...(c.weg ?? {}) };
  for (const [k, z] of Object.entries(l.weg ?? {})) weg[k] = Math.max(z, weg[k] ?? 0);
  function mische<T extends { zeit: number }>(a: Record<string, T> = {}, b: Record<string, T> = {}, praefix: string): Record<string, T> {
    const out: Record<string, T> = {};
    for (const [k, v] of [...Object.entries(b), ...Object.entries(a)]) {
      if ((weg[`${praefix}:${k}`] ?? 0) >= v.zeit) continue;
      if (!out[k] || v.zeit > out[k].zeit) out[k] = v;
    }
    return out;
  }
  return { merk: aufraeumen(mische(l.merk, c.merk, 'm')), aktuell: mische(l.aktuell, c.aktuell, 'a'), weg };
}
