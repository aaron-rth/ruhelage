import { g, tg, tgw, tw, tz } from '../../../lib/format';
import { G, gleitreibungAbnahme } from '../../../lib/physik';
import { auswahl, gg, teil, zahl } from '../../helfer';
import type { Generator, PlotSpec } from '../../types';
import { zeitPlot, zeitSchritt } from '../diagramm';

const gleit: Generator = {
  id: 'dae-gleit',
  titel: 'Dämpfung durch Gleitreibung',
  art: 'rechnen',
  schwierigkeit: 2,
  quelle: 'Buch S. 170; Notizen Lehrer 12.10.',
  klausur: true,
  erzeuge(rng) {
    const D = rng.zahl(10, 120, 5);
    const m = rng.zahl(0.2, 1.5, 0.1);
    const f = rng.wahl([0.02, 0.03, 0.04, 0.05, 0.08, 0.1]);
    const F = f * m * G;
    const d = gleitreibungAbnahme(F, D);
    const amp0 = Math.max(rng.zahl(4, 15, 0.5) / 100, 7 * d);
    const k = rng.int(1, 3);
    const ampK = amp0 - 2 * k * d;
    const dE = 0.5 * D * (amp0 ** 2 - (amp0 - d) ** 2);
    return {
      titel: 'Ein Schlitten mit Reibung',
      kontext: `Ein Schlitten (${g('m', m, 'kg')}) gleitet auf einer waagerechten Unterlage an einer Feder (${g('D', D, 'N/m')}). Zwischen Schlitten und Unterlage wirkt Gleitreibung mit ${g('f_{gl}', f, '')}. Er wird um ${g('\\hat s_1', amp0 * 100, 'cm')} ausgelenkt und losgelassen.`,
      teile: [
        teil(
          'Berechne die Gleitreibungskraft.',
          zahl(F, 'N', [{ wert: f * m, hinweis: 'Die Normalkraft ist hier die Gewichtskraft $m\\cdot g$.' }]),
          [gg('$f_{gl}$, $m$', '$F_{gl}$', '$F_{gl} = f_{gl}\\cdot F_N$'), 'Auf waagerechter Unterlage ist $F_N = m\\cdot g$.', `$F_N = ${tg(m * G, 'N')}$`],
          `$$F_{gl} = f_{gl}\\cdot m g = ${tw(f)}\\cdot ${tg(m * G, 'N')} = ${tg(F, 'N')}$$`,
        ),
        teil(
          'Um wie viel nimmt die Amplitude pro **halber** Periode ab?',
          zahl(d, 'cm', [{ wert: F / D, hinweis: 'Es ist $\\frac{2F_{gl}}{D}$ – der Faktor 2 kommt aus der Energiebilanz.' }, { wert: (4 * F) / D, hinweis: 'Das wäre die Abnahme pro **ganzer** Periode.' }]),
          [gg('$F_{gl}$, $D$', '$\\hat s_1 - \\hat s_2$', '$\\hat s_1 - \\hat s_2 = \\frac{2F_{gl}}{D}$'), 'Energiebilanz zwischen zwei Umkehrpunkten, 3. binomische Formel.', `$\\frac{2F_{gl}}{D} = \\frac{${tz(2 * F, 3)}\\,\\mathrm N}{${tw(D)}\\,\\mathrm{N/m}}$`],
          `$$\\hat s_1 - \\hat s_2 = \\frac{2F_{gl}}{D} = \\frac{2\\cdot ${tg(F, 'N')}}{${tgw(D, 'N/m')}} = ${tg(d * 100, 'cm')}$$`,
        ),
        teil(
          `Wie groß ist die Amplitude nach ${k} vollständigen Periode${k > 1 ? 'n' : ''}?`,
          zahl(ampK, 'cm', [{ wert: amp0 - k * d, hinweis: 'Eine ganze Periode hat **zwei** halbe Perioden – also zweimal die Abnahme.' }]),
          [gg(`$\\hat s_1$, Abnahme pro halber Periode`, `$\\hat s$ nach $${k}T$`), `In ${k} Periode${k > 1 ? 'n' : ''} gibt es ${2 * k} halbe Perioden.`, `Abnahme insgesamt: $${2 * k}\\cdot ${tz(d * 100, 3)}\\,\\mathrm{cm}$`],
          `$$\\hat s = ${tw(amp0 * 100)}\\,\\mathrm{cm} - ${2 * k}\\cdot ${tz(d * 100, 3)}\\,\\mathrm{cm} = ${tg(ampK * 100, 'cm')}$$ Die Abnahme ist linear – die Hoch- und Tiefpunkte liegen auf Geraden.`,
        ),
        teil(
          'Wie viel Energie wird in der ersten halben Periode in thermische Energie umgewandelt?',
          zahl(dE, 'mJ'),
          [gg('$D$, $\\hat s_1$, $\\hat s_2$', '$\\Delta E$', '$\\Delta E = \\frac D2(\\hat s_1^2 - \\hat s_2^2)$ oder $F_{gl}\\cdot(\\hat s_1 + \\hat s_2)$'), 'Beide Wege liefern dasselbe.', `$\\hat s_2 = ${tz((amp0 - d) * 100, 3)}\\,\\mathrm{cm}$`],
          `$$\\Delta E = F_{gl}\\,(\\hat s_1 + \\hat s_2) = ${tg(F, 'N')}\\cdot ${tz(2 * amp0 - d, 3)}\\,\\mathrm m = ${tg(dE * 1000, 'mJ')}$$`,
        ),
      ],
      werte: { D, F, d, amp0, ampK, k, dE },
    };
  },
};

