import { g, tg, tgw, tw } from '../../../lib/format';
import { gg, teil, zahl } from '../../helfer';
import type { Generator } from '../../types';
import { SCHOENE_AMP_CM, SCHOENE_T, zeitPlot } from '../diagramm';

const zaehlen: Generator = {
  id: 'gb-zaehlen',
  titel: 'T und f aus einer Zählung',
  art: 'rechnen',
  schwierigkeit: 1,
  quelle: 'Buch S. 153 Aufg. 3',
  erzeuge(rng) {
    const fall = rng.wahl([
      { text: 'Ein baumelnder Kranhaken', n: [5, 12], T: [3, 9] },
      { text: 'Eine Schiffschaukel auf dem Jahrmarkt', n: [4, 10], T: [2.5, 5] },
      { text: 'Ein Kind auf einer Schaukel', n: [6, 15], T: [1.8, 3.2] },
      { text: 'Eine Kugel an einer Feder', n: [10, 30], T: [0.3, 1.2] },
      { text: 'Ein Metronom-Pendel', n: [20, 40], T: [0.4, 1.5] },
    ]);
    const n = rng.int(fall.n[0], fall.n[1]);
    const dt = Number((n * rng.zahl(fall.T[0], fall.T[1], 0.01)).toFixed(1));
    const T = dt / n;
    const f = n / dt;
    return {
      titel: 'Mitzählen',
      kontext: `${fall.text} führt in ${g('\\Delta t', dt, 's')} genau ${n} vollständige Schwingungen aus.`,
      teile: [
        teil('Berechne die Periodendauer.', zahl(T, 's', [{ wert: n / dt, hinweis: 'Das ist die Frequenz. $T$ ist Zeit **pro** Schwingung.' }]), [gg(`$n = ${n}$, $\\Delta t$`, '$T$', '$T = \\frac{\\Delta t}{n}$'), 'Gesamtzeit durch Anzahl.', `$\\frac{${tw(dt)}}{${n}}$`], `$$T = \\frac{\\Delta t}{n} = \\frac{${tgw(dt, 's')}}{${n}} = ${tg(T, 's')}$$`),
        teil('Berechne die Frequenz.', zahl(f, 'Hz', [{ wert: T, hinweis: 'Das ist $T$. Die Frequenz ist der Kehrwert.' }]), [gg('$n$, $\\Delta t$', '$f$', '$f = \\frac{n}{\\Delta t} = \\frac1T$'), 'Schwingungen pro Sekunde.', `$\\frac{${n}}{${tw(dt)}\\,\\mathrm s}$`], `$$f = \\frac{n}{\\Delta t} = ${tg(f, 'Hz')}$$`),
      ],
      werte: { n, dt, T, f },
    };
  },
};

const kenngroessen: Generator = {
  id: 'gb-kenngroessen',
  titel: 'Kenngrößen aus dem Diagramm ablesen',
  art: 'diagramm',
  schwierigkeit: 1,
  quelle: 'Buch S. 152–153; Selbstcheck Punkt 2',
  erzeuge(rng) {
    const T = rng.wahl(SCHOENE_T);
    const amp = rng.wahl(SCHOENE_AMP_CM);
    const phi0 = rng.wahl([0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2]);
    const w = (2 * Math.PI) / T;
    const plot = zeitPlot({ f: (t) => amp * Math.sin(w * t + phi0), tMax: 2.5 * T, yMax: amp, yLabel: 's in cm' });
    return {
      titel: 'Ablesen',
      kontext: 'Das Diagramm zeigt die Auslenkung einer ungedämpften Schwingung.',
      plot,
      teile: [
        teil('Lies die Amplitude ab.', zahl(amp / 100, 'cm', [{ wert: (2 * amp) / 100, hinweis: 'Von der Ruhelage aus messen, nicht von oben nach unten.' }], 0.03), ['Die Amplitude ist die größte Auslenkung.', 'Lies den Hochpunkt ab.', 'Von $s = 0$ aus messen.'], `$\\hat s = ${tw(amp)}\\,\\mathrm{cm}$`),
        teil('Lies die Periodendauer ab.', zahl(T, 's', [{ wert: T / 2, hinweis: 'Das ist eine halbe Periode – von Nulldurchgang zu Nulldurchgang.' }], 0.03), ['Gleicher Schwingungszustand: z. B. von Hochpunkt zu Hochpunkt.', 'Nicht von Nulldurchgang zum nächsten – dort ist die Richtung umgekehrt.', 'Über zwei Perioden ablesen und halbieren.'], `$T = ${tgw(T, 's')}$`),
        teil('Berechne die Frequenz.', zahl(1 / T, 'Hz'), [gg('$T$', '$f$', '$f = \\frac1T$'), 'Kehrwert.', `$\\frac{1}{${tw(T)}\\,\\mathrm s}$`], `$$f = \\frac1T = ${tg(1 / T, 'Hz')}$$`),
      ],
      werte: { T, amp },
    };
  },
};

export const generatoren: Generator[] = [zaehlen, kenngroessen];
