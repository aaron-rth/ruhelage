## Worum es geht

In Anwendungsaufgaben beschreibt eine Funktion $f$ den **Bestand** einer Größe in Abhängigkeit von der Zeit $t$: Anzahl der Badegäste, Temperatur, Wasserstand, Gewinn. Die Aufgaben sind in Alltagssprache formuliert. Deine Arbeit besteht aus drei Schritten: **übersetzen**, **rechnen**, **zurückübersetzen**.

## Bestand und Änderungsrate

- $f(t)$ ist der **Bestand** zum Zeitpunkt $t$ („Wie viele?“, „Wie hoch?“).
- $f'(t)$ ist die **momentane Änderungsrate** („Wie schnell nimmt zu/ab?“), Einheit: Einheit von $f$ pro Zeiteinheit.
- $\frac{f(t_2) - f(t_1)}{t_2 - t_1}$ ist die **mittlere Änderungsrate** im Zeitraum $[t_1; t_2]$.
- $f''(t)$ sagt, ob die Änderungsrate selbst wächst oder fällt (Zunahme wird stärker oder schwächer).

## Übersetzungstabelle

| Alltagssprache | Mathematik |
|---|---|
| Der Bestand nimmt zu. | $f'(t) > 0$, $f$ streng monoton wachsend |
| Der Bestand bleibt im Zeitraum gleich. | $f(t) = k$ (konstant), $f'(t) = 0$ |
| Höchster Wert in einem bestimmten Zeitraum | lokales Maximum von $f$ |
| Höchster Wert im gesamten Zeitraum | globales Maximum: lokale Maxima **und** Randwerte vergleichen |
| Der Bestand nimmt zu, die Zunahme wird aber immer geringer. | $f'(t) > 0$ und $f''(t) < 0$ (Rechtskurve) |
| Zu welchem Zeitpunkt nimmt der Bestand am stärksten zu? | Maximum von $f'$: Wendestelle von $f$ **oder** Rand |
| Zu welchem Zeitpunkt nimmt er am stärksten ab? | Minimum von $f'$: Wendestelle von $f$ **oder** Rand |
| Wann beträgt der Bestand 50? | $f(t) = 50$ lösen |
| Wann nimmt er um 50 pro Stunde zu? | $f'(t) = 50$ lösen |

> Die häufigste Verwechslung: „Wann sind die **meisten** Gäste da?“ fragt nach dem Maximum von $f$ ($f'(t) = 0$). „Wann kommen die meisten Gäste **pro Stunde dazu**?“ fragt nach dem Maximum von $f'$ ($f''(t) = 0$).

## Randwerte nicht vergessen

Sachaufgaben haben fast immer einen **eingeschränkten Definitionsbereich** $[a; b]$. Der größte oder kleinste Wert kann dort am Rand liegen, wo $f'$ nicht null ist. Deshalb gilt für globale Extrema: Kandidaten aus $f'(t) = 0$ bestimmen und mit $f(a)$ und $f(b)$ vergleichen. Dasselbe gilt für die stärkste Zu- oder Abnahme: Werte von $f'$ an der Wendestelle und an den Rändern vergleichen.

## Beispiel

Die Anzahl der Badegäste in einem Freibad wird für $0 \leq t \leq 8$ durch $f(t) = -t^3 + 9t^2 + 20$ beschrieben ($t$ in Stunden nach 9 Uhr).
Ableitungen: $f'(t) = -3t^2 + 18t = -3t(t - 6)$, $f''(t) = -6t + 18$.

**Wann sind die meisten Gäste da?** $f'(t) = 0$ liefert $t = 0$ (Rand) und $t = 6$. $f''(6) = -18 < 0$, also lokales Maximum, $f(6) = 128$. Randwerte: $f(0) = 20$, $f(8) = 84$. Um 15 Uhr sind mit 128 die meisten Gäste da.

**Wann kommen die meisten Gäste pro Stunde dazu?** Maximum von $f'$: $f''(t) = 0 \iff t = 3$, $f'''(3) = -6 < 0$. $f'(3) = 27$. Randwerte von $f'$: $f'(0) = 0$, $f'(8) = -48$. Um 12 Uhr nimmt die Zahl am stärksten zu, um 27 Gäste pro Stunde.

**Wann nimmt die Zahl am stärksten ab?** Minimum von $f'$ auf $[0; 8]$: Im Inneren gibt es keine Minimumstelle von $f'$, also liegt es am Rand: $f'(8) = -48$. Um 17 Uhr gehen die Gäste am schnellsten, 48 pro Stunde.

**Mittlere Änderungsrate von 9 bis 15 Uhr:** $\frac{f(6) - f(0)}{6} = \frac{108}{6} = 18$ Gäste pro Stunde.

## Antwortsätze

Am Ende immer **im Sachzusammenhang** antworten: mit Uhrzeit oder Zeitangabe, Zahlenwert und Einheit. „$t = 6$“ ist keine Antwort, „Um 15 Uhr sind die meisten Badegäste da, nämlich 128.“ schon.
