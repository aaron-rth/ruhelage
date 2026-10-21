import type { Karte } from '../../types';

const L210 = 'Notizen Lehrer 2.10.';
const B161C = 'Buch S. 161 (Material C)';
export const karten: Karte[] = [
  { id: 'hm-kriterien', typ: 'begriff', vorne: 'Nenne die **drei Kriterien** für eine harmonische Schwingung.', hinten: '1. Zeitverlauf durch sin/cos beschreibbar (Projektion einer Kreisbewegung). 2. Rückstellkraft proportional zur Auslenkung: $F_R = -Ds$. 3. $T$ hängt nicht von der Amplitude ab.', quelle: L210 },
  { id: 'hm-genau-dann', typ: 'warum', vorne: 'Warum reicht es, **ein** Kriterium zu widerlegen, um zu zeigen, dass eine Schwingung nicht harmonisch ist?', hinten: 'Die Schwingung ist **genau dann** harmonisch, wenn alle gelten – die Kriterien hängen über die DGL zusammen. Fällt eines weg, ist sie nicht harmonisch.', quelle: L210 },
  { id: 'hm-zusammenhang', typ: 'herleitung', vorne: 'Wie hängen lineares Kraftgesetz und sin-Verlauf zusammen?', hinten: '$F_R = -Ds$ → DGL $\\ddot s = -\\frac Dm s$ → Lösungen sind sin/cos mit $\\omega = \\sqrt{D/m}$, unabhängig von $\\hat s$.', quelle: 'Buch S. 162–163, 179' },
  { id: 'hm-projektion', typ: 'begriff', vorne: 'Was zeigt der „Schatten“ einer gleichförmigen Kreisbewegung?', hinten: 'Eine **harmonische Schwingung** – die Projektion auf eine Achse ist $\\hat s\\sin(\\omega t)$.', quelle: 'Notizen Lehrer 28.9.; Buch S. 160 (Material A)' },
  { id: 'hm-knick-kraft', typ: 'begriff', vorne: 'Welche Kraft wirkt auf den Wagen auf der Knickbahn, und wie groß ist sie?', hinten: 'Die Hangabtriebskraft $F_H = m g\\sin\\alpha$ – sie ist **konstant** (zeigt nur immer zur Mitte).', quelle: B161C },
  { id: 'hm-knick-nicht-linear', typ: 'warum', vorne: 'Warum gilt für die Knickbahn **kein** lineares Kraftgesetz?', hinten: 'Die Rückstellkraft hängt nicht von der Auslenkung ab: Ob 2 cm oder 20 cm vom Knick entfernt – immer $mg\\sin\\alpha$.', quelle: B161C },
  { id: 'hm-knick-bewegung', typ: 'fehler', vorne: 'Stimmt das? „Der Wagen auf der Knickbahn fährt mit gleichbleibender Geschwindigkeit hin und her.“', hinten: '**Nein.** Er wird **gleichmäßig beschleunigt**: nach unten immer schneller, nach oben immer langsamer ($a = g\\sin\\alpha$).', quelle: B161C },
  { id: 'hm-knick-t1', typ: 'formel', vorne: 'Knickbahn: Zeit vom Loslassen bis zur Mitte?', hinten: '$$t_1 = \\sqrt{\\frac{2\\hat s}{g\\sin\\alpha}}$$ aus $\\hat s = \\frac12 a t_1^2$ mit $a = g\\sin\\alpha$.', quelle: B161C },
  { id: 'hm-knick-T', typ: 'formel', vorne: 'Knickbahn: Periodendauer?', hinten: '$T = 4t_1 = 4\\sqrt{\\frac{2\\hat s}{g\\sin\\alpha}}$ – vier gleiche Abschnitte.', quelle: B161C },
  { id: 'hm-knick-warum', typ: 'warum', vorne: 'Woran erkennt man an $T$, dass die Knickbahn-Schwingung **nicht harmonisch** ist?', hinten: '$\\hat s$ steht in der Formel: $T \\sim \\sqrt{\\hat s}$. Doppelte Amplitude → $\\sqrt2$-fache Periodendauer.', quelle: B161C },
  { id: 'hm-knick-vt', typ: 'wasPassiert', vorne: 'Wie sieht das v-t-Diagramm der Knickbahn aus?', hinten: 'Eine **Zickzacklinie** aus geraden Stücken (konstante Beschleunigung) – kein Sinus.', quelle: B161C },
  { id: 'hm-feder-hart', typ: 'wasPassiert', vorne: 'Eine Feder wird bei großen Auslenkungen härter ($D$ wächst). Was passiert mit $T$ bei großer Amplitude?', hinten: '$T$ wird **kleiner** – die Schwingung ist nicht harmonisch, $T$ hängt von $\\hat s$ ab.', quelle: 'Buch S. 167 (Material D)' },
  { id: 'hm-fahrwerk', typ: 'warum', vorne: 'Warum baut man Fahrwerksfedern absichtlich nichtlinear?', hinten: 'Kleine Unebenheiten sollen weich abgefedert werden, große Stöße hart (damit die Feder nicht durchschlägt).', quelle: 'Buch S. 167 (Material D)' },
  { id: 'hm-gummi', typ: 'warum', vorne: 'Wann schwingt ein Körper an einem Gummiband harmonisch?', hinten: 'Nur, wenn er im Bereich bleibt, in dem die Kennlinie des Gummibands annähernd **linear** ist.', quelle: 'Buch S. 166 (Versuch A)' },
  { id: 'hm-faden-gross', typ: 'wasPassiert', vorne: 'Ist ein Fadenpendel bei $40^\\circ$ Auslenkung harmonisch?', hinten: 'Streng genommen **nicht**: Die Kleinwinkelnäherung gilt nicht mehr, $T$ wird größer und hängt von der Amplitude ab.', quelle: 'Buch S. 178' },
  { id: 'hm-kennlinie', typ: 'begriff', vorne: 'Wie sieht die $F$-$s$-Kennlinie einer harmonischen Schwingung aus?', hinten: 'Eine **fallende Ursprungsgerade**.', quelle: 'Buch S. 158' },
];
