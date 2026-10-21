import { g, tg, tw, tz } from '../../../lib/format';
import { G } from '../../../lib/physik';
import { auswahl, gg, teil, zahl } from '../../helfer';
import type { Generator, PlotSpec } from '../../types';

const vorsilben: Generator = {
  id: 'bw-vorsilben',
  titel: 'Periodendauer und Frequenz mit Vorsilben',
  art: 'rechnen',
  schwierigkeit: 1,
  quelle: 'Notizen Lehrer 18.9.; Buch S. 151',
  erzeuge(rng) {
    const fall = rng.wahl([
      { T: rng.zahl(0.05, 0.9, 0.01) * 1e-3, eT: 'ms', fE: 'kHz' },
      { T: rng.zahl(20, 900, 10) * 1e-6, eT: 'µs', fE: 'kHz' },
      { T: rng.zahl(1, 50, 1) * 1e-3, eT: 'ms', fE: 'Hz' },
      { T: rng.zahl(1, 9, 0.5) * 1e-9, eT: 'ns', fE: 'MHz' },
    ]);
    const T = fall.T;
    const f = 1 / T;
    const zeigeT = fall.eT === 'ms' ? T * 1e3 : fall.eT === 'µs' ? T * 1e6 : T * 1e9;
    const einheitT = fall.eT === 'ns' ? '\\mathrm{ns}' : fall.eT === 'µs' ? '\\mu\\mathrm s' : '\\mathrm{ms}';
    const faktor = fall.eT === 'ms' ? '10^{-3}' : fall.eT === 'µs' ? '10^{-6}' : '10^{-9}';
    const was = rng.wahl(['Ein Ton auf dem Oszilloskop', 'Eine Ultraschall-Schwingung', 'Die Schwingung einer Lautsprechermembran', 'Ein Signal im Schwingkreis eines Radios']);
    return {
      titel: 'Vorsilben-Training',
      kontext: `${was} hat die Periodendauer $T = ${tw(zeigeT)}\\,${einheitT}$.`,
      teile: [
        teil(
          'Gib $T$ in Sekunden an.',
          zahl(T, 's', [{ wert: T * 1e3, hinweis: 'Prüfe die Zehnerpotenz der Vorsilbe.' }]),
          [gg(`$T = ${tw(zeigeT)}\\,${einheitT}$`, '$T$ in s'), `Die Vorsilbe bedeutet den Faktor $${faktor}$.`, `$T = ${tw(zeigeT)}\\cdot ${faktor}\\,\\mathrm s$`],
          `$$T = ${tw(zeigeT)}\\cdot ${faktor}\\,\\mathrm s = ${tz(T, 3)}\\,\\mathrm s$$`,
        ),
        teil(
          `Berechne die Frequenz (z. B. in ${fall.fE}).`,
          zahl(f, fall.fE === 'MHz' ? 'MHz' : fall.fE === 'kHz' ? 'kHz' : 'Hz'),
          [gg('$T$ in s', '$f$', '$f = \\frac1T$'), 'Kehrwert bilden, dann mit der passenden Vorsilbe angeben.', `$f = \\frac{1}{${tz(T, 3)}\\,\\mathrm s}$`],
          `$$f = \\frac1T = ${tz(f, 3)}\\,\\mathrm{Hz}${fall.fE !== 'Hz' ? ` = ${tz(f / (fall.fE === 'kHz' ? 1e3 : 1e6), 3)}\\,\\mathrm{${fall.fE}}` : ''}$$`,
        ),
      ],
      werte: { T, f },
    };
  },
};

/** Stückweise lineares s-t-Diagramm (Abschnitte I–IV) */
function stueckweise(rng: Parameters<Generator['erzeuge']>[0]) {
  const n = 4;
  const zeiten = [0];
  const orte = [rng.zahl(0, 4, 1)];
  // mindestens zwei Abschnitte mit Bewegung
  const arten = Array.from({ length: n }, () => rng.wahl(['steht', 'hoch', 'runter']));
  if (arten.filter((a) => a !== 'steht').length < 2) {
    arten[0] = 'hoch';
    arten[2] = 'runter';
  }
  for (let i = 0; i < n; i++) {
    zeiten.push(zeiten[i] + rng.wahl([1, 2, 3]));
    const art = arten[i];
    const ds = art === 'steht' ? 0 : (art === 'hoch' ? 1 : -1) * rng.wahl([1, 2, 3, 4]);
    let neu = orte[i] + ds;
    if (neu < 0 || neu > 10) neu = orte[i] - ds;
    orte.push(neu);
  }
  const f = (t: number) => {
    for (let i = 0; i < n; i++) if (t <= zeiten[i + 1]) return orte[i] + ((orte[i + 1] - orte[i]) * (t - zeiten[i])) / (zeiten[i + 1] - zeiten[i]);
    return orte[n];
  };
  return { zeiten, orte, f };
}

