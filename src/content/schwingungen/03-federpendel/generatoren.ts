import { g, te, tg, tgw, tw, tz } from '../../../lib/format';
import { federnParallel, federnReihe, G, masseAusPeriode, periodeFeder } from '../../../lib/physik';
import { gg, teil, zahl } from '../../helfer';
import type { Generator } from '../../types';

const masseText = (m: number, inGramm: boolean) => (inGramm ? g('m', m * 1000, 'g') : g('m', m, 'kg'));

const periode: Generator = {
  id: 'fe-periode',
  titel: 'T, f und ω eines Federpendels',
  art: 'rechnen',
  schwierigkeit: 1,
  quelle: 'Buch S. 163',
  klausur: true,
  erzeuge(rng) {
    const inGramm = rng.chance(0.5);
    const m = inGramm ? rng.zahl(0.05, 0.9, 0.01) : rng.zahl(0.2, 3, 0.1);
    const D = rng.zahl(8, 150, 1);
    const T = periodeFeder(m, D);
    const f = 1 / T;
    const w = Math.sqrt(D / m);
    const koerper = rng.wahl(['Ein Metallzylinder', 'Ein Massestück', 'Eine Kugel', 'Ein Holzklotz']);
    const mTex = `${tw(m)}\\,\\mathrm{kg}`;
    return {
      titel: 'Federpendel',
      kontext: `${koerper} der Masse ${masseText(m, inGramm)} hängt an einer Schraubenfeder mit ${g('D', D, 'N/m')}. Er wird ausgelenkt und losgelassen.`,
      teile: [
        teil(
          'Berechne die Periodendauer $T$.',
          zahl(T, 's', [
            { wert: 2 * Math.PI * Math.sqrt(D / m), hinweis: 'Unter der Wurzel steht $\\frac{m}{D}$, nicht $\\frac{D}{m}$.' },
            { wert: Math.sqrt(m / D), hinweis: 'Der Faktor $2\\pi$ fehlt.' },
            ...(inGramm ? [{ wert: periodeFeder(m * 1000, D), hinweis: 'Die Masse muss in kg eingesetzt werden.' }] : []),
          ]),
          [
            gg(`$m = ${mTex}$, $D = ${tgw(D, 'N/m')}$`, '$T$', '$T = 2\\pi\\sqrt{\\frac{m}{D}}$'),
            `Setze $m$ in **kg** und $D$ in **N/m** ein. Die Einheit unter der Wurzel ist $\\frac{\\mathrm{kg}}{\\mathrm{N/m}} = \\mathrm{s^2}$.`,
            `$\\frac{m}{D} = ${tz(m / D, 3)}\\,\\mathrm{s^2}$, also $\\sqrt{\\frac{m}{D}} = ${tg(Math.sqrt(m / D), 's')}$.`,
          ],
          `$$T = 2\\pi\\sqrt{\\frac{m}{D}} = 2\\pi\\sqrt{\\frac{${mTex}}{${tgw(D, 'N/m')}}} = ${tg(T, 's')}$$`,
        ),
        teil(
          'Berechne die Frequenz $f$.',
          zahl(f, 'Hz', [{ wert: w, hinweis: 'Das ist die Kreisfrequenz $\\omega$. Die Frequenz ist $f = \\frac1T$.' }]),
          [gg(`$T = ${tg(T, 's')}$`, '$f$', '$f = \\frac{1}{T}$'), 'Die Frequenz ist der Kehrwert der Periodendauer.', `$f = \\frac{1}{${tz(T)}\\,\\mathrm{s}}$`],
          `$$f = \\frac{1}{T} = \\frac{1}{${tg(T, 's')}} = ${tg(f, 'Hz')}$$`,
        ),
        teil(
          'Berechne die Kreisfrequenz $\\omega$.',
          zahl(w, '1/s', [{ wert: f, hinweis: 'Das ist die Frequenz $f$. Für $\\omega$ fehlt der Faktor $2\\pi$.' }]),
          [
            gg(`$T = ${tg(T, 's')}$ (oder $m$ und $D$)`, '$\\omega$', '$\\omega = \\frac{2\\pi}{T} = 2\\pi f$'),
            'Alternativ direkt: $\\omega = \\sqrt{\\frac{D}{m}}$.',
            `$\\omega = 2\\pi\\cdot ${tg(f, 'Hz')}$`,
          ],
          `$$\\omega = \\frac{2\\pi}{T} = \\sqrt{\\frac{D}{m}} = ${tg(w, '1/s')}$$`,
        ),
      ],
      werte: { m, D, T, f, w },
    };
  },
};

