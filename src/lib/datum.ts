// Datumshilfen in lokaler Zeit, Format YYYY-MM-DD.

export function isoDatum(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const t = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${t}`;
}

export function heute(): string {
  return isoDatum(new Date());
}

export function parseDatum(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function plusTage(iso: string, n: number): string {
  const d = parseDatum(iso);
  d.setDate(d.getDate() + n);
  return isoDatum(d);
}

/** Ganze Tage von `von` bis `bis` (positiv, wenn `bis` später liegt). */
/** Tage von `von` bis `bis`; ohne Datum (z. B. keine Klausur geplant) -1. */
export function tageZwischen(von: string, bis: string): number {
  if (!von || !bis) return -1;
  const ms = parseDatum(bis).getTime() - parseDatum(von).getTime();
  return Math.round(ms / 86_400_000);
}

export function datumLang(iso: string): string {
  return parseDatum(iso).toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' });
}
