# Ruhelage

Eine ruhige, durchdachte Lern-App für den Physik-Leistungskurs – zuerst zum Thema **Mechanische Schwingungen** (Klausur K1).
Aufgaben werden im Heft gerechnet, die App prüft das Ergebnis, gibt gestufte Hilfen und merkt sich, was noch nicht sitzt.

**Live:** https://aaron-rth.github.io/ruhelage/ (nach dem Aktivieren von GitHub Pages, siehe unten)

## Was drin ist

| Bereich | Inhalt |
|---|---|
| **Heute** | Tägliche Mischsession: fällige Karteikarten, neue Karten und Aufgaben aus den schwächsten Themen, Nochmal-Stapel. Tagesziel, Streak, XP, Countdown bis zur Klausur. |
| **Aktuell** | Alles Angefangene (Karteikarten, Übungen, Rechenaufgaben, Tagesrunde) – mit einem Klick dort weitermachen, wo man war. Der Stand bleibt auch beim Tab- oder Seitenwechsel erhalten. |
| **Lernpfad** | Themen 0–10 + Querschnitt mit Abhängigkeiten. Selbsteinschätzung ✓ ~ ✗ (startet bei „noch nicht eingeschätzt“) plus berechneter Fortschritt. |
| **Thema** | Kurz erklärt · Karteikarten (Leitner, 5 Fächer, mit ← → blättern) · Übungen (MC mit Begründungen, DGL-Puzzle, Lücken, Fehler finden, Zuordnen, Klassifizieren, interaktive Diagramme) · Rechentrainer (Zufallsaufgaben mit gestufter Hilfe). Überall „Genauer erklärt“ (Taste E). |
| **Statistik** | Klick auf die Serie (unten links bzw. oben rechts auf dem Handy): Wochenverlauf, Lernkalender, Karteikarten-Fächer, Themenfortschritt. Ein Tag zählt für die Serie ab 3 Karteikarten oder 1 Übung/Aufgabe. |
| **Spielwiese** | Feder-/Fadenpendel, Einheitskreis und s(t)-Graph synchron, Schieberegler, Mini-Aufgaben |
| **Nochmal** | Fehlerheft: Falsches landet automatisch hier (Aufgaben mit denselben Zahlen) |
| **Klausurmodus** | Gemischte Aufgaben, optionaler Timer, keine Hilfen, Auswertung nach Themen |
| **Formelsammlung** | Ein Thema pro Seite zum Durchwischen (← →), Themenleiste, Suche über alles |
| **Einstellungen** | Tagesziel, Countdown, Einführung/Hinweise, hell/dunkel, Export/Import als JSON |

Tastatur: Leertaste (Karte umdrehen), 1/2/3 (Bewertung), ← → (Karten blättern), E (Genauer erklärt), Enter (prüfen/weiter), Esc dann H (Hilfe), L (Lösungsweg), N (neue Aufgabe).

Beim ersten Öffnen zeigt eine kurze Einführung, wo was ist; im Lernpfad erklärt ein Hinweis die Selbsteinschätzung. Beides lässt sich in den Einstellungen wieder einschalten.

## Entwickeln

```bash
npm install
npm run dev            # http://localhost:5173/ruhelage/
npm test               # Vitest: Antwortprüfung, Leitner, Physik, alle Generatoren
npm run build          # Typecheck + Produktionsbuild nach dist/
npm run check:material # stellt sicher, dass kein Lernmaterial im Repo liegt
```

Technik: Vite, React, TypeScript, React Router (HashRouter), Zustand (localStorage, versioniertes Schema), KaTeX, Marked. Kein Backend, keine Accounts – jeder Browser hat seinen eigenen Speicherstand. Angefangene Sitzungen liegen getrennt unter `ruhelage-laufend` (nicht im Export).

## Ein neues Thema ergänzen (z. B. „Wellen“)

Inhalte sind strikt vom Code getrennt. Für ein neues Thema muss kein UI-Code angefasst werden.

