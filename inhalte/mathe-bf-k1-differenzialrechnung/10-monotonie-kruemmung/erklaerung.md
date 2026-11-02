## Worum es geht

**Monotonie** beschreibt, ob eine Funktion steigt oder fällt. **Krümmung** beschreibt, in welche Richtung sich der Graph biegt. Mit $f'$ und $f''$ kann man beides rechnerisch untersuchen, ohne den Graphen zu zeichnen.

## Monotonie: Definition

$f$ heißt auf einem Intervall $I$

- **streng monoton wachsend**, wenn für alle $x_1 < x_2$ aus $I$ gilt: $f(x_1) < f(x_2)$,
- **streng monoton fallend**, wenn für alle $x_1 < x_2$ aus $I$ gilt: $f(x_1) > f(x_2)$.

Gilt nur $\leq$ bzw. $\geq$, sagt man „monoton wachsend“ bzw. „monoton fallend“ (der Graph darf dann auch waagerechte Stücke haben).

## Der Monotoniesatz

Ist $f$ auf einem Intervall $I$ differenzierbar, dann gilt:

- Ist $f'(x) > 0$ für alle $x \in I$, dann ist $f$ auf $I$ streng monoton wachsend.
- Ist $f'(x) < 0$ für alle $x \in I$, dann ist $f$ auf $I$ streng monoton fallend.

**Die Umkehrung gilt nicht!** $f(x) = x^3$ ist auf ganz $\mathbb{R}$ streng monoton wachsend, aber $f'(0) = 0$. Einzelne Stellen mit $f'(x) = 0$ stören die strenge Monotonie also nicht.

## Monotonie rechnerisch untersuchen

*Beispiel:* $f(x) = x^3 - 6x^2 + 9x + 1$

1. **Ableitung:** $f'(x) = 3x^2 - 12x + 9 = 3(x - 1)(x - 3)$
2. **Nullstellen von $f'$:** $x_1 = 1$, $x_2 = 3$
3. **Intervalle:** $(-\infty; 1)$, $(1; 3)$, $(3; \infty)$
4. **Testwerte in $f'$:** $f'(0) = 9 > 0$, $f'(2) = -3 < 0$, $f'(4) = 9 > 0$
5. **Ergebnis:** $f$ ist streng monoton wachsend auf $(-\infty; 1]$ und auf $[3; \infty)$, streng monoton fallend auf $[1; 3]$.

Die Randstellen (hier 1 und 3) darf man zu beiden angrenzenden Intervallen dazunehmen. In der Vorzeichentabelle sieht das so aus:

| $x$ | $x < 1$ | $1$ | $1 < x < 3$ | $3$ | $x > 3$ |
|---|---|---|---|---|---|
| $f'(x)$ | $+$ | $0$ | $-$ | $0$ | $+$ |
| $f$ | steigt | | fällt | | steigt |

> Testwerte immer in $f'$ einsetzen, nicht in $f$!

## Krümmung

Stell dir vor, du fährst mit dem Fahrrad von links nach rechts auf dem Graphen:

- Musst du nach **links** lenken, ist der Graph eine **Linkskurve** (nach oben offen, wie ∪).
- Musst du nach **rechts** lenken, ist er eine **Rechtskurve** (nach unten offen, wie ∩).

Bei einer Linkskurve werden die Steigungen von links nach rechts immer größer, $f'$ wächst also. Darum gilt:

- $f''(x) > 0$ für alle $x \in I$ ⇒ Graph von $f$ ist auf $I$ **linksgekrümmt**.
- $f''(x) < 0$ für alle $x \in I$ ⇒ Graph von $f$ ist auf $I$ **rechtsgekrümmt**.

## Krümmung rechnerisch untersuchen

Gleiches Vorgehen wie bei der Monotonie, nur mit $f''$:

Im Beispiel: $f''(x) = 6x - 12$, Nullstelle $x = 2$. $f''(0) = -12 < 0$ und $f''(3) = 6 > 0$.
Also ist der Graph für $x < 2$ eine Rechtskurve und für $x > 2$ eine Linkskurve. Bei $x = 2$ wechselt die Krümmung (Wendestelle, siehe nächstes Thema).

## Monotonie und Krümmung zusammen

| Verlauf | Monotonie | Krümmung |
|---|---|---|
| steigt immer stärker | wachsend | links |
| steigt immer schwächer | wachsend | rechts |
| fällt immer stärker | fallend | rechts |
| fällt immer schwächer | fallend | links |
