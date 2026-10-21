## Zwei Energieformen im ständigen Wechsel

Beim Auslenken eines Pendels steckst du Energie hinein – als **Spannenergie** (Feder) oder **Lageenergie** (Faden). Zusammen heißen sie **potenzielle Energie** $E_\text{pot}$.

- Im **Umkehrpunkt** ist die Geschwindigkeit null: Die ganze Energie ist potenziell.
- Beim Durchgang durch die **Ruhelage** ist die Geschwindigkeit maximal: Die ganze Energie ist kinetisch.
- Dazwischen wandeln sich beide Formen laufend ineinander um.

Ohne Reibung bleibt die **Gesamtenergie konstant** (Energieerhaltung).

## Die Formeln

**Potenzielle Energie** – die Rückstellkraft $D\cdot s$ wächst linear mit dem Weg, also ist die Arbeit die **Dreiecksfläche** unter dem $|F_R|$-$s$-Graphen:
$$E_\text{pot}(t) = \frac12 D\cdot s(t)^2$$
**Kinetische Energie:**
$$E_\text{kin}(t) = \frac12 m\cdot v(t)^2$$
**Gesamtenergie** – am einfachsten im Umkehrpunkt oder in der Ruhelage abgelesen:
$$E_\text{ges} = \frac12 D\hat s^2 = \frac12 m\hat v^2$$

Beim senkrechten Federpendel misst man $\hat s$ ab der (verschobenen) Gleichgewichtslage – auch wenn die Feder dort schon gespannt ist. Beim **Fadenpendel** setzt man $D = \frac{mg}{\ell}$ ein; die Gesamtenergie hängt dort also von der Masse ab, beim Federpendel (bei gegebenem $D$ und $\hat s$) nicht.

## Zeitlicher Verlauf

Für den Start im Umkehrpunkt ist $s(t) = \hat s\cos(\omega t)$ und $v(t) = -\hat s\omega\sin(\omega t)$. Einsetzen (mit $m\omega^2 = D$):
$$E_\text{pot}(t) = \frac12 D\hat s^2\cos^2(\omega t)\qquad E_\text{kin}(t) = \frac12 D\hat s^2\sin^2(\omega t)$$
Mit $\sin^2 + \cos^2 = 1$ („trigonometrischer Pythagoras“) ist die Summe immer $\frac12 D\hat s^2$ – konstant.

- Beide Energien schwingen mit der **doppelten Frequenz** der Auslenkung: Pro Periode ist $E_\text{kin}$ **zweimal** maximal (bei beiden Durchgängen durch die Ruhelage).
- Bei $t = \frac T8$ (also $\omega t = \frac\pi4$) sind beide genau gleich groß.

## Ein nützlicher Trick: Energie an einer beliebigen Stelle

Wo der Körper die Auslenkung $s$ hat, steckt $\left(\frac{s}{\hat s}\right)^2$ der Gesamtenergie in $E_\text{pot}$, der Rest in $E_\text{kin}$. Bei halber Amplitude sind also nur **25 %** potenziell und **75 %** kinetisch. Daraus folgt auch die Geschwindigkeit an jeder Stelle:
$$\frac12 m v^2 = \frac12 D\left(\hat s^2 - s^2\right)\quad\Rightarrow\quad v = \omega\sqrt{\hat s^2 - s^2}$$

## Fadenpendel über die Höhe

Beim Fadenpendel kann man die Energie auch über die Hubhöhe rechnen: Bei Auslenkwinkel $\hat\alpha$ liegt der Körper um $h = \ell(1 - \cos\hat\alpha)$ höher als in der Ruhelage, also $E = m g h$ und $\hat v = \sqrt{2gh}$. Für kleine Winkel kommt dasselbe heraus wie mit $\frac12 D\hat s^2$.

## Fehler in einer Mitschrift

In einer Mitschrift (Energie, 12.10.) steht neben $s(t) = \hat s\sin(\omega t)$ die Geschwindigkeit $v(t) = \hat s\omega\sin(\omega t)$. Das ist ein Flüchtigkeitsfehler: Die Ableitung von $\sin$ ist $\cos$, also $v(t) = \hat s\omega\cos(\omega t)$. Für die Energie spielt es zum Glück keine Rolle, welche der beiden Funktionen man quadriert – $E_\text{kin,max} = \frac12 m\hat s^2\omega^2$ stimmt trotzdem.