const dMessung: Generator = {
  id: 'fe-d-messung',
  titel: 'Federkonstante aus einer Messung',
  art: 'rechnen',
  schwierigkeit: 1,
  quelle: 'Buch S. 159 Aufg. 1; S. 155 Versuch B',
  klausur: true,
  erzeuge(rng) {
    const mitKraft = rng.chance(0.4);
    const ds = rng.zahl(0.02, 0.25, 0.005);
    let F: number;
    let m: number;
    if (mitKraft) {
      F = rng.zahl(0.5, 15, 0.5);
      m = rng.zahl(0.1, 1.2, 0.05);
    } else {
      m = rng.zahl(0.05, 0.8, 0.01);
      F = m * G;
    }
    const D = F / ds;
    const T = periodeFeder(m, D);
    const kontext = mitKraft
      ? `Eine Schraubenfeder wird mit einem Kraftmesser gezogen. Bei der Kraft ${g('F', F, 'N')} ist sie um ${g('\\Delta s', ds * 100, 'cm')} länger als im entspannten Zustand. Danach hängt man einen Körper mit ${g('m', m, 'kg')} daran und lässt ihn schwingen.`
      : `Hängt man an eine Schraubenfeder ein Massestück mit ${g('m', m * 1000, 'g')}, verlängert sie sich im Ruhezustand um ${g('\\Delta s', ds * 100, 'cm')}. Anschließend wird das Massestück angestoßen und schwingt.`;
    const Ftext = mitKraft ? `F = ${tgw(F, 'N')}` : `F_G = m\\cdot g = ${tw(m)}\\,\\mathrm{kg}\\cdot 9{,}81\\,\\mathrm{\\tfrac{m}{s^2}} = ${tg(F, 'N')}`;
    return {
      titel: 'Feder ausmessen',
      kontext,
      teile: [
        teil(
          'Bestimme die Federkonstante $D$.',
          zahl(D, 'N/m', [
            { wert: F / (ds * 100), hinweis: 'Die Dehnung muss in **m** eingesetzt werden, nicht in cm.' },
            ...(mitKraft ? [] : [{ wert: m / ds, hinweis: 'Die Kraft ist die Gewichtskraft $m\\cdot g$ – nicht die Masse.' }]),
          ]),
          [
            gg(mitKraft ? `$F$, $\\Delta s = ${tw(ds)}\\,\\mathrm{m}$` : `$m = ${tw(m)}\\,\\mathrm{kg}$, $\\Delta s = ${tw(ds)}\\,\\mathrm{m}$`, '$D$', '$D = \\frac{F}{\\Delta s}$'),
            mitKraft ? 'Die Federkraft ist im Gleichgewicht genauso groß wie die Zugkraft.' : 'Im Ruhezustand hält die Federkraft der Gewichtskraft $F_G = m\\cdot g$ die Waage.',
            `$${Ftext}$`,
          ],
          `$$D = \\frac{F}{\\Delta s} = \\frac{${tg(F, 'N')}}{${tw(ds)}\\,\\mathrm{m}} = ${tg(D, 'N/m')}$$`,
        ),
        teil(
          'Berechne die Periodendauer der Schwingung.',
          zahl(T, 's'),
          [
            gg(`$D = ${tg(D, 'N/m')}$, $m = ${tw(m)}\\,\\mathrm{kg}$`, '$T$', '$T = 2\\pi\\sqrt{\\frac{m}{D}}$'),
            'Nimm dein (ungerundetes) $D$ aus Teil a.',
            `$\\sqrt{\\frac{m}{D}} = ${tg(Math.sqrt(m / D), 's')}$`,
          ],
          `$$T = 2\\pi\\sqrt{\\frac{${tw(m)}\\,\\mathrm{kg}}{${tg(D, 'N/m')}}} = ${tg(T, 's')}$$` +
            (mitKraft ? '' : `\n\nAbkürzung: $\\frac{m}{D} = \\frac{\\Delta s}{g}$, also $T = 2\\pi\\sqrt{\\frac{\\Delta s}{g}}$ – die Masse muss man gar nicht kennen.`),
        ),
      ],
      werte: { F, ds, D, m, T },
    };
  },
};

