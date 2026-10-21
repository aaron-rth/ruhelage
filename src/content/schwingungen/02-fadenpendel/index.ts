import type { Thema } from '../../types';
import erklaerung from './erklaerung.md?raw';
import { formeln } from './formeln';
import { generatoren } from './generatoren';
import { karten } from './karten';
import { mehr } from './mehr';
import { uebungen } from './uebungen';

export const thema: Thema = {
  id: 'fadenpendel',
  nr: '2',
  titel: 'Fadenpendel',
  untertitel: 'Kräfte, Kleinwinkelnäherung, T = 2π√(ℓ/g)',
  abhaengig: ['grundbegriffe'],
  prioritaet: 4,
  erklaerung,
  quelleErklaerung: 'Buch S. 154, 159, 161 (Material D), 164; Notizen Lehrer 23.9./28.9.',
  karten: karten.map((k) => ({ ...k, mehr: mehr[k.id] })),
  uebungen,
  generatoren,
  formeln,
};
