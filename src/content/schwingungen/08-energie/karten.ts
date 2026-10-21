import type { Karte } from '../../types';

const B168 = 'Buch S. 168';
const B169 = 'Buch S. 169';
const L1210 = 'Notizen Lehrer 12.10.';
export const karten: Karte[] = [
  { id: 'en-pot', typ: 'formel', vorne: 'Potenzielle Energie einer harmonischen Schwingung?', hinten: '$E_\\text{pot} = \\frac12 D s^2$', quelle: B169 },
  { id: 'en-kin', typ: 'formel', vorne: 'Kinetische Energie?', hinten: '$E_\\text{kin} = \\frac12 m v^2$', quelle: B169 },
  { id: 'en-ges', typ: 'formel', vorne: 'Gesamtenergie einer ungedämpften harmonischen Schwingung?', hinten: '$E_\\text{ges} = \\frac12 D\\hat s^2 = \\frac12 m\\hat v^2$ – konstant.', quelle: `${B169}; ${L1210}` },
  { id: 'en-wechsel', typ: 'begriff', vorne: 'Was passiert mit der Energie während einer Schwingung?', hinten: 'Potenzielle und kinetische Energie werden **laufend ineinander umgewandelt**; die Summe bleibt (ohne Reibung) konstant.', quelle: `${B168}; ${L1210}` },
  { id: 'en-umkehr', typ: 'wasPassiert', vorne: 'Wie ist die Energie im **Umkehrpunkt** verteilt?', hinten: 'Nur potenzielle Energie ($v = 0$): $E_\\text{pot} = E_\\text{ges}$, $E_\\text{kin} = 0$.', quelle: B168 },
  { id: 'en-ruhe', typ: 'wasPassiert', vorne: 'Wie ist die Energie in der **Ruhelage** verteilt?', hinten: 'Nur kinetische Energie ($s = 0$, $v = \\hat v$).', quelle: B168 },
  { id: 'en-flaeche', typ: 'warum', vorne: 'Warum ist $E_\\text{pot} = \\frac12 D s^2$ und nicht $D\\cdot s\\cdot s$?', hinten: 'Die Kraft ist beim Auslenken nicht konstant, sondern wächst linear von 0 auf $Ds$. Die Arbeit ist die **Dreiecksfläche** unter dem Graphen: $\\frac12\\cdot s\\cdot Ds$.', quelle: B169 },
  { id: 'en-pythagoras', typ: 'herleitung', vorne: 'Wie zeigt man, dass $E_\\text{pot}(t) + E_\\text{kin}(t)$ konstant ist?', hinten: '$\\frac12 D\\hat s^2\\cos^2(\\omega t) + \\frac12 D\\hat s^2\\sin^2(\\omega t) = \\frac12 D\\hat s^2$ wegen $\\sin^2 + \\cos^2 = 1$ (und $m\\omega^2 = D$).', quelle: `${B169}; ${L1210}` },
  { id: 'en-mw2', typ: 'herleitung', vorne: 'Warum darf man in $\\frac12 m\\hat s^2\\omega^2$ das $m\\omega^2$ durch $D$ ersetzen?', hinten: 'Beim Federpendel ist $\\omega^2 = \\frac Dm$, also $m\\omega^2 = D$.', quelle: L1210 },
  { id: 'en-doppelt', typ: 'wasPassiert', vorne: 'Wie oft pro Periode ist $E_\\text{kin}$ maximal?', hinten: '**Zweimal** – bei jedem Durchgang durch die Ruhelage. Die Energien schwingen mit doppelter Frequenz.', quelle: 'Buch S. 168 (Abb. 2)' },
  { id: 'en-T8', typ: 'wasPassiert', vorne: 'Start im Umkehrpunkt: Wann sind $E_\\text{pot}$ und $E_\\text{kin}$ zum ersten Mal gleich groß?', hinten: 'Bei $t = \\frac T8$, denn dort ist $\\cos^2(\\frac\\pi4) = \\sin^2(\\frac\\pi4) = \\frac12$.', quelle: 'Buch S. 169 Aufg. 4' },
  { id: 'en-halbe-amp', typ: 'wasPassiert', vorne: 'Welcher Anteil der Energie ist bei $s = \\frac{\\hat s}2$ kinetisch?', hinten: '$75\\,\\%$. Potenziell sind $\\left(\\frac12\\right)^2 = 25\\,\\%$.', quelle: B169 },
  { id: 'en-amp-doppelt', typ: 'wasPassiert', vorne: 'Was passiert mit der Gesamtenergie, wenn man die Amplitude verdoppelt?', hinten: 'Sie **vervierfacht** sich ($E\\sim\\hat s^2$).', quelle: B169 },
  { id: 'en-masse-feder', typ: 'warum', vorne: 'Hängt die Gesamtenergie eines Federpendels (gleiches $D$, gleiches $\\hat s$) von der Masse ab?', hinten: 'Nein: $E = \\frac12 D\\hat s^2$. Ein schwerer Körper ist zwar langsamer, aber $\\frac12 m\\hat v^2$ ergibt dasselbe.', quelle: 'Buch S. 169 Aufg. 3' },
  { id: 'en-masse-faden', typ: 'warum', vorne: 'Hängt die Gesamtenergie eines Fadenpendels (gleiches $\\ell$, gleiches $\\hat s$) von der Masse ab?', hinten: 'Ja: $D = \\frac{mg}{\\ell}$, also $E = \\frac12\\frac{mg}{\\ell}\\hat s^2 \\sim m$.', quelle: 'Buch S. 169 Aufg. 3' },
  { id: 'en-faden-h', typ: 'formel', vorne: 'Wie hoch über der Ruhelage ist ein Fadenpendel bei Auslenkwinkel $\\hat\\alpha$?', hinten: '$h = \\ell(1 - \\cos\\hat\\alpha)$, also $E = mgh$.', quelle: 'Buch S. 172 (Material A)' },
  { id: 'en-v-s', typ: 'formel', vorne: 'Wie schnell ist der Körper an der Stelle $s$?', hinten: 'Aus der Energieerhaltung: $v = \\omega\\sqrt{\\hat s^2 - s^2}$.', quelle: B169 },
  { id: 'en-mitschrift', typ: 'fehler', vorne: 'Was ist falsch an: „$s(t) = \\hat s\\sin(\\omega t)$, also $v(t) = \\hat s\\omega\\sin(\\omega t)$“?', hinten: 'Die Ableitung von $\\sin$ ist $\\cos$: richtig ist $v(t) = \\hat s\\omega\\cos(\\omega t)$. (Für $E_\\text{kin,max}$ ändert sich nichts, weil quadriert wird.)', quelle: 'Notizen Lehrer 12.10. (Flüchtigkeitsfehler)' },
  { id: 'en-gleichgewicht', typ: 'warum', vorne: 'Senkrechtes Federpendel: Von wo misst man $s$ in $E_\\text{pot} = \\frac12 D s^2$?', hinten: 'Von der **Gleichgewichtslage** aus – auch wenn die Feder dort schon gespannt ist. Gewichts- und Federkraft-Anteile gleichen sich dort aus.', quelle: B169 },
];
