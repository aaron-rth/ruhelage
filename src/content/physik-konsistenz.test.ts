// Physikalische Konsistenz der einzelnen Generatoren: Werte unabhängig nachrechnen.
import { describe, expect, it } from 'vitest';
import { erzeugeRng } from '../lib/rng';
import { findeGenerator } from './kurse';
import type { Aufgabe } from './types';

const G = 9.81;
const N = 200;

function lauf(id: string, pruefe: (a: Aufgabe, w: Record<string, number>) => void) {
  const g = findeGenerator(id)?.generator;
  expect(g, `Generator ${id} fehlt`).toBeDefined();
  for (let s = 1; s <= N; s++) {
    const a = g!.erzeuge(erzeugeRng(s));
    pruefe(a, a.werte ?? {});
  }
}
const nah = (a: number, b: number, rel = 1e-9) => expect(Math.abs(a - b)).toBeLessThanOrEqual(Math.abs(b) * rel + 1e-12);
const wert = (a: Aufgabe, i: number) => {
  const x = a.teile[i].antwort;
  if (x.art !== 'zahl' && x.art !== 'winkel') throw new Error('keine Zahl');
  return x.wert;
};

describe('Thema 3 – Federpendel', () => {
  it('fe-periode: T aus ω zurückgerechnet, f = 1/T', () =>
    lauf('fe-periode', (a, w) => {
      nah(2 * Math.PI / wert(a, 2), wert(a, 0));
      nah(wert(a, 1) * wert(a, 0), 1);
      nah(wert(a, 2) ** 2, w.D / w.m);
      expect(wert(a, 0)).toBeGreaterThan(0.05);
      expect(wert(a, 0)).toBeLessThan(5);
    }));
  it('fe-d-messung: D·Δs = F und T passt zu D', () =>
    lauf('fe-d-messung', (a, w) => {
      nah(wert(a, 0) * w.ds, w.F);
      nah((wert(a, 1) / (2 * Math.PI)) ** 2 * wert(a, 0), w.m);
    }));
  it('fe-kombination: Reihe weicher als jede Feder, parallel härter', () =>
    lauf('fe-kombination', (a, w) => {
      const D = wert(a, 0);
      if (w.reihe) expect(D).toBeLessThan(Math.min(w.D1, w.D2));
      else nah(D, w.D1 + w.D2);
      nah((wert(a, 1) / (2 * Math.PI)) ** 2 * D, w.m);
    }));
  it('fe-vertikal: T = 2π√(Δℓ/g) und = 2π√(m/D)', () =>
    lauf('fe-vertikal', (a, w) => {
      nah(wert(a, 1), 2 * Math.PI * Math.sqrt(w.dl / G));
      nah(wert(a, 1), 2 * Math.PI * Math.sqrt(w.m / wert(a, 0)));
    }));
  it('fe-fahrzeug: zwei Federn tragen die Zusatzlast', () =>
    lauf('fe-fahrzeug', (a, w) => {
      nah(2 * wert(a, 0) * w.dx, w.dm * G);
      expect(wert(a, 1)).toBeGreaterThan(0.2);
      expect(wert(a, 1)).toBeLessThan(3);
    }));
  it('fe-astronaut: Masse der Person plausibel', () =>
    lauf('fe-astronaut', (a) => {
      expect(wert(a, 1)).toBeGreaterThan(40);
      expect(wert(a, 1)).toBeLessThan(110);
    }));
  it('fe-kennlinie: Gerade hat Steigung −D', () =>
    lauf('fe-kennlinie', (a, w) => {
      const f = a.plot!.kurven[0].f;
      nah(f(10), -w.D * 0.1);
      nah(f(0), 0);
    }));
});

