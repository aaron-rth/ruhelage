## Das Modell

Ein kleiner, kompakter Körper der Masse $m$ hängt an einem dünnen Faden. Die **Pendellänge** $\ell$ ist der Abstand vom Aufhängepunkt bis zum **Schwerpunkt** des Körpers. Statt der Auslenkung $s$ (Bogen) gibt man oft den **Auslenkungswinkel** $\alpha$ an; der Startwinkel heißt Winkelamplitude $\hat\alpha$.

## Was die Messungen zeigen

- Die **Masse ist egal.** Ein schwerer Körper braucht mehr Kraft, um beschleunigt zu werden – bekommt aber auch eine größere Gewichtskraft. Genau wie beim freien Fall gleicht sich das aus.
- Die **Amplitude ist egal** – solange der Winkel klein bleibt (bis etwa $10^\circ$).
- **Längeres Pendel → größere Periodendauer**, aber nicht proportional: $T \sim \sqrt\ell$. Die Proportionalitätskonstante liegt bei etwa $2\,\frac{\mathrm s}{\sqrt{\mathrm m}}$.

Tipp für Messungen: Stoppe die Zeit für **mehrere Perioden** (z. B. 10) und teile dann. Der Reaktionsfehler beim Starten und Stoppen verteilt sich so auf viele Schwingungen.

## Woher kommt die Rückstellkraft?

Auf den Körper wirken die **Gewichtskraft** $F_G = m g$ und die **Fadenkraft** in Richtung Aufhängepunkt. Zerlegt man $\vec F_G$:

- Die Komponente **entlang des Fadens** spannt den Faden (zusammen mit der Fadenkraft sorgt sie für die Kreisbahn).
- Die Komponente **tangential zur Bahn** ist die **Rückstellkraft**: $$F_R = -F_G\cdot\sin\alpha$$

Aus dem rechtwinkligen Dreieck mit der Pendellänge als Hypotenuse folgt $\sin\alpha = \frac{s_h}{\ell}$ ($s_h$ = waagerechter Abstand von der Ruhelage). Also
$$F_R = -m g\cdot\frac{s_h}{\ell}$$

## Die Kleinwinkelnäherung

Für **kleine Winkel** ($\alpha \le 10^\circ$) sind waagerechter Abstand $s_h$ und Bogenlänge $s$ fast gleich – und im Bogenmaß gilt $\sin\alpha \approx \alpha$. Bei $10^\circ$ liegt der Fehler nur bei etwa $0{,}5\,\%$.

Damit wird die Rückstellkraft linear:
$$F_R = -\frac{m\cdot g}{\ell}\cdot s \qquad\Rightarrow\qquad D = \frac{m\cdot g}{\ell}$$

Die **Richtgröße** $D$ fasst den Versuchsaufbau zusammen. Setzt man sie in die Formel des Federpendels ein, kürzt sich $m$:
$$T = 2\pi\sqrt{\frac{m}{D}} = 2\pi\sqrt{\frac{\ell}{g}}$$

## Anwendungen

- **Sekundenpendel:** Jeder Ausschlag (eine halbe Periode) dauert eine Sekunde, also $T = 2\,\mathrm s$. Dafür braucht man $\ell = g\left(\frac{T}{2\pi}\right)^2 \approx 0{,}994\,\mathrm m$.
- **Ortsfaktor bestimmen:** Misst man $\ell$ und $T$, folgt $$g = \frac{4\pi^2\,\ell}{T^2}$$
- Auf dem **Mond** ($g \approx 1{,}6\,\mathrm{m/s^2}$) schwingt dasselbe Pendel deutlich langsamer.
- Eine **Schaukel** eignet sich nicht zum Wiegen – $T$ hängt nicht von der Masse ab.

## Warum große Winkel zu größerem T führen

Bei großen Winkeln ist $\sin\alpha$ merklich kleiner als $\alpha$ (probier $\alpha = 45^\circ \approx 0{,}79$: $\sin\alpha \approx 0{,}71$). Die tatsächliche Rückstellkraft fällt deshalb kleiner aus, als das lineare Gesetz vorhersagt. Weniger Kraft heißt weniger Beschleunigung – der Rückweg dauert **länger**. Außerdem hängt $T$ dann von der Amplitude ab – die Schwingung ist streng genommen **nicht mehr harmonisch**.
