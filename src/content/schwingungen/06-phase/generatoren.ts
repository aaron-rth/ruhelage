import { g, tg, tgw, tw, tz } from '../../../lib/format';
import { ersterNulldurchgang, G, phaseAusAnfang } from '../../../lib/physik';
import { auswahl, gg, teil, winkel, zahl } from '../../helfer';
import type { Generator, PlotSpec } from '../../types';
import { zeitPlot } from '../diagramm';

const GRAD = Math.PI / 180;
const PI_TEX: Record<number, string> = {
  0: '0',
  1: '\\frac{\\pi}{4}',
  2: '\\frac{\\pi}{2}',
  3: '\\frac{3\\pi}{4}',
  4: '\\pi',
  5: '\\frac{5\\pi}{4}',
  6: '\\frac{3\\pi}{2}',
  7: '\\frac{7\\pi}{4}',
};

function quadrant(phi: number): number {
  return Math.floor(phi / (Math.PI / 2)) + 1;
}

const omegaUmrechnen: Generator = {
  id: 'ph-omega',
  titel: 'T, f und ω ineinander umrechnen',
  art: 'rechnen',
  schwierigkeit: 1,
  quelle: 'Notizen Lehrer 9.10.; Buch S. 156',
  erzeuge(rng) {
    const gegeben = rng.wahl(['T', 'f', 'w'] as const);
    const T = gegeben === 'T' ? rng.zahl(0.05, 5, 0.05) : gegeben === 'f' ? 1 / rng.zahl(0.5, 50, 0.5) : (2 * Math.PI) / rng.zahl(1, 60, 0.5);
    const f = 1 / T;
    const w = (2 * Math.PI) / T;
    const ding = rng.wahl(['Ein Federpendel', 'Eine schwingende Gitarrensaite (Grundschwingung, vereinfacht)', 'Ein Fadenpendel', 'Ein Schwingungstilger']);
    const kontextWert = gegeben === 'T' ? g('T', T, 's') : gegeben === 'f' ? g('f', f, 'Hz') : g('\\omega', w, '1/s');
    const teile = [];
    if (gegeben !== 'T')
      teile.push(
        teil('Berechne die Periodendauer $T$.', zahl(T, 's', gegeben === 'w' ? [{ wert: 1 / w, hinweis: '$T = \\frac{2\\pi}{\\omega}$, nicht $\\frac1\\omega$.' }] : []), [
          gg(kontextWert, '$T$', gegeben === 'f' ? '$T = \\frac1f$' : '$T = \\frac{2\\pi}{\\omega}$'),
          gegeben === 'f' ? 'Kehrwert bilden.' : 'Eine Periode entspricht dem Winkel $2\\pi$.',
          `$T = ${tz(T, 4)}\\,\\mathrm s$`,
        ], `$$T = ${gegeben === 'f' ? '\\frac1f' : '\\frac{2\\pi}{\\omega}'} = ${tg(T, 's')}$$`),
      );
    if (gegeben !== 'f')
      teile.push(
        teil('Berechne die Frequenz $f$.', zahl(f, 'Hz', gegeben === 'w' ? [{ wert: w, hinweis: 'Das ist schon $\\omega$. $f = \\frac{\\omega}{2\\pi}$.' }] : []), [
          gg(kontextWert, '$f$', gegeben === 'T' ? '$f = \\frac1T$' : '$f = \\frac{\\omega}{2\\pi}$'),
          'Frequenz = Schwingungen pro Sekunde.',
          `$f = ${tz(f, 4)}\\,\\mathrm{Hz}$`,
        ], `$$f = ${gegeben === 'T' ? '\\frac1T' : '\\frac{\\omega}{2\\pi}'} = ${tg(f, 'Hz')}$$`),
      );
    if (gegeben !== 'w')
      teile.push(
        teil('Berechne die Kreisfrequenz $\\omega$.', zahl(w, '1/s', [{ wert: f, hinweis: 'Das ist $f$. Für $\\omega$ mal $2\\pi$.' }]), [
          gg(kontextWert, '$\\omega$', gegeben === 'T' ? '$\\omega = \\frac{2\\pi}T$' : '$\\omega = 2\\pi f$'),
          'Einheit: $\\frac1{\\mathrm s}$.',
          `$2\\pi \\approx 6{,}283$`,
        ], `$$\\omega = ${gegeben === 'T' ? '\\frac{2\\pi}T' : '2\\pi f'} = ${tg(w, '1/s')}$$`),
      );
    return {
      titel: 'Drei Wege, dasselbe zu sagen',
      kontext: `${ding} schwingt harmonisch mit ${kontextWert}.`,
      teile,
      werte: { T, f, w },
    };
  },
};

