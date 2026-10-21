// Einheiten-Tabelle mit Dimensionen [Länge, Masse, Zeit] und SI-Faktor.
// Der Parser ist tolerant: Leerzeichen, ², ³, ·, „sek“ usw. werden akzeptiert.

export type Dim = readonly [number, number, number];

export interface Einheit {
  key: string; // Anzeige und interner Schlüssel, z. B. "m/s^2"
  anzeige: string; // hübsch, z. B. "m/s²"
  faktor: number; // Wert in SI = Zahl · faktor
  dim: Dim;
  aliase?: string[];
}

const L: Dim = [1, 0, 0];
const M: Dim = [0, 1, 0];
const T: Dim = [0, 0, 1];
const FREQ: Dim = [0, 0, -1];
const V: Dim = [1, 0, -1];
const A: Dim = [1, 0, -2];
const F: Dim = [1, 1, -2];
const D: Dim = [0, 1, -2];
const E: Dim = [2, 1, -2];
const RHO: Dim = [-3, 1, 0];
const FLAECHE: Dim = [2, 0, 0];
const VOL: Dim = [3, 0, 0];
const EINS: Dim = [0, 0, 0];
const PROP: Dim = [-0.5, 0, 1];
const DAEMPF: Dim = [0, 1, -1];

export const EINHEITEN: Einheit[] = [
  { key: 'm', anzeige: 'm', faktor: 1, dim: L, aliase: ['meter'] },
  { key: 'dm', anzeige: 'dm', faktor: 0.1, dim: L },
  { key: 'cm', anzeige: 'cm', faktor: 0.01, dim: L },
  { key: 'mm', anzeige: 'mm', faktor: 1e-3, dim: L },
  { key: 'µm', anzeige: 'µm', faktor: 1e-6, dim: L, aliase: ['um', 'μm'] },
  { key: 'km', anzeige: 'km', faktor: 1e3, dim: L },

  { key: 'kg', anzeige: 'kg', faktor: 1, dim: M },
  { key: 'g', anzeige: 'g', faktor: 1e-3, dim: M, aliase: ['gramm'] },
  { key: 't', anzeige: 't', faktor: 1e3, dim: M, aliase: ['tonnen'] },

  { key: 's', anzeige: 's', faktor: 1, dim: T, aliase: ['sek', 'sec', 'sekunden'] },
  { key: 'ms', anzeige: 'ms', faktor: 1e-3, dim: T },
  { key: 'µs', anzeige: 'µs', faktor: 1e-6, dim: T, aliase: ['us', 'μs'] },
  { key: 'min', anzeige: 'min', faktor: 60, dim: T, aliase: ['minuten'] },
  { key: 'h', anzeige: 'h', faktor: 3600, dim: T, aliase: ['std', 'stunden'] },
  { key: 'd', anzeige: 'd (Tage)', faktor: 86400, dim: T, aliase: ['tag', 'tage'] },

  { key: '1/s', anzeige: '1/s', faktor: 1, dim: FREQ, aliase: ['s^-1', '/s', '1/sek', 's-1'] },
  { key: 'Hz', anzeige: 'Hz', faktor: 1, dim: FREQ, aliase: ['hz', 'hertz'] },
  { key: 'kHz', anzeige: 'kHz', faktor: 1e3, dim: FREQ, aliase: ['khz'] },
  { key: 'MHz', anzeige: 'MHz', faktor: 1e6, dim: FREQ },

  { key: 'm/s', anzeige: 'm/s', faktor: 1, dim: V, aliase: ['ms^-1'] },
  { key: 'cm/s', anzeige: 'cm/s', faktor: 0.01, dim: V },
  { key: 'mm/s', anzeige: 'mm/s', faktor: 1e-3, dim: V },
  { key: 'km/h', anzeige: 'km/h', faktor: 1 / 3.6, dim: V, aliase: ['kmh', 'kmh^-1'] },

  { key: 'm/s^2', anzeige: 'm/s²', faktor: 1, dim: A, aliase: ['ms^-2'] },
  { key: 'cm/s^2', anzeige: 'cm/s²', faktor: 0.01, dim: A },

  { key: 'N', anzeige: 'N', faktor: 1, dim: F, aliase: ['newton'] },
  { key: 'kN', anzeige: 'kN', faktor: 1e3, dim: F },
  { key: 'mN', anzeige: 'mN', faktor: 1e-3, dim: F },

  { key: 'N/m', anzeige: 'N/m', faktor: 1, dim: D, aliase: ['kg/s^2'] },
  { key: 'N/cm', anzeige: 'N/cm', faktor: 100, dim: D },
  { key: 'kN/m', anzeige: 'kN/m', faktor: 1e3, dim: D },

  { key: 'J', anzeige: 'J', faktor: 1, dim: E, aliase: ['nm', 'joule'] },
  { key: 'mJ', anzeige: 'mJ', faktor: 1e-3, dim: E },
  { key: 'kJ', anzeige: 'kJ', faktor: 1e3, dim: E },

  { key: 'kg/m^3', anzeige: 'kg/m³', faktor: 1, dim: RHO },
  { key: 'g/cm^3', anzeige: 'g/cm³', faktor: 1000, dim: RHO },
  { key: 'kg/dm^3', anzeige: 'kg/dm³', faktor: 1000, dim: RHO, aliase: ['kg/l'] },

  { key: 'm^2', anzeige: 'm²', faktor: 1, dim: FLAECHE },
  { key: 'dm^2', anzeige: 'dm²', faktor: 1e-2, dim: FLAECHE },
  { key: 'cm^2', anzeige: 'cm²', faktor: 1e-4, dim: FLAECHE },
  { key: 'mm^2', anzeige: 'mm²', faktor: 1e-6, dim: FLAECHE },

  { key: 'm^3', anzeige: 'm³', faktor: 1, dim: VOL },
  { key: 'dm^3', anzeige: 'dm³', faktor: 1e-3, dim: VOL, aliase: ['l', 'liter'] },
  { key: 'cm^3', anzeige: 'cm³', faktor: 1e-6, dim: VOL, aliase: ['ml'] },

  { key: '', anzeige: '(ohne)', faktor: 1, dim: EINS, aliase: ['-', 'ohne', '1'] },
  { key: '%', anzeige: '%', faktor: 0.01, dim: EINS, aliase: ['prozent'] },

  { key: 's/√m', anzeige: 's/√m', faktor: 1, dim: PROP, aliase: ['s/sqrt(m)', 's/wurzel(m)', 's/sqrtm', 's/wurzelm', 'sm^-0.5', 'sm^-1/2'] },

  { key: 'kg/s', anzeige: 'kg/s', faktor: 1, dim: DAEMPF, aliase: ['ns/m'] },
];

