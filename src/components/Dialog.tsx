// Modaler Dialog (mittig) oder Seitenleiste (rechts, auf dem Handy von unten).
import { useEffect, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from './Icon';

export function Dialog({
  titel,
  onSchliessen,
  children,
  fuss,
  art = 'mitte',
  ueber,
  onTaste,
}: {
  titel: string;
  onSchliessen: () => void;
  children: ReactNode;
  fuss?: ReactNode;
  art?: 'mitte' | 'seite';
  ueber?: string;
  /** eigene Tastenkürzel des Dialogs (z. B. Pfeiltasten) */
  onTaste?: (e: KeyboardEvent) => void;
}) {
  const box = useRef<HTMLDivElement>(null);
  const vorher = useRef<Element | null>(null);
  const zu = useRef(onSchliessen);
  zu.current = onSchliessen;
  const taste = useRef(onTaste);
  taste.current = onTaste;

  useEffect(() => {
    vorher.current = document.activeElement;
    box.current?.focus();
    const scroll = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.stopImmediatePropagation();
        zu.current();
        return;
      }
      taste.current?.(e);
      // Tastenkürzel der Seite darunter nicht auslösen (Standardaktionen wie Klick per Leertaste bleiben)
      e.stopImmediatePropagation();
    }
    window.addEventListener('keydown', onKey, true);
    return () => {
      window.removeEventListener('keydown', onKey, true);
      document.body.style.overflow = scroll;
      (vorher.current as HTMLElement | null)?.focus?.();
    };
  }, []);

  return createPortal(
    <div className={`dialog-huelle ${art}`} onMouseDown={(e) => e.target === e.currentTarget && zu.current()}>
      <div className={`dialog ${art}`} role="dialog" aria-modal="true" aria-label={titel} tabIndex={-1} ref={box}>
        <div className="dialog-kopf">
          <div>
            {ueber && <span className="ueber">{ueber}</span>}
            <h2>{titel}</h2>
          </div>
          <button type="button" className="btn geist klein dialog-zu" onClick={onSchliessen} aria-label="Schließen">
            <Icon name="x" size={18} />
          </button>
        </div>
        <div className="dialog-inhalt">{children}</div>
        {fuss && <div className="dialog-fuss">{fuss}</div>}
      </div>
    </div>,
    document.body,
  );
}