const phaseZeit: Generator = {
  id: 'ph-phase-zeit',
  titel: 'Phasenwinkel zu einem Zeitpunkt',
  art: 'rechnen',
  schwierigkeit: 1,
  quelle: 'Notizen Lehrer 9.10.',
  erzeuge(rng) {
    const T = rng.zahl(0.4, 4, 0.1);
    const w = (2 * Math.PI) / T;
    const t1 = Number((rng.zahl(0.05, 0.95, 0.01) * T).toFixed(2));
    const phi = w * t1;
    const gradZiel = rng.wahl([30, 45, 60, 120, 135, 150, 210, 225, 240, 300, 315, 330]);
    const t2 = (gradZiel * GRAD) / w;
    return {
      titel: 'Wo steht der Zeiger?',
      kontext: `Eine Schwingung hat die Periodendauer ${g('T', T, 's')}. Bei $t = 0$ ist der Phasenwinkel null.`,
      teile: [
        teil(
          `Berechne den Phasenwinkel $\\varphi$ zum Zeitpunkt ${g('t_1', t1, 's')} im Bogenmaß.`,
          winkel(phi, [{ wert: phi / GRAD, hinweis: 'Das ist der Wert in Grad. Gefragt ist das Bogenmaß – oder wähle ° im Menü.' }]),
          [gg('$T$, $t_1$', '$\\varphi(t_1)$', '$\\varphi = \\omega t$ mit $\\omega = \\frac{2\\pi}T$'), 'Erst $\\omega$, dann mal $t_1$.', `$\\omega = ${tg(w, '1/s', 4)}$`],
          `$$\\varphi = \\omega t_1 = \\frac{2\\pi}{T}\\,t_1 = ${tz(phi, 3)}\\,\\mathrm{rad} \\;\\hat=\\; ${tz(phi / GRAD, 3)}^\\circ$$\n\nKurz gedacht: $t_1$ ist der Bruchteil $${tz(t1 / T, 3)}$ einer Periode, also $${tz(t1 / T, 3)}\\cdot 2\\pi$.`,
        ),
        teil(
          `Zu welchem Zeitpunkt hat der Phasenwinkel den Wert $${gradZiel}^\\circ$?`,
          zahl(t2, 's', [{ wert: gradZiel / w, hinweis: 'Den Winkel erst ins Bogenmaß umrechnen: $\\cdot\\frac{\\pi}{180^\\circ}$.' }]),
          [gg(`$\\varphi = ${gradZiel}^\\circ$, $\\omega$`, '$t$', '$t = \\frac{\\varphi}{\\omega}$ (φ im Bogenmaß)'), 'Grad in Bogenmaß: mal $\\frac{\\pi}{180^\\circ}$.', `$${gradZiel}^\\circ = ${tz(gradZiel * GRAD, 4)}\\,\\mathrm{rad}$`],
          `$$t = \\frac{\\varphi}{\\omega} = \\frac{${tz(gradZiel * GRAD, 4)}}{${tg(w, '1/s', 4)}} = ${tg(t2, 's')}$$\n\nOder ohne Umweg: $\\frac{${gradZiel}^\\circ}{360^\\circ}\\cdot T$.`,
        ),
      ],
      werte: { T, w, t1, phi, t2, gradZiel },
    };
  },
};

