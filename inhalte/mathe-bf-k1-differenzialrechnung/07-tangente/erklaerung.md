## Worum es geht

Die **Tangente** an den Graphen von $f$ im Punkt $P(a \mid f(a))$ ist die Gerade, die durch $P$ geht und dort genau die Steigung des Graphen hat, also $f'(a)$. Tangenten tauchen in fast jeder Klausur auf: Gleichung aufstellen, Punkte mit bestimmter Steigung finden, Schnittpunkte berechnen.

## Tangentengleichung aufstellen

**Allgemeine Tangentengleichung:**

$$y = f'(a)\,(x - a) + f(a)$$

Das ist die Punkt-Steigungs-Form einer Geraden mit $m = f'(a)$ und dem Punkt $(a \mid f(a))$.

*Beispiel:* $f(x) = x^3 - 3x + 1$, Tangente im Punkt $P(2 \mid f(2))$.

1. $f(2) = 8 - 6 + 1 = 3$, also $P(2 \mid 3)$.
2. $f'(x) = 3x^2 - 3$, also $f'(2) = 9$.
3. Einsetzen: $y = 9(x - 2) + 3 = 9x - 15$.

**Alternativer Weg über $y = mx + c$:** $m = f'(2) = 9$, dann $P$ einsetzen: $3 = 9 \cdot 2 + c$, also $c = -15$. Ergebnis wie oben.

> Häufiger Fehler: $f(a)$ und $f'(a)$ verwechseln. $f(a)$ ist eine **Höhe** (y-Wert des Punktes), $f'(a)$ ist eine **Steigung**.

## Punkte mit vorgegebener Steigung

Gesucht sind die Stellen, an denen der Graph die Steigung $m$ hat. Ansatz: $f'(x) = m$.

*Beispiel:* Wo hat $f(x) = x^3 - 3x + 1$ die Steigung 9?
$3x^2 - 3 = 9 \iff x^2 = 4 \iff x = \pm 2$. Punkte: $(2 \mid 3)$ und $(-2 \mid -1)$.

Typische Varianten:

| Aufgabe | Ansatz |
|---|---|
| waagerechte Tangente | $f'(x) = 0$ |
| Tangente parallel zur Geraden $y = 4x - 7$ | $f'(x) = 4$ |
| Steigungswinkel 45° | $f'(x) = \tan(45°) = 1$ |

Nicht vergessen: Am Ende die **y-Werte** mit $f$ (nicht mit $f'$) berechnen, wenn nach Punkten gefragt ist.

## Steigungswinkel

Der Winkel $\alpha$, unter dem der Graph an der Stelle $a$ gegen die x-Achse ansteigt, erfüllt

$$\tan(\alpha) = f'(a), \quad \text{also } \alpha = \tan^{-1}\big(f'(a)\big)$$

*Beispiel:* Ein Hügelprofil $h(x) = -0{,}05x^2 + x$ hat bei $x = 4$ die Steigung $h'(4) = 0{,}6$. Der Steigungswinkel ist $\tan^{-1}(0{,}6) \approx 31°$. Eine Steigung von $0{,}6$ entspricht 60 % Steigung.

## Was Tangenten (nicht) können

- Eine Tangente **kann** den Graphen an anderer Stelle noch einmal schneiden. Die Tangente $y = 9x - 15$ von oben trifft den Graphen von $f$ auch bei $x = -4$.
- Eine Tangente kann den Graphen sogar im Berührpunkt **durchsetzen**: Die x-Achse ist die Tangente an $y = x^3$ im Ursprung.
- In der Nähe des Berührpunkts ist die Tangente eine gute **Näherung** für den Graphen (lineare Approximation).
