// Gemeinsame Helfer für Schwingungsdiagramme (s-t, v-t, a-t).
import { schoeneGrenze } from '../helfer';
import type { KurvenStil, PlotSpec } from '../types';

/** Startbedingung → Nullphase in s(t) = ŝ·sin(ωt + φ₀) */
export type Start = 'oben' | 'unten' | 'ruheHoch' | 'ruheRunter';
export const STARTS: Start[] = ['oben', 'unten', 'ruheHoch', 'ruheRunter'];

export const START_PHI: Record<Start, number> = {
  oben: Math.PI / 2,
  unten: (3 * Math.PI) / 2,
  ruheHoch: 0,
  ruheRunter: Math.PI,
};

export const START_TEXT: Record<Start, string> = {
  oben: 'im oberen Umkehrpunkt',
  unten: 'im unteren Umkehrpunkt',
  ruheHoch: 'in der Ruhelage, Bewegung nach oben',
  ruheRunter: 'in der Ruhelage, Bewegung nach unten',
};

/** Gleichung in der Form des Unterrichts (sin/cos mit Vorzeichen), Platzhalter für Zahlen optional */
export function startGleichung(st: Start, amp = '\\hat s', w = '\\omega'): string {
  switch (st) {
    case 'oben':
      return `s(t) = ${amp}\\cdot\\cos(${w}\\, t)`;
    case 'unten':
      return `s(t) = -${amp}\\cdot\\cos(${w}\\, t)`;
    case 'ruheHoch':
      return `s(t) = ${amp}\\cdot\\sin(${w}\\, t)`;
    case 'ruheRunter':
      return `s(t) = -${amp}\\cdot\\sin(${w}\\, t)`;
  }
}

const SCHRITTE = [0.01, 0.02, 0.025, 0.05, 0.1, 0.2, 0.25, 0.5, 1, 2, 2.5, 5, 10];

export function zeitSchritt(tMax: number): number {
  for (const s of SCHRITTE) if (tMax / s <= 12) return s;
  return 20;
}

export interface ZeitPlotOpt {
  f: (t: number) => number;
  tMax: number;
  yMax: number;
  yLabel: string;
  xLabel?: string;
  stil?: KurvenStil;
  weitere?: { f: (t: number) => number; stil?: KurvenStil; gestrichelt?: boolean; label?: string }[];
  label?: string;
}

export function zeitPlot(o: ZeitPlotOpt): PlotSpec {
  const xs = zeitSchritt(o.tMax);
  const { grenze, schritt } = schoeneGrenze(o.yMax);
  const nk = (v: number) => {
    const s = v.toString();
    return s.includes('.') ? s.split('.')[1].length : 0;
  };
  return {
    x: [0, o.tMax],
    y: [-grenze, grenze],
    xLabel: o.xLabel ?? 't in s',
    yLabel: o.yLabel,
    xSchritt: xs,
    ySchritt: schritt,
    xFein: xs / 5,
    yFein: schritt / 5,
    xNachkomma: nk(xs),
    yNachkomma: Math.max(nk(Number(schritt.toPrecision(6))), 0),
    kurven: [{ f: o.f, stil: o.stil ?? 'akzent', label: o.label }, ...(o.weitere ?? [])],
  };
}

/** „Schöne“ Periodendauern zum Ablesen */
export const SCHOENE_T = [0.4, 0.5, 0.6, 0.8, 1, 1.2, 1.5, 1.6, 2, 2.4, 3, 4];
/** „Schöne“ Amplituden in cm */
export const SCHOENE_AMP_CM = [1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10, 12];
