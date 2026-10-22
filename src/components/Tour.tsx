// Geführte Einführung durch die echte App: öffnet die jeweilige Seite, hebt den Bereich hervor
// und zeigt eine kompakte Karte. Nichts wird blockiert – die Seite bleibt sichtbar und bedienbar.
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { create } from 'zustand';
import { useIstHandy } from '../lib/geraet';
import { useStore } from '../store/store';
import { Md } from './Basis';
import { Icon } from './Icon';

export const EINFUEHRUNG = 'einfuehrung';

interface Schritt {
  pfad: string;
  /** CSS-Selektor des hervorgehobenen Bereichs (je Gerät), ohne = nur Karte */
  ziel?: { handy?: string; laptop?: string };
  titel: string;
  text: string;
}

const NAV = (bereich: string) => ({ handy: `.mobil-nav [data-tour="${bereich}"]`, laptop: `.nav-bereich[data-tour="${bereich}"]` });

const SCHRITTE: Schritt[] = [
  {
    pfad: '/',
    titel: 'Willkommen bei Ruhelage',
    text: 'Deine Lern-App für die Schule. Gerechnet und geschrieben wird im Heft – die App prüft, hilft in kleinen Schritten und merkt sich, was noch nicht sitzt. Ich zeig dir kurz, wo was ist.',
  },
  {
    pfad: '/',
    ziel: { handy: '[data-tour="runde"]', laptop: '[data-tour="runde"]' },
    titel: 'Deine Tagesrunde',
    text: 'Etwa 20 Minuten, gemischt aus fälligen Karteikarten und Aufgaben aus deinen schwächsten Themen. Wenn du nicht weißt, womit du anfangen sollst: hier.',
  },
  {
    pfad: '/',
    ziel: { handy: '[data-tour="gezielt"]', laptop: '[data-tour="gezielt"]' },
    titel: 'Gezielt üben',
    text: 'Karteikarten, Übungen oder Rechentrainer – gemischt oder für ein Thema. Dazu Probeklausur, Nochmal-Stapel und Spielwiese.',
  },
  {
    pfad: '/faecher',
    ziel: NAV('/faecher'),
    titel: 'Fächer',
    text: 'Hier wählst du dein Fach und siehst, was noch zu tun ist.',
  },
  {
    pfad: '/faecher',
    ziel: { handy: '[data-tour="kurs"]', laptop: '[data-tour="kurs"]' },
    titel: 'Lernpfad, Lernplan, Formeln',
    text: 'Der **Lernpfad** zeigt alle Themen, der **Lernplan** verteilt sie bis zur Klausur, die **Formelsammlung** hat alles zum Nachschlagen.',
  },
  {
    pfad: '/pfad',
    ziel: { handy: '.knoten .status-wahl', laptop: '.knoten .status-wahl' },
    titel: 'Schätz dich selbst ein',
    text: 'Bei jedem Thema: ✓ kann ich · ~ so halb · ✗ kann ich nicht. Danach richten sich Tagesrunde und Lernplan.',
  },
  {
    pfad: '/profil',
    ziel: NAV('/profil'),
    titel: 'Profil',
    text: 'Konto (optional, zum Synchronisieren), Statistik und Einstellungen. Diese Einführung findest du hier jederzeit wieder.',
  },
];

export const useTour = create<{ schritt: number | null }>()(() => ({ schritt: null }));

export function starteTour() {
  useTour.setState({ schritt: 0 });
}

interface Rahmen {
  top: number;
  left: number;
  width: number;
  height: number;
}

