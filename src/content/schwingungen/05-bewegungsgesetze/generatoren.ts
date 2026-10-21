import { g, tg, tgw, tw, tz } from '../../../lib/format';
import { ersterNulldurchgang, ersterUmkehrpunkt } from '../../../lib/physik';
import { auswahl, gg, mischeOptionen, teil, zahl } from '../../helfer';
import type { Generator, PlotSpec } from '../../types';
import { SCHOENE_AMP_CM, SCHOENE_T, START_PHI, START_TEXT, STARTS, startGleichung, zeitPlot, type Start } from '../diagramm';

const GRAD = Math.PI / 180;

const vmaxAmax: Generator = {
  id: 'bg-vmax-amax',
  titel: 'v̂ und â aus Amplitude und Frequenz',
  art: 'rechnen',
  schwierigkeit: 1,
  quelle: 'Buch S. 157 Aufg. 5; Notizen Lehrer 5.10.',
  klausur: true,
  erzeuge(rng) {
    const fall = rng.wahl([
      { text: 'Die Zinken einer Stimmgabel', f: [256, 520, 1], amp: [0.5, 2.5, 0.1], ampE: 'mm', mitF: true },
      { text: 'Die Membran eines Tieftonlautsprechers', f: [30, 120, 1], amp: [1, 6, 0.5], ampE: 'mm', mitF: true },
      { text: 'Eine Messboje im Hafenbecken', f: [1.5, 5, 0.1], amp: [5, 30, 1], ampE: 'cm', mitF: false },
      { text: 'Ein Massestück an einer Feder', f: [0.4, 2.5, 0.05], amp: [2, 12, 0.5], ampE: 'cm', mitF: false },
      { text: 'Die Nadel einer Nähmaschine', f: [8, 20, 1], amp: [6, 12, 0.5], ampE: 'mm', mitF: true },
    ]);
    const amp = rng.zahl(fall.amp[0], fall.amp[1], fall.amp[2]) * (fall.ampE === 'mm' ? 1e-3 : 1e-2);
    let w: number;
    let gegeben: string;
    if (fall.mitF) {
      const f = rng.zahl(fall.f[0], fall.f[1], fall.f[2]);
      w = 2 * Math.PI * f;
      gegeben = g('f', f, 'Hz');
    } else {
      const T = rng.zahl(fall.f[0], fall.f[1], fall.f[2]);
      w = (2 * Math.PI) / T;
      gegeben = `der Periodendauer ${g('T', T, 's')}`;
    }
    const vmax = amp * w;
    const amax = amp * w * w;
    const ampTex = `${tw(amp * (fall.ampE === 'mm' ? 1e3 : 1e2))}\\,\\mathrm{${fall.ampE}}`;
    return {
      titel: 'Wie schnell, wie heftig?',
      kontext: `${fall.text} schwingt harmonisch mit ${fall.mitF ? `der Frequenz ${gegeben}` : gegeben} und der Amplitude $\\hat s = ${ampTex}$.`,
      teile: [
        teil(
          'Berechne die Kreisfrequenz $\\omega$.',
          zahl(w, '1/s', [{ wert: w / (2 * Math.PI), hinweis: 'Das ist $f$. Für $\\omega$ fehlt der Faktor $2\\pi$.' }]),
          [gg(fall.mitF ? '$f$' : '$T$', '$\\omega$', fall.mitF ? '$\\omega = 2\\pi f$' : '$\\omega = \\frac{2\\pi}{T}$'), 'Einheit von $\\omega$: $\\frac1{\\mathrm s}$.', `$\\omega = ${tz(w, 4)}\\,\\mathrm{\\tfrac1s}$ (ungerundet weiterrechnen)`],
          `$$\\omega = ${fall.mitF ? '2\\pi f' : '\\frac{2\\pi}{T}'} = ${tg(w, '1/s')}$$`,
        ),
        teil(
          'Berechne die maximale Geschwindigkeit $\\hat v$.',
          zahl(vmax, 'm/s', [
            { wert: amp * 1e3 * w, hinweis: 'Die Amplitude muss in **m** eingesetzt werden.' },
            { wert: amp * 1e2 * w, hinweis: 'Die Amplitude muss in **m** eingesetzt werden.' },
            { wert: amp * w * w, hinweis: 'Das ist $\\hat a$. Für $\\hat v$ nur einmal $\\omega$.' },
          ]),
          [gg(`$\\hat s = ${tw(amp)}\\,\\mathrm m$, $\\omega$`, '$\\hat v$', '$\\hat v = \\hat s\\cdot\\omega$'), 'Einmal Ableiten bringt einen Faktor $\\omega$; der Sinus/Kosinus ist höchstens 1.', `$\\hat v = ${tw(amp)}\\,\\mathrm m\\cdot ${tz(w, 4)}\\,\\mathrm{\\tfrac1s}$`],
          `$$\\hat v = \\hat s\\cdot\\omega = ${tw(amp)}\\,\\mathrm m\\cdot ${tg(w, '1/s', 4)} = ${tg(vmax, 'm/s')}$$`,
        ),
        teil(
          'Berechne die maximale Beschleunigung $\\hat a$.',
          zahl(amax, 'm/s^2', [{ wert: vmax, hinweis: 'Für $\\hat a$ brauchst du $\\omega^2$.' }, { wert: amp * 1e3 * w * w, hinweis: 'Die Amplitude in **m** einsetzen.' }, { wert: amp * 1e2 * w * w, hinweis: 'Die Amplitude in **m** einsetzen.' }]),
          [gg('$\\hat s$, $\\omega$', '$\\hat a$', '$\\hat a = \\hat s\\cdot\\omega^2$'), 'Zweimal ableiten → zweimal Faktor $\\omega$.', `$\\omega^2 = ${tz(w * w, 4)}\\,\\mathrm{\\tfrac1{s^2}}$`],
          `$$\\hat a = \\hat s\\cdot\\omega^2 = ${tg(amax, 'm/s^2')}$$` + (amax > 100 ? `\n\nDas sind etwa $${tz(amax / 9.81, 2)}\\,g$ – enorm, aber typisch für schnelle, kleine Schwingungen.` : ''),
        ),
      ],
      werte: { amp, w, vmax, amax },
    };
  },
};

