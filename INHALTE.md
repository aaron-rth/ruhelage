# Inhalte für Ruhelage erstellen

Diese Anleitung ist für den Chat (Mensch oder KI), der **neue Fächer und Themen** anlegt.
Dafür reicht es, Dateien im Ordner `inhalte/` anzulegen. Die App findet sie automatisch.

## Regeln

1. **Nur `inhalte/` ändern.** Code (`src/`, `scripts/`, `.github/`, `package.json` …) wird nicht angefasst.
   Fehlt etwas im Format, notier es im Pull Request, statt den Code zu ändern.
2. **Keine Texte, Aufgaben oder Bilder aus Schulbüchern oder Arbeitsblättern übernehmen.**
   Das Repository ist öffentlich und Schulbücher sind urheberrechtlich geschützt.
   Unterlagen dienen nur als Orientierung, *was* gelernt werden muss. Alle Texte, Aufgaben, Zahlenwerte
   und Beispiele werden neu und in eigenen Worten geschrieben. Bilder nur, wenn sie selbst erstellt sind.
3. **Keine PDFs** und keine Fotos von Unterlagen ins Repository legen. Bilder nur als selbst erstellte **SVG**.
   PNG, JPG und Co. blockiert `npm run check:material`, damit nie versehentlich ein Scan veröffentlicht wird.
4. Vor dem Abschluss `npm run check:inhalte` ausführen. Es muss fehlerfrei durchlaufen.
5. Arbeit auf einem eigenen Branch und als Pull Request abgeben. Neue Kurse zuerst mit `"entwurf": true` anlegen.

## Aufbau

```
inhalte/
  <kurs-ordner>/              z. B. deutsch-k1-sachtexte
    kurs.json
    01-<thema>/               Nummer bestimmt Reihenfolge und Themennummer
      thema.json
      erklaerung.md
      bilder/                 optional, nur .svg, z. B. bilder/aufbau.svg
    02-<thema>/
      …
```

`inhalte/_beispiel/` ist ein vollständiges, gültiges Beispiel. Es ist zugleich das Beispiel-Fach der Einführung (`"beispiel": true`). Zum Kopieren gut geeignet, aber im neuen Kurs `"beispiel"` weglassen.

## kurs.json

```json
{
  "id": "deutsch-k1-sachtexte",
  "fach": "Deutsch",
  "klasse": "K1",
  "titel": "Sachtexte analysieren",
  "klausur": { "datum": "2027-01-20", "titel": "2. Klausur" },
  "pfad": [["thema-a"], ["thema-b", "thema-c"]],
  "entwurf": true
}
```

- `id`: nur `a–z`, `0–9` und `-`. Muss über alle Kurse eindeutig sein.
- `klasse`: z. B. `"K1"`, `"K2"` oder `"Klasse 10"`.
- `klausur` ist optional. Ohne sie gibt es keinen Lernplan und keinen Countdown.
- `pfad` ist optional: Zeilen des Lernpfads, Themen in einer Zeile stehen nebeneinander.
  Ohne `pfad` steht jedes Thema in einer eigenen Zeile.
- `entwurf: true`: Der Kurs ist nur lokal (`npm run dev`) sichtbar, nicht auf der Website.
  Zum Veröffentlichen entfernen.

## thema.json

```json
{
  "id": "sachtexte-aufbau",
  "titel": "Aufbau einer Analyse",
  "untertitel": "Einleitung, Hauptteil, Schluss",
  "abhaengig": ["andere-thema-id"],
  "quelleErklaerung": "eigene Zusammenfassung",
  "karten": [ … ],
  "uebungen": [ … ],
  "formeln": [ { "name": "Gesetz", "tex": "F = m a" } ]
}
```

Optional sind `abhaengig`, `quelleErklaerung`, `formeln`, `prioritaet` (kleiner = wichtiger) und `neu` (true/false).
Jedes Thema braucht mindestens eine Karte oder Übung.

**Ids:** Alle Ids (Thema, Karten, Übungen) beginnen am besten mit dem Thema, z. B. `sachtexte-aufbau-k1`.
So bleiben sie app-weit eindeutig.

### Karteikarten

