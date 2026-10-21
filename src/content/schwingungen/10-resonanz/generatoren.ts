import { g, tg, tgw, tw, tz } from '../../../lib/format';
import { eigenfrequenz, federAusEinsinken, G, laengeAusPeriode } from '../../../lib/physik';
import { auswahl, gg, teil, zahl } from '../../helfer';
import type { Generator } from '../../types';

const fahrzeug: Generator = {
  id: 'rs-fahrzeug',
  titel: 'Resonanz bei Bodenwellen',
  art: 'rechnen',
  schwierigkeit: 3,
  quelle: 'Buch S. 174–176 (Rechenbeispiel-Typ)',
  klausur: true,
  erzeuge(rng) {
    const fz = rng.wahl([
      { name: 'Ein Wohnmobil', m: [2800, 3500], dm: [70, 110], dx: [0.3, 1.2] },
      { name: 'Ein Kleintransporter', m: [1900, 2600], dm: [70, 110], dx: [0.4, 1.5] },
      { name: 'Ein Quad', m: [280, 400], dm: [55, 95], dx: [1.5, 4] },
      { name: 'Ein Lastenrad mit Federung', m: [60, 90], dm: [45, 80], dx: [2, 6] },
      { name: 'Ein Kleinwagen', m: [950, 1150], dm: [60, 100], dx: [0.6, 1.8] },
    ]);
    const mGes = rng.zahl(fz.m[0], fz.m[1], 10);
    const dm = rng.zahl(fz.dm[0], fz.dm[1], 1);
    let dxCm = rng.zahl(fz.dx[0], fz.dx[1], 0.1);
    let xAbst = rng.zahl(2, 14, 0.5);
    if (Math.abs(mGes - 1280) < 1e-9 && Math.abs(dm - 80) < 1e-9) dxCm += 0.3;
    if (Math.abs(xAbst - 8) < 1e-9) xAbst = 7.5;
    const D = federAusEinsinken(dm, dxCm / 100);
    const f0 = eigenfrequenz(mGes, D);
    const v = xAbst * f0;
    return {
      titel: 'Rumpelstrecke',
      kontext: `${fz.name} hat mit Fahrer bzw. Fahrerin die Masse ${g('m', mGes, 'kg')}. Steigt eine weitere Person (${g('\\Delta m', dm, 'kg')}) ein, sinkt der Aufbau um ${g('\\Delta x', dxCm, 'cm')} ein. Modelliere das Fahrzeug als Federpendel (Masse $m$ – den kleinen Zuwachs durch die Person vernachlässigen).`,
      teile: [
        teil(
          'Berechne die Federkonstante der Federung.',
          zahl(D, 'kN/m', [{ wert: dm / (dxCm / 100), hinweis: 'Die zusätzliche Kraft ist die Gewichtskraft $\\Delta m\\cdot g$.' }, { wert: (mGes * G) / (dxCm / 100), hinweis: 'Nur die **zusätzliche** Last verursacht das zusätzliche Einsinken $\\Delta x$.' }]),
          [gg('$\\Delta m$, $\\Delta x$', '$D$', '$D = \\frac{\\Delta m\\cdot g}{\\Delta x}$'), 'Zusätzliche Gewichtskraft durch zusätzliche Einfederung.', `$\\Delta m\\cdot g = ${tg(dm * G, 'N')}$`],
          `$$D = \\frac{\\Delta m\\cdot g}{\\Delta x} = \\frac{${tg(dm * G, 'N')}}{${tw(dxCm / 100)}\\,\\mathrm m} = ${tg(D, 'N/m')}$$`,
        ),
        teil(
          'Berechne die Eigenfrequenz $f_0$.',
          zahl(f0, 'Hz', [{ wert: Math.sqrt(D / mGes), hinweis: 'Das ist $\\omega_0$. Für $f_0$ noch durch $2\\pi$ teilen.' }]),
          [gg('$D$, $m$', '$f_0$', '$f_0 = \\frac{1}{2\\pi}\\sqrt{\\frac Dm}$'), 'Erst $\\omega_0 = \\sqrt{D/m}$, dann $f_0 = \\frac{\\omega_0}{2\\pi}$.', `$\\omega_0 = ${tg(Math.sqrt(D / mGes), '1/s', 4)}$`],
          `$$f_0 = \\frac{1}{2\\pi}\\sqrt{\\frac{${tz(D, 4)}\\,\\mathrm{N/m}}{${tw(mGes)}\\,\\mathrm{kg}}} = ${tg(f0, 'Hz')}$$`,
        ),
        teil(
          `Die Straße hat Bodenwellen im Abstand ${g('x', xAbst, 'm')}. Bei welcher Geschwindigkeit gerät das Fahrzeug in Resonanz (in km/h)?`,
          zahl(v, 'km/h', [{ wert: xAbst / f0, hinweis: 'Pro Sekunde werden $\\frac vx$ Wellen überfahren – das ist $f_a$. Also $v = x\\cdot f_0$.' }]),
          [gg('$x$, $f_0$', '$v$', 'Resonanz: $f_a = f_0$ mit $f_a = \\frac vx$'), 'Überfährt das Fahrzeug pro Sekunde so viele Wellen, wie es Eigenschwingungen macht, wird es in Resonanz angeregt.', `$v = x\\cdot f_0 = ${tg(v, 'm/s')}$`],
          `$$v = x\\cdot f_0 = ${tgw(xAbst, 'm')}\\cdot ${tg(f0, 'Hz')} = ${tg(v, 'm/s')} = ${tg(v * 3.6, 'km/h')}$$`,
        ),
      ],
      werte: { mGes, dm, dx: dxCm / 100, D, f0, v, x: xAbst },
    };
  },
};

