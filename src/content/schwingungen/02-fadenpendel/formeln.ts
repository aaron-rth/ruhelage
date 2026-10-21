import type { Formel } from '../../types';

export const formeln: Formel[] = [
  { name: 'Rückstellkraft (exakt)', tex: 'F_R = -m g\\sin\\alpha' },
  { name: 'Geometrie', tex: '\\sin\\alpha = \\dfrac{s_h}{\\ell}' },
  { name: 'Kleinwinkelnäherung (α ≤ 10°)', tex: '\\sin\\alpha \\approx \\alpha,\\quad s_h \\approx s', hinweis: 'α im Bogenmaß' },
  { name: 'Lineares Kraftgesetz', tex: 'F_R = -\\dfrac{m g}{\\ell}\\cdot s' },
  { name: 'Richtgröße', tex: 'D = \\dfrac{m\\cdot g}{\\ell}' },
  { name: 'Periodendauer', tex: 'T = 2\\pi\\sqrt{\\dfrac{\\ell}{g}}' },
  { name: 'Proportionalität', tex: 'T = k\\cdot\\sqrt\\ell,\\quad k = \\dfrac{2\\pi}{\\sqrt g}\\approx 2{,}006\\,\\dfrac{\\mathrm s}{\\sqrt{\\mathrm m}}' },
  { name: 'Ortsfaktor aus Messung', tex: 'g = \\dfrac{4\\pi^2\\,\\ell}{T^2}' },
];
