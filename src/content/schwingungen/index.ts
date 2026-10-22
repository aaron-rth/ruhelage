// Kurs „Mechanische Schwingungen“ – Klausur K1
import type { Kurs } from '../types';
import { thema as t0 } from './00-bewegungen';
import { thema as t1 } from './01-grundbegriffe';
import { thema as t2 } from './02-fadenpendel';
import { thema as t3 } from './03-federpendel';
import { thema as t4 } from './04-harmonisch';
import { thema as t5 } from './05-bewegungsgesetze';
import { thema as t6 } from './06-phase';
import { thema as t7 } from './07-dgl';
import { thema as t8 } from './08-energie';
import { thema as t9 } from './09-daempfung';
import { thema as t10 } from './10-resonanz';
import { thema as t11 } from './11-querschnitt';

export const schwingungen: Kurs = {
  id: 'schwingungen',
  fach: 'Physik',
  klasse: 'K1',
  titel: 'Mechanische Schwingungen',
  klausur: { datum: '2026-11-06', titel: '1. Klausur' },
  themen: [t0, t1, t2, t3, t4, t5, t6, t7, t8, t9, t10, t11],
  pfad: [
    ['bewegungen'],
    ['grundbegriffe'],
    ['fadenpendel', 'federpendel'],
    ['harmonisch', 'bewegungsgesetze'],
    ['phase', 'dgl', 'energie'],
    ['daempfung', 'querschnitt'],
    ['resonanz'],
  ],
};
