import type { Formel } from '../../types';

export const formeln: Formel[] = [
  { name: 'Kreisfrequenz', tex: '\\omega = \\dfrac{2\\pi}{T} = 2\\pi f', hinweis: 'Einheit 1/s' },
  { name: 'Phasenwinkel', tex: '\\varphi(t) = \\omega\\cdot t' },
  { name: 'Allgemeine harmonische Schwingung', tex: 's(t) = \\hat s\\sin(\\omega t + \\varphi_0)' },
  { name: 'Anfangsbedingungen', tex: 's_0 = \\hat s\\sin\\varphi_0,\\quad v_0 = \\hat s\\,\\omega\\cos\\varphi_0' },
  { name: 'Amplitude aus s₀ und v₀', tex: '\\hat s = \\sqrt{s_0^2 + \\left(\\dfrac{v_0}{\\omega}\\right)^2}' },
  { name: 'Nullphase (Quadrant prüfen!)', tex: '\\sin\\varphi_0 = \\dfrac{s_0}{\\hat s},\\quad \\cos\\varphi_0 = \\dfrac{v_0}{\\hat s\\,\\omega}' },
  { name: 'Bogenmaß und Grad', tex: '\\pi\\ \\mathrm{rad} = 180^\\circ' },
];
