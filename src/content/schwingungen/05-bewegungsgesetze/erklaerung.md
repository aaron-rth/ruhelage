## Wo ist der Körper zur Zeit t?

Eine harmonische Schwingung lässt sich durch eine Sinus- oder Kosinusfunktion beschreiben. Startet der Körper im **oberen Umkehrpunkt** und wird losgelassen, gilt

$$s(t) = \hat s\cdot\cos(\omega t)$$

- $\hat s$ (Amplitude) streckt die Kurve nach oben und unten – sie bestimmt, **wie weit** es geht.
- $\omega$ (Kreisfrequenz) staucht die Kurve entlang der Zeitachse – sie bestimmt, **wie schnell** es geht. Es gilt $\omega = \frac{2\pi}{T}$.

> **Taschenrechner auf Bogenmaß (RAD) stellen!** Das Argument $\omega t$ ist ein Winkel im Bogenmaß. In Grad kommen völlig falsche Werte heraus.

## sin oder cos? Es kommt auf den Start an

| Start bei $t = 0$ | Gleichung |
|---|---|
| oberer Umkehrpunkt ($s(0) = +\hat s$) | $s(t) = \hat s\cos(\omega t)$ |
| unterer Umkehrpunkt ($s(0) = -\hat s$) | $s(t) = -\hat s\cos(\omega t)$ |
| Ruhelage, Bewegung nach oben ($v > 0$) | $s(t) = \hat s\sin(\omega t)$ |
| Ruhelage, Bewegung nach unten ($v < 0$) | $s(t) = -\hat s\sin(\omega t)$ |

Merkhilfe: $\cos(0) = 1$ – der Kosinus „startet oben“. $\sin(0) = 0$ – der Sinus „startet in der Mitte“.

## Geschwindigkeit und Beschleunigung durch Ableiten

Die Geschwindigkeit ist die Änderungsrate des Orts: $v(t) = \dot s(t)$. Die Beschleunigung ist die Änderungsrate der Geschwindigkeit: $a(t) = \dot v(t) = \ddot s(t)$.

Beim Ableiten brauchst du die **Kettenregel**: Die innere Funktion ist $\omega t$, ihre Ableitung ist $\omega$. Jedes Ableiten bringt also einen Faktor $\omega$ dazu. Für den Start im oberen Umkehrpunkt:

$$s(t) = \hat s\cos(\omega t)$$
$$v(t) = -\hat s\,\omega\sin(\omega t)$$
$$a(t) = -\hat s\,\omega^2\cos(\omega t)$$

Weil $\sin$ und $\cos$ höchstens 1 werden, kannst du die **Maximalwerte** direkt ablesen:

$$\hat v = \hat s\cdot\omega \qquad \hat a = \hat s\cdot\omega^2$$

Ein schöner Zusammenhang steckt in der letzten Zeile: $a(t) = -\omega^2\cdot s(t)$. Die Beschleunigung ist immer proportional zur Auslenkung und ihr entgegengesetzt – genau das, was ein lineares Kraftgesetz verlangt.

## Was passiert wo?

| Ort | $s$ | $v$ | $a$ |
|---|---|---|---|
| Umkehrpunkt | $\pm\hat s$ (maximal) | $0$ | $\mp\hat a$ (maximal, zur Mitte hin) |
| Gleichgewichtslage | $0$ | $\pm\hat v$ (maximal) | $0$ |

- Im **Umkehrpunkt** steht der Körper kurz still, wird aber am stärksten zurückgezogen.
- In der **Ruhelage** ist er am schnellsten, aber dort wirkt keine Kraft.

## Diagramme ineinander überführen

- Das **v-t-Diagramm** ist die Steigung des s-t-Diagramms. Wo $s$ einen Hoch- oder Tiefpunkt hat, ist $v = 0$. Wo $s$ am steilsten ist (Nulldurchgang), ist $|v|$ maximal.
- Das **a-t-Diagramm** ist die Steigung des v-t-Diagramms – und es ist immer das **Spiegelbild** des s-t-Diagramms (umgedreht, mit $\omega^2$ gestreckt).
- Gegeben ist nur das **v-t-Diagramm**? Lies $T$ und $\hat v$ ab, berechne $\omega = \frac{2\pi}{T}$ und $\hat s = \frac{\hat v}{\omega}$. Wo $v$ maximal ist, ist der Körper in der Ruhelage; wo $v = 0$ ist, im Umkehrpunkt.
- Die **Fläche** unter dem v-t-Graphen ist die zurückgelegte Strecke. Von der Ruhelage bis zum Umkehrpunkt ($\frac T4$) ist sie genau $\hat s$.
