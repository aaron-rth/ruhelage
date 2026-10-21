import type { Karte } from '../../types';

const UK = 'Übungsklausur (Aufgabentyp)';
export const karten: Karte[] = [
  { id: 'q-rel', typ: 'begriff', vorne: 'Was ist die **relative Unsicherheit**?', hinten: 'Die absolute Unsicherheit geteilt durch den Messwert, $\\frac{\\Delta x}{x}$ – meist in Prozent.', quelle: UK },
  { id: 'q-produkt', typ: 'formel', vorne: 'Wie verhalten sich relative Unsicherheiten bei Produkten und Quotienten (Abschätzung)?', hinten: 'Sie **addieren** sich. Steht eine Größe mit Exponent $n$ in der Formel, zählt ihre relative Unsicherheit $n$-fach.', quelle: UK },
  { id: 'q-g', typ: 'formel', vorne: 'Relative Unsicherheit von $g = \\frac{4\\pi^2\\ell}{T^2}$?', hinten: '$\\frac{\\Delta g}{g} \\approx \\frac{\\Delta\\ell}{\\ell} + 2\\frac{\\Delta T}{T}$', quelle: UK },
  { id: 'q-doppelt', typ: 'warum', vorne: 'Warum geht die Unsicherheit der Zeitmessung bei $g$ **doppelt** ein?', hinten: 'Weil $T$ in $g = \\frac{4\\pi^2\\ell}{T^2}$ **quadriert** wird.', quelle: UK },
  { id: 'q-n', typ: 'warum', vorne: 'Wie verkleinert das Messen über $n$ Perioden die Unsicherheit von $T$?', hinten: 'Die Unsicherheit $\\Delta t$ beim Stoppen bleibt etwa gleich, wird aber auf $n$ Perioden verteilt: $\\Delta T = \\frac{\\Delta t}{n}$.', quelle: 'Buch S. 154 (Randspalte); Übungsklausur (Aufgabentyp)' },
  { id: 'q-aufzug-hoch', typ: 'wasPassiert', vorne: 'Ein Aufzug fährt mit der Beschleunigung $a$ nach oben an. Was passiert mit $T$ eines Fadenpendels darin?', hinten: '$g_\\text{eff} = g + a$ → $T = 2\\pi\\sqrt{\\frac{\\ell}{g+a}}$ wird **kleiner**.', quelle: UK },
  { id: 'q-aufzug-runter', typ: 'wasPassiert', vorne: 'Ein Aufzug fährt nach unten an (Beschleunigung $a$ nach unten). Was passiert mit $T$?', hinten: '$g_\\text{eff} = g - a$ → $T$ wird **größer**.', quelle: UK },
  { id: 'q-gleichfoermig', typ: 'wasPassiert', vorne: 'Ändert sich $T$ eines Fadenpendels in einem gleichförmig fahrenden Aufzug?', hinten: 'Nein – ohne Beschleunigung ist $g_\\text{eff} = g$.', quelle: UK },
  { id: 'q-freifall', typ: 'wasPassiert', vorne: 'Das Seil eines Aufzugs reißt (freier Fall). Was macht das Pendel darin?', hinten: '$g_\\text{eff} = 0$: Es gibt keine Rückstellkraft mehr – das Pendel **schwingt nicht mehr**.', quelle: UK },
  { id: 'q-feder-aufzug', typ: 'warum', vorne: 'Ändert sich $T$ eines **Federpendels** im beschleunigten Aufzug?', hinten: 'Nein. $T = 2\\pi\\sqrt{m/D}$ enthält kein $g$ – nur die Ruhelage verschiebt sich.', quelle: 'Buch S. 158; Übungsklausur (Aufgabentyp)' },
  { id: 'q-klein', typ: 'formel', vorne: 'Wie ändert sich $T$ eines Fadenpendels bei einer kleinen relativen Längenänderung $\\frac{\\Delta\\ell}{\\ell}$?', hinten: '$\\frac{\\Delta T}{T} \\approx \\frac12\\frac{\\Delta\\ell}{\\ell}$, weil $T \\sim \\sqrt\\ell$.', quelle: UK },
  { id: 'q-uhr-warm', typ: 'wasPassiert', vorne: 'Im Sommer dehnt sich die Pendelstange einer Pendeluhr aus. Geht die Uhr vor oder nach?', hinten: 'Sie geht **nach**: Längeres Pendel → längere Periode → weniger gezählte Perioden pro echter Zeit.', quelle: UK },
  { id: 'q-uhr-tag', typ: 'formel', vorne: 'Wie berechnest du die Gangabweichung einer Pendeluhr pro Tag?', hinten: '$\\Delta t_\\text{Tag} \\approx 86\\,400\\,\\mathrm s\\cdot\\frac{\\Delta T}{T}$', quelle: UK },
  { id: 'q-exponent', typ: 'warum', vorne: '$T \\sim \\frac{1}{\\sqrt g}$. Um wie viel Prozent ändert sich $T$, wenn $g$ um 1 % größer wird?', hinten: 'Um etwa $-0{,}5\\,\\%$ (Exponent $-\\frac12$).', quelle: UK },
  { id: 'q-stellen', typ: 'begriff', vorne: 'Wie gibt man ein Ergebnis mit Unsicherheit sinnvoll an?', hinten: 'Mit absoluter Unsicherheit und passender Stellenzahl, z. B. $g = (9{,}8 \\pm 0{,}2)\\,\\mathrm{m/s^2}$ – nicht mit mehr Ziffern, als die Unsicherheit hergibt.', quelle: UK },
];