const ampAusV: Generator = {
  id: 'bg-amp-aus-v',
  titel: 'ŝ aus v̂ und T',
  art: 'rechnen',
  schwierigkeit: 1,
  quelle: 'Notizen Lehrer 5.10.; Buch S. 157',
  klausur: true,
  erzeuge(rng) {
    const T = rng.zahl(0.3, 3, 0.05);
    const vmax = rng.zahl(0.05, 1.2, 0.01);
    const w = (2 * Math.PI) / T;
    const amp = vmax / w;
    const amax = amp * w * w;
    const ding = rng.wahl(['ein Federpendel', 'ein Wagen zwischen zwei Federn', 'ein schwingender Messkopf', 'ein Fadenpendel']);
    return {
      titel: 'Rückwärts zur Amplitude',
      kontext: `Ein Bewegungssensor misst für ${ding} die Periodendauer ${g('T', T, 's')} und als größte Geschwindigkeit ${g('\\hat v', vmax, 'm/s')}.`,
      teile: [
        teil(
          'Berechne die Amplitude $\\hat s$.',
          zahl(amp, 'cm', [{ wert: vmax * w, hinweis: 'Umgekehrt: $\\hat v = \\hat s\\cdot\\omega$, also $\\hat s = \\frac{\\hat v}{\\omega}$.' }, { wert: vmax / (1 / T), hinweis: 'Teile durch $\\omega = \\frac{2\\pi}{T}$, nicht durch $f$.' }]),
          [gg('$T$, $\\hat v$', '$\\hat s$', '$\\hat v = \\hat s\\cdot\\omega$ mit $\\omega = \\frac{2\\pi}{T}$'), 'Erst $\\omega$ berechnen, dann nach $\\hat s$ umstellen.', `$\\omega = ${tg(w, '1/s', 4)}$`],
          `$$\\omega = \\frac{2\\pi}{${tgw(T, 's')}} = ${tg(w, '1/s', 4)}$$\n$$\\hat s = \\frac{\\hat v}{\\omega} = \\frac{${tgw(vmax, 'm/s')}}{${tg(w, '1/s', 4)}} = ${tg(amp, 'm')} = ${tg(amp * 100, 'cm')}$$`,
        ),
        teil(
          'Berechne die maximale Beschleunigung.',
          zahl(amax, 'm/s^2'),
          [gg('$\\hat s$, $\\omega$ (oder $\\hat v$, $\\omega$)', '$\\hat a$', '$\\hat a = \\hat s\\,\\omega^2 = \\hat v\\,\\omega$'), 'Am schnellsten geht es mit $\\hat a = \\hat v\\cdot\\omega$.', `$\\hat v\\cdot\\omega = ${tw(vmax)}\\cdot ${tz(w, 4)}$`],
          `$$\\hat a = \\hat v\\cdot\\omega = ${tgw(vmax, 'm/s')}\\cdot ${tg(w, '1/s', 4)} = ${tg(amax, 'm/s^2')}$$`,
        ),
      ],
      werte: { T, vmax, w, amp, amax },
    };
  },
};

