import { describe, expect, it } from 'vitest';
import { klartext } from './klartext';

describe('klartext', () => {
  it('macht Formeln für Auswahllisten lesbar', () => {
    expect(klartext('$+ 3$')).toBe('+ 3');
    expect(klartext('$y = -0{,}5x$')).toBe('y = -0,5x');
    expect(klartext('$f(x) = 3x^2 + \\frac{1}{2}x$')).toBe('f(x) = 3x² + (1/2)x');
    expect(klartext('$x^{-1}$ und $x_0$')).toBe('x⁻¹ und x₀');
    expect(klartext('$\\sqrt{x+1} \\cdot \\pi$')).toBe('√(x+1) · π');
    expect(klartext('$\\frac{a+b}{2}$')).toBe('(a+b)/2');
    expect(klartext('**fett** und $T = 2\\pi\\sqrt{\\frac{l}{g}}$')).toBe('fett und T = 2π√(l/g)');
    expect(klartext('$e^{2x}$')).toBe('e²ˣ');
    expect(klartext('$\\frac{1}{2\\sqrt{z}}$')).toBe('1/(2√z)');
    expect(klartext('$\\frac{3}{\\sqrt{6x - 1}}$')).toBe('3/√(6x - 1)');
    expect(klartext('$\\frac{1}{(2 - x)^2}$')).toBe('1/(2 - x)²');
    expect(klartext('$\\sin(x) + x\\cos(x)$')).toBe('sin(x) + x cos(x)');
    expect(klartext('$e^{kt}$')).toBe('e^(kt)');
  });
});
