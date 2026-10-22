// Prüft alle Inhaltspakete in inhalte/. Ein fehlerhaftes Paket lässt CI und Deploy scheitern –
// die Website selbst bleibt dadurch heil. Aufruf einzeln: npm run check:inhalte
import { describe, expect, it } from 'vitest';
import { schwingungen } from './schwingungen';
import { alleIds, baueKurs, gruppierePakete } from './paket';

const pakete = gruppierePakete(
  import.meta.glob('/inhalte/*/kurs.json', { eager: true, import: 'default' }),
  import.meta.glob('/inhalte/*/*/thema.json', { eager: true, import: 'default' }),
  import.meta.glob<string>('/inhalte/*/*/erklaerung.md', { eager: true, query: '?raw', import: 'default' }),
  import.meta.glob<string>('/inhalte/*/*/bilder/*', { eager: true, query: '?url', import: 'default' }),
);

describe('Inhaltspakete', () => {
  it('es gibt mindestens das Beispielpaket', () => {
    expect(pakete.map((p) => p.ordner)).toContain('_beispiel');
  });

  it.each(pakete.map((p) => [p.ordner, p] as const))('%s ist gültig', (_, p) => {
    const { kurs, fehler } = baueKurs(p);
    expect(fehler).toEqual([]);
    expect(kurs).not.toBeNull();
  });

  it('Kurs- und Inhalts-Ids sind app-weit eindeutig', () => {
    const kurse = [schwingungen, ...pakete.map((p) => baueKurs(p).kurs!).filter(Boolean)];
    const kursIds = kurse.map((k) => k.id);
    expect(new Set(kursIds).size).toBe(kursIds.length);
    const ids = kurse.flatMap(alleIds);
    const doppelt = ids.filter((x, i) => ids.indexOf(x) !== i);
    expect(doppelt).toEqual([]);
  });
});
