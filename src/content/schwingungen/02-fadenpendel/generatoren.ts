import { g, tg, tgw, tw, tz } from '../../../lib/format';
import { G, gAusPendel, laengeAusPeriode, periodeFaden, richtgroesseFaden } from '../../../lib/physik';
import { gg, teil, zahl } from '../../helfer';
import type { Generator } from '../../types';

const GRAD = Math.PI / 180;

const periode: Generator = {
  id: 'fa-periode',
  titel: 'Periodendauer aus der Pendellänge',
  art: 'rechnen',
  schwierigkeit: 1,
  quelle: 'Buch S. 164',
  klausur: true,
  erzeuge(rng) {
    const fall = rng.wahl([
      { text: 'Eine Kinderschaukel', l: [1.5, 3, 0.1] },
      { text: 'Ein Pendel einer Standuhr', l: [0.25, 1.2, 0.05] },
      { text: 'Eine Abrissbirne am Kran', l: [8, 25, 0.5] },
      { text: 'Ein Faden mit einer Stahlkugel', l: [0.1, 1.5, 0.05] },
      { text: 'Ein Kronleuchter in einer Kirche', l: [4, 15, 0.5] },
    ]);
    const l = rng.zahl(fall.l[0], fall.l[1], fall.l[2]);
    const m = rng.zahl(0.2, 80, 0.1);
    const T = periodeFaden(l);
    const f = 1 / T;
    const n = 60 / T;
    return {
      titel: 'Wie lange dauert ein Hin und Her?',
      kontext: `${fall.text} kann als Fadenpendel der Länge ${g('\\ell', l, 'm')} betrachtet werden (Masse ${g('m', m, 'kg')}). Sie schwingt mit kleinen Ausschlägen.`,
      teile: [
        teil(
          'Berechne die Periodendauer.',
          zahl(T, 's', [{ wert: 2 * Math.PI * Math.sqrt(G / l), hinweis: 'Unter der Wurzel steht $\\frac{\\ell}{g}$, nicht $\\frac g\\ell$.' }]),
          [gg(`$\\ell = ${tgw(l, 'm')}$ (die Masse brauchst du nicht)`, '$T$', '$T = 2\\pi\\sqrt{\\frac\\ell g}$'), 'Die Masse kürzt sich beim Fadenpendel heraus – sie ist eine Falle.', `$\\frac\\ell g = ${tz(l / G, 3)}\\,\\mathrm{s^2}$`],
          `$$T = 2\\pi\\sqrt{\\frac{\\ell}{g}} = 2\\pi\\sqrt{\\frac{${tgw(l, 'm')}}{9{,}81\\,\\mathrm{m/s^2}}} = ${tg(T, 's')}$$ Die Masse spielt keine Rolle.`,
        ),
        teil('Berechne die Frequenz.', zahl(f, 'Hz'), [gg('$T$', '$f$', '$f = \\frac1T$'), 'Kehrwert.', `$T = ${tz(T, 4)}\\,\\mathrm s$`], `$$f = \\frac{1}{T} = ${tg(f, 'Hz')}$$`),
        teil('Wie viele vollständige Schwingungen macht sie in einer Minute?', zahl(n, '', [], 0.03), [gg('$T$', 'Anzahl $n$ in $60\\,\\mathrm s$'), '$n = \\frac{60\\,\\mathrm s}{T}$', `$\\frac{60}{${tz(T, 4)}}$`], `$$n = \\frac{60\\,\\mathrm s}{${tg(T, 's')}} \\approx ${tz(n, 3)}$$`),
      ],
      werte: { l, T, f, n },
    };
  },
};

