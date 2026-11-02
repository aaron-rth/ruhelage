## Worum es geht

Funktionen beschreiben oft, wie sich eine Größe verändert: Höhe einer Drohne, Temperatur von Tee, Wasserstand. Die Differenzialrechnung beantwortet die Frage: **Wie schnell ändert sich die Größe?** Dabei unterscheidet man zwei Arten von Änderungsrate.

## Mittlere Änderungsrate

Die **mittlere Änderungsrate** von $f$ auf dem Intervall $[a; b]$ ist der **Differenzenquotient**

$$\frac{f(b) - f(a)}{b - a}$$

- **Grafisch:** die Steigung der **Sekante** durch die Punkte $P(a \mid f(a))$ und $Q(b \mid f(b))$.
- **Im Sachzusammenhang:** die durchschnittliche Änderung pro Einheit, z. B. die Durchschnittsgeschwindigkeit.
- **Einheit:** Einheit von $f(x)$ geteilt durch Einheit von $x$, z. B. $\frac{\text{m}}{\text{s}}$ oder $\frac{°\text{C}}{\text{min}}$.

*Beispiel:* Eine Drohne hat nach $t$ Sekunden die Höhe $h(t) = t^2 + 2t$ (in m). Im Intervall $[2; 4]$:
$\frac{h(4) - h(2)}{4 - 2} = \frac{24 - 8}{2} = 8$. Die Drohne steigt dort im Mittel um 8 m pro Sekunde.

## Momentane Änderungsrate

Die mittlere Änderungsrate sagt nichts darüber, wie schnell die Drohne **genau zum Zeitpunkt** $t = 2$ steigt. Dafür lässt man das Intervall immer kleiner werden: Der zweite Punkt rückt immer näher an $a$ heran. Der Grenzwert heißt **Ableitung von $f$ an der Stelle $a$**:

$$f'(a) = \lim_{x \to a} \frac{f(x) - f(a)}{x - a}$$

- **Grafisch:** Aus der Sekante wird die **Tangente**. $f'(a)$ ist die Tangentensteigung, also die Steigung des Graphen im Punkt $P(a \mid f(a))$.
- **Im Sachzusammenhang:** die momentane (augenblickliche) Änderungsrate, z. B. die Geschwindigkeit, die ein Tacho anzeigen würde.
- Mittlere und momentane Änderungsrate haben **dieselbe Einheit**.

## Ableitung über den Grenzwert berechnen

*Beispiel:* $h(t) = t^2 + 2t$ an der Stelle $a = 2$ mit $h(2) = 8$:

$$\frac{h(t) - h(2)}{t - 2} = \frac{t^2 + 2t - 8}{t - 2} = \frac{(t - 2)(t + 4)}{t - 2} = t + 4$$

Für $t \to 2$ ergibt sich $h'(2) = 6$. Die Drohne steigt zum Zeitpunkt 2 s mit 6 m/s.

Der Trick ist immer derselbe: Den Zähler so umformen (ausklammern, binomische Formel), dass sich $(x - a)$ kürzen lässt. Erst **danach** darf man $x = a$ einsetzen, vorher stünde $\frac{0}{0}$ da.

Gleichwertig ist die **h-Schreibweise** $f'(a) = \lim\limits_{h \to 0} \frac{f(a+h) - f(a)}{h}$, bei der $h$ die Breite des Intervalls ist.

## Differenzierbar

Eine Funktion heißt an der Stelle $a$ **differenzierbar**, wenn dieser Grenzwert existiert. Anschaulich: Der Graph verläuft dort glatt, ohne Knick und ohne Sprung. Ganzrationale Funktionen, Sinus und Kosinus sind überall differenzierbar. Ein Gegenbeispiel ist der Betrag $|x|$ an der Stelle 0: Dort hat der Graph einen Knick.

## Übersicht

| | mittlere Änderungsrate | momentane Änderungsrate |
|---|---|---|
| Term | $\frac{f(b) - f(a)}{b - a}$ | $f'(a) = \lim\limits_{x \to a} \frac{f(x) - f(a)}{x - a}$ |
| Graph | Sekantensteigung | Tangentensteigung |
| bezieht sich auf | ein Intervall | eine Stelle |
| Beispiel | Durchschnittsgeschwindigkeit | Tachoanzeige |
