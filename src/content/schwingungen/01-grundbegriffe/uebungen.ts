import type { Uebung } from '../../types';

const B152 = 'Buch S. 152';
const B153 = 'Buch S. 153';
export const uebungen: Uebung[] = [
  {
    id: 'gb-u-karussell',
    typ: 'mc',
    frage: 'Auf der Schaukel vollführt man eine Schwingung, auf dem Karussell nicht. Warum?',
    quelle: 'Buch S. 153 Aufg. 1',
    optionen: [
      { text: 'Das Karussell dreht sich im Kreis – es gibt keine Umkehrpunkte.', richtig: true, warum: 'Periodisch sind beide, aber nur die Schaukel kehrt um.' },
      { text: 'Das Karussell ist nicht periodisch.', warum: 'Doch – es wiederholt seine Bewegung mit fester Umlaufzeit.' },
      { text: 'Das Karussell hat keine Masse.', warum: 'Natürlich hat es Masse. Entscheidend sind die fehlenden Umkehrpunkte.' },
      { text: 'Auf dem Karussell wirkt keine Kraft.', warum: 'Es wirkt eine Zentripetalkraft – aber keine, die zu einer Gleichgewichtslage zurückzieht.' },
    ],
  },
  {
    id: 'gb-u-traegheit',
    typ: 'mc',
    frage: 'Warum bleibt ein Pendel beim ersten Durchgang durch die Ruhelage nicht dort stehen, obwohl dort keine Rückstellkraft wirkt?',
    quelle: B153,
    optionen: [
      { text: 'Wegen seiner Trägheit – es hat Geschwindigkeit und bewegt sich weiter.', richtig: true, warum: 'Ohne Kraft bleibt die Geschwindigkeit erhalten (Trägheitsprinzip).' },
      { text: 'Weil dort die Rückstellkraft maximal ist.', warum: 'In der Ruhelage ist die Rückstellkraft null.' },
      { text: 'Weil die Gewichtskraft es weiterzieht.', warum: 'In der Ruhelage zeigt die Gewichtskraft genau senkrecht zur Bewegung (beim Fadenpendel) – sie treibt nicht weiter.' },
      { text: 'Weil die Energie dort null ist.', warum: 'Die kinetische Energie ist dort gerade maximal.' },
    ],
  },
  {
    id: 'gb-u-harmonisch',
    typ: 'mc',
    frage: 'Woran erkennt man laut Buch eine harmonische Schwingung (erstes Kriterium)?',
    quelle: B153,
    optionen: [
      { text: 'Frequenz und Periodendauer hängen nicht von der Amplitude ab.', richtig: true, warum: 'So ist es definiert – wie bei der Stimmgabel.' },
      { text: 'Die Amplitude bleibt konstant.', warum: 'Das heißt ungedämpft – auch eine gedämpfte Schwingung kann harmonisch sein.' },
      { text: 'Sie klingt angenehm.', warum: 'Der Name kommt aus der Musik, die Definition ist aber physikalisch.' },
      { text: 'Sie ist sehr schnell.', warum: 'Die Geschwindigkeit spielt keine Rolle.' },
    ],
  },
  {
    id: 'gb-u-luecke',
    typ: 'luecke',
    frage: 'Vervollständige.',
    quelle: `${B152}; Notizen Lehrer 21.9.`,
    text: 'Die Auslenkung $s$ ist der Abstand von der [[0]]. Die größte Auslenkung heißt [[1]]. Die Zeit, bis der Oszillator wieder im gleichen Schwingungszustand ist, heißt [[2]]. Ihr Kehrwert ist die [[3]] mit der Einheit [[4]].',
    luecken: [
      { optionen: ['Ruhelage', 'Startposition', 'Umkehrpunkt'], richtig: 0 },
      { optionen: ['Amplitude', 'Periode', 'Frequenz'], richtig: 0 },
      { optionen: ['Periodendauer', 'Amplitude', 'Phase'], richtig: 0 },
      { optionen: ['Frequenz', 'Kreisfrequenz', 'Geschwindigkeit'], richtig: 0 },
      { optionen: ['Hz', 'm', 's', 'N'], richtig: 0 },
    ],
  },
  {
    id: 'gb-u-zuordnen',
    typ: 'zuordnen',
    frage: 'Ordne zu.',
    quelle: B152,
    paare: [
      { links: 'Punkte, an denen der Körper kurz stillsteht', rechts: 'Umkehrpunkte' },
      { links: 'Lage, in der die Rückstellkraft null ist', rechts: 'Gleichgewichtslage' },
      { links: 'größter Abstand von der Ruhelage', rechts: 'Amplitude' },
      { links: 'Schwingungen pro Sekunde', rechts: 'Frequenz' },
    ],
  },
  {
    id: 'gb-u-fehler',
    typ: 'fehler',
    frage: 'Ein Schüler bestimmt aus einem Diagramm $T$ und $\\hat s$. Wo ist der Fehler?',
    quelle: B152,
    schritte: ['Der Graph schwankt zwischen $-3\\,\\mathrm{cm}$ und $+3\\,\\mathrm{cm}$, also $\\hat s = 3\\,\\mathrm{cm}$.', 'Der erste Nulldurchgang ist bei $0{,}2\\,\\mathrm s$, der nächste bei $0{,}6\\,\\mathrm s$.', 'Also ist $T = 0{,}4\\,\\mathrm s$.', 'Damit $f = 2{,}5\\,\\mathrm{Hz}$.'],
    fehler: 2,
    erklaerung: 'Zwischen zwei aufeinanderfolgenden Nulldurchgängen liegt nur eine **halbe** Periode: $T = 0{,}8\\,\\mathrm s$ und $f = 1{,}25\\,\\mathrm{Hz}$.',
  },
  {
    id: 'gb-u-klass',
    typ: 'klassifizieren',
    frage: 'Schwingung oder keine Schwingung?',
    quelle: `${B152}; Buch S. 153 Aufg. 2`,
    kategorien: ['Schwingung', 'keine Schwingung'],
    items: [
      { text: 'Zinken einer angeschlagenen Stimmgabel', kategorie: 0 },
      { text: 'Riesenrad, das sich gleichmäßig dreht', kategorie: 1, warum: 'Keine Umkehrpunkte.' },
      { text: 'Auto, das nach einer Bodenwelle auf seinen Federn nachwippt', kategorie: 0 },
      { text: 'Ball, der einmal eine Treppe herunterrollt', kategorie: 1, warum: 'Nicht periodisch.' },
      { text: 'Hängebrücke, die im Wind hin- und herschwankt', kategorie: 0 },
    ],
  },
];
