import type { Thema } from '../../types';
import erklaerung from './erklaerung.md?raw';
import { formeln } from './formeln';
import { generatoren } from './generatoren';
import { karten } from './karten';
import { uebungen } from './uebungen';

export const thema: Thema = {
  id: 'resonanz',
  nr: '10',
  titel: 'Antrieb & Resonanz',
  untertitel: 'Eigenfrequenz, Resonanzkurve, Phasenverschiebung',
  abhaengig: ['daempfung'],
  startStatus: 'nicht',
  neu: true,
  prioritaet: 10,
  erklaerung,
  quelleErklaerung: 'Buch S. 174–177',
  karten,
  uebungen,
  generatoren,
  formeln,
};