const steigung: Generator = {
  id: 'bw-steigung',
  titel: 'Geschwindigkeit aus dem s-t-Diagramm',
  art: 'diagramm',
  schwierigkeit: 1,
  quelle: 'Buch S. 151 Aufg. 5',
  erzeuge(rng) {
    const { zeiten, orte, f } = stueckweise(rng);
    const tMax = zeiten[4];
    const plot: PlotSpec = {
      x: [0, tMax],
      y: [0, 11],
      xLabel: 't in s',
      yLabel: 's in m',
      xSchritt: 1,
      ySchritt: 1,
      xFein: 0.5,
      yFein: 0.5,
      xNachkomma: 0,
      yNachkomma: 0,
      kurven: [{ f, stil: 'akzent' }],
    };
    // Abschnitt mit Bewegung bevorzugen
    const kandidaten = [0, 1, 2, 3].filter((i) => orte[i + 1] !== orte[i]);
    const i = rng.wahl(kandidaten);
    const v = (orte[i + 1] - orte[i]) / (zeiten[i + 1] - zeiten[i]);
    const name = ['I', 'II', 'III', 'IV'][i];
    return {
      titel: 'Steigungen lesen',
      kontext: `Das Diagramm zeigt den Ort eines Spielzeugautos. Die Abschnitte I bis IV beginnen bei $t = ${zeiten.slice(0, 4).join('\\,\\mathrm s$, $')}\\,\\mathrm s$.`,
      plot,
      teile: [
        teil(
              `Bestimme die Geschwindigkeit im Abschnitt ${name} (mit Vorzeichen).`,
              zahl(v, 'm/s', [{ wert: -v, hinweis: 'Fällt der Graph, ist die Geschwindigkeit negativ.' }]),
              [gg('Diagramm', '$v$', '$v = \\frac{\\Delta s}{\\Delta t}$'), `Lies Anfang und Ende von Abschnitt ${name} ab.`, `$\\Delta t = ${zeiten[i + 1] - zeiten[i]}\\,\\mathrm s$, $\\Delta s = ${orte[i + 1] - orte[i]}\\,\\mathrm m$`],
              `$$v = \\frac{\\Delta s}{\\Delta t} = \\frac{${orte[i + 1]}\\,\\mathrm m - ${orte[i]}\\,\\mathrm m}{${zeiten[i + 1] - zeiten[i]}\\,\\mathrm s} = ${tg(v, 'm/s')}$$`,
            ),
      ],
      werte: { v, i },
    };
  },
};

const stZuVt: Generator = {
  id: 'bw-st-vt',
  titel: 'Passendes v-t-Diagramm zu einem s-t-Diagramm',
  art: 'diagramm',
  schwierigkeit: 2,
  quelle: 'Buch S. 151 Aufg. 6',
  erzeuge(rng) {
    const { zeiten, orte, f } = stueckweise(rng);
    const tMax = zeiten[4];
    const v = (k: number) => (orte[k + 1] - orte[k]) / (zeiten[k + 1] - zeiten[k]);
    const vf = (vs: number[]) => (t: number) => {
      for (let k = 0; k < 4; k++) if (t < zeiten[k + 1]) return vs[k];
      return vs[3];
    };
    const echt = [0, 1, 2, 3].map(v);
    const varianten = [echt, echt.map((x) => -x), [...echt.slice(1), echt[0]], echt.map((x, k) => (k % 2 ? x : x * 0.5 + 0.5))];
    // Varianten müssen sich von allen vorherigen unterscheiden
    const gleich = (a: number[], b: number[]) => a.every((x, k) => Math.abs(x - b[k]) < 1e-9);
    for (let k = 1; k < varianten.length; k++) {
      let z = 0;
      while (varianten.slice(0, k).some((w) => gleich(w, varianten[k])) && z < 8) {
        varianten[k] = varianten[k].map((x, j) => (j === z % 4 ? x + 1 : x));
        z++;
      }
    }
    const vMax = Math.max(1, ...varianten.flat().map(Math.abs));
    const mini = (vs: number[]): PlotSpec => ({
      x: [0, tMax],
      y: [-Math.ceil(vMax + 0.5), Math.ceil(vMax + 0.5)],
      xLabel: 't in s',
      yLabel: 'v in m/s',
      xSchritt: 1,
      ySchritt: 1,
      xNachkomma: 0,
      yNachkomma: 0,
      kurven: [{ f: vf(vs), stil: 'blau' }],
    });
    const idx = rng.mische([0, 1, 2, 3]);
    return {
      titel: 'Vom Ort zur Geschwindigkeit',
      kontext: 'Gegeben ist das s-t-Diagramm einer Bewegung, die aus geradlinigen Abschnitten besteht.',
      plot: { x: [0, tMax], y: [0, 11], xLabel: 't in s', yLabel: 's in m', xSchritt: 1, ySchritt: 1, xFein: 0.5, yFein: 0.5, xNachkomma: 0, yNachkomma: 0, kurven: [{ f, stil: 'akzent' }] },
      teile: [
        teil(
          'Welches v-t-Diagramm gehört dazu?',
          auswahl(idx.map((_, k) => `Diagramm ${String.fromCharCode(65 + k)}`), idx.indexOf(0), idx.map((i) => mini(varianten[i]))),
          ['Die Geschwindigkeit ist die Steigung jedes Abschnitts.', 'Waagerecht → $v = 0$; steigend → $v > 0$; fallend → $v < 0$.', `Abschnitt I: $v = ${tz(echt[0] + 0, 2)}\\,\\mathrm{m/s}$`],
          `Die Steigungen der Abschnitte sind ${echt.map((x) => `$${tz(x + 0, 2)}\\,\\mathrm{m/s}$`).join(', ')}. Das passende v-t-Diagramm zeigt genau diese Werte als waagerechte Stufen.`,
        ),
      ],
      werte: { richtig: idx.indexOf(0) },
    };
  },
};

