import type { Formel } from '../../types';

export const formeln: Formel[] = [
  { name: 'Kriterium: lineares Kraftgesetz', tex: 'F_R = -D\\cdot s' },
  { name: 'Projektion der Kreisbewegung', tex: 's(t) = \\hat s\\sin(\\varphi(t)),\\quad \\varphi = \\omega t' },
  { name: 'Knickbahn: Hangabtriebskraft', tex: 'F_H = m\\,g\\sin\\alpha', hinweis: 'konstant – kein lineares Kraftgesetz' },
  { name: 'Knickbahn: Zeit bis zur Mitte', tex: 't_1 = \\sqrt{\\dfrac{2\\hat s}{g\\sin\\alpha}}' },
  { name: 'Knickbahn: Periodendauer', tex: 'T = 4\\,t_1 = 4\\sqrt{\\dfrac{2\\hat s}{g\\sin\\alpha}}', hinweis: 'hängt von $\\hat s$ ab → nicht harmonisch' },
];
