import type { Thema } from '../../types';
import erklaerung from './erklaerung.md?raw';
import { formeln } from './formeln';
import { generatoren } from './generatoren';
import { karten } from './karten';
import { uebungen } from './uebungen';

export const thema: Thema = {
  id: 'energie',
  nr: '8',
  titel: 'Energie',
  untertitel: 'E_pot, E_kin, E_ges im Zeitverlauf',
  abhaengig: ['bewegungsgesetze'],
  startStatus: 'halb',
  prioritaet: 9,
  erklaerung,
  quelleErklaerung: 'Buch S. 168–169; Notizen Lehrer 12.10.',
  karten,
  uebungen,
  generatoren,
  formeln,
};
