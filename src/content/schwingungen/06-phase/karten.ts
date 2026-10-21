import type { Karte } from '../../types';

const L910 = 'Notizen Lehrer 9.10.';
const B165 = 'Buch S. 165';
export const karten: Karte[] = [
  { id: 'ph-omega', typ: 'formel', vorne: 'Kreisfrequenz $\\omega$: Formel und Einheit?', hinten: '$\\omega = \\frac{2\\pi}{T} = 2\\pi f$, Einheit $\\frac1{\\mathrm s}$.', quelle: L910 },
  { id: 'ph-omega-bedeutung', typ: 'begriff', vorne: 'Was bedeutet die Kreisfrequenz anschaulich?', hinten: 'Den **Winkel (im Bogenmaß) pro Sekunde**, den der Punkt auf dem zugehörigen Kreis überstreicht.', quelle: 'Notizen Lehrer 28.9./9.10.' },
  { id: 'ph-f-omega', typ: 'warum', vorne: 'Warum unterscheiden sich $f$ und $\\omega$ immer um $2\\pi$?', hinten: '$f$ zählt ganze Schwingungen pro Sekunde, $\\omega$ zählt den Winkel pro Sekunde. Eine Schwingung entspricht einer Kreisrunde $= 2\\pi$.', quelle: L910 },
  { id: 'ph-phi', typ: 'formel', vorne: 'Phasenwinkel $\\varphi(t)$ (ohne Nullphase)?', hinten: '$\\varphi(t) = \\omega\\cdot t$ – im Bogenmaß.', quelle: L910 },
  { id: 'ph-phi-T2', typ: 'wasPassiert', vorne: 'Welcher Phasenwinkel gehört zu $t = \\frac T2$ und zu $t = T$?', hinten: '$\\varphi(\\frac T2) = \\pi$, $\\varphi(T) = 2\\pi$.', quelle: L910 },
  { id: 'ph-phi-T4', typ: 'wasPassiert', vorne: 'Welcher Phasenwinkel gehört zu $t = \\frac T4$, und wo ist der Körper bei $s = \\hat s\\sin\\varphi$?', hinten: '$\\varphi = \\frac\\pi2$ → $s = +\\hat s$, oberer Umkehrpunkt.', quelle: L910 },
  { id: 'ph-kreis', typ: 'begriff', vorne: 'Wie hängen Kreisbewegung und harmonische Schwingung zusammen?', hinten: 'Die Schwingung ist die **Projektion** (der Schatten) einer gleichförmigen Kreisbewegung auf eine Achse: $s = \\hat s\\sin\\varphi$.', quelle: 'Notizen Lehrer 28.9.; Buch S. 160' },
  { id: 'ph-sin-kreis', typ: 'begriff', vorne: 'Was ist $\\sin\\varphi$ am Einheitskreis?', hinten: 'Die **Höhe** (y-Koordinate) des Punktes, der um den Winkel $\\varphi$ gedreht ist. $\\cos\\varphi$ ist die x-Koordinate.', quelle: 'Buch S. 169 (Abb. 4)' },
  { id: 'ph-allgemein', typ: 'formel', vorne: 'Allgemeiner Ansatz für jede harmonische Schwingung?', hinten: '$s(t) = \\hat s\\sin(\\omega t + \\varphi_0)$ mit der **Nullphase** $\\varphi_0$.', quelle: B165 },
  { id: 'ph-phi0', typ: 'begriff', vorne: 'Was ist die Nullphase $\\varphi_0$?', hinten: 'Der Phasenwinkel zur Zeit $t = 0$ – sie legt fest, **wo** die Schwingung startet.', quelle: B165 },
  { id: 'ph-phi0-pi2', typ: 'wasPassiert', vorne: '$\\varphi_0 = \\frac\\pi2$: Wo startet die Schwingung?', hinten: 'Im **oberen Umkehrpunkt**. Es gilt $\\sin(\\omega t + \\frac\\pi2) = \\cos(\\omega t)$.', quelle: B165 },
  { id: 'ph-phi0-pi', typ: 'wasPassiert', vorne: '$\\varphi_0 = \\pi$: Wo startet die Schwingung?', hinten: 'In der **Ruhelage**, Bewegung **nach unten** ($-\\sin$).', quelle: B165 },
  { id: 'ph-phi0-3pi2', typ: 'wasPassiert', vorne: '$\\varphi_0 = \\frac{3\\pi}2$: Wo startet die Schwingung?', hinten: 'Im **unteren Umkehrpunkt** ($-\\cos$).', quelle: B165 },
  { id: 'ph-verschiebung', typ: 'wasPassiert', vorne: 'Was macht $\\varphi_0 > 0$ mit der Sinuskurve im s-t-Diagramm?', hinten: 'Sie wird um $\\frac{\\varphi_0}{\\omega}$ nach **links** verschoben.', quelle: 'Buch S. 165 (Abb. 2)' },
  { id: 'ph-anfang', typ: 'formel', vorne: 'Wie lauten $s_0$ und $v_0$ für $s(t) = \\hat s\\sin(\\omega t + \\varphi_0)$?', hinten: '$s_0 = \\hat s\\sin\\varphi_0$ und $v_0 = \\hat s\\,\\omega\\cos\\varphi_0$.', quelle: B165 },
  { id: 'ph-amp-anfang', typ: 'herleitung', vorne: 'Wie bekommst du $\\hat s$ aus $s_0$ und $v_0$?', hinten: 'Beide Gleichungen quadrieren und addieren ($\\sin^2+\\cos^2=1$): $$\\hat s = \\sqrt{s_0^2 + \\left(\\tfrac{v_0}{\\omega}\\right)^2}$$', quelle: B165 },
  { id: 'ph-arcsin-falle', typ: 'fehler', vorne: 'Warum reicht $\\varphi_0 = \\arcsin\\frac{s_0}{\\hat s}$ allein **nicht**?', hinten: '$\\arcsin$ liefert nur Winkel zwischen $-\\frac\\pi2$ und $\\frac\\pi2$. Es gibt aber immer **zwei** Winkel mit gleichem Sinus. Welcher stimmt, verrät das Vorzeichen von $v_0$ (also von $\\cos\\varphi_0$).', quelle: 'Übungsklausur (Aufgabentyp)' },
  { id: 'ph-quadrant-2', typ: 'herleitung', vorne: '$s_0 > 0$ und $v_0 < 0$. In welchem Quadranten liegt $\\varphi_0$, und wie rechnest du?', hinten: '2. Quadrant ($\\sin > 0$, $\\cos < 0$): $\\varphi_0 = \\pi - \\arcsin\\frac{s_0}{\\hat s}$.', quelle: B165 },
  { id: 'ph-quadrant-3', typ: 'herleitung', vorne: '$s_0 < 0$ und $v_0 < 0$. Wie rechnest du $\\varphi_0$ aus?', hinten: '3. Quadrant: $\\varphi_0 = \\pi - \\arcsin\\frac{s_0}{\\hat s}$ (der arcsin ist hier negativ, also landet man über $\\pi$).', quelle: B165 },
  { id: 'ph-quadrant-4', typ: 'herleitung', vorne: '$s_0 < 0$ und $v_0 > 0$. Wie rechnest du $\\varphi_0$ im Intervall $[0;2\\pi)$ aus?', hinten: '4. Quadrant: $\\varphi_0 = 2\\pi + \\arcsin\\frac{s_0}{\\hat s}$ (arcsin negativ).', quelle: B165 },
  { id: 'ph-probe', typ: 'warum', vorne: 'Wie prüfst du, ob dein $\\varphi_0$ im richtigen Quadranten liegt?', hinten: 'Setz es in **beide** Gleichungen ein: $\\hat s\\sin\\varphi_0$ muss $s_0$ ergeben und $\\hat s\\omega\\cos\\varphi_0$ muss $v_0$ ergeben – mit Vorzeichen.', quelle: B165 },
  { id: 'ph-nulldurchgang', typ: 'herleitung', vorne: 'Wann ist der erste Nulldurchgang von $s(t) = \\hat s\\sin(\\omega t + \\varphi_0)$ für $0 < \\varphi_0 < \\pi$?', hinten: 'Bei $\\omega t + \\varphi_0 = \\pi$, also $t = \\frac{\\pi - \\varphi_0}{\\omega}$.', quelle: B165 },
  { id: 'ph-grad-rad', typ: 'formel', vorne: 'Wie rechnest du Grad in Bogenmaß um?', hinten: '$\\varphi_\\text{rad} = \\varphi_\\text{Grad}\\cdot\\frac{\\pi}{180^\\circ}$. Z. B. $90^\\circ = \\frac\\pi2 \\approx 1{,}57$.', quelle: L910 },
  { id: 'ph-einheit-phi', typ: 'begriff', vorne: 'In welcher Einheit wird der Phasenwinkel angegeben?', hinten: 'In Grad oder im Bogenmaß (rad). Gerechnet wird mit dem **Bogenmaß**, sonst stimmt $\\varphi = \\omega t$ nicht.', quelle: L910 },
  { id: 'ph-omega-T', typ: 'wasPassiert', vorne: '$T$ halbiert sich. Was passiert mit $\\omega$?', hinten: '$\\omega$ **verdoppelt** sich ($\\omega = \\frac{2\\pi}{T}$).', quelle: L910 },
  { id: 'ph-omega-falle', typ: 'fehler', vorne: 'Jemand rechnet $\\hat v = \\hat s\\cdot f$. Was ist falsch?', hinten: 'Es muss $\\hat v = \\hat s\\cdot\\omega$ heißen. Mit $f$ ist das Ergebnis um den Faktor $2\\pi$ zu klein.', quelle: 'Buch S. 157' },
];