const exponentiell: Generator = {
  id: 'dae-exp',
  titel: 'Abklingkonstante, Halbwertszeit, Energie',
  art: 'rechnen',
  schwierigkeit: 2,
  quelle: 'Buch S. 171',
  klausur: true,
  erzeuge(rng) {
    const m = rng.zahl(0.1, 2, 0.1);
    const b = rng.zahl(0.02, 0.6, 0.01) * m;
    const bR = Number(b.toFixed(3));
    const delta = bR / (2 * m);
    const tH = Math.LN2 / delta;
    const t1 = Number((rng.zahl(0.5, 2.5, 0.1) * tH).toFixed(0)) || 1;
    const amp0 = rng.zahl(3, 12, 0.5);
    const amp1 = amp0 * Math.exp(-delta * t1);
    const eAnteil = Math.exp(-2 * delta * t1);
    return {
      titel: 'Ausschwingen in Öl',
      kontext: `Ein Körper (${g('m', m, 'kg')}) schwingt an einer Feder und taucht dabei in ein Ölbad. Die Reibungskraft ist proportional zur Geschwindigkeit, ${g('b', bR, 'kg/s')}. Die Anfangsamplitude ist ${g('\\hat s', amp0, 'cm')}.`,
      teile: [
        teil(
          'Berechne die Abklingkonstante $\\delta$.',
          zahl(delta, '1/s', [{ wert: bR / m, hinweis: 'Im Exponenten steht $\\frac{b}{2m}$.' }]),
          [gg('$b$, $m$', '$\\delta$', '$\\delta = \\frac{b}{2m}$'), 'Aus der Lösung $s(t) = \\hat s\\,e^{-\\frac{b}{2m}t}\\sin(\\omega\'t)$.', `$2m = ${tw(2 * m)}\\,\\mathrm{kg}$`],
          `$$\\delta = \\frac{b}{2m} = \\frac{${tw(bR)}\\,\\mathrm{kg/s}}{${tw(2 * m)}\\,\\mathrm{kg}} = ${tg(delta, '1/s')}$$`,
        ),
        teil(
          'Nach welcher Zeit hat sich die Amplitude halbiert?',
          zahl(tH, 's', [{ wert: 0.5 / delta, hinweis: 'Ansatz $e^{-\\delta t} = \\frac12$, also $t = \\frac{\\ln 2}{\\delta}$.' }]),
          [gg('$\\delta$', '$t_{1/2}$', '$e^{-\\delta t_{1/2}} = \\frac12$'), 'Logarithmieren: $-\\delta t = \\ln\\frac12 = -\\ln 2$.', `$\\ln 2 \\approx 0{,}693$`],
          `$$t_{1/2} = \\frac{\\ln 2}{\\delta} = \\frac{0{,}693}{${tg(delta, '1/s')}} = ${tg(tH, 's')}$$`,
        ),
        teil(
          `Wie groß ist die Amplitude nach ${g('t', t1, 's')}?`,
          zahl(amp1 / 100, 'cm', [{ wert: (amp0 * Math.exp(-(bR / m) * t1)) / 100, hinweis: 'Exponent: $-\\delta t$ mit $\\delta = \\frac b{2m}$.' }]),
          [gg('$\\hat s$, $\\delta$, $t$', '$s_\\text{ampl}(t)$', '$s_\\text{ampl}(t) = \\hat s\\,e^{-\\delta t}$'), 'Einsetzen – die Einhüllende beschreibt die Amplitude.', `$e^{-\\delta t} = ${tz(Math.exp(-delta * t1), 3)}$`],
          `$$s_\\text{ampl} = ${tw(amp0)}\\,\\mathrm{cm}\\cdot e^{-${tz(delta, 3)}\\cdot ${t1}} = ${tg(amp1, 'cm')}$$`,
        ),
        teil(
          'Welcher Anteil der Anfangsenergie ist dann noch vorhanden?',
          zahl(eAnteil, '%', [{ wert: Math.exp(-delta * t1), hinweis: 'Das ist der Anteil der **Amplitude**. Die Energie hängt quadratisch von $\\hat s$ ab.' }], 0.03),
          [gg('$\\frac{s_\\text{ampl}}{\\hat s}$', '$\\frac{E}{E_0}$', '$E \\sim \\hat s^2$'), 'Verhältnis der Amplituden quadrieren.', `$\\frac{s_\\text{ampl}}{\\hat s} = ${tz(Math.exp(-delta * t1), 3)}$`],
          `$$\\frac{E}{E_0} = \\left(\\frac{s_\\text{ampl}}{\\hat s}\\right)^2 = e^{-2\\delta t} = ${tz(eAnteil * 100, 3)}\\,\\%$$`,
        ),
      ],
      werte: { m, b: bR, delta, tH, t1, amp0, amp1, eAnteil },
    };
  },
};

