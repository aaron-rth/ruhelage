import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { HashRouter, Link, NavLink, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { Lader, Logo } from './components/Basis';
import { Einfuehrung, EINFUEHRUNG } from './components/Einfuehrung';
import { Icon } from './components/Icon';
import { Statistik } from './components/Statistik';
import { kontoStarten, syncPlanen, syncSofort } from './lib/cloud';
import { heute, tageZwischen } from './lib/datum';
import { Aktuell, useOffeneEintraege } from './pages/Aktuell';
import { Einstellungen } from './pages/Einstellungen';
import { Faecher } from './pages/Faecher';
import { Profil } from './pages/Profil';
import { Formeln } from './pages/Formeln';
import { Heute } from './pages/Heute';
import { Lernpfad } from './pages/Lernpfad';
import { Nochmal } from './pages/Nochmal';
import { ThemaSeite } from './pages/Thema';
import { AKTIVER_KURS } from './content/kurse';
import { streak, useStore } from './store/store';
import { useUi } from './store/ui';

// selten gebrauchte, größere Seiten erst bei Bedarf laden
const Spielwiese = lazy(() => import('./pages/Spielwiese').then((m) => ({ default: m.Spielwiese })));
const Klausur = lazy(() => import('./pages/Klausur').then((m) => ({ default: m.Klausur })));

/** Drei Bereiche – am Handy unten als Tabs, am Laptop in der Seitenleiste mit Unterpunkten. */
type Bereich = 'faecher' | 'lernen' | 'profil';
interface Unterpunkt {
  to: string;
  label: string;
  icon: string;
  /** aktiv, wenn der Pfad (inkl. Suche) so beginnt */
  passt: (pfad: string, suche: string) => boolean;
}
const BEREICHE: { id: Bereich; to: string; label: string; icon: string; unter: Unterpunkt[] }[] = [
  {
    id: 'lernen',
    to: '/',
    label: 'Lernen',
    icon: 'play',
    unter: [
      { to: '/', label: 'Heute', icon: 'heute', passt: (p) => p === '/' },
      { to: '/aktuell', label: 'Angefangen', icon: 'pause', passt: (p) => p === '/aktuell' },
      { to: '/nochmal', label: 'Nochmal', icon: 'nochmal', passt: (p) => p === '/nochmal' },
      { to: '/klausur', label: 'Probeklausur', icon: 'klausur', passt: (p) => p === '/klausur' },
      { to: '/spielwiese', label: 'Spielwiese', icon: 'welle', passt: (p) => p === '/spielwiese' },
    ],
  },
  {
    id: 'faecher',
    to: '/faecher',
    label: 'Fächer',
    icon: 'buch',
    unter: [
      { to: '/faecher', label: 'Übersicht', icon: 'buch', passt: (p) => p === '/faecher' },
      { to: '/pfad', label: 'Lernpfad', icon: 'pfad', passt: (p, q) => (p === '/pfad' && !q.includes('plan')) || p.startsWith('/thema') },
      { to: '/pfad?ansicht=plan', label: 'Lernplan', icon: 'kalender', passt: (p, q) => p === '/pfad' && q.includes('plan') },
      { to: '/formeln', label: 'Formelsammlung', icon: 'formel', passt: (p) => p === '/formeln' },
    ],
  },
  {
    id: 'profil',
    to: '/profil',
    label: 'Profil',
    icon: 'ziel',
    unter: [
      { to: '/profil', label: 'Statistik', icon: 'ziel', passt: (p) => p === '/profil' },
      { to: '/einstellungen', label: 'Einstellungen', icon: 'einstellungen', passt: (p) => p === '/einstellungen' },
    ],
  },
];

function bereichVon(pfad: string, suche: string): Bereich {
  for (const b of BEREICHE) if (b.unter.some((u) => u.passt(pfad, suche))) return b.id;
  return 'lernen';
}

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
    const farbe = theme === 'light' ? '#f4f6f8' : '#0E131A';
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.backgroundColor = farbe;
    // Meta-Tag ersetzen statt ändern – manche Browser übernehmen sonst die neue Farbe nicht zuverlässig
    document.querySelectorAll('meta[name="theme-color"]').forEach((m) => m.remove());
    const meta = document.createElement('meta');
    meta.name = 'theme-color';
    meta.content = farbe;
    document.head.appendChild(meta);
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
  return (
    <Link to="/profil" className="seitenleiste-fuss" title="Statistik öffnen">
      {e.countdown && rest >= 0 && (
        <div className="zeile" style={{ gap: 8 }}>
          <Icon name="kalender" size={16} />
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
        <Icon name="welle" size={16} />
        <span>
          <strong>{s}</strong> {s === 1 ? 'Tag' : 'Tage'} in Folge
        </span>
      </div>
    </Link>
  );
}

/** Klick auf freie Fläche neben dem Inhalt (keine Knöpfe, Karten, Texte) */
function istHintergrund(el: HTMLElement | null): boolean {
  return !!el && (el.classList.contains('haupt') || el.classList.contains('inhalt') || el.classList.contains('seiten-wechsel') || el.classList.contains('kopf'));
}

/** Optionales Konto: beim Start anmelden, nach Änderungen und beim Verlassen synchronisieren. */
function useCloud() {
  useEffect(() => {
    void kontoStarten();
    const ab = useStore.subscribe(() => syncPlanen());
    const sichtbar = () => syncSofort();
    document.addEventListener('visibilitychange', sichtbar);
    return () => {
      ab();
      document.removeEventListener('visibilitychange', sichtbar);
    };
  }, []);
}

function Rahmen() {
  useLernzeit();
  useCloud();
  useTheme();
  const nochmal = useStore((s) => s.nochmal.length);
  const offen = useOffeneEintraege().filter((e) => e.art !== 'lesen').length;
  const einfuehrung = useStore((s) => s.einstellungen.hinweise && !s.gesehen.includes(EINFUEHRUNG));
  const statistik = useUi((u) => u.statistik);
  const serie = useStore((s) => streak(s.tage, heute()));
  const { pathname, search } = useLocation();
  const navigate = useNavigate();
  const kopfWeg = useKopfEinklappen();
  const [fokus, setFokus] = useFokus();
  const bereich = bereichVon(pathname, search);
  const zahl = (to: string) => (to === '/nochmal' ? nochmal : to === '/aktuell' ? offen : 0);

  return (
    <div className={`app${fokus ? ' fokus' : ''}`}>
      <aside className="seitenleiste" aria-hidden={fokus}>
        <div className="seitenleiste-kopf">
          <NavLink to="/" className="logo-link" aria-label="Ruhelage – Startseite" tabIndex={fokus ? -1 : 0}>
            <Logo />
          </NavLink>
          <button type="button" className="btn geist symbol-knopf" onClick={() => setFokus(true)} title="Seitenleiste ausblenden (F)" aria-label="Seitenleiste ausblenden" tabIndex={fokus ? -1 : 0}>
            <Icon name="seitenleiste" size={22} />
          </button>
        </div>
        <div className="fach-wahl">
          <Link to="/faecher" className="fach-zeile an" tabIndex={fokus ? -1 : 0}>
            <Icon name="welle" size={18} />
            <span>
              <strong>Physik</strong>
              <span className="sehr-leise klein">{AKTIVER_KURS.titel}</span>
            </span>
          </Link>
          <div className="fach-zeile bald" aria-disabled="true">
            <Icon name="plus" size={18} />
            <span>
              <span className="klein">Weitere Fächer</span>
              <span className="klein sehr-leise">Kommt bald</span>
            </span>
          </div>
        </div>
        <nav className="nav" aria-label="Hauptnavigation">
          {BEREICHE.map((b) => (
            <div key={b.id} className={`nav-gruppe${bereich === b.id ? ' aktiv' : ''}`}>
              <Link to={b.to} className="nav-bereich" data-tour={b.to} tabIndex={fokus ? -1 : 0}>
                {b.label}
              </Link>
              {b.unter.map((u) => {
                const aktiv = u.passt(pathname, search);
                const n = zahl(u.to);
                return (
                  <Link key={u.to} to={u.to} className={aktiv ? 'aktiv' : undefined} aria-current={aktiv ? 'page' : undefined} tabIndex={fokus ? -1 : 0}>
                    <Icon name={u.icon} size={19} />
                    {u.label}
                    {n > 0 && <span className={`badge${u.to === '/aktuell' ? ' akzent' : ''}`}>{n}</span>}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
        <SeitenleisteFuss />
      </aside>

      {fokus && <FokusLeiste onAus={() => setFokus(false)} />}

      <header className={`mobil-kopf${kopfWeg ? ' weg' : ''}`}>
        <NavLink to="/" aria-label="Startseite" style={{ color: 'var(--text)' }}>
          <Logo klein />
        </NavLink>
        <span className="mobil-fach">Physik</span>
        <button type="button" className="mobil-serie" onClick={() => navigate('/profil')} aria-label={`${serie} Tage in Folge – Statistik öffnen`}>
          <Icon name="welle" size={16} /> <strong className="mono">{serie}</strong>
        </button>
      </header>

      <main
        className="haupt"
        id="inhalt"
        onClick={(e) => {
          // Laptop: Klick auf freien Hintergrund blendet die Seitenleiste aus
          if (!fokus && window.innerWidth > 860 && istHintergrund(e.target as HTMLElement)) setFokus(true);
        }}
      >
        <Suspense fallback={<Lader />}>
          <div className="seiten-wechsel" key={pathname}>
            <Routes>
              <Route path="/" element={<Heute />} />
              <Route path="/aktuell" element={<Aktuell />} />
              <Route path="/faecher" element={<Faecher />} />
              <Route path="/pfad" element={<Lernpfad />} />
              <Route path="/thema/:id" element={<ThemaSeite />} />
              <Route path="/thema/:id/:tab" element={<ThemaSeite />} />
              <Route path="/spielwiese" element={<Spielwiese />} />
              <Route path="/nochmal" element={<Nochmal />} />
              <Route path="/klausur" element={<Klausur />} />
              <Route path="/formeln" element={<Formeln />} />
              <Route path="/profil" element={<Profil />} />
              <Route path="/einstellungen" element={<Einstellungen />} />
              <Route path="*" element={<Heute />} />
            </Routes>
          </div>
        </Suspense>
      </main>

      <nav className="mobil-nav" aria-label="Navigation">
        {[BEREICHE[1], BEREICHE[0], BEREICHE[2]].map((b) => (
          <Link key={b.id} to={b.to} data-tour={b.to} className={`${bereich === b.id ? 'aktiv' : ''}${b.id === 'lernen' ? ' mitte' : ''}`} aria-current={bereich === b.id ? 'page' : undefined}>
            <span className="tab-icon">
              <Icon name={b.icon} size={23} />
              {b.id === 'lernen' && offen + nochmal > 0 && <span className="tab-punkt" aria-label="Es gibt Angefangenes oder Nochmal-Einträge" />}
            </span>
            {b.label}
          </Link>
        ))}
      </nav>
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
