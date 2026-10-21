import { g, tg, tgw, tw, tz } from '../../../lib/format';
import { G } from '../../../lib/physik';
import { auswahl, gg, teil, zahl } from '../../helfer';
import type { Generator } from '../../types';

const GRAD = Math.PI / 180;

const gesamt: Generator = {
  id: 'en-gesamt',
  titel: 'Gesamtenergie und Höchstgeschwindigkeit',
  art: 'rechnen',
  schwierigkeit: 1,
  quelle: 'Buch S. 169 Aufg. 2',
  klausur: true,
  erzeuge(rng) {
    const D = rng.zahl(5, 200, 5);
    const m = rng.zahl(0.1, 2, 0.05);
    const ampCm = rng.zahl(2, 15, 0.5);
    const amp = ampCm / 100;
    const E = 0.5 * D * amp * amp;
    const vmax = Math.sqrt((2 * E) / m);
    const anteil = rng.wahl([0.25, 0.4, 0.5, 0.6, 0.75, 0.8]);
    const s = anteil * amp;
    const Ekin = E - 0.5 * D * s * s;
    return {
      titel: 'Energie im Federpendel',
      kontext: `Ein Körper (${g('m', m * 1000, 'g')}) schwingt an einer Feder mit ${g('D', D, 'N/m')} und der Amplitude ${g('\\hat s', ampCm, 'cm')}. Reibung wird vernachlässigt.`,
      teile: [
        teil(
          'Berechne die Gesamtenergie der Schwingung.',
          zahl(E, 'mJ', [{ wert: 0.5 * D * ampCm * ampCm, hinweis: 'Amplitude in Meter einsetzen.' }, { wert: D * amp * amp, hinweis: 'Der Faktor $\\frac12$ fehlt.' }, { wert: 0.5 * D * amp, hinweis: '$\\hat s$ wird quadriert.' }]),
          [gg('$D$, $\\hat s$', '$E_\\text{ges}$', '$E_\\text{ges} = \\frac12 D\\hat s^2$'), 'Im Umkehrpunkt ist die gesamte Energie Spannenergie.', `$\\hat s^2 = ${tz(amp * amp, 3)}\\,\\mathrm{m^2}$`],
          `$$E_\\text{ges} = \\frac12 D\\hat s^2 = \\frac12\\cdot ${tgw(D, 'N/m')}\\cdot(${tw(amp)}\\,\\mathrm m)^2 = ${tg(E, 'J')} = ${tg(E * 1000, 'mJ')}$$`,
        ),
        teil(
          'Berechne aus der Energie die maximale Geschwindigkeit.',
          zahl(vmax, 'm/s', [{ wert: Math.sqrt((2 * E) / (m * 1000)), hinweis: 'Masse in kg einsetzen.' }, { wert: E / m, hinweis: 'Nach $v$ auflösen: $v = \\sqrt{2E/m}$.' }]),
          [gg('$E_\\text{ges}$, $m$', '$\\hat v$', '$E_\\text{ges} = \\frac12 m\\hat v^2$'), 'In der Ruhelage ist die gesamte Energie kinetisch.', `$\\hat v = \\sqrt{\\frac{2E}{m}}$`],
          `$$\\hat v = \\sqrt{\\frac{2E_\\text{ges}}{m}} = \\sqrt{\\frac{2\\cdot ${tz(E, 4)}\\,\\mathrm J}{${tw(m)}\\,\\mathrm{kg}}} = ${tg(vmax, 'm/s')}$$ Kontrolle: $\\hat s\\,\\omega = \\hat s\\sqrt{D/m}$ liefert dasselbe.`,
        ),
        teil(
          `Wie groß ist die kinetische Energie an der Stelle ${g('s', s * 100, 'cm')}?`,
          zahl(Ekin, 'mJ', [{ wert: 0.5 * D * s * s, hinweis: 'Das ist die potenzielle Energie an dieser Stelle. Gesucht ist der Rest.' }]),
          [gg('$E_\\text{ges}$, $D$, $s$', '$E_\\text{kin}$', '$E_\\text{kin} = E_\\text{ges} - \\frac12 D s^2$'), 'Energieerhaltung: Was nicht potenziell ist, ist kinetisch.', `$E_\\text{pot} = ${tg(0.5 * D * s * s * 1000, 'mJ')}$`],
          `$$E_\\text{kin} = E_\\text{ges} - \\frac12 D s^2 = ${tg(E * 1000, 'mJ')} - ${tg(0.5 * D * s * s * 1000, 'mJ')} = ${tg(Ekin * 1000, 'mJ')}$$ Das sind $${tz((Ekin / E) * 100, 3)}\\,\\%$ – genau $1 - (s/\\hat s)^2$.`,
        ),
      ],
      werte: { D, m, amp, E, vmax, s, Ekin },
    };
  },
};