const laenge: Generator = {
  id: 'fa-laenge',
  titel: 'Pendellänge für eine gewünschte Periodendauer',
  art: 'rechnen',
  schwierigkeit: 2,
  quelle: 'Buch S. 154 Aufg. 2, S. 164 Aufg. 3',
  klausur: true,
  erzeuge(rng) {
    const mitZaehlung = rng.chance(0.5);
    let T: number;
    let kontext: string;
    let tHilfe: string;
    if (mitZaehlung) {
      const n = rng.wahl([10, 15, 20, 25, 30]);
      const t = Number((n * rng.zahl(0.6, 3.5, 0.01)).toFixed(1));
      T = t / n;
      kontext = `Ein Uhrmacher möchte ein Pendel bauen, das genau ${n} vollständige Schwingungen in ${g('t', t, 's')} ausführt.`;
      tHilfe = `$T = \\frac{t}{n} = \\frac{${tw(t)}\\,\\mathrm s}{${n}} = ${tg(T, 's', 4)}$`;
    } else {
      T = rng.wahl([0.5, 1, 1.5, 2, 2.5, 3, 4]);
      kontext = `Ein Pendel soll die Periodendauer ${g('T', T, 's')} haben${T === 2 ? ' (Sekundenpendel)' : ''}.`;
      tHilfe = `$T = ${tgw(T, 's')}$`;
    }
    const l = laengeAusPeriode(T);
    return {
      titel: 'Pendel nach Maß',
      kontext,
      teile: [
        teil(
          'Wie lang muss das Pendel sein?',
          zahl(l, 'm', [{ wert: (G * T) / (2 * Math.PI), hinweis: 'Beim Umstellen musst du quadrieren: $\\ell = g\\left(\\frac{T}{2\\pi}\\right)^2$.' }, { wert: (T / (2 * Math.PI)) ** 2, hinweis: 'Es fehlt noch der Faktor $g$.' }]),
          [gg(mitZaehlung ? '$n$ Schwingungen in der Zeit $t$' : '$T$', '$\\ell$', '$T = 2\\pi\\sqrt{\\frac\\ell g}$ nach $\\ell$ umstellen'), 'Durch $2\\pi$ teilen, quadrieren, mit $g$ malnehmen.', tHilfe],
          `${mitZaehlung ? `${tHilfe}\n\n` : ''}$$\\ell = g\\cdot\\left(\\frac{T}{2\\pi}\\right)^2 = 9{,}81\\,\\mathrm{\\tfrac{m}{s^2}}\\cdot\\left(\\frac{${tz(T, 4)}\\,\\mathrm s}{2\\pi}\\right)^2 = ${tg(l, 'm')}$$`,
        ),
      ],
      werte: { T, l },
    };
  },
};

const gMessung: Generator = {
  id: 'fa-g-messung',
  titel: 'Ortsfaktor g aus einer Pendelmessung',
  art: 'rechnen',
  schwierigkeit: 2,
  quelle: 'Buch S. 188 (Training I, Aufg. 1d)',
  klausur: true,
  erzeuge(rng) {
    const gWahr = rng.wahl([9.78, 9.81, 9.83, 9.8]);
    const l = rng.zahl(0.3, 2.5, 0.01);
    const n = rng.wahl([10, 20, 25, 30, 50]);
    const t = Number((n * periodeFaden(l, gWahr)).toFixed(1));
    const T = t / n;
    const gWert = gAusPendel(l, T);
    return {
      titel: 'g selbst messen',
      kontext: `Eine Schülergruppe misst an einem Fadenpendel der Länge ${g('\\ell', l * 100, 'cm')} für ${n} Perioden die Zeit ${g('t', t, 's')}.`,
      teile: [
        teil('Berechne die Periodendauer.', zahl(T, 's'), [gg(`$n = ${n}$, $t$`, '$T$', '$T = \\frac tn$'), 'Gesamtzeit durch Anzahl der Perioden.', `$\\frac{${tw(t)}}{${n}}$`], `$$T = \\frac{${tw(t)}\\,\\mathrm s}{${n}} = ${tg(T, 's', 4)}$$`),
        teil(
          'Berechne daraus den Ortsfaktor $g$.',
          zahl(gWert, 'm/s^2', [{ wert: gAusPendel(l * 100, T), hinweis: 'Die Länge in Meter einsetzen.' }, { wert: (2 * Math.PI * l) / T ** 2, hinweis: 'Es heißt $4\\pi^2$ – $2\\pi$ wird beim Umstellen quadriert.' }], 0.01),
          [gg('$\\ell$, $T$', '$g$', '$T = 2\\pi\\sqrt{\\frac\\ell g}$ nach $g$ umstellen'), 'Quadrieren: $T^2 = 4\\pi^2\\frac\\ell g$, also $g = \\frac{4\\pi^2\\ell}{T^2}$.', `$T^2 = ${tz(T * T, 4)}\\,\\mathrm{s^2}$`],
          `$$g = \\frac{4\\pi^2\\,\\ell}{T^2} = \\frac{4\\pi^2\\cdot ${tw(l)}\\,\\mathrm m}{(${tz(T, 4)}\\,\\mathrm s)^2} = ${tg(gWert, 'm/s^2')}$$`,
        ),
      ],
      werte: { l, t, n, T, g: gWert },
    };
  },
};