describe('Thema 5 – Bewegungsgesetze', () => {
  it('bg-vmax-amax: v̂ = ŝω, â = ŝω²', () =>
    lauf('bg-vmax-amax', (a, w) => {
      nah(wert(a, 1), w.amp * wert(a, 0));
      nah(wert(a, 2), wert(a, 1) * wert(a, 0));
    }));
  it('bg-amp-aus-v: ŝ·ω = v̂ und T aus ω', () =>
    lauf('bg-amp-aus-v', (a, w) => {
      nah(wert(a, 0) * (2 * Math.PI / w.T), w.vmax);
      nah(wert(a, 1), w.vmax * w.w);
    }));
  it('bg-s-zeitpunkt: s(t₁) und v(t₁) passen zur Startbedingung', () =>
    lauf('bg-s-zeitpunkt', (a, w) => {
      const s0 = w.amp * Math.sin(w.phi0);
      const v0 = w.amp * w.w * Math.cos(w.phi0);
      // Energieerhaltung: s² + (v/ω)² = ŝ²
      nah(wert(a, 0) ** 2 + (wert(a, 1) / w.w) ** 2, w.amp ** 2, 1e-9);
      nah(s0 ** 2 + (v0 / w.w) ** 2, w.amp ** 2, 1e-9);
      expect(Math.abs(wert(a, 0))).toBeGreaterThan(0.1 * w.amp);
      const r = a.teile[2].antwort;
      if (r.art === 'auswahl') expect(r.richtig).toBe(wert(a, 1) > 0 ? 0 : 1);
    }));
  it('bg-erste-zeit: s(t) erreicht den Wert erstmals genau dort', () =>
    lauf('bg-erste-zeit', (a, w) => {
      const t = wert(a, 0);
      const f = (x: number) => (w.ausUmkehr ? Math.cos(w.w * x) : Math.sin(w.w * x));
      nah(f(t), w.anteil, 1e-9);
      for (let x = t / 40; x < t * 0.98; x += t / 40) expect(Math.abs(f(x) - w.anteil)).toBeGreaterThan(1e-6);
    }));
  it('bg-st-ablesen: Plot passt zu T und ŝ', () =>
    lauf('bg-st-ablesen', (a, w) => {
      const f = a.plot!.kurven[0].f;
      nah(f(0.3) , f(0.3 + w.T), 1e-9);
      expect(Math.max(...Array.from({ length: 400 }, (_, i) => f((i / 400) * w.T)))).toBeCloseTo(w.amp, 2);
    }));
  it('bg-vt-auswerten: ŝ = v̂/ω, Startoption passt zu v(0)', () =>
    lauf('bg-vt-auswerten', (a, w) => {
      nah(wert(a, 1) * w.w, w.vmax);
      const v0 = a.plot!.kurven[0].f(0);
      const opt = a.teile[2].antwort;
      if (opt.art !== 'auswahl') throw new Error();
      const text = opt.optionen[opt.richtig];
      if (Math.abs(v0) > 1e-9) expect(text).toMatch(v0 > 0 ? /Ruhelage, Bewegung nach oben/ : /Ruhelage, Bewegung nach unten/);
      else expect(text).toMatch(/Umkehrpunkt/);
    }));
  it('bg-klick: Ziel ist wirklich Umkehrpunkt bzw. Nulldurchgang', () =>
    lauf('bg-klick', (a, w) => {
      const f = a.plot!.kurven[0].f;
      const amp = Math.max(...Array.from({ length: 200 }, (_, i) => Math.abs(f((i / 200) * w.T))));
      const y = Math.abs(f(w.ziel));
      expect(y < 1e-6 * amp || Math.abs(y - amp) < 1e-3 * amp).toBe(true);
    }));
  it('bg-ort-richtung: Auswahl passt zu Vorzeichen von s und Steigung', () =>
    lauf('bg-ort-richtung', (a, w) => {
      const f = a.plot!.kurven[0].f;
      const s = f(w.t1);
      const st = f(w.t1 + 1e-5) - f(w.t1 - 1e-5);
      expect(w.richtig).toBe((s > 0 ? 0 : 2) + (st > 0 ? 0 : 1));
    }));
});