const anteilZeit: Generator = {
  id: 'en-anteil-zeit',
  titel: 'Energieanteile zu einem Zeitpunkt',
  art: 'rechnen',
  schwierigkeit: 2,
  quelle: 'Buch S. 169 Aufg. 4',
  erzeuge(rng) {
    const bruch = rng.wahl([
      { z: 1, n: 12 },
      { z: 1, n: 16 },
      { z: 1, n: 10 },
      { z: 1, n: 20 },
      { z: 3, n: 16 },
      { z: 1, n: 6 },
      { z: 3, n: 10 },
      { z: 2, n: 5 },
    ]);
    const x = bruch.z / bruch.n;
    const potAnteil = Math.cos(2 * Math.PI * x) ** 2;
    const kinAnteil = 1 - potAnteil;
    return {
      titel: 'Wer hat gerade mehr?',
      kontext: `Ein ungedämpftes Federpendel wird im oberen Umkehrpunkt losgelassen ($t = 0$). Betrachtet wird der Zeitpunkt $t = \\frac{${bruch.z}}{${bruch.n}}\\,T$.`,
      teile: [
        teil(
          'Welcher Anteil der Gesamtenergie liegt dann als potenzielle Energie vor?',
          zahl(potAnteil, '%', [{ wert: Math.cos(2 * Math.PI * x), hinweis: 'Quadrieren: $E_\\text{pot} \\sim s^2 \\sim \\cos^2$.' }, { wert: Math.cos(360 * x) ** 2, hinweis: 'Rechner auf Bogenmaß stellen oder in Grad konsequent mit $360^\\circ$ rechnen.' }], 0.02),
          [
            gg(`$t = \\frac{${bruch.z}}{${bruch.n}}T$`, '$\\frac{E_\\text{pot}}{E_\\text{ges}}$', '$\\frac{E_\\text{pot}}{E_\\text{ges}} = \\cos^2(\\omega t)$'),
            `$\\omega t = \\frac{2\\pi}{T}\\cdot\\frac{${bruch.z}}{${bruch.n}}T = \\frac{${2 * bruch.z}\\pi}{${bruch.n}}$`,
            `$\\cos\\left(\\frac{${2 * bruch.z}\\pi}{${bruch.n}}\\right) = ${tz(Math.cos(2 * Math.PI * x), 4)}$`,
          ],
          `$$\\frac{E_\\text{pot}}{E_\\text{ges}} = \\cos^2\\left(2\\pi\\cdot\\frac{${bruch.z}}{${bruch.n}}\\right) = ${tz(potAnteil * 100, 3)}\\,\\%$$`,
        ),
        teil(
          'Welcher Anteil ist kinetische Energie?',
          zahl(kinAnteil, '%', [{ wert: potAnteil, hinweis: 'Das ist der potenzielle Anteil.' }], 0.02),
          [gg('Anteil $E_\\text{pot}$', 'Anteil $E_\\text{kin}$'), 'Die Summe ist immer 100 %.', `$100\\,\\% - ${tz(potAnteil * 100, 3)}\\,\\%$`],
          `$$\\frac{E_\\text{kin}}{E_\\text{ges}} = \\sin^2(\\omega t) = ${tz(kinAnteil * 100, 3)}\\,\\%$$`,
        ),
      ],
      werte: { x, potAnteil, kinAnteil },
    };
  },
};

