// Karteikarte zum Umdrehen mit Selbstbewertung (Leertaste, 1/2/3).
// Im Handy-Vollbild: Tippen dreht um, danach wischen (rechts = gewusst, oben = halb, links = nicht).
import { useEffect, useRef, useState, type PointerEvent as RPointerEvent } from 'react';
import type { Karte, KartenTyp } from '../content/types';
import { wischRichtung } from '../lib/geraet';
import type { Bewertung } from '../lib/leitner';
import { useStore } from '../store/store';
import { Md, Taste } from './Basis';
import { rueckmeldung } from '../lib/feedback';
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
  umgekehrt,
  onBlaettern,
  einflug,
}: {
  karte: Karte;
  themaId: string;
  /** Die Sitzung übernimmt das Speichern (damit sich Bewertungen korrigieren lassen). */
  onBewertet: (b: Bewertung) => void;
  /** Bewertung, falls die Karte in dieser Sitzung schon dran war */
  frueher?: Bewertung;
  /** Handy-Vollbild: Karte füllt den Platz, Steuerung per Tippen/Wischen */
  vollbild?: boolean;
  /** „wusste ich“ nach links statt nach rechts (Einstellung) */
  umgekehrt?: boolean;
  /** Wischgesten erlaubt (Einstellung) */
  wischen?: boolean;
  /** vor dem Umdrehen: zur nächsten bzw. vorherigen Karte wischen */
  onBlaettern?: (r: 'vor' | 'zurueck') => void;
  /** woher die Karte hereinkommt (nach Weiter/Zurück) */
  einflug?: 'rechts' | 'links' | 'stapel' | null;
}) {
  const [umgedreht, setUmgedreht] = useState(false);
  const [erklaer, setErklaer] = useState(false);
  const [zug, setZug] = useState({ dx: 0, dy: 0 });
  const [raus, setRaus] = useState<Raus>(null);
  const start = useRef<{ x: number; y: number } | null>(null);
  const bewegt = useRef(false);
  const stand = useStore((s) => s.karten[karte.id]);
  const gesten = !!vollbild && !!wischen;
  // Seite, zu der „wusste ich“ bzw. „nicht“ geworfen wird
  const seiteGewusst: 'rechts' | 'links' = umgekehrt ? 'links' : 'rechts';
  const seiteNicht: 'rechts' | 'links' = umgekehrt ? 'rechts' : 'links';

  useEffect(() => {
    setUmgedreht(false);
    setErklaer(false);
    setZug({ dx: 0, dy: 0 });
    setRaus(null);
  }, [karte.id]);

  function bewerten(b: Bewertung) {
    if (raus) return;
    rueckmeldung(b);
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return onBewertet(b);
    // Karte hinausfliegen lassen (wie beim Wischen), dann bewerten
    setRaus(b === 'gewusst' ? seiteGewusst : b === 'nicht' ? seiteNicht : 'oben');
    window.setTimeout(() => onBewertet(b), 220);
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || e.repeat) return;
      if (e.key === ' ' || e.key === 'Enter') {
        if (tag === 'BUTTON' && e.key === 'Enter') return;
        e.preventDefault();
        rueckmeldung('blatt');
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
      if (r === seiteGewusst) bewerten('gewusst');
      else if (r === seiteNicht) bewerten('nicht');
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
        rueckmeldung('blatt');
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
          {gesten ? (
            'Tippen zum Umdrehen · zur Seite wischen zum Blättern'
          ) : vollbild ? (
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

  const knoepfe: { b: Bewertung; icon: string; text: string; taste: string }[] = [
    { b: 'gewusst', icon: 'check', text: 'wusste ich', taste: '1' },
    { b: 'halb', icon: 'tilde', text: 'so halb', taste: '2' },
    { b: 'nicht', icon: 'x', text: 'nicht', taste: '3' },
  ];
  // beim Wischen entspricht die Reihenfolge den Richtungen: links – oben – rechts
  // beim Wischen steht links, was nach links geht
  const reihe = gesten ? (umgekehrt ? knoepfe : [knoepfe[2], knoepfe[1], knoepfe[0]]) : knoepfe;
  const pfeil: Record<Bewertung, string> = umgekehrt ? { gewusst: '←', halb: '↑', nicht: '→' } : { nicht: '←', halb: '↑', gewusst: '→' };
  const linksPfeil = (b: Bewertung) => pfeil[b] === '←' || pfeil[b] === '↑';
  const marke = (seite: 'rechts' | 'links') =>
    seite === seiteGewusst ? (
      <>
        <Icon name="check" size={16} /> wusste ich
      </>
    ) : (
      <>
        <Icon name="x" size={16} /> nicht
      </>
    );

  return (
    <div className={`karteikarte-wrap ${vollbild ? 'vollbild' : 'inline'}`}>
      <div className="karten-buehne">
        <div
          className={`karten-wisch${gesten ? ' gesten' : ''}${start.current ? ' zieht' : ''}${raus ? ' raus' : ''}${einflug && !raus && !start.current ? ` rein-${einflug}` : ''}`}
          style={{ transform }}
          onPointerDown={runter}
          onPointerMove={zieh}
          onPointerUp={hoch}
          onPointerCancel={hoch}
        >
          {kartenKnopf}
          {umgedreht && (
            <>
              <span className={`wisch-marke rechts ${seiteGewusst === 'rechts' ? 'gut' : 'schlecht'}`} style={{ opacity: raus === 'rechts' ? 1 : deutung === 'rechts' ? staerke : 0 }}>
                {marke('rechts')}
              </span>
              <span className={`wisch-marke links ${seiteGewusst === 'links' ? 'gut' : 'schlecht'}`} style={{ opacity: raus === 'links' ? 1 : deutung === 'links' ? staerke : 0 }}>
                {marke('links')}
              </span>
              <span className="wisch-marke oben" style={{ opacity: raus === 'oben' ? 1 : deutung === 'oben' ? staerke : 0 }}>
                <Icon name="tilde" size={16} /> so halb
              </span>
            </>
          )}
        </div>
      </div>

      <div className={`bewertung${umgedreht ? ' sichtbar' : ''}${gesten ? ' kompakt' : ''}`} aria-hidden={!umgedreht}>
        {reihe.map((k) => (
          <button key={k.b} type="button" className={`btn bew ${k.b}`} onClick={() => bewerten(k.b)} disabled={!umgedreht}>
            {gesten && linksPfeil(k.b) && <span className="pfeil">{pfeil[k.b]}</span>}
            {!gesten && <Icon name={k.icon} size={16} />} {k.text} <Taste>{k.taste}</Taste>
            {gesten && !linksPfeil(k.b) && <span className="pfeil">{pfeil[k.b]}</span>}
          </button>
        ))}
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
