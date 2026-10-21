import type { Thema } from '../../types';
import erklaerung from './erklaerung.md?raw';
import { formeln } from './formeln';
import { generatoren } from './generatoren';
import { karten } from './karten';
import { uebungen } from './uebungen';

export const thema: Thema = {
  id: 'daempfung',
  nr: '9',
  titel: 'Dämpfung',
  untertitel: 'Gleitreibung, F ~ v, Einhüllende, Reibungsmodelle',
  abhaengig: ['energie', 'dgl'],
  startStatus: 'halb',
  prioritaet: 6,
  erklaerung,
  quelleErklaerung: 'Buch S. 170–173; Notizen Lehrer 12.10. und Versuch 16.10.',
  karten,
  uebungen,
  generatoren,
  formeln,
};
