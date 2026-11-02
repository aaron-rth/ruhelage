## Worum es geht

Beim Ableiten und beim grafischen Ableiten musst du Graphen „lesen“ können. Dafür solltest du die wichtigsten **Grundfunktionen** auf einen Blick erkennen und wissen, wie sich ein Graph verändert, wenn man den Term verändert.

## Die Grundfunktionen

| Funktion | Graph und Merkmale |
|---|---|
| $f(x) = x$ | Ursprungsgerade, Steigung 1 |
| $f(x) = x^2$, $x^4$ | Parabel, nach oben offen, symmetrisch zur y-Achse, Tiefpunkt $(0 \mid 0)$, geht durch $(\pm 1 \mid 1)$ |
| $f(x) = x^3$ | von links unten nach rechts oben, punktsymmetrisch zum Ursprung, waagerecht in $(0 \mid 0)$ |
| $f(x) = \frac{1}{x}$ | Hyperbel in zwei Ästen (1. und 3. Quadrant), nähert sich beiden Achsen, nicht definiert für $x = 0$ |
| $f(x) = \frac{1}{x^2}$ | zwei Äste über der x-Achse, symmetrisch zur y-Achse |
| $f(x) = \sqrt{x}$ | nur für $x \geq 0$, startet in $(0 \mid 0)$, steigt immer flacher |
| $f(x) = \sin(x)$ | Welle, Periode $2\pi$, Werte von $-1$ bis $1$, $\sin(0) = 0$ |
| $f(x) = \cos(x)$ | Welle wie Sinus, aber um $\frac{\pi}{2}$ nach links verschoben, $\cos(0) = 1$ |

**Symmetrie bei Potenzen:** Gerade Hochzahl ergibt Achsensymmetrie zur y-Achse, ungerade Hochzahl ergibt Punktsymmetrie zum Ursprung.

## Transformationen

Aus dem Graphen von $f$ entsteht der Graph von $g(x) = a \cdot f\big(b(x-c)\big) + d$ so:

- $+d$: Verschiebung um $d$ **nach oben** (bei $d<0$ nach unten).
- $(x - c)$: Verschiebung um $c$ **nach rechts**. Achtung: $(x + 2)$ heißt 2 nach **links**.
- $a \cdot$: Streckung in y-Richtung mit Faktor $a$. Ist $a < 0$, wird zusätzlich an der x-Achse gespiegelt.
- $b$ in der Klammer: Streckung in x-Richtung mit Faktor $\frac{1}{b}$. Bei Sinus und Kosinus ändert das die Periode zu $\frac{2\pi}{b}$.

*Beispiel:* $g(x) = -2(x-1)^2 + 3$ ist die Normalparabel, gespiegelt (nach unten offen), mit Faktor 2 gestreckt und so verschoben, dass der Scheitel bei $(1 \mid 3)$ liegt.

## Funktionsterm zu einem Graphen angeben

1. Grundfunktion erkennen (Parabel? Welle? Hyperbel?).
2. Einen markanten Punkt suchen (Scheitel, Startpunkt, Symmetriezentrum). Er liefert die Verschiebungen $c$ und $d$.
3. Mit einem weiteren Punkt den Streckfaktor $a$ bestimmen.

*Beispiel:* Parabel mit Scheitel $S(2 \mid -1)$ durch $(0 \mid 3)$: Ansatz $f(x) = a(x-2)^2 - 1$. Mit $(0 \mid 3)$: $3 = 4a - 1$, also $a = 1$ und $f(x) = (x-2)^2 - 1$.

## Wertetabelle und Graph

Wenn du einen Graphen nicht kennst, hilft eine Wertetabelle: x-Werte in gleichen Abständen wählen, $f(x)$ berechnen, Punkte eintragen und zu einer glatten Kurve verbinden. Bei Sinus und Kosinus x-Werte wie $0, \frac{\pi}{2}, \pi, \ldots$ nehmen und den Taschenrechner auf **Bogenmaß (RAD)** stellen.
