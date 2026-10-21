import type { Thema } from '../../types';
import erklaerung from './erklaerung.md?raw';
import { formeln } from './formeln';
import { generatoren } from './generatoren';
import { karten } from './karten';
import { uebungen } from './uebungen';

export const thema: Thema = {
  id: 'harmonisch',
  nr: '4',
  titel: 'Harmonisch oder nicht?',
  untertitel: 'Drei Kriterien, Kreisbewegung, Knickbahn',
  abhaengig: ['fadenpendel', 'federpendel'],
  startStatus: 'halb',
  prioritaet: 8,
  erklaerung,
  quelleErklaerung: 'Buch S. 153, 160, 161 (Material C), 167 (Material D); Notizen Lehrer 28.9./2.10.',
  karten,
  uebungen,
  generatoren,
  formeln,
};
