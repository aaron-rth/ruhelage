## Worum es geht

Summen darf man summandenweise ableiten. Bei **Produkten** geht das nicht: $(x \cdot x)' = (x^2)' = 2x$, aber $1 \cdot 1 = 1$. Für Funktionen wie $x^2 \sin(x)$ oder $2x(1 - x)^3$, die man nicht einfach ausmultiplizieren kann, braucht man die **Produktregel**.

## Die Regel

Sind $u$ und $v$ differenzierbar, dann ist auch $f = u \cdot v$ differenzierbar, und es gilt

$$f'(x) = u'(x) \cdot v(x) + u(x) \cdot v'(x)$$

Merksatz: **„Erster abgeleitet mal zweiter, plus erster mal zweiter abgeleitet.“**

## Vorgehen

1. Den Term in zwei Faktoren $u(x)$ und $v(x)$ zerlegen.
2. $u'(x)$ und $v'(x)$ getrennt bestimmen (ggf. mit linearer Kettenregel).
3. In $u' \cdot v + u \cdot v'$ einsetzen.
4. Vereinfachen, oft durch **Ausklammern** gemeinsamer Faktoren.

## Beispiele

**Einfach:** $f(x) = x^2 \cdot \sin(x)$ mit $u = x^2$, $u' = 2x$, $v = \sin(x)$, $v' = \cos(x)$:
$f'(x) = 2x\sin(x) + x^2\cos(x)$.

**Mit Wurzel:** $f(x) = (x + 1)\sqrt{x}$ mit $u' = 1$, $v' = \frac{1}{2\sqrt{x}}$:
$f'(x) = \sqrt{x} + \frac{x + 1}{2\sqrt{x}}$.

**Mit linearer Kettenregel:** $f(x) = 2x(1 - x)^3$ mit $u = 2x$, $u' = 2$, $v = (1 - x)^3$, $v' = -3(1 - x)^2$:

$$f'(x) = 2(1 - x)^3 - 6x(1 - x)^2 = 2(1 - x)^2\big[(1 - x) - 3x\big] = 2(1 - x)^2(1 - 4x)$$

Das Ausklammern lohnt sich: In der faktorisierten Form siehst du sofort die Nullstellen von $f'$ ($x = 1$ und $x = \frac14$), z. B. für waagerechte Tangenten oder Extremstellen.

## Wann brauche ich die Produktregel (nicht)?

- **Konstanter Faktor:** $5 \cdot x^3$ braucht keine Produktregel, das erledigt die Faktorregel. (Die Produktregel liefert dasselbe, weil $5' = 0$.)
- **Einfache Produkte von Potenzen:** $x^2 \cdot x^3 = x^5$ lieber zusammenfassen.
- **Klammern, die man leicht ausmultiplizieren kann:** $x(x - 4) = x^2 - 4x$ geht ohne Produktregel.
- **Echt nötig** ist sie bei Produkten mit $\sin$, $\cos$, Wurzeln oder hohen Potenzen von Klammern.

## Typische Fehler

- $(u \cdot v)' = u' \cdot v'$ (falsch!)
- Das Pluszeichen zwischen den beiden Summanden vergessen oder ein Minus aus $v'$ verlieren.
- Bei $v = (1 - x)^3$ die innere Ableitung $-1$ vergessen.