const astronaut: Generator = {
  id: 'fe-astronaut',
  titel: 'Masse aus der Periodendauer (Astronautenwaage)',
  art: 'rechnen',
  schwierigkeit: 2,
  quelle: 'Buch S. 162–163',
  klausur: true,
  erzeuge(rng) {
    const D = rng.zahl(300, 900, 10);
    const mStuhl = rng.zahl(8, 20, 0.5);
    const mPerson = rng.zahl(48, 95, 0.5);
    const T = periodeFeder(mStuhl + mPerson, D);
    const Tr = Number(T.toFixed(2));
    const mGes = masseAusPeriode(Tr, D);
    const mP = mGes - mStuhl;
    const wer = rng.wahl(['Eine Astronautin', 'Ein Astronaut', 'Eine Kosmonautin', 'Ein Raumfahrer']);
    return {
      titel: 'Wiegen ohne Gewicht',
      kontext: `${wer} setzt sich in der Raumstation in eine Astronautenwaage: einen Sitz, der zwischen Federn mit der resultierenden Federkonstante ${g('D', D, 'N/m')} schwingt. Die gemessene Periodendauer ist ${g('T', Tr, 's')}. Sitz und bewegliche Teile haben zusammen ${g('m_S', mStuhl, 'kg')}.`,
      teile: [
        teil(
          'Berechne die gesamte schwingende Masse.',
          zahl(mGes, 'kg'),
          [
            gg(`$D$, $T$`, '$m$', '$T = 2\\pi\\sqrt{\\frac{m}{D}}$ nach $m$ umstellen'),
            'Quadrieren: $T^2 = 4\\pi^2\\frac{m}{D}$, also $m = \\frac{D\\,T^2}{4\\pi^2}$.',
            `$T^2 = ${tz(Tr * Tr, 4)}\\,\\mathrm{s^2}$`,
          ],
          `$$m = \\frac{D\\cdot T^2}{4\\pi^2} = \\frac{${tgw(D, 'N/m')}\\cdot(${tgw(Tr, 's')})^2}{4\\pi^2} = ${tg(mGes, 'kg')}$$`,
        ),
        teil(
          'Wie groß ist die Masse der Person?',
          zahl(mP, 'kg', [{ wert: mGes, hinweis: 'Die Masse des Sitzes schwingt mit – sie muss noch abgezogen werden.' }]),
          [gg(`$m = ${tg(mGes, 'kg')}$, $m_S = ${tgw(mStuhl, 'kg')}$`, '$m_P$'), 'Sitz und Person schwingen gemeinsam.', '$m_P = m - m_S$'],
          `$$m_P = ${tg(mGes, 'kg')} - ${tgw(mStuhl, 'kg')} = ${tg(mP, 'kg')}$$\n\nIm All funktioniert das, weil nur die **Trägheit** der Masse zählt, nicht ihre Gewichtskraft.`,
        ),
      ],
      werte: { D, T: Tr, mGes, mP, mStuhl },
    };
  },
};

