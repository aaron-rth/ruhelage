## Worum es geht

Die ganze Differenzialrechnung baut auf einer Frage auf: **Wie steil ist etwas?** Bei einer Geraden ist das einfach, denn sie ist überall gleich steil. Deshalb lohnt es sich, Geraden sicher zu beherrschen, bevor du Kurven untersuchst. Später ersetzt du eine Kurve in einem Punkt durch eine Gerade, die Tangente.

## Die Geradengleichung

Jede (nicht senkrechte) Gerade lässt sich schreiben als

$$y = m x + c$$

- $m$ ist die **Steigung**: Gehst du 1 nach rechts, gehst du $m$ nach oben (bei $m<0$ nach unten).
- $c$ ist der **y-Achsenabschnitt**: Dort schneidet die Gerade die y-Achse, also im Punkt $(0 \mid c)$.

Sonderfälle: $m = 0$ ergibt eine waagerechte Gerade $y = c$. Eine senkrechte Gerade $x = a$ ist **keine Funktion**, weil zu einem x-Wert unendlich viele y-Werte gehören.

## Steigung aus zwei Punkten

Für zwei Punkte $P(x_1 \mid y_1)$ und $Q(x_2 \mid y_2)$ gilt

$$m = \frac{y_2 - y_1}{x_2 - x_1} = \frac{\text{Höhenunterschied}}{\text{Breitenunterschied}}$$

Das ist das **Steigungsdreieck**. Die Reihenfolge der Punkte ist egal, du musst sie nur oben und unten gleich wählen.

*Beispiel:* $P(-1 \mid 5)$ und $Q(3 \mid -3)$ ergeben $m = \frac{-3-5}{3-(-1)} = \frac{-8}{4} = -2$.

## Geradengleichung aufstellen

**Weg 1 (über c):** Steigung $m$ und einen Punkt in $y = mx + c$ einsetzen und nach $c$ auflösen.
Im Beispiel: $5 = -2 \cdot (-1) + c$, also $c = 3$ und $y = -2x + 3$.

**Weg 2 (Punkt-Steigungs-Form):** $y = m(x - x_0) + y_0$ mit einem Punkt $(x_0 \mid y_0)$.
Im Beispiel: $y = -2(x+1) + 5 = -2x + 3$. Diese Form ist genau die spätere Tangentengleichung.

> Probe: Setze den zweiten Punkt ein. $-2 \cdot 3 + 3 = -3$ stimmt.

## Gerade zeichnen

1. Den Punkt $(0 \mid c)$ auf der y-Achse markieren.
2. Von dort ein Steigungsdreieck anlegen: 1 nach rechts, $m$ nach oben. Bei Brüchen wie $m = \frac{2}{3}$ besser 3 nach rechts und 2 nach oben.
3. Die Punkte verbinden.

## Parallele Geraden und Steigungswinkel

- Geraden mit **gleicher Steigung** sind parallel (oder identisch).
- Der **Steigungswinkel** $\alpha$ ist der Winkel zwischen der Geraden und der positiven x-Richtung. Es gilt $\tan(\alpha) = m$, also $\alpha = \tan^{-1}(m)$.
  Beispiel: $m = 1$ ergibt $45°$, $m = 2$ ergibt etwa $63{,}4°$. Bei negativer Steigung ist der Winkel negativ (die Gerade fällt).