const richtgroesse: Generator = {
  id: 'fa-richtgroesse',
  titel: 'Richtgröße und Rückstellkraft',
  art: 'rechnen',
  schwierigkeit: 1,
  quelle: 'Buch S. 159 Aufg. 3',
  erzeuge(rng) {
    const m = rng.zahl(0.1, 5, 0.1);
    const l = rng.zahl(0.4, 3, 0.1);
    const sCm = rng.zahl(2, Math.min(25, l * 100 * 0.15), 1);
    const D = richtgroesseFaden(m, l);
    const F = D * (sCm / 100);
    return {
      titel: 'Wie stark zieht das Pendel zurück?',
      kontext: `Ein Körper (${g('m', m, 'kg')}) hängt an einem ${g('\\ell', l, 'm')} langen Faden.`,
      teile: [
        teil('Berechne die Richtgröße $D$ des Fadenpendels.', zahl(D, 'N/m', [{ wert: m / l, hinweis: 'Es fehlt der Ortsfaktor: $D = \\frac{m\\cdot g}{\\ell}$.' }]), [gg('$m$, $\\ell$', '$D$', '$D = \\frac{m\\cdot g}{\\ell}$'), 'Aus dem linearen Kraftgesetz $F_R = -\\frac{mg}{\\ell}s$.', `$m\\cdot g = ${tg(m * G, 'N')}$`], `$$D = \\frac{m\\cdot g}{\\ell} = \\frac{${tw(m)}\\,\\mathrm{kg}\\cdot 9{,}81\\,\\mathrm{m/s^2}}{${tw(l)}\\,\\mathrm m} = ${tg(D, 'N/m')}$$`),
        teil(
          `Wie groß ist der Betrag der Rückstellkraft bei der Auslenkung ${g('s', sCm, 'cm')}?`,
          zahl(F, 'N', [{ wert: D * sCm, hinweis: 'Auslenkung in Meter umrechnen.' }]),
          [gg('$D$, $s$', '$|F_R|$', '$|F_R| = D\\cdot s$'), 'Kleine Auslenkung → lineares Kraftgesetz gilt.', `$s = ${tw(sCm / 100)}\\,\\mathrm m$`],
          `$$|F_R| = D\\cdot s = ${tg(D, 'N/m')}\\cdot ${tw(sCm / 100)}\\,\\mathrm m = ${tg(F, 'N')}$$`,
        ),
      ],
      werte: { m, l, D, F, s: sCm / 100 },
    };
  },
};

const kleinwinkel: Generator = {
  id: 'fa-kleinwinkel',
  titel: 'Wie gut ist die Kleinwinkelnäherung?',
  art: 'rechnen',
  schwierigkeit: 2,
  quelle: 'Buch S. 161 (Material D)',
  erzeuge(rng) {
    const grad = rng.wahl([12, 15, 18, 20, 25, 30, 35, 40]);
    const rad = grad * GRAD;
    const sin = Math.sin(rad);
    const abw = (rad - sin) / sin;
    return {
      titel: 'sin α ≈ α?',
      kontext: `Ein Fadenpendel wird um den Winkel $\\alpha = ${grad}^\\circ$ ausgelenkt.`,
      teile: [
        teil('Gib den Winkel im Bogenmaß an.', zahl(rad, ''), [gg(`$\\alpha = ${grad}^\\circ$`, '$\\alpha$ in rad', '$\\alpha_\\text{rad} = \\alpha_\\text{Grad}\\cdot\\frac{\\pi}{180^\\circ}$'), '$180^\\circ$ entsprechen $\\pi$.', `$\\frac{${grad}}{180}\\cdot\\pi$`], `$$\\alpha = ${grad}^\\circ\\cdot\\frac{\\pi}{180^\\circ} = ${tz(rad, 4)}$$`),
        teil('Berechne $\\sin\\alpha$.', zahl(sin, '', [{ wert: Math.sin(grad), hinweis: 'Dein Rechner hat $\\sin(' + grad + ')$ im Bogenmaß gerechnet. Entweder in Grad rechnen oder das Bogenmaß von a) nehmen.' }]), ['Rechner auf **DEG** und $\\sin(' + grad + '^\\circ)$, oder auf **RAD** und $\\sin$ des Werts aus a).', 'Beides muss dasselbe ergeben.', `Ungefähr $${tz(sin, 2)}$`], `$$\\sin(${grad}^\\circ) = ${tz(sin, 4)}$$`),
        teil(
          'Um wie viel Prozent ist $\\alpha$ (im Bogenmaß) größer als $\\sin\\alpha$?',
          zahl(abw, '%', [], 0.08),
          [gg('$\\alpha$ (rad), $\\sin\\alpha$', 'relative Abweichung', '$\\frac{\\alpha - \\sin\\alpha}{\\sin\\alpha}$'), 'Differenz durch den Wert von $\\sin\\alpha$ teilen – mit allen Nachkommastellen, sonst frisst die Rundung das Ergebnis.', `$\\alpha - \\sin\\alpha = ${tz(rad - sin, 3)}$`],
          `$$\\frac{\\alpha - \\sin\\alpha}{\\sin\\alpha} = \\frac{${tz(rad, 4)} - ${tz(sin, 4)}}{${tz(sin, 4)}} = ${tz(abw * 100, 2)}\\,\\%$$ ${abw < 0.006 ? 'Unter einem halben Prozent – die Näherung ist sehr gut.' : abw < 0.05 ? 'Noch unter 5 %, aber schon spürbar.' : 'Mehr als 5 % – hier ist die Näherung nicht mehr gut.'}`,
        ),
      ],
      werte: { grad, rad, sin, abw },
    };
  },
};

