import type { Uebung } from '../../types';

const L210 = 'Notizen Lehrer 2.10.';
const B161C = 'Buch S. 161 (Material C)';
export const uebungen: Uebung[] = [
  {
    id: 'hm-u-knick-beschreiben',
    typ: 'mc',
    frage: 'Ein Wagen wird auf einer Knickbahn (zwei schiefe Ebenen) hochgeschoben und losgelassen. Welche Beschreibung stimmt?',
    quelle: B161C,
    optionen: [
      { text: 'Er wird bis zum Knick gleichmäßig schneller, dann gleichmäßig langsamer, kehrt um, und so weiter.', richtig: true, warum: 'Die Hangabtriebskraft ist konstant → konstante Beschleunigung (bzw. Verzögerung) auf jeder Seite.' },
      { text: 'Er fährt mit gleichbleibender Geschwindigkeit hin und her.', warum: 'Dann bräuchte er keine Kraft – er wird aber ständig beschleunigt bzw. gebremst.' },
      { text: 'Er schwingt sinusförmig wie ein Federpendel.', warum: 'Sinusförmig wäre er nur mit linearem Kraftgesetz. Hier ist die Kraft konstant.' },
      { text: 'Er bleibt im Knick stehen.', warum: 'Er kommt mit Geschwindigkeit an und rollt wegen seiner Trägheit weiter.' },
    ],
  },
  {
    id: 'hm-u-knick-T',
    typ: 'mc',
    frage: 'Auf der Knickbahn wird die Startauslenkung $\\hat s$ vervierfacht. Wie ändert sich die Periodendauer?',
    quelle: B161C,
    optionen: [
      { text: 'Sie verdoppelt sich.', richtig: true, warum: '$T = 4\\sqrt{\\frac{2\\hat s}{g\\sin\\alpha}} \\sim \\sqrt{\\hat s}$, und $\\sqrt4 = 2$. Genau deshalb ist die Schwingung nicht harmonisch.' },
      { text: 'Sie bleibt gleich.', warum: 'Das wäre bei einer harmonischen Schwingung so – die Knickbahn ist keine.' },
      { text: 'Sie vervierfacht sich.', warum: '$\\hat s$ steht unter der Wurzel.' },
      { text: 'Sie halbiert sich.', warum: 'Ein längerer Weg bei gleicher Beschleunigung dauert länger, nicht kürzer.' },
    ],
  },
  {
    id: 'hm-u-kriterium',
    typ: 'mc',
    frage: 'Welche Beobachtung zeigt sicher, dass eine Schwingung **nicht** harmonisch ist?',
    quelle: L210,
    optionen: [
      { text: 'Bei doppelter Amplitude ändert sich die Periodendauer deutlich.', richtig: true, warum: 'Damit ist Kriterium 3 verletzt – und alle Kriterien gehören zusammen.' },
      { text: 'Die Amplitude nimmt mit der Zeit ab.', warum: 'Das zeigt nur Dämpfung. Auch gedämpfte Schwingungen können (harmonisch gedämpft) eine amplitudenunabhängige Frequenz haben.' },
      { text: 'Die Schwingung ist sehr langsam.', warum: 'Die Geschwindigkeit sagt nichts über Harmonie aus.' },
      { text: 'Der Körper hat eine große Masse.', warum: 'Die Masse ändert $T$, aber nicht, ob $T$ von $\\hat s$ abhängt.' },
    ],
  },
  {
    id: 'hm-u-kennlinie',
    typ: 'mc',
    frage: 'Eine Feder hat zwischen $-10\\,\\mathrm{cm}$ und $+10\\,\\mathrm{cm}$ ein konstantes $D$; darüber hinaus wird $D$ immer größer. Ein Körper wird einmal um $6\\,\\mathrm{cm}$ und einmal um $16\\,\\mathrm{cm}$ ausgelenkt. Was beobachtest du?',
    quelle: 'Buch S. 167 (Material D)',
    optionen: [
      { text: 'Bei 6 cm harmonische Schwingung; bei 16 cm ist $T$ kleiner und die Kurve weicht vom Sinus ab.', richtig: true, warum: 'Im linearen Bereich ist alles harmonisch. Außerhalb ist die Rückstellkraft größer als linear – der Körper wird stärker zurückgetrieben.' },
      { text: 'Beide Male gleiche Periodendauer.', warum: 'Bei 16 cm verlässt der Körper den linearen Bereich.' },
      { text: 'Bei 16 cm ist $T$ größer.', warum: 'Eine härtere Feder treibt schneller zurück – $T$ wird kleiner.' },
      { text: 'Bei 16 cm schwingt er gar nicht.', warum: 'Er schwingt, nur eben nicht harmonisch.' },
    ],
  },
  {
    id: 'hm-u-luecke',
    typ: 'luecke',
    frage: 'Vervollständige die drei Kriterien.',
    quelle: L210,
    text: 'Eine Schwingung ist genau dann harmonisch, wenn sie durch [[0]] beschrieben werden kann, wenn die Rückstellkraft [[1]] zur Auslenkung ist und wenn die Periodendauer nicht von der [[2]] abhängt.',
    luecken: [
      { optionen: ['sin/cos', 'eine Gerade', 'eine Parabel'], richtig: 0 },
      { optionen: ['proportional', 'umgekehrt proportional', 'konstant'], richtig: 0 },
      { optionen: ['Amplitude', 'Masse', 'Federkonstante'], richtig: 0 },
    ],
  },
  {
    id: 'hm-u-knick-reihe',
    typ: 'reihenfolge',
    frage: 'Zeige, dass die Knickbahn-Schwingung nicht harmonisch ist. Reihenfolge?',
    quelle: B161C,
    schritte: [
      'Auf der schiefen Ebene wirkt die konstante Hangabtriebskraft $F_H = mg\\sin\\alpha$.',
      'Also ist die Beschleunigung konstant: $a = g\\sin\\alpha$.',
      'Für den Weg bis zur Mitte gilt $\\hat s = \\frac12 a t_1^2$, also $t_1 = \\sqrt{\\frac{2\\hat s}{g\\sin\\alpha}}$.',
      'Eine Periode besteht aus vier solchen Abschnitten: $T = 4t_1$.',
      '$T$ hängt von $\\hat s$ ab – die Schwingung ist nicht harmonisch.',
    ],
  },
  {
    id: 'hm-u-klass',
    typ: 'klassifizieren',
    frage: 'Harmonisch (bzw. in guter Näherung harmonisch) oder nicht?',
    quelle: `${L210}; ${B161C}; Buch S. 166–167`,
    kategorien: ['harmonisch', 'nicht harmonisch'],
    items: [
      { text: 'Federpendel im linearen Bereich der Feder', kategorie: 0 },
      { text: 'Wagen auf einer Knickbahn', kategorie: 1, warum: 'Konstante Rückstellkraft, $T$ hängt von $\\hat s$ ab.' },
      { text: 'Fadenpendel mit $5^\\circ$ Ausschlag', kategorie: 0 },
      { text: 'Fadenpendel mit $70^\\circ$ Ausschlag', kategorie: 1, warum: 'Kleinwinkelnäherung gilt nicht mehr.' },
      { text: 'Flüssigkeit im U-Rohr', kategorie: 0, warum: '$F_R = -2\\rho A g s$ ist linear.' },
      { text: 'Gummiband, weit über den linearen Bereich gedehnt', kategorie: 1 },
      { text: 'Schatten eines gleichmäßig umlaufenden Punktes', kategorie: 0 },
      { text: 'Ball, der auf dem Boden auf und ab hüpft', kategorie: 1, warum: 'Konstante Gewichtskraft (wie Knickbahn), Sprunghöhe beeinflusst die Dauer.' },
    ],
  },
  {
    id: 'hm-u-fehler',
    typ: 'fehler',
    frage: 'Eine typische Beschreibung der Knickbahn-Bewegung. Welcher Satz ist fachlich falsch?',
    quelle: 'Buch S. 161 (Material C); häufige Fehlvorstellung',
    schritte: [
      'Nach dem Loslassen rollt der Wagen die schiefe Ebene hinunter.',
      'Hinter dem Knick fährt er die andere Ebene hinauf, bis er umkehrt.',
      'Auf beiden Ebenen ist er die ganze Zeit gleich schnell unterwegs.',
      'Der Wagen pendelt so zwischen zwei Umkehrpunkten hin und her.',
    ],
    fehler: 2,
    erklaerung: 'Die Hangabtriebskraft ist konstant und **nicht null** – also wird der Wagen gleichmäßig **beschleunigt** (bergab) bzw. **gebremst** (bergauf). Seine Geschwindigkeit ändert sich ständig.',
  },
];
