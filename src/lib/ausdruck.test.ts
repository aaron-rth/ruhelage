import { describe, expect, it } from 'vitest';
import { pruefeWinkel, pruefeZahl, zerlege } from './antwort';
import { leseAusdruck } from './ausdruck';

function nah(a: number | null | undefined, b: number) {
  expect(a).toBeTypeOf('number');
  expect(Math.abs((a as number) - b)).toBeLessThan(1e-9 * Math.max(1, Math.abs(b)));
}

describe('Rechenausdrücke', () => {
  it('Grundrechenarten, Brüche und Klammern', () => {
    nah(leseAusdruck('3/4')!.wert, 0.75);
    nah(leseAusdruck('3:4')!.wert, 0.75);
    nah(leseAusdruck('1,5*2')!.wert, 3);
    nah(leseAusdruck('(1+2)·3')!.wert, 9);
    nah(leseAusdruck('2 - 0,5')!.wert, 1.5);
    nah(leseAusdruck('-3/2')!.wert, -1.5);
  });

  it('Potenzen, Zehnerpotenzen, Wurzeln, π', () => {
    nah(leseAusdruck('2^3')!.wert, 8);
    nah(leseAusdruck('10^-3')!.wert, 1e-3);
    nah(leseAusdruck('4,2·10^-3')!.wert, 4.2e-3);
    nah(leseAusdruck('4,2x10^-3')!.wert, 4.2e-3);
    nah(leseAusdruck('4,2e-3')!.wert, 4.2e-3);
    nah(leseAusdruck('10⁻³')!.wert, 1e-3);
    nah(leseAusdruck('3²')!.wert, 9);
    nah(leseAusdruck('√2')!.wert, Math.SQRT2);
    nah(leseAusdruck('sqrt(2)')!.wert, Math.SQRT2);
    nah(leseAusdruck('wurzel(9)')!.wert, 3);
    nah(leseAusdruck('2π/5')!.wert, (2 * Math.PI) / 5);
    nah(leseAusdruck('2*pi*sqrt(0,5/9,81)')!.wert, 2 * Math.PI * Math.sqrt(0.5 / 9.81));
    nah(leseAusdruck('-2^2')!.wert, -4);
  });

  it('trennt Ausdruck und Einheit', () => {
    expect(zerlege('3/4 m')).toMatchObject({ zahl: 0.75, rest: 'm', rechnung: true });
    expect(zerlege('9,81 m/s^2')).toMatchObject({ zahl: 9.81, rest: 'm/s^2', rechnung: false, sig: 3 });
    expect(zerlege('2,5 1/s')).toMatchObject({ zahl: 2.5, rest: '1/s' });
    expect(zerlege('1/2 m/s')).toMatchObject({ zahl: 0.5, rest: 'm/s' });
    expect(zerlege('4,2·10^-3 s')).toMatchObject({ rest: 's', sig: 2, rechnung: false });
    expect(zerlege('45°')).toMatchObject({ zahl: 45, rest: '°' });
    expect(zerlege('m/s').zahl).toBeNull();
    expect(zerlege('1/0').zahl).toBeNull();
    expect(zerlege('(2+3').zahl).toBeNull();
  });

  it('Antworten mit Rechnung werden geprüft', () => {
    const a = { art: 'zahl' as const, wert: 0.75, einheit: 's' };
    expect(pruefeZahl('3/4', 's', a).status).toBe('richtig');
    expect(pruefeZahl('3/4 s', 'ms', a).status).toBe('richtig');
    expect(pruefeZahl('750/1000', 's', a).status).toBe('richtig');
    expect(pruefeZahl('3/5', 's', a).status).toBe('falsch');
    const w = { art: 'winkel' as const, wert: Math.PI / 4 };
    expect(pruefeWinkel('π/4', 'rad', w).status).toBe('richtig');
    expect(pruefeWinkel('pi/4', 'rad', w).status).toBe('richtig');
  });
});
