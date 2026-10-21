// Deterministischer Zufallsgenerator (mulberry32). Gleicher Seed → gleiche Aufgabe.
// So können Aufgaben im „Nochmal“-Stapel exakt wiederhergestellt werden.

export interface Rng {
  readonly seed: number;
  /** gleichverteilt in [0, 1) */
  next(): number;
  /** Zahl in [min, max], auf `schritt` gerastert */
  zahl(min: number, max: number, schritt?: number): number;
  /** ganze Zahl in [min, max] */
  int(min: number, max: number): number;
  wahl<T>(arr: readonly T[]): T;
  vorzeichen(): 1 | -1;
  mische<T>(arr: readonly T[]): T[];
  /** true mit Wahrscheinlichkeit p */
  chance(p: number): boolean;
}

export function erzeugeRng(seed: number): Rng {
  let a = seed >>> 0;
  const next = () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const rng: Rng = {
    seed,
    next,
    zahl(min, max, schritt) {
      if (!schritt) return min + (max - min) * next();
      const n = Math.round((max - min) / schritt);
      const k = Math.floor(next() * (n + 1));
      return Number((min + k * schritt).toFixed(10));
    },
    int(min, max) {
      return min + Math.floor(next() * (max - min + 1));
    },
    wahl(arr) {
      return arr[Math.floor(next() * arr.length)];
    },
    vorzeichen() {
      return next() < 0.5 ? -1 : 1;
    },
    mische(arr) {
      const r = [...arr];
      for (let i = r.length - 1; i > 0; i--) {
        const j = Math.floor(next() * (i + 1));
        [r[i], r[j]] = [r[j], r[i]];
      }
      return r;
    },
    chance(p) {
      return next() < p;
    },
  };
  return rng;
}

export function neuerSeed(): number {
  return Math.floor(Math.random() * 2 ** 31);
}