```json
{ "id": "…-k1", "typ": "begriff", "vorne": "Frage", "hinten": "Antwort", "quelle": "eigene Karte", "mehr": "optionale längere Erklärung" }
```

`typ`: `begriff`, `warum`, `wasPassiert`, `fehler`, `formel` oder `herleitung`.

### Übungen

Alle Übungen haben `id`, `typ`, `frage`, `quelle` und optional `erklaerung` (wird nach dem Prüfen gezeigt).

| typ | zusätzliche Felder |
|---|---|
| `mc` | `optionen`: `[{ "text", "warum", "richtig": true }]`. Genau eine Option ist richtig, jede hat ein `warum`. |
| `reihenfolge` | `schritte`: Texte in der richtigen Reihenfolge (werden gemischt). |
| `luecke` | `text` mit `[[0]]`, `[[1]]` … und `luecken`: `[{ "optionen": [...], "richtig": 0 }]`. |
| `fehler` | `schritte`, `fehler` (Index des falschen Schritts), `erklaerung` (Pflicht). |
| `zuordnen` | `paare`: `[{ "links", "rechts" }]`. |
| `klassifizieren` | `kategorien`: `[...]`, `items`: `[{ "text", "kategorie": 0, "warum" }]`. |
| `schreiben` | siehe unten |

### Schreibaufgaben (Operatoren)

Für offene Aufgaben wie „Erläutern Sie …“, „Erörtern Sie …“ oder „Analysieren Sie …“.
Man schreibt die Antwort, vergleicht sie mit dem Erwartungshorizont und bewertet sich nach den Kriterien.
Über den Info-Knopf am Operator gibt es einen fertigen **KI-Prompt**. Er enthält Aufgabe, Operator,
Erwartungshorizont, Kriterien und die eigene Antwort. Man kann ihn in eine KI kopieren, die dann nach
genau diesen Kriterien korrigiert. Je genauer Erwartung und Kriterien sind, desto besser wird die KI-Korrektur.

```json
{
  "id": "…-s1",
  "typ": "schreiben",
  "operator": "eroertern",
  "frage": "Erörtern Sie, ob …",
  "quelle": "eigene Aufgabe",
  "umfang": "ca. 400 Wörter",
  "material": "optional: eigener Text, Tabelle oder Bild (Markdown)",
  "erwartung": ["Stichpunkt, was eine gute Antwort enthält", "…"],
  "kriterien": [
    { "name": "Argumentation", "beschreibung": "mind. drei Argumente mit Beispielen", "punkte": 6 },
    { "name": "Darstellung", "beschreibung": "Gliederung, Fachsprache", "punkte": 2 }
  ]
}
```

Erlaubte Operatoren: `nennen`, `beschreiben`, `darstellen`, `zusammenfassen`, `erklaeren`, `erlaeutern`,
`begruenden`, `vergleichen`, `analysieren`, `charakterisieren`, `einordnen`, `interpretieren`, `eroertern`,
`diskutieren`, `beurteilen`, `bewerten`, `stellung-nehmen`, `ableiten` (= folgern, nicht „ableiten“ in Mathe), `deuten`,
für Mathematik zusätzlich `angeben`, `berechnen`, `bestimmen`, `untersuchen`, `zeigen`, `skizzieren`.
Fehlt einer, im Pull Request notieren.

Schreibaufgaben erscheinen im Thema unter „Übungen“, aber nicht in den gemischten Runden, weil sie zu lange dauern.

### Rechenaufgaben (Rechentrainer)

Für Fächer mit Rechnen (Mathe, Physik, Chemie …). Jede Runde bekommt neue Zufallszahlen. Es gibt drei
gestufte Hilfen und einen Lösungsweg. Geprüft wird nur eine **Zahl**, kein Term. Frag also nach einer
Steigung, Stelle, einem Funktionswert oder einem Koeffizienten, nicht nach „f'(x) = …“.