const kombination: Generator = {
  id: 'fe-kombination',
  titel: 'Zwei Federn: nebeneinander oder hintereinander',
  art: 'rechnen',
  schwierigkeit: 2,
  quelle: 'Buch S. 161 (Material B), S. 166 (Material A); Übungsklausur (Aufgabentyp)',
  klausur: true,
  erzeuge(rng) {
    const reihe = rng.chance(0.5);
    const D1 = rng.zahl(6, 70, 1);
    let D2 = rng.zahl(6, 70, 1);
    if (D2 === D1) D2 += 4;
    const m = rng.zahl(0.08, 0.9, 0.01);
    const D = reihe ? federnReihe(D1, D2) : federnParallel(D1, D2);
    const T = periodeFeder(m, D);
    const falsch = reihe ? federnParallel(D1, D2) : federnReihe(D1, D2);
    const kontext = reihe
      ? rng.wahl([
          `An einer Zimmerdecke hängen zwei Schraubenfedern **hintereinander**: oben eine mit ${g('D_1', D1, 'N/m')}, darunter eine mit ${g('D_2', D2, 'N/m')}. Unten hängt eine Kugel mit ${g('m', m * 1000, 'g')}.`,
          `Für ein Mobile werden zwei Federn **aneinandergehängt** (${g('D_1', D1, 'N/m')} und ${g('D_2', D2, 'N/m')}). Am unteren Ende hängt eine Figur mit ${g('m', m * 1000, 'g')}.`,
        ])
      : rng.wahl([
          `Ein Rollwagen mit ${g('m', m * 1000, 'g')} ist auf einer waagerechten Schiene **zwischen zwei gespannten Federn** eingespannt: links ${g('D_1', D1, 'N/m')}, rechts ${g('D_2', D2, 'N/m')}. Reibung ist vernachlässigbar.`,
          `Eine Lampe mit ${g('m', m * 1000, 'g')} hängt an zwei **nebeneinander** befestigten Federn mit ${g('D_1', D1, 'N/m')} und ${g('D_2', D2, 'N/m')}, die sich die Last teilen.`,
        ]);
    return {
      titel: reihe ? 'Federn in Reihe' : 'Federn parallel',
      kontext,
      teile: [
        teil(
          'Berechne die Federkonstante $D$ der Anordnung.',
          zahl(D, 'N/m', [{ wert: falsch, hinweis: reihe ? 'Das wäre die Formel für Federn **nebeneinander**. Hintereinander wird die Anordnung weicher.' : 'Das wäre die Formel für Federn **hintereinander**. Hier ziehen beide Federn gemeinsam zurück.' }]),
          [
            gg(`$D_1 = ${tgw(D1, 'N/m')}$, $D_2 = ${tgw(D2, 'N/m')}$`, '$D$', reihe ? '$\\frac1D = \\frac1{D_1}+\\frac1{D_2}$' : '$D = D_1 + D_2$'),
            reihe ? 'Hintereinander: beide Federn tragen dieselbe Kraft, die Dehnungen addieren sich.' : 'Bei einer Auslenkung wirken beide Federn zurück, ihre Rückstellkräfte addieren sich.',
            reihe ? `$\\frac1D = ${tz(1 / D1 + 1 / D2, 3)}\\,\\mathrm{m/N}$` : `$D = ${tw(D1)} + ${tw(D2)}$ (in N/m)`,
          ],
          reihe
            ? `$$D = \\frac{D_1\\cdot D_2}{D_1 + D_2} = \\frac{${tw(D1)}\\cdot ${tw(D2)}}{${tw(D1)} + ${tw(D2)}}\\,\\mathrm{\\tfrac{N}{m}} = ${tg(D, 'N/m')}$$\n\nDie Kombination ist weicher als jede einzelne Feder.`
            : `$$D = D_1 + D_2 = ${tg(D, 'N/m')}$$`,
        ),
        teil(
          'Berechne die Periodendauer.',
          zahl(T, 's', [{ wert: periodeFeder(m, falsch), hinweis: 'Prüfe dein $D$ aus Teil a – es gehört die andere Formel dazu.' }]),
          [gg(`$m = ${tw(m)}\\,\\mathrm{kg}$, $D = ${tg(D, 'N/m')}$`, '$T$', '$T = 2\\pi\\sqrt{\\frac mD}$'), 'Masse in kg umrechnen!', `$\\sqrt{\\frac mD} = ${tg(Math.sqrt(m / D), 's')}$`],
          `$$T = 2\\pi\\sqrt{\\frac{${tw(m)}\\,\\mathrm{kg}}{${tg(D, 'N/m')}}} = ${tg(T, 's')}$$` +
            (reihe ? '\n\nDie Gewichtskraft ändert $T$ nicht – sie verschiebt nur die Gleichgewichtslage.' : ''),
        ),
      ],
      werte: { D1, D2, D, m, T, reihe: reihe ? 1 : 0 },
    };
  },
};