const freierFall: Generator = {
  id: 'bw-fall',
  titel: 'Freier Fall: Ableiten statt Formel suchen',
  art: 'rechnen',
  schwierigkeit: 1,
  quelle: 'Buch S. 151 Aufg. 8',
  erzeuge(rng) {
    const h0 = rng.zahl(5, 80, 1);
    const tFall = Math.sqrt((2 * h0) / G);
    const t1 = Number((rng.zahl(0.2, 0.8, 0.05) * tFall).toFixed(1)) || 0.5;
    const v1 = -G * t1;
    const vEnde = -G * tFall;
    const ding = rng.wahl(['Ein Stein fällt von einer Brücke', 'Ein Apfel fällt von einem hohen Baum', 'Ein Schlüssel fällt aus einem Fenster']);
    return {
      titel: 'Fallen lassen',
      kontext: `${ding} aus ${g('h_0', h0, 'm')} Höhe. Ohne Luftwiderstand gilt $h(t) = h_0 - \\frac g2 t^2$ (nach oben positiv).`,
      teile: [
        teil('Wie groß ist die Geschwindigkeit (mit Vorzeichen) nach ' + g('t_1', t1, 's') + '?', zahl(v1, 'm/s', [{ wert: -v1, hinweis: 'Nach oben ist positiv – fallen heißt negatives $v$.' }, { wert: (-G / 2) * t1, hinweis: 'Beim Ableiten von $t^2$ entsteht $2t$ – der Faktor $\\frac12$ verschwindet.' }]), [gg('$h(t)$', '$v(t_1)$', '$v(t) = \\dot h(t)$'), 'Ableiten: $\\frac{d}{dt}\\left(-\\frac g2 t^2\\right) = -g\\,t$.', '$v(t) = -g\\,t$'], `$$v(t_1) = -g\\,t_1 = -9{,}81\\,\\mathrm{\\tfrac{m}{s^2}}\\cdot ${tw(t1)}\\,\\mathrm s = ${tg(v1, 'm/s')}$$`),
        teil('Nach welcher Zeit kommt er unten an?', zahl(tFall, 's', [{ wert: h0 / G, hinweis: 'Ansatz $h(t) = 0$: $t^2 = \\frac{2h_0}{g}$ – Wurzel ziehen nicht vergessen.' }]), [gg('$h_0$', '$t$', '$h(t) = 0$'), '$h_0 = \\frac g2 t^2$ nach $t$ auflösen.', `$\\frac{2h_0}{g} = ${tz((2 * h0) / G, 3)}\\,\\mathrm{s^2}$`], `$$t = \\sqrt{\\frac{2h_0}{g}} = ${tg(tFall, 's')}$$`),
        teil('Mit welcher Geschwindigkeit kommt er unten an?', zahl(vEnde, 'm/s', [{ wert: -vEnde, hinweis: 'Mit Vorzeichen: Bewegung nach unten.' }]), [gg('Fallzeit', '$v$', '$v = -g\\,t$'), 'Fallzeit aus b) einsetzen.', `$t = ${tz(tFall, 3)}\\,\\mathrm s$`], `$$v = -g\\cdot ${tz(tFall, 4)}\\,\\mathrm s = ${tg(vEnde, 'm/s')}$$`),
      ],
      werte: { h0, t1, v1, tFall, vEnde },
    };
  },
};

export const generatoren: Generator[] = [vorsilben, freierFall, steigung, stZuVt];
