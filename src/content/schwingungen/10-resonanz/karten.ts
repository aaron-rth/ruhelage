import type { Karte } from '../../types';

const B174 = 'Buch S. 174';
const B175 = 'Buch S. 175';
const B176 = 'Buch S. 176';
export const karten: Karte[] = [
  { id: 'rs-eigen', typ: 'begriff', vorne: 'Was ist die **Eigenfrequenz** $f_0$?', hinten: 'Die Frequenz, mit der ein System **ungestört von selbst** schwingt.', quelle: B174 },
  { id: 'rs-anregung', typ: 'begriff', vorne: 'Was ist die **Anregungsfrequenz** $f_a$?', hinten: 'Die Frequenz, mit der ein System von außen periodisch angetrieben wird (Hand, Motor, Wind …).', quelle: B174 },
  { id: 'rs-mit-fa', typ: 'wasPassiert', vorne: 'Mit welcher Frequenz schwingt ein angetriebenes Pendel (nach dem Einschwingen)?', hinten: 'Mit der **Anregungsfrequenz** $f_a$ – nicht mit seiner Eigenfrequenz.', quelle: B175 },
  { id: 'rs-resonanz', typ: 'begriff', vorne: 'Was ist **Resonanz**?', hinten: 'Stimmt $f_a$ mit $f_0$ überein, wird die Amplitude des angetriebenen Systems **besonders groß** (maximal).', quelle: B175 },
  { id: 'rs-energie', typ: 'warum', vorne: 'Warum braucht eine dauerhafte Schwingung eine Anregung?', hinten: 'Dämpfung entzieht ständig Energie. Die Anregung führt sie regelmäßig wieder zu.', quelle: B174 },
  { id: 'rs-phase-unten', typ: 'wasPassiert', vorne: '$f_a \\ll f_0$: Wie schwingt das Pendel im Vergleich zum Erreger?', hinten: 'Mit kleiner Amplitude **im Takt** (Phasenverschiebung $\\approx 0$).', quelle: B175 },
  { id: 'rs-phase-res', typ: 'wasPassiert', vorne: '$f_a = f_0$: Wie groß ist die Phasenverschiebung?', hinten: '$\\Delta\\varphi = \\frac\\pi2$ – eine Viertelschwingung; die Amplitude ist maximal.', quelle: B175 },
  { id: 'rs-phase-oben', typ: 'wasPassiert', vorne: '$f_a \\gg f_0$: Wie schwingt das Pendel?', hinten: 'Mit kleiner Amplitude im **Gegentakt** ($\\Delta\\varphi \\approx \\pi$).', quelle: B175 },
  { id: 'rs-daempfung', typ: 'wasPassiert', vorne: 'Wie verändert stärkere Dämpfung die Resonanzkurve?', hinten: 'Die Kurve wird **niedriger und breiter**, der Phasenübergang **weicher**.', quelle: B175 },
  { id: 'rs-katastrophe', typ: 'begriff', vorne: 'Was ist eine **Resonanzkatastrophe**?', hinten: 'Die Amplitude wächst durch Resonanz über die Belastbarkeit hinaus, bis das System zerstört wird (z. B. Tacoma-Narrows-Brücke 1940).', quelle: B176 },
  { id: 'rs-tilger', typ: 'begriff', vorne: 'Wie funktioniert ein **Schwingungstilger** (z. B. Taipei 101)?', hinten: 'Ein gedämpftes Pendel mit **gleicher Eigenfrequenz** wie das Gebäude wird von dessen Schwingungen angeregt; seine Dämpfer wandeln die Energie in Wärme um.', quelle: B176 },
  { id: 'rs-massnahmen', typ: 'warum', vorne: 'Was kann man gegen unerwünschte Resonanz tun?', hinten: '1. **Dämpfung** erhöhen. 2. **Eigenfrequenz verschieben** (Masse oder Steifigkeit ändern), sodass die Anregung sie nicht trifft.', quelle: B176 },
  { id: 'rs-marsch', typ: 'warum', vorne: 'Warum sollen Truppen nicht im Gleichschritt über Brücken marschieren?', hinten: 'Der Gleichschritt ist eine periodische Anregung. Trifft er die Eigenfrequenz der Brücke, kann Resonanz sie gefährlich stark schwingen lassen.', quelle: 'Buch S. 176 Aufg. 4' },
  { id: 'rs-gitarre', typ: 'warum', vorne: 'Warum klingt eine akustische Gitarre lauter als eine E-Gitarre ohne Verstärker?', hinten: 'Der **Resonanzkörper** schwingt mit und strahlt den Schall über eine viel größere Fläche ab (erwünschte Resonanz).', quelle: 'Buch S. 176 Aufg. 3' },
  { id: 'rs-schaukel', typ: 'warum', vorne: 'Warum muss man eine Schaukel im richtigen Rhythmus anschubsen?', hinten: 'Nur wenn die Anregung zur Eigenfrequenz passt (Resonanz), kommt die Energie jedes Mal im richtigen Moment und die Amplitude wächst.', quelle: 'Buch S. 174, 175 Aufg. 2' },
  { id: 'rs-auto', typ: 'herleitung', vorne: 'Fahrzeug auf Bodenwellen (Abstand $x$): Bei welcher Geschwindigkeit tritt Resonanz auf?', hinten: 'Anregungsfrequenz $f_a = \\frac{v}{x}$. Resonanz bei $f_a = f_0$, also $v = x\\cdot f_0$.', quelle: 'Buch S. 174–176 (Rechenbeispiel-Typ)' },
  { id: 'rs-stoss', typ: 'warum', vorne: 'Welche Aufgabe haben Stoßdämpfer im Hinblick auf Resonanz?', hinten: 'Mehr Dämpfung macht die Resonanzspitze flach: Das Auto wippt auch bei „passender“ Geschwindigkeit kaum, und jedes Nachwippen ist nach kurzer Zeit vorbei.', quelle: 'Buch S. 171, 176' },
];
