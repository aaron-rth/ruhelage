import type { Thema } from '../../types';
import erklaerung from './erklaerung.md?raw';
import { formeln } from './formeln';
import { generatoren } from './generatoren';
import { karten } from './karten';
import { uebungen } from './uebungen';

export const thema: Thema = {
  id: 'dgl',
  nr: '7',
  titel: 'Differenzialgleichungen',
  untertitel: 'Kräfte → DGL → Ansatz → ω → T',
  abhaengig: ['federpendel', 'bewegungsgesetze'],
  startStatus: 'nicht',
  prioritaet: 3,
  erklaerung,
  quelleErklaerung: 'Buch S. 162–167 (Methode S. 165); Notizen Lehrer 23.9./2.10./5.10.',
  karten,
  uebungen,
  generatoren,
  formeln,
};
