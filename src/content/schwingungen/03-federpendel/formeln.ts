import type { Formel } from '../../types';

export const formeln: Formel[] = [
  { name: 'Hookesches Gesetz (lineares Kraftgesetz)', tex: 'F_R = -D\\cdot s', hinweis: 'Minus: Kraft zeigt zur Gleichgewichtslage.' },
  { name: 'Periodendauer Federpendel', tex: 'T = 2\\pi\\sqrt{\\dfrac{m}{D}}' },
  { name: 'Frequenz Federpendel', tex: 'f = \\dfrac{1}{2\\pi}\\sqrt{\\dfrac{D}{m}}' },
  { name: 'Dehnung im Gleichgewicht (senkrecht)', tex: '\\Delta\\ell = \\dfrac{m\\cdot g}{D}' },
  { name: 'Federn nebeneinander / Wagen zwischen zwei Federn', tex: 'D = D_1 + D_2' },
  { name: 'Federn hintereinander', tex: '\\dfrac{1}{D} = \\dfrac{1}{D_1} + \\dfrac{1}{D_2}' },
  { name: 'Masse aus der Periodendauer', tex: 'm = \\dfrac{D\\cdot T^2}{4\\pi^2}' },
];
