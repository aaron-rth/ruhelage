import { g, tg, tgw, tw, tz } from '../../../lib/format';
import { G, gAusPendel, periodeFaden, SEKUNDEN_PRO_TAG } from '../../../lib/physik';
import { auswahl, gg, teil, zahl } from '../../helfer';
import type { Generator } from '../../types';

const unsicherheit: Generator = {
  id: 'q-unsicherheit',
  titel: 'g mit Messunsicherheit bestimmen',
  art: 'rechnen',
  schwierigkeit: 3,
  quelle: 'Übungsklausur (Aufgabentyp); Buch S. 188 (Training I)',
  klausur: true,
  erzeuge(rng) {
    const l = rng.wahl([0.5, 0.6, 0.75, 0.8, 1.2, 1.5, 1.8]);
    const dl = rng.wahl([0.002, 0.003, 0.005, 0.01]);
    const n = rng.wahl([10, 15, 25, 30, 40]);
    const dt = rng.wahl([0.1, 0.2, 0.3]);
    const t = Number((n * periodeFaden(l, rng.wahl([9.79, 9.81, 9.83]))).toFixed(1));
    const T = t / n;
    const gW = gAusPendel(l, T);
    const relL = dl / l;
    const relT = dt / t;
    const rel = relL + 2 * relT;
    const dg = rel * gW;
    return {
      titel: 'Wie genau ist g?',
      kontext: `Für ein Fadenpendel misst eine Gruppe die Länge $\\ell = (${tw(l)} \\pm ${tw(dl)})\\,\\mathrm m$ und für ${n} Perioden die Zeit $t = (${tw(t)} \\pm ${tw(dt)})\\,\\mathrm s$.`,
      teile: [
        teil('Berechne $g$.', zahl(gW, 'm/s^2', [], 0.01), [gg('$\\ell$, $t$, $n$', '$g$', '$g = \\frac{4\\pi^2\\ell}{T^2}$ mit $T = \\frac tn$'), 'Erst $T$ aus der Gesamtzeit.', `$T = ${tz(T, 4)}\\,\\mathrm s$`], `$$T = \\frac{${tw(t)}\\,\\mathrm s}{${n}} = ${tg(T, 's', 4)},\\qquad g = \\frac{4\\pi^2\\cdot ${tw(l)}\\,\\mathrm m}{(${tz(T, 4)}\\,\\mathrm s)^2} = ${tg(gW, 'm/s^2')}$$`),
        teil(
          'Schätze die relative Unsicherheit von $g$ ab (in %).',
          zahl(rel, '%', [{ wert: relL + relT, hinweis: 'Die Zeit geht wegen $T^2$ **doppelt** ein.' }, { wert: relL + 2 * (dt / T), hinweis: 'Die Unsicherheit $\\Delta t$ gehört zur Gesamtzeit $t$, also $\\frac{\\Delta T}{T} = \\frac{\\Delta t}{t}$.' }], 0.04),
          [gg('$\\Delta\\ell$, $\\Delta t$', '$\\frac{\\Delta g}{g}$', '$\\frac{\\Delta g}{g} \\approx \\frac{\\Delta\\ell}{\\ell} + 2\\frac{\\Delta T}{T}$'), 'Für $T = \\frac tn$ ist $\\frac{\\Delta T}{T} = \\frac{\\Delta t}{t}$.', `$\\frac{\\Delta\\ell}{\\ell} = ${tz(relL * 100, 3)}\\,\\%$, $\\frac{\\Delta t}{t} = ${tz(relT * 100, 3)}\\,\\%$`],
          `$$\\frac{\\Delta g}{g} \\approx ${tz(relL * 100, 3)}\\,\\% + 2\\cdot ${tz(relT * 100, 3)}\\,\\% = ${tz(rel * 100, 3)}\\,\\%$$`,
        ),
        teil('Wie groß ist die absolute Unsicherheit $\\Delta g$?', zahl(dg, 'm/s^2', [], 0.05), [gg('$g$, $\\frac{\\Delta g}{g}$', '$\\Delta g$'), 'Relative Unsicherheit mal Messwert.', `$${tz(rel, 3)}\\cdot ${tz(gW, 4)}$`], `$$\\Delta g = ${tz(rel, 3)}\\cdot ${tg(gW, 'm/s^2')} \\approx ${tg(dg, 'm/s^2', 2)}$$ Ergebnis: $g = (${tz(gW, 3)} \\pm ${tz(dg, 1)})\\,\\mathrm{m/s^2}$.`),
      ],
      werte: { l, t, n, T, g: gW, rel, dg },
    };
  },
};

