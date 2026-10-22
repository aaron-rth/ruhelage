// Inhaltspakete aus dem Ordner inhalte/ (JSON + Markdown) prüfen und in einen Kurs umwandeln.
// Reine Funktionen ohne Vite-Abhängigkeit – dieselbe Prüfung läuft im Test (CI) und beim Laden.
import { OPERATOREN } from './operatoren';
import type { Formel, Karte, KartenTyp, Kurs, Status, Thema, Uebung } from './types';

export interface ThemaDateien {
  /** Ordnername, z. B. „01-sachtexte“ */
  ordner: string;
  json: unknown;
  erklaerung?: string;
  /** Dateiname in bilder/ → URL */
  bilder: Record<string, string>;
}

export interface PaketDateien {
  /** Ordnername des Kurses, z. B. „deutsch-k1-sachtexte“ */
  ordner: string;
  kurs: unknown;
  themen: ThemaDateien[];
}

export interface PaketErgebnis {
  kurs: Kurs | null;
  fehler: string[];
}

const KARTEN_TYPEN: KartenTyp[] = ['begriff', 'formel', 'warum', 'wasPassiert', 'herleitung', 'fehler'];
const STATUS: Status[] = ['kann', 'halb', 'nicht', 'offen'];
const ID = /^[a-z0-9][a-z0-9-]*$/;

type Obj = Record<string, unknown>;
const istObj = (x: unknown): x is Obj => !!x && typeof x === 'object' && !Array.isArray(x);
const istText = (x: unknown): x is string => typeof x === 'string' && x.trim().length > 0;

class Pruefer {
  fehler: string[] = [];
  constructor(private ort: string) {}
  melde(pfad: string, text: string) {
    this.fehler.push(`${this.ort}${pfad ? ` → ${pfad}` : ''}: ${text}`);
  }
  text(o: Obj, feld: string, pfad: string, optional = false): string | undefined {
    const v = o[feld];
    if (v === undefined && optional) return undefined;
    if (!istText(v)) {
      this.melde(pfad, `„${feld}“ fehlt oder ist leer`);
      return undefined;
    }
    this.formel(v, `${pfad}.${feld}`);
    return v;
  }
  /** Formeln stehen zwischen $…$ – eine ungerade Anzahl heißt fast immer: ein $ vergessen. */
  formel(v: string, pfad: string) {
    const n = (v.replace(/\\\$/g, '').match(/\$/g) ?? []).length;
    if (n % 2) this.melde(pfad, 'ungerade Anzahl von $-Zeichen (Formel nicht geschlossen?)');
  }
  texte(o: Obj, feld: string, pfad: string, min = 1): string[] {
    const v = o[feld];
    if (!Array.isArray(v) || v.length < min || !v.every(istText)) {
      this.melde(pfad, `„${feld}“ muss eine Liste mit mindestens ${min} Texten sein`);
      return [];
    }
    v.forEach((t, i) => this.formel(t, `${pfad}.${feld}[${i}]`));
    return v;
  }
  liste(o: Obj, feld: string, pfad: string, min = 1): Obj[] {
    const v = o[feld];
    if (!Array.isArray(v) || v.length < min || !v.every(istObj)) {
      this.melde(pfad, `„${feld}“ muss eine Liste mit mindestens ${min} Einträgen sein`);
      return [];
    }
    return v;
  }
  index(o: Obj, feld: string, pfad: string, laenge: number) {
    const v = o[feld];
    if (!Number.isInteger(v) || (v as number) < 0 || (v as number) >= laenge) this.melde(pfad, `„${feld}“ muss eine Zahl von 0 bis ${laenge - 1} sein`);
  }
  id(o: Obj, pfad: string, ids: Set<string>): string | undefined {
    const v = o.id;
    if (typeof v !== 'string' || !ID.test(v)) {
      this.melde(pfad, '„id“ fehlt oder enthält andere Zeichen als a–z, 0–9 und -');
      return undefined;
    }
    if (ids.has(v)) this.melde(pfad, `Id „${v}“ kommt doppelt vor`);
    ids.add(v);
    return v;
  }
}

