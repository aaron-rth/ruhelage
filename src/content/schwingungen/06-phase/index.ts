import type { Thema } from '../../types';
import erklaerung from './erklaerung.md?raw';
import { formeln } from './formeln';
import { generatoren } from './generatoren';
import { karten } from './karten';
import { mehr } from './mehr';
import { uebungen } from './uebungen';

export const thema: Thema = {
  id: 'phase',
  nr: '6',
  titel: 'Kreisfrequenz & Phasenwinkel',
  untertitel: 'ω, φ(t), φ₀ aus Anfangsbedingungen',
  abhaengig: ['bewegungsgesetze'],
  prioritaet: 2,
  erklaerung,
  quelleErklaerung: 'Buch S. 156, 165; Notizen Lehrer 9.10.',
  karten: karten.map((k) => ({ ...k, mehr: mehr[k.id] })),
  uebungen,
  generatoren,
  formeln,
};
