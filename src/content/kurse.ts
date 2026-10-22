// Registry aller Kurse: fest eingebaute (mit Rechen-Generatoren) und Inhaltspakete aus inhalte/.
import { schwingungen } from './schwingungen';
import { alleIds, baueKurs, gruppierePakete } from './paket';
import type { Generator, Karte, Kurs, Thema, Uebung } from './types';

const EINGEBAUT: Kurs[] = [schwingungen];

/** Inhaltspakete laden. Fehlerhafte Pakete werden übersprungen (der Test in CI meldet sie vorher). */
function ladePakete(): Kurs[] {
  const pakete = gruppierePakete(
    import.meta.glob('/inhalte/*/kurs.json', { eager: true, import: 'default' }),
    import.meta.glob('/inhalte/*/*/thema.json', { eager: true, import: 'default' }),
    import.meta.glob<string>('/inhalte/*/*/erklaerung.md', { eager: true, query: '?raw', import: 'default' }),
    import.meta.glob<string>('/inhalte/*/*/bilder/*', { eager: true, query: '?url', import: 'default' }),
  );
  const kurse: Kurs[] = [];
  const ids = new Set(EINGEBAUT.flatMap(alleIds));
  const kursIds = new Set(EINGEBAUT.map((k) => k.id));
  for (const p of pakete) {
    const { kurs, fehler } = baueKurs(p);
    if (!kurs) {
      console.error(`Inhaltspaket „${p.ordner}“ übersprungen:\n${fehler.join('\n')}`);
      continue;
    }
    if (kurs.entwurf && !import.meta.env.DEV) continue;
    const doppelt = alleIds(kurs).filter((x) => ids.has(x));
    if (kursIds.has(kurs.id) || doppelt.length) {
      console.error(`Inhaltspaket „${p.ordner}“ übersprungen: Id schon vergeben (${kursIds.has(kurs.id) ? kurs.id : doppelt.join(', ')})`);
      continue;
    }
    alleIds(kurs).forEach((x) => ids.add(x));
    kursIds.add(kurs.id);
    kurse.push(kurs);
  }
  return kurse;
}

export const KURSE: Kurs[] = [...EINGEBAUT, ...ladePakete()];

/** Kurs zur Id – unbekannte Ids fallen auf den ersten Kurs zurück. */
export const kursMitId = (id: string | undefined): Kurs => KURSE.find((k) => k.id === id) ?? KURSE[0];

export const alleThemen = (): Thema[] => KURSE.flatMap((k) => k.themen);

const themenIndex = new Map<string, Thema>();
const kursVonThemaIndex = new Map<string, Kurs>();
const kartenIndex = new Map<string, { karte: Karte; thema: Thema }>();
const uebungsIndex = new Map<string, { uebung: Uebung; thema: Thema }>();
const generatorIndex = new Map<string, { generator: Generator; thema: Thema }>();

for (const k of KURSE)
  for (const t of k.themen) {
    if (themenIndex.has(t.id)) throw new Error(`Doppelte Themen-Id: ${t.id}`);
    themenIndex.set(t.id, t);
    kursVonThemaIndex.set(t.id, k);
    for (const x of t.karten) kartenIndex.set(x.id, { karte: x, thema: t });
    for (const u of t.uebungen) uebungsIndex.set(u.id, { uebung: u, thema: t });
    for (const g of t.generatoren) generatorIndex.set(g.id, { generator: g, thema: t });
  }

export const findeThema = (id: string) => themenIndex.get(id);
export const kursVonThema = (themaId: string) => kursVonThemaIndex.get(themaId);
export const findeKarte = (id: string) => kartenIndex.get(id);
export const findeUebung = (id: string) => uebungsIndex.get(id);
export const findeGenerator = (id: string) => generatorIndex.get(id);