const sZeitpunkt: Generator = {
  id: 'bg-s-zeitpunkt',
  titel: 'Auslenkung und Geschwindigkeit zu einem Zeitpunkt',
  art: 'rechnen',
  schwierigkeit: 2,
  quelle: 'Buch S. 157',
  klausur: true,
  erzeuge(rng) {
    const st: Start = rng.wahl(STARTS);
    const T = rng.zahl(0.5, 3, 0.1);
    const ampCm = rng.zahl(2, 15, 0.5);
    const amp = ampCm / 100;
    const w = (2 * Math.PI) / T;
    // Zeitpunkt, der nicht auf einem Viertel liegt
    let t1 = rng.zahl(0.08, 0.92, 0.01) * T;
    const viertel = (t1 / T) * 4;
    if (Math.abs(viertel - Math.round(viertel)) < 0.15) t1 += 0.07 * T;
    t1 = Number(t1.toFixed(2));
    const phi0 = START_PHI[st];
    const s1 = amp * Math.sin(w * t1 + phi0);
    const v1 = amp * w * Math.cos(w * t1 + phi0);
    const sGrad = amp * Math.sin(w * t1 * GRAD + phi0);
    const richtung = v1 > 0 ? 0 : 1;
    const gl = startGleichung(st, `${tw(ampCm)}\\,\\mathrm{cm}`, `${tz(w, 4)}\\,\\mathrm{\\tfrac1s}`);
    return {
      titel: 'Momentaufnahme',
      kontext: `Ein Federpendel (${g('T', T, 's')}, ${g('\\hat s', ampCm, 'cm')}, nach oben positiv) startet bei $t = 0$ ${START_TEXT[st]}.`,
      teile: [
        teil(
          `Berechne die Auslenkung zum Zeitpunkt ${g('t_1', t1, 's')}.`,
          zahl(s1, 'cm', [{ wert: sGrad, hinweis: 'Das ist der Wert mit Taschenrechner in **Grad**. Stell auf **Bogenmaß (RAD)** um!' }], 0.03),
          [
            gg(`$\\hat s$, $T$, Start ${START_TEXT[st]}`, '$s(t_1)$', `$${startGleichung(st)}$ mit $\\omega = \\frac{2\\pi}{T}$`),
            'Wähle sin oder cos passend zum Start, berechne $\\omega$ und setze $t_1$ ein – im **Bogenmaß**!',
            `$\\omega = ${tg(w, '1/s', 4)}$, $\\omega t_1 = ${tz(w * t1, 4)}$ (rad). Gleichung: $${gl}$`,
          ],
          `Start ${START_TEXT[st]} → $${startGleichung(st)}$.\n$$\\omega = \\frac{2\\pi}{T} = ${tg(w, '1/s', 4)}$$\n$$s(t_1) = ${gl.slice(gl.indexOf('=') + 1).replace('\\, t)', `\\cdot ${tw(t1)}\\,\\mathrm s)`)} = ${tg(s1 * 100, 'cm')}$$`,
        ),
        teil(
          'Berechne die Geschwindigkeit zu diesem Zeitpunkt (mit Vorzeichen).',
          zahl(v1, 'm/s', [{ wert: -v1, hinweis: 'Der Betrag stimmt. Achte auf das Vorzeichen der Ableitung: $(\\cos)\' = -\\sin$.' }], 0.03),
          [
            gg('$s(t)$ von eben', '$v(t_1)$', '$v(t) = \\dot s(t)$'),
            'Leite deine Gleichung mit der Kettenregel ab: Faktor $\\omega$, aus $\\sin$ wird $\\cos$, aus $\\cos$ wird $-\\sin$.',
            `$\\hat v = \\hat s\\,\\omega = ${tg(amp * w, 'm/s')}$`,
          ],
          `$$v(t) = \\dot s(t)\\quad\\Rightarrow\\quad v(t_1) = ${tg(v1, 'm/s')}$$\n\n${v1 > 0 ? 'Positiv: Der Körper bewegt sich gerade nach oben.' : 'Negativ: Der Körper bewegt sich gerade nach unten.'}`,
        ),
        teil(
          'In welche Richtung bewegt sich der Körper bei $t_1$?',
          auswahl(['nach oben', 'nach unten'], richtung),
          ['Schau auf das Vorzeichen von $v(t_1)$.', '$v > 0$ heißt: Bewegung in positive Richtung (nach oben).', `$v(t_1) ${v1 > 0 ? '> 0' : '< 0'}$`],
          `Weil $v(t_1) ${v1 > 0 ? '> 0' : '< 0'}$ ist, bewegt sich der Körper **${richtung === 0 ? 'nach oben' : 'nach unten'}**.`,
        ),
      ],
      werte: { T, amp, w, t1, s1, v1, phi0 },
    };
  },
};

