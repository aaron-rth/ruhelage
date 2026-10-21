import type { Formel } from '../../types';

export const formeln: Formel[] = [
  { name: 'Gleitreibungskraft', tex: 'F_{gl} = f_{gl}\\cdot F_N' },
  { name: 'Gleitreibung: Abnahme pro halber Periode', tex: '\\hat s_1 - \\hat s_2 = \\dfrac{2F_{gl}}{D}', hinweis: 'lineare Abnahme' },
  { name: 'DGL mit F = −b·v', tex: '\\ddot s = -\\dfrac{b}{m}\\dot s - \\dfrac{D}{m}s' },
  { name: 'Lösung (harmonisch gedämpft)', tex: 's(t) = \\hat s\\,e^{-\\frac{b}{2m}t}\\sin(\\omega\' t)' },
  { name: 'Gedämpfte Kreisfrequenz', tex: '\\omega\' = \\sqrt{\\omega^2 - \\dfrac{b^2}{4m^2}}' },
  { name: 'Einhüllende, Abklingkonstante', tex: 's_\\text{ampl}(t) = \\hat s\\,e^{-\\delta t},\\quad \\delta = \\dfrac{b}{2m}' },
  { name: 'Verhältnis aufeinanderfolgender Amplituden', tex: '\\dfrac{\\hat s_n}{\\hat s_{n+1}} = e^{\\delta T}' },
  { name: 'Halbwertszeit der Amplitude', tex: 't_{1/2} = \\dfrac{\\ln 2}{\\delta}' },
  { name: 'Energie', tex: 'E(t) = E_0\\,e^{-2\\delta t}', hinweis: 'Verlust pro Periode: $1 - e^{-2\\delta T}$' },
];
