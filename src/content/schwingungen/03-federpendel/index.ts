import type { Thema } from '../../types';
import erklaerung from './erklaerung.md?raw';
import { formeln } from './formeln';
import { generatoren } from './generatoren';
import { karten } from './karten';
import { mehr } from './mehr';
import { uebungen } from './uebungen';

export const thema: Thema = {
  id: 'federpendel',
  nr: '3',
  titel: 'Federpendel & lineares Kraftgesetz',
  untertitel: 'Hooke, Federkombinationen, T = 2π√(m/D)',
  abhaengig: ['grundbegriffe'],
  prioritaet: 5,
  erklaerung,
  quelleErklaerung: 'Buch S. 156, 158, 161 (Material B), 163, 166 (Material A); Notizen Lehrer 21.9./23.9.',
  karten: karten.map((k) => ({ ...k, mehr: mehr[k.id] })),
  uebungen,
  generatoren,
  formeln,
};
