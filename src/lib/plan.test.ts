import { describe, expect, it } from 'vitest';
import { AKTIVER_KURS } from '../content/kurse';
import { leereDaten } from '../store/store';
import { plusTage } from './datum';
import { wischRichtung } from './geraet';
import { bewerte, neuTakten, TAKTE } from './leitner';
import { baueLernplan, heuteDran } from './plan';

describe('Lernplan', () => {
  const h = '2026-10-21';
  const d = leereDaten();

  it('verteilt jedes offene Thema bis zum Tag vor der Klausur, mit Wiederholung am Ende', () => {
    const plan = baueLernplan(AKTIVER_KURS, d, h, '2026-11-06')!;
    expect(plan.restTage).toBe(16);
    expect(plan.tage).toHaveLength(16);
    expect(plan.tage[0].datum).toBe(h);
    expect(plan.tage.at(-1)!.datum).toBe(plusTage('2026-11-06', -1));
    expect(plan.tage.slice(-2).every((t) => t.art === 'wiederholen')).toBe(true);
    const imPlan = new Set(plan.tage.filter((t) => t.art === 'lernen').flatMap((t) => t.eintraege.map((e) => e.thema.id)));
    expect(imPlan.size + plan.fertig.length).toBe(AKTIVER_KURS.themen.length);
  });

  it('Grundlagen kommen vor den Themen, die darauf aufbauen', () => {
    const plan = baueLernplan(AKTIVER_KURS, d, h, '2026-11-06')!;
    const erstesMal = new Map<string, number>();
    plan.tage.forEach((t, i) => t.eintraege.forEach((e) => !erstesMal.has(e.thema.id) && erstesMal.set(e.thema.id, i)));
    expect(erstesMal.get('bewegungen')!).toBeLessThanOrEqual(erstesMal.get('bewegungsgesetze')!);
    expect(erstesMal.get('bewegungsgesetze')!).toBeLessThanOrEqual(erstesMal.get('phase')!);
    expect(heuteDran(plan, h).length).toBeGreaterThan(0);
  });

  it('ohne Klausur in der Zukunft gibt es keinen Plan', () => {
    expect(baueLernplan(AKTIVER_KURS, d, h, h)).toBeNull();
    expect(baueLernplan(AKTIVER_KURS, d, h, '2026-10-01')).toBeNull();
  });
});

describe('Wiederholungsabstände', () => {
  it('kürzerer Takt holt Karten früher zurück', () => {
    const s = bewerte(bewerte(undefined, 'gewusst', '2026-10-01', TAKTE.kurz.intervalle), 'gewusst', '2026-10-02', TAKTE.kurz.intervalle);
    expect(s.fach).toBe(3);
    expect(s.faellig).toBe('2026-10-03');
    const neu = neuTakten({ k: { fach: 5, faellig: '2026-10-20', wiederholungen: 4, zuletzt: '2026-10-13' } }, TAKTE.sehrKurz.intervalle);
    expect(neu.k.faellig).toBe('2026-10-15');
  });
});

describe('Wischen', () => {
  it('erkennt Richtung und ignoriert kurze Bewegungen', () => {
    expect(wischRichtung(120, 10)).toBe('rechts');
    expect(wischRichtung(-120, 30)).toBe('links');
    expect(wischRichtung(20, -130)).toBe('oben');
    expect(wischRichtung(30, 20)).toBeNull();
  });
});
