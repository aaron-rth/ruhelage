// Fehler mitschreiben (nur im Speicher dieser Sitzung), damit eine Fehlermeldung an den Support
// zeigt, was schiefging. Es wird nichts automatisch verschickt.
import { SUPPORT_EMAIL } from '../config';

const MAX = 5;
const letzte: string[] = [];

export function merkeFehler(text: string) {
  const t = `${new Date().toLocaleTimeString('de-DE')} ${text}`.slice(0, 300);
  if (letzte[letzte.length - 1]?.endsWith(text.slice(0, 280))) return;
  letzte.push(t);
  if (letzte.length > MAX) letzte.shift();
}

let aktiv = false;
export function fehlerMitschreiben() {
  if (aktiv) return;
  aktiv = true;
  window.addEventListener('error', (e) => merkeFehler(e.message || String(e.error)));
  window.addEventListener('unhandledrejection', (e) => merkeFehler(`Promise: ${e.reason instanceof Error ? e.reason.message : String(e.reason)}`));
}

export const letzteFehler = () => [...letzte];

/** Kurze technische Angaben – kein Lernfortschritt, keine persönlichen Daten */
export function technikInfo(): string {
  const standalone = window.matchMedia?.('(display-mode: standalone)').matches ? ', Homescreen-App' : '';
  return [
    `Version: ${__BUILD__}`,
    `Seite: ${location.hash || '#/'}`,
    `Gerät: ${navigator.userAgent}`,
    `Bildschirm: ${window.innerWidth}×${window.innerHeight}${standalone}`,
    `Online: ${navigator.onLine ? 'ja' : 'nein'}`,
    ...(letzte.length ? ['Letzte Fehler:', ...letzte.map((f) => `- ${f}`)] : ['Letzte Fehler: keine']),
  ].join('\n');
}

export type MeldungsArt = 'fehler' | 'idee' | 'frage';
const BETREFF: Record<MeldungsArt, string> = { fehler: 'Fehler', idee: 'Idee', frage: 'Frage' };

/** mailto-Link mit ausgefülltem Betreff und Text (die Mail-App öffnet sich, man tippt nur noch auf Senden) */
export function supportLink(art: MeldungsArt, text: string, mitInfo: boolean): string {
  const koerper = [text.trim() || '(bitte beschreiben)', '', ...(mitInfo ? ['— Technische Infos —', technikInfo()] : [])].join('\n');
  return `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(`Ruhelage: ${BETREFF[art]}`)}&body=${encodeURIComponent(koerper.slice(0, 1800))}`;
}
