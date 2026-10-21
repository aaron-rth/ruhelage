// Mehrteilige Rechenaufgabe mit gestufter Hilfe (Lernmodus).
import { useEffect, useMemo, useState } from 'react';
import type { Generator, Teil } from '../content/types';
import { istLeer, leereEingabe, pruefe, type Eingabe } from '../lib/antwort';
import { genKey } from '../lib/fortschritt';
import { erzeugeRng } from '../lib/rng';
import { useStore } from '../store/store';
import { AntwortEingabe } from './AntwortEingabe';
import { Md, Meldung, Taste } from './Basis';
import { Icon } from './Icon';
import { Plot } from './Plot';

type TeilZustand = {
  eingabe: Eingabe;
  status: 'offen' | 'richtig' | 'aufgedeckt';
  fehlversuche: number;
  hilfen: number; // 0–3 sichtbare Hilfestufen
  loesung: boolean;
  meldung: { art: 'richtig' | 'falsch' | 'info'; text: string } | null;
};

const HILFE_TITEL = ['Gegeben, gesucht, passende Formel', 'Ansatz', 'Zwischenergebnis'];

export interface AufgabenErgebnis {
  richtig: boolean;
  teileRichtig: number;
  teile: number;
}

function neuerZustand(t: Teil): TeilZustand {
  return { eingabe: leereEingabe(t.antwort), status: 'offen', fehlversuche: 0, hilfen: 0, loesung: false, meldung: null };
}

