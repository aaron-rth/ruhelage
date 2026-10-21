import type { Thema } from '../../types';
import erklaerung from './erklaerung.md?raw';
import { formeln } from './formeln';
import { generatoren } from './generatoren';
import { karten } from './karten';
import { uebungen } from './uebungen';

export const thema: Thema = {
  id: 'bewegungen',
  nr: '0',
  titel: 'Grundlagen Bewegungen',
  untertitel: 's-t- und v-t-Diagramme, Steigung, Ableitung',
  abhaengig: [],
  startStatus: 'halb',
  prioritaet: 12,
  erklaerung,
  quelleErklaerung: 'Buch S. 151; Notizen Lehrer 18.9.',
  karten,
  uebungen,
  generatoren,
  formeln,
};
