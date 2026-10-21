// Eingabefeld passend zur Antwortart: Zahl + Einheit, Winkel, Auswahl oder Klick ins Diagramm.
import { useEffect, useMemo, useRef, useState } from 'react';
import type { Antwort, PlotSpec } from '../content/types';
import { zerlege, type Eingabe } from '../lib/antwort';
import { passendeEinheiten } from '../lib/einheiten';
import { zahl as zahlText } from '../lib/format';
import { Md } from './Basis';
import { Plot } from './Plot';

/** Schnelltasten fürs Handy (die Zahlentastatur hat diese Zeichen oft nicht) */
const ZEICHEN: { text: string; einfuegen: string; label: string }[] = [
  { text: '−', einfuegen: '-', label: 'Minus' },
  { text: '/', einfuegen: '/', label: 'geteilt (Bruch)' },
  { text: '^', einfuegen: '^', label: 'hoch' },
  { text: '·10^', einfuegen: '·10^', label: 'mal zehn hoch' },
  { text: '√', einfuegen: '√(', label: 'Wurzel' },
  { text: 'π', einfuegen: 'π', label: 'pi' },
  { text: '(', einfuegen: '(', label: 'Klammer auf' },
  { text: ')', einfuegen: ')', label: 'Klammer zu' },
];

function EingabeHilfe({ winkel }: { winkel: boolean }) {
  return (
    <div className="eingabe-hilfe einblenden" role="note">
      <strong>So kannst du eingeben</strong>
      <dl>
        <div>
          <dt>Kommazahl</dt>
          <dd>
            <code>0,42</code> oder <code>0.42</code>
          </dd>
        </div>
        <div>
          <dt>Bruch / geteilt</dt>
          <dd>
            <code>3/4</code> oder <code>3:4</code>
          </dd>
        </div>
        <div>
          <dt>Mal</dt>
          <dd>
            <code>2*3</code>, <code>2·3</code>, bei π und Klammern auch ohne: <code>2π</code>
          </dd>
        </div>
        <div>
          <dt>Potenz</dt>
          <dd>
            <code>2^3</code>, <code>10^-3</code>, <code>3²</code>
          </dd>
        </div>
        <div>
          <dt>Zehnerpotenz</dt>
          <dd>
            <code>4,2·10^-3</code>, <code>4,2*10^-3</code> oder <code>4,2e-3</code>
          </dd>
        </div>
        <div>
          <dt>Wurzel</dt>
          <dd>
            <code>√2</code>, <code>√(0,5/9,81)</code>, <code>sqrt(2)</code> oder <code>wurzel(2)</code>
          </dd>
        </div>
        <div>
          <dt>π</dt>
          <dd>
            <code>π</code> oder <code>pi</code>, z. B. <code>2pi/3</code>
          </dd>
        </div>
        <div>
          <dt>Klammern</dt>
          <dd>
            <code>(1+2)/3</code>
          </dd>
        </div>
        <div>
          <dt>Funktionen</dt>
          <dd>
            <code>sin</code>, <code>cos</code>, <code>tan</code>, <code>arcsin</code>, <code>ln</code> … (im Bogenmaß)
          </dd>
        </div>
        <div>
          <dt>Einheit</dt>
          <dd>{winkel ? 'rad oder ° im Menü wählen oder dahinter schreiben: 45°' : <>im Menü wählen oder dahinter schreiben: <code>3/4 s</code>, <code>9,81 m/s^2</code></>}</dd>
        </div>
      </dl>
      <span className="sehr-leise klein">Unter dem Feld siehst du, welchen Wert die App aus deiner Eingabe ausrechnet.</span>
    </div>
  );
}

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
  const [hilfe, setHilfe] = useState(false);
  // Antwortmöglichkeiten bei jeder Aufgabe neu mischen – außer wenn die Beschriftung an der Position hängt (Diagramm A, B …)
  const ordnung = useMemo(() => {
    if (antwort.art !== 'auswahl') return [];
    const idx = antwort.optionen.map((_, i) => i);
    if (antwort.plots || antwort.optionen.some((o) => /^(Diagramm|Anordnung|Graph|Kurve) [A-Z]$/.test(o))) return idx;
    for (let i = idx.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [idx[i], idx[j]] = [idx[j], idx[i]];
    }
    return idx;
  }, [antwort]);
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
    const text = wert.text;
    const z = text.trim() ? zerlege(text) : null;

    function einfuegen(zeichen: string) {
      const el = ref.current;
      const a = el?.selectionStart ?? text.length;
      const b = el?.selectionEnd ?? text.length;
      const neu = text.slice(0, a) + zeichen + text.slice(b);
      onChange({ ...wert, text: neu } as Eingabe);
      requestAnimationFrame(() => {
        el?.focus();
        el?.setSelectionRange(a + zeichen.length, a + zeichen.length);
      });
    }

    return (
      <div className="antwort-block">
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
            // Esc verlässt das Feld, danach funktionieren H (Hilfe) und L (Lösung)
            if (e.key === 'Escape') (e.target as HTMLInputElement).blur();
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
        <button
          type="button"
          className={`btn geist klein symbol-knopf hilfe-knopf${hilfe ? ' an' : ''}`}
          onClick={() => setHilfe((h) => !h)}
          aria-expanded={hilfe}
          aria-label="Wie gebe ich Brüche, Potenzen und Wurzeln ein?"
          title="Wie gebe ich Brüche, Potenzen und Wurzeln ein?"
        >
          ?
        </button>
      </div>
      {!gesperrt && (
        <div className="zeichen-leiste" aria-label="Rechenzeichen einfügen">
          {ZEICHEN.map((c) => (
            <button key={c.text} type="button" className="zeichen" onMouseDown={(e) => e.preventDefault()} onClick={() => einfuegen(c.einfuegen)} aria-label={c.label}>
              {c.text}
            </button>
          ))}
        </div>
      )}
      {z && z.rechnung && z.zahl !== null && !gesperrt && (
        <span className="ausdruck-vorschau mono klein" aria-live="polite">
          = {zahlText(z.zahl, 4)} {z.rest}
        </span>
      )}
      {z && z.zahl === null && text.trim().length > 1 && !gesperrt && <span className="ausdruck-vorschau warnung klein">Das kann ich noch nicht ausrechnen – fehlt eine Klammer oder Zahl?</span>}
      {hilfe && <EingabeHilfe winkel={antwort.art === 'winkel'} />}
      </div>
    );
  }

  if (antwort.art === 'auswahl' && wert.art === 'auswahl') {
    return (
      <div className={antwort.plots ? 'auswahl-raster mit-plots' : 'auswahl-liste'} role="radiogroup" aria-label={label}>
        {ordnung.map((i, pos) => {
          const o = antwort.optionen[i];
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
              <span className="option-nr">{String.fromCharCode(65 + pos)}</span>
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
