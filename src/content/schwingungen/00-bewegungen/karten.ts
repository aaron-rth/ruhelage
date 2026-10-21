import type { Karte } from '../../types';

const B151 = 'Buch S. 151';
const L189 = 'Notizen Lehrer 18.9.';
export const karten: Karte[] = [
  { id: 'bw-steigung-s', typ: 'begriff', vorne: 'Was bedeutet die **Steigung** im s-t-Diagramm?', hinten: 'Die **Geschwindigkeit** $v = \\frac{\\Delta s}{\\Delta t}$.', quelle: B151 },
  { id: 'bw-steigung-v', typ: 'begriff', vorne: 'Was bedeutet die **Steigung** im v-t-Diagramm?', hinten: 'Die **Beschleunigung** $a = \\frac{\\Delta v}{\\Delta t}$.', quelle: B151 },
  { id: 'bw-flaeche-v', typ: 'begriff', vorne: 'Was bedeutet die **Fläche** unter dem v-t-Graphen?', hinten: 'Den zurückgelegten **Weg**.', quelle: B151 },
  { id: 'bw-waagerecht', typ: 'wasPassiert', vorne: 'Ein s-t-Graph verläuft ein Stück **waagerecht**. Was macht der Körper?', hinten: 'Er **steht** still ($v = 0$).', quelle: B151 },
  { id: 'bw-gerade', typ: 'wasPassiert', vorne: 'Der s-t-Graph ist eine **schräge Gerade**. Was heißt das?', hinten: 'Gleichförmige Bewegung: konstante Geschwindigkeit, $a = 0$.', quelle: B151 },
  { id: 'bw-gekruemmt', typ: 'wasPassiert', vorne: 'Woran erkennt man im s-t-Diagramm, dass die Bewegung **nicht** gleichförmig ist?', hinten: 'Der Graph ist **gekrümmt** – die Steigung (Geschwindigkeit) ändert sich.', quelle: 'Buch S. 151 Aufg. 7' },
  { id: 'bw-punkt', typ: 'formel', vorne: 'Wie hängen $s$, $v$ und $a$ über Ableitungen zusammen?', hinten: '$v = \\dot s$, $a = \\dot v = \\ddot s$ (Punkt = Ableitung nach der Zeit).', quelle: 'Notizen Lehrer 23.9.' },
  { id: 'bw-fall', typ: 'herleitung', vorne: 'Freier Fall: $h(t) = h_0 - \\frac g2 t^2$. Wie lauten $v(t)$ und $a(t)$?', hinten: '$v(t) = -g\\,t$, $a(t) = -g$.', quelle: 'Buch S. 151 Aufg. 8' },
  { id: 'bw-f', typ: 'formel', vorne: 'Zusammenhang zwischen $T$ und $f$?', hinten: '$f = \\frac1T$ und $T = \\frac1f$ (Kehrwerte). $[f] = 1\\,\\mathrm{Hz} = \\frac1{\\mathrm s}$.', quelle: L189 },
  { id: 'bw-n-t', typ: 'formel', vorne: '$n$ Schwingungen in der Zeit $\\Delta t$. Wie groß ist $f$?', hinten: '$f = \\frac{n}{\\Delta t}$', quelle: B151 },
  { id: 'bw-mikro', typ: 'formel', vorne: 'Was bedeuten die Vorsilben **milli**, **mikro** und **nano**?', hinten: 'milli $= 10^{-3}$, mikro (µ) $= 10^{-6}$, nano $= 10^{-9}$.', quelle: L189 },
  { id: 'bw-kilo', typ: 'formel', vorne: 'Was bedeuten **kilo**, **Mega**, **Giga**?', hinten: 'kilo $= 10^3$, Mega $= 10^6$, Giga $= 10^9$.', quelle: L189 },
  { id: 'bw-amp-laut', typ: 'begriff', vorne: 'Was bestimmt beim Ton die **Lautstärke**, was die **Tonhöhe**?', hinten: 'Lautstärke ↔ **Amplitude**. Tonhöhe ↔ **Frequenz**.', quelle: B151 },
  { id: 'bw-freq-fehler', typ: 'fehler', vorne: 'Stimmt das? „Je höher die Frequenz, desto lauter der Ton.“', hinten: '**Nein.** Höhere Frequenz → **höherer** Ton. Lauter wird er durch eine größere **Amplitude**.', quelle: B151 },
  { id: 'bw-klang', typ: 'warum', vorne: 'Geige und Posaune spielen denselben Ton. Warum klingen sie trotzdem verschieden?', hinten: 'Gleiche Grundfrequenz, aber unterschiedliche **Form** der Schwingung (Klangfarbe durch Obertöne).', quelle: 'Buch S. 151 Aufg. 2' },
  { id: 'bw-geraeusch', typ: 'warum', vorne: 'Woran erkennst du im Schwingungsbild, dass es kein Ton ist?', hinten: 'Es gibt kein **regelmäßig wiederkehrendes** Muster – keine feste Periodendauer.', quelle: 'Buch S. 151 Aufg. 4' },
];