const ersteZeit: Generator = {
  id: 'bg-erste-zeit',
  titel: 'Wann ist der Körper zum ersten Mal an einer Stelle?',
  art: 'rechnen',
  schwierigkeit: 3,
  quelle: 'Buch S. 157',
  erzeuge(rng) {
    const ausUmkehr = rng.chance(0.5);
    const T = rng.zahl(0.6, 4, 0.1);
    const ampCm = rng.zahl(3, 12, 1);
    const w = (2 * Math.PI) / T;
    // Zielposition als Anteil der Amplitude, nicht 0 und nicht ±1
    const anteil = rng.wahl(ausUmkehr ? [0.8, 0.6, 0.5, 0.25, -0.25, -0.5, -0.75] : [0.25, 0.4, 0.5, 0.6, 0.75, 0.9]);
    const x = anteil * ampCm;
    const t = ausUmkehr ? Math.acos(anteil) / w : Math.asin(anteil) / w;
    const tGrad = ausUmkehr ? (Math.acos(anteil) / GRAD) / w : (Math.asin(anteil) / GRAD) / w;
    const fn = ausUmkehr ? '\\arccos' : '\\arcsin';
    return {
      titel: 'Erster Durchgang',
      kontext: `Ein Pendel schwingt mit ${g('T', T, 's')} und ${g('\\hat s', ampCm, 'cm')}. Bei $t = 0$ ist es ${ausUmkehr ? 'im oberen Umkehrpunkt' : 'in der Ruhelage und bewegt sich nach oben'}.`,
      teile: [
        teil(
          `Zu welchem Zeitpunkt ist die Auslenkung zum ersten Mal ${g('s', x, 'cm')}?`,
          zahl(t, 's', [{ wert: tGrad, hinweis: `Du hast $${fn}$ in Grad ausgerechnet. Im Bogenmaß rechnen!` }]),
          [
            gg(`$\\hat s$, $T$, $s = ${tw(x)}\\,\\mathrm{cm}$`, '$t$', `$${ausUmkehr ? 's(t) = \\hat s\\cos(\\omega t)' : 's(t) = \\hat s\\sin(\\omega t)'}$ nach $t$ auflösen`),
            `Teile durch $\\hat s$ und wende $${fn}$ an: $\\omega t = ${fn}\\left(\\frac{s}{\\hat s}\\right)$. Der Rechner liefert genau den ersten Zeitpunkt.`,
            `$\\frac{s}{\\hat s} = ${tw(anteil)}$, $${fn}(${tw(anteil)}) = ${tz(w * t, 4)}$ (rad), $\\omega = ${tg(w, '1/s', 4)}$`,
          ],
          `$$${tw(x)} = ${tw(ampCm)}\\cdot ${ausUmkehr ? '\\cos' : '\\sin'}(\\omega t)\\;\\Rightarrow\\; \\omega t = ${fn}(${tw(anteil)}) = ${tz(w * t, 4)}$$\n$$t = \\frac{${tz(w * t, 4)}}{${tg(w, '1/s', 4)}} = ${tg(t, 's')}$$\n\nDas sind $${tz(t / T, 3)}\\,T$.`,
        ),
      ],
      werte: { T, w, anteil, t, ausUmkehr: ausUmkehr ? 1 : 0 },
    };
  },
};

// ---------- Diagramm-Aufgaben ----------

function stPlot(amp: number, w: number, phi0: number, T: number, perioden = 2): PlotSpec {
  return zeitPlot({ f: (t) => amp * Math.sin(w * t + phi0), tMax: perioden * T, yMax: amp, yLabel: 's in cm' });
}

