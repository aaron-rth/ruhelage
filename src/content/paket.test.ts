import { describe, expect, it } from 'vitest';
import { kiPrompt, ANTWORT_PLATZHALTER, punkteSumme } from '../lib/kiPrompt';
import { erzeugeRng } from '../lib/rng';
import { baueKurs, gruppierePakete, type PaketDateien } from './paket';
import type { SchreibUebung } from './types';

function paket(thema: Record<string, unknown>, kurs: Record<string, unknown> = {}): PaketDateien {
  return {
    ordner: 'test',
    kurs: { id: 'test-kurs', fach: 'Deutsch', klasse: '10', titel: 'Test', ...kurs },
    themen: [{ ordner: '01-eins', json: { id: 'eins', titel: 'Eins', untertitel: 'u', karten: [{ id: 'k1', typ: 'begriff', vorne: 'a', hinten: 'b', quelle: 'q' }], ...thema }, erklaerung: 'Text ![Bild](bilder/a.png)', bilder: { 'a.png': '/assets/a-123.png' } }],
  };
}

describe('baueKurs', () => {
  it('baut einen gültigen Kurs und ersetzt Bildpfade', () => {
    const { kurs, fehler } = baueKurs(paket({}));
    expect(fehler).toEqual([]);
    expect(kurs!.themen[0].nr).toBe('1');
    expect(kurs!.themen[0].erklaerung).toContain('](/assets/a-123.png)');
    expect(kurs!.pfad).toEqual([['eins']]);
    expect(kurs!.themen[0].generatoren).toEqual([]);
  });

  it('meldet typische Fehler mit Ort', () => {
    const { kurs, fehler } = baueKurs(
      paket({
        karten: [{ id: 'k1', typ: 'quatsch', vorne: 'a $x', hinten: '', quelle: 'q' }],
        uebungen: [
          { id: 'k1', typ: 'mc', frage: 'f', quelle: 'q', optionen: [{ text: 'a', warum: 'w' }, { text: 'b', warum: 'w' }] },
          { id: 'l1', typ: 'luecke', frage: 'f', quelle: 'q', text: 'nur [[1]]', luecken: [{ optionen: ['a', 'b'], richtig: 5 }] },
          { id: 's1', typ: 'schreiben', operator: 'zaubern', frage: 'f', quelle: 'q', erwartung: [], kriterien: [{ name: 'n', beschreibung: 'b', punkte: 0 }] },
        ],
      }),
    );
    expect(kurs).toBeNull();
    const alle = fehler.join('\n');
    expect(alle).toContain('inhalte/test/01-eins/thema.json → karten[0]');
    expect(alle).toMatch(/„typ“ muss einer von/);
    expect(alle).toMatch(/ungerade Anzahl von \$/);
    expect(alle).toMatch(/„hinten“ fehlt/);
    expect(alle).toMatch(/Id „k1“ kommt doppelt vor/);
    expect(alle).toMatch(/genau eine Option/);
    expect(alle).toMatch(/Platzhalter \[\[0\]\] fehlt/);
    expect(alle).toMatch(/Platzhalter \[\[1\]\] hat keine passende Lücke/);
    expect(alle).toMatch(/„richtig“ muss eine Zahl von 0 bis 1/);
    expect(alle).toMatch(/unbekannter Operator „zaubern“/);
    expect(alle).toMatch(/„erwartung“ muss eine Liste/);
    expect(alle).toMatch(/„punkte“ muss eine Zahl größer 0/);
  });

  it('prüft Lernpfad, Abhängigkeiten, Bilder und Klausurdatum', () => {
    const p = paket({ abhaengig: ['gibtsnicht'] }, { pfad: [['eins', 'zwei']], klausur: { datum: '6.11.2026', titel: 'K' } });
    let alle = baueKurs(p).fehler.join('\n');
    expect(alle).toMatch(/JJJJ-MM-TT/);
    expect(alle).toMatch(/hängt von unbekanntem Thema „gibtsnicht“ ab/);
    expect(alle).toMatch(/pfad: unbekanntes Thema „zwei“/);
    p.themen[0].erklaerung = '![x](bilder/fehlt.png)';
    alle = baueKurs(p).fehler.join('\n');
    expect(alle).toMatch(/Bild „bilder\/fehlt.png“ nicht gefunden/);
    // ein fehlerhaftes Thema zählt für den Pfad trotzdem als vorhanden
    expect(alle).not.toMatch(/pfad: unbekanntes Thema „eins“/);
  });

  it('gruppiert Glob-Ergebnisse nach Ordnern', () => {
    const g = gruppierePakete(
      { '/inhalte/a/kurs.json': { id: 'a' } },
      { '/inhalte/a/02-x/thema.json': { id: 'x' } },
      { '/inhalte/a/02-x/erklaerung.md': 'md' },
      { '/inhalte/a/02-x/bilder/b.png': '/url/b.png' },
    );
    expect(g).toEqual([{ ordner: 'a', kurs: { id: 'a' }, themen: [{ ordner: '02-x', json: { id: 'x' }, erklaerung: 'md', bilder: { 'b.png': '/url/b.png' } }] }]);
  });
});

