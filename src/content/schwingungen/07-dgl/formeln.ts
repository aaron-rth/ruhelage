import type { Formel } from '../../types';

export const formeln: Formel[] = [
  { name: 'Allgemeine DGL der harmonischen Schwingung', tex: '\\ddot y(t) = -\\omega^2\\cdot y(t)' },
  { name: 'DGL Federpendel', tex: '\\ddot s(t) = -\\dfrac{D}{m}\\cdot s(t)', hinweis: '$\\omega = \\sqrt{D/m}$' },
  { name: 'DGL Fadenpendel', tex: '\\ddot s(t) = -\\dfrac{g}{\\ell}\\cdot s(t)', hinweis: '$\\omega = \\sqrt{g/\\ell}$, nur für kleine Winkel' },
  { name: 'U-Rohr: Rückstellkraft', tex: 'F_R = -2\\rho A g\\cdot s' },
  { name: 'U-Rohr: DGL und Periodendauer', tex: '\\ddot s = -\\dfrac{2g}{\\ell}\\,s,\\qquad T = 2\\pi\\sqrt{\\dfrac{\\ell}{2g}}', hinweis: '$\\ell$ = Länge der gesamten Säule' },
  { name: 'Boje: Eintauchtiefe im Gleichgewicht', tex: 'h_0 = \\dfrac{m}{\\rho A}' },
  { name: 'Boje: Richtgröße und Kreisfrequenz', tex: 'D = \\rho g A,\\qquad \\omega_0 = \\sqrt{\\dfrac{\\rho g A}{m}} = \\sqrt{\\dfrac{g}{h_0}}' },
  { name: 'Ansatz zweimal abgeleitet', tex: 's = \\hat s\\sin(\\omega t)\\;\\Rightarrow\\;\\ddot s = -\\omega^2 s' },
  { name: 'DGL mit geschwindigkeitsabhängiger Reibung', tex: '\\ddot s = -\\dfrac{b}{m}\\,\\dot s - \\dfrac{D}{m}\\,s' },
];
