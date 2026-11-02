## Worum es geht

In der Differenzialrechnung rechnest du ständig zwei Dinge: Du **formst Terme um**, damit du sie ableiten kannst, und du **löst Gleichungen**, z. B. $f'(x) = 0$. Wer hier sicher ist, verliert in der Klausur keine Punkte durch Rechenfehler.

## Potenzen und Vorzeichen

- $(-2)^4 = 16$, aber $-2^4 = -(2^4) = -16$. Die Potenz bindet stärker als das Minus davor.
- Ungerade Hochzahl: $(-2)^3 = -8$, das Vorzeichen bleibt.
- Rechenregeln: $x^a \cdot x^b = x^{a+b}$ und $(x^a)^b = x^{a \cdot b}$.

## Wurzeln und Brüche als Potenzen

Für die Potenzregel müssen Terme in der Form $x^r$ stehen:

| Term | als Potenz |
|---|---|
| $\sqrt{x}$ | $x^{\frac12}$ |
| $\sqrt[3]{x}$ | $x^{\frac13}$ |
| $\frac{1}{x}$ | $x^{-1}$ |
| $\frac{4}{x^3}$ | $4x^{-3}$ |
| $\frac{1}{\sqrt{x}}$ | $x^{-\frac12}$ |

## Ausmultiplizieren und binomische Formeln

- $(a+b)^2 = a^2 + 2ab + b^2$
- $(a-b)^2 = a^2 - 2ab + b^2$
- $(a+b)(a-b) = a^2 - b^2$

Beispiel: $(2x-3)^2 = 4x^2 - 12x + 9$. Häufiger Fehler: $(2x-3)^2 = 4x^2 + 9$, dabei fehlt das gemischte Glied.

## Welches Verfahren für welche Gleichung?

| Gleichung sieht so aus … | Verfahren |
|---|---|
| nur $x$ ohne Hochzahl, z. B. $3x - 6 = 9$ | Äquivalenzumformung |
| $ax^2 + bx + c = 0$ | Mitternachtsformel (oder pq-Formel nach Teilen durch $a$) |
| Produkt $= 0$, z. B. $(x-1)(x+4) = 0$ | Satz vom Nullprodukt |
| kein Glied ohne $x$, z. B. $x^3 - 9x = 0$ | $x$ ausklammern, dann Nullprodukt |
| nur $x^4$, $x^2$ und Zahl, z. B. $x^4 - 5x^2 + 4 = 0$ | Substitution $z = x^2$ |

## Die Verfahren im Einzelnen

**Mitternachtsformel:** $3x^2 - 3x - 18 = 0$ mit $a=3$, $b=-3$, $c=-18$:
$x_{1,2} = \frac{3 \pm \sqrt{9 + 216}}{6} = \frac{3 \pm 15}{6}$, also $x_1 = 3$, $x_2 = -2$.
Ist die Zahl unter der Wurzel (Diskriminante) negativ, gibt es keine Lösung.

**Satz vom Nullprodukt:** Ein Produkt ist genau dann null, wenn mindestens ein Faktor null ist.

**Ausklammern:** $x^3 - 9x = 0 \iff x(x^2 - 9) = 0$, also $x = 0$ oder $x^2 = 9$, d. h. $x = \pm 3$.

> Niemals durch $x$ teilen! Dabei geht die Lösung $x = 0$ verloren.

**Substitution:** $x^4 - 5x^2 + 4 = 0$. Setze $z = x^2$: $z^2 - 5z + 4 = 0$ ergibt $z = 1$ oder $z = 4$. Rücksubstitution: $x^2 = 1$ oder $x^2 = 4$, also $x \in \{-2; -1; 1; 2\}$. Ein negatives $z$ liefert keine Lösung für $x$.
