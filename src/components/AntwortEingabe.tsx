// Eingabefeld passend zur Antwortart: Zahl + Einheit, Winkel, Auswahl oder Klick ins Diagramm.
import { useEffect, useRef } from 'react';
import type { Antwort, PlotSpec } from '../content/types';
import type { Eingabe } from '../lib/antwort';
import { passendeEinheiten } from '../lib/einheiten';
import { Md } from './Basis';
import { Plot } from './Plot';

interface Props {
  antwort: Antwort;
  wert: Eingabe;
  onChange: (e: Eingabe) => void;
  onEnter?: () => void;
  status?: 'richtig' | 'falsch' | null;
  gesperrt?: boolean;
  autoFokus?: boolean;
  /** Diagramm zum Klicken (bei Antwortart „klick“) */
  plot?: PlotSpec;
  /** nach dem Prüfen: richtige Stelle zeigen */
  zeigeLoesung?: boolean;
  label?: string;
}

export function AntwortEingabe({ antwort, wert, onChange, onEnter, status, gesperrt, autoFokus, plot, zeigeLoesung, label = 'Deine Antwort' }: Props) {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (autoFokus && !gesperrt) ref.current?.focus({ preventScroll: true });
  }, [autoFokus, gesperrt, antwort]);

  const cls = status === 'richtig' ? ' richtig' : status === 'falsch' ? ' falsch' : '';

  if ((antwort.art === 'zahl' && wert.art === 'zahl') || (antwort.art === 'winkel' && wert.art === 'winkel')) {
    const einheiten =
      antwort.art === 'zahl'
        ? passendeEinheiten(antwort.einheit).map((e) => ({ key: e.key, anzeige: e.anzeige }))
        : [
            { key: 'rad', anzeige: 'rad' },
            { key: '°', anzeige: '° (Grad)' },
          ];
    const zeigeMenue = einheiten.length > 1 || einheiten[0]?.key !== '';
    return (
      <div className="antwort-zeile">
        <label className="sr-only" htmlFor={`e-${label}`}>
          {label}
        </label>
        <input
          id={`e-${label}`}
          ref={ref}
          className={`eingabe zahl${cls}`}
          inputMode="decimal"
          autoComplete="off"
          spellCheck={false}
          placeholder="Ergebnis"
          value={wert.text}
          disabled={gesperrt}
          onChange={(e) => onChange({ ...wert, text: e.target.value } as Eingabe)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              onEnter?.();
            }
          }}
        />
        {zeigeMenue && (
          <select
            className="eingabe einheit-wahl"
            aria-label="Einheit"
            value={wert.einheit}
            disabled={gesperrt}
            onChange={(e) => onChange({ ...wert, einheit: e.target.value } as Eingabe)}
          >
            {einheiten.map((e) => (
              <option key={e.key} value={e.key}>
                {e.anzeige}
              </option>
            ))}
          </select>
        )}
      </div>
    );
  }

  if (antwort.art === 'auswahl' && wert.art === 'auswahl') {
    return (
      <div className={antwort.plots ? 'auswahl-raster mit-plots' : 'auswahl-liste'} role="radiogroup" aria-label={label}>
        {antwort.optionen.map((o, i) => {
          const gewaehlt = wert.wahl === i;
          let z = '';
          if (zeigeLoesung && i === antwort.richtig) z = ' ist-richtig';
          else if (zeigeLoesung && gewaehlt) z = ' ist-falsch';
          return (
            <button
              key={i}
              type="button"
              role="radio"
              aria-checked={gewaehlt}
              className={`option${gewaehlt ? ' gewaehlt' : ''}${z}`}
              disabled={gesperrt}
              onClick={() => onChange({ art: 'auswahl', wahl: i })}
            >
              <span className="option-nr">{String.fromCharCode(65 + i)}</span>
              <span className="option-inhalt">
                {antwort.plots?.[i] && <Plot spec={antwort.plots[i]} hoehe={190} />}
                <Md text={o} inline />
              </span>
            </button>
          );
        })}
      </div>
    );
  }

  if (antwort.art === 'klick' && wert.art === 'klick' && plot) {
    return (
      <div className="klick-plot">
        <Plot
          spec={plot}
          klickbar={!gesperrt}
          markiertX={wert.x}
          markierungFarbe={status === 'falsch' ? 'koralle' : 'akzent'}
          zielX={zeigeLoesung ? antwort.ziele : undefined}
          onKlick={(x) => onChange({ art: 'klick', x })}
        />
        <p className="sehr-leise klein">{wert.x === null ? 'Klicke auf die passende Stelle im Diagramm.' : 'Du kannst neu klicken, bis du prüfst.'}</p>
      </div>
    );
  }
  return null;
}
