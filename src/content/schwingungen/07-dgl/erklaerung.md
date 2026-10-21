## Was ist eine Differenzialgleichung?

Eine **Differenzialgleichung (DGL)** ist eine Gleichung, in der eine **Funktion und ihre Ableitung(en)** vorkommen. Ihre Lösung ist keine Zahl, sondern eine **Funktion** – hier $s(t)$, die die ganze Bewegung beschreibt.

Bei allen Schwingungen in dieser Klausur landest du bei derselben Form:

$$\ddot s(t) = -\,(\text{positive Konstante})\cdot s(t)$$

Gesucht ist also eine Funktion, deren zweite Ableitung wieder die Funktion selbst ist – mal einer negativen Zahl. Genau das können **Sinus und Kosinus**: $\frac{d^2}{dt^2}\sin(\omega t) = -\omega^2\sin(\omega t)$.

> **Erkennungsmerkmal:** Steht da $\ddot s = -\omega^2\cdot s$, ist die Schwingung harmonisch mit $\omega = \sqrt{\text{Konstante}}$ – egal, ob Feder, Faden, Flüssigkeit oder Boje.

## Das Rezept in sechs Schritten

1. **Kräfte bestimmen.** Welche Kräfte wirken, wenn der Körper um $s$ ausgelenkt ist? Bestimme die **Rückstellkraft** $F_R$ und zeige, dass sie proportional zu $s$ ist: $F_R = -D\cdot s$.
2. **Grundgleichung der Mechanik:** $F = m\cdot a = m\cdot\ddot s(t)$. Achtung: $m$ ist die **gesamte bewegte Masse**.
3. **Gleichsetzen → DGL:** $m\cdot\ddot s(t) = -D\cdot s(t)$, also $$\ddot s(t) = -\frac{D}{m}\cdot s(t)$$
4. **Ansatz** wählen: $s(t) = \hat s\cdot\sin(\omega t)$ (oder $\cos$ – je nach Start). Zweimal ableiten: $\ddot s(t) = -\hat s\,\omega^2\sin(\omega t)$.
5. **Einsetzen:** $-\hat s\,\omega^2\sin(\omega t) = -\frac{D}{m}\,\hat s\sin(\omega t)$. Das gilt für alle $t$ nur, wenn $$\omega^2 = \frac{D}{m}$$
6. **Periodendauer:** $T = \frac{2\pi}{\omega} = 2\pi\sqrt{\frac{m}{D}}$.

**Warum ist das dann harmonisch?** Weil das lineare Kraftgesetz genau diese DGL liefert, deren Lösungen Sinus- und Kosinusfunktionen sind – und weil $\hat s$ in $\omega$ und $T$ gar nicht vorkommt.

## Die vier wichtigen Anwendungen

### Federpendel
$F_R = -D\cdot s$ → $\ddot s = -\frac{D}{m}s$ → $\omega = \sqrt{\frac Dm}$.

### Fadenpendel
$F_R = -\frac{mg}{\ell}\cdot s$ (Kleinwinkelnäherung, $\alpha \le 10^\circ$) → $$\ddot s = -\frac{g}{\ell}\,s \quad\Rightarrow\quad \omega = \sqrt{\frac g\ell}$$ Die Masse kürzt sich heraus.

### Flüssigkeit im U-Rohr
Die Säule hat die Gesamtlänge $\ell$ und den Querschnitt $A$. Steigt der Spiegel rechts um $s$, sinkt er links um $s$ – der **Höhenunterschied ist $2s$**. Das Gewicht dieses überstehenden Stücks (Masse $\rho A\cdot 2s$) treibt zurück:
$$F_R = -2\rho A g\cdot s$$
Bewegt wird aber die **ganze Säule**: $m = \rho A\ell$. Damit
$$\rho A \ell\,\ddot s = -2\rho A g\,s \quad\Rightarrow\quad \ddot s = -\frac{2g}{\ell}\,s \quad\Rightarrow\quad T = 2\pi\sqrt{\frac{\ell}{2g}}$$
$\rho$ und $A$ kürzen sich: Wasser oder Öl, dünnes oder dickes Rohr – $T$ bleibt gleich.

> Typischer Fehler: als Masse nur das überstehende Stück $\rho A\cdot 2s$ nehmen. Beschleunigt wird aber die **gesamte** Flüssigkeit.

### Schwimmende Boje
Ein Zylinder (Querschnitt $A$, Masse $m$) schwimmt aufrecht. Im **Gleichgewicht** gilt $F_G = F_A$, also $m g = \rho A h_0 g$ und die Eintauchtiefe ist
$$h_0 = \frac{m}{\rho A}$$
Drückt man ihn um $s$ tiefer, verdrängt er zusätzlich das Volumen $A\cdot s$. **Nur diese Zusatz-Auftriebskraft** wirkt zurück – den Rest gleicht ja schon die Gewichtskraft aus:
$$F_R = -\rho g A\cdot s \quad\Rightarrow\quad D = \rho g A,\qquad \omega_0 = \sqrt{\frac{\rho g A}{m}}$$
Wird die Boje heruntergedrückt und losgelassen, startet sie im unteren Umkehrpunkt: $s(t) = -\hat s\cos(\omega_0 t)$ (nach oben positiv). Daraus wie immer $\hat v = \hat s\omega_0$ und $\hat a = \hat s\omega_0^2$.

Schöne Abkürzung: Mit $h_0 = \frac{m}{\rho A}$ wird $\omega_0^2 = \frac{g}{h_0}$ – genau wie beim Feder-Schwere-Pendel.

## Und die Gewichtskraft beim senkrechten Federpendel?

Rechnet man sie mit, lautet die DGL $\ddot s = -\frac Dm s - g$. Der Ansatz $s(t) = \hat s\sin(\omega t) + c$ löst sie mit $c = -\frac{mg}{D}$: Die Gewichtskraft **verschiebt nur die Ruhelage** um $\frac{mg}{D}$ nach unten. $\omega$ und $T$ bleiben gleich.

## Ausblick: mit Reibung

Kommt eine Reibungskraft $F = -b\cdot v$ dazu, steht in der DGL auch die erste Ableitung:
$$\ddot s = -\frac{b}{m}\,\dot s - \frac{D}{m}\,s$$
Die Lösung ist eine Sinusschwingung mit exponentiell schrumpfender Amplitude – mehr dazu im Thema Dämpfung.
