// Prüft jeden Rechengenerator mit vielen Zufallsseeds auf Plausibilität.
import { describe, expect, it } from 'vitest';
import { einheit } from '../lib/einheiten';
import { erzeugeRng } from '../lib/rng';
import { alleThemen } from './kurse';
import type { Aufgabe, Generator } from './types';

const SEEDS = 400;

function alleTexte(a: Aufgabe): string[] {
  const t = [a.titel, a.kontext];
  for (const teil of a.teile) {
    t.push(teil.frage, teil.loesung, ...teil.hilfen);
    if (teil.antwort.art === 'auswahl') t.push(...teil.antwort.optionen);
  }
  return t;
}

const generatoren: { g: Generator; thema: string }[] = alleThemen().flatMap((t) => t.generatoren.map((g) => ({ g, thema: t.id })));

describe('Generatoren – allgemeine Plausibilität', () => {
  it('es gibt Generatoren und alle Ids sind eindeutig', () => {
    expect(generatoren.length).toBeGreaterThan(0);
    const ids = generatoren.map((x) => x.g.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  for (const { g, thema } of generatoren) {
    it(`${thema} / ${g.id}`, () => {
      for (let seed = 1; seed <= SEEDS; seed++) {
        const a = g.erzeuge(erzeugeRng(seed));
        expect(a.teile.length, 'mindestens ein Teil').toBeGreaterThan(0);
        // gleicher Seed → gleiche Aufgabe
        const b = g.erzeuge(erzeugeRng(seed));
        expect(b.kontext).toBe(a.kontext);
        for (const text of alleTexte(a)) {
          expect(text, `Seed ${seed}`).not.toMatch(/NaN|undefined|Infinity|\[object/);
        }
        for (const t of a.teile) {
          expect(t.hilfen.length).toBe(3);
          const ant = t.antwort;
          if (ant.art === 'zahl') {
            expect(Number.isFinite(ant.wert), `Seed ${seed}: ${t.frage}`).toBe(true);
            expect(() => einheit(ant.einheit)).not.toThrow();
            expect(Math.abs(ant.wert), `Seed ${seed}: ${t.frage} sollte nicht 0 sein`).toBeGreaterThan(1e-12);
            expect(Math.abs(ant.wert)).toBeLessThan(1e9);
            // typische Fehler dürfen nicht mit der richtigen Lösung zusammenfallen
            for (const f of ant.typischeFehler ?? []) {
              expect(Math.abs(f.wert - ant.wert) > Math.abs(ant.wert) * (ant.toleranz ?? 0.02), `Seed ${seed}: Fehlerwert = Lösung bei „${f.hinweis}“`).toBe(true);
            }
          }
          if (ant.art === 'winkel') {
            expect(Number.isFinite(ant.wert)).toBe(true);
          }
          if (ant.art === 'auswahl') {
            expect(ant.richtig).toBeGreaterThanOrEqual(0);
            expect(ant.richtig).toBeLessThan(ant.optionen.length);
            expect(new Set(ant.optionen).size, `Seed ${seed}: doppelte Optionen`).toBe(ant.optionen.length);
          }
          if (ant.art === 'klick') {
            expect(ant.ziele.length).toBeGreaterThan(0);
            const plot = t.plot ?? a.plot;
            expect(plot).toBeDefined();
            for (const z of ant.ziele) {
              expect(z).toBeGreaterThanOrEqual(plot!.x[0]);
              expect(z).toBeLessThanOrEqual(plot!.x[1]);
            }
          }
        }
      }
    });
  }
});
