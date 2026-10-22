import { describe, expect, it } from 'vitest';
import { leereDaten } from '../store/store';
import { syncFehlerArt } from './cloud';
import { fuehreZusammen } from './zusammenfuehren';

describe('Zusammenführen von Speicherständen', () => {
  it('behält von beiden Geräten den weiteren Fortschritt', () => {
    const handy = leereDaten();
    const laptop = leereDaten();
    handy.karten.a = { fach: 3, faellig: '2026-10-25', wiederholungen: 3, zuletzt: '2026-10-23' };
    laptop.karten.a = { fach: 2, faellig: '2026-10-22', wiederholungen: 2, zuletzt: '2026-10-21' };
    laptop.karten.b = { fach: 2, faellig: '2026-10-22', wiederholungen: 1, zuletzt: '2026-10-21' };
    handy.ergebnisse['gen:x'] = { versuche: 2, richtig: 1, verlauf: [0, 1], zuletzt: '2026-10-22' };
    laptop.ergebnisse['gen:x'] = { versuche: 5, richtig: 4, verlauf: [1, 1, 0, 1, 1], zuletzt: '2026-10-21' };
    handy.tage['2026-10-21'] = { xp: 10, sekunden: 600, karten: 5, aufgaben: 0 };
    laptop.tage['2026-10-21'] = { xp: 30, sekunden: 300, karten: 2, aufgaben: 3 };
    handy.xp = 10;
    laptop.xp = 30;
    handy.einstellungen.theme = 'light';
    const m = fuehreZusammen(handy, laptop);
    expect(m.karten.a.fach).toBe(3);
    expect(m.karten.b.fach).toBe(2);
    expect(m.ergebnisse['gen:x'].versuche).toBe(5);
    expect(m.tage['2026-10-21']).toMatchObject({ xp: 30, sekunden: 600, karten: 5, aufgaben: 3 });
    expect(m.xp).toBe(30);
    expect(m.einstellungen.theme).toBe('light');
  });

  it('entfernt Karten aus dem Nochmal-Stapel, die später gewusst wurden', () => {
    const a = leereDaten();
    const b = leereDaten();
    a.nochmal = [{ key: 'karte:k', art: 'karte', ref: 'k', themaId: 't', seit: '2026-10-20' }];
    b.karten.k = { fach: 2, faellig: '2026-10-23', wiederholungen: 2, zuletzt: '2026-10-22' };
    expect(fuehreZusammen(a, b).nochmal).toHaveLength(0);
    expect(fuehreZusammen(a, leereDaten()).nochmal).toHaveLength(1);
  });

  it('ist idempotent', () => {
    const a = leereDaten();
    a.karten.x = { fach: 4, faellig: '2026-10-30', wiederholungen: 4, zuletzt: '2026-10-26' };
    const m = fuehreZusammen(a, a);
    expect(JSON.stringify(fuehreZusammen(m, m))).toBe(JSON.stringify(m));
  });
});


describe('Synchronisierungsfehler', () => {
  it('offline ist kein Abmelden', () => {
    expect(syncFehlerArt({ message: 'TypeError: Failed to fetch' }, true)).toBe('offline');
    expect(syncFehlerArt({ message: 'Load failed' }, true)).toBe('offline');
    expect(syncFehlerArt({ message: 'irgendwas' }, false)).toBe('offline');
  });
  it('nur eine ungültige Sitzung gilt als abgemeldet', () => {
    expect(syncFehlerArt({ message: 'JWT expired', status: 401 }, true)).toBe('abgemeldet');
    expect(syncFehlerArt({ message: 'Auth session missing!' }, true)).toBe('abgemeldet');
    expect(syncFehlerArt({ message: 'duplicate key', status: 409 }, true)).toBe('fehler');
  });
});

describe('Neue Einstellungen in alten Speicherständen', () => {
  it('ergänzt Ton und Haptik mit Standardwerten', async () => {
    const { migriere } = await import('../store/store');
    const d = migriere({ einstellungen: { theme: 'light' } }, 1);
    expect(d.einstellungen).toMatchObject({ theme: 'light', ton: true, haptik: true, wischUmgekehrt: false });
  });
});