const vAnStelle: Generator = {
  id: 'en-v-stelle',
  titel: 'Geschwindigkeit an einer beliebigen Stelle',
  art: 'rechnen',
  schwierigkeit: 2,
  quelle: 'Buch S. 169',
  erzeuge(rng) {
    const T = rng.zahl(0.4, 3, 0.1);
    const ampCm = rng.zahl(4, 20, 1);
    const sCm = Math.round(ampCm * rng.wahl([0.3, 0.5, 0.6, 0.8]) * 2) / 2;
    const w = (2 * Math.PI) / T;
    const v = w * Math.sqrt((ampCm / 100) ** 2 - (sCm / 100) ** 2);
    return {
      titel: 'Schnell oder langsam?',
      kontext: `Ein Pendel schwingt harmonisch mit ${g('T', T, 's')} und ${g('\\hat s', ampCm, 'cm')}.`,
      teile: [
        teil(
          `Wie schnell ist der Körper, wenn er gerade bei ${g('s', sCm, 'cm')} ist?`,
          zahl(v, 'm/s', [{ wert: w * (ampCm - sCm) / 100, hinweis: 'Nicht einfach die Abstände subtrahieren – erst quadrieren: $\\sqrt{\\hat s^2 - s^2}$.' }]),
          [
            gg('$T$, $\\hat s$, $s$', '$v$', '$\\frac12 m v^2 = \\frac12 D(\\hat s^2 - s^2)$'),
            'Mit $\\frac Dm = \\omega^2$ folgt $v = \\omega\\sqrt{\\hat s^2 - s^2}$.',
            `$\\omega = ${tg(w, '1/s', 4)}$, $\\hat s^2 - s^2 = ${tz((ampCm ** 2 - sCm ** 2) / 1e4, 3)}\\,\\mathrm{m^2}$`,
          ],
          `$$v = \\omega\\sqrt{\\hat s^2 - s^2} = ${tg(w, '1/s', 4)}\\cdot\\sqrt{(${tw(ampCm / 100)}\\,\\mathrm m)^2 - (${tw(sCm / 100)}\\,\\mathrm m)^2} = ${tg(v, 'm/s')}$$`,
        ),
      ],
      werte: { T, w, amp: ampCm / 100, s: sCm / 100, v },
    };
  },
};

const faden: Generator = {
  id: 'en-faden',
  titel: 'Fadenpendel: Energie über die Höhe',
  art: 'rechnen',
  schwierigkeit: 2,
  quelle: 'Buch S. 172 (Material A)',
  klausur: true,
  erzeuge(rng) {
    const m = rng.zahl(0.5, 15, 0.5);
    const l = rng.zahl(0.5, 5, 0.1);
    const grad = rng.zahl(8, 40, 1);
    const h = l * (1 - Math.cos(grad * GRAD));
    const E = m * G * h;
    const vmax = Math.sqrt(2 * G * h);
    const ding = rng.wahl(['Eine Abrissbirne', 'Eine schwere Kugel an einem Seil', 'Ein Sandsack an einem Seil']);
    return {
      titel: 'Höhe und Energie',
      kontext: `${ding} (${g('m', m, 'kg')}) hängt an einem ${g('\\ell', l, 'm')} langen Seil. Sie wird um $\\hat\\alpha = ${grad}^\\circ$ ausgelenkt und losgelassen.`,
      teile: [
        teil(
          'Um wie viel liegt sie im Umkehrpunkt höher als in der Ruhelage?',
          zahl(h, 'cm', [{ wert: l * Math.cos(grad * GRAD), hinweis: 'Das ist der senkrechte Abstand zum Aufhängepunkt. Die Höhe über der Ruhelage ist $\\ell - \\ell\\cos\\hat\\alpha$.' }, { wert: l * (1 - Math.cos(grad)), hinweis: 'Rechner auf Grad (DEG) stellen.' }]),
          [gg('$\\ell$, $\\hat\\alpha$', '$h$', '$h = \\ell(1 - \\cos\\hat\\alpha)$'), 'Der senkrechte Abstand zum Aufhängepunkt ist im Umkehrpunkt $\\ell\\cos\\hat\\alpha$, in der Ruhelage $\\ell$.', `$\\cos(${grad}^\\circ) = ${tz(Math.cos(grad * GRAD), 4)}$`],
          `$$h = \\ell\\,(1 - \\cos\\hat\\alpha) = ${tgw(l, 'm')}\\cdot(1 - ${tz(Math.cos(grad * GRAD), 4)}) = ${tg(h * 100, 'cm')}$$`,
        ),
        teil('Berechne die Schwingungsenergie.', zahl(E, 'J'), [gg('$m$, $h$', '$E$', '$E = m g h$'), 'Im Umkehrpunkt ist die ganze Energie Lageenergie.', `$h = ${tz(h, 3)}\\,\\mathrm m$`], `$$E = m g h = ${tw(m)}\\,\\mathrm{kg}\\cdot 9{,}81\\,\\mathrm{\\tfrac{m}{s^2}}\\cdot ${tz(h, 3)}\\,\\mathrm m = ${tg(E, 'J')}$$`),
        teil('Wie schnell ist sie beim Durchgang durch die Ruhelage?', zahl(vmax, 'm/s'), [gg('$h$', '$\\hat v$', '$mgh = \\frac12 m\\hat v^2$'), 'Die Masse kürzt sich: $\\hat v = \\sqrt{2gh}$.', `$2gh = ${tz(2 * G * h, 3)}\\,\\mathrm{m^2/s^2}$`], `$$\\hat v = \\sqrt{2gh} = ${tg(vmax, 'm/s')}$$`),
      ],
      werte: { m, l, grad, h, E, vmax },
    };
  },
};

