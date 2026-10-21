import type { Formel } from '../../types';

export const formeln: Formel[] = [
  { name: 'Relative Unsicherheit', tex: '\\dfrac{\\Delta x}{x}' },
  { name: 'Ortsfaktor aus Pendelmessung (Größtfehler)', tex: '\\dfrac{\\Delta g}{g} \\approx \\dfrac{\\Delta\\ell}{\\ell} + 2\\,\\dfrac{\\Delta T}{T}' },
  { name: 'Mehrere Perioden', tex: 'T = \\dfrac{t}{n},\\quad \\Delta T = \\dfrac{\\Delta t}{n}' },
  { name: 'Effektive Fallbeschleunigung (Aufzug)', tex: 'g_\\text{eff} = g \\pm a' },
  { name: 'Kleine Änderungen', tex: '\\dfrac{\\Delta T}{T} \\approx \\dfrac12\\cdot\\dfrac{\\Delta\\ell}{\\ell}', hinweis: 'weil $T\\sim\\sqrt\\ell$' },
  { name: 'Gangabweichung pro Tag', tex: '\\Delta t_\\text{Tag} \\approx 86\\,400\\,\\mathrm s\\cdot\\dfrac{\\Delta T}{T}' },
  { name: 'Wärmeausdehnung', tex: '\\Delta\\ell = \\alpha_\\text{th}\\cdot\\ell\\cdot\\Delta\\vartheta' },
];
