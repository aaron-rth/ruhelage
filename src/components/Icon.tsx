// Schlichte Linien-Icons (24×24, Strichstärke 1.75)
import type { ReactElement } from 'react';

const P: Record<string, ReactElement> = {
  heute: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4" />
    </>
  ),
  pfad: (
    <>
      <circle cx="6" cy="18" r="2.2" />
      <circle cx="18" cy="6" r="2.2" />
      <circle cx="17" cy="17" r="2.2" />
      <path d="M8 17.2c3-.6 6.5-.3 7 0M7.4 16.3 16.4 7.6M17.6 8.2l-.4 6.6" />
    </>
  ),
  welle: <path d="M2 12c2.2-7 4.3-7 6.5 0s4.3 7 6.5 0 3.6-4.5 7 0" />,
  nochmal: (
    <>
      <path d="M4 12a8 8 0 1 0 2.4-5.7" />
      <path d="M4 4v4.5h4.5" />
    </>
  ),
  klausur: (
    <>
      <circle cx="12" cy="13" r="8" />
      <path d="M12 9v4l2.5 2M9.5 2.5h5" />
    </>
  ),
  formel: <path d="M17 5H7l5.5 7L7 19h10" />,
  einstellungen: (
    <>
      <path d="M4 7h10M18 7h2M4 17h4M12 17h8" />
      <circle cx="16" cy="7" r="2" />
      <circle cx="10" cy="17" r="2" />
    </>
  ),
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  x: <path d="M6.5 6.5l11 11M17.5 6.5l-11 11" />,
  tilde: <path d="M5 13c1.8-2.6 3.6-2.6 5.4-1.3s3.6 1.3 5.4-1.3" />,
  rechts: <path d="m9 6 6 6-6 6" />,
  links: <path d="m15 6-6 6 6 6" />,
  pfeilRechts: <path d="M5 12h14M13 6l6 6-6 6" />,
  licht: (
    <>
      <path d="M9 18h6M10 21h4" />
      <path d="M12 3a6 6 0 0 0-3.6 10.8c.6.5 1 1.2 1.1 2h5c.1-.8.5-1.5 1.1-2A6 6 0 0 0 12 3Z" />
    </>
  ),
  karten: (
    <>
      <rect x="3" y="7" width="14" height="12" rx="2" />
      <path d="M7 4h11a3 3 0 0 1 3 3v9" />
    </>
  ),
  stift: (
    <>
      <path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16v4Z" />
      <path d="m13.5 6.5 4 4" />
    </>
  ),
  rechner: (
    <>
      <rect x="5" y="3" width="14" height="18" rx="2.5" />
      <path d="M8.5 7.5h7M9 12h.01M12 12h.01M15 12h.01M9 15.5h.01M12 15.5h.01M15 15.5h.01" />
    </>
  ),
  buch: (
    <>
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5v-15Z" />
      <path d="M4 20.5A2.5 2.5 0 0 0 6.5 23H20" transform="translate(0 -2)" />
    </>
  ),
  play: <path d="M8 5.5v13l10.5-6.5L8 5.5Z" />,
  pause: <path d="M8.5 5.5v13M15.5 5.5v13" />,
  zuruecksetzen: (
    <>
      <path d="M3.5 12a8.5 8.5 0 1 0 2.5-6" />
      <path d="M3.5 3.5V8H8" />
    </>
  ),
  download: <path d="M12 4v11M7 10.5 12 15.5l5-5M5 20h14" />,
  upload: <path d="M12 16V5M7 9.5 12 4.5l5 5M5 20h14" />,
  funke: <path d="M12 3.5 13.8 10.2 20.5 12l-6.7 1.8L12 20.5l-1.8-6.7L3.5 12l6.7-1.8L12 3.5Z" />,
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5.5M12 7.6v.01" />
    </>
  ),
  uhr: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  zufall: <path d="M3 7h3.5c4 0 7 10 11 10H21M3 17h3.5c1.6 0 3-1.6 4.3-3.7M14.2 9.7C15.3 8.2 16.5 7 18 7h3M18.5 4.5 21 7l-2.5 2.5M18.5 14.5 21 17l-2.5 2.5" />,
  ziel: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="12" cy="12" r="1" />
    </>
  ),
  mehr: <path d="M5 12h.01M12 12h.01M19 12h.01" />,
  auge: (
    <>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="2.8" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  hoch: <path d="m6 15 6-6 6 6" />,
  runter: <path d="m6 9 6 6 6-6" />,
  griff: <path d="M9 6h.01M15 6h.01M9 12h.01M15 12h.01M9 18h.01M15 18h.01" />,
  sonne: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4" />
    </>
  ),
  mond: <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z" />,
  kalender: (
    <>
      <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" />
      <path d="M3.5 10h17M8 3v4M16 3v4" />
    </>
  ),
  neu: (
    <>
      <path d="M12 3.5 13.8 10.2 20.5 12l-6.7 1.8L12 20.5l-1.8-6.7L3.5 12l6.7-1.8L12 3.5Z" />
    </>
  ),
  muell: <path d="M4.5 7h15M9.5 7V4.5h5V7M6.5 7l1 13h9l1-13" />,
};

export type IconName = keyof typeof P;

export function Icon({ name, size = 18, className, titel }: { name: string; size?: number; className?: string; titel?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden={titel ? undefined : true}
      role={titel ? 'img' : undefined}
    >
      {titel && <title>{titel}</title>}
      {P[name] ?? P.info}
    </svg>
  );
}