const aufzug: Generator = {
  id: 'q-aufzug',
  titel: 'Fadenpendel im Aufzug',
  art: 'rechnen',
  schwierigkeit: 2,
  quelle: 'Übungsklausur (Aufgabentyp)',
  klausur: true,
  erzeuge(rng) {
    const fall = rng.wahl([
      { text: 'fährt nach oben an', vz: 1 },
      { text: 'bremst während der Abwärtsfahrt ab', vz: 1 },
      { text: 'fährt nach unten an', vz: -1 },
      { text: 'bremst während der Aufwärtsfahrt ab', vz: -1 },
    ]);
    const l = rng.zahl(0.3, 1.5, 0.05);
    const a = rng.zahl(0.5, 3.5, 0.1);
    const gEff = G + fall.vz * a;
    const T = 2 * Math.PI * Math.sqrt(l / gEff);
    const T0 = periodeFaden(l);
    return {
      titel: 'Pendel im Fahrstuhl',
      kontext: `In einem Aufzug hängt ein Fadenpendel der Länge ${g('\\ell', l, 'm')}. Der Aufzug ${fall.text}, der Betrag der Beschleunigung ist ${g('a', a, 'm/s^2')}.`,
      teile: [
        teil(
          'Wie groß ist die effektive Fallbeschleunigung im Aufzug?',
          zahl(gEff, 'm/s^2', [{ wert: G - fall.vz * a, hinweis: 'Überlege, in welche Richtung die Beschleunigung zeigt: Anfahren nach oben oder Bremsen beim Abwärtsfahren heißt Beschleunigung nach **oben**.' }]),
          [gg('$g$, $a$, Richtung', '$g_\\text{eff}$', '$g_\\text{eff} = g \\pm a$'), 'Zeigt die Beschleunigung des Aufzugs nach oben, wird man „schwerer“: $g + a$.', fall.vz > 0 ? 'Hier zeigt die Beschleunigung nach oben.' : 'Hier zeigt die Beschleunigung nach unten.'],
          `Die Beschleunigung zeigt nach **${fall.vz > 0 ? 'oben' : 'unten'}**, also $$g_\\text{eff} = g ${fall.vz > 0 ? '+' : '-'} a = ${tg(gEff, 'm/s^2')}$$`,
        ),
        teil(
          'Berechne die Periodendauer in dieser Phase.',
          zahl(T, 's', [{ wert: T0, hinweis: 'Das ist $T$ im ruhenden Aufzug – setze $g_\\text{eff}$ ein.' }]),
          [gg('$\\ell$, $g_\\text{eff}$', '$T$', '$T = 2\\pi\\sqrt{\\frac{\\ell}{g_\\text{eff}}}$'), 'Wie sonst, nur mit $g_\\text{eff}$.', `$\\frac{\\ell}{g_\\text{eff}} = ${tz(l / gEff, 3)}\\,\\mathrm{s^2}$`],
          `$$T = 2\\pi\\sqrt{\\frac{${tgw(l, 'm')}}{${tg(gEff, 'm/s^2', 4)}}} = ${tg(T, 's')}$$ Zum Vergleich in Ruhe: $${tg(T0, 's')}$ – ${fall.vz > 0 ? 'schneller' : 'langsamer'}.`,
        ),
      ],
      werte: { l, a, gEff, T, T0 },
    };
  },
};

const pendeluhr: Generator = {
  id: 'q-pendeluhr',
  titel: 'Gangabweichung einer Pendeluhr',
  art: 'rechnen',
  schwierigkeit: 2,
  quelle: 'Übungsklausur (Aufgabentyp)',
  klausur: true,
  erzeuge(rng) {
    const laenger = rng.chance(0.6);
    const proz = rng.wahl([0.008, 0.012, 0.015, 0.025, 0.03, 0.04, 0.05]);
    const relL = (laenger ? 1 : -1) * proz / 100;
    const relT = 0.5 * relL;
    const tag = SEKUNDEN_PRO_TAG * Math.abs(relT);
    const uhr = rng.wahl(['Eine Turmuhr', 'Eine Standuhr im Flur', 'Eine alte Bahnhofsuhr', 'Eine Kuckucksuhr']);
    return {
      titel: 'Vor oder nach?',
      kontext: `${uhr} mit Pendel geht bei mittlerer Temperatur genau. ${laenger ? 'An heißen Tagen' : 'Im kalten Winter'} ist die Pendelstange um ${tz(proz, 2)} % ${laenger ? 'länger' : 'kürzer'}.`,
      teile: [
        teil(
          'Um wie viel Prozent ändert sich die Periodendauer (Betrag)?',
          zahl(Math.abs(relT), '%', [{ wert: Math.abs(relL), hinweis: '$T\\sim\\sqrt\\ell$ – die relative Änderung halbiert sich.' }, { wert: 2 * Math.abs(relL), hinweis: 'Es ist eine Wurzel, kein Quadrat: Faktor $\\frac12$.' }], 0.03),
          [gg('$\\frac{\\Delta\\ell}{\\ell}$', '$\\frac{\\Delta T}{T}$', '$\\frac{\\Delta T}{T} \\approx \\frac12\\frac{\\Delta\\ell}{\\ell}$'), 'Weil $T \\sim \\ell^{1/2}$, zählt die relative Änderung halb.', `$\\frac12\\cdot ${tz(proz, 2)}\\,\\%$`],
          `$$\\frac{\\Delta T}{T} \\approx \\frac12\\cdot ${tz(proz, 2)}\\,\\% = ${tz(proz / 2, 3)}\\,\\%$$`,
        ),
        teil(
          'Um wie viele Sekunden weicht die Uhr pro Tag ab?',
          zahl(tag, 's', [{ wert: SEKUNDEN_PRO_TAG * Math.abs(relL), hinweis: 'Nimm $\\frac{\\Delta T}{T}$, nicht $\\frac{\\Delta\\ell}{\\ell}$.' }, { wert: 3600 * Math.abs(relT), hinweis: 'Ein Tag hat $86\\,400\\,\\mathrm s$, nicht $3600\\,\\mathrm s$.' }]),
          [gg('$\\frac{\\Delta T}{T}$', 'Abweichung pro Tag'), 'Jede Periode ist um diesen Bruchteil zu lang/kurz – über einen ganzen Tag summiert sich das.', `$86\\,400\\,\\mathrm s\\cdot ${tz(Math.abs(relT), 3)}$`],
          `$$\\Delta t_\\text{Tag} \\approx 86\\,400\\,\\mathrm s\\cdot ${tz(Math.abs(relT), 3)} = ${tg(tag, 's')}$$`,
        ),
        teil(
          'Geht die Uhr vor oder nach?',
          auswahl(['Sie geht vor.', 'Sie geht nach.'], laenger ? 1 : 0),
          ['Die Uhr zählt Perioden.', laenger ? 'Längeres Pendel → längere Periode.' : 'Kürzeres Pendel → kürzere Periode.', 'Zählt sie pro echter Stunde mehr oder weniger Perioden als vorgesehen?'],
          laenger ? 'Das Pendel ist länger → jede Periode dauert länger → die Uhr zählt zu wenige → sie **geht nach**.' : 'Das Pendel ist kürzer → jede Periode ist kürzer → die Uhr zählt zu viele → sie **geht vor**.',
        ),
      ],
      werte: { relL, relT, tag, laenger: laenger ? 1 : 0 },
    };
  },
};

