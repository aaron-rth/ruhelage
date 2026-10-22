// Kleine, wiederverwendbare Bausteine
import { useMemo, type ReactNode } from 'react';
import type { Status } from '../content/types';
import { renderBlock, renderInline } from '../lib/markdown';
import { Icon } from './Icon';

/** Markdown mit $…$-Formeln. `inline` für kurze Texte ohne Absatz. */
export function Md({ text, inline, className }: { text: string; inline?: boolean; className?: string }) {
  const html = useMemo(() => (inline ? renderInline(text) : renderBlock(text)), [text, inline]);
  if (inline) return <span className={className} dangerouslySetInnerHTML={{ __html: html }} />;
  return <div className={className ?? 'prosa'} dangerouslySetInnerHTML={{ __html: html }} />;
}

/** Gedämpfte Welle, die zur Ruhe kommt – das Logo von Ruhelage */
export function LogoWelle({ breite = 34, animiert = false, einmal = false }: { breite?: number; animiert?: boolean; einmal?: boolean }) {
  const d = 'M2 16 C 5 2, 8 2, 11 16 S 17 26, 20 16 S 25 10, 27.5 16 S 32 19.5, 34 16 S 37 14.6, 39 16 L 46 16';
  return (
    <svg width={breite} height={(breite * 32) / 48} viewBox="0 0 48 32" fill="none" aria-hidden className={`logo-welle${animiert ? ' animiert' : ''}${einmal ? ' einmal' : ''}`}>
      <path d={d} stroke="var(--akzent)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" pathLength={100} />
    </svg>
  );
}

export function Logo({ klein }: { klein?: boolean }) {
  return (
    <span className="logo">
      <LogoWelle breite={klein ? 28 : 34} />
      <span className="logo-text">Ruhelage</span>
    </span>
  );
}

export function Lader({ text = 'Einen Moment …' }: { text?: string }) {
  return (
    <div className="lader" role="status">
      <LogoWelle breite={64} animiert />
      <span className="sehr-leise klein">{text}</span>
    </div>
  );
}

export function Balken({ wert, duenn, label }: { wert: number; duenn?: boolean; label?: string }) {
  const p = Math.max(0, Math.min(1, wert)) * 100;
  return (
    <div className={duenn ? 'balken duenn' : 'balken'} role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(p)} aria-label={label}>
      <span style={{ width: `${p}%` }} />
    </div>
  );
}

export function Ring({ wert, groesse = 40, staerke = 3.5, children }: { wert: number; groesse?: number; staerke?: number; children?: ReactNode }) {
  const r = (groesse - staerke) / 2;
  const u = 2 * Math.PI * r;
  const p = Math.max(0, Math.min(1, wert));
  return (
    <span className="ring-wrap" style={{ width: groesse, height: groesse }}>
      <svg className="ring" width={groesse} height={groesse} aria-hidden>
        <circle className="spur" cx={groesse / 2} cy={groesse / 2} r={r} strokeWidth={staerke} />
        <circle className="wert" cx={groesse / 2} cy={groesse / 2} r={r} strokeWidth={staerke} strokeDasharray={u} strokeDashoffset={u * (1 - p)} />
      </svg>
      {children && <span className="ring-inhalt">{children}</span>}
    </span>
  );
}

export const STATUS_TEXT: Record<Status, string> = { kann: 'kann ich', halb: 'so halb', nicht: 'kann ich nicht', offen: 'noch nicht eingeschätzt' };
export const STATUS_ICON: Record<Status, string> = { kann: 'check', halb: 'tilde', nicht: 'x', offen: 'info' };

export function StatusWahl({ wert, onChange, kompakt }: { wert: Status; onChange: (s: Status) => void; kompakt?: boolean }) {
  return (
    <div className="status-wahl" role="group" aria-label="Selbsteinschätzung">
      {(['kann', 'halb', 'nicht'] as Status[]).map((s) => (
        <button key={s} type="button" className={s} aria-pressed={wert === s} onClick={() => onChange(s)} title={STATUS_TEXT[s]}>
          <Icon name={STATUS_ICON[s]} size={15} />
          {!kompakt && <span>{STATUS_TEXT[s]}</span>}
          {kompakt && <span className="sr-only">{STATUS_TEXT[s]}</span>}
        </button>
      ))}
    </div>
  );
}

export function StatusChip({ status }: { status: Status }) {
  const cls = status === 'kann' ? 'chip akzent' : status === 'halb' ? 'chip sand' : status === 'nicht' ? 'chip koralle' : 'chip';
  return (
    <span className={cls}>
      <Icon name={STATUS_ICON[status]} size={13} />
      {status === 'offen' ? 'noch offen' : STATUS_TEXT[status]}
    </span>
  );
}

export function Meldung({ art, children }: { art: 'richtig' | 'falsch' | 'info'; children: ReactNode }) {
  const icon = art === 'richtig' ? 'check' : art === 'falsch' ? 'x' : 'info';
  return (
    <div className={`meldung ${art} einblenden`} role={art === 'info' ? undefined : 'status'}>
      <Icon name={icon} size={16} />
      <div>{children}</div>
    </div>
  );
}

export function Leer({ icon = 'welle', titel, children }: { icon?: string; titel: string; children?: ReactNode }) {
  return (
    <div className="leer">
      <Icon name={icon} size={40} className="leer-bild" />
      <h3>{titel}</h3>
      {children && <div className="leise">{children}</div>}
    </div>
  );
}

export function Taste({ children }: { children: ReactNode }) {
  return <kbd className="taste">{children}</kbd>;
}
