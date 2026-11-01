// Erster Start: Fächer wählen – oder mit dem Beispiel-Fach umschauen. Danach startet die Einführung.
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { KURSE } from '../content/kurse';
import { BEISPIEL_KURS, starteMitKursen } from '../lib/kurs';
import { istLeer } from '../lib/zusammenfuehren';
import { useStore } from '../store/store';
import { LogoWelle } from './Basis';
import { stufeVon } from './FachHinzu';
import { fachIcon } from './FachUmschalter';
import { Icon } from './Icon';
import { EINFUEHRUNG, starteTour } from './Tour';

export const WILLKOMMEN = 'willkommen';

export function Willkommen() {
  const gesehen = useStore((s) => s.gesehen);
  const leer = useStore((s) => istLeer(s));
  const hinweisGesehen = useStore((s) => s.hinweisGesehen);
  const echte = KURSE.filter((k) => !k.beispiel);
  const stufen = [...new Set(echte.map((k) => stufeVon(k.klasse)))].sort();
  const [stufe, setStufe] = useState('alle');
  const [wahl, setWahl] = useState<string[]>([]);
  // nur beim allerersten Öffnen eines neuen Geräts ohne Fortschritt
  if (gesehen.includes(WILLKOMMEN) || gesehen.includes(EINFUEHRUNG) || !leer) return null;

  const beispiel = BEISPIEL_KURS();
  const liste = echte.filter((k) => stufe === 'alle' || stufeVon(k.klasse) === stufe);
  function los(ids: string[]) {
    starteMitKursen(ids);
    hinweisGesehen(WILLKOMMEN);
    starteTour();
  }

  return createPortal(
    <div className="willkommen" role="dialog" aria-modal="true" aria-labelledby="willkommen-titel">
      <div className="willkommen-karte">
        <LogoWelle breite={64} einmal />
        <h1 id="willkommen-titel">Willkommen bei Ruhelage</h1>
        <p className="leise">Karteikarten, Übungen und ein Lernplan bis zur Klausur. Welche Fächer brauchst du?</p>
        {stufen.length > 1 && (
          <div className="segment stufen-wahl" role="radiogroup" aria-label="Klassenstufe">
            {['alle', ...stufen].map((s) => (
              <button key={s} type="button" role="radio" aria-checked={stufe === s} className={stufe === s ? 'an' : ''} onClick={() => setStufe(s)}>
                {s === 'alle' ? 'Alle Stufen' : s}
              </button>
            ))}
          </div>
        )}
        <ul className="fach-angebot">
          {liste.map((k) => {
            const an = wahl.includes(k.id);
            return (
              <li key={k.id}>
                <button type="button" className={`fach-reihe${an ? ' gewaehlt' : ''}`} role="checkbox" aria-checked={an} onClick={() => setWahl((w) => (an ? w.filter((x) => x !== k.id) : [...w, k.id]))}>
                  <span className="modus-icon">
                    <Icon name={fachIcon(k)} size={20} />
                  </span>
                  <span className="fach-reihe-text">
                    <span className="fach-name">
                      <strong>{k.fach}</strong>
                      <span className="chip klein-chip">{k.klasse}</span>
                    </span>
                    <span className="sehr-leise klein">{k.titel}</span>
                  </span>
                  <span className={`auswahl-haken${an ? ' an' : ''}`} aria-hidden>
                    {an && <Icon name="check" size={16} />}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
        <button type="button" className="btn primaer gross" disabled={!wahl.length} onClick={() => los(wahl)}>
          {wahl.length ? `Los geht's mit ${wahl.length === 1 ? '1 Fach' : `${wahl.length} Fächern`}` : 'Wähle mindestens ein Fach'} <Icon name="rechts" size={18} />
        </button>
        {beispiel && (
          <button type="button" className="btn geist" onClick={() => los([beispiel.id])}>
            <Icon name="funke" size={16} /> Erst mal umschauen – mit einem Beispiel-Fach
          </button>
        )}
        <p className="sehr-leise klein" style={{ margin: 0 }}>
          Dein Fach fehlt? Später unter Fächer → „Fach hinzufügen“ kannst du es anfragen.
        </p>
      </div>
    </div>,
    document.body,
  );
}
