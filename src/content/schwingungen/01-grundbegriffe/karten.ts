import type { Karte } from '../../types';

const B152 = 'Buch S. 152';
const B153 = 'Buch S. 153';
const L219 = 'Notizen Lehrer 21.9.';
export const karten: Karte[] = [
  { id: 'gb-schwingung', typ: 'begriff', vorne: 'Was ist eine **Schwingung**?', hinten: 'Eine periodische Bewegung eines Oszillators **zwischen zwei Umkehrpunkten** durch eine Gleichgewichtslage.', quelle: `${B152}; ${L219}` },
  { id: 'gb-oszillator', typ: 'begriff', vorne: 'Was ist ein **Oszillator**?', hinten: 'Der schwingende Körper (Schwingkörper).', quelle: L219 },
  { id: 'gb-kreis', typ: 'warum', vorne: 'Warum ist eine Kreisbewegung keine Schwingung, obwohl sie periodisch ist?', hinten: 'Sie hat **keine Umkehrpunkte** – der Körper läuft immer in dieselbe Richtung weiter.', quelle: B152 },
  { id: 'gb-auslenkung', typ: 'begriff', vorne: 'Was ist die **Auslenkung** $s$?', hinten: 'Der Abstand von der Ruhelage ($s = 0$), **mit Vorzeichen** – positiv auf der einen, negativ auf der anderen Seite.', quelle: `${B152}; ${L219}` },
  { id: 'gb-amplitude', typ: 'begriff', vorne: 'Was ist die **Amplitude** $\\hat s$?', hinten: 'Die **maximale** Auslenkung (Betrag), erreicht in den Umkehrpunkten.', quelle: `${B152}; ${L219}` },
  { id: 'gb-T', typ: 'begriff', vorne: 'Wie ist die **Periodendauer** $T$ definiert?', hinten: 'Die Zeit, bis der Oszillator wieder im **gleichen Schwingungszustand** ist (gleicher Ort und gleiche Bewegungsrichtung).', quelle: L219 },
  { id: 'gb-f', typ: 'begriff', vorne: 'Was gibt die **Frequenz** $f$ an?', hinten: 'Wie viele Schwingungen der Oszillator pro Sekunde ausführt. $f = \\frac1T$, Einheit Hz.', quelle: L219 },
  { id: 'gb-null-halb', typ: 'fehler', vorne: 'Stimmt das? „Von einem Nulldurchgang zum nächsten vergeht eine Periodendauer.“', hinten: '**Nein**, nur eine **halbe**. Beim nächsten Nulldurchgang bewegt sich der Körper in die Gegenrichtung – nicht derselbe Schwingungszustand.', quelle: L219 },
  { id: 'gb-2s', typ: 'fehler', vorne: 'Ein Pendel schwingt zwischen $-4\\,\\mathrm{cm}$ und $+4\\,\\mathrm{cm}$. Ist die Amplitude $8\\,\\mathrm{cm}$?', hinten: '**Nein**, $\\hat s = 4\\,\\mathrm{cm}$. Die Amplitude misst man von der Ruhelage aus.', quelle: B152 },
  { id: 'gb-rueckstell', typ: 'begriff', vorne: 'Was ist die **Rückstellkraft**?', hinten: 'Die Kraft, die den ausgelenkten Körper zur Gleichgewichtslage zurückzieht. Sie wächst mit der Auslenkung und ist in der Ruhelage null.', quelle: B153 },
  { id: 'gb-traegheit', typ: 'warum', vorne: 'Warum bleibt ein schwingender Körper nicht einfach in der Gleichgewichtslage stehen?', hinten: 'Wegen seiner **Trägheit**: Er kommt mit Geschwindigkeit an und schießt über die Ruhelage hinaus – dort wirkt keine Kraft, die ihn stoppt.', quelle: B153 },
  { id: 'gb-zutaten', typ: 'warum', vorne: 'Welche zwei „Zutaten“ braucht eine Schwingung?', hinten: '**Rückstellkraft** (zieht zurück) und **Trägheit** (schießt über die Ruhelage hinaus).', quelle: B153 },
  { id: 'gb-gedaempft', typ: 'begriff', vorne: 'Gedämpft oder ungedämpft – was ist der Unterschied?', hinten: '**Gedämpft:** Amplitude nimmt durch Reibung ab. **Ungedämpft:** Idealisierung, Amplitude bleibt konstant.', quelle: B153 },
  { id: 'gb-harmonisch', typ: 'begriff', vorne: 'Wann heißt eine Schwingung **harmonisch** (erste Definition)?', hinten: 'Wenn ihre Frequenz bzw. Periodendauer **nicht von der Amplitude abhängt**.', quelle: `${B153}; Notizen Lehrer 23.9.` },
  { id: 'gb-stimmgabel', typ: 'warum', vorne: 'Warum ist die Schwingung einer Stimmgabel harmonisch?', hinten: 'Ihr Ton bleibt gleich hoch, egal wie stark man sie anschlägt – die Frequenz hängt nicht von der Amplitude ab.', quelle: B153 },
  { id: 'gb-musik', typ: 'wasPassiert', vorne: 'Was wäre, wenn Musikinstrumente **nicht** harmonisch schwingen würden?', hinten: 'Die Tonhöhe würde sich beim Leiserwerden ändern – Instrumente wären nicht stimmbar, Zusammenspiel unmöglich.', quelle: 'Buch S. 153 Aufg. 4' },
  { id: 'gb-n-perioden', typ: 'formel', vorne: 'Ein Kranhaken braucht $\\Delta t$ für $n$ Perioden. Wie berechnest du $T$ und $f$?', hinten: '$T = \\frac{\\Delta t}{n}$, $f = \\frac{n}{\\Delta t}$', quelle: 'Buch S. 153 Aufg. 3' },
];
