// Handy: Übungen und Rechenaufgaben im Vollbild – eigene Scrollfläche, Karte gleitet bei jeder neuen Aufgabe herein.
import { useEffect, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Balken } from './Basis';
import { Icon } from './Icon';

export function VollbildRahmen({
  titel,
  stand,
  anteil,
  wechsel,
  onZu,
  children,
  fuss,
}: {
  titel: string;
  stand?: string;
  anteil?: number;
  /** ändert sich bei jeder neuen Aufgabe → nach oben scrollen und hereingleiten */
  wechsel: string;
  onZu: () => void;
  children: ReactNode;
  fuss?: ReactNode;
}) {
  const flaeche = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const alt = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = alt;
    };
  }, []);

  useEffect(() => {
    flaeche.current?.scrollTo({ top: 0 });
  }, [wechsel]);

  return createPortal(
    <div className="vollbild-sitzung" role="dialog" aria-modal="true" aria-label={titel}>
      <div className="vb-kopf">
        <button type="button" className="btn geist klein symbol-knopf" onClick={onZu} aria-label="Schließen">
          <Icon name="x" size={18} />
        </button>
        <div className="sitzung-fortschritt">
          <span className="sehr-leise klein vb-titel">{titel}</span>
          {anteil !== undefined && <Balken wert={anteil} duenn />}
        </div>
        {stand && <span className="mono sehr-leise klein">{stand}</span>}
      </div>
      <div className="vb-inhalt" ref={flaeche}>
        <div key={wechsel} className="vb-karte">
          {children}
        </div>
      </div>
      {fuss && <div className="vb-fuss">{fuss}</div>}
    </div>,
    document.body,
  );
}
