// Aktiver Kurs und „Meine Fächer“: steht in den Einstellungen, damit es mit dem Konto synchronisiert wird.
import { useMemo } from 'react';
import { KURSE, kursMitId } from '../content/kurse';
import type { Kurs } from '../content/types';
import { useStore, type Einstellungen } from '../store/store';

/** Kurs ohne ausgeblendete Themen – damit rechnen Tagesrunde, Lernplan, Übungsmixe usw. */
function ohneAusgeblendete(k: Kurs, aus: string[]): Kurs {
  if (!aus.some((id) => k.themen.some((t) => t.id === id))) return k;
  const weg = new Set(aus);
  return { ...k, themen: k.themen.filter((t) => !weg.has(t.id)), pfad: k.pfad.map((z) => z.filter((id) => !weg.has(id))).filter((z) => z.length) };
}

/** Aktiver Kurs ohne ausgeblendete Themen */
export function useAktiverKurs(): Kurs {
  const id = useStore((s) => s.einstellungen.kurs);
  const aus = useStore((s) => s.einstellungen.ausgeblendeteThemen);
  return useMemo(() => ohneAusgeblendete(kursMitId(id), aus ?? []), [id, aus]);
}

/** Aktiver Kurs mit allen Themen (Lernpfad zeigt auch die ausgeblendeten) */
export function useAktiverKursKomplett(): Kurs {
  return kursMitId(useStore((s) => s.einstellungen.kurs));
}

export function aktiverKurs(): Kurs {
  const e = useStore.getState().einstellungen;
  return ohneAusgeblendete(kursMitId(e.kurs), e.ausgeblendeteThemen ?? []);
}

/** Kurs wechseln. Das Klausurdatum gehört zum Kurs und wird mitgetauscht. */
export function wechsleKurs(id: string) {
  const ziel = KURSE.find((k) => k.id === id);
  if (!ziel) return;
  useStore.setState((s) => {
    const e = s.einstellungen;
    const alt = kursMitId(e.kurs);
    if (alt.id === ziel.id) return {};
    const daten = { ...e.klausurDaten, [alt.id]: e.klausurDatum };
    return { einstellungen: { ...e, kurs: ziel.id, klausurDaten: daten, klausurDatum: daten[ziel.id] ?? ziel.klausur?.datum ?? '' } };
  });
}

/** Einstellungen ändern und den Zeitpunkt merken (zusätzliche Schlüssel z. B. „klausurDaten:<kurs>“) */
function setze(f: (e: Einstellungen) => Partial<Einstellungen>, extraZeit: string[] = []) {
  useStore.setState((s) => {
    const neu = f(s.einstellungen);
    const jetzt = Date.now();
    const zeiten = Object.fromEntries([...Object.keys(neu), ...extraZeit].map((k) => [k, jetzt]));
    return { einstellungen: { ...s.einstellungen, ...neu, geaendert: { ...s.einstellungen.geaendert, ...zeiten } } };
  });
}

/** Meine Fächer: hinzugefügte (und der aktive), aufgeteilt in laufend und fertig */
export function meineKurse(e: Einstellungen): { laufend: Kurs[]; fertig: Kurs[] } {
  const ids = new Set([...(e.meineKurse ?? []), e.kurs]);
  const fertig = new Set(e.fertigeKurse ?? []);
  const alle = KURSE.filter((k) => ids.has(k.id));
  return { laufend: alle.filter((k) => !fertig.has(k.id)), fertig: alle.filter((k) => fertig.has(k.id)) };
}

export function useMeineKurse() {
  const e = useStore((s) => s.einstellungen);
  return useMemo(() => meineKurse(e), [e]);
}

/** Kurs zu „Meine Fächer“ hinzufügen und gleich öffnen */
export function fuegeKursHinzu(id: string) {
  setze((e) => ({ meineKurse: [...new Set([...(e.meineKurse ?? []), e.kurs, id])], fertigeKurse: (e.fertigeKurse ?? []).filter((x) => x !== id) }));
  wechsleKurs(id);
}

/** Kurs als fertig markieren (ausblenden) oder zurückholen. Beim Ausblenden des aktiven Kurses wird gewechselt. */
export function setzeKursFertig(id: string, fertig: boolean) {
  setze((e) => ({
    meineKurse: [...new Set([...(e.meineKurse ?? []), e.kurs])],
    fertigeKurse: fertig ? [...new Set([...(e.fertigeKurse ?? []), id])] : (e.fertigeKurse ?? []).filter((x) => x !== id),
  }));
  const e = useStore.getState().einstellungen;
  if (fertig && e.kurs === id) {
    const naechster = meineKurse(e).laufend.find((k) => k.id !== id);
    if (naechster) wechsleKurs(naechster.id);
  }
  if (!fertig) wechsleKurs(id);
}

/** Klausurtermin eines Kurses ('' = keiner). Der aktive Kurs hat seinen Termin in klausurDatum. */
export function klausurDatumVon(e: Einstellungen, id: string): string {
  if (id === e.kurs) return e.klausurDatum;
  return e.klausurDaten?.[id] ?? KURSE.find((k) => k.id === id)?.klausur?.datum ?? '';
}

export function setzeKlausurDatum(id: string, datum: string) {
  // klausurDaten ist die Quelle für alle Kurse; klausurDatum spiegelt den aktiven
  setze((e) => ({ klausurDaten: { ...e.klausurDaten, [id]: datum }, ...(id === e.kurs ? { klausurDatum: datum } : {}) }), [`klausurDaten:${id}`]);
}

/** Thema von Hand in die Tagesrunde aufnehmen oder herausnehmen */
export function setzeTagesrunde(id: string, an: boolean) {
  setze((e) => ({ tagesrunde: { ...e.tagesrunde, [id]: an } }), [`tagesrunde:${id}`]);
}

/** „Kurz erklärt“ gelesen – Thema gilt damit als gestartet */
export function merkeGelesen(id: string) {
  const e = useStore.getState().einstellungen;
  if (!e.gelesen?.includes(id)) setze((x) => ({ gelesen: [...(x.gelesen ?? []), id] }));
}

export function setzeThemaAusgeblendet(id: string, aus: boolean) {
  setze((e) => ({ ausgeblendeteThemen: aus ? [...new Set([...(e.ausgeblendeteThemen ?? []), id])] : (e.ausgeblendeteThemen ?? []).filter((x) => x !== id) }));
}

/** Kurse nach Fach gruppiert (für Fächer-Seite und Seitenleiste). */
export function kurseNachFach(): { fach: string; kurse: Kurs[] }[] {
  const gruppen = new Map<string, Kurs[]>();
  for (const k of KURSE) gruppen.set(k.fach, [...(gruppen.get(k.fach) ?? []), k]);
  return [...gruppen].map(([fach, kurse]) => ({ fach, kurse }));
}

// Was ein Kurs anbietet – Inhaltspakete haben z. B. keine Rechengeneratoren.
export const hatRechnen = (k: Kurs) => k.themen.some((t) => t.generatoren.some((g) => g.art === 'rechnen'));
export const hatProbeklausur = (k: Kurs) => k.themen.some((t) => t.generatoren.some((g) => g.klausur));
export const hatFormeln = (k: Kurs) => k.themen.some((t) => t.formeln.length > 0);
/** Die Spielwiese (Pendel, Graphen) gehört zum Physik-Kurs */
export const hatSpielwiese = (k: Kurs) => k.id === 'schwingungen';
