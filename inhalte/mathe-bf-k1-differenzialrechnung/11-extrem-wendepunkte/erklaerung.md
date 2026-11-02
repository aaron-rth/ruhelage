## Worum es geht

Besonders interessante Punkte eines Graphen sind **Hoch- und Tiefpunkte** (Extrempunkte) und **Wendepunkte**, an denen sich die Krümmung ändert. Sie zu berechnen ist der Kern fast jeder Analysis-Klausur.

## Begriffe

- $x_0$ ist **Maximumstelle** (lokales Maximum), wenn $f(x) \leq f(x_0)$ für alle $x$ in einer Umgebung von $x_0$ gilt. $f(x_0)$ ist dann ein **lokales Maximum** (Extremwert), der Punkt $H(x_0 \mid f(x_0))$ ein **Hochpunkt**.
- Entsprechend: **Minimumstelle**, **lokales Minimum**, **Tiefpunkt** $T$.
- Gilt $f(x) \leq f(x_0)$ sogar für **alle** $x$ der Definitionsmenge, ist $f(x_0)$ das **globale Maximum**.
- Eine **Wendestelle** ist eine Stelle, an der der Graph von einer Links- in eine Rechtskurve wechselt (oder umgekehrt). Dort ist der Graph am steilsten oder am flachsten.
- Ein Wendepunkt mit **waagerechter Tangente** heißt **Sattelpunkt** (Terrassenpunkt).

## Extremstellen berechnen

**Notwendige Bedingung:** An einer inneren Extremstelle ist die Tangente waagerecht, also $f'(x_0) = 0$. Das ist aber nicht genug: Bei $f(x) = x^3$ ist $f'(0) = 0$, und trotzdem liegt dort kein Extrempunkt vor (Sattelpunkt).

**Hinreichende Bedingung**, Möglichkeit 1 ($f''$-Kriterium):

- $f'(x_0) = 0$ und $f''(x_0) < 0$ ⇒ Maximumstelle (Rechtskurve, „Hügel“)
- $f'(x_0) = 0$ und $f''(x_0) > 0$ ⇒ Minimumstelle (Linkskurve, „Tal“)

Möglichkeit 2 (**Vorzeichenwechsel-Kriterium**):

- $f'(x_0) = 0$ und $f'$ wechselt bei $x_0$ das Vorzeichen von $+$ nach $-$ ⇒ Maximumstelle
- von $-$ nach $+$ ⇒ Minimumstelle
- kein Vorzeichenwechsel ⇒ keine Extremstelle

> Ist $f'(x_0) = 0$ **und** $f''(x_0) = 0$, sagt das $f''$-Kriterium **nichts**. Dann hilft nur der Vorzeichenwechsel. Beispiel: $f(x) = x^4$ hat bei 0 ein Minimum, obwohl $f''(0) = 0$ ist.

## Wendestellen berechnen

Eine Wendestelle von $f$ ist eine Extremstelle von $f'$. Also verschiebt sich alles um eine Ableitung:

- **notwendig:** $f''(x_0) = 0$
- **hinreichend:** $f''(x_0) = 0$ und $f'''(x_0) \neq 0$, oder $f''$ wechselt bei $x_0$ das Vorzeichen.

Gilt zusätzlich $f'(x_0) = 0$, ist der Wendepunkt ein **Sattelpunkt**.

## Vollständiges Beispiel

$f(x) = x^3 - 6x^2 + 9x + 1$ mit $f'(x) = 3x^2 - 12x + 9$, $f''(x) = 6x - 12$, $f'''(x) = 6$.

**Extremstellen:** $f'(x) = 0 \iff x^2 - 4x + 3 = 0 \iff x = 1$ oder $x = 3$.
- $f''(1) = -6 < 0$ ⇒ Maximumstelle, $f(1) = 5$: Hochpunkt $H(1 \mid 5)$
- $f''(3) = 6 > 0$ ⇒ Minimumstelle, $f(3) = 1$: Tiefpunkt $T(3 \mid 1)$

**Wendestellen:** $f''(x) = 0 \iff x = 2$; $f'''(2) = 6 \neq 0$ ⇒ Wendestelle, $f(2) = 3$: Wendepunkt $W(2 \mid 3)$.

> Die y-Koordinate immer mit $f$ berechnen, nicht mit $f'$ oder $f''$.

**Sattelpunkt-Beispiel:** $g(x) = x^3 - 3x^2 + 3x$: $g'(x) = 3(x - 1)^2$, $g''(x) = 6(x - 1)$, $g'''(x) = 6$. Bei $x = 1$ ist $g'(1) = 0$, $g''(1) = 0$, $g'''(1) \neq 0$: Sattelpunkt $S(1 \mid 1)$.

## Ränder und globale Extrema

Ist $f$ nur auf einem Intervall $[a; b]$ definiert (typisch in Sachaufgaben), können die größten oder kleinsten Werte auch **am Rand** liegen. Dort ist $f'$ meist nicht null. Für das globale Maximum vergleicht man daher die lokalen Maxima mit den **Randwerten** $f(a)$ und $f(b)$.

Nützliche Fakten für ganzrationale Funktionen:
- Grad 3 hat genau eine Wendestelle (weil $f''$ linear ist).
- Zwischen zwei Extremstellen liegt immer eine Wendestelle.
