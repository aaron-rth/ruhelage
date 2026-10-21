import type { Formel } from '../../types';

export const formeln: Formel[] = [
  { name: 'Geschwindigkeit als Ableitung', tex: 'v(t) = \\dot s(t)', hinweis: 'Steigung im s-t-Diagramm' },
  { name: 'Beschleunigung als Ableitung', tex: 'a(t) = \\dot v(t) = \\ddot s(t)', hinweis: 'Steigung im v-t-Diagramm' },
  { name: 'Mittlere Geschwindigkeit', tex: 'v = \\dfrac{\\Delta s}{\\Delta t}' },
  { name: 'Frequenz und Periodendauer', tex: 'f = \\dfrac{1}{T},\\quad f = \\dfrac{n}{\\Delta t}', hinweis: '$1\\,\\mathrm{Hz} = 1/\\mathrm s$' },
  { name: 'Freier Fall', tex: 'h(t) = h_0 - \\dfrac g2 t^2,\\quad v(t) = -g\\,t' },
];