const halbwert: Generator = {
  id: 'dae-halbwert',
  titel: 'Energieverlust pro Periode',
  art: 'rechnen',
  schwierigkeit: 3,
  quelle: 'Buch S. 171, 173 (Material D)',
  klausur: true,
  erzeuge(rng) {
    const T = rng.wahl([0.4, 0.6, 0.8, 1.2, 2, 2.5, 3]);
    const tH = rng.wahl([5, 6, 8, 10, 15, 20, 25, 30]);
    const ziel = rng.wahl([0.05, 0.1, 0.2, 0.25, 0.02]);
    const delta = Math.LN2 / tH;
    const verlust = 1 - Math.exp(-2 * delta * T);
    const tZiel = Math.log(1 / ziel) / (2 * delta);
    const ding = rng.wahl(['Ein Pendel einer Wanduhr ohne Antrieb', 'Eine angeschlagene Gitarrensaite (Grundton, vereinfacht)', 'Ein Federpendel in Luft', 'Eine Schaukel nach dem letzten Anschubsen']);
    return {
      titel: 'Wie schnell geht die Energie verloren?',
      kontext: `${ding} schwingt schwach gedämpft mit ${g('T', T, 's')}. Die Amplitude nimmt exponentiell ab und halbiert sich jeweils innerhalb von ${g('t_{1/2}', tH, 's')}.`,
      teile: [
        teil(
          'Berechne die Abklingkonstante $\\delta$.',
          zahl(delta, '1/s', [{ wert: 0.5 / tH, hinweis: 'Aus $e^{-\\delta t_{1/2}} = \\frac12$ folgt $\\delta = \\frac{\\ln 2}{t_{1/2}}$.' }]),
          [gg('$t_{1/2}$', '$\\delta$', '$\\hat s\\,e^{-\\delta t_{1/2}} = \\frac12\\hat s$'), 'Logarithmieren.', '$\\delta = \\frac{\\ln 2}{t_{1/2}}$'],
          `$$\\delta = \\frac{\\ln 2}{t_{1/2}} = \\frac{0{,}693}{${tw(tH)}\\,\\mathrm s} = ${tg(delta, '1/s')}$$`,
        ),
        teil(
          'Wie viel Prozent der Schwingungsenergie gehen pro Periode verloren?',
          zahl(verlust, '%', [{ wert: 1 - Math.exp(-delta * T), hinweis: 'Das ist der Verlust an **Amplitude**. Für die Energie: $E\\sim\\hat s^2$, also Faktor $e^{-2\\delta T}$.' }, { wert: Math.exp(-2 * delta * T), hinweis: 'Das ist der Anteil, der **übrig bleibt**. Gefragt ist der Verlust.' }], 0.03),
          [gg('$\\delta$, $T$', 'Verlust pro Periode', '$E \\sim \\hat s^2 \\sim e^{-2\\delta t}$'), 'Nach einer Periode ist noch $e^{-2\\delta T}$ der Energie da.', `$e^{-2\\delta T} = ${tz(Math.exp(-2 * delta * T), 4)}$`],
          `$$\\frac{E(T)}{E_0} = e^{-2\\delta T} = ${tz(1 - verlust, 4)}\\;\\Rightarrow\\;\\text{Verlust} = ${tz(verlust * 100, 3)}\\,\\%$$`,
        ),
        teil(
          `Nach welcher Zeit ist nur noch ${tz(ziel * 100, 2)} % der Anfangsenergie vorhanden?`,
          zahl(tZiel, 's', [{ wert: Math.log(1 / ziel) / delta, hinweis: 'Für die Energie steht im Exponenten $2\\delta$.' }]),
          [gg(`$\\delta$, $\\frac{E}{E_0} = ${tw(ziel)}$`, '$t$', '$e^{-2\\delta t} = \\frac{E}{E_0}$'), 'Logarithmieren und nach $t$ auflösen.', `$\\ln\\frac{1}{${tw(ziel)}} = ${tz(Math.log(1 / ziel), 4)}$`],
          `$$e^{-2\\delta t} = ${tw(ziel)}\\;\\Rightarrow\\; t = \\frac{\\ln(1/${tw(ziel)})}{2\\delta} = ${tg(tZiel, 's')}$$`,
        ),
      ],
      werte: { T, tH, delta, verlust, tZiel, ziel },
    };
  },
};

