Drei Werkzeuge, die in Klausuraufgaben gern quer zu den Themen auftauchen.

## 1. Messunsicherheit

Jede Messung hat eine Unsicherheit, z. B. $\ell = (0{,}80 \pm 0{,}01)\,\mathrm m$. Wichtig ist die **relative** Unsicherheit:
$$\frac{\Delta\ell}{\ell} = \frac{0{,}01}{0{,}80} = 1{,}25\,\%$$

**Wie pflanzen sich Unsicherheiten fort?** Für eine Abschätzung (Größtfehler) gilt:

- Bei **Produkten und Quotienten** addieren sich die **relativen** Unsicherheiten.
- Steht eine Größe mit **Exponent** $n$ in der Formel, zählt ihre relative Unsicherheit **$n$-fach**.

Beispiel Ortsfaktor aus dem Fadenpendel: $g = \frac{4\pi^2\ell}{T^2}$, also $g \sim \frac{\ell}{T^2}$:
$$\frac{\Delta g}{g} \approx \frac{\Delta\ell}{\ell} + 2\cdot\frac{\Delta T}{T}$$
Die Zeitmessung geht **doppelt** ein, weil $T$ quadriert wird. Deshalb lohnt es sich besonders, $T$ genau zu messen.

**Mehrere Perioden messen:** Stoppt man die Zeit für $n$ Perioden mit der Unsicherheit $\Delta t$ (Reaktionszeit), dann ist $T = \frac tn$ und $\Delta T = \frac{\Delta t}{n}$. Bei 20 Perioden ist die Unsicherheit pro Periode zwanzigmal kleiner.

Das Ergebnis schreibt man mit absoluter Unsicherheit: $g = (9{,}8 \pm 0{,}2)\,\frac{\mathrm m}{\mathrm{s^2}}$ – nicht mit mehr Stellen, als die Unsicherheit hergibt.

## 2. Pendel in beschleunigten Bezugssystemen

Ein Fadenpendel „spürt“ nicht $g$ allein, sondern die **effektive** Schwerebeschleunigung im Bezugssystem:

| Situation | $g_\text{eff}$ | Folge für $T = 2\pi\sqrt{\ell/g_\text{eff}}$ |
|---|---|---|
| Aufzug fährt an **nach oben** (oder bremst bei Abwärtsfahrt) | $g + a$ | $T$ wird **kleiner** |
| Aufzug fährt an **nach unten** (oder bremst bei Aufwärtsfahrt) | $g - a$ | $T$ wird **größer** |
| Aufzug fährt **gleichförmig** | $g$ | unverändert |
| **freier Fall** (Seil reißt) | $0$ | nichts zieht mehr zurück – es gibt keine Periodendauer mehr |

Im freien Fall fallen Aufhängung und Pendelkörper gleich schnell. Relativ zum Aufzug zieht nichts mehr zurück ($g_\text{eff} = 0$) – die Schwingung hört auf.

Auf **Federpendel** wirkt sich das nicht aus: $T = 2\pi\sqrt{m/D}$ enthält kein $g$ – es verschiebt sich nur die Ruhelage.

## 3. Kleine Änderungen und die Pendeluhr

Ändert sich $\ell$ nur ein wenig, kann man schnell abschätzen, wie sich $T$ ändert. Wegen $T \sim \sqrt\ell$ gilt
$$\frac{\Delta T}{T} \approx \frac12\cdot\frac{\Delta\ell}{\ell}$$
(allgemein: Bei $T \sim x^n$ ist $\frac{\Delta T}{T} \approx n\cdot\frac{\Delta x}{x}$.)

**Pendeluhr:** Die Uhr zählt Perioden. Wird das Pendel z. B. durch Wärme länger, wird jede Periode länger – die Uhr zählt pro echter Zeit **weniger** Perioden und **geht nach**. Die Gangabweichung pro Tag ist ungefähr
$$\Delta t_\text{Tag} \approx 86\,400\,\mathrm s\cdot\frac{\Delta T}{T}$$
Wird das Pendel kürzer (Kälte), geht die Uhr **vor**.

Für die Längenänderung durch Wärme gilt $\Delta\ell = \alpha_\text{th}\cdot\ell\cdot\Delta\vartheta$ mit dem Ausdehnungskoeffizienten $\alpha_\text{th}$ (z. B. Messing etwa $19\cdot 10^{-6}\,\frac1{\mathrm K}$).