const anfang: Generator = {
  id: 'ph-anfang',
  titel: 'ŝ und φ₀ aus Anfangsbedingungen',
  art: 'rechnen',
  schwierigkeit: 3,
  quelle: 'Buch S. 165; Notizen Lehrer 9.10.; Übungsklausur (Aufgabentyp)',
  klausur: true,
  erzeuge(rng) {
    const system = rng.wahl(['feder', 'faden', 'T'] as const);
    let w: number;
    let kontext: string;
    let omegaHilfe: string;
    let omegaLoesung: string;
    if (system === 'feder') {
      const m = rng.zahl(0.1, 1.5, 0.05);
      const D = rng.zahl(10, 200, 5);
      w = Math.sqrt(D / m);
      kontext = `Ein Schlitten (${g('m', m * 1000, 'g')}) schwingt reibungsfrei an einer Feder mit ${g('D', D, 'N/m')}.`;
      omegaHilfe = '$\\omega = \\sqrt{\\frac{D}{m}}$';
      omegaLoesung = `$$\\omega = \\sqrt{\\frac{D}{m}} = \\sqrt{\\frac{${tgw(D, 'N/m')}}{${tw(m)}\\,\\mathrm{kg}}} = ${tg(w, '1/s', 4)}$$`;
    } else if (system === 'faden') {
      const l = rng.zahl(0.2, 2.5, 0.05);
      w = Math.sqrt(G / l);
      kontext = `Ein Fadenpendel der Länge ${g('\\ell', l, 'm')} schwingt mit kleinen Auslenkungen.`;
      omegaHilfe = '$\\omega = \\sqrt{\\frac{g}{\\ell}}$';
      omegaLoesung = `$$\\omega = \\sqrt{\\frac{g}{\\ell}} = \\sqrt{\\frac{9{,}81\\,\\mathrm{m/s^2}}{${tgw(l, 'm')}}} = ${tg(w, '1/s', 4)}$$`;
    } else {
      const T = rng.zahl(0.3, 3, 0.05);
      w = (2 * Math.PI) / T;
      kontext = `Ein Körper schwingt harmonisch mit der Periodendauer ${g('T', T, 's')}.`;
      omegaHilfe = '$\\omega = \\frac{2\\pi}{T}$';
      omegaLoesung = `$$\\omega = \\frac{2\\pi}{T} = ${tg(w, '1/s', 4)}$$`;
    }
    // Anfangsbedingungen – alle vier Quadranten gleich wahrscheinlich
    const sv = rng.wahl([1, -1]);
    const vv = rng.wahl([1, -1]);
    const s0 = sv * rng.zahl(0.5, 6, 0.5) / 100;
    let v0 = vv * rng.zahl(0.05, 0.9, 0.05);
    // keine fast reine Ruhelage/Umkehrpunkt-Starts
    const verh = Math.abs(s0) / Math.abs(v0 / w);
    if (verh > 6 || verh < 1 / 6) v0 = vv * Math.abs(s0) * w * rng.zahl(0.4, 2.5, 0.1);
    // nicht zufällig die Werte der Übungsklausur erwischen
    if (Math.abs(s0 - 0.02) < 1e-9 && Math.abs(v0 + 0.5) < 1e-9) v0 = -0.45;
    const { amp, phi0 } = phaseAusAnfang(s0, v0, w);
    const as = Math.asin(s0 / amp);
    const tNull = ersterNulldurchgang(phi0, w);
    const q = quadrant(phi0);
    const qName = ['I', 'II', 'III', 'IV'][q - 1];
    const formelPhi = q === 1 ? '\\arcsin\\frac{s_0}{\\hat s}' : q === 4 ? '2\\pi + \\arcsin\\frac{s_0}{\\hat s}' : '\\pi - \\arcsin\\frac{s_0}{\\hat s}';
    const fehler = [
      { wert: as, hinweis: 'Das ist nur der arcsin-Wert. Prüfe mit dem Vorzeichen von $v_0$ den **Quadranten**!' },
      { wert: Math.PI - as, hinweis: 'Der Sinus passt, aber das Vorzeichen von $\\cos\\varphi_0$ (also von $v_0$) nicht. Quadrant prüfen!' },
    ].filter((f) => Math.abs(Math.atan2(Math.sin(f.wert - phi0), Math.cos(f.wert - phi0))) > 0.05);
    const k = Math.floor(phi0 / Math.PI + 1e-9) + 1;
    return {
      titel: 'Start mit Schwung',
      kontext: `${kontext} Zum Zeitpunkt $t = 0$ ist die Auslenkung ${g('s_0', s0 * 100, 'cm')} und die Geschwindigkeit ${g('v_0', v0, 'm/s')}. Die Bewegung soll durch $s(t) = \\hat s\\sin(\\omega t + \\varphi_0)$ beschrieben werden.`,
      teile: [
        teil(
          'Berechne die Kreisfrequenz $\\omega$.',
          zahl(w, '1/s', [{ wert: w / (2 * Math.PI), hinweis: 'Das ist $f$, gesucht ist $\\omega$.' }]),
          [gg('die Daten des Systems', '$\\omega$', omegaHilfe), 'Einsetzen in SI-Einheiten.', `$\\omega \\approx ${tz(w, 4)}\\,\\mathrm{\\tfrac1s}$`],
          omegaLoesung,
        ),
        teil(
          'Berechne die Amplitude $\\hat s$.',
          zahl(amp, 'cm', [{ wert: Math.abs(s0), hinweis: '$s_0$ ist nicht die Amplitude – der Körper hat ja noch Geschwindigkeit und kommt weiter.' }, { wert: Math.abs(s0) + Math.abs(v0 / w), hinweis: 'Nicht addieren – quadrieren, addieren, Wurzel ziehen.' }]),
          [
            gg(`$s_0$, $v_0$, $\\omega$`, '$\\hat s$', '$s_0 = \\hat s\\sin\\varphi_0$ und $v_0 = \\hat s\\,\\omega\\cos\\varphi_0$'),
            'Beide Gleichungen quadrieren und addieren – mit $\\sin^2 + \\cos^2 = 1$ fällt $\\varphi_0$ heraus.',
            `$\\frac{v_0}{\\omega} = ${tg((v0 / w) * 100, 'cm')}$`,
          ],
          `$$\\hat s = \\sqrt{s_0^2 + \\left(\\frac{v_0}{\\omega}\\right)^2} = \\sqrt{(${tw(s0 * 100)}\\,\\mathrm{cm})^2 + (${tz((v0 / w) * 100, 3)}\\,\\mathrm{cm})^2} = ${tg(amp * 100, 'cm')}$$`,
        ),
        teil(
          'Bestimme die Nullphase $\\varphi_0$ im Intervall $0 \\le \\varphi_0 < 2\\pi$.',
          winkel(phi0, fehler),
          [
            gg('$s_0$, $\\hat s$, Vorzeichen von $v_0$', '$\\varphi_0$', '$\\sin\\varphi_0 = \\frac{s_0}{\\hat s}$'),
            `Vorzeichen: $\\sin\\varphi_0$ wie $s_0$ (${s0 > 0 ? '+' : '−'}), $\\cos\\varphi_0$ wie $v_0$ (${v0 > 0 ? '+' : '−'}). Das legt den Quadranten fest.`,
            `$\\arcsin\\frac{s_0}{\\hat s} = ${tz(as, 3)}$; Quadrant ${qName}.`,
          ],
          `$$\\sin\\varphi_0 = \\frac{s_0}{\\hat s} = ${tz(s0 / amp, 3)},\\qquad \\arcsin(${tz(s0 / amp, 3)}) = ${tz(as, 3)}$$\nWegen $s_0 ${s0 > 0 ? '> 0' : '< 0'}$ und $v_0 ${v0 > 0 ? '> 0' : '< 0'}$ liegt $\\varphi_0$ im **Quadranten ${qName}**:\n$$\\varphi_0 = ${formelPhi} = ${tz(phi0, 3)}\\;(\\approx ${tz(phi0 / GRAD, 3)}^\\circ)$$\nProbe: $\\hat s\\,\\omega\\cos\\varphi_0 = ${tg(amp * w * Math.cos(phi0), 'm/s')} = v_0$ ✓`,
        ),
        teil(
          'Wann durchläuft der Körper zum ersten Mal ($t > 0$) die Gleichgewichtslage?',
          zahl(tNull, 's', [{ wert: (Math.PI - phi0) / w, hinweis: 'Das ergibt eine negative bzw. vergangene Zeit. Nimm das nächste Vielfache von $\\pi$, das größer als $\\varphi_0$ ist.' }].filter((f) => f.wert > 0 && Math.abs(f.wert - tNull) > tNull * 0.05)),
          [
            gg('$\\varphi_0$, $\\omega$', '$t$', '$s = 0$, wenn $\\omega t + \\varphi_0 = k\\cdot\\pi$'),
            `Suche das kleinste Vielfache von $\\pi$, das größer als $\\varphi_0 = ${tz(phi0, 3)}$ ist.`,
            `Hier: $\\omega t + \\varphi_0 = ${k === 1 ? '\\pi' : '2\\pi'}$`,
          ],
          `$$\\omega t + \\varphi_0 = ${k === 1 ? '\\pi' : '2\\pi'}\\;\\Rightarrow\\; t = \\frac{${k === 1 ? '\\pi' : '2\\pi'} - ${tz(phi0, 3)}}{${tg(w, '1/s', 4)}} = ${tg(tNull, 's')}$$`,
        ),
      ],
      werte: { w, s0, v0, amp, phi0, tNull },
    };
  },
};

