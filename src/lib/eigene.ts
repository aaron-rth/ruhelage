// Eigene Karteikarten: aus dem Speicher werden normale Kurse (Fach → Sets als Themen → Karten),
// damit Lernpfad, Tagesrunde, Leitner und Statistik ohne Sonderwege funktionieren.
import { setzeEigeneKurse } from '../content/kurse';
import type { Karte, Kurs, Thema } from '../content/types';
import { useStore, type EigeneDaten, type EigeneKarte, type EigenesFach, type EigenesSet, type Merkhilfe } from '../store/store';

const neueId = (praefix: string) => `${praefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
const lebendig = <T extends { geloescht?: number }>(x: T) => !x.geloescht;

export function setsVon(e: EigeneDaten, fachId: string): EigenesSet[] {
  return Object.values(e.sets)
    .filter((s) => s.fachId === fachId && lebendig(s))
    .sort((a, b) => a.pos - b.pos);
}

export function kartenVon(e: EigeneDaten, setId: string): EigeneKarte[] {
  return Object.values(e.karten)
    .filter((k) => k.setId === setId && lebendig(k))
    .sort((a, b) => a.pos - b.pos);
}

/** Karten eines Sets je nach Abfragerichtung – rückwärts als eigene Karte (eigener Lernstand je Richtung) */
function alsKarten(set: EigenesSet, karten: EigeneKarte[]): Karte[] {
  const [n1, n2] = set.namen;
  const tippen = set.modus === 'tippen';
  const vor = (k: EigeneKarte): Karte => ({ id: k.id, typ: 'begriff', vorne: k.vorne, hinten: k.hinten, quelle: '', seiten: [n1, n2], merk: k.merk, tippen });
  const rueck = (k: EigeneKarte): Karte => ({ id: `${k.id}~r`, typ: 'begriff', vorne: k.hinten, hinten: k.vorne, quelle: '', seiten: [n2, n1], merk: k.merk, tippen });
  return karten.flatMap((k) => (set.richtung === 'vor' ? [vor(k)] : set.richtung === 'rueck' ? [rueck(k)] : [vor(k), rueck(k)]));
}

export function baueEigeneKurse(e: EigeneDaten): Kurs[] {
  return Object.values(e.faecher)
    .filter(lebendig)
    .sort((a, b) => a.erstellt - b.erstellt)
    .map((f) => {
      const themen: Thema[] = setsVon(e, f.id).map((s, i) => {
        const roh = kartenVon(e, s.id);
        return {
          id: s.id,
          nr: String(i + 1),
          titel: s.titel || `Set ${i + 1}`,
          untertitel: `${roh.length} ${roh.length === 1 ? 'Karte' : 'Karten'} · ${s.namen[0]} / ${s.namen[1]}`,
          abhaengig: [],
          prioritaet: i,
          erklaerung: '',
          quelleErklaerung: '',
          karten: alsKarten(s, roh),
          uebungen: [],
          generatoren: [],
          formeln: [],
          eigen: { fachId: f.id },
        };
      });
      const n = themen.length;
      return { id: f.id, fach: f.name || 'Ohne Namen', klasse: f.klasse || 'eigen', titel: `Eigene Karteikarten · ${n} ${n === 1 ? 'Set' : 'Sets'}`, themen, pfad: themen.map((t) => [t.id]), eigen: true };
    });
}

// Registry immer aktuell halten – läuft vor dem Neuzeichnen, weil dieser Listener zuerst angemeldet ist
let zuletzt: EigeneDaten | null = null;
function aktualisiere(e: EigeneDaten) {
  if (e === zuletzt) return;
  zuletzt = e;
  setzeEigeneKurse(baueEigeneKurse(e));
}
aktualisiere(useStore.getState().eigene);
useStore.subscribe((s) => aktualisiere(s.eigene));

// ---------- Ändern ----------
function aendere(f: (e: EigeneDaten) => Partial<EigeneDaten>) {
  useStore.setState((s) => ({ eigene: { ...s.eigene, ...f(s.eigene) } }));
}

/** Neues Fach mit einem ersten Set; gibt die Ids zurück */
export function legeFachAn(name: string, klasse: string): { fachId: string; setId: string } {
  const jetzt = Date.now();
  const fach: EigenesFach = { id: neueId('eigen'), name: name.trim() || 'Mein Fach', klasse: klasse.trim(), erstellt: jetzt, geaendert: jetzt };
  const set = neuesSet(fach.id, 0);
  aendere((e) => ({ faecher: { ...e.faecher, [fach.id]: fach }, sets: { ...e.sets, [set.id]: set } }));
  return { fachId: fach.id, setId: set.id };
}

function neuesSet(fachId: string, pos: number, vorlage?: EigenesSet): EigenesSet {
  return {
    id: neueId('eset'),
    fachId,
    titel: `Set ${pos + 1}`,
    namen: vorlage?.namen ?? ['Vorderseite', 'Rückseite'],
    zuerst: vorlage?.zuerst ?? 'vorne',
    richtung: vorlage?.richtung ?? 'vor',
    modus: vorlage?.modus ?? 'umdrehen',
    pos,
    geaendert: Date.now(),
  };
}

/** Neues Set – übernimmt die Einstellungen des letzten Sets im Fach */
export function legeSetAn(fachId: string): string {
  const e = useStore.getState().eigene;
  const vorhanden = setsVon(e, fachId);
  const set = neuesSet(fachId, vorhanden.length, vorhanden[vorhanden.length - 1]);
  aendere((x) => ({ sets: { ...x.sets, [set.id]: set } }));
  return set.id;
}

export function aendereFach(id: string, neu: Partial<Pick<EigenesFach, 'name' | 'klasse'>>) {
  aendere((e) => ({ faecher: { ...e.faecher, [id]: { ...e.faecher[id], ...neu, geaendert: Date.now() } } }));
}

export function aendereSet(id: string, neu: Partial<Omit<EigenesSet, 'id' | 'fachId' | 'geaendert'>>) {
  aendere((e) => ({ sets: { ...e.sets, [id]: { ...e.sets[id], ...neu, geaendert: Date.now() } } }));
}

export function legeKarteAn(setId: string, vorne: string, hinten: string, merk?: Merkhilfe): string {
  const e = useStore.getState().eigene;
  const pos = Math.max(-1, ...kartenVon(e, setId).map((k) => k.pos)) + 1;
  const karte: EigeneKarte = { id: neueId('ek'), setId, vorne: vorne.trim(), hinten: hinten.trim(), merk, pos, geaendert: Date.now() };
  aendere((x) => ({ karten: { ...x.karten, [karte.id]: karte } }));
  return karte.id;
}

export function aendereKarte(id: string, neu: Partial<Pick<EigeneKarte, 'vorne' | 'hinten' | 'merk'>>) {
  aendere((e) => ({ karten: { ...e.karten, [id]: { ...e.karten[id], ...neu, geaendert: Date.now() } } }));
}

export function loescheKarte(id: string) {
  aendere((e) => ({ karten: { ...e.karten, [id]: { ...e.karten[id], vorne: '', hinten: '', merk: undefined, geloescht: Date.now(), geaendert: Date.now() } } }));
}

export function loescheSet(id: string) {
  const jetzt = Date.now();
  aendere((e) => ({
    sets: { ...e.sets, [id]: { ...e.sets[id], geloescht: jetzt, geaendert: jetzt } },
    karten: Object.fromEntries(Object.entries(e.karten).map(([k, v]) => [k, v.setId === id && !v.geloescht ? { ...v, vorne: '', hinten: '', merk: undefined, geloescht: jetzt, geaendert: jetzt } : v])),
  }));
}

/** Fach löschen (mit allen Sets und Karten) und aus „Meine Fächer“ nehmen */
export function loescheFach(id: string) {
  const jetzt = Date.now();
  const sets = new Set(Object.values(useStore.getState().eigene.sets).filter((s) => s.fachId === id).map((s) => s.id));
  aendere((e) => ({
    faecher: { ...e.faecher, [id]: { ...e.faecher[id], name: '', geloescht: jetzt, geaendert: jetzt } },
    sets: Object.fromEntries(Object.entries(e.sets).map(([k, v]) => [k, sets.has(k) && !v.geloescht ? { ...v, geloescht: jetzt, geaendert: jetzt } : v])),
    karten: Object.fromEntries(Object.entries(e.karten).map(([k, v]) => [k, sets.has(v.setId) && !v.geloescht ? { ...v, vorne: '', hinten: '', merk: undefined, geloescht: jetzt, geaendert: jetzt } : v])),
  }));
}

// ---------- Liste einfügen ----------
const TRENNER = ['\t', ' – ', ' — ', ' - ', ' = ', ';', ' : ', ': ', '|'];

/** Erkennt das Trennzeichen einer eingefügten Liste (das, das in den meisten Zeilen genau einmal vorkommt) */
export function erkenneTrenner(text: string): string | null {
  const zeilen = text.split('\n').map((z) => z.trim()).filter(Boolean);
  if (!zeilen.length) return null;
  let bester: string | null = null;
  let punkte = 0;
  for (const t of TRENNER) {
    const n = zeilen.filter((z) => z.split(t).length >= 2).length;
    if (n > punkte) {
      punkte = n;
      bester = t;
    }
  }
  return punkte >= Math.ceil(zeilen.length / 2) ? bester : null;
}

/** Zeilen „A – B“ → Paare [erste Spalte, zweite Spalte] */
export function leseListe(text: string, trenner = erkenneTrenner(text)): [string, string][] {
  if (!trenner) return [];
  return text
    .split('\n')
    .map((z) => z.trim())
    .filter(Boolean)
    .map((z) => {
      const i = z.indexOf(trenner);
      return i < 0 ? null : ([z.slice(0, i).trim(), z.slice(i + trenner.length).trim()] as [string, string]);
    })
    .filter((p): p is [string, string] => !!p && !!p[0] && !!p[1]);
}

// ---------- Merkhilfe ----------
const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Lückensatz: die Antwort (bzw. jede Variante davon) im Satz durch ___ ersetzen */
export function lueckensatz(satz: string, antwort: string): string {
  const varianten = antwort
    .replace(/\([^)]*\)/g, ' ')
    .split(/[,;/]| oder /)
    .map((v) => v.trim())
    .filter((v) => v.length >= 2)
    .sort((a, b) => b.length - a.length);
  let out = satz;
  for (const v of varianten) out = out.replace(new RegExp(`(^|[^\\p{L}])${esc(v)}(?=$|[^\\p{L}])`, 'giu'), (_, vor: string) => `${vor}___`);
  return out;
}
