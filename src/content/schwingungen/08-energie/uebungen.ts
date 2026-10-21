import type { Uebung } from '../../types';

const B169 = 'Buch S. 169';
export const uebungen: Uebung[] = [
  {
    id: 'en-u-ruhelage',
    typ: 'mc',
    frage: 'In welcher Lage hat ein schwingendes Federpendel die größte kinetische Energie?',
    quelle: 'Buch S. 168',
    optionen: [
      { text: 'In der Gleichgewichtslage.', richtig: true, warum: 'Dort ist $v = \\hat v$ maximal und $E_\\text{pot} = 0$.' },
      { text: 'In den Umkehrpunkten.', warum: 'Dort ist $v = 0$ – nur potenzielle Energie.' },
      { text: 'Auf halbem Weg zum Umkehrpunkt.', warum: 'Dort ist schon ein Teil potenziell.' },
      { text: 'Überall gleich.', warum: 'Konstant ist nur die **Gesamt**energie.' },
    ],
  },
  {
    id: 'en-u-amp',
    typ: 'mc',
    frage: 'Ein Federpendel wird dreimal so weit ausgelenkt. Wie ändert sich seine Gesamtenergie?',
    quelle: B169,
    optionen: [
      { text: 'Sie wird neunmal so groß.', richtig: true, warum: '$E = \\frac12 D\\hat s^2$, und $3^2 = 9$.' },
      { text: 'Sie wird dreimal so groß.', warum: 'Die Amplitude geht quadratisch ein.' },
      { text: 'Sie bleibt gleich.', warum: 'Mehr Auslenkung bedeutet mehr gespeicherte Energie.' },
      { text: 'Sie wird $\\sqrt3$-mal so groß.', warum: 'Die Wurzel taucht in $T$ auf, nicht in $E$.' },
    ],
  },
  {
    id: 'en-u-halbe',
    typ: 'mc',
    frage: 'Ein Pendel ist gerade bei der halben Amplitude. Welcher Anteil der Gesamtenergie ist kinetisch?',
    quelle: B169,
    optionen: [
      { text: '75 %', richtig: true, warum: '$E_\\text{pot} = \\frac12 D(\\frac{\\hat s}2)^2 = \\frac14 E_\\text{ges}$. Der Rest, $\\frac34$, ist kinetisch.' },
      { text: '50 %', warum: 'Die Energie hängt quadratisch von $s$ ab, nicht linear.' },
      { text: '25 %', warum: 'Das ist der potenzielle Anteil.' },
      { text: '0 %', warum: 'Null wäre es nur im Umkehrpunkt.' },
    ],
  },
  {
    id: 'en-u-masse',
    typ: 'mc',
    frage: 'Zwei Federpendel mit gleicher Feder und gleicher Amplitude haben unterschiedliche Massen. Was gilt?',
    quelle: 'Buch S. 169 Aufg. 3',
    optionen: [
      { text: 'Gleiche Gesamtenergie; das leichtere ist in der Ruhelage schneller.', richtig: true, warum: '$E = \\frac12 D\\hat s^2$ ist gleich. $\\frac12 m\\hat v^2$ gleich groß → kleineres $m$, größeres $\\hat v$.' },
      { text: 'Das schwerere hat mehr Energie.', warum: 'Beim Federpendel steckt die Energie in $\\frac12 D\\hat s^2$ – unabhängig von $m$.' },
      { text: 'Gleiche Energie und gleiche Höchstgeschwindigkeit.', warum: 'Bei gleicher Energie muss die kleinere Masse schneller sein.' },
      { text: 'Das leichtere hat mehr Energie.', warum: 'Die Energie hängt hier nicht von der Masse ab.' },
    ],
  },
  {
    id: 'en-u-luecke',
    typ: 'luecke',
    frage: 'Vervollständige die Herleitung (Start im Umkehrpunkt).',
    quelle: `${B169}; Notizen Lehrer 12.10.`,
    text: 'Mit $s(t) = \\hat s\\cos(\\omega t)$ ist $E_\\text{pot} = \\frac12 D\\hat s^2\\cdot$ [[0]]. Mit $v(t) = -\\hat s\\omega\\sin(\\omega t)$ und $m\\omega^2 = D$ ist $E_\\text{kin} = \\frac12 D\\hat s^2\\cdot$ [[1]]. Die Summe ist wegen [[2]] konstant gleich [[3]].',
    luecken: [
      { optionen: ['cos²(ωt)', 'sin²(ωt)', 'cos(ωt)', '1'], richtig: 0 },
      { optionen: ['sin²(ωt)', 'cos²(ωt)', '−sin(ωt)', 'ω²'], richtig: 0 },
      { optionen: ['sin² + cos² = 1', 'sin = cos', 'ω = 2π/T'], richtig: 0 },
      { optionen: ['½·D·ŝ²', 'D·ŝ', '½·m·ŝ²', '0'], richtig: 0 },
    ],
  },
  {
    id: 'en-u-fehler',
    typ: 'fehler',
    frage: 'Wo steckt der Fehler?',
    quelle: 'Notizen Lehrer 12.10.',
    schritte: [
      '$s(t) = \\hat s\\sin(\\omega t)$',
      '$v(t) = \\dot s(t) = \\hat s\\,\\omega\\sin(\\omega t)$',
      '$E_\\text{kin,max} = \\frac12 m\\hat s^2\\omega^2$',
      '$E_\\text{ges} = \\frac12 D\\hat s^2$',
    ],
    fehler: 1,
    erklaerung: 'Die Ableitung von $\\sin(\\omega t)$ ist $\\omega\\cos(\\omega t)$, also $v(t) = \\hat s\\omega\\cos(\\omega t)$. Die Zeilen 3 und 4 stimmen trotzdem, weil man für den Maximalwert nur den Vorfaktor braucht.',
  },
  {
    id: 'en-u-klass',
    typ: 'klassifizieren',
    frage: 'Start im oberen Umkehrpunkt. Was ist zum angegebenen Zeitpunkt größer?',
    quelle: 'Buch S. 169 Aufg. 4',
    kategorien: ['E_pot', 'E_kin', 'gleich'],
    items: [
      { text: '$t = 0$', kategorie: 0 },
      { text: '$t = \\frac T8$', kategorie: 2 },
      { text: '$t = \\frac T4$', kategorie: 1 },
      { text: '$t = \\frac T{16}$', kategorie: 0 },
      { text: '$t = \\frac{3T}{8}$', kategorie: 2 },
      { text: '$t = \\frac{5T}{16}$', kategorie: 1 },
      { text: '$t = \\frac T2$', kategorie: 0 },
    ],
  },
  {
    id: 'en-u-zuordnen',
    typ: 'zuordnen',
    frage: 'Ordne die Energieform zu.',
    quelle: 'Buch S. 168',
    paare: [
      { links: 'gespannte Feder', rechts: 'Spannenergie' },
      { links: 'angehobener Pendelkörper', rechts: 'Lageenergie' },
      { links: 'bewegter Körper', rechts: 'kinetische Energie' },
      { links: 'durch Reibung erwärmter Faden', rechts: 'thermische Energie' },
    ],
  },
];
