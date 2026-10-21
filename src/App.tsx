import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { HashRouter, NavLink, Route, Routes, useLocation } from 'react-router-dom';
import { Lader, Logo } from './components/Basis';
import { Einfuehrung, EINFUEHRUNG } from './components/Einfuehrung';
import { Icon } from './components/Icon';
import { Statistik } from './components/Statistik';
import { heute, tageZwischen } from './lib/datum';
import { Aktuell, useOffeneEintraege } from './pages/Aktuell';
import { Einstellungen } from './pages/Einstellungen';
import { Formeln } from './pages/Formeln';
import { Heute } from './pages/Heute';
import { Lernpfad } from './pages/Lernpfad';
import { Nochmal } from './pages/Nochmal';
import { ThemaSeite } from './pages/Thema';
import { streak, useStore } from './store/store';
import { useUi } from './store/ui';

// selten gebrauchte, größere Seiten erst bei Bedarf laden
const Spielwiese = lazy(() => import('./pages/Spielwiese').then((m) => ({ default: m.Spielwiese })));
const Klausur = lazy(() => import('./pages/Klausur').then((m) => ({ default: m.Klausur })));

const NAV = [
  { to: '/', label: 'Heute', icon: 'heute', ende: true },
  { to: '/aktuell', label: 'Aktuell', icon: 'play' },
  { to: '/pfad', label: 'Lernpfad', icon: 'pfad' },
  { to: '/nochmal', label: 'Nochmal', icon: 'nochmal' },
  { to: '/spielwiese', label: 'Spielwiese', icon: 'welle' },
  { to: '/klausur', label: 'Klausurmodus', icon: 'klausur' },
  { to: '/formeln', label: 'Formelsammlung', icon: 'formel' },
  { to: '/einstellungen', label: 'Einstellungen', icon: 'einstellungen' },
];

/** Zählt Lernzeit nur, während Karten, Übungen, Aufgaben oder eine Klausur offen sind
 *  (Tab sichtbar und in den letzten 90 s benutzt). */
function useLernzeit() {
  const addSekunden = useStore((s) => s.addSekunden);
  const letzte = useRef(Date.now());
  useEffect(() => {
    const aktiv = () => (letzte.current = Date.now());
    const ev = ['keydown', 'pointerdown', 'wheel', 'touchstart'] as const;
    ev.forEach((e) => window.addEventListener(e, aktiv, { passive: true }));
    const id = window.setInterval(() => {
      if (useUi.getState().lernen > 0 && document.visibilityState === 'visible' && Date.now() - letzte.current < 90_000) addSekunden(15);
    }, 15_000);
    return () => {
      ev.forEach((e) => window.removeEventListener(e, aktiv));
      window.clearInterval(id);
    };
  }, [addSekunden]);
}

function useTheme() {
  const theme = useStore((s) => s.einstellungen.theme);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'light' ? '#f4f6f8' : '#0E131A');
  }, [theme]);
}

