// Karteikarte zum Umdrehen mit Selbstbewertung (Leertaste, 1/2/3).
import { useEffect, useState } from 'react';
import type { Karte, KartenTyp } from '../content/types';
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

export function KartenAnsicht({
  karte,
  themaId,
  onBewertet,
  frueher,
}: {
  karte: Karte;
  themaId: string;
  /** Die Sitzung übernimmt das Speichern (damit sich Bewertungen korrigieren lassen). */
  onBewertet: (b: Bewertung) => void;
  /** Bewertung, falls die Karte in dieser Sitzung schon dran war */
  frueher?: Bewertung;
}) {
  const [umgedreht, setUmgedreht] = useState(false);
  const [erklaer, setErklaer] = useState(false);
  const stand = useStore((s) => s.karten[karte.id]);

  useEffect(() => {
    setUmgedreht(false);
    setErklaer(false);
  }, [karte.id]);

  function bewerten(b: Bewertung) {
    onBewertet(b);
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

  return (
    <div className="karteikarte-wrap">
      <button
        type="button"
        className={`karteikarte${umgedreht ? ' umgedreht' : ''}`}
        onClick={() => setUmgedreht((u) => !u)}
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
            Umdrehen mit <Taste>Leertaste</Taste>
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

      <div className={`bewertung${umgedreht ? ' sichtbar' : ''}`} aria-hidden={!umgedreht}>
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