const gleichungAuswerten: Generator = {
  id: 'ph-gleichung',
  titel: 'Eine Schwingungsgleichung lesen',
  art: 'rechnen',
  schwierigkeit: 2,
  quelle: 'Buch S. 165',
  erzeuge(rng) {
    const ampCm = rng.zahl(1, 12, 0.5);
    const w = rng.zahl(1.5, 15, 0.5);
    const phi0 = rng.zahl(0.2, 6, 0.1);
    const T = (2 * Math.PI) / w;
    const s0 = ampCm * Math.sin(phi0);
    const tNull = ersterNulldurchgang(phi0, w);
    const v0 = (ampCm / 100) * w * Math.cos(phi0);
    return {
      titel: 'Gleichung entschlüsseln',
      kontext: `Eine Schwingung wird beschrieben durch $$s(t) = ${tw(ampCm)}\\,\\mathrm{cm}\\cdot\\sin\\left(${tw(w)}\\,\\mathrm{\\tfrac1s}\\cdot t + ${tw(phi0)}\\right)$$`,
      teile: [
        teil('Wie groß ist die Periodendauer?', zahl(T, 's', [{ wert: 1 / w, hinweis: '$T = \\frac{2\\pi}{\\omega}$.' }]), [gg('$\\omega$ aus der Gleichung', '$T$', '$T = \\frac{2\\pi}{\\omega}$'), '$\\omega$ ist der Faktor vor $t$.', `$\\omega = ${tw(w)}\\,\\mathrm{\\tfrac1s}$`], `$$T = \\frac{2\\pi}{${tw(w)}\\,\\mathrm{\\tfrac1s}} = ${tg(T, 's')}$$`),
        teil(
          'Wo befindet sich der Körper bei $t = 0$?',
          zahl(s0 / 100, 'cm', [{ wert: (ampCm * Math.sin(phi0 * GRAD)) / 100, hinweis: 'Rechner auf **Bogenmaß** stellen!' }], 0.03),
          [gg('die Gleichung', '$s(0)$', '$s(0) = \\hat s\\sin\\varphi_0$'), '$t = 0$ einsetzen – übrig bleibt die Nullphase.', `$\\sin(${tw(phi0)}) = ${tz(Math.sin(phi0), 3)}$`],
          `$$s(0) = ${tw(ampCm)}\\,\\mathrm{cm}\\cdot\\sin(${tw(phi0)}) = ${tg(s0, 'cm')}$$`,
        ),
        teil(
          'Bewegt er sich bei $t = 0$ nach oben oder nach unten?',
          auswahl(['nach oben (v > 0)', 'nach unten (v < 0)'], v0 > 0 ? 0 : 1),
          ['Das Vorzeichen von $v(0)$ entscheidet.', '$v(t) = \\hat s\\,\\omega\\cos(\\omega t + \\varphi_0)$', `$\\cos(${tw(phi0)}) = ${tz(Math.cos(phi0), 3)}$`],
          `$v(0) = \\hat s\\,\\omega\\cos\\varphi_0 = ${tg(v0, 'm/s')}$ – also **${v0 > 0 ? 'nach oben' : 'nach unten'}**.`,
        ),
        teil(
          'Wann ist $s = 0$ zum ersten Mal ($t > 0$)?',
          zahl(tNull, 's'),
          [gg('$\\varphi_0$, $\\omega$', '$t$', '$\\omega t + \\varphi_0 = k\\pi$'), 'Nimm das nächste Vielfache von $\\pi$ über $\\varphi_0$.', `$\\pi \\approx 3{,}142$, $2\\pi \\approx 6{,}283$`],
          `$$t = \\frac{${phi0 < Math.PI ? '\\pi' : '2\\pi'} - ${tw(phi0)}}{${tw(w)}\\,\\mathrm{\\tfrac1s}} = ${tg(tNull, 's')}$$`,
        ),
      ],
      werte: { ampCm, w, phi0, T, s0, tNull, v0 },
    };
  },
};

