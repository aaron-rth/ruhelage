import type { Thema } from '../../types';
import erklaerung from './erklaerung.md?raw';
import { formeln } from './formeln';
import { generatoren } from './generatoren';
import { karten } from './karten';
import { uebungen } from './uebungen';

export const thema: Thema = {
  id: 'grundbegriffe',
  nr: '1',
  titel: 'Grundbegriffe',
  untertitel: 'Auslenkung, Amplitude, T, f, Rückstellkraft',
  abhaengig: ['bewegungen'],
  startStatus: 'halb',
  prioritaet: 11,
  erklaerung,
  quelleErklaerung: 'Buch S. 152–153; Notizen Lehrer 18.9./21.9.',
  karten,
  uebungen,
  generatoren,
  formeln,
};