const fahrzeug: Generator = {
  id: 'fe-fahrzeug',
  titel: 'Federung eines Fahrzeugs',
  art: 'rechnen',
  schwierigkeit: 2,
  quelle: 'Buch S. 159 Aufg. 2; S. 166 (Material A)',
  klausur: true,
  erzeuge(rng) {
    const fz = rng.wahl([
      { name: 'Ein Pferdeanhänger', last: 'ein Pferd', m0: [450, 700], dm: [450, 650] },
      { name: 'Ein Bootsanhänger', last: 'ein Boot', m0: [180, 320], dm: [250, 480] },
      { name: 'Ein Wohnwagen', last: 'Gepäck und Wasservorrat', m0: [900, 1300], dm: [150, 300] },
      { name: 'Ein kleiner Kipper', last: 'eine Ladung Sand', m0: [1200, 1800], dm: [800, 1500] },
    ]);
    const m0 = rng.zahl(fz.m0[0], fz.m0[1], 10);
    const dm = rng.zahl(fz.dm[0], fz.dm[1], 10);
    const dx = rng.zahl(0.02, 0.09, 0.005);
    const DF = (dm * G) / (2 * dx);
    const Dres = 2 * DF;
    const T = periodeFeder(m0 + dm, Dres);
    return {
      titel: 'Gefedertes Fahrzeug',
      kontext: `${fz.name} (Masse ohne Ladung ${g('m_0', m0, 'kg')}) ist über **zwei gleiche Schraubenfedern** mit der Achse verbunden. Lädt man ${fz.last} mit ${g('\\Delta m', dm, 'kg')} ein, sinkt der Aufbau um ${g('\\Delta x', dx * 100, 'cm')} ein.`,
      teile: [
        teil(
          'Berechne die Federkonstante **einer** Feder.',
          zahl(DF, 'N/m', [
            { wert: Dres, hinweis: 'Das ist die Federkonstante beider Federn zusammen. Gefragt ist eine Feder.' },
            { wert: dm / dx, hinweis: 'Die zusätzliche Kraft ist die Gewichtskraft $\\Delta m\\cdot g$.' },
          ]),
          [
            gg(`$\\Delta m = ${tgw(dm, 'kg')}$, $\\Delta x = ${tw(dx)}\\,\\mathrm{m}$`, '$D_\\text{Feder}$', '$D_\\text{res} = \\frac{\\Delta m\\cdot g}{\\Delta x}$ und $D_\\text{res} = 2D_\\text{Feder}$'),
            'Beide Federn teilen sich die zusätzliche Gewichtskraft – sie sind nebeneinander (parallel).',
            `$\\Delta m\\cdot g = ${tg(dm * G, 'N')}$, $D_\\text{res} = ${tg(Dres, 'N/m')}$`,
          ],
          `$$D_\\text{res} = \\frac{\\Delta m\\cdot g}{\\Delta x} = \\frac{${tgw(dm, 'kg')}\\cdot 9{,}81\\,\\mathrm{\\tfrac{m}{s^2}}}{${tw(dx)}\\,\\mathrm{m}} = ${tg(Dres, 'N/m')}$$\n\n$$D_\\text{Feder} = \\frac{D_\\text{res}}{2} = ${tg(DF, 'N/m')}$$`,
        ),
        teil(
          'Der beladene Aufbau wird zu senkrechten Schwingungen angeregt. Berechne die Periodendauer.',
          zahl(T, 's', [
            { wert: periodeFeder(dm, Dres), hinweis: 'Es schwingt die **gesamte** Masse: Fahrzeug **und** Ladung.' },
            { wert: periodeFeder(m0 + dm, DF), hinweis: 'Beide Federn tragen – nimm $D_\\text{res} = 2D_\\text{Feder}$.' },
          ]),
          [
            gg(`$m = m_0 + \\Delta m = ${tgw(m0 + dm, 'kg')}$, $D_\\text{res}$`, '$T$', '$T = 2\\pi\\sqrt{\\frac{m}{D_\\text{res}}}$'),
            'Die schwingende Masse ist Fahrzeug plus Ladung, die Richtgröße kommt von beiden Federn.',
            `$\\frac{m}{D_\\text{res}} = ${tz((m0 + dm) / Dres, 3)}\\,\\mathrm{s^2}$`,
          ],
          `$$T = 2\\pi\\sqrt{\\frac{${tgw(m0 + dm, 'kg')}}{${tg(Dres, 'N/m')}}} = ${tg(T, 's')}$$`,
        ),
      ],
      werte: { m0, dm, dx, DF, Dres, T },
    };
  },
};

