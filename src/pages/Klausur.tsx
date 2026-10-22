// Klausurmodus: gemischte Aufgaben, optionaler Timer, keine Hilfen, Auswertung am Ende.
import { useEffect, useMemo, useState } from 'react';
import { AntwortEingabe } from '../components/AntwortEingabe';
import { Balken, Md, Meldung } from '../components/Basis';
import { Icon } from '../components/Icon';
import { Plot } from '../components/Plot';
import { aktiverKurs, useAktiverKurs } from '../lib/kurs';
import type { Aufgabe, Generator, Thema } from '../content/types';
import { eingabeText, istLeer, leereEingabe, pruefe, sollText, type Eingabe } from '../lib/antwort';
import { genKey } from '../lib/fortschritt';
import { erzeugeRng, neuerSeed } from '../lib/rng';
import { useStore } from '../store/store';
import { useLernaktivitaet } from '../store/ui';

interface KlausurAufgabe {
  generator: Generator;
  thema: Thema;
  seed: number;
  aufgabe: Aufgabe;
}

type Phase = 'start' | 'laeuft' | 'auswertung';

function stelleZusammen(themenIds: string[], anzahl: number, seed: number): KlausurAufgabe[] {
  const kurs = aktiverKurs();
  const rng = erzeugeRng(seed);
  const themen = kurs.themen.filter((t) => themenIds.includes(t.id));
  const pool = themen.flatMap((t) => t.generatoren.filter((g) => g.klausur).map((g) => ({ g, t })));
  // erst aus möglichst vielen verschiedenen Themen ziehen
  const nachThema = new Map<string, typeof pool>();
  for (const p of rng.mische(pool)) nachThema.set(p.t.id, [...(nachThema.get(p.t.id) ?? []), p]);
  const auswahl: typeof pool = [];
  const reihen = rng.mische([...nachThema.values()]);
  for (let runde = 0; auswahl.length < anzahl && runde < 10; runde++) {
    for (const r of reihen) {
      if (auswahl.length >= anzahl) break;
      if (r[runde]) auswahl.push(r[runde]);
    }
  }
  // in Lernpfad-Reihenfolge sortieren, wie in einer echten Klausur
  const ordnung = kurs.themen.map((t) => t.id);
  auswahl.sort((a, b) => ordnung.indexOf(a.t.id) - ordnung.indexOf(b.t.id));
  return auswahl.map(({ g, t }) => {
    const s = rng.int(1, 2 ** 30);
    return { generator: g, thema: t, seed: s, aufgabe: g.erzeuge(erzeugeRng(s)) };
  });
}

