// Mehrteilige Rechenaufgabe mit gestufter Hilfe (Lernmodus).
import { useEffect, useMemo, useState } from 'react';
import type { Generator, Teil } from '../content/types';
import { istLeer, leereEingabe, pruefe, type Eingabe } from '../lib/antwort';
import { genKey } from '../lib/fortschritt';
import { erzeugeRng } from '../lib/rng';
import { liesGemerkt, useLaufend } from '../store/laufend';
import { useStore } from '../store/store';
import { useLernaktivitaet } from '../store/ui';
import { AntwortEingabe } from './AntwortEingabe';
import { Md, Meldung, Taste } from './Basis';
import { rueckmeldung } from '../lib/feedback';
import { ErklaerPanel } from './ErklaerPanel';
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

const HILFE_TITEL = ['Worum geht’s?', 'Ansatz', 'Zwischenschritt'];

export interface AufgabenErgebnis {
  richtig: boolean;
  teileRichtig: number;
  teile: number;
}

/** Gesamter Bearbeitungsstand – wird mit `speicherKey` gemerkt (Seitenwechsel, Neuladen). */
interface AufgabenStand {
  gen: string;
  seed: number;
  zustaende: TeilZustand[];
  aktiv: number;
  fertig: boolean;
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
  speicherKey,
}: {
  generator: Generator;
  themaId: string;
  seed: number;
  onFertig?: (e: AufgabenErgebnis) => void;
  /** Button „Neue Aufgabe“ anzeigen */
  onNeu?: () => void;
  /** Stand unter diesem Schlüssel merken */
  speicherKey?: string;
}) {
  const aufgabe = useMemo(() => generator.erzeuge(erzeugeRng(seed)), [generator, seed]);
  const start = (): AufgabenStand => ({ gen: generator.id, seed, zustaende: aufgabe.teile.map(neuerZustand), aktiv: 0, fertig: false });
  const passt = (x: AufgabenStand | undefined): x is AufgabenStand => !!x && x.gen === generator.id && x.seed === seed && x.zustaende?.length === aufgabe.teile.length;
  const [lokal, setLokal] = useState<AufgabenStand>(start);
  const gemerkt = useLaufend((s) => (speicherKey ? (s.merk[speicherKey]?.wert as AufgabenStand | undefined) : undefined));
  const merke = useLaufend((s) => s.merke);
  const st = speicherKey ? (passt(gemerkt) ? gemerkt : start()) : passt(lokal) ? lokal : start();
  const { zustaende, aktiv, fertig } = st;
  const [erklaer, setErklaer] = useState(false);
  useLernaktivitaet();
  const speichere = useStore((s) => s.speichereErgebnis);

  function aendere(f: (alt: AufgabenStand) => AufgabenStand) {
    if (speicherKey) {
      const alt = liesGemerkt<AufgabenStand>(speicherKey);
      merke(speicherKey, f(passt(alt) ? alt : start()));
    } else {
      setLokal((alt) => f(passt(alt) ? alt : start()));
    }
  }
  const setAktiv = (i: number) => aendere((a) => ({ ...a, aktiv: i }));
  const setFertig = (b: boolean) => aendere((a) => ({ ...a, fertig: b }));

  const z = zustaende[aktiv];
  const teil = aufgabe.teile[aktiv];

  function setze(i: number, neu: Partial<TeilZustand>) {
    aendere((a) => ({ ...a, zustaende: a.zustaende.map((x, j) => (j === i ? { ...x, ...neu } : x)) }));
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

  // Ergebnis sofort speichern, wenn alle Teile erledigt sind (auch ohne „Fertig“ zu klicken)
  useEffect(() => {
    if (!fertig && zustaende.length > 0 && zustaende.every((x) => x.status !== 'offen')) abschliessen(zustaende);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zustaende, fertig]);

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
      rueckmeldung('richtig');
      setze(aktiv, { status: 'richtig', meldung: { art: 'richtig', text: p.hinweis ? `Richtig! ${p.hinweis}` : 'Richtig!' } });
      return;
    }
    rueckmeldung('falsch');
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
    else if (!fertig) abschliessen(zustaende);
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
      if ((e.key === 'e' || e.key === 'E') && z && z.status !== 'offen') setErklaer(true);
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
      {aufgabe.plot && !(teil?.antwort.art === 'klick' && !teil.plot) && <Plot spec={aufgabe.plot} />}

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

      {z.status !== 'offen' && (
        <div className="aktionen leise-aktionen">
          <button type="button" className="btn geist klein" onClick={() => setErklaer(true)}>
            <Icon name="buch" size={15} /> Genauer erklärt <Taste>E</Taste>
          </button>
        </div>
      )}
      {erklaer && (
        <ErklaerPanel
          themaId={themaId}
          suchtext={`${generator.titel} ${aufgabe.titel} ${aufgabe.kontext} ${teil.frage} ${teil.loesung}`}
          onSchliessen={() => setErklaer(false)}
        />
      )}

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
