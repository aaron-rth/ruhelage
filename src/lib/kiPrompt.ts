// Vorlage, mit der man eine eigene Antwort auf eine Schreibaufgabe von einer KI bewerten lassen kann.
// Der Prompt enthält Aufgabe, Operator, Erwartungshorizont und Kriterien – die KI soll streng nach
// diesen Kriterien korrigieren wie eine Lehrkraft und konkrete, ehrliche Rückmeldung geben.
import { operatorVon } from '../content/operatoren';
import type { SchreibUebung } from '../content/types';

export const ANTWORT_PLATZHALTER = '[HIER DEINE ANTWORT EINFÜGEN]';

export function punkteSumme(u: SchreibUebung): number {
  return u.kriterien.reduce((a, k) => a + k.punkte, 0);
}

export function kiPrompt(u: SchreibUebung, kurs: { fach: string; klasse: string }, antwort?: string): string {
  const op = operatorVon(u.operator);
  const opZeile = op ? `**${op.name}** (Anforderungsbereich ${op.afb}): ${op.bedeutung}` : `**${u.operator}**`;
  const summe = punkteSumme(u);
  const text = antwort?.trim() ? antwort.trim() : ANTWORT_PLATZHALTER;
  const teile = [
    `Du bist eine erfahrene, faire und genaue Lehrkraft für ${kurs.fach} (Oberstufe/Klassenstufe ${kurs.klasse}, Gymnasium in Baden-Württemberg). Korrigiere die Antwort unten so, wie du eine Klausur korrigieren würdest.`,
    '',
    '## Aufgabe',
    u.frage.trim(),
    '',
    `Operator: ${opZeile}`,
    u.umfang ? `Erwarteter Umfang: ${u.umfang}` : '',
    u.material ? `\n## Material\n${u.material.trim()}` : '',
    '',
    '## Erwartungshorizont (Grundlage deiner Korrektur)',
    ...u.erwartung.map((e) => `- ${e}`),
    '',
    `## Bewertungskriterien (insgesamt ${summe} Punkte)`,
    ...u.kriterien.map((k, i) => `${i + 1}. ${k.name} (${k.punkte} P.): ${k.beschreibung}`),
    '',
    '## Antwort der Schülerin / des Schülers',
    '"""',
    text,
    '"""',
    '',
    '## So gehst du vor',
    `1. Falls oben noch „${ANTWORT_PLATZHALTER}“ steht, bitte zuerst um die Antwort und bewerte noch nichts.`,
    '2. Prüfe, ob der Operator erfüllt ist: Wird wirklich das geleistet, was er verlangt (z. B. reicht bei „erläutern“ eine Aufzählung nicht)? Sag es deutlich, wenn nicht.',
    '3. Bewerte jedes Kriterium einzeln mit Punkten. Begründe kurz und belege mit einem kurzen Zitat aus der Antwort. Gib keine Punkte für etwas, das nicht in der Antwort steht.',
    '4. Andere fachlich richtige Gedanken als im Erwartungshorizont zählen ebenfalls – der Erwartungshorizont ist nicht abschließend.',
    '5. Benenne fachliche Fehler und Ungenauigkeiten konkret und korrigiere sie.',
    '6. Sei ehrlich und konkret statt allgemein-lobend. Schreibe die Antwort nicht komplett neu.',
    '',
    '## Form deiner Rückmeldung (auf Deutsch, knapp)',
    '**Operator erfüllt?** ja / teilweise / nein – ein Satz Begründung',
    '**Kriterien:** Tabelle mit Kriterium | Punkte | Begründung',
    `**Gesamt:** x von ${summe} Punkten`,
    '**Fachliche Fehler:** Liste (oder „keine“)',
    '**Die zwei wichtigsten Verbesserungen:** jeweils mit einer verbesserten Beispielformulierung (höchstens 2 Sätze)',
  ];
  return teile.filter((z, i, a) => !(z === '' && a[i - 1] === '')).join('\n').trim();
}