describe('Thema 6 – Kreisfrequenz und Phase', () => {
  it('ph-omega: T·f = 1 und ω·T = 2π', () =>
    lauf('ph-omega', (_a, w) => {
      nah(w.T * w.f, 1);
      nah(w.w * w.T, 2 * Math.PI);
    }));
  it('ph-phase-zeit: φ = ωt und Zeit zum Gradwert', () =>
    lauf('ph-phase-zeit', (a, w) => {
      nah(wert(a, 0), w.w * w.t1);
      nah(wert(a, 1) * w.w, (w.gradZiel * Math.PI) / 180);
    }));
  it('ph-anfang: s₀ und v₀ werden aus ŝ, φ₀ exakt zurückgewonnen; φ₀ ∈ [0, 2π)', () =>
    lauf('ph-anfang', (a, w) => {
      const amp = wert(a, 1);
      const phi0 = wert(a, 2);
      expect(phi0).toBeGreaterThanOrEqual(0);
      expect(phi0).toBeLessThan(2 * Math.PI);
      nah(amp * Math.sin(phi0), w.s0, 1e-9);
      nah(amp * wert(a, 0) * Math.cos(phi0), w.v0, 1e-9);
      const t0 = wert(a, 3);
      expect(t0).toBeGreaterThan(0);
      expect(Math.abs(Math.sin(w.w * t0 + phi0))).toBeLessThan(1e-9);
      expect(t0).toBeLessThan(Math.PI / w.w + 1e-12);
      // die arcsin-Falle wird erkannt, außer im ersten Quadranten
      const ant = a.teile[2].antwort;
      if (ant.art === 'winkel' && phi0 > Math.PI / 2 + 0.05) expect(ant.typischeFehler!.length).toBeGreaterThan(0);
    }));
  it('ph-gleichung: Nulldurchgang und Startort', () =>
    lauf('ph-gleichung', (a, w) => {
      nah(wert(a, 0) * w.w, 2 * Math.PI);
      expect(Math.abs(Math.sin(w.w * wert(a, 3) + w.phi0))).toBeLessThan(1e-9);
    }));
  it('ph-phi0-ablesen: Kurve startet bei ŝ·sin φ₀', () =>
    lauf('ph-phi0-ablesen', (a, w) => {
      nah(a.plot!.kurven[0].f(0) + 10, w.amp * Math.sin(w.phi0) + 10, 1e-9);
    }));
  it('ph-kreis: Markierung liegt auf dem Einheitskreis', () =>
    lauf('ph-kreis', (a, w) => {
      const m = a.plot!.markierungen![0];
      nah(m.x ** 2 + m.y ** 2, 1);
      nah(Math.atan2(m.y, m.x) < 0 ? Math.atan2(m.y, m.x) + 2 * Math.PI : Math.atan2(m.y, m.x), w.phi);
    }));
});

describe('Thema 7 – Differenzialgleichungen', () => {
  it('dgl-erkennen: ω² = k, T = 2π/ω', () =>
    lauf('dgl-erkennen', (a, w) => {
      nah(wert(a, 0) ** 2, w.k);
      nah(wert(a, 1) * wert(a, 0), 2 * Math.PI);
    }));
  it('dgl-u-rohr: T aus ω² = D/m mit m = ρAℓ (gesamte Säule)', () =>
    lauf('dgl-u-rohr', (a, w) => {
      const m = w.rho * w.A * w.L;
      nah(wert(a, 1), 2 * Math.PI * Math.sqrt(m / w.D));
      nah(wert(a, 0), w.D * w.amp);
      nah(wert(a, 2), w.amp * Math.sqrt(2 * G / w.L));
    }));
  it('dgl-boje: Gleichgewicht, ω₀² = g/h₀ = ρgA/m', () =>
    lauf('dgl-boje', (a, w) => {
      nah(w.rho * w.A * wert(a, 0), w.m);
      nah(wert(a, 1) ** 2, G / w.h0, 1e-9);
      nah(wert(a, 1) ** 2, (w.rho * G * w.A) / w.m, 1e-9);
      expect(w.amp).toBeLessThan(w.h0);
      nah(wert(a, 4), wert(a, 3) * wert(a, 1));
    }));
  it('dgl-klotz: h₀ < a und T = 2π√(h₀/g)', () =>
    lauf('dgl-klotz', (a, w) => {
      expect(wert(a, 0)).toBeLessThan(w.a);
      nah(wert(a, 1), 2 * Math.PI * Math.sqrt(wert(a, 0) / G));
    }));
  it('dgl-faden-planet: T = 2π/√k', () =>
    lauf('dgl-faden-planet', (a) => {
      nah(wert(a, 1), (2 * Math.PI) / Math.sqrt(wert(a, 0)));
    }));
});

