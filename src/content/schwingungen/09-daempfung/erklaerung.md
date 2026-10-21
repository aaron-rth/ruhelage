## Warum jede echte Schwingung abklingt

In der Realität gibt es immer Reibung. Sie wandelt bei jeder Bewegung einen Teil der Schwingungsenergie in **thermische Energie** um – Faden, Luft oder Lager werden minimal wärmer. Dieser Vorgang ist **irreversibel**: Die Wärme kommt nicht von selbst zurück. Die Gesamtenergie der Schwingung sinkt, und weil $E = \frac12 D\hat s^2$ gilt, sinkt auch die Amplitude. Man spricht von einer **gedämpften Schwingung**.

Wie genau die Amplitude abnimmt, hängt davon ab, **wie die Reibungskraft von der Geschwindigkeit abhängt**.

## 1. Gleitreibung: konstante Kraft → lineare Abnahme

Gleitreibung (z. B. ein Faden schleift an einem Stab) hat einen festen Betrag, egal wie schnell sich der Körper bewegt:
$$F_{gl} = f_{gl}\cdot F_N$$

**Energiebilanz** zwischen zwei aufeinanderfolgenden Umkehrpunkten $P_1$ und $P_2$ (eine halbe Periode): Die Energie sinkt von $\frac12 D\hat s_1^2$ auf $\frac12 D\hat s_2^2$. Der Körper legt dabei den Weg $\hat s_1 + \hat s_2$ zurück, die Reibung verrichtet die Arbeit $F_{gl}\cdot(\hat s_1 + \hat s_2)$:
$$\frac D2\left(\hat s_1^2 - \hat s_2^2\right) = \frac D2(\hat s_1 - \hat s_2)(\hat s_1 + \hat s_2) = F_{gl}\,(\hat s_1 + \hat s_2)$$
(3. binomische Formel). Kürzen liefert:
$$\hat s_1 - \hat s_2 = \frac{2F_{gl}}{D}$$

Die Amplitude nimmt also pro halber Periode um **denselben Betrag** ab – sie sinkt **linear**. Hoch- und Tiefpunkte liegen auf zwei **Geraden** (der Einhüllenden), die sich irgendwann treffen: Die Schwingung endet nach endlich vielen Ausschlägen.

## 2. Reibung proportional zur Geschwindigkeit → exponentielle Abnahme

Bei langsamer Bewegung in Luft oder Flüssigkeit oder bei einer Wirbelstrombremse gilt
$$F_\text{Reib} = -b\cdot v$$
mit der **Dämpfungskonstante** $b$ (Einheit kg/s). Die Kräftebilanz $m\ddot s = -D s - b\dot s$ ergibt die DGL
$$\ddot s(t) = -\frac{b}{m}\,\dot s(t) - \frac{D}{m}\,s(t)$$
Ihre Lösung ist eine Sinusschwingung, deren Amplitude exponentiell schrumpft:
$$s(t) = \hat s\cdot e^{-\frac{b}{2m}t}\cdot\sin(\omega' t)\qquad \omega' = \sqrt{\omega^2 - \frac{b^2}{4m^2}}$$

- Die **Einhüllende** ist $s_\text{ampl}(t) = \hat s\cdot e^{-\delta t}$ mit der **Abklingkonstante** $\delta = \frac{b}{2m}$ (Einheit 1/s).
- $\omega'$ ist etwas kleiner als $\omega = \sqrt{D/m}$. Bei schwacher Dämpfung ist der Unterschied winzig – auch die gedämpfte Schwingung hat eine von der Amplitude **unabhängige** Frequenz.
- **Aufeinanderfolgende Amplituden** stehen immer im gleichen Verhältnis: $\frac{\hat s_1}{\hat s_2} = \frac{\hat s_2}{\hat s_3} = e^{\delta T}$.
- **Halbwertszeit** (Amplitude halbiert sich): $e^{-\delta t_{1/2}} = \frac12$, also $t_{1/2} = \frac{\ln 2}{\delta}$.
- **Energie:** Weil $E \sim \hat s^2$, gilt $E(t) = E_0\, e^{-2\delta t}$. Pro Periode bleibt der Anteil $e^{-2\delta T}$ übrig, verloren geht $1 - e^{-2\delta T}$. Nach einer Halbwertszeit der Amplitude ist nur noch **ein Viertel** der Energie da.

Ist die Dämpfung sehr stark ($\delta \ge \omega$), kriecht der Körper nur noch in die Ruhelage zurück – es gibt **keine Schwingung** mehr.

## 3. Welches Reibungsmodell passt zu einer Messung?

Im Versuch mit der Pappscheibe (Luftreibung) testet man drei Modelle. Der Trick: Man trägt die Amplituden so auf, dass das passende Modell eine **Gerade** ergibt.

| Reibung | Kraft | Amplitude $A(t)$ | Gerade im Diagramm | Abnahme pro Periode |
|---|---|---|---|---|
| Gleitreibung | $F_R$ konstant | linear | $A$ gegen $t$ | $\Delta A$ konstant |
| Stokes (langsam) | $F_R \sim v$ | exponentiell | $\ln A$ gegen $t$ | $\Delta A \sim A$ |
| Newton (schnell, turbulent) | $F_R \sim v^2$ | hyperbolisch | $\frac1A$ gegen $t$ | $\Delta A \sim A^2$ |

Warum $\ln A$? Aus $A = A_0 e^{-\delta t}$ wird $\ln A = \ln A_0 - \delta\cdot t$ – eine Gerade mit Steigung $-\delta$.

Bei großer Pappscheibe und großen Ausschlägen passt oft $F \sim v^2$; bei kleinen Amplituden am Ende wird die Bewegung langsam, und das Abklingen sieht wieder eher exponentiell aus.

## Stoßdämpfer

Früher dämpfte man Fahrzeuge mit reibenden Scheiben (Gleitreibung). Heute nutzt man Öldämpfer, deren Kraft mit der Geschwindigkeit wächst. Gründe: Gleitreibung bremst auch kleine Stöße mit voller Kraft (hart), kann den Körper außerhalb der Ruhelage „festhalten“ (Haftreibung), nutzt sich ab und ändert sich mit Temperatur und Verschleiß. Ein geschwindigkeitsabhängiger Dämpfer arbeitet dagegen weich und gleichmäßig.