const stAblesen: Generator = {
  id: 'bg-st-ablesen',
  titel: 'Schwingungsgleichung aus dem s-t-Diagramm',
  art: 'diagramm',
  schwierigkeit: 2,
  quelle: 'Buch S. 157, 191 (Selbstcheck Punkt 3)',
  klausur: true,
  erzeuge(rng) {
    const T = rng.wahl(SCHOENE_T);
    const amp = rng.wahl(SCHOENE_AMP_CM);
    const st: Start = rng.wahl(STARTS);
    const w = (2 * Math.PI) / T;
    const plot = stPlot(amp, w, START_PHI[st], T, rng.wahl([1.5, 2, 2.5]));
    const wTex = `${tz(w, 3)}\\,\\mathrm{\\tfrac1s}`;
    const aTex = `${tw(amp)}\\,\\mathrm{cm}`;
    const roh = STARTS.map((s) => `$${startGleichung(s, aTex, wTex)}$`);
    const opt = mischeOptionen(roh, STARTS.indexOf(st), rng.mische);
    const vmax = (amp / 100) * w;
    return {
      titel: 'Gleichung ablesen',
      kontext: 'Das Diagramm zeigt die Auslenkung eines Federpendels (nach oben positiv).',
      plot,
      teile: [
        teil(
          'Lies die Periodendauer $T$ ab.',
          zahl(T, 's', [{ wert: T / 2, hinweis: 'Das ist nur eine halbe Periode. Eine ganze Periode geht z. B. von Hochpunkt zu Hochpunkt.' }], 0.03),
          ['$T$ ist die Zeit für eine vollständige Schwingung.', 'Miss von einem Hochpunkt zum nächsten (oder zwischen zwei Nulldurchgängen in gleicher Richtung).', 'Je länger die Strecke, die du misst, desto genauer – z. B. über zwei Perioden und dann halbieren.'],
          `Von Hochpunkt zu Hochpunkt vergehen $T = ${tgw(T, 's')}$.`,
        ),
        teil(
          'Lies die Amplitude $\\hat s$ ab.',
          zahl(amp / 100, 'cm', [{ wert: (2 * amp) / 100, hinweis: 'Das ist der Abstand von ganz oben nach ganz unten. Die Amplitude misst man von der Ruhelage aus.' }], 0.03),
          ['Die Amplitude ist die größte Auslenkung aus der Ruhelage.', 'Lies den Hochpunkt auf der $s$-Achse ab.', 'Nicht von Tief- bis Hochpunkt messen – das wäre $2\\hat s$.'],
          `Der Hochpunkt liegt bei $\\hat s = ${aTex}$.`,
        ),
        teil(
          'Welche Gleichung beschreibt die Schwingung?',
          auswahl(opt.optionen, opt.richtig),
          ['Schau, wo der Graph bei $t = 0$ startet.', 'Startet er in einem Hoch- oder Tiefpunkt → $\\pm\\cos$. Startet er bei null → $\\pm\\sin$.', 'Bei $\\pm\\sin$ entscheidet die Richtung: steigt der Graph am Anfang, ist es $+\\sin$.'],
          `Der Graph startet ${START_TEXT[st]}, also $${startGleichung(st)}$ mit $\\omega = \\frac{2\\pi}{T} = ${wTex}$:\n$$${startGleichung(st, aTex, wTex)}$$`,
        ),
        teil(
          'Berechne die maximale Geschwindigkeit.',
          zahl(vmax, 'm/s', [{ wert: amp * w, hinweis: 'Rechne $\\hat s$ in Meter um.' }]),
          [gg('$\\hat s$, $\\omega$', '$\\hat v$', '$\\hat v = \\hat s\\,\\omega$'), 'Amplitude in Meter.', `$${tw(amp / 100)}\\,\\mathrm m\\cdot ${wTex}$`],
          `$$\\hat v = \\hat s\\,\\omega = ${tw(amp / 100)}\\,\\mathrm m\\cdot ${wTex} = ${tg(vmax, 'm/s')}$$`,
        ),
      ],
      werte: { T, amp, w, st: STARTS.indexOf(st) },
    };
  },
};

