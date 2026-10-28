import { describe, expect, it } from 'vitest';
import { schwingungen } from '../content/schwingungen';
import { leereDaten } from '../store/store';
import { istGestartet } from './fortschritt';
import { baueHeute } from './heute';

const t = (id: string) => schwingungen.themen.find((x) => x.id === id)!;
const neueKartenThemen = (d: ReturnType<typeof leereDaten>) => {
  const plan = baueHeute(schwingungen, d, '2026-10-28', 1);
  const ids = new Set(plan.items.filter((i) => i.art === 'karte').map((i) => i.id));
  return new Set(schwingungen.themen.filter((x) => x.karten.some((k) => ids.has(k.id))).map((x) => x.id));
};

describe('Tagesrunde nur aus gestarteten Themen', () => {
  it('gestartet durch Lesen, Einschätzung oder von Hand', () => {
    const d = leereDaten();
    const r = t('resonanz');
    expect(istGestartet(r, d)).toBe(r.startStatus !== undefined && r.startStatus !== 'offen');
    d.einstellungen.gelesen = ['resonanz'];
    expect(istGestartet(r, d)).toBe(true);
    d.einstellungen.tagesrunde = { resonanz: false };
    expect(istGestartet(r, d)).toBe(false);
  });

  it('neue Karten kommen nur aus gestarteten Themen', () => {
    const d = leereDaten();
    for (const x of schwingungen.themen) d.einstellungen.tagesrunde[x.id] = x.id === 'fadenpendel';
    expect([...neueKartenThemen(d)]).toEqual(['fadenpendel']);
  });

  it('ohne gestartetes Thema: erste Zeile des Lernpfads', () => {
    const d = leereDaten();
    for (const x of schwingungen.themen) d.einstellungen.tagesrunde[x.id] = false;
    expect([...neueKartenThemen(d)].every((id) => schwingungen.pfad[0].includes(id))).toBe(true);
  });
});