const verhaeltnis: Generator = {
  id: 'dae-verhaeltnis',
  titel: 'δ und b aus zwei aufeinanderfolgenden Amplituden',
  art: 'rechnen',
  schwierigkeit: 3,
  quelle: 'Buch S. 173 (Material D)',
  erzeuge(rng) {
    const T = rng.zahl(0.5, 2.5, 0.1);
    const a1 = rng.zahl(4, 12, 0.5);
    const q = rng.zahl(0.6, 0.95, 0.01);
    const a2 = Number((a1 * q).toFixed(1));
    const delta = Math.log(a1 / a2) / T;
    const m = rng.zahl(0.1, 1, 0.05);
    const b = 2 * m * delta;
    return {
      titel: 'Aus zwei Hochpunkten',
      kontext: `Bei einem harmonisch gedämpften Federpendel (${g('m', m * 1000, 'g')}, ${g('T', T, 's')}) liest man zwei aufeinanderfolgende Hochpunkte ab: ${g('\\hat s_1', a1, 'cm')} und ${g('\\hat s_2', a2, 'cm')}.`,
      teile: [
        teil(
          'Bestimme die Abklingkonstante $\\delta$.',
          zahl(delta, '1/s', [{ wert: (a1 - a2) / T, hinweis: 'Bei exponentieller Dämpfung zählt das **Verhältnis** der Amplituden, nicht die Differenz.' }]),
          [gg('$\\hat s_1$, $\\hat s_2$, $T$', '$\\delta$', '$\\frac{\\hat s_1}{\\hat s_2} = e^{\\delta T}$'), 'Logarithmieren: $\\ln\\frac{\\hat s_1}{\\hat s_2} = \\delta T$.', `$\\frac{\\hat s_1}{\\hat s_2} = ${tz(a1 / a2, 4)}$`],
          `$$\\delta = \\frac{1}{T}\\ln\\frac{\\hat s_1}{\\hat s_2} = \\frac{1}{${tgw(T, 's')}}\\ln(${tz(a1 / a2, 4)}) = ${tg(delta, '1/s')}$$`,
        ),
        teil(
          'Bestimme die Dämpfungskonstante $b$.',
          zahl(b, 'kg/s', [{ wert: m * delta, hinweis: '$\\delta = \\frac{b}{2m}$, also $b = 2m\\delta$.' }]),
          [gg('$\\delta$, $m$', '$b$', '$\\delta = \\frac{b}{2m}$'), 'Nach $b$ auflösen, Masse in kg.', `$2m = ${tw(2 * m)}\\,\\mathrm{kg}$`],
          `$$b = 2m\\,\\delta = ${tw(2 * m)}\\,\\mathrm{kg}\\cdot ${tg(delta, '1/s')} = ${tg(b, 'kg/s')}$$`,
        ),
      ],
      werte: { T, a1, a2, delta, b, m },
    };
  },
};

