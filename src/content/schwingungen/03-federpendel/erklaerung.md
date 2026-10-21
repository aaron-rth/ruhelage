## Die Feder zieht immer zurück

Lenkst du einen Körper an einer Feder aus seiner Ruhelage aus, will die Feder ihn zurückholen. Diese **Rückstellkraft** wird umso größer, je weiter du ihn auslenkst – und zwar genau proportional. Das ist das **Hookesche Gesetz**:

$$F_R = -D \cdot s$$

- $s$ ist die **Auslenkung** aus der Gleichgewichtslage (mit Vorzeichen).
- $D$ ist die **Federkonstante** (auch Federhärte) in $\mathrm{N/m}$. Sie sagt, wie viel Newton man braucht, um die Feder um einen Meter zu dehnen. Großes $D$ = harte Feder.
- Das **Minuszeichen** ist kein Rechentrick: Es sagt, dass die Kraft immer **entgegen** der Auslenkung zeigt – also zurück zur Ruhelage. Ist $s$ positiv, ist $F_R$ negativ und umgekehrt.

Im $F_R$-$s$-Diagramm ist das eine **fallende Ursprungsgerade** mit der Steigung $-D$. Eine Rückstellkraft dieser Form nennt man **lineares Kraftgesetz**. Allgemein heißt die Konstante $D$ **Richtgröße** – beim Federpendel ist sie einfach die Federkonstante.

> Ein lineares Kraftgesetz ist das Fundament jeder harmonischen Schwingung. Wenn du später eine Differenzialgleichung aufstellst, startest du immer hier.

## Periodendauer

$$T = 2\pi\sqrt{\frac{m}{D}}$$

Was das bedeutet, kannst du dir gut vorstellen:

- **Größere Masse → größere Periodendauer.** Ein schwerer Körper ist träger und kommt langsamer in Gang. Aber nicht linear: vierfache Masse ergibt doppelte Periodendauer ($\sqrt{4} = 2$).
- **Härtere Feder → kleinere Periodendauer.** Die Feder zieht kräftiger zurück.
- **Die Amplitude kommt nicht vor.** Weiter auslenken heißt zwar längerer Weg, aber auch größere Kraft – beides gleicht sich genau aus. Darum ist das Federpendel **harmonisch**.

Typischer Denkfehler: „Wer schwerer ist, federt am Bungee-Seil schneller auf und ab.“ Umgekehrt ist es richtig – mehr Masse heißt längere Periodendauer.

## Das senkrechte Federpendel (Feder-Schwere-Pendel)

Hängt ein Körper an einer Feder, dehnt ihn die Gewichtskraft zuerst um

$$\Delta \ell = \frac{m \cdot g}{D}.$$

Dort liegt die **neue Gleichgewichtslage**: Federkraft und Gewichtskraft heben sich auf. Misst du die Auslenkung $s$ ab dieser Stelle, gilt wieder genau $F_R = -D \cdot s$. Die Gewichtskraft **verschiebt also nur die Ruhelage** – an $D$ und damit an $T$ ändert sie nichts.

Schöner Nebeneffekt: Setzt man $\frac{m}{D} = \frac{\Delta\ell}{g}$ ein, folgt $T = 2\pi\sqrt{\frac{\Delta\ell}{g}}$ – man kann $T$ schon aus der Dehnung im Ruhezustand vorhersagen.

## Zwei Federn

**Nebeneinander** (parallel, z. B. zwei Federn an einer Achse) oder ein Wagen **zwischen zwei Federn** eingespannt: Lenkst du um $s$ aus, ziehen beide Federn zusammen zurück. Die eine zieht stärker, die andere drückt bzw. zieht schwächer in die Gegenrichtung – in der Summe:

$$D = D_1 + D_2$$

**Hintereinander** (in Reihe): Beide Federn spüren **dieselbe Kraft** $F$, aber beide dehnen sich – die Dehnungen addieren sich: $s = \frac{F}{D_1} + \frac{F}{D_2}$. Daraus:

$$\frac{1}{D} = \frac{1}{D_1} + \frac{1}{D_2} \quad\Leftrightarrow\quad D = \frac{D_1 \cdot D_2}{D_1 + D_2}$$

Die Kombination ist **weicher** als jede einzelne Feder. Zwei gleiche Federn hintereinander haben nur noch die halbe Federkonstante.

## Masse ohne Waage: die Astronautenwaage

In der Raumstation ist man schwerelos – eine normale Waage zeigt nichts an. Ein Stuhl zwischen zwei Federn schwingt aber trotzdem, denn Trägheit gibt es auch ohne Gewicht. Aus der gemessenen Periodendauer folgt

$$m = \frac{D \cdot T^2}{4\pi^2}.$$

Davon zieht man noch die Masse des Stuhls ab.
