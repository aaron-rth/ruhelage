## Worum es geht

Funktionen wie $(3x - 2)^4$, $\sqrt{1 - 2x}$ oder $\sin(2x + 1)$ entstehen, wenn man zwei Funktionen **hintereinander ausführt**. Man nennt das eine **Verkettung**. Im Basisfach brauchst du den Fall, dass die innere Funktion **linear** ist, und die passende Ableitungsregel, die lineare Kettenregel.

## Innere und äußere Funktion

Bei $f(x) = (3x - 2)^4$ rechnet man für ein gegebenes $x$ in zwei Schritten:

1. Zuerst $3x - 2$ ausrechnen. Das ist die **innere Funktion** $v(x) = 3x - 2$.
2. Dann das Ergebnis hoch 4 nehmen. Das ist die **äußere Funktion** $u(z) = z^4$.

Man schreibt $f(x) = u(v(x))$. Ist die innere Funktion linear, also $v(x) = mx + c$, heißt $f$ **lineare Verkettung**:

$$f(x) = u(mx + c)$$

So erkennst du die innere Funktion: Sie ist das, was „in der Klammer“, „unter der Wurzel“, „im Nenner“ oder „im Sinus“ steht.

## Die lineare Kettenregel

$$f(x) = u(mx + c) \quad\Rightarrow\quad f'(x) = m \cdot u'(mx + c)$$

In Worten: **äußere Funktion ableiten, die innere unverändert stehen lassen, mit der Steigung $m$ der inneren Funktion multiplizieren.**

## Beispiele

| $f(x)$ | $u$, $m$ | $f'(x)$ |
|---|---|---|
| $(3x - 2)^4$ | $u(z) = z^4$, $m = 3$ | $3 \cdot 4(3x - 2)^3 = 12(3x - 2)^3$ |
| $\sin(2x + 1)$ | $u = \sin$, $m = 2$ | $2\cos(2x + 1)$ |
| $\sqrt{1 - 2x}$ | $u(z) = \sqrt{z}$, $m = -2$ | $-2 \cdot \frac{1}{2\sqrt{1 - 2x}} = -\frac{1}{\sqrt{1 - 2x}}$ |
| $\frac{4}{5x - 1} = 4(5x - 1)^{-1}$ | $u(z) = 4z^{-1}$, $m = 5$ | $5 \cdot (-4)(5x - 1)^{-2} = -\frac{20}{(5x - 1)^2}$ |
| $\cos(\pi x)$ | $u = \cos$, $m = \pi$ | $-\pi\sin(\pi x)$ |

> Achtung beim Vorzeichen: Bei $(5 - 2x)^3$ ist $m = -2$, nicht $2$. Also $f'(x) = -6(5 - 2x)^2$.

## Warum der Faktor m?

Grafisch: Der Graph von $u(mx + c)$ entsteht aus dem Graphen von $u$ durch Strecken in x-Richtung mit Faktor $\frac{1}{m}$ und Verschieben. Wird der Graph z. B. um den Faktor 3 **gestaucht** ($m = 3$), werden alle Steigungsdreiecke dreimal so schmal bei gleicher Höhe, also dreimal so steil. Daher der Faktor $m$. Das Verschieben ändert die Steigungen nicht.

## Wann gilt die Regel nicht?

Nur wenn die innere Funktion linear ist. $\sin(x^2)$ oder $(x^2 + 1)^3$ sind auch Verkettungen, aber mit **nicht-linearer** innerer Funktion. Die allgemeine Kettenregel dafür gehört zum Leistungsfach. Im Basisfach sollst du solche Verkettungen nur **erkennen**. Bei $(x^2 + 1)^3$ könntest du notfalls ausmultiplizieren.
