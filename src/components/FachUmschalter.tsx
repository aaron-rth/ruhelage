// Seitenleiste: aktuelles Fach als ein Knopf; Klick öffnet die Liste der eigenen Fächer.
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Kurs } from '../content/types';
import { useAktiverKurs, useMeineKurse, wechsleKurs } from '../lib/kurs';
import { Icon } from './Icon';

export const fachIcon = (k: Kurs) => (k.beispiel ? 'funke' : k.fach === 'Physik' ? 'welle' : 'buch');

export function FachUmschalter({ tabIndex }: { tabIndex?: number }) {
  const kurs = useAktiverKurs();
  const { laufend } = useMeineKurse();
  const [offen, setOffen] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!offen) return;
    const weg = (e: MouseEvent) => !box.current?.contains(e.target as Node) && setOffen(false);
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setOffen(false);
    document.addEventListener('mousedown', weg);
    document.addEventListener('keydown', esc);
    return () => {
      document.removeEventListener('mousedown', weg);
      document.removeEventListener('keydown', esc);
    };
  }, [offen]);

  const gehe = (pfad: string) => {
    setOffen(false);
    navigate(pfad);
  };

  return (
    <div className="fach-umschalter-box" ref={box}>
      <button type="button" className={`fach-umschalter${offen ? ' offen' : ''}`} data-tour="fachwahl" onClick={() => setOffen((o) => !o)} aria-haspopup="menu" aria-expanded={offen} tabIndex={tabIndex}>
        <span className="fach-umschalter-icon">
          <Icon name={fachIcon(kurs)} size={18} />
        </span>
        <span className="fach-umschalter-text">
          <strong>{kurs.fach}</strong>
          <span className="sehr-leise klein">
            {kurs.klasse} · {kurs.titel}
          </span>
        </span>
        <Icon name="runter" size={16} className="sehr-leise fach-umschalter-pfeil" />
      </button>
      {offen && (
        <div className="fach-menue" role="menu">
          {laufend.map((k) => (
            <button
              key={k.id}
              type="button"
              role="menuitemradio"
              aria-checked={k.id === kurs.id}
              className={`fach-menue-punkt${k.id === kurs.id ? ' an' : ''}`}
              onClick={() => {
                wechsleKurs(k.id);
                setOffen(false);
              }}
            >
              <Icon name={fachIcon(k)} size={16} />
              <span className="fach-menue-text">
                <strong>{k.fach}</strong> <span className="sehr-leise klein">{k.klasse}</span>
              </span>
              {k.id === kurs.id && <Icon name="check" size={16} className="fach-menue-haken" />}
            </button>
          ))}
          <div className="fach-menue-trenner" />
          <button type="button" role="menuitem" className="fach-menue-punkt" onClick={() => gehe('/faecher?hinzu=1')}>
            <Icon name="plus" size={16} /> <span className="fach-menue-text">Fach hinzufügen</span>
          </button>
          <button type="button" role="menuitem" className="fach-menue-punkt" onClick={() => gehe('/faecher')}>
            <Icon name="buch" size={16} /> <span className="fach-menue-text">Fächer verwalten</span>
          </button>
        </div>
      )}
    </div>
  );
}
