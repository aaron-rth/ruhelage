// Statische Übungen: Multiple Choice, Reihenfolge (DGL-Puzzle), Lücken, Fehler finden, Zuordnen, Klassifizieren.
import { useEffect, useMemo, useState, type DragEvent } from 'react';
import type {
  FehlerUebung,
  KlassifizierenUebung,
  LueckeUebung,
  MCUebung,
  ReihenfolgeUebung,
  Uebung,
  ZuordnenUebung,
} from '../../content/types';
import { uebKey } from '../../lib/fortschritt';
import { erzeugeRng } from '../../lib/rng';
import { useStore } from '../../store/store';
import { useLernaktivitaet } from '../../store/ui';
import { Md, Meldung, Taste } from '../Basis';
import { rueckmeldung } from '../../lib/feedback';
import { ErklaerPanel } from '../ErklaerPanel';
import { Icon } from '../Icon';

interface Props {
  uebung: Uebung;
  themaId: string;
  onFertig?: (richtig: boolean) => void;
  onWeiter?: () => void;
  weiterText?: string;
}

const TYP_TEXT: Record<Uebung['typ'], string> = {
  mc: 'Begründen',
  reihenfolge: 'Reihenfolge',
  luecke: 'Lückentext',
  fehler: 'Fehler finden',
  zuordnen: 'Zuordnen',
  klassifizieren: 'Klassifizieren',
};

/** Gemischte Reihenfolge, die nicht zufällig schon richtig ist. */
function mischIndizes(n: number, seed: number): number[] {
  const rng = erzeugeRng(seed);
  const basis = Array.from({ length: n }, (_, i) => i);
  for (let v = 0; v < 8; v++) {
    const m = rng.mische(basis);
    if (n < 2 || m.some((x, i) => x !== i)) return m;
  }
  return basis.reverse();
}

export function UebungAnsicht({ uebung, themaId, onFertig, onWeiter, weiterText = 'Weiter' }: Props) {
  const [geprueft, setGeprueft] = useState<null | boolean>(null);
  const [erklaer, setErklaer] = useState(false);
  useLernaktivitaet();
  const speichere = useStore((s) => s.speichereErgebnis);
  const seed = useMemo(() => Math.floor(Math.random() * 1e9), [uebung.id]);

  useEffect(() => setGeprueft(null), [uebung.id]);

  function fertig(richtig: boolean) {
    rueckmeldung(richtig ? 'richtig' : 'falsch');
    setGeprueft(richtig);
    speichere(uebKey(uebung.id), themaId, richtig, richtig ? 6 : 2, { key: uebKey(uebung.id), art: 'uebung', ref: uebung.id });
    onFertig?.(richtig);
  }

  useEffect(() => {
    if (geprueft === null) return;
    function onKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement)?.tagName;
      if ((e.key === 'e' || e.key === 'E') && tag !== 'INPUT') setErklaer(true);
      if (onWeiter && e.key === 'Enter' && tag !== 'BUTTON') {
        e.preventDefault();
        onWeiter();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [geprueft, onWeiter]);

  const Koerper = { mc: MC, reihenfolge: Reihenfolge, luecke: Luecke, fehler: Fehler, zuordnen: Zuordnen, klassifizieren: Klassifizieren }[uebung.typ] as (p: KProps<Uebung>) => JSX.Element;

  return (
    <div className="uebung einblenden">
      <div className="zeile zwischen">
        <span className="chip">{TYP_TEXT[uebung.typ]}</span>
        <span className="sehr-leise klein">{uebung.quelle}</span>
      </div>
      <Md text={uebung.frage} className="prosa uebung-frage" />
      <Koerper key={uebung.id} u={uebung} seed={seed} geprueft={geprueft} onPruefen={fertig} />
      {geprueft !== null && (
        <>
          <Meldung art={geprueft ? 'richtig' : 'falsch'}>
            <strong>{geprueft ? 'Richtig.' : 'Nicht ganz.'}</strong> {uebung.erklaerung && <Md text={uebung.erklaerung} inline />}
          </Meldung>
          <div className="aktionen">
            {onWeiter && (
              <button type="button" className="btn primaer" onClick={onWeiter}>
                {weiterText} <Taste>Enter</Taste>
              </button>
            )}
            <button type="button" className="btn geist" onClick={() => setErklaer(true)}>
              <Icon name="buch" size={16} /> Genauer erklärt <Taste>E</Taste>
            </button>
          </div>
        </>
      )}
      {erklaer && <ErklaerPanel themaId={themaId} suchtext={uebungsText(uebung)} onSchliessen={() => setErklaer(false)} />}
    </div>
  );
}

/** Alle Texte einer Übung – für die Suche nach dem passenden Erklärabschnitt. */
function uebungsText(u: Uebung): string {
  const teile: string[] = [u.frage, u.erklaerung ?? ''];
  if (u.typ === 'mc') teile.push(...u.optionen.map((o) => `${o.text} ${o.warum}`));
  if (u.typ === 'reihenfolge' || u.typ === 'fehler') teile.push(...u.schritte);
  if (u.typ === 'luecke') teile.push(u.text, ...u.luecken.map((l) => l.optionen[l.richtig]));
  if (u.typ === 'zuordnen') teile.push(...u.paare.map((p) => `${p.links} ${p.rechts}`));
  if (u.typ === 'klassifizieren') teile.push(...u.items.map((i) => i.text));
  return teile.join(' ');
}

interface KProps<T> {
  u: T;
  seed: number;
  geprueft: boolean | null;
  onPruefen: (richtig: boolean) => void;
}

function PruefKnopf({ onClick, disabled }: { onClick: () => void; disabled?: boolean }) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Enter' && !disabled && (e.target as HTMLElement)?.tagName !== 'BUTTON' && (e.target as HTMLElement)?.tagName !== 'SELECT') {
        e.preventDefault();
        onClick();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });
  return (
    <div className="aktionen">
      <button type="button" className="btn primaer" onClick={onClick} disabled={disabled}>
        Prüfen <Taste>Enter</Taste>
      </button>
    </div>
  );
}

