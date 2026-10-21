## Drei Kriterien – alle hängen zusammen

Eine Schwingung ist **genau dann harmonisch**, wenn

1. ihr Zeitverlauf durch **Sinus/Kosinus** beschrieben werden kann – sie ist die **Projektion einer gleichförmigen Kreisbewegung**,
2. die **Rückstellkraft proportional zur Auslenkung** ist: $F_R = -D\cdot s$ (lineares Kraftgesetz),
3. die **Periodendauer nicht von der Amplitude** abhängt.

Die drei Punkte sind keine unabhängigen Zufälle: Aus dem linearen Kraftgesetz folgt die DGL $\ddot s = -\frac Dm s$, deren Lösungen Sinus und Kosinus sind – und in $T = 2\pi\sqrt{m/D}$ kommt $\hat s$ nicht vor. Willst du zeigen, dass eine Schwingung **nicht** harmonisch ist, reicht es, **ein** Kriterium zu widerlegen.

## Schwingung als Schatten einer Kreisbewegung

Ein Punkt läuft gleichmäßig auf einem Kreis. Projiziert man ihn auf eine Achse (der „Schatten“ an der Wand), entsteht genau eine harmonische Schwingung. Ein Federpendel, dessen Schatten synchron mit einem Stab auf einer drehenden Scheibe läuft, beweist das im Experiment. Mehr dazu in Thema 6.

## Gegenbeispiel 1: der Wagen auf der Knickbahn

Eine Knickbahn besteht aus zwei schiefen Ebenen mit Neigungswinkel $\alpha$. Ein Wagen wird um $\hat s$ hochgeschoben und losgelassen.

- Auf der schiefen Ebene wirkt die **Hangabtriebskraft** $F_H = m g\sin\alpha$. Sie ist **konstant** – egal, wie weit der Wagen oben ist. Sie zeigt aber immer zur Mitte hin, deshalb schwingt der Wagen hin und her.
- **Kein lineares Kraftgesetz:** Im $F$-$s$-Diagramm ist das keine Ursprungsgerade, sondern ein Sprung von $+mg\sin\alpha$ auf $-mg\sin\alpha$.
- Der Wagen wird **gleichmäßig beschleunigt** (nicht „gleichmäßig schnell“!): $a = g\sin\alpha$. Aus $\hat s = \frac12 a t_1^2$ folgt die Zeit bis zur Mitte
$$t_1 = \sqrt{\frac{2\hat s}{g\sin\alpha}}$$
- Eine ganze Periode besteht aus vier solchen Abschnitten: $T = 4\,t_1 = 4\sqrt{\frac{2\hat s}{g\sin\alpha}}$.
- $T$ **hängt von $\hat s$ ab** (doppelte Amplitude → $\sqrt2$-fache Periodendauer). Also: **nicht harmonisch**.
- Das v-t-Diagramm ist eine **Zickzacklinie** (Dreiecke), das s-t-Diagramm besteht aus Parabelstücken – kein Sinus.

> Achtung, häufiger Fehler: Der Wagen fährt **nicht** mit gleichbleibender Geschwindigkeit hin und her. Er wird auf dem Weg nach unten ständig schneller und auf dem Weg nach oben langsamer.

## Gegenbeispiel 2: Federn mit krummer Kennlinie

Viele Federn verhalten sich nur in einem gewissen Bereich linear. Wird $D$ bei großen Auslenkungen größer (die Feder wird „härter“), schwingt ein weit ausgelenkter Körper **schneller** als ein wenig ausgelenkter – die Periodendauer hängt von der Amplitude ab. Fahrwerksfedern im Auto sind absichtlich so gebaut: kleine Unebenheiten weich, große Stöße hart.

Ähnlich beim **Gummiband**: Seine Kennlinie ist anfangs steil und dann flacher – harmonisch schwingt ein Körper daran nur, wenn er im annähernd linearen Bereich bleibt.

## Gegenbeispiel 3: das Fadenpendel bei großen Winkeln

Für $\alpha > 10^\circ$ gilt die Kleinwinkelnäherung nicht mehr. Die Rückstellkraft wächst langsamer als die Auslenkung, $T$ wird größer und hängt von $\hat\alpha$ ab.