function zeitText(sek: number): string {
  const m = Math.floor(sek / 60);
  const s = sek % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export function Klausur() {
  const kurs = useAktiverKurs();
  const [phase, setPhase] = useState<Phase>('start');
  const [themenIds, setThemenIds] = useState<string[]>(() => kurs.themen.filter((t) => t.generatoren.some((g) => g.klausur)).map((t) => t.id));
  const [anzahl, setAnzahl] = useState(5);
  const [minuten, setMinuten] = useState<number>(90);
  const [aufgaben, setAufgaben] = useState<KlausurAufgabe[]>([]);
  const [eingaben, setEingaben] = useState<Eingabe[][]>([]);
  const [aktiv, setAktiv] = useState(0);
  const [rest, setRest] = useState(0);
  const [zeitSichtbar, setZeitSichtbar] = useState(true);
  const [sicher, setSicher] = useState(false);
  useLernaktivitaet(phase === 'laeuft');
  const speichere = useStore((s) => s.speichereErgebnis);

  const moeglich = kurs.themen.filter((t) => t.generatoren.some((g) => g.klausur));

  function starten() {
    const a = stelleZusammen(themenIds, anzahl, neuerSeed());
    setAufgaben(a);
    setEingaben(a.map((x) => x.aufgabe.teile.map((t) => leereEingabe(t.antwort))));
    setAktiv(0);
    setRest(minuten * 60);
    setSicher(false);
    setPhase('laeuft');
    window.scrollTo(0, 0);
  }

  // Timer
  useEffect(() => {
    if (phase !== 'laeuft' || minuten === 0) return;
    const id = window.setInterval(() => setRest((r) => Math.max(0, r - 1)), 1000);
    return () => window.clearInterval(id);
  }, [phase, minuten]);

  useEffect(() => {
    if (phase === 'laeuft' && minuten > 0 && rest === 0) abgeben();
  }, [rest]);

  const ergebnisse = useMemo(
    () => (phase === 'auswertung' ? aufgaben.map((a, i) => a.aufgabe.teile.map((t, j) => pruefe(t.antwort, eingaben[i][j]).status === 'richtig')) : []),
    [phase, aufgaben, eingaben],
  );

  function abgeben() {
    const erg = aufgaben.map((a, i) => a.aufgabe.teile.map((t, j) => pruefe(t.antwort, eingaben[i][j]).status === 'richtig'));
    aufgaben.forEach((a, i) => {
      const alle = erg[i].every(Boolean);
      speichere(genKey(a.generator.id), a.thema.id, alle, erg[i].filter(Boolean).length * 3, { key: `gen:${a.generator.id}:${a.seed}`, art: 'aufgabe', ref: a.generator.id, seed: a.seed });
    });
    setPhase('auswertung');
    window.scrollTo(0, 0);
  }

  // ---------- Start ----------
  if (phase === 'start') {
    return (
      <div className="inhalt schmal">
        <div className="kopf">
          <div>
            <span className="ueber">Klausurmodus</span>
            <h1>Generalprobe</h1>
            <p>Gemischte Aufgaben im Klausurstil – ohne Hilfen, ohne Rückmeldung zwischendurch. Am Ende siehst du alle Lösungswege und eine Übersicht nach Themen. Rechne wie in der Klausur im Heft.</p>
          </div>
        </div>
        <section className="panel">
          <h3 className="mb">Umfang</h3>
          <div className="einst-zeile">
            <label>Aufgaben</label>
            <div className="segment">
              {[3, 5, 7].map((n) => (
                <button key={n} className={anzahl === n ? 'an' : ''} onClick={() => setAnzahl(n)}>
                  {n}
                </button>
              ))}
            </div>
          </div>
          <div className="einst-zeile">
            <label>Zeit</label>
            <div className="segment">
              {[0, 45, 90].map((m) => (
                <button key={m} className={minuten === m ? 'an' : ''} onClick={() => setMinuten(m)}>
                  {m === 0 ? 'ohne Timer' : `${m} min`}
                </button>
              ))}
            </div>
          </div>
        </section>
        <section className="panel">
          <div className="panel-titel">
            <h3>Themen</h3>
            <div className="zeile">
              <button className="btn geist klein" onClick={() => setThemenIds(moeglich.map((t) => t.id))}>
                alle
              </button>
              <button className="btn geist klein" onClick={() => setThemenIds([])}>
                keine
              </button>
            </div>
          </div>
          <div className="themen-wahl">
            {moeglich.map((t) => {
              const an = themenIds.includes(t.id);
              return (
                <button key={t.id} type="button" className={`themen-chip${an ? ' an' : ''}`} aria-pressed={an} onClick={() => setThemenIds((ids) => (an ? ids.filter((x) => x !== t.id) : [...ids, t.id]))}>
                  <span className="knoten-nr klein-nr">{t.nr}</span>
                  {t.titel}
                  {t.neu && <span className="chip akzent knoten-neu">neu</span>}
                </button>
              );
            })}
          </div>
        </section>
        <div className="aktionen">
          <button className="btn primaer gross" onClick={starten} disabled={themenIds.length === 0}>
            <Icon name="play" size={16} /> Klausur starten
          </button>
        </div>
      </div>
    );
  }

  // ---------- Läuft ----------
  if (phase === 'laeuft') {
    const a = aufgaben[aktiv];
    const beantwortet = (i: number) => eingaben[i].every((e) => !istLeer(e));
    const offen = aufgaben.filter((_, i) => !beantwortet(i)).length;
    return (
      <div className="inhalt">
        <div className="klausur-leiste">
          <div className="klausur-tabs" role="tablist">
            {aufgaben.map((_, i) => (
              <button key={i} role="tab" aria-selected={i === aktiv} className={`klausur-tab${i === aktiv ? ' aktiv' : ''}${beantwortet(i) ? ' fertig' : ''}`} onClick={() => setAktiv(i)}>
                {i + 1}
              </button>
            ))}
          </div>
          {minuten > 0 && (
            <button className={`klausur-zeit mono${rest < 300 ? ' knapp' : ''}`} onClick={() => setZeitSichtbar((z) => !z)} title="Zeit ein-/ausblenden">
              <Icon name="uhr" size={15} /> {zeitSichtbar ? zeitText(rest) : '··:··'}
            </button>
          )}
          {!sicher ? (
            <button className="btn klein" onClick={() => setSicher(true)}>
              Abgeben
            </button>
          ) : (
            <div className="zeile">
              <span className="klein leise">{offen > 0 ? `${offen} Aufgabe${offen > 1 ? 'n' : ''} unvollständig.` : 'Alles beantwortet.'} Wirklich abgeben?</span>
              <button className="btn primaer klein" onClick={abgeben}>
                Ja, abgeben
              </button>
              <button className="btn geist klein" onClick={() => setSicher(false)}>
                Weiter
              </button>
            </div>
          )}
        </div>
        {minuten > 0 && <Balken wert={rest / (minuten * 60)} duenn label="verbleibende Zeit" />}

        <section className="panel klausur-aufgabe einblenden" key={aktiv}>
          <span className="ueber-klein">
            Aufgabe {aktiv + 1} · {a.thema.titel}
          </span>
          <h2>{a.aufgabe.titel}</h2>
          <Md text={a.aufgabe.kontext} className="prosa aufgabe-kontext" />
          {a.aufgabe.plot && !a.aufgabe.teile.some((t) => t.antwort.art === 'klick' && !t.plot) && <Plot spec={a.aufgabe.plot} />}
          {a.aufgabe.teile.map((t, j) => (
            <div key={j} className="teil">
              <div className="teil-frage">
                {a.aufgabe.teile.length > 1 && <span className="teil-marke">{String.fromCharCode(97 + j)}</span>}
                <Md text={t.frage} inline />
              </div>
              {t.plot && t.antwort.art !== 'klick' && <Plot spec={t.plot} />}
              <AntwortEingabe
                antwort={t.antwort}
                wert={eingaben[aktiv][j]}
                label={`Aufgabe ${aktiv + 1}${String.fromCharCode(97 + j)}`}
                plot={t.plot ?? a.aufgabe.plot}
                onChange={(e) => setEingaben((alt) => alt.map((row, i) => (i === aktiv ? row.map((x, k) => (k === j ? e : x)) : row)))}
              />
            </div>
          ))}
          <div className="aktionen">
            <button className="btn geist" disabled={aktiv === 0} onClick={() => setAktiv(aktiv - 1)}>
              <Icon name="links" size={16} /> Zurück
            </button>
            {aktiv < aufgaben.length - 1 ? (
              <button className="btn" onClick={() => setAktiv(aktiv + 1)}>
                Nächste Aufgabe <Icon name="rechts" size={16} />
              </button>
            ) : (
              <button className="btn primaer" onClick={() => setSicher(true)}>
                Abgeben
              </button>
            )}
          </div>
        </section>
        <p className="sehr-leise klein">Tipp: Gerechnet wird im Heft. Einheiten kannst du im Menü wählen oder hinter die Zahl schreiben.</p>
      </div>
    );
  }

  // ---------- Auswertung ----------
  const teileGesamt = ergebnisse.flat().length;
  const teileRichtig = ergebnisse.flat().filter(Boolean).length;
  const quote = teileGesamt ? teileRichtig / teileGesamt : 0;
  const proThema = new Map<string, { t: Thema; r: number; n: number }>();
  aufgaben.forEach((a, i) => {
    const e = proThema.get(a.thema.id) ?? { t: a.thema, r: 0, n: 0 };
    e.r += ergebnisse[i].filter(Boolean).length;
    e.n += ergebnisse[i].length;
    proThema.set(a.thema.id, e);
  });

  return (
    <div className="inhalt">
      <div className="kopf">
        <div>
          <span className="ueber">Auswertung</span>
          <h1>
            {teileRichtig} von {teileGesamt} Teilaufgaben richtig
          </h1>
          <p>{quote >= 0.8 ? 'Stark – das sitzt.' : quote >= 0.5 ? 'Solide Basis. Schau dir die Lösungswege der falschen Teile genau an.' : 'Gut, dass du es jetzt merkst und nicht erst in der Klausur. Die falschen Aufgaben liegen jetzt im Nochmal-Stapel.'}</p>
        </div>
        <button className="btn primaer" onClick={() => setPhase('start')}>
          <Icon name="zufall" size={16} /> Neue Klausur
        </button>
      </div>

      <section className="panel">
        <h3 className="mb">Nach Themen</h3>
        <ul className="themen-auswertung">
          {[...proThema.values()].map(({ t, r, n }) => (
            <li key={t.id}>
              <span className="knoten-nr klein-nr">{t.nr}</span>
              <span className="aufgabe-titel">{t.titel}</span>
              <span className="mono klein">
                {r}/{n}
              </span>
              <div style={{ width: 120 }}>
                <Balken wert={r / n} duenn />
              </div>
            </li>
          ))}
        </ul>
      </section>

      {aufgaben.map((a, i) => (
        <section key={i} className="panel klausur-aufgabe">
          <span className="ueber-klein">
            Aufgabe {i + 1} · {a.thema.titel}
          </span>
          <h2>{a.aufgabe.titel}</h2>
          <Md text={a.aufgabe.kontext} className="prosa aufgabe-kontext" />
          {a.aufgabe.plot && <Plot spec={a.aufgabe.plot} />}
          {a.aufgabe.teile.map((t, j) => (
            <details key={j} className={`teil auswertung${ergebnisse[i][j] ? ' ok' : ' nok'}`} open={!ergebnisse[i][j]}>
              <summary>
                <span className={`teil-marke ${ergebnisse[i][j] ? 'ok' : 'auf'}`}>{String.fromCharCode(97 + j)}</span>
                <Md text={t.frage} inline />
                <Icon name={ergebnisse[i][j] ? 'check' : 'x'} size={16} />
              </summary>
              <div className="auswertung-antworten klein">
                <span>
                  Deine Antwort: <strong>{eingabeText(eingaben[i][j], t.antwort)}</strong>
                </span>
                <span>
                  Richtig: <strong>{sollText(t.antwort)}</strong>
                </span>
              </div>
              <Md text={t.loesung} className="prosa loesung" />
            </details>
          ))}
        </section>
      ))}
      {quote < 1 && <Meldung art="info">Alle nicht vollständig gelösten Aufgaben liegen jetzt mit denselben Zahlen im Nochmal-Stapel.</Meldung>}
    </div>
  );
}