const vertikal: Generator = {
  id: 'fe-vertikal',
  titel: 'Senkrechtes Federpendel: T aus der Ruhedehnung',
  art: 'rechnen',
  schwierigkeit: 2,
  quelle: 'Buch S. 158; Notizen Lehrer 23.9.',
  erzeuge(rng) {
    const dl = rng.zahl(0.01, 0.3, 0.005);
    const T = 2 * Math.PI * Math.sqrt(dl / G);
    const m = rng.zahl(0.1, 2, 0.05);
    const D = (m * G) / dl;
    return {
      titel: 'Die Ruhelage verrät T',
      kontext: `Ein Körper mit ${g('m', m, 'kg')} wird vorsichtig an eine Schraubenfeder gehängt. In der neuen Ruhelage ist die Feder um ${g('\\Delta\\ell', dl * 100, 'cm')} länger als vorher. Dann wird er angestoßen.`,
      teile: [
        teil(
          'Berechne die Federkonstante.',
          zahl(D, 'N/m', [{ wert: (m * G) / (dl * 100), hinweis: '$\\Delta\\ell$ in Meter umrechnen.' }]),
          [gg(`$m$, $\\Delta\\ell = ${tw(dl)}\\,\\mathrm{m}$`, '$D$', '$m\\cdot g = D\\cdot \\Delta\\ell$'), 'In der Ruhelage gleichen sich Gewichtskraft und Federkraft aus.', `$m\\cdot g = ${tg(m * G, 'N')}$`],
          `$$D = \\frac{m\\cdot g}{\\Delta\\ell} = \\frac{${tg(m * G, 'N')}}{${tw(dl)}\\,\\mathrm{m}} = ${tg(D, 'N/m')}$$`,
        ),
        teil(
          'Berechne die Periodendauer der Schwingung um die neue Ruhelage.',
          zahl(T, 's'),
          [gg(`$m$, $D = ${tg(D, 'N/m')}$`, '$T$', '$T = 2\\pi\\sqrt{\\frac mD}$'), 'Um die neue Ruhelage gilt wieder $F_R = -D\\cdot s$ – die Gewichtskraft spielt keine Rolle mehr.', `$\\frac{m}{D} = \\frac{\\Delta\\ell}{g} = ${tz(dl / G, 3)}\\,\\mathrm{s^2}$`],
          `$$T = 2\\pi\\sqrt{\\frac{m}{D}} = 2\\pi\\sqrt{\\frac{\\Delta\\ell}{g}} = ${tg(T, 's')}$$\n\nSpannend: $T$ hängt nur von der Ruhedehnung ab. Ein schwerer Körper an einer harten Feder mit gleicher Dehnung schwingt genauso schnell.`,
        ),
      ],
      werte: { m, dl, D, T },
    };
  },
};

