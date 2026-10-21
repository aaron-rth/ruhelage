import { describe, expect, it } from 'vitest';
import { besterAbschnitt, abschnitte } from './abschnitte';
import { ergebnisMerken, kannZurueck, karteBewerten, neueSitzung, weiter, zurueck, type SitzungsItem } from './sitzung';
import { alleThemen } from '../content/kurse';
import { laengsteSerie, streak, tagZaehlt, type TagesStand } from '../store/store';

const k = (id: string): SitzungsItem => ({ art: 'karte', id });

describe('Sitzung', () => {
  it('„nicht gewusst“ hängt die Karte einmal hinten an', () => {
    let s = neueSitzung([k('a'), k('b')], '2026-10-21');
    s = karteBewerten(s, 'nicht', null);
    expect(s.items.map((i) => i.id)).toEqual(['a', 'b', 'a']);
    expect(s.pos).toBe(1);
    expect(s.bilanz.karten.nicht).toBe(1);
  });

  it('zurückblättern und neu bewerten korrigiert Bilanz und Wiederholung', () => {
    let s = neueSitzung([k('a'), k('b'), k('c')], '2026-10-21');
    s = karteBewerten(s, 'nicht', { fach: 2, faellig: '2026-10-21', wiederholungen: 1, zuletzt: '2026-10-20' });
    expect(kannZurueck(s)).toBe(true);
    s = zurueck(s);
    expect(s.pos).toBe(0);
    s = karteBewerten(s, 'gewusst', null);
    expect(s.bilanz.karten).toEqual({ gewusst: 1, halb: 0, nicht: 0 });
    expect(s.items.map((i) => i.id)).toEqual(['a', 'b', 'c']);
    // der Leitner-Stand von vor der ersten Bewertung bleibt gemerkt
    expect(s.bewertet[0].vorher?.fach).toBe(2);
  });

  it('weiter überspringt ohne Bewertung und beendet am Ende', () => {
    let s = neueSitzung([k('a'), k('b')], '2026-10-21');
    s = weiter(s);
    expect(s.pos).toBe(1);
    expect(s.bilanz.karten.gewusst + s.bilanz.karten.halb + s.bilanz.karten.nicht).toBe(0);
    s = weiter(s);
    expect(s.fertig).toBe(true);
  });

  it('zurück lässt Aufgaben aus und Ergebnisse zählen nur einmal', () => {
    let s = neueSitzung([k('a'), { art: 'aufgabe', id: 'g', seed: 1 }, k('b')], '2026-10-21');
    s = weiter(weiter(s));
    expect(s.pos).toBe(2);
    expect(zurueck(s).pos).toBe(0);
    s = { ...s, pos: 1 };
    s = ergebnisMerken(ergebnisMerken(s, true), true);
    expect(s.bilanz.aufgaben).toEqual({ richtig: 1, gesamt: 1 });
  });
});

describe('Serie', () => {
  const t = (karten: number, aufgaben: number): TagesStand => ({ xp: 0, sekunden: 600, karten, aufgaben });
  it('nur Öffnen zählt nicht', () => {
    expect(tagZaehlt({ xp: 0, sekunden: 900, karten: 0, aufgaben: 0 })).toBe(false);
    expect(tagZaehlt(t(2, 0))).toBe(false);
    expect(tagZaehlt(t(3, 0))).toBe(true);
    expect(tagZaehlt(t(0, 1))).toBe(true);
  });
  it('zählt bis gestern, wenn heute noch nichts war', () => {
    const tage = { '2026-10-18': t(5, 0), '2026-10-19': t(0, 2), '2026-10-20': t(4, 1), '2026-10-21': t(1, 0) };
    expect(streak(tage, '2026-10-21')).toBe(3);
    expect(laengsteSerie({ ...tage, '2026-10-10': t(9, 9), '2026-10-11': t(9, 9) })).toBe(3);
  });
});

describe('Genauer erklärt', () => {
  it('jede Karte hat eine Zusatzerklärung', () => {
    const ohne = alleThemen().flatMap((th) => th.karten.filter((c) => !c.mehr || c.mehr.length < 60).map((c) => c.id));
    expect(ohne).toEqual([]);
  });

  it('jedes Thema lässt sich in Abschnitte zerlegen', () => {
    for (const th of alleThemen()) expect(abschnitte(th.erklaerung).length).toBeGreaterThan(1);
  });

  it('findet den passenden Abschnitt', () => {
    const th = alleThemen().find((x) => x.id === 'harmonisch')!;
    const liste = abschnitte(th.erklaerung);
    const karte = th.karten.find((c) => c.id === 'hm-knick-kraft')!;
    expect(liste[besterAbschnitt(liste, `${karte.vorne} ${karte.hinten}`)].titel).toMatch(/Knickbahn/);
  });
});