const huellDiagramm: Generator = {
  id: 'dae-diagramm',
  titel: 'Gedämpfte Schwingung im Diagramm auswerten',
  art: 'diagramm',
  schwierigkeit: 3,
  quelle: 'Buch S. 173 (Material D), S. 188 (Training I, Aufg. 2)',
  erzeuge(rng) {
    const T = rng.wahl([0.5, 1, 2]);
    const a0 = rng.wahl([4, 5, 6, 8, 10]);
    const tH = rng.wahl([1.5, 2, 3, 4]) * T;
    const delta = Math.LN2 / tH;
    const w = (2 * Math.PI) / T;
    const f = (t: number) => a0 * Math.exp(-delta * t) * Math.cos(w * t);
    const plot = zeitPlot({ f, tMax: 6 * T, yMax: a0, yLabel: 's in cm', weitere: [{ f: (t) => a0 * Math.exp(-delta * t), stil: 'neutral', gestrichelt: true }, { f: (t) => -a0 * Math.exp(-delta * t), stil: 'neutral', gestrichelt: true }] });
    const n = rng.int(2, 4);
    const aN = a0 * Math.exp(-delta * n * T);
    return {
      titel: 'Abklingen ablesen',
      kontext: `Das Diagramm zeigt die Auslenkung eines harmonisch gedämpften Federpendels mit Einhüllender (gestrichelt). Der Körper startet im oberen Umkehrpunkt.`,
      plot,
      teile: [
        teil('Lies die Periodendauer ab.', zahl(T, 's', [], 0.03), ['Abstand zweier Hochpunkte.', 'Bei gedämpften Schwingungen sind die Abstände der Hochpunkte trotzdem gleich.', 'Über mehrere Perioden ablesen.'], `$T = ${tgw(T, 's')}$`),
        teil(
          `Lies die Amplitude beim Start und nach ${n} Perioden ab. Gib das Verhältnis $\\frac{\\hat s_0}{\\hat s_${n}}$ an.`,
          zahl(a0 / aN, '', [], 0.06),
          ['Hochpunkt bei $t = 0$ und beim $' + n + '$. Hochpunkt danach.', `Der ${n}. Hochpunkt danach liegt bei $t = ${tw(n * T)}\\,\\mathrm s$.`, `$\\hat s_${n} \\approx ${tz(aN, 2)}\\,\\mathrm{cm}$`],
          `$\\hat s_0 = ${a0}\\,\\mathrm{cm}$, $\\hat s_${n} \\approx ${tz(aN, 2)}\\,\\mathrm{cm}$, also $$\\frac{\\hat s_0}{\\hat s_${n}} \\approx ${tz(a0 / aN, 3)}$$`,
        ),
        teil(
          'Bestimme daraus die Abklingkonstante $\\delta$.',
          zahl(delta, '1/s', [], 0.08),
          [gg(`Verhältnis nach $${n}T$`, '$\\delta$', `$\\frac{\\hat s_0}{\\hat s_${n}} = e^{\\delta\\cdot ${n}T}$`), 'Logarithmieren.', `$\\ln(${tz(a0 / aN, 3)}) = ${tz(Math.log(a0 / aN), 3)}$`],
          `$$\\delta = \\frac{\\ln(\\hat s_0/\\hat s_${n})}{${n}T} = \\frac{${tz(Math.log(a0 / aN), 3)}}{${tw(n * T)}\\,\\mathrm s} = ${tg(delta, '1/s')}$$ Die Amplitude halbiert sich alle $${tgw(tH, 's', 3)}$.`,
        ),
      ],
      werte: { T, a0, delta, n, aN },
    };
  },
};

