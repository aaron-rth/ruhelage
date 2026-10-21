// Karteikarte zum Umdrehen mit Selbstbewertung (Leertaste, 1/2/3).
// Im Handy-Vollbild: Tippen dreht um, danach wischen (rechts = gewusst, oben = halb, links = nicht).
import { useEffect, useRef, useState, type PointerEvent as RPointerEvent } from 'react';
import type { Karte, KartenTyp } from '../content/types';
import { wischRichtung } from '../lib/geraet';
import type { Bewertung } from '../lib/leitner';
import { useStore } from '../store/store';
import { Md, Taste } from './Basis';
import { ErklaerPanel } from './ErklaerPanel';
import { Icon } from './Icon';

const TYP_TEXT: Record<KartenTyp, string> = {
  begriff: 'Begriff',
  formel: 'Formel',
  warum: 'Warum?',
  wasPassiert: 'Was passiert, wenn …?',
  herleitung: 'Herleitung',
  fehler: 'Typischer Fehler',
};

const BEWERTUNG_TEXT: Record<Bewertung, string> = { gewusst: 'wusste ich', halb: 'so halb', nicht: 'nicht gewusst' };

type Raus = 'rechts' | 'links' | 'oben' | null;

export function KartenAnsicht({
  karte,
  themaId,
  onBewertet,
  frueher,
  vollbild,
  wischen,
  onBlaettern,
}: {
  karte: Karte;
  themaId: string;
  /** Die Sitzung übernimmt das Speichern (damit sich Bewertungen korrigieren lassen). */
  onBewertet: (b: Bewertung) => void;
  /** Bewertung, falls die Karte in dieser Sitzung schon dran war */
  frueher?: Bewertung;
  /** Handy-Vollbild: Karte füllt den Platz, Steuerung per Tippen/Wischen */
  vollbild?: boolean;
  /** Wischgesten erlaubt (Einstellung) */
  wischen?: boolean;
  /** vor dem Umdrehen: zur nächsten bzw. vorherigen Karte wischen */
  onBlaettern?: (r: 'vor' | 'zurueck') => void;
}) {
  const [umgedreht, setUmgedreht] = useState(false);
  const [erklaer, setErklaer] = useState(false);
  const [zug, setZug] = useState({ dx: 0, dy: 0 });
  const [raus, setRaus] = useState<Raus>(null);
  const start = useRef<{ x: number; y: number } | null>(null);
  const bewegt = useRef(false);
  const stand = useStore((s) => s.karten[karte.id]);
  const gesten = !!vollbild && !!wischen;

  useEffect(() => {
    setUmgedreht(false);
    setErklaer(false);
    setZug({ dx: 0, dy: 0 });
    setRaus(null);
  }, [karte.id]);

  function bewerten(b: Bewertung) {
    if (raus) return;
    if (!gesten) return onBewertet(b);
    // Karte kurz hinausfliegen lassen, dann bewerten
    setRaus(b === 'gewusst' ? 'rechts' : b === 'nicht' ? 'links' : 'oben');
    window.setTimeout(() => onBewertet(b), 190);
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || e.repeat) return;
      if (e.key === ' ' || e.key === 'Enter') {
        if (tag === 'BUTTON' && e.key === 'Enter') return;
        e.preventDefault();
        setUmgedreht((u) => !u);
      }
      if (!umgedreht) return;
      if (e.key === 'e' || e.key === 'E') setErklaer(true);
      if (e.key === '1') bewerten('gewusst');
      if (e.key === '2') bewerten('halb');
      if (e.key === '3') bewerten('nicht');
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  // ---------- Wischen ----------
  function runter(e: RPointerEvent) {
    if (!gesten || raus) return;
    // Touch-Zeiger bleiben ohnehin am Startelement – so kommt der Klick (Tippen = umdrehen) normal an
    start.current = { x: e.clientX, y: e.clientY };
    bewegt.current = false;
  }
  function zieh(e: RPointerEvent) {
    if (!start.current) return;
    const dx = e.clientX - start.current.x;
    const dy = e.clientY - start.current.y;
    if (Math.abs(dx) > 8 || Math.abs(dy) > 8) bewegt.current = true;
    // vor dem Umdrehen nur waagerecht (blättern), danach auch nach oben
    setZug({ dx, dy: umgedreht ? Math.min(0, dy) : 0 });
  }
  function hoch() {
    if (!start.current) return;
    start.current = null;
    const r = wischRichtung(zug.dx, zug.dy, 70);
    setZug({ dx: 0, dy: 0 });
    if (!bewegt.current) return; // Tippen → onClick dreht um
    if (umgedreht) {
      if (r === 'rechts') bewerten('gewusst');
      else if (r === 'links') bewerten('nicht');
      else if (r === 'oben') bewerten('halb');
    } else if (r === 'links') onBlaettern?.('vor');
    else if (r === 'rechts') onBlaettern?.('zurueck');
  }

  const deutung: Raus = umgedreht ? (zug.dy < -40 && Math.abs(zug.dy) > Math.abs(zug.dx) ? 'oben' : zug.dx > 40 ? 'rechts' : zug.dx < -40 ? 'links' : null) : null;
  const staerke = Math.min(1, Math.max(Math.abs(zug.dx), Math.abs(zug.dy)) / 110);
  const transform = raus
    ? raus === 'rechts'
      ? 'translate(120%, 0) rotate(14deg)'
      : raus === 'links'
        ? 'translate(-120%, 0) rotate(-14deg)'
        : 'translate(0, -120%)'
    : `translate(${zug.dx}px, ${zug.dy}px) rotate(${zug.dx / 22}deg)`;

  const kartenKnopf = (
    <button
      type="button"
      className={`karteikarte${umgedreht ? ' umgedreht' : ''}`}
      onClick={() => {
        if (bewegt.current) return;
        setUmgedreht((u) => !u);
      }}
      aria-label={umgedreht ? 'Karte zurückdrehen' : 'Karte umdrehen'}
    >
      <div className="karten-seite vorne" aria-hidden={umgedreht}>
        <div className="karten-kopf">
          <span className="chip">{TYP_TEXT[karte.typ]}</span>
          <span className="fach-anzeige" title="Leitner-Fach">
            {[1, 2, 3, 4, 5].map((f) => (
              <span key={f} className={stand && stand.fach >= f ? 'an' : ''} />
            ))}
          </span>
        </div>
        <Md text={karte.vorne} className="prosa karten-text" />
        <span className="karten-tipp sehr-leise klein">
          {vollbild ? (
            'Tippen zum Umdrehen'
          ) : (
            <>
              Umdrehen mit <Taste>Leertaste</Taste>
            </>
          )}
        </span>
      </div>
      <div className="karten-seite hinten" aria-hidden={!umgedreht}>
        <div className="karten-kopf">
          <span className="chip akzent">Antwort</span>
          <span className="sehr-leise klein">{karte.quelle}</span>
        </div>
        <Md text={karte.hinten} className="prosa karten-text" />
      </div>
    </button>
  );

  return (
    <div className={`karteikarte-wrap${vollbild ? ' vollbild' : ''}`}>
      {vollbild ? (
        <div className="karten-buehne">
          <div
            className={`karten-wisch${gesten ? ' gesten' : ''}${start.current ? ' zieht' : ''}${raus ? ' raus' : ''}`}
            style={{ transform }}
            onPointerDown={runter}
            onPointerMove={zieh}
            onPointerUp={hoch}
            onPointerCancel={hoch}
          >
            {kartenKnopf}
            {gesten && umgedreht && (
              <>
                <span className="wisch-marke rechts" style={{ opacity: deutung === 'rechts' ? staerke : 0 }}>
                  <Icon name="check" size={16} /> wusste ich
                </span>
                <span className="wisch-marke links" style={{ opacity: deutung === 'links' ? staerke : 0 }}>
                  <Icon name="x" size={16} /> nicht
                </span>
                <span className="wisch-marke oben" style={{ opacity: deutung === 'oben' ? staerke : 0 }}>
                  <Icon name="tilde" size={16} /> so halb
                </span>
              </>
            )}
          </div>
        </div>
      ) : (
        kartenKnopf
      )}

      {vollbild && gesten && (
        <p className="wisch-hilfe sehr-leise klein" aria-hidden>
          {umgedreht ? (
            <>
              <span>← nicht</span>
              <span>↑ so halb</span>
              <span>wusste ich →</span>
            </>
          ) : (
            <span>Wischen: nächste / vorherige Karte</span>
          )}
        </p>
      )}

      <div className={`bewertung${umgedreht ? ' sichtbar' : ''}${vollbild && gesten ? ' kompakt' : ''}`} aria-hidden={!umgedreht}>
        <button type="button" className="btn bew gewusst" onClick={() => bewerten('gewusst')} disabled={!umgedreht}>
          <Icon name="check" size={16} /> wusste ich <Taste>1</Taste>
        </button>
        <button type="button" className="btn bew halb" onClick={() => bewerten('halb')} disabled={!umgedreht}>
          <Icon name="tilde" size={16} /> so halb <Taste>2</Taste>
        </button>
        <button type="button" className="btn bew nicht" onClick={() => bewerten('nicht')} disabled={!umgedreht}>
          <Icon name="x" size={16} /> nicht <Taste>3</Taste>
        </button>
      </div>
      <div className={`karten-extra${umgedreht ? ' sichtbar' : ''}`} aria-hidden={!umgedreht}>
        <button type="button" className="btn geist klein" onClick={() => setErklaer(true)} disabled={!umgedreht}>
          <Icon name="buch" size={15} /> Genauer erklärt <Taste>E</Taste>
        </button>
        {frueher && <span className="sehr-leise klein">Vorhin: {BEWERTUNG_TEXT[frueher]} – du kannst neu bewerten.</span>}
      </div>
      {erklaer && <ErklaerPanel themaId={themaId} suchtext={`${karte.vorne} ${karte.hinten}`} mehr={karte.mehr} onSchliessen={() => setErklaer(false)} />}
    </div>
  );
}
