import { g, tg, tw, tz } from '../../../lib/format';
import { eintauchtiefe, G, periodeURohr, richtgroesseBoje, richtgroesseURohr } from '../../../lib/physik';
import { auswahl, gg, mischeOptionen, teil, zahl } from '../../helfer';
import type { Generator } from '../../types';

const erkennen: Generator = {
  id: 'dgl-erkennen',
  titel: 'ω und T direkt aus einer DGL ablesen',
  art: 'rechnen',
  schwierigkeit: 1,
  quelle: 'Buch S. 165 (Methode)',
  klausur: true,
  erzeuge(rng) {
    const form = rng.wahl(['k', 'mD', 'null'] as const);
    let k: number;
    let dglTex: string;
    let hilfe: string;
    if (form === 'mD') {
      const m = rng.zahl(0.1, 2, 0.1);
      const D = rng.zahl(5, 300, 5);
      k = D / m;
      dglTex = `${tw(m)}\\,\\mathrm{kg}\\cdot\\ddot s(t) = -${tw(D)}\\,\\mathrm{\\tfrac Nm}\\cdot s(t)`;
      hilfe = `Erst durch $${tw(m)}\\,\\mathrm{kg}$ teilen: $\\ddot s = -${tz(k, 4)}\\,\\mathrm{\\tfrac1{s^2}}\\cdot s$.`;
    } else {
      k = rng.zahl(2, 400, 1);
      dglTex = form === 'k' ? `\\ddot x(t) = -${tw(k)}\\,\\mathrm{\\tfrac{1}{s^2}}\\cdot x(t)` : `\\ddot y(t) + ${tw(k)}\\,\\mathrm{\\tfrac{1}{s^2}}\\cdot y(t) = 0`;
      hilfe = form === 'null' ? 'Bring den zweiten Summanden auf die rechte Seite: $\\ddot y = -k\\cdot y$.' : 'Die Zahl vor $x(t)$ ist $\\omega^2$.';
    }
    const w = Math.sqrt(k);
    const T = (2 * Math.PI) / w;
    return {
      titel: 'DGL lesen',
      kontext: `Für ein schwingungsfähiges System wurde die Differenzialgleichung $$${dglTex}$$ aufgestellt.`,
      teile: [
        teil(
          'Wie groß ist die Kreisfrequenz $\\omega$?',
          zahl(w, '1/s', [{ wert: k, hinweis: 'Das ist $\\omega^2$. Zieh noch die Wurzel.' }]),
          [gg('die DGL', '$\\omega$', 'Vergleich mit $\\ddot y = -\\omega^2\\, y$'), hilfe, `$\\omega^2 = ${tz(k, 4)}\\,\\mathrm{\\tfrac1{s^2}}$`],
          `Vergleich mit $\\ddot y = -\\omega^2 y$: $\\omega^2 = ${tz(k, 4)}\\,\\mathrm{\\tfrac1{s^2}}$, also $$\\omega = ${tg(w, '1/s')}$$`,
        ),
        teil(
          'Wie groß ist die Periodendauer?',
          zahl(T, 's', [{ wert: (2 * Math.PI) / k, hinweis: 'Mit $\\omega$ rechnen, nicht mit $\\omega^2$.' }]),
          [gg('$\\omega$', '$T$', '$T = \\frac{2\\pi}{\\omega}$'), 'Nimm $\\omega$ aus Teil a.', `$\\omega = ${tz(w, 4)}\\,\\mathrm{\\tfrac1s}$`],
          `$$T = \\frac{2\\pi}{\\omega} = ${tg(T, 's')}$$`,
        ),
      ],
      werte: { k, w, T },
    };
  },
};

