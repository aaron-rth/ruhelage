import type { Formel } from '../../types';

export const formeln: Formel[] = [
  { name: 'Eigenfrequenz Federpendel', tex: 'f_0 = \\dfrac{1}{2\\pi}\\sqrt{\\dfrac{D}{m}}' },
  { name: 'Resonanzbedingung', tex: 'f_a \\approx f_0' },
  { name: 'Federkonstante aus Einsinken', tex: 'D = \\dfrac{\\Delta m\\cdot g}{\\Delta x}' },
  { name: 'Anregung durch Bodenwellen', tex: 'f_a = \\dfrac{v}{x}\\;\\Rightarrow\\; v_\\text{Res} = x\\cdot f_0' },
  { name: 'Phasenverschiebung', tex: '\\Delta\\varphi \\approx 0\\;(f_a\\ll f_0),\\quad \\tfrac\\pi2\\;(f_a = f_0),\\quad \\pi\\;(f_a\\gg f_0)' },
];
