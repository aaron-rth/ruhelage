import type { Formel } from '../../types';

export const formeln: Formel[] = [
  { name: 'Start im oberen Umkehrpunkt', tex: 's(t) = \\hat s\\cos(\\omega t)' },
  { name: 'Start in der Ruhelage (nach oben)', tex: 's(t) = \\hat s\\sin(\\omega t)' },
  { name: 'Geschwindigkeit (Start oben)', tex: 'v(t) = \\dot s(t) = -\\hat s\\,\\omega\\sin(\\omega t)' },
  { name: 'Beschleunigung (Start oben)', tex: 'a(t) = \\ddot s(t) = -\\hat s\\,\\omega^2\\cos(\\omega t)' },
  { name: 'Maximale Geschwindigkeit', tex: '\\hat v = \\hat s\\cdot\\omega' },
  { name: 'Maximale Beschleunigung', tex: '\\hat a = \\hat s\\cdot\\omega^2' },
  { name: 'Beschleunigung und Auslenkung', tex: 'a(t) = -\\omega^2\\cdot s(t)' },
  { name: 'Kreisfrequenz', tex: '\\omega = \\dfrac{2\\pi}{T}' },
];
