import { describe, expect, it } from 'vitest';
import { fuelle, rechne } from './formel';

describe('rechne', () => {
  it('Punkt vor Strich, Potenzen, Klammern, Vorzeichen', () => {
    expect(rechne('2 + 3*4')).toBe(14);
    expect(rechne('-2^2')).toBe(-4);
    expect(rechne('(-2)^2')).toBe(4);
    expect(rechne('2^-1')).toBe(0.5);
    expect(rechne('3*a*x0^2', { a: 2, x0: -1 })).toBe(6);
  });
  it('Funktionen, Konstanten, Vergleiche', () => {
    expect(rechne('sqrt(16) + abs(-2)')).toBe(6);
    expect(rechne('runde(pi, 2)')).toBe(3.14);
    expect(rechne('grad(atan(1))')).toBeCloseTo(45);
    expect(rechne('a != 0 && b > 1', { a: 1, b: 2 })).toBe(1);
    expect(rechne('a == 0 || b < 1', { a: 1, b: 2 })).toBe(0);
  });
  it('meldet Unbekanntes statt still falsch zu rechnen', () => {
    expect(() => rechne('2*q')).toThrow(/unbekannte Variable/);
    expect(() => rechne('foo(2)')).toThrow(/unbekannte Funktion/);
    expect(() => rechne('2 +')).toThrow();
  });
});

describe('fuelle', () => {
  const w = { a: 2, b: -3, c: 2.5 };
  it('setzt Werte ein, lässt TeX-Klammern in Ruhe', () => {
    expect(fuelle('$f(x) = {a}x^2 {+b}x$', w)).toBe('$f(x) = 2x^2 -3x$');
    expect(fuelle('$\\frac{1}{2} \\cdot {2*a}$', w)).toBe('$\\frac{1}{2} \\cdot 4$');
    expect(fuelle('$x^{{a}}$', w)).toBe('$x^{2}$');
    expect(fuelle('$2{,}5$', w)).toBe('$2{,}5$');
  });
  it('Dezimalkomma: in Formeln {,}, im Text ,', () => {
    expect(fuelle('Es sind {c} m, also ${c}$.', w)).toBe('Es sind 2,5 m, also $2{,}5$.');
    expect(fuelle('{+a}', w)).toBe('+2');
  });
});