// Winkel werden getrennt behandelt (siehe antwort.ts)
export const WINKEL_EINHEITEN = [
  { key: 'rad', anzeige: 'rad', faktor: 1 },
  { key: '°', anzeige: '°', faktor: Math.PI / 180 },
] as const;

function normalisiere(s: string): string {
  return s
    .trim()
    .replace(/\s+/g, '')
    .replace(/[·*⋅]/g, '')
    .replace(/²/g, '^2')
    .replace(/³/g, '^3')
    .replace(/⁻¹/g, '^-1')
    .replace(/⁻²/g, '^-2')
    .replace(/−/g, '-')
    .replace(/μ/g, 'µ')
    .replace(/\^\((-?[\d.\/]+)\)/g, '^$1')
    .replace(/sekunden|sek|sec/gi, 's');
}

const exakt = new Map<string, Einheit>();
const klein = new Map<string, Einheit | null>();
for (const e of EINHEITEN) {
  for (const a of [e.key, e.anzeige, ...(e.aliase ?? [])]) {
    const n = normalisiere(a);
    if (!exakt.has(n)) exakt.set(n, e);
    const k = n.toLowerCase();
    if (klein.has(k) && klein.get(k) !== e) klein.set(k, null);
    else klein.set(k, e);
  }
}

export function findeEinheit(text: string): Einheit | undefined {
  const n = normalisiere(text);
  if (exakt.has(n)) return exakt.get(n);
  const k = klein.get(n.toLowerCase());
  return k ?? undefined;
}

export function einheit(key: string): Einheit {
  const e = EINHEITEN.find((x) => x.key === key);
  if (!e) throw new Error(`Unbekannte Einheit: ${key}`);
  return e;
}

export function gleicheDim(a: Dim, b: Dim): boolean {
  return a.every((v, i) => Math.abs(v - b[i]) < 1e-9);
}

/** Alle Einheiten derselben Dimension wie `key` (für das Auswahlmenü). */
export function passendeEinheiten(key: string): Einheit[] {
  const ziel = einheit(key);
  const liste = EINHEITEN.filter((e) => gleicheDim(e.dim, ziel.dim));
  // Ohne-Einheit nur anbieten, wenn wirklich dimensionslos
  return liste;
}