const tabelle: Generator = {
  id: 'fa-tabelle',
  titel: 'Messreihe auswerten: T ~ √ℓ',
  art: 'rechnen',
  schwierigkeit: 2,
  quelle: 'Buch S. 154 (Tab. 2B, Aufg. 3), S. 188 (Training I)',
  erzeuge(rng) {
    const ls = rng.mische([0.2, 0.3, 0.4, 0.5, 0.6, 0.8, 1.0, 1.2, 1.5]).slice(0, 5).sort((a, b) => a - b);
    const Ts = ls.map((l) => Number((periodeFaden(l) * (1 + (rng.next() - 0.5) * 0.012)).toFixed(2)));
    const ks = ls.map((l, i) => Ts[i] / Math.sqrt(l));
    const k = ks.reduce((a, b) => a + b, 0) / ks.length;
    const gWert = (4 * Math.PI ** 2) / (k * k);
    const tab = `| $\\ell$ in m | ${ls.map((l) => tw(l)).map((x) => `$${x}$`).join(' | ')} |\n|---|${ls.map(() => '---').join('|')}|\n| $T$ in s | ${Ts.map((t) => `$${tw(t)}$`).join(' | ')} |`;
    return {
      titel: 'Messreihe Fadenpendel',
      kontext: `Bei kleinen Ausschlägen wurde für verschiedene Pendellängen die Periodendauer gemessen:\n\n${tab}`,
      teile: [
        teil(
          'Bestimme die Proportionalitätskonstante $k$ in $T = k\\cdot\\sqrt\\ell$ als Mittelwert aus allen Messungen.',
          zahl(k, 's/√m', [{ wert: Ts.reduce((a, t, i) => a + t / ls[i], 0) / ls.length, hinweis: 'Teile durch $\\sqrt\\ell$, nicht durch $\\ell$.' }], 0.01),
          [gg('die Wertepaare', '$k$', '$k = \\frac{T}{\\sqrt\\ell}$ für jede Messung, dann Mittelwert'), 'Für jede Spalte $\\frac{T}{\\sqrt\\ell}$ ausrechnen – die Werte sollten fast gleich sein.', `Erste Spalte: $\\frac{${tw(Ts[0])}}{\\sqrt{${tw(ls[0])}}} = ${tz(ks[0], 3)}$`],
          `Quotienten $\\frac{T}{\\sqrt\\ell}$: ${ks.map((x) => `$${tz(x, 3)}$`).join(', ')}.\n$$k = ${tg(k, 's/√m', 3)}$$ Die Quotienten sind (fast) konstant – das bestätigt $T\\sim\\sqrt\\ell$.`,
        ),
        teil(
          'Bestimme daraus den Ortsfaktor $g$.',
          zahl(gWert, 'm/s^2', [], 0.015),
          [gg('$k$', '$g$', '$k = \\frac{2\\pi}{\\sqrt g}$'), 'Nach $g$ umstellen: $g = \\frac{4\\pi^2}{k^2}$.', `$k^2 = ${tz(k * k, 4)}\\,\\mathrm{s^2/m}$`],
          `$$g = \\frac{4\\pi^2}{k^2} = \\frac{4\\pi^2}{(${tz(k, 4)})^2}\\,\\mathrm{\\tfrac{m}{s^2}} = ${tg(gWert, 'm/s^2')}$$ Abweichung vom Literaturwert $9{,}81\\,\\mathrm{m/s^2}$: $${tz(Math.abs(gWert - 9.81) / 9.81 * 100, 2)}\\,\\%$.`,
        ),
      ],
      werte: { k, g: gWert },
    };
  },
};

