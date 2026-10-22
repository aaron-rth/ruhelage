// Dezente Rückmeldung: kurze, leise Töne (Web Audio, ohne Audiodateien) und sanfte Vibration.
// Alles optional – fehlt die Unterstützung, passiert einfach nichts.
import { useStore, type TonBereiche } from '../store/store';

/** gewusst/halb/nicht: Karteikarten-Bewertung – jede klingt anders, damit man Fehlgriffe hört */
export type Rueckmeldung = 'klick' | 'richtig' | 'falsch' | 'gewusst' | 'halb' | 'nicht' | 'blatt';

interface AudioSession {
  type: string;
}

/**
 * iPhone: Web-Audio ist im Stummmodus normalerweise still. Mit der Audio-Session „playback“
 * (Safari ab iOS 17) klingen die Töne trotzdem – kann aber Musik im Hintergrund unterbrechen.
 */
export function stummmodusSteuerbar(): boolean {
  return typeof navigator !== 'undefined' && 'audioSession' in navigator;
}

function setzeSession(trotzStumm: boolean) {
  try {
    const s = (navigator as unknown as { audioSession?: AudioSession }).audioSession;
    if (s) s.type = trotzStumm ? 'playback' : 'auto';
  } catch {
    /* nicht unterstützt */
  }
}

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

function hueller(a: AudioContext, start: number, dauer: number, lautst: number, anschlag = 0.008): GainNode {
  const g = a.createGain();
  g.gain.setValueAtTime(0.0001, start);
  g.gain.exponentialRampToValueAtTime(lautst, start + anschlag);
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

/** Umblättern: kurzes Rauschen, dessen Klangfarbe nach oben streicht (wie Papier) */
function blatt(a: AudioContext) {
  const t = a.currentTime;
  const dauer = 0.13;
  const n = Math.floor(a.sampleRate * dauer);
  const puffer = a.createBuffer(1, n, a.sampleRate);
  const d = puffer.getChannelData(0);
  for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.sin((Math.PI * i) / n);
  const quelle = a.createBufferSource();
  quelle.buffer = puffer;
  const filter = a.createBiquadFilter();
  filter.type = 'bandpass';
  filter.Q.value = 1.2;
  filter.frequency.setValueAtTime(900, t);
  filter.frequency.exponentialRampToValueAtTime(4200, t + dauer);
  quelle.connect(filter).connect(hueller(a, t, dauer, 0.09));
  quelle.start(t);
}

/** weicher, glockiger Ton (Sinus mit leiser Oktave, langsamer Anschlag, langes Ausklingen) */
function sanft(a: AudioContext, freq: number, start: number, lautst = 0.03) {
  for (const [f, l] of [
    [freq, lautst],
    [freq * 2, lautst * 0.18],
  ] as const) {
    const o = a.createOscillator();
    o.type = 'sine';
    o.frequency.setValueAtTime(f, start);
    o.connect(hueller(a, start, 0.45, l, 0.025));
    o.start(start);
    o.stop(start + 0.5);
  }
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

const VIBRATION: Record<Rueckmeldung, number | number[]> = { klick: 6, richtig: 14, falsch: [10, 60, 10], gewusst: 14, halb: [8, 50, 8], nicht: [10, 60, 10], blatt: 4 };

export function vibrationMoeglich(): boolean {
  return typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function';
}

/** Zu welcher Einstellung „Töne bei …“ ein Klang gehört */
const BEREICH: Record<Rueckmeldung, keyof TonBereiche> = {
  klick: 'knoepfe',
  richtig: 'antworten',
  falsch: 'antworten',
  gewusst: 'karten',
  halb: 'karten',
  nicht: 'karten',
  blatt: 'karten',
};

let zuletzt = 0;

/** Holzklick für jeden Knopf und Link (ohne Vibration) – außer es kam gerade schon ein eigener Ton. */
export function knopfKlick() {
  if (performance.now() - zuletzt < 80) return;
  rueckmeldung('klick', false);
}

export function rueckmeldung(art: Rueckmeldung, vibrieren = true) {
  const e = useStore.getState().einstellungen;
  zuletzt = performance.now();
  if (e.ton && (e.tonBereiche?.[BEREICH[art]] ?? true)) {
    setzeSession(e.tonTrotzStumm);
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
        if (art === 'blatt') blatt(a);
        // Karteikarten, ruhig und weich: aufwärts / ein einzelner Ton / abwärts
        if (art === 'gewusst') {
          sanft(a, 659, t);
          sanft(a, 880, t + 0.11, 0.026);
        }
        if (art === 'halb') sanft(a, 587, t, 0.028);
        if (art === 'nicht') {
          sanft(a, 523, t, 0.026);
          sanft(a, 440, t + 0.13, 0.022);
        }
      } catch {
        /* Ton ist nur Zugabe */
      }
    }
  }
  if (vibrieren && e.haptik && vibrationMoeglich()) {
    try {
      navigator.vibrate(VIBRATION[art]);
    } catch {
      /* ignorieren */
    }
  }
}