const kennlinie: Generator = {
  id: 'fe-kennlinie',
  titel: 'Federkonstante aus dem F-s-Diagramm',
  art: 'diagramm',
  schwierigkeit: 1,
  quelle: 'Buch S. 158 (Abb. 2), S. 161 (Material B)',
  erzeuge(rng) {
    const D = rng.wahl([10, 15, 20, 25, 30, 40, 50, 60, 80]);
    const sMax = rng.wahl([0.1, 0.15, 0.2]);
    const Fmax = D * sMax;
    const yGrenze = Math.ceil((Fmax * 1.1) / (Fmax > 6 ? 2 : 1)) * (Fmax > 6 ? 2 : 1);
    const m = rng.zahl(0.1, 0.8, 0.05);
    const T = periodeFeder(m, D);
    const punkte = Array.from({ length: 9 }, (_, i) => {
      const s = -sMax + (2 * sMax * i) / 8;
      return { x: s * 100, y: -D * s * (1 + (rng.next() - 0.5) * 0.04) };
    });
    return {
      titel: 'Kennlinie auswerten',
      kontext: 'Für eine Feder wurde die Rückstellkraft $F_R$ in Abhängigkeit von der Auslenkung $s$ gemessen (Kreuze) und eine Ausgleichsgerade eingezeichnet.',
      plot: {
        x: [-sMax * 100 * 1.1, sMax * 100 * 1.1],
        y: [-yGrenze, yGrenze],
        xLabel: 's in cm',
        yLabel: 'F_R in N',
        xSchritt: sMax === 0.15 ? 5 : 5,
        ySchritt: yGrenze / 4,
        xFein: 1,
        yFein: yGrenze / 20,
        kurven: [{ f: (x) => -D * (x / 100), stil: 'akzent' }],
        punkte,
      },
      teile: [
        teil(
          'Lies die Federkonstante $D$ ab.',
          zahl(D, 'N/m', [
            { wert: D / 100, hinweis: 'Achte auf die Einheit: $s$ ist in cm angegeben, $D$ in N/m.' },
            { wert: -D, hinweis: '$D$ ist positiv – das Minus steckt schon im Gesetz $F_R = -D\\cdot s$.' },
          ]),
          [
            gg('Ausgleichsgerade im $F_R$-$s$-Diagramm', '$D$', '$D = -\\frac{F_R}{s}$ (Betrag der Steigung)'),
            'Lies an einer gut ablesbaren Stelle, z. B. am Rand, ein Wertepaar $(s\\,|\\,F_R)$ auf der Geraden ab.',
            `Bei $s = ${tw(sMax * 100)}\\,\\mathrm{cm}$ ist $F_R \\approx ${tw(-Fmax)}\\,\\mathrm{N}$.`,
          ],
          `$$D = -\\frac{F_R}{s} = -\\frac{${tw(-Fmax)}\\,\\mathrm{N}}{${tw(sMax)}\\,\\mathrm{m}} = ${tg(D, 'N/m', 2)}$$\n\nDie Gerade geht durch den Ursprung und fällt: lineares Kraftgesetz.`,
        ),
        teil(
          `Ein Körper mit ${g('m', m * 1000, 'g')} schwingt an dieser Feder. Berechne die Periodendauer.`,
          zahl(T, 's'),
          [gg(`$D = ${tw(D)}\\,\\mathrm{N/m}$, $m = ${tw(m)}\\,\\mathrm{kg}$`, '$T$', '$T = 2\\pi\\sqrt{\\frac mD}$'), 'Masse in kg.', `$\\sqrt{\\frac{m}{D}} = ${tg(Math.sqrt(m / D), 's')}$`],
          `$$T = 2\\pi\\sqrt{\\frac{${tw(m)}\\,\\mathrm{kg}}{${tw(D)}\\,${te('N/m')}}} = ${tg(T, 's')}$$`,
        ),
      ],
      werte: { D, m, T },
    };
  },
};

export const generatoren: Generator[] = [periode, dMessung, kombination, vertikal, fahrzeug, astronaut, kennlinie];
