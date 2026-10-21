import type { Formel } from '../../types';

export const formeln: Formel[] = [
  { name: 'Potenzielle Energie', tex: 'E_\\text{pot}(t) = \\tfrac12 D\\cdot s(t)^2' },
  { name: 'Kinetische Energie', tex: 'E_\\text{kin}(t) = \\tfrac12 m\\cdot v(t)^2' },
  { name: 'Gesamtenergie', tex: 'E_\\text{ges} = \\tfrac12 D\\hat s^2 = \\tfrac12 m\\hat v^2', hinweis: 'konstant ohne Dämpfung' },
  { name: 'Zeitverlauf (Start im Umkehrpunkt)', tex: 'E_\\text{pot} = E_\\text{ges}\\cos^2(\\omega t),\\quad E_\\text{kin} = E_\\text{ges}\\sin^2(\\omega t)' },
  { name: 'Anteil an der Stelle s', tex: '\\dfrac{E_\\text{pot}}{E_\\text{ges}} = \\left(\\dfrac{s}{\\hat s}\\right)^2' },
  { name: 'Geschwindigkeit an der Stelle s', tex: 'v = \\omega\\sqrt{\\hat s^2 - s^2}' },
  { name: 'Fadenpendel', tex: 'D = \\dfrac{mg}{\\ell},\\quad h = \\ell(1-\\cos\\hat\\alpha),\\quad E = mgh' },
];
