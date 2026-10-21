import type { Thema } from '../../types';
import erklaerung from './erklaerung.md?raw';
import { formeln } from './formeln';
import { generatoren } from './generatoren';
import { karten } from './karten';
import { uebungen } from './uebungen';

export const thema: Thema = {
  id: 'querschnitt',
  nr: 'Q',
  titel: 'Querschnitt',
  untertitel: 'Messunsicherheit, Aufzug, kleine Änderungen',
  abhaengig: ['fadenpendel'],
  startStatus: 'nicht',
  prioritaet: 7,
  erklaerung,
  quelleErklaerung: 'Buch S. 154, 164; Übungsklausur (nur Aufgabentyp)',
  karten,
  uebungen,
  generatoren,
  formeln,
};
