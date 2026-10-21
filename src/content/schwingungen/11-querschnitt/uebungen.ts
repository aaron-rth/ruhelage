import type { Uebung } from '../../types';

const UK = 'Übungsklausur (Aufgabentyp)';
export const uebungen: Uebung[] = [
  {
    id: 'q-u-doppelt',
    typ: 'mc',
    frage: 'Bei der Bestimmung von $g$ mit einem Fadenpendel ist die relative Unsicherheit von $\\ell$ $0{,}3\\,\\%$ und die von $T$ $0{,}4\\,\\%$. Wie groß ist die relative Unsicherheit von $g$ (Abschätzung)?',
    quelle: UK,
    optionen: [
      { text: '$1{,}1\\,\\%$', richtig: true, warum: '$\\frac{\\Delta g}{g} \\approx 0{,}3\\,\\% + 2\\cdot 0{,}4\\,\\%$, weil $T$ quadriert eingeht.' },
      { text: '$0{,}7\\,\\%$', warum: 'Die Zeit geht wegen $T^2$ doppelt ein.' },
      { text: '$0{,}1\\,\\%$', warum: 'Unsicherheiten heben sich nicht auf – sie addieren sich (im ungünstigsten Fall).' },
      { text: '$1{,}9\\,\\%$', warum: 'Doppelt zählt nur $T$, nicht $\\ell$.' },
    ],
  },
  {
    id: 'q-u-aufzug',
    typ: 'mc',
    frage: 'Ein Fadenpendel schwingt in einem Aufzug, der bei der Abwärtsfahrt **abbremst**. Was gilt für seine Periodendauer?',
    quelle: UK,
    optionen: [
      { text: 'Sie ist kleiner als im ruhenden Aufzug.', richtig: true, warum: 'Abbremsen bei Abwärtsfahrt heißt Beschleunigung **nach oben** → $g_\\text{eff} = g + a$.' },
      { text: 'Sie ist größer als im ruhenden Aufzug.', warum: 'Das gilt beim Anfahren nach unten (Beschleunigung nach unten).' },
      { text: 'Sie ist gleich.', warum: 'Nur bei gleichförmiger Fahrt bleibt sie gleich.' },
      { text: 'Das Pendel schwingt nicht mehr.', warum: 'Das passiert nur im freien Fall.' },
    ],
  },
  {
    id: 'q-u-freifall',
    typ: 'mc',
    frage: 'Ein Fadenpendel hängt in einem Aufzug, dessen Seil reißt – der Aufzug fällt frei. Was passiert mit der Schwingung?',
    quelle: UK,
    optionen: [
      { text: 'Es gibt keine Rückstellkraft mehr – das Pendel schwingt nicht weiter.', richtig: true, warum: 'Pendel und Aufhängung fallen gleich schnell: $g_\\text{eff} = 0$.' },
      { text: 'Es schwingt mit doppelter Periodendauer weiter.', warum: 'Ohne $g_\\text{eff}$ gibt es gar keine Rückstellkraft – also keine Schwingung.' },
      { text: 'Es schwingt schneller.', warum: 'Kleineres $g_\\text{eff}$ heißt längere Periode – bei $g_\\text{eff} = 0$ gibt es gar keine mehr.' },
      { text: 'Nichts ändert sich, weil $T$ nicht von der Masse abhängt.', warum: '$T$ hängt aber von $g_\\text{eff}$ ab.' },
    ],
  },
  {
    id: 'q-u-uhr',
    typ: 'mc',
    frage: 'Eine Pendeluhr ist bei $15\\,^\\circ\\mathrm C$ exakt eingestellt. An einem heißen Tag dehnt sich ihre Pendelstange ein wenig aus. Was passiert?',
    quelle: UK,
    optionen: [
      { text: 'Die Uhr geht nach.', richtig: true, warum: 'Längeres Pendel → größeres $T$ → die Uhr zählt weniger Schwingungen pro echter Zeit.' },
      { text: 'Die Uhr geht vor.', warum: 'Vorgehen würde sie mit kürzerem Pendel.' },
      { text: 'Nichts – die Länge ist egal.', warum: '$T\\sim\\sqrt\\ell$ – die Länge entscheidet.' },
      { text: 'Die Uhr bleibt stehen.', warum: 'Sie läuft weiter, nur langsamer.' },
    ],
  },
  {
    id: 'q-u-klass',
    typ: 'klassifizieren',
    frage: 'Wie ändert sich die Periodendauer eines **Fadenpendels**?',
    quelle: UK,
    kategorien: ['kleiner', 'größer', 'gleich'],
    items: [
      { text: 'Aufzug fährt nach oben an', kategorie: 0 },
      { text: 'Aufzug fährt nach unten an', kategorie: 1 },
      { text: 'Aufzug fährt gleichförmig nach unten', kategorie: 2 },
      { text: 'Aufzug bremst bei Aufwärtsfahrt', kategorie: 1, warum: 'Beschleunigung zeigt nach unten → $g - a$.' },
      { text: 'Pendel wird im Winter etwas kürzer', kategorie: 0 },
      { text: 'Versuch auf dem Mars', kategorie: 1 },
    ],
  },
  {
    id: 'q-u-reihenfolge',
    typ: 'reihenfolge',
    frage: 'Bestimme die Gangabweichung einer Pendeluhr pro Tag, wenn das Pendel um einen kleinen Bruchteil länger wird. Reihenfolge?',
    quelle: UK,
    schritte: [
      'Relative Längenänderung bestimmen: $\\frac{\\Delta\\ell}{\\ell}$.',
      'Wegen $T\\sim\\sqrt\\ell$: $\\frac{\\Delta T}{T} \\approx \\frac12\\frac{\\Delta\\ell}{\\ell}$.',
      'Ein Tag hat $86\\,400\\,\\mathrm s$.',
      'Gangabweichung: $86\\,400\\,\\mathrm s\\cdot\\frac{\\Delta T}{T}$.',
      'Längere Periode → die Uhr geht nach.',
    ],
  },
  {
    id: 'q-u-fehler',
    typ: 'fehler',
    frage: 'Wo ist der Fehler in dieser Unsicherheitsabschätzung?',
    quelle: UK,
    schritte: [
      '$\\ell = (0{,}75 \\pm 0{,}005)\\,\\mathrm m$ → $\\frac{\\Delta\\ell}{\\ell} \\approx 0{,}67\\,\\%$',
      '$30$ Perioden in $(52{,}2 \\pm 0{,}3)\\,\\mathrm s$ → $\\frac{\\Delta T}{T} = \\frac{0{,}3}{52{,}2} \\approx 0{,}57\\,\\%$',
      '$\\frac{\\Delta g}{g} \\approx 0{,}67\\,\\% + 0{,}57\\,\\% = 1{,}24\\,\\%$',
    ],
    fehler: 2,
    erklaerung: 'Die relative Unsicherheit von $T$ zählt **doppelt**: $\\frac{\\Delta g}{g} \\approx 0{,}67\\,\\% + 2\\cdot 0{,}57\\,\\% \\approx 1{,}8\\,\\%$. (Schritt 2 ist richtig: Die relative Unsicherheit von $T = t/30$ ist dieselbe wie die von $t$.)',
  },
];
