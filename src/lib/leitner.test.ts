import { describe, expect, it } from 'vitest';
import { bewerte, istFaellig, kartenWert } from './leitner';

const H = '2026-10-21';

describe('Leitner', () => {
  it('neue Karte gewusst → Fach 2, morgen fällig', () => {
    const s = bewerte(undefined, 'gewusst', H);
    expect(s.fach).toBe(2);
    expect(s.faellig).toBe('2026-10-22');
  });
  it('steigt bis Fach 5 und bleibt dort', () => {
    let s = bewerte(undefined, 'gewusst', H);
    for (let i = 0; i < 10; i++) s = bewerte(s, 'gewusst', H);
    expect(s.fach).toBe(5);
    expect(s.faellig).toBe('2026-10-28');
  });
  it('nicht → zurück in Fach 1, heute fällig', () => {
    let s = bewerte(undefined, 'gewusst', H);
    s = bewerte(s, 'gewusst', H);
    s = bewerte(s, 'nicht', H);
    expect(s.fach).toBe(1);
    expect(istFaellig(s, H)).toBe(true);
  });
  it('halb → bleibt im Fach, morgen fällig', () => {
    let s = bewerte(undefined, 'gewusst', H);
    s = bewerte(s, 'gewusst', H); // Fach 3
    s = bewerte(s, 'halb', H);
    expect(s.fach).toBe(3);
    expect(s.faellig).toBe('2026-10-22');
  });
  it('Abstände 0/1/2/4/7 Tage', () => {
    const tage = [1, 2, 4, 7];
    let s = bewerte(undefined, 'nicht', H);
    expect(s.faellig).toBe(H);
    for (const t of tage) {
      s = bewerte(s, 'gewusst', H);
      const d = new Date(2026, 9, 21 + t);
      expect(s.faellig).toBe(`2026-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`);
    }
  });
  it('Fälligkeit und Lernwert', () => {
    expect(istFaellig(undefined, H)).toBe(false);
    expect(kartenWert(undefined)).toBe(0);
    expect(kartenWert({ fach: 5, faellig: H, wiederholungen: 4, zuletzt: H })).toBe(1);
  });
});