const loesungWaehlen: Generator = {
  id: 'dgl-loesung-waehlen',
  titel: 'Passende Lösungsfunktion zur DGL',
  art: 'rechnen',
  schwierigkeit: 2,
  quelle: 'Buch S. 163–165',
  erzeuge(rng) {
    const w = rng.int(2, 12);
    const k = w * w;
    const amp = rng.wahl([2, 3, 4, 5, 8]);
    const start = rng.wahl(['oben', 'ruhe'] as const);
    const f = start === 'oben' ? '\\cos' : '\\sin';
    const roh = [
      `$s(t) = ${amp}\\,\\mathrm{cm}\\cdot ${f}(${w}\\,\\tfrac1{\\mathrm s}\\cdot t)$`,
      `$s(t) = ${amp}\\,\\mathrm{cm}\\cdot ${f}(${k}\\,\\tfrac1{\\mathrm s}\\cdot t)$`,
      `$s(t) = ${amp}\\,\\mathrm{cm}\\cdot ${start === 'oben' ? '\\sin' : '\\cos'}(${w}\\,\\tfrac1{\\mathrm s}\\cdot t)$`,
      `$s(t) = ${k}\\,\\mathrm{cm}\\cdot ${f}(t)$`,
    ];
    const opt = mischeOptionen(roh, 0, rng.mische);
    return {
      titel: 'Welche Funktion passt?',
      kontext: `Ein Pendel gehorcht der DGL $\\ddot s(t) = -${k}\\,\\frac{1}{\\mathrm{s^2}}\\cdot s(t)$. Es startet bei $t = 0$ ${start === 'oben' ? 'im oberen Umkehrpunkt' : 'in der Ruhelage nach oben'}, die Amplitude ist $${amp}\\,\\mathrm{cm}$.`,
      teile: [
        teil(
          'Welche Funktion beschreibt die Bewegung?',
          auswahl(opt.optionen, opt.richtig),
          ['Vergleiche mit $\\ddot s = -\\omega^2 s$: Was ist $\\omega$?', `$\\omega = \\sqrt{${k}}\\,\\frac1{\\mathrm s}$. Dieser Wert gehört ins Argument.`, start === 'oben' ? 'Start im Umkehrpunkt → Kosinus.' : 'Start in der Ruhelage nach oben → Sinus.'],
          `$\\omega = \\sqrt{${k}}\\,\\frac1{\\mathrm s} = ${w}\\,\\frac1{\\mathrm s}$ und Start ${start === 'oben' ? 'oben → $\\cos$' : 'in der Ruhelage nach oben → $\\sin$'}:\n$$s(t) = ${amp}\\,\\mathrm{cm}\\cdot ${f}(${w}\\,\\tfrac1{\\mathrm s}\\cdot t)$$ Probe: zweimal ableiten bringt $-${w}^2 = -${k}$.`,
        ),
      ],
      werte: { w, k },
    };
  },
};

const FLUESSIG = [
  { name: 'Wasser', rho: 1000 },
  { name: 'Speiseöl', rho: 920 },
  { name: 'Glycerin', rho: 1260 },
  { name: 'Salzwasser', rho: 1030 },
];

