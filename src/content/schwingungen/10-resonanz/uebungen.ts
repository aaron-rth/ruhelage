import type { Uebung } from '../../types';

const B175 = 'Buch S. 175';
export const uebungen: Uebung[] = [
  {
    id: 'rs-u-frequenz',
    typ: 'mc',
    frage: 'Ein Federpendel mit $f_0 = 1{,}2\\,\\mathrm{Hz}$ wird von einem Motor mit $f_a = 0{,}5\\,\\mathrm{Hz}$ angetrieben. Mit welcher Frequenz schwingt es nach einiger Zeit?',
    quelle: B175,
    optionen: [
      { text: 'Mit $0{,}5\\,\\mathrm{Hz}$.', richtig: true, warum: 'Ein angetriebenes System schwingt mit der Anregungsfrequenz.' },
      { text: 'Mit $1{,}2\\,\\mathrm{Hz}$.', warum: 'Das ist seine Eigenfrequenz – mit der schwingt es nur ohne Antrieb.' },
      { text: 'Mit $1{,}7\\,\\mathrm{Hz}$.', warum: 'Frequenzen addieren sich hier nicht.' },
      { text: 'Es schwingt gar nicht.', warum: 'Es schwingt – nur mit kleiner Amplitude, weil $f_a$ weit von $f_0$ entfernt ist.' },
    ],
  },
  {
    id: 'rs-u-phase',
    typ: 'mc',
    frage: 'Ein Pendel wird **weit oberhalb** seiner Eigenfrequenz angetrieben. Wie verhält es sich?',
    quelle: B175,
    optionen: [
      { text: 'Kleine Amplitude, Bewegung im Gegentakt zum Erreger ($\\Delta\\varphi \\approx \\pi$).', richtig: true, warum: 'Das Pendel ist zu träge, um zu folgen – es schwingt klein und gegenphasig.' },
      { text: 'Große Amplitude im Takt.', warum: 'Große Amplituden gibt es nur nahe $f_0$.' },
      { text: 'Kleine Amplitude im Takt ($\\Delta\\varphi \\approx 0$).', warum: 'Im Takt schwingt es bei sehr kleinen Anregungsfrequenzen.' },
      { text: 'Phasenverschiebung $\\frac\\pi2$.', warum: 'Das gilt bei Resonanz.' },
    ],
  },
  {
    id: 'rs-u-daempfung',
    typ: 'mc',
    frage: 'Wie verändert sich die Resonanzkurve, wenn man die Dämpfung erhöht?',
    quelle: B175,
    optionen: [
      { text: 'Das Maximum wird niedriger und die Kurve breiter.', richtig: true, warum: 'Mehr Dämpfung entzieht mehr Energie – die Amplitude bleibt bei allen Frequenzen kleiner.' },
      { text: 'Das Maximum wird höher.', warum: 'Dämpfung begrenzt die Amplitude.' },
      { text: 'Das Maximum verschiebt sich zu doppelter Frequenz.', warum: 'Es bleibt in der Nähe von $f_0$ (rückt höchstens leicht nach unten).' },
      { text: 'Gar nicht.', warum: 'Die Dämpfung bestimmt Höhe und Breite der Kurve.' },
    ],
  },
  {
    id: 'rs-u-tilger',
    typ: 'mc',
    frage: 'Warum wird die Eigenfrequenz eines Schwingungstilgers (z. B. im Taipei 101) genau auf die des Gebäudes abgestimmt?',
    quelle: 'Buch S. 176',
    optionen: [
      { text: 'Damit die Gebäudeschwingung das Pendel in Resonanz anregt und dessen Dämpfer die Energie aufnehmen.', richtig: true, warum: 'Der Tilger „saugt“ die Schwingungsenergie heraus und wandelt sie in Wärme um.' },
      { text: 'Damit das Gebäude schöner schwingt.', warum: 'Ziel ist das Gegenteil: weniger Schwingung.' },
      { text: 'Damit das Pendel die Erdbeben vorhersagen kann.', warum: 'Ein Tilger misst nichts – er dämpft.' },
      { text: 'Damit das Gebäude eine höhere Eigenfrequenz bekommt.', warum: 'Der Tilger nutzt Resonanz, er verschiebt nicht die Gebäudefrequenz.' },
    ],
  },
  {
    id: 'rs-u-weinglas',
    typ: 'mc',
    frage: 'Angeblich kann man ein Weinglas durch lautes Ansingen zerbrechen. Was ist die physikalische Grundlage?',
    quelle: 'Buch S. 176 Aufg. 2',
    optionen: [
      { text: 'Resonanz: Der gesungene Ton trifft die Eigenfrequenz des Glases, die Amplitude wächst, bis es bricht.', richtig: true, warum: 'Bei schwach gedämpften Systemen wie dünnem Glas kann die Resonanzamplitude sehr groß werden.' },
      { text: 'Der Schall erwärmt das Glas, bis es springt.', warum: 'Die zugeführte Energie macht sich vor allem als Schwingung bemerkbar, nicht als Wärme.' },
      { text: 'Jeder sehr laute Ton zerbricht Glas.', warum: 'Entscheidend ist die passende Frequenz, nicht nur die Lautstärke.' },
      { text: 'Das ist physikalisch unmöglich.', warum: 'Es ist möglich – wenn auch schwierig – wegen der Resonanz.' },
    ],
  },
  {
    id: 'rs-u-zuordnen',
    typ: 'zuordnen',
    frage: 'Ordne der Anregungsfrequenz die Phasenverschiebung zwischen Erreger und Pendel zu.',
    quelle: B175,
    paare: [
      { links: '$f_a$ deutlich kleiner als $f_0$', rechts: 'Δφ ≈ 0 (im Takt)' },
      { links: '$f_a = f_0$', rechts: 'Δφ = π/2' },
      { links: '$f_a$ deutlich größer als $f_0$', rechts: 'Δφ ≈ π (Gegentakt)' },
    ],
  },
  {
    id: 'rs-u-klass',
    typ: 'klassifizieren',
    frage: 'Ist die Resonanz hier erwünscht oder unerwünscht?',
    quelle: 'Buch S. 176',
    kategorien: ['erwünscht', 'unerwünscht'],
    items: [
      { text: 'Resonanzkörper einer Gitarre', kategorie: 0 },
      { text: 'Klappernder Spiegel am Auto bei 80 km/h', kategorie: 1 },
      { text: 'Anschubsen einer Schaukel im richtigen Takt', kategorie: 0 },
      { text: 'Hängebrücke, die im Wind immer stärker schwingt', kategorie: 1 },
      { text: 'Luftsäule in einer Posaune', kategorie: 0 },
      { text: 'Waschmaschine, die beim Schleudern wandert', kategorie: 1 },
    ],
  },
  {
    id: 'rs-u-luecke',
    typ: 'luecke',
    frage: 'Vervollständige.',
    quelle: 'Buch S. 174–176',
    text: 'Ein angetriebenes Pendel schwingt mit der [[0]]. Stimmt diese mit der [[1]] überein, wird die Amplitude besonders groß – das heißt [[2]]. Durch stärkere [[3]] bleibt die Amplitude dabei kleiner.',
    luecken: [
      { optionen: ['Anregungsfrequenz', 'Eigenfrequenz', 'Kreisfrequenz'], richtig: 0 },
      { optionen: ['Eigenfrequenz', 'Anregungsfrequenz', 'Amplitude'], richtig: 0 },
      { optionen: ['Resonanz', 'Dämpfung', 'Interferenz'], richtig: 0 },
      { optionen: ['Dämpfung', 'Anregung', 'Masse'], richtig: 0 },
    ],
  },
];