const phi0Ablesen: Generator = {
  id: 'ph-phi0-ablesen',
  titel: 'Nullphase aus dem s-t-Diagramm',
  art: 'diagramm',
  schwierigkeit: 3,
  quelle: 'Buch S. 165 (Abb. 2)',
  erzeuge(rng) {
    const T = rng.wahl([0.8, 1.6, 2, 4]);
    const w = (2 * Math.PI) / T;
    const k = rng.int(0, 7);
    const phi0 = (k * Math.PI) / 4;
    const amp = rng.wahl([2, 3, 4, 5, 6]);
    const plot = zeitPlot({ f: (t) => amp * Math.sin(w * t + phi0), tMax: 2 * T, yMax: amp, yLabel: 's in cm' });
    plot.xSchritt = T / 4;
    plot.xFein = T / 8;
    plot.xNachkomma = T === 0.8 ? 1 : T === 1.6 ? 1 : T === 2 ? 1 : 0;
    const dt = ((2 * Math.PI - phi0) % (2 * Math.PI)) / w; // erster Nulldurchgang nach oben
    return {
      titel: 'Wie weit ist die Kurve verschoben?',
      kontext: 'Die Schwingung im Diagramm soll durch $s(t) = \\hat s\\sin(\\omega t + \\varphi_0)$ beschrieben werden.',
      plot,
      teile: [
        teil('Lies die Periodendauer ab.', zahl(T, 's', [], 0.03), ['Abstand zweier Hochpunkte.', 'Über zwei Perioden ablesen ist genauer.', `Die Hilfslinien liegen im Abstand $\\frac T8$.`], `$T = ${tgw(T, 's')}$`),
        teil(
          'Bestimme die Nullphase $\\varphi_0$ (zwischen $0$ und $2\\pi$).',
          { art: 'winkel', wert: phi0, periodisch: true, toleranz: 0.15 },
          [
            'Ohne Nullphase würde die Kurve bei $t = 0$ in der Ruhelage nach oben starten. Wo macht sie das hier?',
            `Suche den ersten Nulldurchgang **nach oben** bei $t \\ge 0$. Liegt er bei $t^*$, ist die Kurve um $t^*$ nach rechts – also um $T - t^*$ nach links – verschoben.`,
            '$\\varphi_0 = \\omega\\cdot(\\text{Linksverschiebung})$, oder: $\\varphi_0 = 2\\pi\\cdot\\frac{\\text{Linksverschiebung}}{T}$.',
          ],
          `${k === 0 ? 'Die Kurve startet in der Ruhelage nach oben: $\\varphi_0 = 0$.' : `Der erste Nulldurchgang nach oben liegt bei $t^* = ${tgw(dt, 's', 3)}$. Die Kurve ist also um $T - t^* = ${tgw(T - dt, 's', 3)}$ nach links verschoben:`}\n$$\\varphi_0 = 2\\pi\\cdot\\frac{${tw(k === 0 ? 0 : T - dt, 3)}\\,\\mathrm s}{${tw(T)}\\,\\mathrm s} = ${PI_TEX[k]} \\approx ${tz(phi0 + 0, 3)}$$\nProbe: $s(0) = \\hat s\\sin\\varphi_0 = ${tz(amp * Math.sin(phi0) + 0, 2)}\\,\\mathrm{cm}$ passt zum Diagramm.`,
        ),
      ],
      werte: { T, phi0, amp, k },
    };
  },
};