function pruefeUebung(p: Pruefer, u: Obj, pfad: string): void {
  p.text(u, 'frage', pfad);
  p.text(u, 'quelle', pfad);
  p.text(u, 'erklaerung', pfad, true);
  switch (u.typ) {
    case 'mc': {
      const o = p.liste(u, 'optionen', pfad, 2);
      o.forEach((x, i) => {
        p.text(x, 'text', `${pfad}.optionen[${i}]`);
        p.text(x, 'warum', `${pfad}.optionen[${i}]`);
      });
      if (o.length && o.filter((x) => x.richtig === true).length !== 1) p.melde(pfad, 'genau eine Option braucht "richtig": true');
      break;
    }
    case 'reihenfolge':
      p.texte(u, 'schritte', pfad, 2);
      break;
    case 'luecke': {
      const text = p.text(u, 'text', pfad) ?? '';
      const l = p.liste(u, 'luecken', pfad);
      l.forEach((x, i) => {
        const opt = p.texte(x, 'optionen', `${pfad}.luecken[${i}]`, 2);
        p.index(x, 'richtig', `${pfad}.luecken[${i}]`, opt.length);
        if (!text.includes(`[[${i}]]`)) p.melde(pfad, `Platzhalter [[${i}]] fehlt im Text`);
      });
      const mehr = [...text.matchAll(/\[\[(\d+)\]\]/g)].map((m) => Number(m[1])).filter((n) => n >= l.length);
      if (mehr.length) p.melde(pfad, `Platzhalter [[${mehr[0]}]] hat keine passende Lücke`);
      break;
    }
    case 'fehler': {
      const s = p.texte(u, 'schritte', pfad, 2);
      p.index(u, 'fehler', pfad, s.length);
      p.text(u, 'erklaerung', pfad);
      break;
    }
    case 'zuordnen':
      p.liste(u, 'paare', pfad, 2).forEach((x, i) => {
        p.text(x, 'links', `${pfad}.paare[${i}]`);
        p.text(x, 'rechts', `${pfad}.paare[${i}]`);
      });
      break;
    case 'klassifizieren': {
      const k = p.texte(u, 'kategorien', pfad, 2);
      p.liste(u, 'items', pfad, 2).forEach((x, i) => {
        p.text(x, 'text', `${pfad}.items[${i}]`);
        p.index(x, 'kategorie', `${pfad}.items[${i}]`, k.length);
      });
      break;
    }
    case 'schreiben': {
      if (typeof u.operator !== 'string' || !OPERATOREN[u.operator]) p.melde(pfad, `unbekannter Operator „${String(u.operator)}“ (erlaubt: ${Object.keys(OPERATOREN).join(', ')})`);
      p.text(u, 'material', pfad, true);
      p.text(u, 'umfang', pfad, true);
      p.texte(u, 'erwartung', pfad, 1);
      p.liste(u, 'kriterien', pfad, 1).forEach((x, i) => {
        p.text(x, 'name', `${pfad}.kriterien[${i}]`);
        p.text(x, 'beschreibung', `${pfad}.kriterien[${i}]`);
        if (typeof x.punkte !== 'number' || x.punkte <= 0) p.melde(`${pfad}.kriterien[${i}]`, '„punkte“ muss eine Zahl größer 0 sein');
      });
      break;
    }
    default:
      p.melde(pfad, `unbekannter Übungstyp „${String(u.typ)}“`);
  }
}

/** Bildpfade „bilder/x.png“ in allen Texten durch die echte URL ersetzen. */
function ersetzeBilder<T>(wert: T, bilder: Record<string, string>): T {
  if (typeof wert === 'string') return wert.replace(/\]\(bilder\/([^)\s]+)\)/g, (m, name: string) => (bilder[name] ? `](${bilder[name]})` : m)) as T;
  if (Array.isArray(wert)) return wert.map((x) => ersetzeBilder(x, bilder)) as T;
  if (istObj(wert)) return Object.fromEntries(Object.entries(wert).map(([k, v]) => [k, ersetzeBilder(v, bilder)])) as T;
  return wert;
}

function fehlendeBilder(wert: unknown, bilder: Record<string, string>, aus: Set<string> = new Set()): Set<string> {
  if (typeof wert === 'string') for (const m of wert.matchAll(/\]\(bilder\/([^)\s]+)\)/g)) if (!bilder[m[1]]) aus.add(m[1]);
  if (Array.isArray(wert)) wert.forEach((x) => fehlendeBilder(x, bilder, aus));
  if (istObj(wert)) Object.values(wert).forEach((x) => fehlendeBilder(x, bilder, aus));
  return aus;
}

