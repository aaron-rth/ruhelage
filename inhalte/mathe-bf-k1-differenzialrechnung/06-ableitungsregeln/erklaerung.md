## Worum es geht

Ableitungen über den Grenzwert zu berechnen ist mühsam. Zum Glück gibt es **Ableitungsregeln**, die man einmal mit dem Grenzwert begründet und dann einfach anwendet. Mit Potenz-, Faktor- und Summenregel kannst du jede ganzrationale Funktion ableiten.

## Die drei Grundregeln

**Potenzregel:** $f(x) = x^r \Rightarrow f'(x) = r \cdot x^{r-1}$ (für jede reelle Zahl $r \neq 0$).
„Hochzahl nach vorne, Hochzahl um 1 verkleinern.“ Beispiel: $(x^7)' = 7x^6$.

**Faktorregel:** $f(x) = c \cdot g(x) \Rightarrow f'(x) = c \cdot g'(x)$.
Ein konstanter Faktor bleibt einfach stehen. Beispiel: $(5x^3)' = 5 \cdot 3x^2 = 15x^2$.

**Summenregel:** $f(x) = g(x) + h(x) \Rightarrow f'(x) = g'(x) + h'(x)$.
Summen (und Differenzen) leitet man Summand für Summand ab.

Außerdem: Eine **Konstante** hat die Ableitung $0$, denn ihr Graph ist waagerecht. Und $(x)' = 1$.

*Beispiel:* $f(x) = 2x^5 - 3x^2 + 7x - 4 \Rightarrow f'(x) = 10x^4 - 6x + 7$.

## Wichtige Ableitungen im Überblick

| $f(x)$ | $f'(x)$ |
|---|---|
| $c$ (Zahl) | $0$ |
| $x^n$ | $n x^{n-1}$ |
| $\sqrt{x} = x^{\frac12}$ | $\frac12 x^{-\frac12} = \frac{1}{2\sqrt{x}}$ |
| $\frac{1}{x} = x^{-1}$ | $-x^{-2} = -\frac{1}{x^2}$ |
| $\sin(x)$ | $\cos(x)$ |
| $\cos(x)$ | $-\sin(x)$ |

## Erst umformen, dann ableiten

Die Potenzregel funktioniert nur bei Termen der Form $c \cdot x^r$. Wurzeln, Brüche und Klammern musst du vorher umschreiben:

- $g(x) = 4\sqrt{x} - \frac{3}{x} = 4x^{\frac12} - 3x^{-1} \Rightarrow g'(x) = 2x^{-\frac12} + 3x^{-2} = \frac{2}{\sqrt{x}} + \frac{3}{x^2}$
- $h(x) = (x + 3)^2 = x^2 + 6x + 9 \Rightarrow h'(x) = 2x + 6$
- $k(x) = \frac{x^3 + 2x}{x} = x^2 + 2$ (für $x \neq 0$) $\Rightarrow k'(x) = 2x$

> Achtung: Ein Produkt oder einen Quotienten darf man **nicht** faktorweise ableiten. $(x^2 \cdot x^3)' \neq 2x \cdot 3x^2$. Richtig: $x^5$, also $5x^4$. Für echte Produkte gibt es später die Produktregel.

## Sinus und Kosinus

$(\sin x)' = \cos x$ und $(\cos x)' = -\sin x$. Leitet man immer weiter ab, wiederholt sich alles nach vier Schritten:

$$\sin x \;\to\; \cos x \;\to\; -\sin x \;\to\; -\cos x \;\to\; \sin x$$

Grafisch passt das: Wo der Sinusgraph am steilsten steigt (bei $x = 0$), hat der Kosinus seinen Hochpunkt.

## Höhere Ableitungen

Leitet man $f'$ noch einmal ab, erhält man die **zweite Ableitung** $f''$, dann $f'''$, $f^{(4)}$ usw.

*Beispiel:* $f(x) = 2x^5 - 3x^2 + 7x - 4$:
$f'(x) = 10x^4 - 6x + 7$, $f''(x) = 40x^3 - 6$, $f'''(x) = 120x^2$.

Bei einer **ganzrationalen Funktion** vom Grad $n$ (höchste Hochzahl $n$) sinkt der Grad bei jedem Ableiten um 1. Die $n$-te Ableitung ist eine Konstante, ab der $(n+1)$-ten ist alles $0$.

Wozu? $f''$ beschreibt, wie sich die Steigung ändert, also die **Krümmung** des Graphen. Das brauchst du später für Wendepunkte und das Extremstellen-Kriterium.