const uRohr: Generator = {
  id: 'dgl-u-rohr',
  titel: 'Flüssigkeitssäule im U-Rohr',
  art: 'rechnen',
  schwierigkeit: 2,
  quelle: 'Buch S. 167 (Material C)',
  klausur: true,
  erzeuge(rng) {
    const fl = rng.wahl(FLUESSIG);
    let L = rng.zahl(0.3, 1.8, 0.05);
    let ampCm = rng.zahl(1, 8, 0.5);
    if (Math.abs(L - 0.6) < 1e-9 && Math.abs(ampCm - 4) < 1e-9) ampCm = 3.5;
    if (L < 0.35) L = 0.35;
    const dCm = rng.zahl(1, 3, 0.2);
    const A = Math.PI * (dCm / 200) ** 2;
    const D = richtgroesseURohr(fl.rho, A);
    const F = D * (ampCm / 100);
    const T = periodeURohr(L);
    const w = (2 * Math.PI) / T;
    const vmax = (ampCm / 100) * w;
    const wie = rng.wahl(['Durch kurzes Hineinpusten', 'Mit einem kleinen Kolben', 'Durch kurzes Ansaugen']);
    return {
      titel: 'Schaukelnde Säule',
      kontext: `Ein U-förmiger Schlauch (Innendurchmesser ${g('d', dCm, 'cm')}) enthält ${fl.name} ($\\rho = ${fl.rho}\\,\\mathrm{kg/m^3}$). Die Flüssigkeitssäule ist insgesamt ${g('\\ell', L * 100, 'cm')} lang. ${wie} wird der Spiegel auf einer Seite um ${g('\\hat s', ampCm, 'cm')} gegenüber der Ruhelage verschoben, dann überlässt man die Flüssigkeit sich selbst. Reibung wird vernachlässigt.`,
      teile: [
        teil(
          'Berechne den Betrag der Rückstellkraft im Moment des Loslassens.',
          zahl(F, 'N', [{ wert: F / 2, hinweis: 'Der Höhenunterschied zwischen den Spiegeln ist $2\\hat s$, nicht $\\hat s$.' }]),
          [
            gg(`$\\rho$, $d$, $\\hat s$`, '$F_R$', '$F_R = 2\\rho A g\\cdot s$ mit $A = \\pi\\left(\\frac d2\\right)^2$'),
            'Steigt eine Seite um $s$, sinkt die andere um $s$: Das überstehende Stück ist $2s$ hoch. Sein Gewicht ist die Rückstellkraft.',
            `$A = ${tz(A * 1e4, 3)}\\,\\mathrm{cm^2} = ${tz(A, 3)}\\,\\mathrm{m^2}$`,
          ],
          `$$A = \\pi\\left(\\frac{d}{2}\\right)^2 = ${tz(A, 3)}\\,\\mathrm{m^2}$$\n$$F_R = 2\\rho A g\\,\\hat s = 2\\cdot ${fl.rho}\\,\\mathrm{\\tfrac{kg}{m^3}}\\cdot ${tz(A, 3)}\\,\\mathrm{m^2}\\cdot 9{,}81\\,\\mathrm{\\tfrac{m}{s^2}}\\cdot ${tw(ampCm / 100)}\\,\\mathrm m = ${tg(F, 'N')}$$`,
        ),
        teil(
          'Berechne die Periodendauer der Schwingung.',
          zahl(T, 's', [
            { wert: 2 * Math.PI * Math.sqrt(L / G), hinweis: 'Die Rückstellkraft hat den Faktor 2 (Höhenunterschied $2s$): $T = 2\\pi\\sqrt{\\frac{\\ell}{2g}}$.' },
            { wert: 2 * Math.PI * Math.sqrt((fl.rho * A * 2 * (ampCm / 100)) / D), hinweis: 'Als Masse zählt die **ganze** Säule $m = \\rho A\\ell$, nicht nur das überstehende Stück.' },
          ]),
          [
            gg('$\\ell$', '$T$', 'DGL $\\ddot s = -\\frac{2g}{\\ell}\\,s$'),
            'Bewegte Masse $m = \\rho A\\ell$; aus $m\\ddot s = -2\\rho A g s$ kürzen sich $\\rho$ und $A$.',
            `$\\omega^2 = \\frac{2g}{\\ell} = ${tz((2 * G) / L, 4)}\\,\\mathrm{\\tfrac1{s^2}}$`,
          ],
          `$$\\rho A\\ell\\,\\ddot s = -2\\rho A g\\, s\\;\\Rightarrow\\;\\ddot s = -\\frac{2g}{\\ell}\\,s$$\n$$T = 2\\pi\\sqrt{\\frac{\\ell}{2g}} = 2\\pi\\sqrt{\\frac{${tw(L)}\\,\\mathrm m}{2\\cdot 9{,}81\\,\\mathrm{m/s^2}}} = ${tg(T, 's')}$$`,
        ),
        teil(
          'Berechne die maximale Geschwindigkeit der Flüssigkeit.',
          zahl(vmax, 'm/s', [{ wert: ampCm * w, hinweis: 'Amplitude in Meter umrechnen.' }]),
          [gg('$\\hat s$, $\\omega = \\frac{2\\pi}T$', '$\\hat v$', '$\\hat v = \\hat s\\,\\omega$'), 'Erst $\\omega$ aus $T$ bzw. $\\sqrt{2g/\\ell}$.', `$\\omega = ${tg(w, '1/s', 4)}$`],
          `$$\\hat v = \\hat s\\,\\omega = ${tw(ampCm / 100)}\\,\\mathrm m\\cdot ${tg(w, '1/s', 4)} = ${tg(vmax, 'm/s')}$$`,
        ),
      ],
      werte: { L, A, rho: fl.rho, D, F, T, w, vmax, amp: ampCm / 100 },
    };
  },
};

