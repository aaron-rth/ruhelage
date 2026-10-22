// Aktiver Kurs: steht in den Einstellungen, damit er mit dem Konto synchronisiert wird.
import { KURSE, kursMitId } from '../content/kurse';
import type { Kurs } from '../content/types';
import { useStore } from '../store/store';

export function useAktiverKurs(): Kurs {
  return kursMitId(useStore((s) => s.einstellungen.kurs));
}

export function aktiverKurs(): Kurs {
  return kursMitId(useStore.getState().einstellungen.kurs);
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
