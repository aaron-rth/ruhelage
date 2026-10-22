// Dezente Rückmeldung: kurze, leise Töne (Web Audio, ohne Audiodateien) und sanfte Vibration.
// Alles optional – fehlt die Unterstützung, passiert einfach nichts.
import { useStore } from '../store/store';

export type Rueckmeldung = 'klick' | 'richtig' | 'falsch';

let ctx: AudioContext | null = null;

function audio(): AudioContext | null {
  try {
    const C = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!C) return null;
    ctx ??= new C();
    // Browser erlauben Ton erst nach einer Berührung/einem Klick – unsere Töne kommen immer nach einer
    if (ctx.state === 'suspended') void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

function hueller(a: AudioContext, start: number, dauer: number, lautst: number): GainNode {
  const g = a.createGain();
  g.gain.setValueAtTime(0.0001, start);
  g.gain.exponentialRampToValueAtTime(lautst, start + 0.008);
  g.gain.exponentialRampToValueAtTime(0.0001, start + dauer);
  g.connect(a.destination);
  return g;
}

function holzKlick(a: AudioContext) {
  const t = a.currentTime;
  // kurzes, gefiltertes Rauschen = „Holz“-Anschlag
  const n = Math.floor(a.sampleRate * 0.05);
  const puffer = a.createBuffer(1, n, a.sampleRate);
  const d = puffer.getChannelData(0);
  for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n) ** 3;
  const quelle = a.createBufferSource();
  quelle.buffer = puffer;
  const filter = a.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = 1400;
  filter.Q.value = 3;
  quelle.connect(filter).connect(hueller(a, t, 0.06, 0.12));
  quelle.start(t);
  // tiefer Körper
  const o = a.createOscillator();
  o.type = 'sine';
  o.frequency.setValueAtTime(320, t);
  o.frequency.exponentialRampToValueAtTime(180, t + 0.05);
  o.connect(hueller(a, t, 0.07, 0.05));
  o.start(t);
  o.stop(t + 0.08);
}

function ton(a: AudioContext, freq: number, start: number, dauer: number, lautst: number, typ: OscillatorType = 'sine', bis?: number) {
  const o = a.createOscillator();
  o.type = typ;
  o.frequency.setValueAtTime(freq, start);
  if (bis) o.frequency.exponentialRampToValueAtTime(bis, start + dauer);
  o.connect(hueller(a, start, dauer, lautst));
  o.start(start);
  o.stop(start + dauer + 0.02);
}

const VIBRATION: Record<Rueckmeldung, number | number[]> = { klick: 6, richtig: 14, falsch: [10, 60, 10] };

export function vibrationMoeglich(): boolean {
  return typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function';
}

export function rueckmeldung(art: Rueckmeldung) {
  const e = useStore.getState().einstellungen;
  if (e.ton) {
    const a = audio();
    if (a) {
      try {
        const t = a.currentTime;
        if (art === 'klick') holzKlick(a);
        // zwei weiche Töne aufwärts
        if (art === 'richtig') {
          ton(a, 659, t, 0.16, 0.05, 'triangle');
          ton(a, 988, t + 0.09, 0.22, 0.045, 'triangle');
        }
        // ein ruhiger, tiefer Ton – kein „Fehler-Buzzer“
        if (art === 'falsch') ton(a, 247, t, 0.22, 0.04, 'sine', 220);
      } catch {
        /* Ton ist nur Zugabe */
      }
    }
  }
  if (e.haptik && vibrationMoeglich()) {
    try {
      navigator.vibrate(VIBRATION[art]);
    } catch {
      /* ignorieren */
    }
  }
}