const boje: Generator = {
  id: 'dgl-boje',
  titel: 'Schwimmende Boje',
  art: 'rechnen',
  schwierigkeit: 3,
  quelle: 'Notizen Lehrer 5.10.',
  klausur: true,
  erzeuge(rng) {
    const wasser = rng.wahl([
      { name: 'in einem Badesee', rho: 1000 },
      { name: 'in der Nordsee', rho: 1025 },
      { name: 'in einem Hafenbecken mit Süßwasser', rho: 1000 },
    ]);
    const dCm = rng.zahl(20, 90, 5);
    const A = Math.PI * (dCm / 200) ** 2;
    // Masse so, dass die Eintauchtiefe sinnvoll ist (15 cm – 1 m)
    const h0Ziel = rng.zahl(0.15, 1, 0.01);
    const m = Math.round(wasser.rho * A * h0Ziel);
    const h0 = eintauchtiefe(m, wasser.rho, A);
    const ampCm = rng.zahl(3, Math.min(15, h0 * 100 * 0.6), 1);
    const D = richtgroesseBoje(wasser.rho, A);
    const w = Math.sqrt(D / m);
    const T = (2 * Math.PI) / w;
    const vmax = (ampCm / 100) * w;
    const amax = (ampCm / 100) * w * w;
    const wer = rng.wahl(['Eine Schwimmerin', 'Ein Taucher', 'Ein Junge auf einem SUP-Board', 'Eine Welle']);
    return {
      titel: 'Auf und ab im Wasser',
      kontext: `Eine zylindrische Boje (Durchmesser ${g('d', dCm, 'cm')}, Masse ${g('m', m, 'kg')}) schwimmt aufrecht ${wasser.name} ($\\rho = ${wasser.rho}\\,\\mathrm{kg/m^3}$). ${wer} drückt sie um ${g('\\hat s', ampCm, 'cm')} tiefer ins Wasser, dann wird sie losgelassen. Reibung wird vernachlässigt; nach oben positiv.`,
      teile: [
        teil(
          'Wie tief ist die Boje im Gleichgewicht eingetaucht?',
          zahl(h0, 'cm', [{ wert: m / (wasser.rho * Math.PI * (dCm / 100) ** 2), hinweis: 'Für die Fläche brauchst du den **Radius** $r = \\frac d2$.' }]),
          [
            gg(`$m$, $d$, $\\rho$`, '$h_0$', '$F_G = F_A$: $m g = \\rho A h_0 g$'),
            'Die verdrängte Wassermasse $\\rho A h_0$ ist genauso groß wie die Masse der Boje.',
            `$A = \\pi r^2 = ${tz(A, 3)}\\,\\mathrm{m^2}$`,
          ],
          `$$m = \\rho A h_0\\;\\Rightarrow\\; h_0 = \\frac{m}{\\rho A} = \\frac{${m}\\,\\mathrm{kg}}{${wasser.rho}\\,\\mathrm{\\tfrac{kg}{m^3}}\\cdot ${tz(A, 3)}\\,\\mathrm{m^2}} = ${tg(h0 * 100, 'cm')}$$`,
        ),
        teil(
          'Berechne die Kreisfrequenz $\\omega_0$ der Schwingung.',
          zahl(w, '1/s', [{ wert: Math.sqrt((D + m * G) / m), hinweis: 'Die Gewichtskraft wird im Gleichgewicht schon vom Grundauftrieb ausgeglichen. Rückstellend wirkt nur $\\rho g A\\cdot s$.' }]),
          [
            gg('$\\rho$, $A$, $m$', '$\\omega_0$', 'DGL $m\\ddot s = -\\rho g A\\, s$'),
            'Nur der **zusätzliche** Auftrieb wirkt zurück: $D = \\rho g A$.',
            `$D = ${tg(D, 'N/m')}$`,
          ],
          `Rückstellkraft $F_R = -\\rho g A\\, s$, also $D = \\rho g A = ${tg(D, 'N/m')}$ und $$\\ddot s = -\\frac{\\rho g A}{m}\\, s\\;\\Rightarrow\\;\\omega_0 = \\sqrt{\\frac{${tz(D, 4)}\\,\\mathrm{N/m}}{${m}\\,\\mathrm{kg}}} = ${tg(w, '1/s')}$$ Kontrolle: $\\sqrt{g/h_0}$ ergibt dasselbe.`,
        ),
        teil(
          'Berechne die Periodendauer.',
          zahl(T, 's'),
          [gg('$\\omega_0$', '$T$', '$T = \\frac{2\\pi}{\\omega_0}$'), 'Ganz normal aus der Kreisfrequenz.', `$\\omega_0 = ${tz(w, 4)}\\,\\mathrm{\\tfrac1s}$`],
          `$$T = \\frac{2\\pi}{\\omega_0} = ${tg(T, 's')}$$`,
        ),
        teil(
          'Berechne die maximale Geschwindigkeit der Boje.',
          zahl(vmax, 'm/s', [{ wert: ampCm * w, hinweis: 'Amplitude in Meter.' }, { wert: h0 * w, hinweis: 'Die Amplitude ist die Strecke, um die die Boje heruntergedrückt wurde – nicht die Eintauchtiefe.' }]),
          [gg('$\\hat s$, $\\omega_0$', '$\\hat v$', '$\\hat v = \\hat s\\,\\omega_0$'), 'Die Boje startet im unteren Umkehrpunkt: $s(t) = -\\hat s\\cos(\\omega_0 t)$. Ableiten!', `$v(t) = \\hat s\\,\\omega_0\\sin(\\omega_0 t)$`],
          `$$s(t) = -\\hat s\\cos(\\omega_0 t)\\;\\Rightarrow\\; v(t) = \\hat s\\,\\omega_0\\sin(\\omega_0 t)$$\n$$\\hat v = \\hat s\\,\\omega_0 = ${tw(ampCm / 100)}\\,\\mathrm m\\cdot ${tg(w, '1/s', 4)} = ${tg(vmax, 'm/s')}$$`,
        ),
        teil(
          'Berechne die maximale Beschleunigung der Boje.',
          zahl(amax, 'm/s^2'),
          [gg('$\\hat s$, $\\omega_0$', '$\\hat a$', '$\\hat a = \\hat s\\,\\omega_0^2$'), 'Noch einmal ableiten bringt noch ein $\\omega_0$.', `$\\omega_0^2 = ${tz(w * w, 4)}\\,\\mathrm{\\tfrac1{s^2}}$`],
          `$$\\hat a = \\hat s\\,\\omega_0^2 = ${tg(amax, 'm/s^2')}$$`,
        ),
      ],
      werte: { m, A, rho: wasser.rho, h0, D, w, T, vmax, amax, amp: ampCm / 100 },
    };
  },
};

