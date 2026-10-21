import type { Uebung } from '../../types';

const B151 = 'Buch S. 151';
export const uebungen: Uebung[] = [
  {
    id: 'bw-u-waagerecht',
    typ: 'mc',
    frage: 'Im s-t-Diagramm eines Aufzugs verläuft der Graph zwischen $t = 20\\,\\mathrm s$ und $t = 35\\,\\mathrm s$ waagerecht bei $s = 12\\,\\mathrm m$. Was bedeutet das?',
    quelle: 'Buch S. 151 Aufg. 5',
    optionen: [
      { text: 'Der Aufzug hält 15 s lang in 12 m Höhe.', richtig: true, warum: 'Der Ort ändert sich nicht → Geschwindigkeit null.' },
      { text: 'Der Aufzug fährt mit konstanter Geschwindigkeit.', warum: 'Dann wäre der Graph eine schräge Gerade.' },
      { text: 'Der Aufzug fährt mit 12 m/s.', warum: '12 m ist eine Höhe, keine Geschwindigkeit; die Steigung ist null.' },
      { text: 'Der Aufzug beschleunigt gleichmäßig.', warum: 'Beschleunigte Bewegung sieht man an einem gekrümmten s-t-Graphen.' },
    ],
  },
  {
    id: 'bw-u-flaeche',
    typ: 'mc',
    frage: 'Wie bekommt man aus einem v-t-Diagramm den zurückgelegten Weg?',
    quelle: B151,
    optionen: [
      { text: 'Als Fläche zwischen Graph und t-Achse.', richtig: true, warum: 'Bei konstantem $v$ ist das einfach $v\\cdot\\Delta t$ (Rechteck) – allgemein die Fläche.' },
      { text: 'Als Steigung des Graphen.', warum: 'Die Steigung im v-t-Diagramm ist die Beschleunigung.' },
      { text: 'Als größter v-Wert.', warum: 'Das ist die Höchstgeschwindigkeit, kein Weg.' },
      { text: 'Gar nicht – dazu braucht man das s-t-Diagramm.', warum: 'Doch, über die Fläche.' },
    ],
  },
  {
    id: 'bw-u-ton',
    typ: 'mc',
    frage: 'Bei einem Ton bleibt die Amplitude gleich, aber die Schwingungen liegen im Bild immer dichter beieinander. Was hört man?',
    quelle: 'Buch S. 151 Aufg. 1',
    optionen: [
      { text: 'Der Ton wird höher, die Lautstärke bleibt gleich.', richtig: true, warum: 'Dichtere Schwingungen = kürzere Periodendauer = höhere Frequenz = höherer Ton.' },
      { text: 'Der Ton wird lauter.', warum: 'Die Lautstärke hängt an der Amplitude – die bleibt gleich.' },
      { text: 'Der Ton wird tiefer.', warum: 'Kürzere Periodendauer heißt höhere Frequenz.' },
      { text: 'Nichts ändert sich.', warum: 'Die Frequenz ändert sich – das hört man als Tonhöhe.' },
    ],
  },
  {
    id: 'bw-u-ableitung',
    typ: 'luecke',
    frage: 'Vervollständige.',
    quelle: 'Buch S. 151 Aufg. 8',
    text: 'Für den freien Fall gilt $h(t) = h_0 - \\frac g2 t^2$. Der Parameter $h_0$ ist die [[0]]. Die Geschwindigkeit ist $v(t) = \\dot h(t) = $ [[1]], die Beschleunigung $a(t) = $ [[2]].',
    luecken: [
      { optionen: ['Anfangshöhe', 'Endgeschwindigkeit', 'Fallzeit'], richtig: 0 },
      { optionen: ['−g·t', '−g/2·t', '−g·t²', 'g'], richtig: 0 },
      { optionen: ['−g', '−g·t', '0', '−g/2'], richtig: 0 },
    ],
  },
  {
    id: 'bw-u-zuordnen',
    typ: 'zuordnen',
    frage: 'Ordne zu: Was sieht man im s-t-Diagramm?',
    quelle: B151,
    paare: [
      { links: 'Körper steht still', rechts: 'waagerechte Linie' },
      { links: 'konstante Geschwindigkeit', rechts: 'schräge Gerade' },
      { links: 'Körper wird schneller', rechts: 'immer steiler werdende Kurve' },
      { links: 'Bewegung in negative Richtung', rechts: 'fallender Graph' },
    ],
  },
  {
    id: 'bw-u-vorsilben',
    typ: 'zuordnen',
    frage: 'Ordne die Vorsilben ihren Faktoren zu.',
    quelle: 'Notizen Lehrer 18.9.',
    paare: [
      { links: 'nano (n)', rechts: '10⁻⁹' },
      { links: 'mikro (µ)', rechts: '10⁻⁶' },
      { links: 'milli (m)', rechts: '10⁻³' },
      { links: 'kilo (k)', rechts: '10³' },
      { links: 'Mega (M)', rechts: '10⁶' },
    ],
  },
  {
    id: 'bw-u-fehler',
    typ: 'fehler',
    frage: 'Wo ist der Fehler bei der Umrechnung?',
    quelle: 'Notizen Lehrer 18.9.',
    schritte: ['$T = 0{,}04\\,\\mathrm{ms}$', '$T = 40\\,\\mu\\mathrm s = 40\\cdot 10^{-6}\\,\\mathrm s$', '$f = \\frac1T = \\frac{1}{40\\cdot 10^{-6}\\,\\mathrm s}$', '$f = 25\\,000\\,\\mathrm{Hz} = 25\\,\\mathrm{MHz}$'],
    fehler: 3,
    erklaerung: '$25\\,000\\,\\mathrm{Hz} = 25\\cdot 10^3\\,\\mathrm{Hz} = 25\\,\\mathrm{kHz}$ (kilo), nicht Mega.',
  },
  {
    id: 'bw-u-klass',
    typ: 'klassifizieren',
    frage: 'Gleichförmig oder beschleunigt?',
    quelle: B151,
    kategorien: ['gleichförmig', 'beschleunigt'],
    items: [
      { text: 's-t-Graph ist eine schräge Gerade', kategorie: 0 },
      { text: 'v-t-Graph ist eine waagerechte Linie (nicht bei null)', kategorie: 0 },
      { text: 'v-t-Graph ist eine schräge Gerade', kategorie: 1 },
      { text: 's-t-Graph ist eine Parabel', kategorie: 1 },
      { text: 'Pendelkörper beim Schwingen', kategorie: 1, warum: 'Seine Geschwindigkeit ändert sich ständig.' },
    ],
  },
];
