## Eine Schwingung ist ein Schatten einer Kreisbewegung

Stell dir einen Punkt vor, der gleichmäßig auf einem Kreis mit Radius $\hat s$ umläuft – gegen den Uhrzeigersinn. Beleuchtest du ihn von der Seite, macht sein **Schatten** auf einer senkrechten Wand genau eine harmonische Schwingung: Er geht hoch und runter, wird an den Rändern langsamer und ist in der Mitte am schnellsten.

Die Höhe des Punktes ist $\hat s\cdot\sin\varphi$, wobei $\varphi$ der Winkel ist, den der Punkt schon zurückgelegt hat. **Das ist der ganze Trick hinter Sinus und Kosinus**: Der Sinus ist die Höhe eines Punktes auf dem Einheitskreis, der Kosinus seine Rechts-links-Position.

> Auf der **Spielwiese** kannst du das live sehen: Pendel, Kreis und s(t)-Graph laufen nebeneinander.

## Kreisfrequenz ω

Für eine ganze Runde ($2\pi$) braucht der Punkt die Zeit $T$. Er überstreicht also pro Sekunde den Winkel

$$\omega = \frac{2\pi}{T} = 2\pi f \qquad [\omega] = \frac{1}{\mathrm s}$$

Das ist die **Kreisfrequenz**. Zu jeder harmonischen Schwingung mit Periodendauer $T$ gehört genau ein $\omega$.

- $f$ zählt **Schwingungen** pro Sekunde (Einheit Hz).
- $\omega$ zählt den **Winkel im Bogenmaß** pro Sekunde (Einheit 1/s).
- Darum unterscheiden sie sich immer um den Faktor $2\pi$. Wer das vergisst, liegt genau um $2\pi \approx 6{,}28$ daneben.

## Phasenwinkel φ

Der **Phasenwinkel** sagt, wo im Ablauf sich die Schwingung gerade befindet – so wie der Winkel am Kreis:

$$\varphi(t) = \omega\cdot t$$

| $t$ | $0$ | $\frac T4$ | $\frac T2$ | $\frac{3T}4$ | $T$ |
|---|---|---|---|---|---|
| $\varphi$ | $0$ | $\frac\pi2$ | $\pi$ | $\frac{3\pi}2$ | $2\pi$ |
| $s = \hat s\sin\varphi$ | $0$ | $+\hat s$ | $0$ | $-\hat s$ | $0$ |

Der Phasenwinkel wird im **Bogenmaß** angegeben: $\pi\,\text{rad} = 180^\circ$, also $\varphi_\text{rad} = \varphi_\text{Grad}\cdot\frac{\pi}{180^\circ}$.

## Nullphase φ₀: jeder beliebige Start

Mit $\pm\sin$ und $\pm\cos$ kannst du nur vier Starts beschreiben. Für **jeden** beliebigen Startpunkt gibt es den allgemeinen Ansatz

$$s(t) = \hat s\cdot\sin(\omega t + \varphi_0)$$

Die **Nullphase** $\varphi_0$ ist der Winkel, bei dem der Kreispunkt zur Zeit $t = 0$ schon steht.

| $\varphi_0$ | Start |
|---|---|
| $0$ | Ruhelage, nach oben ($+\sin$) |
| $\frac\pi2$ | oberer Umkehrpunkt ($+\cos$) |
| $\pi$ | Ruhelage, nach unten ($-\sin$) |
| $\frac{3\pi}2$ | unterer Umkehrpunkt ($-\cos$) |

Im s-t-Diagramm verschiebt $\varphi_0$ die Sinuskurve um $\frac{\varphi_0}{\omega}$ **nach links**.

## φ₀ und ŝ aus den Anfangsbedingungen

Kennst du Ort $s_0$ und Geschwindigkeit $v_0$ bei $t = 0$, setzt du ein:

$$s_0 = \hat s\sin\varphi_0 \qquad v_0 = \hat s\,\omega\cos\varphi_0$$

**Amplitude** (aus $\sin^2 + \cos^2 = 1$):

$$\hat s = \sqrt{s_0^2 + \left(\frac{v_0}{\omega}\right)^2}$$

**Nullphase:** Hier lauert die größte Falle. $\arcsin\left(\frac{s_0}{\hat s}\right)$ liefert immer nur Winkel zwischen $-\frac\pi2$ und $\frac\pi2$. Den richtigen **Quadranten** verraten die Vorzeichen:

| $s_0$ ($\sin\varphi_0$) | $v_0$ ($\cos\varphi_0$) | Quadrant | $\varphi_0$ |
|---|---|---|---|
| $+$ | $+$ | I | $\arcsin\frac{s_0}{\hat s}$ |
| $+$ | $-$ | II | $\pi - \arcsin\frac{s_0}{\hat s}$ |
| $-$ | $-$ | III | $\pi - \arcsin\frac{s_0}{\hat s}$ |
| $-$ | $+$ | IV | $2\pi + \arcsin\frac{s_0}{\hat s}$ |

Probe: Setz dein $\varphi_0$ in **beide** Gleichungen ein. Stimmen beide Vorzeichen, stimmt der Quadrant.

## Wann kommt der nächste Nulldurchgang?

Die Auslenkung ist null, wenn $\omega t + \varphi_0$ ein Vielfaches von $\pi$ ist. Der erste Durchgang nach dem Start ist beim nächsten Vielfachen von $\pi$, das größer als $\varphi_0$ ist – z. B. für $0 < \varphi_0 < \pi$:

$$\omega t + \varphi_0 = \pi \quad\Rightarrow\quad t = \frac{\pi - \varphi_0}{\omega}$$
