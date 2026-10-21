import type { Karte } from '../../types';

const B154 = 'Buch S. 154';
const B159 = 'Buch S. 159';
const B164 = 'Buch S. 164';
export const karten: Karte[] = [
  { id: 'fa-laenge', typ: 'begriff', vorne: 'Was ist die **Pendellänge** $\\ell$?', hinten: 'Der Abstand vom Aufhängepunkt bis zum **Schwerpunkt** des Pendelkörpers.', quelle: B154 },
  { id: 'fa-T', typ: 'formel', vorne: 'Periodendauer des Fadenpendels?', hinten: '$$T = 2\\pi\\sqrt{\\frac{\\ell}{g}}$$ (für kleine Winkel)', quelle: B164 },
  { id: 'fa-masse', typ: 'warum', vorne: 'Warum hängt $T$ beim Fadenpendel **nicht** von der Masse ab?', hinten: 'Größere Masse bedeutet mehr Trägheit, aber auch eine proportional größere Rückstellkraft $mg\\sin\\alpha$. Beides gleicht sich aus – wie beim freien Fall.', quelle: B154 },
  { id: 'fa-masse-fehler', typ: 'fehler', vorne: 'Stimmt das? „Ein schwererer Pendelkörper schwingt langsamer.“', hinten: '**Nein.** Beim Fadenpendel kürzt sich $m$ heraus: $T = 2\\pi\\sqrt{\\ell/g}$. (Beim **Federpendel** stimmt es dagegen!)', quelle: B154 },
  { id: 'fa-wurzel', typ: 'wasPassiert', vorne: 'Was passiert mit $T$, wenn man die Pendellänge **vervierfacht**?', hinten: '$T$ **verdoppelt** sich, denn $T \\sim \\sqrt\\ell$.', quelle: B154 },
  { id: 'fa-k', typ: 'formel', vorne: 'Wie groß ist die Proportionalitätskonstante in $T = k\\sqrt\\ell$?', hinten: '$k = \\frac{2\\pi}{\\sqrt g} \\approx 2\\,\\frac{\\mathrm s}{\\sqrt{\\mathrm m}}$ (genauer $2{,}006$).', quelle: 'Buch S. 154, 164' },
  { id: 'fa-kraefte', typ: 'begriff', vorne: 'Welche Kräfte wirken auf den Pendelkörper (ohne Reibung)?', hinten: 'Gewichtskraft $\\vec F_G$ (nach unten) und Fadenkraft (zum Aufhängepunkt).', quelle: 'Buch S. 159; Notizen Lehrer 28.9.' },
  { id: 'fa-rueckstell', typ: 'formel', vorne: 'Rückstellkraft beim Fadenpendel (exakt)?', hinten: '$F_R = -F_G\\cdot\\sin\\alpha = -m g\\sin\\alpha$ – die Komponente der Gewichtskraft tangential zur Bahn.', quelle: B159 },
  { id: 'fa-sin', typ: 'herleitung', vorne: 'Wie hängen $\\sin\\alpha$, $s_h$ und $\\ell$ zusammen?', hinten: '$\\sin\\alpha = \\frac{s_h}{\\ell}$ (Gegenkathete durch Hypotenuse im Dreieck aus Faden und Senkrechter).', quelle: 'Buch S. 159, 161 (Material D)' },
  { id: 'fa-kleinwinkel', typ: 'begriff', vorne: 'Was besagt die **Kleinwinkelnäherung**?', hinten: 'Für $\\alpha \\le 10^\\circ$ gilt $\\sin\\alpha \\approx \\alpha$ (Bogenmaß) und $s_h \\approx s$. Fehler bei $10^\\circ$: etwa $0{,}5\\,\\%$.', quelle: 'Buch S. 159, 161 (Material D)' },
  { id: 'fa-linear', typ: 'herleitung', vorne: 'Wie wird aus $F_R = -mg\\frac{s_h}{\\ell}$ ein lineares Kraftgesetz?', hinten: 'Mit $s_h \\approx s$ (kleine Winkel): $F_R = -\\frac{mg}{\\ell}\\cdot s$, also $D = \\frac{mg}{\\ell}$.', quelle: 'Notizen Lehrer 28.9.' },
  { id: 'fa-D', typ: 'formel', vorne: 'Richtgröße des Fadenpendels?', hinten: '$D = \\frac{m\\cdot g}{\\ell}$', quelle: B159 },
  { id: 'fa-D-einsetzen', typ: 'herleitung', vorne: 'Wie erhältst du $T$ des Fadenpendels aus der Formel des Federpendels?', hinten: '$D = \\frac{mg}{\\ell}$ in $T = 2\\pi\\sqrt{\\frac mD}$ einsetzen: $T = 2\\pi\\sqrt{\\frac{m\\ell}{mg}} = 2\\pi\\sqrt{\\frac\\ell g}$.', quelle: 'Buch S. 164 Aufg. 1' },
  { id: 'fa-sekunde', typ: 'begriff', vorne: 'Was ist ein **Sekundenpendel**, und wie lang ist es?', hinten: 'Ein Pendel mit $T = 2\\,\\mathrm s$ (jeder Ausschlag dauert 1 s). Auf der Erde ist es etwa $0{,}994\\,\\mathrm m$ lang.', quelle: 'Buch S. 164 Aufg. 3' },
  { id: 'fa-g', typ: 'formel', vorne: 'Wie bestimmst du den Ortsfaktor $g$ mit einem Fadenpendel?', hinten: '$\\ell$ und $T$ messen, dann $g = \\frac{4\\pi^2\\,\\ell}{T^2}$.', quelle: 'Buch S. 188 (Training I)' },
  { id: 'fa-mehrere', typ: 'warum', vorne: 'Warum misst man die Zeit für **mehrere** Perioden?', hinten: 'Der Fehler beim Starten/Stoppen der Uhr ist ungefähr gleich groß – verteilt auf viele Perioden wird der Fehler pro Periode kleiner.', quelle: 'Buch S. 154 (Randspalte)' },
  { id: 'fa-gross', typ: 'warum', vorne: 'Warum ist $T$ bei **großen** Auslenkwinkeln größer als $2\\pi\\sqrt{\\ell/g}$?', hinten: 'Für große $\\alpha$ ist $\\sin\\alpha$ deutlich kleiner als $\\alpha$. Die tatsächliche Kraft zur Ruhelage hin bleibt also hinter dem linearen Gesetz zurück – weniger Beschleunigung, längere Periode.', quelle: 'Buch S. 178; Übungsklausur (Aufgabentyp)' },
  { id: 'fa-mond', typ: 'wasPassiert', vorne: 'Was passiert mit $T$ eines Fadenpendels auf dem Mond ($g$ etwa ein Sechstel)?', hinten: '$T$ wird $\\sqrt6 \\approx 2{,}4$-mal so groß.', quelle: 'Buch S. 154 Aufg. 4' },
  { id: 'fa-schaukel', typ: 'warum', vorne: 'Hängt die Periodendauer einer Schaukel von der Zahl der Kinder darauf ab?', hinten: 'Nein (im Modell Fadenpendel) – $T$ hängt nur von $\\ell$ und $g$ ab. Eine Schaukel taugt nicht als Waage.', quelle: B164 },
  { id: 'fa-fadenkraft', typ: 'warum', vorne: 'Wozu dient die Komponente der Kräfte **entlang** des Fadens?', hinten: 'Sie hält den Körper auf der Kreisbahn (Zentripetalkraft). Sie ist umso größer, je schneller der Körper ist – am größten in der Ruhelage.', quelle: B159 },
  { id: 'fa-harmonisch', typ: 'warum', vorne: 'Ist die Schwingung eines Fadenpendels harmonisch?', hinten: 'Nur näherungsweise, für **kleine Winkel**. Dann gilt ein lineares Kraftgesetz und $T$ hängt nicht von $\\hat\\alpha$ ab.', quelle: 'Buch S. 154, 164' },
];