export function AufgabenAnsicht({
  generator,
  themaId,
  seed,
  onFertig,
  onNeu,
}: {
  generator: Generator;
  themaId: string;
  seed: number;
  onFertig?: (e: AufgabenErgebnis) => void;
  /** Button „Neue Aufgabe“ anzeigen */
  onNeu?: () => void;
}) {
  const aufgabe = useMemo(() => generator.erzeuge(erzeugeRng(seed)), [generator, seed]);
  const [zustaende, setZustaende] = useState<TeilZustand[]>(() => aufgabe.teile.map(neuerZustand));
  const [aktiv, setAktiv] = useState(0);
  const [fertig, setFertig] = useState(false);
  const speichere = useStore((s) => s.speichereErgebnis);

  useEffect(() => {
    setZustaende(aufgabe.teile.map(neuerZustand));
    setAktiv(0);
    setFertig(false);
  }, [aufgabe]);

  const z = zustaende[aktiv];
  const teil = aufgabe.teile[aktiv];

  function setze(i: number, neu: Partial<TeilZustand>) {
    setZustaende((alt) => alt.map((x, j) => (j === i ? { ...x, ...neu } : x)));
  }

  function abschliessen(endZustaende: TeilZustand[]) {
    const teileRichtig = endZustaende.filter((x) => x.status === 'richtig' && x.fehlversuche <= 1).length;
    const richtig = endZustaende.every((x) => x.status === 'richtig' && x.fehlversuche <= 1);
    const hilfenGenutzt = endZustaende.some((x) => x.hilfen > 0);
    const xp = richtig ? (hilfenGenutzt ? 6 : 10) : 3;
    speichere(genKey(generator.id), themaId, richtig, xp, { key: `gen:${generator.id}:${seed}`, art: 'aufgabe', ref: generator.id, seed });
    setFertig(true);
    onFertig?.({ richtig, teileRichtig, teile: endZustaende.length });
  }

  function pruefen() {
    if (!z || z.status !== 'offen') return;
    if (istLeer(z.eingabe)) {
      setze(aktiv, { meldung: { art: 'info', text: 'Gib erst eine Antwort ein.' } });
      return;
    }
    const p = pruefe(teil.antwort, z.eingabe);
    if (p.status === 'ungueltig') {
      setze(aktiv, { meldung: { art: 'info', text: p.hinweis ?? 'Das kann ich nicht lesen.' } });
      return;
    }
    if (p.status === 'richtig') {
      setze(aktiv, { status: 'richtig', meldung: { art: 'richtig', text: p.hinweis ? `Richtig! ${p.hinweis}` : 'Richtig!' } });
      return;
    }
    const fehl = z.fehlversuche + 1;
    // Bei jedem Fehlversuch wird die nächste Hilfestufe aufgedeckt
    const hilfen = Math.min(3, Math.max(z.hilfen, fehl));
    setze(aktiv, {
      fehlversuche: fehl,
      hilfen,
      meldung: { art: 'falsch', text: p.hinweis ?? (hilfen < 3 ? 'Noch nicht. Schau dir die nächste Hilfe an und versuch es nochmal.' : 'Noch nicht. Mit allen Hilfen kannst du es schaffen – oder schau dir den Lösungsweg an.') },
    });
  }

  function weiter() {
    if (aktiv < aufgabe.teile.length - 1) setAktiv(aktiv + 1);
    else abschliessen(zustaende);
  }

  function loesungZeigen() {
    if (z.status === 'offen') setze(aktiv, { status: 'aufgedeckt', loesung: true, hilfen: 3 });
    else setze(aktiv, { loesung: true });
  }

  // Tastatur: Enter = prüfen/weiter, H = Hilfe, L = Lösung
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const imFeld = (e.target as HTMLElement)?.tagName === 'INPUT' || (e.target as HTMLElement)?.tagName === 'SELECT';
      if (e.key === 'Enter' && !imFeld && !e.repeat) {
        if (fertig) return;
        const tag = (e.target as HTMLElement)?.tagName;
        if (tag === 'BUTTON') return; // Buttons reagieren selbst
        e.preventDefault();
        if (z?.status === 'offen') pruefen();
        else weiter();
      }
      if (imFeld) return;
      if ((e.key === 'h' || e.key === 'H') && z?.status === 'offen') setze(aktiv, { hilfen: Math.min(3, z.hilfen + 1) });
      if ((e.key === 'l' || e.key === 'L') && z && (z.hilfen >= 3 || z.status !== 'offen')) loesungZeigen();
      if ((e.key === 'n' || e.key === 'N') && fertig && onNeu) onNeu();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  if (!z) return null;
  const istLetzter = aktiv === aufgabe.teile.length - 1;
  const darfLoesung = z.hilfen >= 3 || z.status !== 'offen';

  return (
    <div className="aufgabe einblenden">
      <div className="aufgabe-kopf">
        <div>
          <span className="ueber-klein">{generator.titel}</span>
          <h2>{aufgabe.titel}</h2>
        </div>
        {aufgabe.teile.length > 1 && (
          <div className="teil-punkte" aria-label={`Teil ${aktiv + 1} von ${aufgabe.teile.length}`}>
            {aufgabe.teile.map((_, i) => (
              <span key={i} className={`teil-punkt${i === aktiv ? ' aktiv' : ''}${zustaende[i].status === 'richtig' ? ' ok' : ''}${zustaende[i].status === 'aufgedeckt' ? ' auf' : ''}`}>
                {String.fromCharCode(97 + i)}
              </span>
            ))}
          </div>
        )}
      </div>

      <Md text={aufgabe.kontext} className="prosa aufgabe-kontext" />
      {aufgabe.plot && <Plot spec={aufgabe.plot} />}

      {/* erledigte Teile */}
      {aufgabe.teile.slice(0, aktiv).map((t, i) => (
        <details key={i} className="teil erledigt">
          <summary>
            <span className={`teil-marke ${zustaende[i].status === 'richtig' ? 'ok' : 'auf'}`}>{String.fromCharCode(97 + i)}</span>
            <Md text={t.frage} inline />
            <Icon name={zustaende[i].status === 'richtig' ? 'check' : 'auge'} size={16} />
          </summary>
          <Md text={t.loesung} className="prosa loesung" />
        </details>
      ))}

      <section className="teil aktiv" aria-live="polite">
        <div className="teil-frage">
          {aufgabe.teile.length > 1 && <span className="teil-marke">{String.fromCharCode(97 + aktiv)}</span>}
          <Md text={teil.frage} inline />
        </div>
        {teil.plot && teil.antwort.art !== 'klick' && <Plot spec={teil.plot} />}

        <AntwortEingabe
          antwort={teil.antwort}
          wert={z.eingabe}
          onChange={(e) => setze(aktiv, { eingabe: e, meldung: null })}
          onEnter={() => (z.status === 'offen' ? pruefen() : weiter())}
          status={z.status === 'richtig' ? 'richtig' : z.meldung?.art === 'falsch' ? 'falsch' : null}
          gesperrt={z.status !== 'offen'}
          autoFokus
          plot={teil.plot ?? aufgabe.plot}
          zeigeLoesung={z.status !== 'offen'}
        />

        {z.meldung && (
          <Meldung art={z.meldung.art}>
            <Md text={z.meldung.text} inline />
          </Meldung>
        )}

        <div className="aktionen">
          {z.status === 'offen' ? (
            <>
              <button type="button" className="btn primaer" onClick={pruefen}>
                Prüfen <Taste>Enter</Taste>
              </button>
              <button type="button" className="btn geist" onClick={() => setze(aktiv, { hilfen: Math.min(3, z.hilfen + 1) })} disabled={z.hilfen >= 3}>
                <Icon name="licht" size={16} /> Hilfe <Taste>H</Taste>
              </button>
              <button type="button" className="btn geist" onClick={loesungZeigen} disabled={!darfLoesung} title={darfLoesung ? '' : 'Der Lösungsweg kommt nach allen drei Hilfen.'}>
                <Icon name="auge" size={16} /> Lösungsweg <Taste>L</Taste>
              </button>
            </>
          ) : fertig ? (
            onNeu && (
              <button type="button" className="btn primaer" onClick={onNeu}>
                <Icon name="zufall" size={16} /> Neue Aufgabe <Taste>N</Taste>
              </button>
            )
          ) : (
            <>
              <button type="button" className="btn primaer" onClick={weiter} autoFocus>
                {istLetzter ? 'Fertig' : `Weiter zu ${String.fromCharCode(97 + aktiv + 1)})`} <Taste>Enter</Taste>
              </button>
              {!z.loesung && (
                <button type="button" className="btn geist" onClick={loesungZeigen}>
                  <Icon name="auge" size={16} /> Lösungsweg ansehen <Taste>L</Taste>
                </button>
              )}
            </>
          )}
        </div>

        {z.hilfen > 0 && !z.loesung && (
          <ol className="hilfen">
            {teil.hilfen.slice(0, z.hilfen).map((h, i) => (
              <li key={i} className="hilfe einblenden">
                <span className="hilfe-titel">
                  <Icon name="licht" size={14} /> Hilfe {i + 1} · {HILFE_TITEL[i]}
                </span>
                <Md text={h} className="prosa" />
              </li>
            ))}
          </ol>
        )}

        {z.loesung && (
          <div className="loesung-box einblenden">
            <span className="hilfe-titel">
              <Icon name="check" size={14} /> Lösungsweg
            </span>
            <Md text={teil.loesung} className="prosa loesung" />
          </div>
        )}
      </section>

      {fertig && (
        <Meldung art={zustaende.every((x) => x.status === 'richtig') ? 'richtig' : 'info'}>
          {zustaende.every((x) => x.status === 'richtig' && x.fehlversuche <= 1)
            ? 'Sauber gelöst. '
            : zustaende.every((x) => x.status === 'richtig')
              ? 'Geschafft – mit ein paar Anläufen. Die Aufgabe kommt zur Sicherheit in den Nochmal-Stapel. '
              : 'Gut, dass du dir den Lösungsweg angeschaut hast. Die Aufgabe landet im Nochmal-Stapel, dort kommt sie mit denselben Zahlen wieder. '}
          {onNeu && 'Mit „Neue Aufgabe“ bekommst du andere Zahlen.'}
        </Meldung>
      )}
    </div>
  );
}