const vtAuswerten: Generator = {
  id: 'bg-vt-auswerten',
  titel: 'Vom v-t-Diagramm zur Auslenkung',
  art: 'diagramm',
  schwierigkeit: 3,
  quelle: 'Notizen Lehrer 5.10.; Buch S. 157; Übungsklausur (Aufgabentyp)',
  klausur: true,
  erzeuge(rng) {
    const T = rng.wahl([0.4, 0.5, 0.8, 1, 1.2, 1.6, 2, 2.4]);
    const vmax = rng.wahl([0.1, 0.15, 0.2, 0.25, 0.4, 0.5, 0.6, 0.8]);
    const st: Start = rng.wahl(STARTS);
    const w = (2 * Math.PI) / T;
    const amp = vmax / w;
    const phi0 = START_PHI[st];
    const plot = zeitPlot({ f: (t) => vmax * Math.cos(w * t + phi0), tMax: 2 * T, yMax: vmax, yLabel: 'v in m/s' });
    const roh = STARTS.map((s) => START_TEXT[s]);
    const opt = mischeOptionen(roh.map((r) => `Start ${r}`), STARTS.indexOf(st), rng.mische);
    const v0 = Math.abs(Math.cos(phi0)) < 1e-9 ? 0 : vmax * Math.cos(phi0);
    return {
      titel: 'Nur die Geschwindigkeit ist bekannt',
      kontext: 'Ein Bewegungssensor hat nur die Geschwindigkeit eines Federpendels aufgezeichnet (nach oben positiv). Ein s-t-Diagramm gibt es nicht.',
      plot,
      teile: [
        teil(
          'Lies die Periodendauer ab.',
          zahl(T, 's', [{ wert: T / 2, hinweis: 'Das ist nur eine halbe Periode.' }], 0.03),
          ['Auch im v-t-Diagramm ist $T$ der Abstand zweier gleichartiger Punkte.', 'Z. B. von Hochpunkt zu Hochpunkt.', 'Über zwei Perioden messen und halbieren ist genauer.'],
          `$T = ${tgw(T, 's')}$`,
        ),
        teil(
          'Lies $\\hat v$ ab und berechne daraus die Amplitude $\\hat s$.',
          zahl(amp, 'cm', [{ wert: vmax * w, hinweis: 'Umgekehrt: $\\hat s = \\frac{\\hat v}{\\omega}$.' }, { wert: vmax * T, hinweis: 'Teile durch $\\omega = \\frac{2\\pi}T$.' }]),
          [gg(`$\\hat v = ${tgw(vmax, 'm/s')}$ (abgelesen), $T$`, '$\\hat s$', '$\\hat v = \\hat s\\cdot\\omega$'), 'Erst $\\omega = \\frac{2\\pi}{T}$.', `$\\omega = ${tg(w, '1/s', 4)}$`],
          `$$\\omega = \\frac{2\\pi}{T} = ${tg(w, '1/s', 4)},\\qquad \\hat s = \\frac{\\hat v}{\\omega} = \\frac{${tgw(vmax, 'm/s')}}{${tg(w, '1/s', 4)}} = ${tg(amp * 100, 'cm')}$$`,
        ),
        teil(
          'Wo befindet sich der Körper bei $t = 0$, und wie bewegt er sich?',
          auswahl(opt.optionen, opt.richtig),
          ['Wo $|v|$ maximal ist, ist der Körper in der Ruhelage. Wo $v = 0$ ist, in einem Umkehrpunkt.', 'Im Umkehrpunkt entscheidet, wohin es als Nächstes geht: Wird $v$ danach positiv, startet er unten.', `Bei $t = 0$ ist $v = ${v0 === 0 ? '0' : tz(v0, 2)}\\,\\mathrm{\\tfrac ms}$.`],
          st === 'ruheHoch' || st === 'ruheRunter'
            ? `Bei $t = 0$ ist $|v| = \\hat v$ maximal → **Ruhelage**. Weil $v ${v0 > 0 ? '> 0' : '< 0'}$, bewegt er sich **nach ${v0 > 0 ? 'oben' : 'unten'}**: $${startGleichung(st)}$.`
            : `Bei $t = 0$ ist $v = 0$ → **Umkehrpunkt**. Danach wird $v$ ${st === 'unten' ? 'positiv (nach oben) – er startet also **unten**' : 'negativ (nach unten) – er startet also **oben**'}: $${startGleichung(st)}$.`,
        ),
        teil(
          'Welche Strecke legt der Körper in der ersten Viertelperiode zurück?',
          zahl(amp, 'cm'),
          ['In einer Viertelperiode geht es von der Ruhelage zum Umkehrpunkt oder umgekehrt.', 'Die Strecke ist also genau die Amplitude.', 'Im Diagramm steckt die Strecke in der Fläche, die der v-t-Graph im ersten Periodenviertel mit der Zeitachse einschließt.'],
          `Eine Viertelperiode führt von der Ruhelage zum Umkehrpunkt (oder zurück): Strecke $= \\hat s = ${tg(amp * 100, 'cm')}$. Das ist auch die Fläche unter dem v-t-Graphen von $0$ bis $\\frac T4 = ${tgw(T / 4, 's')}$.`,
        ),
      ],
      werte: { T, vmax, w, amp, st: STARTS.indexOf(st) },
    };
  },
};