describe('Rechenaufgaben in Paketen', () => {
  const aufgabe = (teil: Record<string, unknown>, extra: Record<string, unknown> = {}) => ({
    id: 'r1',
    titel: 'Steigung',
    kontext: '$f(x) = {a}x^2$',
    werte: { a: [2, 5], x0: [1, 3] },
    teile: [{ frage: 'Berechne $f\'({x0})$.', ergebnis: '2*a*x0', hilfen: ['a', 'b', 'c'], loesung: '$f\'({x0}) = {2*a*x0}$', ...teil }],
    ...extra,
  });

  it('wird zum Rechentrainer-Generator mit neuen Zahlen je Runde', () => {
    const { kurs, fehler } = baueKurs(paket({ rechenaufgaben: [aufgabe({})] }));
    expect(fehler).toEqual([]);
    const g = kurs!.themen[0].generatoren[0];
    expect(g.art).toBe('rechnen');
    const a = g.erzeuge(erzeugeRng(3));
    const w = a.werte!;
    expect(a.teile[0].antwort).toMatchObject({ art: 'zahl', wert: 2 * w.a * w.x0 });
    expect(a.kontext).toBe(`$f(x) = ${w.a}x^2$`);
  });

  it('meldet Formelfehler, Null-Ergebnisse und falsche Hilfen', () => {
    const f1 = baueKurs(paket({ rechenaufgaben: [aufgabe({ ergebnis: '2*q' })] })).fehler.join('\n');
    expect(f1).toMatch(/unbekannte Variable „q“/);
    const f2 = baueKurs(paket({ rechenaufgaben: [aufgabe({ ergebnis: 'a - a' })] })).fehler.join('\n');
    expect(f2).toMatch(/ergebnis ist 0/);
    const f3 = baueKurs(paket({ rechenaufgaben: [aufgabe({ hilfen: ['nur eine'] })] })).fehler.join('\n');
    expect(f3).toMatch(/hilfen/);
    const f4 = baueKurs(paket({ rechenaufgaben: [aufgabe({}, { werte: { a: [5, 1] } })] })).fehler.join('\n');
    expect(f4).toMatch(/werte\.a/);
  });
});

describe('kiPrompt', () => {
  const u: SchreibUebung = {
    id: 's',
    typ: 'schreiben',
    operator: 'erlaeutern',
    frage: 'Erläutern Sie X.',
    quelle: 'q',
    erwartung: ['Punkt A', 'Punkt B'],
    kriterien: [
      { name: 'Fachlich', beschreibung: 'richtig', punkte: 4 },
      { name: 'Darstellung', beschreibung: 'klar', punkte: 2 },
    ],
  };

  it('enthält Aufgabe, Operator, Erwartung, Kriterien und Antwort', () => {
    const p = kiPrompt(u, { fach: 'Physik', klasse: 'K1' }, 'Meine Antwort.');
    expect(p).toContain('Lehrkraft für Physik');
    expect(p).toContain('Erläutern Sie X.');
    expect(p).toContain('**Erläutern** (Anforderungsbereich II)');
    expect(p).toContain('- Punkt B');
    expect(p).toContain('2. Darstellung (2 P.): klar');
    expect(p).toContain('insgesamt 6 Punkte');
    expect(p).toContain('"""\nMeine Antwort.\n"""');
    expect(p).not.toContain('\n\n\n');
    expect(punkteSumme(u)).toBe(6);
  });

  it('setzt ohne Antwort einen Platzhalter', () => {
    expect(kiPrompt(u, { fach: 'Physik', klasse: 'K1' }, '   ')).toContain(ANTWORT_PLATZHALTER);
  });
});