const klotz: Generator = {
  id: 'dgl-klotz',
  titel: 'Schwimmender Holzklotz',
  art: 'rechnen',
  schwierigkeit: 2,
  quelle: 'Notizen Lehrer 5.10. (Boje, abgewandelt)',
  erzeuge(rng) {
    const holz = rng.wahl([
      { name: 'Fichtenholz', rho: 470 },
      { name: 'Eichenholz', rho: 720 },
      { name: 'Kiefernholz', rho: 520 },
      { name: 'Balsaholz', rho: 160 },
    ]);
    const aCm = rng.zahl(5, 30, 1);
    const h0 = (holz.rho / 1000) * (aCm / 100);
    const T = 2 * Math.PI * Math.sqrt(h0 / G);
    return {
      titel: 'Ein Würfel im Wasser',
      kontext: `Ein Würfel aus ${holz.name} ($\\rho_H = ${holz.rho}\\,\\mathrm{kg/m^3}$, Kantenlänge ${g('a', aCm, 'cm')}) schwimmt in Wasser ($\\rho_W = 1000\\,\\mathrm{kg/m^3}$). Er wird leicht angestoßen und schwingt senkrecht.`,
      teile: [
        teil(
          'Wie tief taucht der Würfel im Gleichgewicht ein?',
          zahl(h0, 'cm', [{ wert: (aCm / 100) * (1 - holz.rho / 1000), hinweis: 'Das ist der Teil, der **herausschaut**.' }]),
          [gg('$\\rho_H$, $\\rho_W$, $a$', '$h_0$', '$F_G = F_A$: $\\rho_H a^3 g = \\rho_W a^2 h_0 g$'), 'Die Grundfläche $a^2$ kürzt sich.', `$\\frac{\\rho_H}{\\rho_W} = ${tw(holz.rho / 1000)}$`],
          `$$h_0 = \\frac{\\rho_H}{\\rho_W}\\cdot a = ${tw(holz.rho / 1000)}\\cdot ${tw(aCm)}\\,\\mathrm{cm} = ${tg(h0 * 100, 'cm')}$$`,
        ),
        teil(
          'Berechne die Periodendauer der Schwingung.',
          zahl(T, 's', [{ wert: 2 * Math.PI * Math.sqrt((aCm / 100) / G), hinweis: 'In $\\omega_0^2 = \\frac{g}{h_0}$ steht die **Eintauchtiefe**, nicht die Kantenlänge.' }]),
          [
            gg('$h_0$', '$T$', '$\\omega_0 = \\sqrt{\\frac{\\rho_W g A}{m}} = \\sqrt{\\frac{g}{h_0}}$'),
            'Wie bei der Boje: $D = \\rho_W g A$ und $m = \\rho_W A h_0$ (Gleichgewicht).',
            `$\\frac{h_0}{g} = ${tz(h0 / G, 3)}\\,\\mathrm{s^2}$`,
          ],
          `$$\\omega_0^2 = \\frac{\\rho_W g A}{m} = \\frac{\\rho_W g A}{\\rho_W A h_0} = \\frac{g}{h_0}\\;\\Rightarrow\\; T = 2\\pi\\sqrt{\\frac{h_0}{g}} = ${tg(T, 's')}$$`,
        ),
      ],
      werte: { h0, T, rho: holz.rho, a: aCm / 100 },
    };
  },
};