const waerme: Generator = {
  id: 'q-waerme',
  titel: 'Wärmeausdehnung und Pendeluhr',
  art: 'rechnen',
  schwierigkeit: 3,
  quelle: 'Übungsklausur (Aufgabentyp, erweitert)',
  erzeuge(rng) {
    const mat = rng.wahl([
      { name: 'Messing', a: 19e-6 },
      { name: 'Stahl', a: 12e-6 },
      { name: 'Aluminium', a: 23e-6 },
    ]);
    const dT = rng.zahl(8, 30, 1);
    const relL = mat.a * dT;
    const tag = SEKUNDEN_PRO_TAG * 0.5 * relL;
    return {
      titel: 'Sommer, Sonne, Gangabweichung',
      kontext: `Das Pendel einer Uhr hat eine Stange aus ${mat.name} ($\\alpha_\\text{th} = ${tz(mat.a * 1e6, 2)}\\cdot 10^{-6}\\,\\frac1{\\mathrm K}$). Die Uhr ist bei $15\\,^\\circ\\mathrm C$ genau eingestellt; im Sommer ist es im Raum um ${dT} K wärmer.`,
      teile: [
        teil('Um wie viel Prozent wird die Stange länger?', zahl(relL, '%', [], 0.02), [gg('$\\alpha_\\text{th}$, $\\Delta\\vartheta$', '$\\frac{\\Delta\\ell}{\\ell}$', '$\\Delta\\ell = \\alpha_\\text{th}\\,\\ell\\,\\Delta\\vartheta$'), 'Durch $\\ell$ teilen.', `$${tz(mat.a * 1e6, 2)}\\cdot 10^{-6}\\cdot ${dT}$`], `$$\\frac{\\Delta\\ell}{\\ell} = \\alpha_\\text{th}\\,\\Delta\\vartheta = ${tz(relL, 3)} = ${tz(relL * 100, 3)}\\,\\%$$`),
        teil('Wie viele Sekunden geht die Uhr pro Tag nach?', zahl(tag, 's', [{ wert: SEKUNDEN_PRO_TAG * relL, hinweis: 'Für $T$ zählt die Längenänderung nur halb.' }]), [gg('$\\frac{\\Delta\\ell}{\\ell}$', '$\\Delta t_\\text{Tag}$', '$\\frac{\\Delta T}{T} \\approx \\frac12\\frac{\\Delta\\ell}{\\ell}$'), 'Mit $86\\,400\\,\\mathrm s$ malnehmen.', `$\\frac{\\Delta T}{T} = ${tz(relL / 2, 3)}$`], `$$\\Delta t_\\text{Tag} \\approx 86\\,400\\,\\mathrm s\\cdot\\frac12\\cdot ${tz(relL, 3)} = ${tg(tag, 's')}$$`),
      ],
      werte: { relL, tag },
    };
  },
};

export const generatoren: Generator[] = [unsicherheit, aufzug, pendeluhr, waerme];
