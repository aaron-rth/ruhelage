// Operatoren für offene Aufgaben (Schreibaufgaben). Eigene Kurzbeschreibungen, angelehnt an die
// übliche Einteilung in drei Anforderungsbereiche (I Wiedergabe, II Anwenden, III Beurteilen).
export interface Operator {
  name: string;
  /** Anforderungsbereich */
  afb: 'I' | 'II' | 'III' | 'II–III';
  /** was der Operator verlangt */
  bedeutung: string;
  /** woran man eine gute Antwort erkennt */
  tipp: string;
}

export const OPERATOREN: Record<string, Operator> = {
  nennen: {
    name: 'Nennen',
    afb: 'I',
    bedeutung: 'Begriffe, Größen oder Fakten ohne Erläuterung aufzählen.',
    tipp: 'Knapp und vollständig – Stichpunkte reichen.',
  },
  beschreiben: {
    name: 'Beschreiben',
    afb: 'I',
    bedeutung: 'Einen Sachverhalt, Ablauf oder Verlauf strukturiert und fachsprachlich in eigenen Worten wiedergeben.',
    tipp: 'Geordnet vorgehen (z. B. zeitlich oder vom Großen ins Detail), Fachbegriffe benutzen, noch nicht deuten.',
  },
  darstellen: {
    name: 'Darstellen',
    afb: 'I',
    bedeutung: 'Zusammenhänge oder Inhalte strukturiert wiedergeben, ggf. auch grafisch.',
    tipp: 'Klare Gliederung, Zusammenhänge sichtbar machen (Pfeile, Absätze, Skizze).',
  },
  zusammenfassen: {
    name: 'Zusammenfassen',
    afb: 'I',
    bedeutung: 'Die wesentlichen Aussagen eines Materials gekürzt und sachlich in eigenen Worten wiedergeben.',
    tipp: 'Nur Kerngedanken, keine eigene Meinung, Präsens, indirekte Rede statt Zitate.',
  },
  erklaeren: {
    name: 'Erklären',
    afb: 'II',
    bedeutung: 'Einen Sachverhalt auf Gesetze, Regeln oder Ursachen zurückführen, sodass er verständlich wird.',
    tipp: 'Ursache → Wirkung deutlich machen („weil“, „dadurch“, „daher“), die zugrunde liegende Regel nennen.',
  },
  erlaeutern: {
    name: 'Erläutern',
    afb: 'II',
    bedeutung: 'Einen Sachverhalt erklären und durch zusätzliche Informationen oder Beispiele verständlich machen.',
    tipp: 'Wie „erklären“, aber ausführlicher: mindestens ein passendes Beispiel und die Zusammenhänge Schritt für Schritt.',
  },
  begruenden: {
    name: 'Begründen',
    afb: 'II',
    bedeutung: 'Eine Aussage durch Argumente, Regeln oder Belege stützen.',
    tipp: 'Behauptung → Argument → Beleg. Jedes Argument muss die Aussage wirklich stützen.',
  },
  vergleichen: {
    name: 'Vergleichen',
    afb: 'II',
    bedeutung: 'Gemeinsamkeiten und Unterschiede nach festgelegten Kriterien herausarbeiten.',
    tipp: 'Vergleichskriterien nennen und Punkt für Punkt vergleichen, am Ende ein kurzes Fazit.',
  },
  analysieren: {
    name: 'Analysieren',
    afb: 'II',
    bedeutung: 'Ein Material unter einer Fragestellung systematisch untersuchen: Aufbau, Inhalt, sprachliche und gestalterische Mittel und ihre Wirkung.',
    tipp: 'Immer Mittel + Beleg (Zeile) + Wirkung/Funktion. Nicht nacherzählen.',
  },
  charakterisieren: {
    name: 'Charakterisieren',
    afb: 'II',
    bedeutung: 'Eine Figur oder Sache in ihren typischen Merkmalen beschreiben und diese im Zusammenhang deuten.',
    tipp: 'Äußere und innere Merkmale, Verhalten, Beziehungen – jeweils mit Textbeleg.',
  },
  einordnen: {
    name: 'Einordnen',
    afb: 'II',
    bedeutung: 'Einen Sachverhalt begründet in einen größeren Zusammenhang (Epoche, Theorie, Entwicklung) stellen.',
    tipp: 'Den Zusammenhang kurz darstellen und die Verbindung ausdrücklich begründen.',
  },
  interpretieren: {
    name: 'Interpretieren',
    afb: 'III',
    bedeutung: 'Einen Text oder ein Material auf Grundlage einer Analyse begründet deuten.',
    tipp: 'Deutungshypothese → Analyse mit Belegen → begründete Gesamtdeutung.',
  },
  eroertern: {
    name: 'Erörtern',
    afb: 'III',
    bedeutung: 'Eine Frage durch Abwägen von Pro- und Contra-Argumenten untersuchen und zu einem begründeten Urteil kommen.',
    tipp: 'Klare These, Argumente mit Beispielen, Gegenargumente ernst nehmen, eigenes Urteil am Schluss.',
  },
  diskutieren: {
    name: 'Diskutieren',
    afb: 'III',
    bedeutung: 'Zu einer Aussage oder These Argumente und Gegenargumente gegenüberstellen und abwägen.',
    tipp: 'Beide Seiten fair darstellen, gewichten, Schlussfolgerung ziehen.',
  },
  beurteilen: {
    name: 'Beurteilen',
    afb: 'III',
    bedeutung: 'Zu einem Sachverhalt ein selbstständiges, fachlich begründetes Urteil fällen – ohne persönliche Wertung.',
    tipp: 'Kriterien offenlegen, Sachargumente prüfen, Urteil klar formulieren.',
  },
  bewerten: {
    name: 'Bewerten',
    afb: 'III',
    bedeutung: 'Wie „beurteilen“, zusätzlich mit offengelegten eigenen Wertmaßstäben.',
    tipp: 'Sachurteil + Werturteil trennen, die eigenen Maßstäbe ausdrücklich nennen.',
  },
  'stellung-nehmen': {
    name: 'Stellung nehmen',
    afb: 'III',
    bedeutung: 'Eine eigene, begründete Position zu einer Aussage oder Frage beziehen.',
    tipp: 'Position klar benennen und mit Argumenten und Beispielen stützen.',
  },
  ableiten: {
    name: 'Ableiten',
    afb: 'II',
    bedeutung: 'Aus Gesetzen oder Zusammenhängen schrittweise eine Folgerung gewinnen.',
    tipp: 'Jeden Schritt nachvollziehbar machen und sagen, welches Gesetz verwendet wird.',
  },
  deuten: {
    name: 'Deuten',
    afb: 'II–III',
    bedeutung: 'Ergebnisse, Diagramme oder Beobachtungen in einen fachlichen Zusammenhang stellen und erklären, was sie bedeuten.',
    tipp: 'Erst beschreiben, was man sieht, dann fachlich erklären, warum es so ist.',
  },
};

export function operatorVon(key: string): Operator | undefined {
  return OPERATOREN[key];
}