export function baueKurs(p: PaketDateien): PaketErgebnis {
  const kp = new Pruefer(`inhalte/${p.ordner}/kurs.json`);
  const fehler: string[] = [];
  if (!istObj(p.kurs)) return { kurs: null, fehler: [`inhalte/${p.ordner}/kurs.json fehlt oder ist kein JSON-Objekt`] };
  const k = p.kurs;
  const kursId = kp.id(k, '', new Set());
  kp.text(k, 'fach', '');
  kp.text(k, 'klasse', '');
  kp.text(k, 'titel', '');
  if (k.klausur !== undefined) {
    if (!istObj(k.klausur) || typeof k.klausur.datum !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(k.klausur.datum)) kp.melde('klausur', '„datum“ muss im Format JJJJ-MM-TT sein');
    else kp.text(k.klausur, 'titel', 'klausur');
  }
  fehler.push(...kp.fehler);

  const ids = new Set<string>();
  const themen: Thema[] = [];
  /** auch Themen mit Fehlern – damit Pfad-Meldungen nicht doppelt auftauchen */
  const deklariert = new Set<string>();
  const ordner = [...p.themen].sort((a, b) => a.ordner.localeCompare(b.ordner));
  if (!ordner.length) fehler.push(`inhalte/${p.ordner}: keine Themenordner mit thema.json gefunden`);

  ordner.forEach((td, i) => {
    const tp = new Pruefer(`inhalte/${p.ordner}/${td.ordner}/thema.json`);
    if (!istObj(td.json)) {
      fehler.push(`inhalte/${p.ordner}/${td.ordner}/thema.json ist kein JSON-Objekt`);
      return;
    }
    const t = td.json;
    const id = tp.id(t, '', ids);
    if (id) deklariert.add(id);
    tp.text(t, 'titel', '');
    tp.text(t, 'untertitel', '');
    if (!istText(td.erklaerung)) tp.melde('', 'erklaerung.md fehlt oder ist leer');
    else tp.formel(td.erklaerung, 'erklaerung.md');
    if (t.startStatus !== undefined && !STATUS.includes(t.startStatus as Status)) tp.melde('startStatus', `erlaubt: ${STATUS.join(', ')}`);
    if (t.abhaengig !== undefined && (!Array.isArray(t.abhaengig) || !t.abhaengig.every((x) => typeof x === 'string'))) tp.melde('abhaengig', 'muss eine Liste von Themen-Ids sein');

    const karten = t.karten === undefined ? [] : tp.liste(t, 'karten', '', 0);
    karten.forEach((x, j) => {
      const pf = `karten[${j}]`;
      tp.id(x, pf, ids);
      if (!KARTEN_TYPEN.includes(x.typ as KartenTyp)) tp.melde(pf, `„typ“ muss einer von ${KARTEN_TYPEN.join(', ')} sein`);
      tp.text(x, 'vorne', pf);
      tp.text(x, 'hinten', pf);
      tp.text(x, 'quelle', pf);
      tp.text(x, 'mehr', pf, true);
    });
    const uebungen = t.uebungen === undefined ? [] : tp.liste(t, 'uebungen', '', 0);
    uebungen.forEach((x, j) => {
      tp.id(x, `uebungen[${j}]`, ids);
      pruefeUebung(tp, x, `uebungen[${j}]`);
    });
    const formeln = t.formeln === undefined ? [] : tp.liste(t, 'formeln', '', 0);
    formeln.forEach((x, j) => {
      tp.text(x, 'name', `formeln[${j}]`);
      tp.text(x, 'tex', `formeln[${j}]`);
    });
    if (!karten.length && !uebungen.length) tp.melde('', 'ein Thema braucht mindestens eine Karteikarte oder Übung');
    for (const b of fehlendeBilder([t, td.erklaerung], td.bilder)) tp.melde('', `Bild „bilder/${b}“ nicht gefunden`);
    fehler.push(...tp.fehler);
    if (tp.fehler.length || !id) return;

    const nr = /^(\d+)-/.exec(td.ordner);
    const roh = ersetzeBilder({ t, erklaerung: td.erklaerung ?? '' }, td.bilder);
    themen.push({
      id,
      nr: nr ? String(Number(nr[1])) : String(i + 1),
      titel: roh.t.titel as string,
      untertitel: roh.t.untertitel as string,
      abhaengig: (roh.t.abhaengig as string[] | undefined) ?? [],
      startStatus: roh.t.startStatus as Status | undefined,
      neu: roh.t.neu === true,
      prioritaet: typeof roh.t.prioritaet === 'number' ? roh.t.prioritaet : i,
      erklaerung: roh.erklaerung,
      quelleErklaerung: typeof roh.t.quelleErklaerung === 'string' ? roh.t.quelleErklaerung : '',
      karten: (roh.t.karten as Karte[] | undefined) ?? [],
      uebungen: (roh.t.uebungen as Uebung[] | undefined) ?? [],
      generatoren: [],
      formeln: (roh.t.formeln as Formel[] | undefined) ?? [],
    });
  });

  // Abhängigkeiten und Lernpfad
  const themenIds = deklariert;
  for (const t of themen) for (const a of t.abhaengig) if (!themenIds.has(a)) fehler.push(`inhalte/${p.ordner}: Thema „${t.id}“ hängt von unbekanntem Thema „${a}“ ab`);
  let pfad: string[][] = themen.map((t) => [t.id]);
  if (k.pfad !== undefined) {
    if (!Array.isArray(k.pfad) || !k.pfad.every((z) => Array.isArray(z) && z.every((x) => typeof x === 'string'))) {
      fehler.push(`inhalte/${p.ordner}/kurs.json → pfad: muss eine Liste von Zeilen mit Themen-Ids sein, z. B. [["a"], ["b", "c"]]`);
    } else {
      pfad = k.pfad as string[][];
      const imPfad = pfad.flat();
      for (const x of imPfad) if (!themenIds.has(x)) fehler.push(`inhalte/${p.ordner}/kurs.json → pfad: unbekanntes Thema „${x}“`);
      for (const x of themenIds) if (!imPfad.includes(x)) fehler.push(`inhalte/${p.ordner}/kurs.json → pfad: Thema „${x}“ fehlt`);
    }
  }

  if (fehler.length || !kursId) return { kurs: null, fehler };
  return {
    kurs: {
      id: kursId,
      fach: k.fach as string,
      klasse: k.klasse as string,
      titel: k.titel as string,
      klausur: istObj(k.klausur) ? (k.klausur as Kurs['klausur']) : undefined,
      themen,
      pfad,
      entwurf: k.entwurf === true,
    },
    fehler: [],
  };
}

