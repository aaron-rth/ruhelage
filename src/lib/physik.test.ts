import { describe, expect, it } from 'vitest';
import * as P from './physik';

describe('Physik-Grundformeln', () => {
  it('Sekundenpendel: T = 2 s ↔ ℓ ≈ 0,994 m', () => {
    expect(P.laengeAusPeriode(2)).toBeCloseTo(0.994, 3);
    expect(P.periodeFaden(P.laengeAusPeriode(2))).toBeCloseTo(2, 10);
  });
  it('Federpendel: T ↔ m ↔ D konsistent', () => {
    const T = P.periodeFeder(0.5, 20);
    expect(T).toBeCloseTo(0.9935, 3);
    expect(P.masseAusPeriode(T, 20)).toBeCloseTo(0.5, 10);
    expect(P.federkonstanteAusPeriode(T, 0.5)).toBeCloseTo(20, 10);
  });
  it('Federn parallel und in Reihe', () => {
    expect(P.federnParallel(30, 50)).toBe(80);
    expect(P.federnReihe(20, 20)).toBe(10);
    expect(P.federnReihe(30, 60)).toBeCloseTo(20, 10);
  });
  it('φ₀ und ŝ aus Anfangsbedingungen – alle vier Quadranten', () => {
    const w = 5;
    for (const [s0, v0] of [[0.02, 0.3], [0.02, -0.3], [-0.02, -0.3], [-0.02, 0.3], [0, 0.4], [0.03, 0], [-0.03, 0]]) {
      const { amp, phi0 } = P.phaseAusAnfang(s0, v0, w);
      expect(phi0).toBeGreaterThanOrEqual(0);
      expect(phi0).toBeLessThan(2 * Math.PI);
      expect(P.auslenkung(amp, w, phi0, 0)).toBeCloseTo(s0, 10);
      expect(P.geschwindigkeit(amp, w, phi0, 0)).toBeCloseTo(v0, 10);
    }
  });
  it('erster Nulldurchgang und Umkehrpunkt', () => {
    const w = 2;
    for (const phi0 of [0, 0.3, Math.PI / 2, 2.6, Math.PI, 4, 3 * Math.PI / 2, 6]) {
      const t0 = P.ersterNulldurchgang(phi0, w);
      expect(t0).toBeGreaterThan(0);
      expect(P.auslenkung(1, w, phi0, t0)).toBeCloseTo(0, 9);
      // kein früherer Nulldurchgang
      for (let t = 1e-4; t < t0 - 1e-4; t += t0 / 50) expect(Math.abs(P.auslenkung(1, w, phi0, t))).toBeGreaterThan(1e-6);
      const tu = P.ersterUmkehrpunkt(phi0, w);
      expect(tu).toBeGreaterThan(0);
      expect(Math.abs(P.auslenkung(1, w, phi0, tu))).toBeCloseTo(1, 9);
    }
  });
  it('U-Rohr: T aus ω² = D/m mit m = ρAL', () => {
    const rho = 1000, A = 2e-4, L = 0.5;
    const D = P.richtgroesseURohr(rho, A);
    const m = rho * A * L;
    expect(P.periodeURohr(L)).toBeCloseTo(P.periodeFeder(m, D), 10);
  });
  it('Dämpfung: Halbwertszeit ↔ δ, Energieverlust', () => {
    const d = P.abklingAusHalbwertszeit(10);
    expect(P.halbwertszeit(d)).toBeCloseTo(10, 10);
    expect(Math.exp(-d * 10)).toBeCloseTo(0.5, 10);
    // nach einer Halbwertszeit ist ein Viertel der Energie übrig
    expect(1 - P.energieVerlustProPeriode(d, 10)).toBeCloseTo(0.25, 10);
  });
  it('Pendeluhr: Näherung ½·Δℓ/ℓ stimmt mit exakter Rechnung', () => {
    const rel = 3e-4;
    const exakt = Math.sqrt(1 + rel) - 1;
    expect(P.relPeriodenAenderung(rel)).toBeCloseTo(exakt, 7);
  });
});
