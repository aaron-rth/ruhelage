import { describe, expect, it } from 'vitest';
import { parseZahl, pruefeWinkel, pruefeZahl, zerlege } from './antwort';
import { findeEinheit } from './einheiten';

describe('Zahlen einlesen', () => {
  it('akzeptiert Komma und Punkt', () => {
    expect(parseZahl('4,2')).toBeCloseTo(4.2);
    expect(parseZahl('4.2')).toBeCloseTo(4.2);
    expect(parseZahl(',5')).toBeCloseTo(0.5);
    expect(parseZahl('  -0,25 ')).toBeCloseTo(-0.25);
    expect(parseZahl('−3,1')).toBeCloseTo(-3.1);
  });
  it('akzeptiert Zehnerpotenzen', () => {
    expect(parseZahl('4,2e-3')).toBeCloseTo(4.2e-3);
    expect(parseZahl('4,2E3')).toBeCloseTo(4200);
    expect(parseZahl('4,2·10^-3')).toBeCloseTo(4.2e-3);
    expect(parseZahl('4,2*10^(-3)')).toBeCloseTo(4.2e-3);
    expect(parseZahl('1,5 x 10^4')).toBeCloseTo(15000);
  });
  it('trennt Zahl und Einheit', () => {
    expect(zerlege('4,2 cm')).toMatchObject({ zahl: 4.2, rest: 'cm', sig: 2 });
    expect(zerlege('2 ms').rest).toBe('ms');
    expect(zerlege('3,0 m/s²').rest).toBe('m/s²');
    expect(zerlege('abc').zahl).toBeNull();
  });
});

describe('Einheiten erkennen', () => {
  it('erkennt Schreibweisen', () => {
    expect(findeEinheit('m/s²')?.key).toBe('m/s^2');
    expect(findeEinheit('m/s^2')?.key).toBe('m/s^2');
    expect(findeEinheit('N / m')?.key).toBe('N/m');
    expect(findeEinheit('1/s')?.key).toBe('1/s');
    expect(findeEinheit('s^-1')?.key).toBe('1/s');
    expect(findeEinheit('hz')?.key).toBe('Hz');
    expect(findeEinheit('ms')?.key).toBe('ms');
    expect(findeEinheit('km/h')?.key).toBe('km/h');
    expect(findeEinheit('sek')?.key).toBe('s');
    expect(findeEinheit('kg/m³')?.key).toBe('kg/m^3');
    expect(findeEinheit('quatsch')).toBeUndefined();
  });
});

describe('Zahl-Antworten prüfen', () => {
  const a = { art: 'zahl' as const, wert: 0.0421, einheit: 'm' };
  it('2 % Toleranz', () => {
    expect(pruefeZahl('0,0421', 'm', a).status).toBe('richtig');
    expect(pruefeZahl('0,042', 'm', a).status).toBe('richtig');
    expect(pruefeZahl('0,0425', 'm', a).status).toBe('richtig');
    expect(pruefeZahl('0,043', 'm', a).status).toBe('falsch');
    expect(pruefeZahl('0,045', 'm', a).status).toBe('falsch');
  });
  it('akzeptiert korrekt gerundete Werte mit 2 Stellen', () => {
    const b = { art: 'zahl' as const, wert: 0.1151, einheit: 's' };
    expect(pruefeZahl('0,12', 's', b).status).toBe('richtig');
    expect(pruefeZahl('0,11', 's', b).status).toBe('falsch');
    expect(pruefeZahl('115', 'ms', b).status).toBe('richtig');
    expect(pruefeZahl('0,1', 's', b).status).toBe('falsch'); // nur 1 Stelle
  });
  it('rechnet Einheiten um (Menü und getippt)', () => {
    expect(pruefeZahl('4,21', 'cm', a).status).toBe('richtig');
    expect(pruefeZahl('42,1 mm', 'm', a).status).toBe('richtig');
    expect(pruefeZahl('4,21 cm', 'm', a).status).toBe('richtig');
  });
  it('erkennt falsche Dimension', () => {
    const r = pruefeZahl('4,21 s', 'm', a);
    expect(r.status).toBe('falsch');
    expect(r.hinweis).toMatch(/passt nicht/);
  });
  it('gibt Hinweise zu Vorzeichen, Zehnerpotenz und 2π', () => {
    expect(pruefeZahl('-0,0421', 'm', a).hinweis).toMatch(/Vorzeichen/);
    expect(pruefeZahl('4,21', 'm', a).hinweis).toMatch(/Zehnerpotenz/);
    expect(pruefeZahl(String(0.0421 * 2 * Math.PI), 'm', a).hinweis).toMatch(/2π/);
  });
  it('nutzt typische Fehler', () => {
    const b = { ...a, typischeFehler: [{ wert: 0.1, hinweis: 'Masse der ganzen Säule!' }] };
    expect(pruefeZahl('0,1', 'm', b).hinweis).toBe('Masse der ganzen Säule!');
  });
  it('meldet unbekannte Einheiten als ungültig', () => {
    expect(pruefeZahl('4 furlong', 'm', a).status).toBe('ungueltig');
    expect(pruefeZahl('', 'm', a).status).toBe('ungueltig');
  });
  it('Frequenz: Hz und 1/s sind gleichwertig', () => {
    const w = { art: 'zahl' as const, wert: 6.28, einheit: '1/s' };
    expect(pruefeZahl('6,28', 'Hz', w).status).toBe('richtig');
  });
});

describe('Winkel prüfen', () => {
  const a = { art: 'winkel' as const, wert: 2.62, periodisch: true, typischeFehler: [{ wert: 0.52, hinweis: 'arcsin-Falle' }] };
  it('rad und Grad', () => {
    expect(pruefeWinkel('2,62', 'rad', a).status).toBe('richtig');
    expect(pruefeWinkel('150', '°', a).status).toBe('richtig');
    expect(pruefeWinkel('150°', 'rad', a).status).toBe('richtig');
  });
  it('modulo 2π', () => {
    expect(pruefeWinkel(String(2.62 - 2 * Math.PI), 'rad', a).status).toBe('richtig');
  });
  it('erkennt die arcsin-Falle und Gradfehler', () => {
    expect(pruefeWinkel('0,52', 'rad', a).hinweis).toBe('arcsin-Falle');
    expect(pruefeWinkel('150', 'rad', a).hinweis).toMatch(/Grad/);
    expect(pruefeWinkel(String(2.62 - Math.PI), 'rad', a).hinweis).toMatch(/π/);
  });
});