function kreisPlot(phi: number): PlotSpec {
  const c = Math.cos(phi);
  const s = Math.sin(phi);
  const kurven: PlotSpec['kurven'] = [
    { f: (x) => Math.sqrt(Math.max(0, 1 - x * x)), von: -1, bis: 1, stil: 'neutral' },
    { f: (x) => -Math.sqrt(Math.max(0, 1 - x * x)), von: -1, bis: 1, stil: 'neutral' },
    { f: () => s, von: Math.min(c, 1.25), bis: 1.25, stil: 'koralle', gestrichelt: true },
  ];
  if (Math.abs(c) > 0.02) kurven.push({ f: (x) => (s / c) * x, von: Math.min(0, c), bis: Math.max(0, c), stil: 'akzent' });
  return {
    x: [-1.35, 1.35],
    y: [-1.25, 1.25],
    xLabel: 'x',
    yLabel: 's / ŝ',
    xSchritt: 0.5,
    ySchritt: 0.5,
    xFein: 0.1,
    yFein: 0.1,
    xNachkomma: 1,
    yNachkomma: 1,
    quadratisch: true,
    kurven,
    markierungen: [{ x: c, y: s }],
  };
}

const kreis: Generator = {
  id: 'ph-kreis',
  titel: 'Zeiger am Kreis → Schwingung',
  art: 'diagramm',
  schwierigkeit: 2,
  quelle: 'Notizen Lehrer 28.9./9.10.; Buch S. 160 (Material A)',
  erzeuge(rng) {
    const k = rng.wahl([1, 2, 4, 5, 7, 8, 10, 11]);
    const phi = (k * Math.PI) / 6;
    const s = Math.sin(phi);
    const c = Math.cos(phi);
    const richtig = (s > 0 ? 0 : 2) + (c > 0 ? 0 : 1);
    const texPhi = ['0', '\\frac{\\pi}{6}', '\\frac{\\pi}{3}', '\\frac{\\pi}{2}', '\\frac{2\\pi}{3}', '\\frac{5\\pi}{6}', '\\pi', '\\frac{7\\pi}{6}', '\\frac{4\\pi}{3}', '\\frac{3\\pi}{2}', '\\frac{5\\pi}{3}', '\\frac{11\\pi}{6}'][k];
    return {
      titel: 'Der Schatten des Zeigers',
      kontext: 'Ein Zeiger der Länge 1 dreht sich gegen den Uhrzeigersinn, Start bei $t = 0$ waagerecht nach rechts. Seine Höhe (gestrichelt zur s-Achse) ist die Auslenkung $s/\\hat s$ einer Schwingung $s = \\hat s\\sin\\varphi$.',
      plot: kreisPlot(phi),
      teile: [
        teil(
          'Wie groß ist der Phasenwinkel $\\varphi$ des Zeigers (im Bogenmaß)?',
          { art: 'winkel', wert: phi, periodisch: true, toleranz: 0.12, typischeFehler: [{ wert: phi / GRAD, hinweis: 'Das ist in Grad. Wähle ° im Menü oder rechne ins Bogenmaß um.' }] },
          ['Lies den Winkel zwischen der positiven x-Achse und dem Zeiger ab – gegen den Uhrzeigersinn gemessen.', 'Ein Viertelkreis ist $\\frac\\pi2 \\approx 1{,}57$, ein Halbkreis $\\pi$.', 'Die Gitterlinien helfen: $\\sin\\varphi$ ist die Höhe, $\\cos\\varphi$ die x-Position.'],
          `$$\\varphi = ${texPhi} \\approx ${tz(phi, 3)}\\;(=${Math.round(phi / GRAD)}^\\circ)$$ Kontrolle: Höhe $\\sin\\varphi = ${tz(s, 3)}$, x-Position $\\cos\\varphi = ${tz(c, 3)}$.`,
        ),
        teil(
          'Wo ist der schwingende Körper in diesem Moment, und wohin bewegt er sich?',
          auswahl(['oberhalb der Ruhelage, nach oben', 'oberhalb der Ruhelage, nach unten', 'unterhalb der Ruhelage, nach oben', 'unterhalb der Ruhelage, nach unten'], richtig),
          ['Die Höhe des Zeigers ist die Auslenkung.', 'Dreht sich der Zeiger weiter gegen den Uhrzeigersinn – steigt seine Spitze dann oder fällt sie?', 'Rechts der senkrechten Achse ($\\cos\\varphi > 0$) steigt die Spitze, links davon fällt sie.'],
          `Die Spitze ist ${s > 0 ? 'oberhalb' : 'unterhalb'} der Mitte (${s > 0 ? '$\\sin\\varphi > 0$' : '$\\sin\\varphi < 0$'}). Sie liegt ${c > 0 ? 'rechts' : 'links'} der senkrechten Achse, also ${c > 0 ? 'steigt' : 'fällt'} sie beim Weiterdrehen: Bewegung **nach ${c > 0 ? 'oben' : 'unten'}** – passend zu $v \\sim \\cos\\varphi$.`,
        ),
      ],
      werte: { phi, richtig },
    };
  },
};

export const generatoren: Generator[] = [omegaUmrechnen, phaseZeit, anfang, gleichungAuswerten, phi0Ablesen, kreis];