const klickPunkte: Generator = {
  id: 'bg-klick',
  titel: 'Umkehrpunkt oder Nulldurchgang anklicken',
  art: 'diagramm',
  schwierigkeit: 1,
  quelle: 'Buch S. 152–153, 157',
  erzeuge(rng) {
    const T = rng.wahl(SCHOENE_T);
    const amp = rng.wahl(SCHOENE_AMP_CM);
    const st: Start = rng.wahl(STARTS);
    const phi0 = START_PHI[st];
    const w = (2 * Math.PI) / T;
    const plot = stPlot(amp, w, phi0, T, 2);
    const art = rng.wahl(['umkehr', 'null', 'vmax', 'vnull'] as const);
    const tU = ersterUmkehrpunkt(phi0, w);
    const tN = ersterNulldurchgang(phi0, w);
    const ziel = art === 'umkehr' || art === 'vnull' ? tU : tN;
    const frage = {
      umkehr: 'Klicke auf den **ersten Umkehrpunkt** nach dem Start ($t > 0$).',
      null: 'Klicke auf den **ersten Durchgang durch die Gleichgewichtslage** nach dem Start ($t > 0$).',
      vmax: 'Klicke auf den ersten Zeitpunkt nach dem Start, an dem der Körper **am schnellsten** ist.',
      vnull: 'Klicke auf den ersten Zeitpunkt nach dem Start, an dem die **Geschwindigkeit null** ist.',
    }[art];
    return {
      titel: 'Besondere Punkte',
      kontext: 'Das Diagramm zeigt die Auslenkung eines Federpendels.',
      plot,
      teile: [
        {
          frage,
          antwort: { art: 'klick', ziele: [ziel], toleranz: Math.max(0.035 * T, (2 * T) / 120) },
          hilfen: [
            'Umkehrpunkte sind die Hoch- und Tiefpunkte. Durchgänge durch die Ruhelage sind die Nullstellen.',
            art === 'vmax' ? 'Am schnellsten ist der Körper dort, wo der s-t-Graph am steilsten ist.' : art === 'vnull' ? 'Die Geschwindigkeit ist die Steigung: null bei Hoch- und Tiefpunkten.' : 'Suche die erste passende Stelle rechts von $t = 0$.',
            `Der gesuchte Zeitpunkt liegt bei einem Vielfachen von $\\frac T4 = ${tgw(T / 4, 's')}$.`,
          ],
          loesung: `Gesucht war $t = ${tgw(ziel, 's', 3)}$ – ${art === 'umkehr' || art === 'vnull' ? 'der erste Hoch- bzw. Tiefpunkt (dort ist $v = 0$)' : 'der erste Nulldurchgang (dort ist der Graph am steilsten, $|v| = \\hat v$)'}.`,
        },
      ],
      werte: { T, ziel },
    };
  },
};