/** Alle Ids eines Kurses (je Art: Themen, Karten, Übungen, Generatoren) – müssen app-weit eindeutig sein. */
export function alleIds(k: Kurs): string[] {
  return k.themen.flatMap((t) => [`thema:${t.id}`, ...t.karten.map((x) => `karte:${x.id}`), ...t.uebungen.map((x) => `ueb:${x.id}`), ...t.generatoren.map((x) => `gen:${x.id}`)]);
}

/** Dateien aus import.meta.glob (Pfade wie „/inhalte/kurs/thema/datei“) nach Kursordnern gruppieren. */
export function gruppierePakete(
  kursJson: Record<string, unknown>,
  themaJson: Record<string, unknown>,
  erklaerungen: Record<string, string>,
  bilder: Record<string, string>,
): PaketDateien[] {
  const teile = (pfad: string) => pfad.replace(/^.*?inhalte\//, '').split('/');
  const pakete = new Map<string, PaketDateien>();
  const paket = (o: string) => {
    if (!pakete.has(o)) pakete.set(o, { ordner: o, kurs: undefined, themen: [] });
    return pakete.get(o)!;
  };
  const thema = (o: string, t: string) => {
    const p = paket(o);
    let td = p.themen.find((x) => x.ordner === t);
    if (!td) p.themen.push((td = { ordner: t, json: undefined, bilder: {} }));
    return td;
  };
  for (const [pfad, json] of Object.entries(kursJson)) paket(teile(pfad)[0]).kurs = json;
  for (const [pfad, json] of Object.entries(themaJson)) {
    const [o, t] = teile(pfad);
    thema(o, t).json = json;
  }
  for (const [pfad, md] of Object.entries(erklaerungen)) {
    const [o, t] = teile(pfad);
    thema(o, t).erklaerung = md;
  }
  for (const [pfad, url] of Object.entries(bilder)) {
    const [o, t, , name] = teile(pfad);
    thema(o, t).bilder[name] = url;
  }
  return [...pakete.values()];
}