1. **Ordner anlegen**, z. B. `src/content/wellen/00-grundlagen/` mit:
   - `erklaerung.md` – „Kurz erklärt“ als Markdown, Formeln mit `$…$` bzw. `$$…$$`
   - `karten.ts` – `export const karten: Karte[] = [...]`
   - `mehr.ts` – „Genauer erklärt“ je Karte: `export const mehr: Record<string, string> = { 'karten-id': '…' }` (ein Test prüft, dass jede Karte eine hat)
   - `uebungen.ts` – `export const uebungen: Uebung[] = [...]` (Typen: `mc`, `reihenfolge`, `luecke`, `fehler`, `zuordnen`, `klassifizieren`)
   - `generatoren.ts` – `export const generatoren: Generator[] = [...]`
   - `formeln.ts` – `export const formeln: Formel[] = [...]`
   - `index.ts` – fasst alles zu einem `Thema` zusammen (Id, Nummer, Titel, Abhängigkeiten, Priorität; `karten: karten.map((k) => ({ ...k, mehr: mehr[k.id] }))`)

   Am einfachsten kopierst du einen vorhandenen Themenordner als Vorlage.
2. **Kurs anlegen**: `src/content/wellen/index.ts` exportiert ein `Kurs`-Objekt mit allen Themen und dem Layout des Lernpfads (`pfad`: Zeilen mit Themen-Ids).
3. **Registrieren** in `src/content/kurse.ts`: Kurs in `KURSE` aufnehmen und ggf. `AKTIVER_KURS` umstellen.
4. **Tests laufen lassen**: `npm test` prüft automatisch jeden neuen Generator mit 400 Zufallsseeds (endliche Werte, sinnvolle Einheiten, keine kaputten Texte). Physikalische Konsistenztests kommen in `src/content/physik-konsistenz.test.ts`.

Jede Karte und Aufgabe hat ein Feld `quelle` (z. B. „Buch S. 164“), damit man nachprüfen kann.

### Einen Rechengenerator schreiben

```ts
const beispiel: Generator = {
  id: 'fe-periode',
  titel: 'T eines Federpendels',
  art: 'rechnen',        // oder 'diagramm' (erscheint unter „Übungen“)
  schwierigkeit: 1,
  quelle: 'Buch S. 163',
  klausur: true,         // darf im Klausurmodus vorkommen
  erzeuge(rng) {
    const m = rng.zahl(0.2, 2, 0.1);
    const D = rng.zahl(10, 100, 5);
    const T = periodeFeder(m, D);      // Lösungen immer vom Code berechnen
    return {
      titel: 'Federpendel',
      kontext: `Masse ${g('m', m, 'kg')}, Federkonstante ${g('D', D, 'N/m')}.`,
      teile: [teil('Berechne $T$.', zahl(T, 's'), [hilfe1, hilfe2, hilfe3], loesungsweg)],
      werte: { m, D, T },              // für Konsistenztests
    };
  },
};
```

Antworten werden in SI gespeichert; die Eingabe akzeptiert Komma und Punkt, Zehnerpotenzen und Einheiten mit Vorsilben (Toleranz standardmäßig 2 %). `typischeFehler` liefern gezielte Hinweise (z. B. „Grad statt Bogenmaß“).

## Lernmaterial und Urheberrecht

Schulbuchseiten, Mitschriften und die Übungsklausur liegen **nicht** in diesem öffentlichen Repository. `.gitignore` schließt `material/` und `*.pdf` aus, und `npm run check:material` bricht ab, sobald PDFs, Scans oder Bilder auftauchen (läuft auch in der CI). Alle Inhalte sind in eigenen Worten formuliert.

## Deployment (GitHub Pages)

Der Workflow `.github/workflows/deploy.yml` baut und veröffentlicht bei jedem Push auf `main`. Einmalig in GitHub: **Settings → Pages → Source: GitHub Actions**.
