import type { Thema } from '../../types';
import erklaerung from './erklaerung.md?raw';
import { formeln } from './formeln';
import { generatoren } from './generatoren';
import { karten } from './karten';
import { uebungen } from './uebungen';

export const thema: Thema = {
  id: 'bewegungsgesetze',
  nr: '5',
  titel: 'Bewegungsgesetze',
  untertitel: 's(t), v(t), a(t), v̂ und â, sin oder cos',
  abhaengig: ['grundbegriffe', 'federpendel'],
  startStatus: 'nicht',
  prioritaet: 1,
  erklaerung,
  quelleErklaerung: 'Buch S. 156–157; Notizen Lehrer 23.9./5.10.',
  karten,
  uebungen,
  generatoren,
  formeln,
};