```json
"rechenaufgaben": [
  {
    "id": "…-r1",
    "titel": "Tangentensteigung",
    "schwierigkeit": 2,
    "quelle": "eigene Aufgabe",
    "werte": { "a": [2, 5], "b": { "von": -4, "bis": 4, "ohne": [0] }, "x0": { "aus": [-2, -1, 1, 2] } },
    "berechnet": { "m": "2*a*x0 + b" },
    "bedingung": "m != 0",
    "kontext": "Gegeben ist $f(x) = {a}x^2 {+b}x$.",
    "teile": [
      {
        "frage": "Berechne die Steigung an der Stelle $x_0 = {x0}$.",
        "ergebnis": "m",
        "einheit": "",
        "hilfen": ["Gesucht ist $f'({x0})$.", "$f'(x) = {2*a}x {+b}$", "$f'({x0}) = {2*a} \\cdot ({x0}) {+b}$"],
        "loesung": "$f'(x) = {2*a}x {+b}$, also $f'({x0}) = {m}$.",
        "typischeFehler": [{ "ergebnis": "a*x0^2 + b*x0", "hinweis": "Das ist $f({x0})$, nicht die Steigung." }]
      }
    ]
  }
]
```

- **werte:** Zufallszahlen. `[min, max]` sind ganze Zahlen, `{"von", "bis", "schritt", "ohne"}` erlaubt Kommazahlen und Ausnahmen, `{"aus": [...]}` wählt aus einer Liste.
- **berechnet** (optional): Hilfswerte, die der Reihe nach ausgerechnet werden.
- **bedingung** (optional): Es wird neu gewürfelt, bis sie gilt (`!=`, `==`, `<`, `>`, `&&`, `||`).
  **Ergebnisse dürfen nicht 0 sein**, solche Fälle mit der Bedingung ausschließen.
- **Platzhalter in Texten:** `{a}` oder `{2*a*x0}` setzt den Wert ein. `{+b}` schreibt das Vorzeichen immer mit, das braucht man für „x^2 {+b}x“.
  In `$…$` erscheint das Komma automatisch richtig. TeX-Klammern wie `\\frac{1}{2}` bleiben unberührt. Für Exponenten `x^{{n}}` schreiben.
  Achte darauf, dass keine „1x“ oder „+0“ entstehen. Dafür gibt es `ohne` bzw. die Wahl der Bereiche.
- **Formeln:** `+ - * / ^`, Klammern, `sqrt`, `abs`, `sin`, `cos`, `tan`, `asin`, `acos`, `atan`, `ln`, `log`, `exp`, `min`, `max`,
  `runde(x, n)`, `grad(x)`, `rad(x)`, `pi`, `e`. Winkelfunktionen rechnen im Bogenmaß.
- **einheit:** leer für ohne Einheit, sonst ein Schlüssel aus `src/lib/einheiten.ts` (z. B. `m`, `s`, `m/s`). **toleranz:** relativ, Standard 0,01.
- **hilfen:** genau drei: Ansatz, Zwischenschritt, fast fertig.
- **typischeFehler** (optional): bekannte Fehler mit gezieltem Hinweis. Ist ein Fehlerwert zufällig richtig, wird er in dieser Runde weggelassen.
- **klausur: true** (optional): Die Aufgabe darf in der Probeklausur vorkommen.

`npm run check:inhalte` rechnet jede Rechenaufgabe mit 200 Zufallsbelegungen durch und meldet unbekannte
Variablen, Division durch 0, Ergebnisse gleich 0 und Ähnliches.

## erklaerung.md

„Kurz erklärt“ des Themas, in Markdown. Gliederung mit `## Überschriften`, denn die Abschnitte werden für
„Genauer erklärt“ genutzt. Formeln als `$…$` oder `$$…$$`. Bilder als `![Beschreibung](bilder/datei.svg)`.

## Formeln und JSON

In JSON muss jeder Backslash verdoppelt werden: `"$\\frac{1}{2} m v^2$"`.
In `erklaerung.md` schreibt man normal: `$\frac{1}{2} m v^2$`.

## Prüfen

```
npm install          # einmalig
npm run check:inhalte
npm run dev          # Vorschau, Entwürfe sind hier sichtbar
```

Der Check meldet Fehler mit Datei und Stelle, z. B.
`inhalte/deutsch-k1/01-aufbau/thema.json → uebungen[2]: genau eine Option braucht "richtig": true`.
Dieselbe Prüfung läuft in CI. Ein fehlerhaftes Paket kann also nicht veröffentlicht werden.