const graphZuordnen: Generator = {
  id: 'bg-graph-zuordnen',
  titel: 'Passendes v-t- oder a-t-Diagramm finden',
  art: 'diagramm',
  schwierigkeit: 2,
  quelle: 'Buch S. 151 Aufg. 6, S. 157 (Abb. 3)',
  erzeuge(rng) {
    const T = rng.wahl([1, 2, 4]);
    const st: Start = rng.wahl(STARTS);
    const phi0 = START_PHI[st];
    const w = (2 * Math.PI) / T;
    const gesucht = rng.wahl(['v', 'a'] as const);
    const sf = (t: number) => Math.sin(w * t + phi0);
    const vf = (t: number) => Math.cos(w * t + phi0);
    const af = (t: number) => -Math.sin(w * t + phi0);
    const kandidaten = gesucht === 'v' ? [vf, (t: number) => -vf(t), sf, af] : [af, sf, vf, (t: number) => -vf(t)];
    const mini = (f: (t: number) => number): PlotSpec => ({
      x: [0, 2 * T],
      y: [-1.3, 1.3],
      xLabel: 't',
      yLabel: gesucht === 'v' ? 'v' : 'a',
      xSchritt: T / 2,
      ySchritt: 1,
      kurven: [{ f, stil: 'blau' }],
      xNachkomma: T === 1 ? 1 : 0,
      yNachkomma: 0,
    });
    const idx = rng.mische([0, 1, 2, 3]);
    const plots = idx.map((i) => mini(kandidaten[i]));
    const optionen = idx.map((_, k) => `Diagramm ${String.fromCharCode(65 + k)}`);
    const richtig = idx.indexOf(0);
    return {
      titel: gesucht === 'v' ? 'Welches v-t-Diagramm gehört dazu?' : 'Welches a-t-Diagramm gehört dazu?',
      kontext: 'Gegeben ist das s-t-Diagramm einer harmonischen Schwingung.',
      plot: { ...zeitPlot({ f: (t) => 3 * sf(t), tMax: 2 * T, yMax: 3, yLabel: 's in cm' }) },
      teile: [
        teil(
          `Welches Diagramm zeigt den passenden ${gesucht === 'v' ? 'Geschwindigkeits' : 'Beschleunigungs'}verlauf?`,
          auswahl(optionen, richtig, plots),
          gesucht === 'v'
            ? ['$v$ ist die Steigung von $s$.', 'Wo $s$ einen Hoch- oder Tiefpunkt hat, muss $v = 0$ sein.', 'Wo $s$ steigt, ist $v$ positiv; wo $s$ fällt, negativ.']
            : ['$a = -\\omega^2 s$: Das a-t-Diagramm ist das Spiegelbild des s-t-Diagramms.', 'Wo $s$ maximal ist, ist $a$ minimal (am stärksten negativ).', 'Nullstellen von $a$ liegen dort, wo auch $s = 0$ ist.'],
          gesucht === 'v'
            ? 'Richtig ist das Diagramm, das bei den Hoch- und Tiefpunkten von $s$ null ist und dort positiv ist, wo $s$ ansteigt. Es ist gegenüber $s$ um eine Viertelperiode verschoben.'
            : 'Richtig ist das an der t-Achse gespiegelte s-t-Diagramm, denn $a(t) = -\\omega^2\\cdot s(t)$.',
        ),
      ],
      werte: { T, richtig },
    };
  },
};

const ortRichtung: Generator = {
  id: 'bg-ort-richtung',
  titel: 'Ort und Bewegungsrichtung zu einem Zeitpunkt',
  art: 'diagramm',
  schwierigkeit: 2,
  quelle: 'Buch S. 157; Übungsklausur (Aufgabentyp)',
  erzeuge(rng) {
    const T = rng.wahl([1, 1.2, 1.6, 2, 2.4, 3, 4]);
    const amp = rng.wahl(SCHOENE_AMP_CM);
    const st: Start = rng.wahl(STARTS);
    const phi0 = START_PHI[st];
    const w = (2 * Math.PI) / T;
    let t1 = T * rng.wahl([0.1, 0.15, 0.35, 0.4, 0.6, 0.65, 0.85, 0.9, 1.15, 1.35, 1.6, 1.85]);
    t1 = Number(t1.toFixed(2));
    const s1 = Math.sin(w * t1 + phi0);
    const v1 = Math.cos(w * t1 + phi0);
    const richtig = (s1 > 0 ? 0 : 2) + (v1 > 0 ? 0 : 1);
    const plot = stPlot(amp, w, phi0, T, 2);
    plot.markierungen = [{ x: t1, y: amp * s1, label: `t₁ = ${String(t1).replace('.', ',')} s` }];
    return {
      titel: 'Wo und wohin?',
      kontext: 'Das Diagramm zeigt die Auslenkung eines Federpendels (nach oben positiv). Markiert ist der Zeitpunkt $t_1$.',
      plot,
      teile: [
        teil(
          'Wo befindet sich der Körper bei $t_1$ und in welche Richtung bewegt er sich?',
          auswahl(['oberhalb der Ruhelage, nach oben', 'oberhalb der Ruhelage, nach unten', 'unterhalb der Ruhelage, nach oben', 'unterhalb der Ruhelage, nach unten'], richtig),
          ['Das Vorzeichen von $s(t_1)$ sagt dir, ob er oberhalb oder unterhalb ist.', 'Die Bewegungsrichtung ist das Vorzeichen der **Steigung** bei $t_1$.', 'Steigt der Graph bei $t_1$, bewegt er sich nach oben.'],
          `Bei $t_1$ ist $s ${s1 > 0 ? '> 0' : '< 0'}$ (${s1 > 0 ? 'oberhalb' : 'unterhalb'}) und der Graph ${v1 > 0 ? 'steigt' : 'fällt'} – also bewegt sich der Körper **nach ${v1 > 0 ? 'oben' : 'unten'}**.`,
        ),
      ],
      werte: { T, t1, richtig },
    };
  },
};

export const generatoren: Generator[] = [vmaxAmax, ampAusV, sZeitpunkt, ersteZeit, stAblesen, vtAuswerten, klickPunkte, graphZuordnen, ortRichtung];
