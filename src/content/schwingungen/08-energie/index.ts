import type { Thema } from '../../types';
import erklaerung from './erklaerung.md?raw';
import { formeln } from './formeln';
import { generatoren } from './generatoren';
import { karten } from './karten';
import { mehr } from './mehr';
import { uebungen } from './uebungen';

export const thema: Thema = {
  id: 'energie',
  nr: '8',
  titel: 'Energie',
  untertitel: 'E_pot, E_kin, E_ges im Zeitverlauf',
  abhaengig: ['bewegungsgesetze'],
  prioritaet: 9,
  erklaerung,
  quelleErklaerung: 'Buch S. 168–169; Notizen Lehrer 12.10.',
  karten: karten.map((k) => ({ ...k, mehr: mehr[k.id] })),
  uebungen,
  generatoren,
  formeln,
};