const energieDiagramm: Generator = {
  id: 'en-diagramm',
  titel: 'Energieverläufe im Diagramm',
  art: 'diagramm',
  schwierigkeit: 2,
  quelle: 'Buch S. 168 (Abb. 2)',
  erzeuge(rng) {
    const T = rng.wahl([1, 2, 4]);
    const E = rng.wahl([20, 40, 50, 80, 100]);
    const ausUmkehr = rng.chance(0.5);
    const w = (2 * Math.PI) / T;
    const pot = (t: number) => E * (ausUmkehr ? Math.cos(w * t) : Math.sin(w * t)) ** 2;
    const kin = (t: number) => E - pot(t);
    const D = rng.wahl([10, 20, 40, 50]);
    const amp = Math.sqrt((2 * E) / 1000 / D);
    return {
      titel: 'Zwei Kurven, eine Summe',
      kontext: 'Das Diagramm zeigt die potenzielle (blau) und die kinetische (türkis) Energie eines ungedämpften Federpendels.',
      plot: {
        x: [0, 2 * T],
        y: [0, E * 1.25],
        xLabel: 't in s',
        yLabel: 'E in mJ',
        xSchritt: T / 4,
        ySchritt: E / 4,
        xFein: T / 8,
        yFein: E / 8,
        xNachkomma: T === 1 ? 2 : T === 2 ? 1 : 0,
        yNachkomma: 0,
        kurven: [
          { f: pot, stil: 'blau', label: 'E_pot' },
          { f: kin, stil: 'akzent', label: 'E_kin' },
        ],
      },
      teile: [
        teil('Lies die Gesamtenergie ab.', zahl(E / 1000, 'mJ', [{ wert: E / 2000, hinweis: 'Das ist der Schnittpunkt der Kurven. Die Gesamtenergie ist die Summe – der Maximalwert jeder Kurve.' }], 0.03), ['Die Summe beider Kurven ist an jeder Stelle gleich.', 'Wo eine Kurve null ist, zeigt die andere die ganze Energie.', 'Lies den Maximalwert ab.'], `$E_\\text{ges} = ${E}\\,\\mathrm{mJ}$ – so hoch reicht jede der beiden Kurven.`),
        teil(
          'Wo startet das Pendel bei $t = 0$?',
          auswahl(['in einem Umkehrpunkt', 'in der Ruhelage'], ausUmkehr ? 0 : 1),
          ['Im Umkehrpunkt ist $E_\\text{kin} = 0$.', 'In der Ruhelage ist $E_\\text{pot} = 0$.', 'Welche Kurve ist bei $t = 0$ null?'],
          ausUmkehr ? 'Bei $t = 0$ ist $E_\\text{kin} = 0$ → Start im **Umkehrpunkt**.' : 'Bei $t = 0$ ist $E_\\text{pot} = 0$ → Start in der **Ruhelage**.',
        ),
        teil(
          `Die Federkonstante ist ${g('D', D, 'N/m')}. Berechne die Amplitude.`,
          zahl(amp, 'cm', [{ wert: Math.sqrt((2 * E) / D), hinweis: 'Energie in Joule umrechnen: $1\\,\\mathrm{mJ} = 10^{-3}\\,\\mathrm J$.' }]),
          [gg('$E_\\text{ges}$, $D$', '$\\hat s$', '$E_\\text{ges} = \\frac12 D\\hat s^2$'), 'Nach $\\hat s$ auflösen: $\\hat s = \\sqrt{2E/D}$.', `$E = ${tw(E / 1000)}\\,\\mathrm J$`],
          `$$\\hat s = \\sqrt{\\frac{2E_\\text{ges}}{D}} = \\sqrt{\\frac{2\\cdot ${tw(E / 1000)}\\,\\mathrm J}{${D}\\,\\mathrm{N/m}}} = ${tg(amp * 100, 'cm')}$$`,
        ),
      ],
      werte: { E, T, D, amp, ausUmkehr: ausUmkehr ? 1 : 0 },
    };
  },
};

export const generatoren: Generator[] = [gesamt, vAnStelle, anteilZeit, faden, energieDiagramm];