function linPlot(art: 'A' | 'lnA' | 'invA', daten: { t: number; A: number }[], tMax: number): PlotSpec {
  const y = daten.map((d) => (art === 'A' ? d.A : art === 'lnA' ? Math.log(d.A) : 1 / d.A));
  const yMin = Math.min(...y, art === 'A' ? 0 : Infinity);
  const yMax = Math.max(...y);
  const pad = (yMax - yMin) * 0.15 || 1;
  const lo = art === 'A' ? 0 : yMin - pad;
  const hi = yMax + pad;
  return {
    x: [0, tMax],
    y: [lo, hi],
    xLabel: 't in s',
    yLabel: art === 'A' ? 'A in cm' : art === 'lnA' ? 'ln(A/cm)' : '1/A in 1/cm',
    xSchritt: zeitSchritt(tMax) * 2,
    ySchritt: (hi - lo) / 4,
    xNachkomma: zeitSchritt(tMax) * 2 < 1 ? 1 : 0,
    yNachkomma: 2,
    kurven: [],
    punkte: daten.map((d, i) => ({ x: d.t, y: y[i] })),
  };
}

const modell: Generator = {
  id: 'dae-modell',
  titel: 'Welches Reibungsmodell? (linearisierte Diagramme)',
  art: 'diagramm',
  schwierigkeit: 2,
  quelle: 'Versuch „Gedämpfte Schwingung“ 16.10.',
  erzeuge(rng) {
    const art = rng.wahl(['gleit', 'stokes', 'newton'] as const);
    const T = rng.wahl([0.8, 1, 1.2]);
    const A0 = rng.zahl(8, 12, 0.5);
    const daten = Array.from({ length: 10 }, (_, n) => {
      const t = n * T;
      let A: number;
      if (art === 'gleit') A = A0 - 0.75 * n;
      else if (art === 'stokes') A = A0 * Math.exp(-0.22 * n);
      else A = A0 / (1 + 0.28 * n);
      return { t, A: A * (1 + (rng.next() - 0.5) * 0.02) };
    });
    const tMax = Math.ceil(9 * T + 1);
    const plots = [linPlot('A', daten, tMax), linPlot('lnA', daten, tMax), linPlot('invA', daten, tMax)];
    const roh = ['Gleitreibung (Diagramm „A gegen t“)', 'Stokes-Reibung F ~ v (Diagramm „ln A gegen t“)', 'Newton-Reibung F ~ v² (Diagramm „1/A gegen t“)'];
    const richtig = art === 'gleit' ? 0 : art === 'stokes' ? 1 : 2;
    const idx = rng.mische([0, 1, 2]);
    const opt = { optionen: idx.map((i) => roh[i]), plots: idx.map((i) => plots[i]), richtig: idx.indexOf(richtig) };
    return {
      titel: 'Gerade gesucht',
      kontext: 'Von einer gedämpften Schwingung wurden die Amplituden $A$ der oberen Umkehrpunkte gemessen und auf drei Arten aufgetragen.',
      teile: [
        teil(
          'In welchem Diagramm liegen die Messpunkte auf einer Geraden – welches Reibungsmodell beschreibt die Messung also am besten?',
          auswahl(opt.optionen, opt.richtig, opt.plots),
          ['Jedes Modell macht in genau einem dieser Diagramme eine Gerade.', 'Schau, welche Punktreihe nicht gekrümmt ist.', 'Gleitreibung → A linear; Stokes → ln A linear; Newton → 1/A linear.'],
          `Gerade ist das Diagramm „${['A gegen t', 'ln A gegen t', '1/A gegen t'][richtig]}“ – also **${['Gleitreibung (konstante Kraft)', 'Stokes-Reibung ($F\\sim v$, exponentiell)', 'Newton-Reibung ($F\\sim v^2$, hyperbolisch)'][richtig]}**.`,
        ),
      ],
      werte: { richtig },
    };
  },
};

export const generatoren: Generator[] = [gleit, exponentiell, halbwert, verhaeltnis, huellDiagramm, modell];
