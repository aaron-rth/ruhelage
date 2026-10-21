// Lernplan: verteilt die noch offenen Themen auf die Tage bis zur Klausur.
// Grundlagen zuerst (Reihenfolge im Lernpfad), am Ende Wiederholung und Probeklausur.
import type { Kurs, Thema } from '../content/types';
import type { Daten } from '../store/store';
import { plusTage, tageZwischen } from './datum';
import { schwaeche, statusVon, themaFortschritt } from './fortschritt';

export interface PlanEintrag {
  thema: Thema;
  /** geschätzte Minuten für dieses Thema an diesem Tag */
  minuten: number;
}

export interface PlanTag {
  datum: string;
  art: 'lernen' | 'wiederholen';
  eintraege: PlanEintrag[];
  minuten: number;
}

export interface Lernplan {
  tage: PlanTag[];
  /** Themen, die (fast) sitzen */
  fertig: Thema[];
  restTage: number;
  minutenProTag: number;
  klausur: string;
}

/** Geschätzter Restaufwand eines Themas in Minuten. */
export function aufwand(t: Thema, d: Daten, h: string): number {
  const f = themaFortschritt(t, d, h);
  const basis = t.karten.length * 0.5 + (t.uebungen.length + t.generatoren.length) * 2.5;
  const status = statusVon(t, d);
  const faktor = status === 'nicht' ? 1 : status === 'kann' ? 0.35 : status === 'halb' ? 0.7 : 0.85;
  return basis * (1 - f.gesamt) * faktor;
}

export function baueLernplan(kurs: Kurs, d: Daten, h: string, klausur: string): Lernplan | null {
  const restTage = tageZwischen(h, klausur); // Lerntage vor dem Klausurtag (heute mitgezählt)
  if (restTage <= 0) return null;

  const ebene = new Map<string, number>();
  kurs.pfad.forEach((zeile, i) => zeile.forEach((id) => ebene.set(id, i)));
  const mitAufwand = kurs.themen.map((t) => ({ t, a: aufwand(t, d, h) }));
  const offen = mitAufwand
    .filter((x) => x.a >= 8)
    .sort((x, y) => (ebene.get(x.t.id) ?? 99) - (ebene.get(y.t.id) ?? 99) || schwaeche(y.t, d, h) - schwaeche(x.t, d, h));
  const fertig = mitAufwand.filter((x) => x.a < 8).map((x) => x.t);

  const wdh = restTage >= 8 ? 2 : restTage >= 4 ? 1 : 0;
  const lernTage = Math.max(1, restTage - wdh);
  const gesamt = offen.reduce((s, x) => s + x.a, 0);
  const proTag = gesamt / lernTage;

  const tage: PlanTag[] = Array.from({ length: lernTage }, (_, i) => ({ datum: plusTage(h, i), art: 'lernen' as const, eintraege: [], minuten: 0 }));
  // Themen der Reihe nach „auffüllen“: ein Thema kann über mehrere Tage gehen
  let pos = 0;
  for (const { t, a } of offen) {
    let rest = a;
    while (rest > 0.5 && proTag > 0) {
      const tag = Math.min(lernTage - 1, Math.floor(pos / proTag + 1e-9));
      const platz = (tag + 1) * proTag - pos;
      const teil = tag === lernTage - 1 ? rest : Math.min(rest, platz);
      tage[tag].eintraege.push({ thema: t, minuten: teil });
      tage[tag].minuten += teil;
      pos += teil;
      rest -= teil;
    }
  }
  // sehr kleine Reste (< 4 min) nicht als eigenen Eintrag zeigen
  for (const tag of tage) tag.eintraege = tag.eintraege.filter((e) => e.minuten >= 4 || tag.eintraege.length === 1);

  // Wiederholung: die schwächsten Themen nochmal, dazu Nochmal-Stapel und Probeklausur
  const schwach = [...kurs.themen].sort((x, y) => schwaeche(y, d, h) - schwaeche(x, d, h)).slice(0, 3);
  for (let i = 0; i < wdh; i++) {
    tage.push({ datum: plusTage(h, lernTage + i), art: 'wiederholen', eintraege: schwach.map((t) => ({ thema: t, minuten: 10 })), minuten: Math.max(30, d.einstellungen.zielMinuten) });
  }

  return { tage, fertig, restTage, minutenProTag: Math.ceil(proTag), klausur };
}

/** Themen, die laut Plan heute dran sind (für die Tagesrunde). */
export function heuteDran(plan: Lernplan | null, h: string): Thema[] {
  return plan?.tage.find((t) => t.datum === h)?.eintraege.map((e) => e.thema) ?? [];
}
