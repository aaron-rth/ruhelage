import type { Formel } from '../../types';

export const formeln: Formel[] = [
  { name: 'Frequenz', tex: 'f = \\dfrac{1}{T}', hinweis: 'Einheit Hz = 1/s' },
  { name: 'Periodendauer', tex: 'T = \\dfrac{1}{f}' },
  { name: 'Frequenz aus Zählung', tex: 'f = \\dfrac{n}{\\Delta t}', hinweis: '$n$ Schwingungen in der Zeit $\\Delta t$' },
  { name: 'Amplitude', tex: '\\hat s = |s|_\\text{max}' },
];