const tilger: Generator = {
  id: 'rs-tilger',
  titel: 'Pendel-Schwingungstilger abstimmen',
  art: 'rechnen',
  schwierigkeit: 2,
  quelle: 'Buch S. 176–177',
  erzeuge(rng) {
    const bau = rng.wahl(['Ein Fernsehturm', 'Ein schlanker Wohnturm', 'Eine Aussichtsplattform', 'Ein Bürohochhaus']);
    const T = rng.zahl(3, 12, 0.1);
    const l = laengeAusPeriode(T);
    const f0 = 1 / T;
    return {
      titel: 'Ein Pendel gegen das Schwanken',
      kontext: `${bau} schwankt im Wind mit einer Eigenperiode von ${g('T', T, 's')}. In der Spitze soll ein Fadenpendel als Schwingungstilger aufgehängt werden.`,
      teile: [
        teil('Wie groß ist die Eigenfrequenz des Bauwerks?', zahl(f0, 'Hz', [{ wert: (2 * Math.PI) / T, hinweis: 'Das ist die Kreisfrequenz. Gefragt ist $f = \\frac1T$.' }]), [gg('$T$', '$f_0$', '$f_0 = \\frac1T$'), 'Kehrwert.', `$\\frac{1}{${tw(T)}}$`], `$$f_0 = \\frac{1}{T} = ${tg(f0, 'Hz')}$$`),
        teil(
          'Wie lang muss das Pendel sein, damit es dieselbe Eigenfrequenz hat?',
          zahl(l, 'm', [{ wert: (G * T) / (2 * Math.PI), hinweis: 'Beim Umstellen von $T = 2\\pi\\sqrt{\\ell/g}$ wird quadriert.' }]),
          [gg('$T$', '$\\ell$', '$T = 2\\pi\\sqrt{\\frac\\ell g}$'), 'Gleiche Eigenfrequenz heißt gleiche Periodendauer.', '$\\ell = g\\left(\\frac{T}{2\\pi}\\right)^2$'],
          `$$\\ell = g\\left(\\frac{T}{2\\pi}\\right)^2 = 9{,}81\\,\\mathrm{\\tfrac{m}{s^2}}\\cdot\\left(\\frac{${tgw(T, 's')}}{2\\pi}\\right)^2 = ${tg(l, 'm')}$$ Mit dieser Länge gerät das Pendel bei Gebäudeschwingungen in Resonanz – seine Dämpfer nehmen dann die Energie auf.`,
        ),
      ],
      werte: { T, l, f0 },
    };
  },
};

function resonanzAmp(r: number, z: number): number {
  return 1 / Math.sqrt((1 - r * r) ** 2 + (2 * z * r) ** 2);
}

