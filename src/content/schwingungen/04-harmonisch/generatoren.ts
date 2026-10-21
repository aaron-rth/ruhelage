import { g, tg, tw, tz } from '../../../lib/format';
import { G } from '../../../lib/physik';
import { auswahl, gg, teil, zahl } from '../../helfer';
import type { Generator, PlotSpec } from '../../types';
import { zeitPlot } from '../diagramm';

const GRAD = Math.PI / 180;

const knickbahn: Generator = {
  id: 'hm-knickbahn',
  titel: 'Wagen auf der Knickbahn',
  art: 'rechnen',
  schwierigkeit: 2,
  quelle: 'Buch S. 161 (Material C)',
  klausur: true,
  erzeuge(rng) {
    const alpha = rng.zahl(2, 15, 1);
    const ampCm = rng.zahl(10, 60, 5);
    const a = G * Math.sin(alpha * GRAD);
    const t1 = Math.sqrt((2 * (ampCm / 100)) / a);
    const T = 4 * t1;
    const T2 = T * Math.SQRT2;
    const vmax = a * t1;
    return {
      titel: 'Knickbahn',
      kontext: `Ein Wagen steht auf einer Knickbahn aus zwei schiefen Ebenen mit dem Neigungswinkel $\\alpha = ${alpha}^\\circ$. Er wird um ${g('\\hat s', ampCm, 'cm')} entlang der Bahn aus der Gleichgewichtslage (dem Knick) hochgeschoben und losgelassen. Reibung wird vernachlässigt.`,
      teile: [
        teil(
          'Berechne den Betrag der Beschleunigung auf der schiefen Ebene.',
          zahl(a, 'm/s^2', [{ wert: G * Math.sin(alpha), hinweis: 'Rechner auf **DEG** stellen (der Winkel ist in Grad gegeben).' }, { wert: G * Math.cos(alpha * GRAD), hinweis: 'Hangabtrieb gehört zum **Sinus** des Neigungswinkels.' }]),
          [gg(`$\\alpha = ${alpha}^\\circ$`, '$a$', '$F_H = m g\\sin\\alpha$ und $F = m a$'), 'Die Masse kürzt sich: $a = g\\sin\\alpha$.', `$\\sin(${alpha}^\\circ) = ${tz(Math.sin(alpha * GRAD), 4)}$`],
          `$$a = \\frac{F_H}{m} = g\\sin\\alpha = 9{,}81\\,\\mathrm{\\tfrac{m}{s^2}}\\cdot\\sin(${alpha}^\\circ) = ${tg(a, 'm/s^2')}$$ Diese Beschleunigung ist **konstant** – unabhängig davon, wo der Wagen gerade ist.`,
        ),
        teil(
          'Wie lange braucht der Wagen vom Loslassen bis zum Knick?',
          zahl(t1, 's', [{ wert: Math.sqrt((ampCm / 100) / a), hinweis: 'Aus $\\hat s = \\frac12 a t_1^2$: Der Faktor 2 gehört in den Zähler.' }]),
          [gg(`$\\hat s$, $a$`, '$t_1$', '$\\hat s = \\frac12 a t_1^2$ (gleichmäßig beschleunigt aus der Ruhe)'), 'Nach $t_1$ auflösen.', `$t_1 = \\sqrt{\\frac{2\\hat s}{a}}$`],
          `$$t_1 = \\sqrt{\\frac{2\\hat s}{g\\sin\\alpha}} = \\sqrt{\\frac{2\\cdot ${tw(ampCm / 100)}\\,\\mathrm m}{${tg(a, 'm/s^2', 4)}}} = ${tg(t1, 's')}$$`,
        ),
        teil(
          'Berechne die Periodendauer.',
          zahl(T, 's', [{ wert: 2 * t1, hinweis: 'Eine Periode: runter, hoch, runter, hoch – das sind **vier** Abschnitte der Dauer $t_1$.' }]),
          [gg('$t_1$', '$T$', 'Symmetrie der Bewegung'), 'Bis zum Knick, auf der anderen Seite hoch, zurück zum Knick, zurück zum Start.', '$T = 4\\,t_1$'],
          `$$T = 4\\,t_1 = ${tg(T, 's')}$$`,
        ),
        teil(
          'Wie groß wäre die Periodendauer bei **doppelter** Startauslenkung?',
          zahl(T2, 's', [{ wert: T, hinweis: 'Bei einer harmonischen Schwingung wäre das so – hier aber steht $\\hat s$ in der Formel!' }, { wert: 2 * T, hinweis: '$\\hat s$ steht unter der Wurzel.' }]),
          [gg('$T \\sim \\sqrt{\\hat s}$', '$T\'$ bei $2\\hat s$'), 'Welcher Faktor ergibt sich, wenn unter der Wurzel verdoppelt wird?', '$T\' = \\sqrt2\\cdot T$'],
          `$$T' = \\sqrt2\\cdot T = ${tg(T2, 's')}$$ Die Periodendauer hängt von der Amplitude ab → die Schwingung ist **nicht harmonisch**.`,
        ),
      ],
      werte: { alpha, a, t1, T, T2, vmax, amp: ampCm / 100 },
    };
  },
};