export function Tour() {
  const schritt = useTour((s) => s.schritt);
  const gesehen = useStore((s) => s.gesehen);
  const hinweisGesehen = useStore((s) => s.hinweisGesehen);
  const navigate = useNavigate();
  const handy = useIstHandy();
  const [rahmen, setRahmen] = useState<Rahmen | null>(null);
  /** Ziel gefunden und ruhig (Seite geladen, Scrollen fertig) – erst dann Rahmen und Karte zeigen */
  const [bereit, setBereit] = useState(false);
  const karte = useRef<HTMLDivElement>(null);
  const [kartePos, setKartePos] = useState<{ top?: number; bottom?: number; left: number; width: number } | null>(null);

  // beim allerersten Öffnen automatisch starten
  useEffect(() => {
    if (!gesehen.includes(EINFUEHRUNG) && useTour.getState().schritt === null) starteTour();
    // nur beim Start prüfen
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const s = schritt !== null ? SCHRITTE[schritt] : null;
  const selektor = s?.ziel ? (handy ? s.ziel.handy : s.ziel.laptop) : undefined;

  function beenden() {
    hinweisGesehen(EINFUEHRUNG);
    hinweisGesehen('lernpfad-einschaetzen');
    useTour.setState({ schritt: null });
    setRahmen(null);
    setBereit(false);
  }
  function gehe(i: number) {
    if (i < 0) return;
    if (i >= SCHRITTE.length) {
      beenden();
      navigate('/');
      return;
    }
    useTour.setState({ schritt: i });
  }

  // Seite öffnen und Ziel suchen (Seiten laden teils verzögert)
  useEffect(() => {
    if (!s) return;
    navigate(s.pfad);
    setRahmen(null);
    setBereit(!selektor);
    if (!selektor) return;
    let versuche = 0;
    let stop = false;
    const suche = () => {
      if (stop) return;
      const el = document.querySelector<HTMLElement>(selektor);
      if (el) {
        const r = el.getBoundingClientRect();
        // sofort springen statt sanft scrollen – sonst läuft der Rahmen hinterher
        if (r.top < 70 || r.bottom > window.innerHeight - 90) el.scrollIntoView({ block: 'center', behavior: 'auto' });
        return;
      }
      if (versuche++ < 60) requestAnimationFrame(suche);
    };
    const t = window.setTimeout(suche, 60);
    // Ziel fehlt oder kommt nicht zur Ruhe: Karte trotzdem zeigen
    const notfall = window.setTimeout(() => setBereit(true), 1500);
    return () => {
      stop = true;
      window.clearTimeout(t);
      window.clearTimeout(notfall);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schritt, handy]);

  // Rahmen mitführen (Scrollen, Größe). Erst zeigen, wenn das Ziel ein paar Frames ruhig steht.
  useEffect(() => {
    if (!s) return;
    let id = 0;
    let ruhig = 0;
    let letzte: Rahmen | null = null;
    const gleich = (a: Rahmen | null, b: Rahmen) => !!a && Math.abs(a.top - b.top) < 0.5 && Math.abs(a.left - b.left) < 0.5 && Math.abs(a.width - b.width) < 0.5 && Math.abs(a.height - b.height) < 0.5;
    const tick = () => {
      const el = selektor ? document.querySelector<HTMLElement>(selektor) : null;
      const r = el?.getBoundingClientRect();
      if (r && r.width > 0 && r.height > 0) {
        const neu = { top: r.top, left: r.left, width: r.width, height: r.height };
        ruhig = gleich(letzte, neu) ? ruhig + 1 : 0;
        letzte = neu;
        setRahmen((alt) => (gleich(alt, neu) ? alt : neu));
        if (ruhig >= 6) setBereit(true);
      } else {
        ruhig = 0;
        letzte = null;
      }
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [s, selektor]);

  // Karte platzieren: Handy oben oder unten (wo das Ziel nicht ist), Laptop neben dem Ziel
  useLayoutEffect(() => {
    if (!s) return;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const kh = karte.current?.offsetHeight ?? 160;
    if (handy) {
      const breite = vw - 24;
      const zielOben = rahmen ? rahmen.top + rahmen.height / 2 < vh * 0.45 : false;
      setKartePos(zielOben ? { bottom: 84, left: 12, width: breite } : { top: 12, left: 12, width: breite });
      return;
    }
    const breite = 360;
    if (!rahmen) {
      setKartePos({ top: Math.max(24, vh * 0.18), left: Math.max(24, (vw - breite) / 2 + 120), width: breite });
      return;
    }
    let top = rahmen.top + rahmen.height + 14;
    if (top + kh > vh - 16) top = rahmen.top - kh - 14;
    if (top < 16) top = Math.min(vh - kh - 16, Math.max(16, rahmen.top));
    let left = rahmen.left;
    // schmale Ziele (Seitenleiste): Karte rechts daneben
    if (rahmen.width < 260 && rahmen.left < 300) {
      left = rahmen.left + rahmen.width + 16;
      top = Math.min(vh - kh - 16, Math.max(16, rahmen.top - 10));
    }
    left = Math.min(Math.max(16, left), vw - breite - 16);
    setKartePos({ top, left, width: breite });
  }, [s, rahmen, handy, bereit]);

  // Tastatur: Esc beendet, Pfeile blättern
  useEffect(() => {
    if (schritt === null) return;
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (e.key === 'Escape') beenden();
      if (e.key === 'ArrowRight') gehe(schritt + 1);
      if (e.key === 'ArrowLeft') gehe(schritt - 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  if (!s || schritt === null) return null;
  const letzter = schritt === SCHRITTE.length - 1;

  return createPortal(
    <>
      {rahmen && bereit && (
        <div
          key={`rahmen-${schritt}`}
          className="tour-rahmen"
          aria-hidden
          style={{ top: rahmen.top - 6, left: rahmen.left - 6, width: rahmen.width + 12, height: rahmen.height + 12 }}
        />
      )}
      {bereit && (
      <div
        ref={karte}
        key={`karte-${schritt}`}
        className={`tour-karte${handy ? ' handy' : ''}`}
        role="dialog"
        aria-live="polite"
        aria-label={`Einführung: ${s.titel}`}
        style={kartePos ? { top: kartePos.top, bottom: kartePos.bottom, left: kartePos.left, width: kartePos.width } : { visibility: 'hidden' }}
      >
        <div className="tour-kopf">
          <span className="ueber-klein">
            Einführung · {schritt + 1}/{SCHRITTE.length}
          </span>
          <button type="button" className="btn geist klein symbol-knopf" onClick={beenden} aria-label="Einführung beenden">
            <Icon name="x" size={18} />
          </button>
        </div>
        <strong className="tour-titel">{s.titel}</strong>
        <Md text={s.text} className="prosa tour-text" />
        <div className="tour-fuss">
          <div className="tour-punkte" aria-hidden>
            {SCHRITTE.map((_, j) => (
              <span key={j} className={j === schritt ? 'an' : ''} />
            ))}
          </div>
          <div className="zeile" style={{ gap: 6 }}>
            {schritt > 0 ? (
              <button type="button" className="btn geist klein" onClick={() => gehe(schritt - 1)}>
                Zurück
              </button>
            ) : (
              <button type="button" className="btn geist klein" onClick={beenden}>
                Überspringen
              </button>
            )}
            <button type="button" className="btn primaer klein" onClick={() => gehe(schritt + 1)} autoFocus>
              {letzter ? 'Fertig' : 'Weiter'} <Icon name="rechts" size={16} />
            </button>
          </div>
        </div>
      </div>
      )}
    </>,
    document.body,
  );
}