describe('Thema 2 – Fadenpendel', () => {
  it('fa-periode: T = 2π√(ℓ/g), n = 60/T', () =>
    lauf('fa-periode', (a, w) => {
      nah(wert(a, 0), 2 * Math.PI * Math.sqrt(w.l / G));
      nah(wert(a, 2) * wert(a, 0), 60);
    }));
  it('fa-laenge: Rückrechnung ergibt T', () =>
    lauf('fa-laenge', (a, w) => nah(2 * Math.PI * Math.sqrt(wert(a, 0) / G), w.T)));
  it('fa-g-messung: g plausibel (9,6 … 10)', () =>
    lauf('fa-g-messung', (a) => {
      expect(wert(a, 1)).toBeGreaterThan(9.6);
      expect(wert(a, 1)).toBeLessThan(10);
    }));
  it('fa-richtgroesse: D = mg/ℓ', () => lauf('fa-richtgroesse', (a, w) => nah(wert(a, 0), (w.m * G) / w.l)));
  it('fa-kleinwinkel: α > sin α, Abweichung wächst mit dem Winkel', () =>
    lauf('fa-kleinwinkel', (a, w) => {
      expect(w.rad).toBeGreaterThan(w.sin);
      expect(wert(a, 2)).toBeGreaterThan(0);
      if (w.grad <= 10) expect(wert(a, 2)).toBeLessThan(0.006);
    }));
  it('fa-tabelle: g liegt nahe 9,81', () =>
    lauf('fa-tabelle', (a) => {
      expect(Math.abs(wert(a, 1) - 9.81)).toBeLessThan(0.15);
    }));
  it('fa-t2-diagramm: Steigung = 4π²/g', () => lauf('fa-t2-diagramm', (a, w) => nah(wert(a, 0) * w.g, 4 * Math.PI ** 2)));
});