const t2Diagramm: Generator = {
  id: 'fa-t2-diagramm',
  titel: 'g aus dem T²-ℓ-Diagramm',
  art: 'diagramm',
  schwierigkeit: 3,
  quelle: 'Buch S. 154, 178–179',
  erzeuge(rng) {
    const gWahr = rng.wahl([9.81, 1.62, 3.71, 24.8]);
    const ort = { 9.81: 'auf der Erde', 1.62: 'auf dem Mond', 3.71: 'auf dem Mars', 24.8: 'auf dem Jupiter' }[gWahr as 9.81];
    const steig = (4 * Math.PI ** 2) / gWahr;
    const lMax = 1;
    const yMax = steig * lMax;
    const yGrenze = yMax > 20 ? Math.ceil(yMax / 5) * 5 : yMax > 5 ? Math.ceil(yMax) : Math.ceil(yMax * 2) / 2;
    const punkte = [0.2, 0.4, 0.6, 0.8, 1].map((l) => ({ x: l, y: steig * l * (1 + (rng.next() - 0.5) * 0.03) }));
    return {
      titel: 'Linearisieren',
      kontext: `Eine Sonde misst ${ort} die Periodendauer eines Fadenpendels für verschiedene Längen. Aufgetragen ist $T^2$ gegen $\\ell$ mit Ausgleichsgerade.`,
      plot: {
        x: [0, 1.1],
        y: [0, yGrenze],
        xLabel: 'ℓ in m',
        yLabel: 'T² in s²',
        xSchritt: 0.2,
        ySchritt: yGrenze / 5,
        xFein: 0.05,
        yFein: yGrenze / 25,
        xNachkomma: 1,
        yNachkomma: yGrenze / 5 < 1 ? 1 : 0,
        kurven: [{ f: (l) => steig * l, stil: 'akzent' }],
        punkte,
      },
      teile: [
        teil(
          'Bestimme die Steigung der Geraden.',
          zahl(steig, 's^2/m', [], 0.04),
          ['Die Steigung ist $\\frac{\\Delta(T^2)}{\\Delta\\ell}$.', 'Nimm ein großes Steigungsdreieck, z. B. von $\\ell = 0$ bis $\\ell = 1\\,\\mathrm m$.', `Bei $\\ell = 1\\,\\mathrm m$ liest du etwa $T^2 \\approx ${tz(steig, 2)}\\,\\mathrm{s^2}$ ab.`],
          `$$m = \\frac{\\Delta(T^2)}{\\Delta\\ell} \\approx \\frac{${tz(steig, 3)}\\,\\mathrm{s^2}}{1\\,\\mathrm m} = ${tz(steig, 3)}\\,\\mathrm{\\tfrac{s^2}{m}}$$`,
        ),
        teil(
          'Bestimme daraus den Ortsfaktor.',
          zahl(gWahr, 'm/s^2', [{ wert: steig / (4 * Math.PI ** 2), hinweis: 'Umgekehrt: $g = \\frac{4\\pi^2}{\\text{Steigung}}$.' }], 0.05),
          [gg('Steigung $m$', '$g$', '$T^2 = \\frac{4\\pi^2}{g}\\cdot\\ell$'), 'Die Steigung ist $\\frac{4\\pi^2}{g}$.', '$g = \\frac{4\\pi^2}{m}$'],
          `Aus $T = 2\\pi\\sqrt{\\ell/g}$ folgt $T^2 = \\frac{4\\pi^2}{g}\\,\\ell$ – eine Ursprungsgerade mit Steigung $\\frac{4\\pi^2}{g}$.\n$$g = \\frac{4\\pi^2}{${tz(steig, 3)}\\,\\mathrm{s^2/m}} \\approx ${tg(gWahr, 'm/s^2')}$$`,
        ),
      ],
      werte: { g: gWahr, steig },
    };
  },
};

export const generatoren: Generator[] = [periode, laenge, gMessung, richtgroesse, kleinwinkel, tabelle, t2Diagramm];
