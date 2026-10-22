import { describe, expect, it } from 'vitest';
import { kiPrompt, ANTWORT_PLATZHALTER, punkteSumme } from '../lib/kiPrompt';
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