/** Handy: Kopfleiste beim Runterscrollen einklappen, beim Hochscrollen wieder zeigen. */
function useKopfEinklappen(): boolean {
  const [weg, setWeg] = useState(false);
  useEffect(() => {
    let letzteY = window.scrollY;
    function onScroll() {
      const y = window.scrollY;
      if (Math.abs(y - letzteY) < 6) return;
      setWeg(y > 64 && y > letzteY);
      letzteY = y;
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return weg;
}

/** Laptop: Fokusmodus (Seitenleiste aus) mit Taste F, dazu echtes Vollbild auf Wunsch. */
function useFokus(): [boolean, (b: boolean) => void] {
  const fokus = useStore((s) => s.einstellungen.fokus);
  const setze = useStore((s) => s.setzeEinstellung);
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement)?.tagName;
      if ((e.key === 'f' || e.key === 'F') && !e.ctrlKey && !e.metaKey && !e.altKey && tag !== 'INPUT' && tag !== 'TEXTAREA' && tag !== 'SELECT') {
        setze('fokus', !useStore.getState().einstellungen.fokus);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [setze]);
  return [fokus, (b) => setze('fokus', b)];
}

function FokusLeiste({ onAus }: { onAus: () => void }) {
  const [voll, setVoll] = useState(!!document.fullscreenElement);
  useEffect(() => {
    const f = () => setVoll(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', f);
    return () => document.removeEventListener('fullscreenchange', f);
  }, []);
  return (
    <div className="fokus-leiste">
      <button type="button" className="btn geist klein" onClick={onAus} title="Seitenleiste zeigen (F)">
        <Icon name="seitenleiste" size={16} /> Menü
      </button>
      {document.fullscreenEnabled && (
        <button
          type="button"
          className="btn geist klein"
          onClick={() => (voll ? document.exitFullscreen() : document.documentElement.requestFullscreen()).catch(() => undefined)}
          title={voll ? 'Vollbild beenden' : 'Vollbild'}
          aria-label={voll ? 'Vollbild beenden' : 'Vollbild'}
        >
          <Icon name={voll ? 'vollbildAus' : 'vollbild'} size={16} />
        </button>
      )}
    </div>
  );
}

function NachOben() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function SeitenleisteFuss() {
  const tage = useStore((s) => s.tage);
  const e = useStore((s) => s.einstellungen);
  const h = heute();
  const s = streak(tage, h);
  const rest = tageZwischen(h, e.klausurDatum);
  const zeige = useUi((u) => u.zeigeStatistik);
  return (
    <button type="button" className="seitenleiste-fuss" onClick={() => zeige(true)} title="Statistik öffnen">
      {e.countdown && rest >= 0 && (
        <div className="zeile" style={{ gap: 8 }}>
          <Icon name="kalender" size={15} />
          <span>
            {rest === 0 ? (
              <strong>Heute ist Klausur</strong>
            ) : (
              <>
                noch <strong>{rest}</strong> {rest === 1 ? 'Tag' : 'Tage'} bis zur Klausur
              </>
            )}
          </span>
        </div>
      )}
      <div className="zeile" style={{ gap: 8 }}>
        <Icon name="welle" size={15} />
        <span>
          <strong>{s}</strong> {s === 1 ? 'Tag' : 'Tage'} in Folge
        </span>
      </div>
      <span className="fuss-link">
        <Icon name="ziel" size={14} /> Statistik ansehen
      </span>
    </button>
  );
}

function Rahmen() {
  useLernzeit();
  useTheme();
  const nochmal = useStore((s) => s.nochmal.length);
  const offen = useOffeneEintraege().filter((e) => e.art !== 'lesen').length;
  const einfuehrung = useStore((s) => s.einstellungen.hinweise && !s.gesehen.includes(EINFUEHRUNG));
  const statistik = useUi((u) => u.statistik);
  const zeigeStatistik = useUi((u) => u.zeigeStatistik);
  const serie = useStore((s) => streak(s.tage, heute()));
  const [mehr, setMehr] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => setMehr(false), [pathname]);
  const kopfWeg = useKopfEinklappen();
  const [fokus, setFokus] = useFokus();

  return (
    <div className={`app${fokus ? ' fokus' : ''}`}>
      <aside className="seitenleiste">
        <div className="seitenleiste-kopf">
          <NavLink to="/" className="logo-link" aria-label="Ruhelage – Startseite">
            <Logo />
          </NavLink>
          <button type="button" className="btn geist klein symbol-knopf" onClick={() => setFokus(true)} title="Seitenleiste ausblenden (F)" aria-label="Seitenleiste ausblenden">
            <Icon name="seitenleiste" size={21} />
          </button>
        </div>
        <nav className="nav" aria-label="Hauptnavigation">
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.ende} data-tour={n.to} className={({ isActive }) => (isActive ? 'aktiv' : undefined)}>
              <Icon name={n.icon} />
              {n.label}
              {n.to === '/nochmal' && nochmal > 0 && <span className="badge">{nochmal}</span>}
              {n.to === '/aktuell' && offen > 0 && <span className="badge akzent">{offen}</span>}
            </NavLink>
          ))}
        </nav>
        <SeitenleisteFuss />
      </aside>

      {fokus && <FokusLeiste onAus={() => setFokus(false)} />}

      <header className={`mobil-kopf${kopfWeg && !mehr ? ' weg' : ''}`}>
        <NavLink to="/" aria-label="Startseite" style={{ color: 'var(--text)' }}>
          <Logo klein />
        </NavLink>
        <button type="button" className="mobil-serie" onClick={() => zeigeStatistik(true)} aria-label={`${serie} Tage in Folge – Statistik öffnen`}>
          <Icon name="welle" size={15} /> <strong className="mono">{serie}</strong>
        </button>
      </header>

      <main className="haupt" id="inhalt">
        <Suspense fallback={<Lader />}>
          <div className="seiten-wechsel" key={pathname}>
          <Routes>
            <Route path="/" element={<Heute />} />
            <Route path="/aktuell" element={<Aktuell />} />
            <Route path="/pfad" element={<Lernpfad />} />
            <Route path="/thema/:id" element={<ThemaSeite />} />
            <Route path="/thema/:id/:tab" element={<ThemaSeite />} />
            <Route path="/spielwiese" element={<Spielwiese />} />
            <Route path="/nochmal" element={<Nochmal />} />
            <Route path="/klausur" element={<Klausur />} />
            <Route path="/formeln" element={<Formeln />} />
            <Route path="/einstellungen" element={<Einstellungen />} />
            <Route path="*" element={<Heute />} />
          </Routes>
          </div>
        </Suspense>
      </main>

      <nav className="mobil-nav" aria-label="Navigation">
        {NAV.slice(0, 4).map((n) => (
          <NavLink key={n.to} to={n.to} end={n.ende} data-tour={n.to} className={({ isActive }) => (isActive ? 'aktiv' : undefined)}>
            <Icon name={n.icon} size={20} />
            {n.label}
            {n.to === '/nochmal' && nochmal > 0 && <span className="badge akzent">{nochmal}</span>}
            {n.to === '/aktuell' && offen > 0 && <span className="badge akzent">{offen}</span>}
          </NavLink>
        ))}
        <button type="button" onClick={() => setMehr((m) => !m)} aria-expanded={mehr} data-tour="mehr">
          <Icon name="mehr" size={20} />
          Mehr
        </button>
      </nav>
      {mehr && (
        <div className="mehr-menue einblenden">
          {NAV.slice(4).map((n) => (
            <NavLink key={n.to} to={n.to} data-tour={n.to}>
              <Icon name={n.icon} />
              {n.label}
            </NavLink>
          ))}
        </div>
      )}
      {einfuehrung && <Einfuehrung />}
      {statistik && <Statistik />}
    </div>
  );
}

export function App() {
  return (
    <HashRouter>
      <NachOben />
      <Rahmen />
    </HashRouter>
  );
}