function kennlinie(art: 'linear' | 'konstant' | 'hart' | 'falsch', D: number): PlotSpec {
  const f = (s: number) => {
    const x = s / 10; // s in cm, x in "Einheiten"
    if (art === 'linear') return -D * x;
    if (art === 'konstant') return x > 0.02 ? -D * 0.5 : x < -0.02 ? D * 0.5 : -D * 25 * x;
    if (art === 'hart') return -D * (x + 1.2 * x * x * x);
    return D * x;
  };
  return {
    x: [-10, 10],
    y: [-2.6 * D, 2.6 * D],
    xLabel: 's in cm',
    yLabel: 'F in N',
    xSchritt: 5,
    ySchritt: D,
    xNachkomma: 0,
    yNachkomma: 0,
    kurven: [{ f, stil: 'blau' }],
  };
}

const kennlinienWahl: Generator = {
  id: 'hm-kennlinien',
  titel: 'Welche Kennlinie führt zu einer harmonischen Schwingung?',
  art: 'diagramm',
  schwierigkeit: 1,
  quelle: 'Buch S. 158, 161 (Material C), 167 (Material D)',
  erzeuge(rng) {
    const D = rng.wahl([1, 2, 4]);
    const arten = ['linear', 'konstant', 'hart', 'falsch'] as const;
    const idx = rng.mische([0, 1, 2, 3]);
    const plots = idx.map((i) => kennlinie(arten[i], D));
    return {
      titel: 'Kennlinien vergleichen',
      kontext: 'Die Diagramme zeigen die Kraft auf einen Körper in Abhängigkeit von seiner Auslenkung $s$ für vier verschiedene Anordnungen.',
      teile: [
        teil(
          'Bei welcher Anordnung schwingt der Körper harmonisch?',
          auswahl(idx.map((_, k) => `Anordnung ${String.fromCharCode(65 + k)}`), idx.indexOf(0), plots),
          ['Harmonisch heißt: lineares Kraftgesetz $F = -D\\cdot s$.', 'Gesucht ist eine **Gerade durch den Ursprung**.', 'Sie muss **fallen**: Die Kraft zeigt immer zur Ruhelage zurück.'],
          'Nur die **fallende Ursprungsgerade** erfüllt $F = -D\\cdot s$. Die waagerechten Stufen (konstante Kraft, wie Knickbahn) und die gekrümmte Kennlinie (härter werdende Feder) sind nicht linear. Die steigende Gerade treibt den Körper sogar weiter weg – da gibt es gar keine Schwingung.',
        ),
      ],
      werte: { richtig: idx.indexOf(0) },
    };
  },
};

const vtErkennen: Generator = {
  id: 'hm-vt-erkennen',
  titel: 'Harmonisch? Am v-t-Diagramm erkennen',
  art: 'diagramm',
  schwierigkeit: 2,
  quelle: 'Buch S. 161 (Material C, C2b)',
  erzeuge(rng) {
    const harmonisch = rng.chance(0.5);
    const T = rng.wahl([1, 2, 4]);
    const vmax = rng.wahl([0.2, 0.4, 0.5, 0.8]);
    const w = (2 * Math.PI) / T;
    const dreieck = (t: number) => {
      const p = ((t / T) % 1 + 1) % 1;
      // Start im Umkehrpunkt: v = 0, dann linear auf −v̂ bei T/4, zurück auf 0 bei T/2, +v̂ bei 3T/4
      if (p < 0.25) return -vmax * (p / 0.25);
      if (p < 0.5) return -vmax * (1 - (p - 0.25) / 0.25);
      if (p < 0.75) return vmax * ((p - 0.5) / 0.25);
      return vmax * (1 - (p - 0.75) / 0.25);
    };
    const f = harmonisch ? (t: number) => -vmax * Math.sin(w * t) : dreieck;
    return {
      titel: 'Sinus oder Zickzack?',
      kontext: 'Das Diagramm zeigt die Geschwindigkeit eines schwingenden Wagens, der bei $t = 0$ im oberen Umkehrpunkt losgelassen wird.',
      plot: zeitPlot({ f, tMax: 2 * T, yMax: vmax, yLabel: 'v in m/s' }),
      teile: [
        teil(
          'Ist die Schwingung harmonisch?',
          auswahl(['ja – lineares Kraftgesetz (z. B. Federpendel)', 'nein – konstante Rückstellkraft (z. B. Knickbahn)'], harmonisch ? 0 : 1),
          ['Die Steigung im v-t-Diagramm ist die Beschleunigung.', 'Bei konstanter Kraft ist die Beschleunigung konstant – der v-t-Graph besteht dann aus geraden Stücken.', 'Bei linearem Kraftgesetz ist auch $v(t)$ eine Sinuskurve.'],
          harmonisch
            ? 'Der v-t-Graph ist eine glatte **Sinuskurve** – die Beschleunigung ändert sich ständig proportional zur Auslenkung: **harmonisch**.'
            : 'Der v-t-Graph besteht aus **geraden Stücken** (Zickzack): Die Beschleunigung ist abschnittsweise konstant – typisch für eine konstante Hangabtriebskraft wie bei der Knickbahn. **Nicht harmonisch.**',
        ),
      ],
      werte: { harmonisch: harmonisch ? 1 : 0, T, vmax },
    };
  },
};

export const generatoren: Generator[] = [knickbahn, kennlinienWahl, vtErkennen];
