import { beforeEach, describe, expect, it } from 'vitest';
import { useStore, STANDARD_EINSTELLUNGEN } from '../store/store';
import { aktiverKurs, fuegeKursHinzu, meineKurse, setzeKursFertig, setzeThemaAusgeblendet } from './kurs';

const e = () => useStore.getState().einstellungen;

describe('Meine Fächer', () => {
  beforeEach(() => useStore.setState({ einstellungen: { ...STANDARD_EINSTELLUNGEN } }));

  it('der aktive Kurs zählt immer zu meinen Fächern', () => {
    expect(meineKurse({ ...e(), meineKurse: [] }).laufend.map((k) => k.id)).toEqual(['schwingungen']);
  });

  it('hinzufügen öffnet den Kurs, fertig markieren blendet aus und wechselt', () => {
    fuegeKursHinzu('beispiel-deutsch');
    expect(e().kurs).toBe('beispiel-deutsch');
    expect(meineKurse(e()).laufend.map((k) => k.id).sort()).toEqual(['beispiel-deutsch', 'schwingungen']);
    setzeKursFertig('beispiel-deutsch', true);
    expect(e().kurs).toBe('schwingungen');
    expect(meineKurse(e()).fertig.map((k) => k.id)).toEqual(['beispiel-deutsch']);
    setzeKursFertig('beispiel-deutsch', false);
    expect(e().kurs).toBe('beispiel-deutsch');
    expect(meineKurse(e()).fertig).toEqual([]);
  });

  it('ausgeblendete Themen fehlen in Themen und Lernpfad', () => {
    setzeThemaAusgeblendet('resonanz', true);
    const k = aktiverKurs();
    expect(k.themen.some((t) => t.id === 'resonanz')).toBe(false);
    expect(k.pfad.flat()).not.toContain('resonanz');
    expect(k.pfad.every((z) => z.length > 0)).toBe(true);
    setzeThemaAusgeblendet('resonanz', false);
    expect(aktiverKurs().themen.some((t) => t.id === 'resonanz')).toBe(true);
  });
});
