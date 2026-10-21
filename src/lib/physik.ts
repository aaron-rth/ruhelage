// Physikalische Grundformeln. Alle Rechentrainer nutzen diese Funktionen,
// damit Lösungen immer vom Code berechnet und zentral getestet werden.

export const G = 9.81; // m/s², Ortsfaktor wie im Unterricht

export const omegaAusT = (T: number) => (2 * Math.PI) / T;
export const tAusOmega = (w: number) => (2 * Math.PI) / w;
export const fAusT = (T: number) => 1 / T;

export const periodeFeder = (m: number, D: number) => 2 * Math.PI * Math.sqrt(m / D);
export const periodeFaden = (l: number, g = G) => 2 * Math.PI * Math.sqrt(l / g);
export const laengeAusPeriode = (T: number, g = G) => g * (T / (2 * Math.PI)) ** 2;
export const masseAusPeriode = (T: number, D: number) => D * (T / (2 * Math.PI)) ** 2;
export const federkonstanteAusPeriode = (T: number, m: number) => m * omegaAusT(T) ** 2;
export const gAusPendel = (l: number, T: number) => (4 * Math.PI ** 2 * l) / T ** 2;

export const richtgroesseFaden = (m: number, l: number, g = G) => (m * g) / l;
export const federnParallel = (D1: number, D2: number) => D1 + D2;
export const federnReihe = (D1: number, D2: number) => (D1 * D2) / (D1 + D2);

export const vMax = (amp: number, w: number) => amp * w;
export const aMax = (amp: number, w: number) => amp * w * w;

/** s(t) = ŝ·sin(ωt + φ₀) */
export const auslenkung = (amp: number, w: number, phi0: number, t: number) => amp * Math.sin(w * t + phi0);
export const geschwindigkeit = (amp: number, w: number, phi0: number, t: number) => amp * w * Math.cos(w * t + phi0);
export const beschleunigung = (amp: number, w: number, phi0: number, t: number) => -amp * w * w * Math.sin(w * t + phi0);

/** Amplitude und Nullphase (in [0, 2π)) aus s₀ und v₀ für s(t) = ŝ·sin(ωt + φ₀). */
export function phaseAusAnfang(s0: number, v0: number, w: number): { amp: number; phi0: number } {
  const amp = Math.hypot(s0, v0 / w);
  let phi0 = Math.atan2(s0, v0 / w);
  if (phi0 < 0) phi0 += 2 * Math.PI;
  return { amp, phi0 };
}

/** Erster Zeitpunkt t > 0 mit s(t) = 0 (Durchgang durch die Gleichgewichtslage). */
export function ersterNulldurchgang(phi0: number, w: number): number {
  const k = Math.floor(phi0 / Math.PI + 1e-9) + 1;
  return (k * Math.PI - phi0) / w;
}

/** Erster Zeitpunkt t > 0, an dem ein Umkehrpunkt erreicht wird (ωt + φ₀ = π/2 + kπ). */
export function ersterUmkehrpunkt(phi0: number, w: number): number {
  const k = Math.floor((phi0 - Math.PI / 2) / Math.PI + 1e-9) + 1;
  return (Math.PI / 2 + k * Math.PI - phi0) / w;
}

export const energieFeder = (D: number, amp: number) => 0.5 * D * amp * amp;
export const energieKin = (m: number, v: number) => 0.5 * m * v * v;

/** U-Rohr: Flüssigkeitssäule der Gesamtlänge L */
export const periodeURohr = (L: number, g = G) => 2 * Math.PI * Math.sqrt(L / (2 * g));
export const richtgroesseURohr = (rho: number, A: number, g = G) => 2 * rho * A * g;

/** Schwimmender Körper mit konstanter Querschnittsfläche A */
export const richtgroesseBoje = (rho: number, A: number, g = G) => rho * g * A;
export const eintauchtiefe = (m: number, rho: number, A: number) => m / (rho * A);

/** Dämpfung durch Gleitreibung: Amplitudenabnahme pro halber Periode */
export const gleitreibungAbnahme = (Fgl: number, D: number) => (2 * Fgl) / D;

/** Abklingkonstante δ = b/(2m) */
export const abklingAusB = (b: number, m: number) => b / (2 * m);
export const abklingAusHalbwertszeit = (tH: number) => Math.LN2 / tH;
export const halbwertszeit = (delta: number) => Math.LN2 / delta;
/** Anteil der Energie, der in einer Periode verloren geht (E ~ ŝ²) */
export const energieVerlustProPeriode = (delta: number, T: number) => 1 - Math.exp(-2 * delta * T);
export const omegaGedaempft = (w0: number, delta: number) => Math.sqrt(w0 * w0 - delta * delta);

/** Eigenfrequenz eines gefederten Fahrzeugs aus der Einsinktiefe Δx bei Zusatzmasse Δm */
export const federAusEinsinken = (dm: number, dx: number, g = G) => (dm * g) / dx;
export const eigenfrequenz = (m: number, D: number) => Math.sqrt(D / m) / (2 * Math.PI);

/** Pendeluhr: relative Gangabweichung ΔT/T ≈ ½·Δℓ/ℓ */
export const relPeriodenAenderung = (relLaengenAenderung: number) => 0.5 * relLaengenAenderung;
export const SEKUNDEN_PRO_TAG = 86400;

/** relative Unsicherheit von g aus g ~ ℓ/T² (Größtfehler) */
export const relUnsicherheitG = (relL: number, relT: number) => relL + 2 * relT;
