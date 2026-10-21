import type { Thema } from '../../types';
import erklaerung from './erklaerung.md?raw';
import { formeln } from './formeln';
import { generatoren } from './generatoren';
import { karten } from './karten';
import { mehr } from './mehr';
import { uebungen } from './uebungen';

export const thema: Thema = {
  id: 'bewegungen',
  nr: '0',
  titel: 'Grundlagen Bewegungen',
  untertitel: 's-t- und v-t-Diagramme, Steigung, Ableitung',
  abhaengig: [],
  prioritaet: 12,
  erklaerung,
  quelleErklaerung: 'Buch S. 151; Notizen Lehrer 18.9.',
  karten: karten.map((k) => ({ ...k, mehr: mehr[k.id] })),
  uebungen,
  generatoren,
  formeln,
};