const kurve: Generator = {
  id: 'rs-kurve',
  titel: 'Resonanzkurven lesen',
  art: 'diagramm',
  schwierigkeit: 2,
  quelle: 'Buch S. 175 (Abb. 4)',
  erzeuge(rng) {
    const f0 = rng.wahl([0.5, 0.8, 1, 1.5, 2, 2.5, 4]);
    const z = [0.08, 0.2, 0.5];
    const stile = rng.mische(['akzent', 'blau', 'gelb'] as const);
    const namen = ['Kurve 1', 'Kurve 2', 'Kurve 3'];
    const ordnung = rng.mische([0, 1, 2]);
    const fMax = f0 * 2.2;
    const kurven = ordnung.map((i, k) => ({ f: (f: number) => resonanzAmp(f / f0, z[i]), stil: stile[k], label: namen[k] }));
    const staerkste = ordnung.indexOf(2);
    const schwaechste = ordnung.indexOf(0);
    const frage = rng.chance(0.5) ? 'stark' : 'schwach';
    return {
      titel: 'Drei Dämpfungen',
      kontext: 'Ein Federpendel wird mit verschiedenen Anregungsfrequenzen angetrieben – dreimal mit unterschiedlich starker Dämpfung. Aufgetragen ist die Amplitude (relativ zur Erregeramplitude) gegen die Anregungsfrequenz.',
      plot: {
        x: [0, fMax],
        y: [0, 7],
        xLabel: 'f_a in Hz',
        yLabel: 'Amplitude (relativ)',
        xSchritt: f0 / 2,
        ySchritt: 1,
        xFein: f0 / 10,
        xNachkomma: (f0 / 2) % 1 === 0 ? 0 : (f0 / 2) * 10 % 1 === 0 ? 1 : 2,
        yNachkomma: 0,
        kurven,
      },
      teile: [
        teil('Lies die Eigenfrequenz $f_0$ des Pendels ab.', zahl(f0, 'Hz', [], 0.05), ['Die Eigenfrequenz liegt dort, wo die Amplitude maximal wird.', 'Am deutlichsten sieht man das an der höchsten, schmalsten Kurve.', 'Lies die Frequenz unter der Spitze ab.'], `Die Spitzen liegen bei $f_0 \\approx ${tw(f0)}\\,\\mathrm{Hz}$ (bei starker Dämpfung etwas darunter).`),
        teil(
          frage === 'stark' ? 'Welche Kurve gehört zur **stärksten** Dämpfung?' : 'Welche Kurve gehört zur **schwächsten** Dämpfung?',
          auswahl(namen, frage === 'stark' ? staerkste : schwaechste),
          ['Dämpfung entzieht Energie – die Amplitude bleibt kleiner.', frage === 'stark' ? 'Starke Dämpfung: niedrige, breite Kurve.' : 'Schwache Dämpfung: hohe, schmale Spitze.', 'Vergleiche die Höhe der Maxima.'],
          frage === 'stark' ? `Die niedrigste, breiteste Kurve (${namen[staerkste]}) gehört zur stärksten Dämpfung.` : `Die höchste, schmalste Kurve (${namen[schwaechste]}) gehört zur schwächsten Dämpfung.`,
        ),
      ],
      werte: { f0, staerkste, schwaechste },
    };
  },
};

const phase: Generator = {
  id: 'rs-phase',
  titel: 'Phase und Amplitude bei verschiedenen Anregungen',
  art: 'rechnen',
  schwierigkeit: 1,
  quelle: 'Buch S. 175, 177 (Versuch A)',
  erzeuge(rng) {
    const l = rng.zahl(0.3, 1.5, 0.05);
    const T0 = 2 * Math.PI * Math.sqrt(l / G);
    const f0 = 1 / T0;
    const lage = rng.wahl(['unten', 'gleich', 'oben'] as const);
    const fa = lage === 'unten' ? f0 * rng.zahl(0.2, 0.4, 0.05) : lage === 'gleich' ? f0 : f0 * rng.zahl(2.5, 4, 0.1);
    const bpm = Math.round(fa * 60 * 2) / 2;
    const richtig = lage === 'unten' ? 0 : lage === 'gleich' ? 1 : 2;
    return {
      titel: 'Pendel am Metronom',
      kontext: `Ein Fadenpendel der Länge ${g('\\ell', l, 'm')} hängt an deiner Hand. Du bewegst die Hand im Takt eines Metronoms mit ${tw(bpm)} Schlägen pro Minute hin und her (ein Schlag = eine ganze Hin-und-her-Bewegung).`,
      teile: [
        teil('Berechne die Eigenfrequenz des Pendels.', zahl(f0, 'Hz'), [gg('$\\ell$', '$f_0$', '$f_0 = \\frac{1}{2\\pi}\\sqrt{\\frac g\\ell}$'), 'Erst $T_0 = 2\\pi\\sqrt{\\ell/g}$, dann Kehrwert.', `$T_0 = ${tg(T0, 's', 4)}$`], `$$f_0 = \\frac{1}{T_0} = ${tg(f0, 'Hz')}$$`),
        teil(
          'Wie verhält sich das Pendel?',
          auswahl(['kleine Amplitude, im Takt mit der Hand (Δφ ≈ 0)', 'große Amplitude, eine Viertelschwingung hinterher (Δφ ≈ π/2)', 'kleine Amplitude, im Gegentakt (Δφ ≈ π)'], richtig),
          [`Rechne die Anregungsfrequenz aus: $f_a = \\frac{${tw(bpm)}}{60\\,\\mathrm s} = ${tz(bpm / 60, 3)}\\,\\mathrm{Hz}$.`, 'Vergleiche $f_a$ mit $f_0$.', 'Weit darunter: im Takt. Gleich: Resonanz. Weit darüber: Gegentakt.'],
          `$f_a = ${tz(bpm / 60, 3)}\\,\\mathrm{Hz}$ ist ${lage === 'unten' ? 'deutlich **kleiner** als $f_0$ → kleine Amplitude, im Takt' : lage === 'gleich' ? 'gleich $f_0$ → **Resonanz**: große Amplitude, $\\Delta\\varphi = \\frac\\pi2$' : 'deutlich **größer** als $f_0$ → kleine Amplitude, Gegentakt'}.`,
        ),
      ],
      werte: { f0, fa, richtig },
    };
  },
};

export const generatoren: Generator[] = [fahrzeug, tilger, phase, kurve];
