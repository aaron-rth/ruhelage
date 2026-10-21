// Gerät erkennen: Handy-Layout (schmal) und Touch-Bedienung.
import { useEffect, useState } from 'react';

const HANDY = '(max-width: 860px)';

function passt(q: string): boolean {
  return typeof window !== 'undefined' && typeof window.matchMedia === 'function' && window.matchMedia(q).matches;
}

export function useMedia(q: string): boolean {
  const [ja, setJa] = useState(() => passt(q));
  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return;
    const m = window.matchMedia(q);
    const f = () => setJa(m.matches);
    f();
    m.addEventListener('change', f);
    return () => m.removeEventListener('change', f);
  }, [q]);
  return ja;
}

export const useIstHandy = () => useMedia(HANDY);

/** Richtung einer Wischbewegung (oder null, wenn sie zu kurz war). */
export function wischRichtung(dx: number, dy: number, schwelle = 80): 'rechts' | 'links' | 'oben' | 'unten' | null {
  const ax = Math.abs(dx);
  const ay = Math.abs(dy);
  if (Math.max(ax, ay) < schwelle) return null;
  if (ax >= ay) return dx > 0 ? 'rechts' : 'links';
  return dy < 0 ? 'oben' : 'unten';
}
