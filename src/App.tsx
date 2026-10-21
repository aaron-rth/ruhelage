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

/** Zählt aktive Lernzeit (Tab sichtbar und in den letzten 90 s benutzt). */
function useLernzeit() {
  const addSekunden = useStore((s) => s.addSekunden);
  const letzte = useRef(Date.now());
  useEffect(() => {
    const aktiv = () => (letzte.current = Date.now());
    const ev = ['keydown', 'pointerdown', 'wheel', 'touchstart'] as const;
    ev.forEach((e) => window.addEventListener(e, aktiv, { passive: true }));
    const id = window.setInterval(() => {
      if (document.visibilityState === 'visible' && Date.now() - letzte.current < 90_000) addSekunden(15);
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

  return (
    <div className="app">
      <aside className="seitenleiste">
        <NavLink to="/" className="logo-link" aria-label="Ruhelage – Startseite">
          <Logo />
        </NavLink>
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

      <header className="mobil-kopf">
        <NavLink to="/" aria-label="Startseite" style={{ color: 'var(--text)' }}>
          <Logo klein />
        </NavLink>
        <button type="button" className="mobil-serie" onClick={() => zeigeStatistik(true)} aria-label={`${serie} Tage in Folge – Statistik öffnen`}>
          <Icon name="welle" size={15} /> <strong className="mono">{serie}</strong>
        </button>
      </header>

      <main className="haupt" id="inhalt">
        <Suspense fallback={<Lader />}>
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
