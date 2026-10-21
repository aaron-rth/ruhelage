// „Genauer erklärt“: Zusatzerklärung zur Karte plus passender Abschnitt aus „Kurz erklärt“.
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { findeThema } from '../content/kurse';
import { abschnitte, besterAbschnitt } from '../lib/abschnitte';
import { Md } from './Basis';
import { Dialog } from './Dialog';
import { Icon } from './Icon';

export function ErklaerPanel({ themaId, suchtext, mehr, onSchliessen }: { themaId: string; suchtext: string; mehr?: string; onSchliessen: () => void }) {
  const thema = findeThema(themaId);
  const liste = useMemo(() => abschnitte(thema?.erklaerung ?? ''), [thema]);
  const start = useMemo(() => besterAbschnitt(liste, suchtext), [liste, suchtext]);
  const [wahl, setWahl] = useState(start);
  if (!thema) return null;
  const a = liste[wahl];

  return (
    <Dialog
      titel="Genauer erklärt"
      ueber={`Thema ${thema.nr} · ${thema.titel}`}
      art="seite"
      onSchliessen={onSchliessen}
      fuss={
        <Link className="btn geist" to={`/thema/${thema.id}/erklaert`} onClick={onSchliessen}>
          <Icon name="buch" size={16} /> Ganzes Thema lesen
        </Link>
      }
    >
      {mehr && (
        <section className="erklaer-mehr">
          <Md text={mehr} className="prosa" />
        </section>
      )}
      {a && (
        <section className="erklaer-abschnitt">
          <span className="ueber-klein">
            <Icon name="buch" size={13} /> {mehr ? 'Passt dazu' : 'Passender Abschnitt'} aus „Kurz erklärt“
          </span>
          <h3>{a.titel}</h3>
          <Md text={a.text} className="prosa" />
          {liste.length > 1 && (
            <div className="abschnitt-wahl" role="group" aria-label="Andere Abschnitte">
              {liste.map((x, i) => (
                <button key={x.titel} type="button" className={`chip-knopf${i === wahl ? ' an' : ''}`} aria-pressed={i === wahl} onClick={() => setWahl(i)}>
                  {x.titel}
                </button>
              ))}
            </div>
          )}
        </section>
      )}
    </Dialog>
  );
}

/** Kleiner Knopf, der das Panel öffnet. */
export function ErklaerKnopf({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" className="btn geist" onClick={onClick}>
      <Icon name="buch" size={16} /> Genauer erklärt <kbd className="taste">E</kbd>
    </button>
  );
}