// ---------- Multiple Choice ----------
function MC({ u, seed, geprueft, onPruefen }: KProps<MCUebung>) {
  const ordnung = useMemo(() => mischIndizes(u.optionen.length, seed), [u, seed]);
  const [wahl, setWahl] = useState<number | null>(null);
  const fertig = geprueft !== null;

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (fertig || (e.target as HTMLElement)?.tagName === 'INPUT') return;
      const n = Number(e.key);
      if (n >= 1 && n <= ordnung.length) setWahl(ordnung[n - 1]);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [fertig, ordnung]);

  return (
    <>
      <div className="auswahl-liste" role="radiogroup">
        {ordnung.map((i, pos) => {
          const o = u.optionen[i];
          const gewaehlt = wahl === i;
          const z = fertig ? (o.richtig ? ' ist-richtig' : gewaehlt ? ' ist-falsch' : ' ausgegraut') : '';
          return (
            <button key={i} type="button" role="radio" aria-checked={gewaehlt} className={`option${gewaehlt ? ' gewaehlt' : ''}${z}`} disabled={fertig} onClick={() => setWahl(i)}>
              <span className="option-nr">{pos + 1}</span>
              <span className="option-inhalt">
                <Md text={o.text} inline />
                {fertig && (
                  <span className="option-warum">
                    <Md text={o.warum} inline />
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>
      {!fertig && <PruefKnopf disabled={wahl === null} onClick={() => wahl !== null && onPruefen(!!u.optionen[wahl].richtig)} />}
    </>
  );
}

// ---------- Reihenfolge (DGL-Puzzle) ----------
function Reihenfolge({ u, seed, geprueft, onPruefen }: KProps<ReihenfolgeUebung>) {
  const [ordnung, setOrdnung] = useState(() => mischIndizes(u.schritte.length, seed));
  const [zieht, setZieht] = useState<number | null>(null);
  const fertig = geprueft !== null;

  function verschiebe(von: number, nach: number) {
    if (nach < 0 || nach >= ordnung.length) return;
    setOrdnung((o) => {
      const n = [...o];
      const [x] = n.splice(von, 1);
      n.splice(nach, 0, x);
      return n;
    });
  }

  return (
    <>
      <p className="sehr-leise klein">Ziehe die Schritte in die richtige Reihenfolge oder benutze die Pfeile.</p>
      <ol className="reihenfolge">
        {ordnung.map((i, pos) => {
          const z = fertig ? (i === pos ? ' ist-richtig' : ' ist-falsch') : '';
          return (
            <li
              key={i}
              className={`reihen-item${zieht === pos ? ' zieht' : ''}${z}`}
              draggable={!fertig}
              onDragStart={(e: DragEvent) => {
                setZieht(pos);
                e.dataTransfer.effectAllowed = 'move';
              }}
              onDragOver={(e) => {
                e.preventDefault();
                if (zieht !== null && zieht !== pos) {
                  verschiebe(zieht, pos);
                  setZieht(pos);
                }
              }}
              onDragEnd={() => setZieht(null)}
            >
              <span className="griff" aria-hidden>
                <Icon name="griff" size={16} />
              </span>
              <span className="reihen-nr">{pos + 1}</span>
              <Md text={u.schritte[i]} inline className="reihen-text" />
              {!fertig && (
                <span className="reihen-knoepfe">
                  <button type="button" className="btn geist klein" onClick={() => verschiebe(pos, pos - 1)} disabled={pos === 0} aria-label="nach oben">
                    <Icon name="hoch" size={15} />
                  </button>
                  <button type="button" className="btn geist klein" onClick={() => verschiebe(pos, pos + 1)} disabled={pos === ordnung.length - 1} aria-label="nach unten">
                    <Icon name="runter" size={15} />
                  </button>
                </span>
              )}
              {fertig && i !== pos && <span className="sehr-leise klein">gehört an Stelle {i + 1}</span>}
            </li>
          );
        })}
      </ol>
      {fertig && geprueft === false && (
        <details className="richtige-folge" open>
          <summary>Richtige Reihenfolge</summary>
          <ol>
            {u.schritte.map((s, i) => (
              <li key={i}>
                <Md text={s} inline />
              </li>
            ))}
          </ol>
        </details>
      )}
      {!fertig && <PruefKnopf onClick={() => onPruefen(ordnung.every((x, i) => x === i))} />}
    </>
  );
}

// ---------- Lückentext ----------
function Luecke({ u, seed, geprueft, onPruefen }: KProps<LueckeUebung>) {
  const [werte, setWerte] = useState<(number | null)[]>(() => u.luecken.map(() => null));
  const ordnungen = useMemo(() => u.luecken.map((l, i) => mischIndizes(l.optionen.length, seed + i)), [u, seed]);
  const fertig = geprueft !== null;
  const teile = u.text.split(/\[\[(\d+)\]\]/);
  return (
    <>
      <div className="lueckentext prosa">
        {teile.map((t, i) => {
          if (i % 2 === 0) return <Md key={i} text={t} inline />;
          const k = Number(t);
          const l = u.luecken[k];
          const w = werte[k];
          const z = fertig ? (w === l.richtig ? ' richtig' : ' falsch') : '';
          return (
            <span key={i} className="luecke-wrap">
              <select
                className={`eingabe luecke${z}`}
                value={w ?? ''}
                disabled={fertig}
                aria-label={`Lücke ${k + 1}`}
                onChange={(e) => setWerte((alt) => alt.map((x, j) => (j === k ? Number(e.target.value) : x)))}
              >
                <option value="" disabled>
                  …
                </option>
                {ordnungen[k].map((oi) => (
                  <option key={oi} value={oi}>
                    {l.optionen[oi]}
                  </option>
                ))}
              </select>
              {fertig && w !== l.richtig && <span className="luecke-loesung">{l.optionen[l.richtig]}</span>}
            </span>
          );
        })}
      </div>
      {!fertig && <PruefKnopf disabled={werte.some((w) => w === null)} onClick={() => onPruefen(werte.every((w, i) => w === u.luecken[i].richtig))} />}
    </>
  );
}

// ---------- Fehler finden ----------
function Fehler({ u, geprueft, onPruefen }: KProps<FehlerUebung>) {
  const [wahl, setWahl] = useState<number | null>(null);
  const fertig = geprueft !== null;
  return (
    <>
      <p className="sehr-leise klein">Klicke auf den Schritt, in dem der Fehler steckt.</p>
      <ol className="schritte-liste">
        {u.schritte.map((s, i) => {
          const z = fertig ? (i === u.fehler ? ' ist-falsch' : wahl === i ? ' ausgegraut' : '') : '';
          return (
            <li key={i}>
              <button type="button" className={`schritt${wahl === i ? ' gewaehlt' : ''}${z}`} disabled={fertig} onClick={() => setWahl(i)} aria-pressed={wahl === i}>
                <span className="reihen-nr">{i + 1}</span>
                <Md text={s} inline />
              </button>
            </li>
          );
        })}
      </ol>
      {fertig && (
        <Meldung art="info">
          <Md text={u.erklaerung} inline />
        </Meldung>
      )}
      {!fertig && <PruefKnopf disabled={wahl === null} onClick={() => onPruefen(wahl === u.fehler)} />}
    </>
  );
}

// ---------- Zuordnen ----------
function Zuordnen({ u, seed, geprueft, onPruefen }: KProps<ZuordnenUebung>) {
  const ordnung = useMemo(() => mischIndizes(u.paare.length, seed), [u, seed]);
  const [werte, setWerte] = useState<(number | null)[]>(() => u.paare.map(() => null));
  const fertig = geprueft !== null;
  return (
    <>
      <div className="zuordnen">
        {u.paare.map((p, i) => {
          const w = werte[i];
          const z = fertig ? (w === i ? ' richtig' : ' falsch') : '';
          return (
            <div key={i} className="zuordnen-zeile">
              <div className="zuordnen-links">
                <Md text={p.links} inline />
              </div>
              <Icon name="pfeilRechts" size={16} className="sehr-leise" />
              <div className="zuordnen-rechts">
                <select
                  className={`eingabe${z}`}
                  value={w ?? ''}
                  disabled={fertig}
                  aria-label={`Zuordnung ${i + 1}`}
                  onChange={(e) => setWerte((alt) => alt.map((x, j) => (j === i ? Number(e.target.value) : x)))}
                >
                  <option value="" disabled>
                    wählen …
                  </option>
                  {ordnung.map((oi) => (
                    <option key={oi} value={oi}>
                      {u.paare[oi].rechts.replace(/\$/g, '')}
                    </option>
                  ))}
                </select>
                {fertig && w !== i && (
                  <span className="luecke-loesung">
                    <Md text={p.rechts} inline />
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {!fertig && <PruefKnopf disabled={werte.some((w) => w === null)} onClick={() => onPruefen(werte.every((w, i) => w === i))} />}
    </>
  );
}

// ---------- Klassifizieren ----------
function Klassifizieren({ u, seed, geprueft, onPruefen }: KProps<KlassifizierenUebung>) {
  const ordnung = useMemo(() => mischIndizes(u.items.length, seed), [u, seed]);
  const [werte, setWerte] = useState<(number | null)[]>(() => u.items.map(() => null));
  const fertig = geprueft !== null;
  return (
    <>
      <div className="klassifizieren">
        {ordnung.map((i) => {
          const it = u.items[i];
          const w = werte[i];
          return (
            <div key={i} className={`klass-zeile${fertig ? (w === it.kategorie ? ' ist-richtig' : ' ist-falsch') : ''}`}>
              <div className="klass-text">
                <Md text={it.text} inline />
                {fertig && it.warum && (
                  <span className="option-warum">
                    <Md text={it.warum} inline />
                  </span>
                )}
              </div>
              <div className="segment" role="radiogroup">
                {u.kategorien.map((k, ki) => (
                  <button
                    key={ki}
                    type="button"
                    role="radio"
                    aria-checked={w === ki}
                    className={`${w === ki ? 'an' : ''}${fertig && ki === it.kategorie ? ' loesung' : ''}`}
                    disabled={fertig}
                    onClick={() => setWerte((alt) => alt.map((x, j) => (j === i ? ki : x)))}
                  >
                    {k}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      {!fertig && <PruefKnopf disabled={werte.some((w) => w === null)} onClick={() => onPruefen(werte.every((w, i) => w === u.items[i].kategorie))} />}
    </>
  );
}
