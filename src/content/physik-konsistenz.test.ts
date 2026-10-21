// Physikalische Konsistenz der einzelnen Generatoren: Werte unabhängig nachrechnen.
import { describe, expect, it } from 'vitest';
import { erzeugeRng } from '../lib/rng';
import { findeGenerator } from './kurse';
import type { Aufgabe } from './types';

const G = 9.81;
const N = 200;

function lauf(id: string, pruefe: (a: Aufgabe, w: Record<string, number>) => void) {
  const g = findeGenerator(id)?.generator;
  expect(g, `Generator ${id} fehlt`).toBeDefined();
  for (let s = 1; s <= N; s++) {
    const a = g!.erzeuge(erzeugeRng(s));
    pruefe(a, a.werte ?? {});
  }
}
const nah = (a: number, b: number, rel = 1e-9) => expect(Math.abs(a - b)).toBeLessThanOrEqual(Math.abs(b) * rel + 1e-12);
const wert = (a: Aufgabe, i: number) => {
  const x = a.teile[i].antwort;
  if (x.art !== 'zahl' && x.art !== 'winkel') throw new Error('keine Zahl');
  return x.wert;
};

describe('Thema 3 – Federpendel', () => {
  it('fe-periode: T aus ω zurückgerechnet, f = 1/T', () =>
    lauf('fe-periode', (a, w) => {
      nah(2 * Math.PI / wert(a, 2), wert(a, 0));
      nah(wert(a, 1) * wert(a, 0), 1);
      nah(wert(a, 2) ** 2, w.D / w.m);
      expect(wert(a, 0)).toBeGreaterThan(0.05);
      expect(wert(a, 0)).toBeLessThan(5);
    }));
  it('fe-d-messung: D·Δs = F und T passt zu D', () =>
    lauf('fe-d-messung', (a, w) => {
      nah(wert(a, 0) * w.ds, w.F);
      nah((wert(a, 1) / (2 * Math.PI)) ** 2 * wert(a, 0), w.m);
    }));
  it('fe-kombination: Reihe weicher als jede Feder, parallel härter', () =>
    lauf('fe-kombination', (a, w) => {
      const D = wert(a, 0);
      if (w.reihe) expect(D).toBeLessThan(Math.min(w.D1, w.D2));
      else nah(D, w.D1 + w.D2);
      nah((wert(a, 1) / (2 * Math.PI)) ** 2 * D, w.m);
    }));
  it('fe-vertikal: T = 2π√(Δℓ/g) und = 2π√(m/D)', () =>
    lauf('fe-vertikal', (a, w) => {
      nah(wert(a, 1), 2 * Math.PI * Math.sqrt(w.dl / G));
      nah(wert(a, 1), 2 * Math.PI * Math.sqrt(w.m / wert(a, 0)));
    }));
  it('fe-fahrzeug: zwei Federn tragen die Zusatzlast', () =>
    lauf('fe-fahrzeug', (a, w) => {
      nah(2 * wert(a, 0) * w.dx, w.dm * G);
      expect(wert(a, 1)).toBeGreaterThan(0.2);
      expect(wert(a, 1)).toBeLessThan(3);
    }));
  it('fe-astronaut: Masse der Person plausibel', () =>
    lauf('fe-astronaut', (a) => {
      expect(wert(a, 1)).toBeGreaterThan(40);
      expect(wert(a, 1)).toBeLessThan(110);
    }));
  it('fe-kennlinie: Gerade hat Steigung −D', () =>
    lauf('fe-kennlinie', (a, w) => {
      const f = a.plot!.kurven[0].f;
      nah(f(10), -w.D * 0.1);
      nah(f(0), 0);
    }));
});