const fadenPlanet: Generator = {
  id: 'dgl-faden-planet',
  titel: 'Fadenpendel-DGL auf anderen Himmelskörpern',
  art: 'rechnen',
  schwierigkeit: 1,
  quelle: 'Buch S. 154 Aufg. 4, S. 164',
  erzeuge(rng) {
    const ort = rng.wahl([
      { name: 'auf dem Mond', g: 1.62 },
      { name: 'auf dem Mars', g: 3.71 },
      { name: 'auf dem Jupiter (Wolkenobergrenze)', g: 24.8 },
      { name: 'auf der Venus', g: 8.87 },
    ]);
    const l = rng.zahl(0.2, 3, 0.1);
    const w = Math.sqrt(ort.g / l);
    const T = (2 * Math.PI) / w;
    const TErde = 2 * Math.PI * Math.sqrt(l / G);
    return {
      titel: 'Pendel im Weltall',
      kontext: `Ein Fadenpendel der Länge ${g('\\ell', l, 'm')} schwingt ${ort.name} ($g = ${tw(ort.g)}\\,\\mathrm{m/s^2}$) mit kleiner Amplitude.`,
      teile: [
        teil(
          'Wie lautet der Zahlenwert $k$ in der DGL $\\ddot s = -k\\cdot s$ (in $\\frac1{\\mathrm{s^2}}$)?',
          zahl(ort.g / l, '1/s^2'),
          [gg('$g$, $\\ell$', '$k$', '$\\ddot s = -\\frac g\\ell\\, s$'), 'Die Konstante ist $\\frac g\\ell$.', `$\\frac{${tw(ort.g)}}{${tw(l)}}$`],
          `$$\\ddot s = -\\frac{g}{\\ell}\\, s = -${tz(ort.g / l, 3)}\\,\\mathrm{\\tfrac1{s^2}}\\cdot s$$`,
        ),
        teil(
          'Berechne die Periodendauer.',
          zahl(T, 's', [{ wert: TErde, hinweis: 'Das wäre die Periodendauer auf der Erde – nimm das $g$ des Himmelskörpers.' }]),
          [gg('$k = \\omega^2$', '$T$', '$T = \\frac{2\\pi}{\\sqrt{k}} = 2\\pi\\sqrt{\\frac\\ell g}$'), 'Erst $\\omega = \\sqrt k$.', `$\\omega = ${tg(w, '1/s', 4)}$`],
          `$$T = 2\\pi\\sqrt{\\frac{\\ell}{g}} = ${tg(T, 's')}$$ Auf der Erde wären es $${tg(TErde, 's')}$.`,
        ),
      ],
      werte: { l, g: ort.g, w, T },
    };
  },
};

export const generatoren: Generator[] = [erkennen, loesungWaehlen, uRohr, boje, klotz, fadenPlanet];
