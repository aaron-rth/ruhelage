import { beforeEach, describe, expect, it } from 'vitest';
import { findeKarte, findeThema, kursMitId } from '../content/kurse';
import { leereDaten, useStore } from '../store/store';
import { aendereSet, erkenneTrenner, legeFachAn, legeKarteAn, leseListe, loescheFach, loescheKarte, lueckensatz } from './eigene';
import { istGestartet } from './fortschritt';
import { fuehreEigeneZusammen } from './zusammenfuehren';
import { pruefeTippen } from './tippen';

describe('eigene Karteikarten', () => {
  beforeEach(() => useStore.setState({ ...leereDaten() }));

  it('Fach mit Set und Karten wird zum normalen Kurs', () => {
    const { fachId, setId } = legeFachAn('Englisch', 'K1');
    aendereSet(setId, { titel: 'Unit 3', namen: ['Englisch', 'Deutsch'] });
    const id = legeKarteAn(setId, 'house', 'Haus');
    const k = kursMitId(fachId);
    expect(k.eigen).toBe(true);
    expect(k.fach).toBe('Englisch');
    expect(k.themen[0].titel).toBe('Unit 3');
    expect(findeKarte(id)?.karte).toMatchObject({ vorne: 'house', hinten: 'Haus', seiten: ['Englisch', 'Deutsch'] });
    expect(istGestartet(findeThema(setId)!, useStore.getState())).toBe(true);
  });

  it('Richtung: rückwärts und gemischt mit eigenem Lernstand je Richtung', () => {
    const { setId } = legeFachAn('Englisch', '');
    const id = legeKarteAn(setId, 'house', 'Haus');
    aendereSet(setId, { richtung: 'rueck', modus: 'tippen' });
    expect(findeThema(setId)!.karten.map((k) => [k.id, k.vorne, k.tippen])).toEqual([[`${id}~r`, 'Haus', true]]);
    aendereSet(setId, { richtung: 'gemischt' });
    expect(findeThema(setId)!.karten.map((k) => k.id)).toEqual([id, `${id}~r`]);
  });

  it('Löschen: Karte und ganzes Fach verschwinden', () => {
    const { fachId, setId } = legeFachAn('Latein', '');
    const id = legeKarteAn(setId, 'amare', 'lieben');
    loescheKarte(id);
    expect(findeThema(setId)!.karten).toEqual([]);
    loescheFach(fachId);
    expect(kursMitId(fachId).id).not.toBe(fachId);
  });

  it('Abgleich: neuerer Stand gewinnt, Gelöschtes bleibt gelöscht', () => {
    const a = { faecher: {}, sets: {}, karten: { k: { id: 'k', setId: 's', vorne: 'a', hinten: 'b', pos: 0, geaendert: 1 } } };
    const b = { faecher: {}, sets: {}, karten: { k: { id: 'k', setId: 's', vorne: '', hinten: '', pos: 0, geaendert: 2, geloescht: 2 } } };
    expect(fuehreEigeneZusammen(a, b).karten.k.geloescht).toBe(2);
    expect(fuehreEigeneZusammen(b, a).karten.k.geloescht).toBe(2);
  });
});

describe('Liste einfügen', () => {
  it('erkennt Trennzeichen', () => {
    expect(erkenneTrenner('house – Haus\ntree – Baum')).toBe(' – ');
    expect(erkenneTrenner('house\tHaus\ntree\tBaum')).toBe('\t');
    expect(leseListe('to go - gehen\nthe house - das Haus\n\n')).toEqual([['to go', 'gehen'], ['the house', 'das Haus']]);
    expect(leseListe('nur Text ohne Trenner')).toEqual([]);
  });
});

describe('Merkhilfe und Eintippen', () => {
  it('Lückensatz blendet die Antwort aus, ohne Wortteile zu treffen', () => {
    expect(lueckensatz('I live in a house with my family.', 'house')).toBe('I live in a ___ with my family.');
    expect(lueckensatz('Das Haus am Haushaltsweg', 'Haus')).toBe('Das ___ am Haushaltsweg');
    expect(lueckensatz('We go home', 'house, home')).toBe('We go ___');
  });

  it('prüft tolerant', () => {
    expect(pruefeTippen('Haus', 'das Haus, Gebäude')).toBe('richtig');
    expect(pruefeTippen('das Haus', 'Haus')).toBe('richtig');
    expect(pruefeTippen('gebäude', 'das Haus, Gebäude')).toBe('richtig');
    expect(pruefeTippen('  The House! ', 'the house')).toBe('richtig');
    expect(pruefeTippen('go', '(to) go')).toBe('richtig');
    expect(pruefeTippen('beautifull', 'beautiful')).toBe('fast');
    expect(pruefeTippen('Baum', 'Haus')).toBe('falsch');
    expect(pruefeTippen('', 'Haus')).toBe('falsch');
  });
});