describe('Thema 9 – Dämpfung', () => {
  it('dae-gleit: Energiebilanz stimmt, Abnahme linear', () =>
    lauf('dae-gleit', (a, w) => {
      const D = w.D;
      const s1 = w.amp0;
      const s2 = s1 - wert(a, 1);
      nah((D / 2) * (s1 ** 2 - s2 ** 2), wert(a, 0) * (s1 + s2), 1e-9);
      nah(wert(a, 3), wert(a, 0) * (s1 + s2), 1e-9);
      expect(wert(a, 2)).toBeGreaterThan(0);
    }));
  it('dae-exp: t½ = ln2/δ, Energieanteil = (Amplitudenanteil)²', () =>
    lauf('dae-exp', (a, w) => {
      nah(Math.exp(-wert(a, 0) * wert(a, 1)), 0.5);
      nah(wert(a, 3), (wert(a, 2) / (w.amp0 / 100)) ** 2, 1e-9);
    }));
  it('dae-halbwert: Verlust pro Periode und Zielzeit konsistent', () =>
    lauf('dae-halbwert', (a, w) => {
      nah(1 - wert(a, 1), Math.exp(-2 * wert(a, 0) * w.T));
      nah(Math.exp(-2 * wert(a, 0) * wert(a, 2)), w.ziel, 1e-9);
      expect(wert(a, 1)).toBeGreaterThan(0);
      expect(wert(a, 1)).toBeLessThan(1);
    }));
  it('dae-verhaeltnis: ŝ₁/ŝ₂ = e^{δT}', () =>
    lauf('dae-verhaeltnis', (a, w) => {
      nah(Math.exp(wert(a, 0) * w.T), w.a1 / w.a2);
      nah(wert(a, 1), 2 * w.m * wert(a, 0));
    }));
  it('dae-diagramm: Hüllkurve geht durch die Hochpunkte', () =>
    lauf('dae-diagramm', (a, w) => {
      const f = a.plot!.kurven[0].f;
      nah(f(w.n * w.T), w.aN, 1e-9);
    }));
  it('dae-modell: richtiges Diagramm ist linear', () =>
    lauf('dae-modell', (a) => {
      const ant = a.teile[0].antwort;
      if (ant.art !== 'auswahl' || !ant.plots) throw new Error();
      const p = ant.plots[ant.richtig].punkte!;
      // Steigungen zwischen Nachbarpunkten fast gleich (Rauschen ±1 %)
      const st = p.slice(1).map((q, i) => (q.y - p[i].y) / (q.x - p[i].x));
      const mittel = st.reduce((x, y) => x + y, 0) / st.length;
      const streu = Math.max(...st.map((x) => Math.abs(x - mittel)));
      expect(streu).toBeLessThan(Math.abs(mittel) * 0.6 + 0.05);
    }));
});

describe('Themen 0, 1, 4, 8', () => {
  it('bw-fall: v = −g·t und Aufprall nach √(2h/g)', () =>
    lauf('bw-fall', (a, w) => {
      nah(wert(a, 0), -G * w.t1);
      nah(0.5 * G * wert(a, 1) ** 2, w.h0);
      nah(wert(a, 2) ** 2, 2 * G * w.h0);
    }));
  it('gb-zaehlen: T·f = 1', () => lauf('gb-zaehlen', (a) => nah(wert(a, 0) * wert(a, 1), 1)));
  it('hm-knickbahn: s = ½·a·t₁², T ~ √ŝ', () =>
    lauf('hm-knickbahn', (a, w) => {
      nah(0.5 * wert(a, 0) * wert(a, 1) ** 2, w.amp);
      nah(wert(a, 2), 4 * wert(a, 1));
      nah(wert(a, 3), Math.SQRT2 * wert(a, 2));
    }));
  it('en-gesamt: ½DŝBetrag² = ½mv̂² und Energieerhaltung bei s', () =>
    lauf('en-gesamt', (a, w) => {
      nah(0.5 * w.m * wert(a, 1) ** 2, wert(a, 0));
      nah(wert(a, 2) + 0.5 * w.D * w.s ** 2, wert(a, 0));
    }));
  it('en-anteil-zeit: Anteile summieren sich zu 1', () => lauf('en-anteil-zeit', (a) => nah(wert(a, 0) + wert(a, 1), 1)));
  it('en-v-stelle: ½mv² + ½Ds² = ½Dŝ² (mit D/m = ω²)', () =>
    lauf('en-v-stelle', (a, w) => nah(wert(a, 0) ** 2 + w.w ** 2 * w.s ** 2, w.w ** 2 * w.amp ** 2)));
  it('en-faden: Kleinwinkel-Energie nahe mgh', () =>
    lauf('en-faden', (a, w) => {
      const s = w.l * (w.grad * Math.PI / 180);
      const eKlein = 0.5 * ((w.m * G) / w.l) * s * s;
      expect(Math.abs(eKlein - wert(a, 1)) / wert(a, 1)).toBeLessThan(0.05);
    }));
  it('en-diagramm: E_pot + E_kin = E', () =>
    lauf('en-diagramm', (a, w) => {
      const [p, k] = a.plot!.kurven;
      for (const t of [0.1, 0.37, 1.3]) nah(p.f(t) + k.f(t), w.E);
    }));
});
