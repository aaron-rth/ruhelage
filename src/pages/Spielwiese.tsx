// Spielwiese: Pendel, Einheitskreis und s(t)-Graph laufen synchron.
import { useEffect, useMemo, useRef, useState } from 'react';
import { Md, Taste } from '../components/Basis';
import { Icon } from '../components/Icon';
import { G } from '../lib/physik';
import { useStore } from '../store/store';

type Modus = 'feder' | 'faden' | 'frei';

interface Zustand {
  modus: Modus;
  ampCm: number;
  phi0: number; // rad
  D: number;
  m: number;
  l: number;
  T: number; // nur Modus „frei“
  delta: number; // Abklingkonstante
}

const START: Zustand = { modus: 'feder', ampCm: 6, phi0: Math.PI / 4, D: 12, m: 0.4, l: 1, T: 2, delta: 0 };

const H = 330;
const MITTE = 175;
const R = 100; // Pixel für die Amplitude ŝ

function abgeleitet(z: Zustand) {
  const w0 = z.modus === 'feder' ? Math.sqrt(z.D / z.m) : z.modus === 'faden' ? Math.sqrt(G / z.l) : (2 * Math.PI) / z.T;
  const gedaempft = z.delta < w0;
  const w = gedaempft ? Math.sqrt(w0 * w0 - z.delta * z.delta) : 0;
  const T = (2 * Math.PI) / w0;
  const amp = z.ampCm / 100;
  const masse = z.modus === 'frei' ? 1 : z.m;
  const D = z.modus === 'feder' ? z.D : z.modus === 'faden' ? (z.m * G) / z.l : w0 * w0;
  return { w0, w, T, f: 1 / T, amp, vmax: amp * w0, amax: amp * w0 * w0, masse, D, gedaempft };
}

function sVon(z: Zustand, d: ReturnType<typeof abgeleitet>, t: number) {
  const huelle = Math.exp(-z.delta * t);
  if (!d.gedaempft) return d.amp * huelle * Math.sin(z.phi0); // Kriechfall vereinfacht
  return d.amp * huelle * Math.sin(d.w * t + z.phi0);
}

function vVon(z: Zustand, d: ReturnType<typeof abgeleitet>, t: number) {
  const e = Math.exp(-z.delta * t);
  if (!d.gedaempft) return -z.delta * d.amp * e * Math.sin(z.phi0);
  return d.amp * e * (d.w * Math.cos(d.w * t + z.phi0) - z.delta * Math.sin(d.w * t + z.phi0));
}

function phiText(phi: number): string {
  const k = Math.round(phi / (Math.PI / 12));
  const z = k;
  const n = 12;
  const g = (a: number, b: number): number => (b === 0 ? a : g(b, a % b));
  const t = g(z, n);
  const zz = z / t;
  const nn = n / t;
  if (zz === 0) return '0';
  const zaehler = zz === 1 ? 'π' : `${zz}π`;
  return nn === 1 ? zaehler : `${zaehler}/${nn}`;
}

interface Aufgabe {
  id: string;
  text: string;
  pruefe: (z: Zustand, d: ReturnType<typeof abgeleitet>) => boolean;
  tipp: string;
}

const winkelNah = (a: number, b: number) => {
  const d = Math.abs(((a - b) % (2 * Math.PI) + 3 * Math.PI) % (2 * Math.PI) - Math.PI);
  return d < 0.02;
};

const AUFGABEN: Aufgabe[] = [
  { id: 'sw-unten', text: 'Stell $\\varphi_0$ so ein, dass die Schwingung im **unteren Umkehrpunkt** startet.', pruefe: (z) => winkelNah(z.phi0, (3 * Math.PI) / 2), tipp: 'Im unteren Umkehrpunkt ist $\\sin\\varphi_0 = -1$. Schau, wo der Zeiger auf dem Kreis dafür stehen muss.' },
  { id: 'sw-ruhe-runter', text: 'Lass die Schwingung in der **Ruhelage nach unten** starten.', pruefe: (z) => winkelNah(z.phi0, Math.PI), tipp: 'Höhe null und Zeiger links von der Mitte – dann fällt er beim Weiterdrehen.' },
  { id: 'sw-cos', text: 'Mach aus dem Sinus einen **Kosinus**: Start im oberen Umkehrpunkt.', pruefe: (z) => winkelNah(z.phi0, Math.PI / 2), tipp: '$\\sin(x + \\frac\\pi2) = \\cos x$.' },
  { id: 'sw-T1', text: 'Stell beim **Federpendel** genau $T = 1{,}0\\,\\mathrm s$ ein.', pruefe: (z, d) => z.modus === 'feder' && Math.abs(d.T - 1) < 0.015, tipp: '$T = 2\\pi\\sqrt{m/D}$. Z. B. $m = 0{,}5\\,\\mathrm{kg}$ – welches $D$ brauchst du?' },
  { id: 'sw-faden-halb', text: 'Ein Fadenpendel mit $\\ell = 1\\,\\mathrm m$ hat $T \\approx 2{,}0\\,\\mathrm s$. Stell die Länge so ein, dass $T$ **halb so groß** ist.', pruefe: (z, d) => z.modus === 'faden' && Math.abs(d.T - 1.0035) < 0.02, tipp: '$T\\sim\\sqrt\\ell$: Für halbes $T$ braucht man ein Viertel der Länge.' },
  { id: 'sw-vmax', text: 'Erzeuge eine Schwingung mit $\\hat v = 0{,}50\\,\\frac{\\mathrm m}{\\mathrm s}$ (ohne Dämpfung).', pruefe: (z, d) => z.delta === 0 && Math.abs(d.vmax - 0.5) < 0.01, tipp: '$\\hat v = \\hat s\\cdot\\omega$. Du kannst $\\hat s$ oder $\\omega$ verändern.' },
  { id: 'sw-halbwert', text: 'Stell die Dämpfung so ein, dass sich die Amplitude etwa alle **3 Sekunden halbiert**.', pruefe: (z) => Math.abs(z.delta - Math.LN2 / 3) < 0.012, tipp: '$t_{1/2} = \\frac{\\ln 2}{\\delta}$, also $\\delta = \\frac{\\ln 2}{3\\,\\mathrm s}$.' },
  { id: 'sw-masse', text: 'Beim **Fadenpendel**: Verändere $m$. Ändert sich $T$? Stell danach $m = 2\\,\\mathrm{kg}$ ein.', pruefe: (z) => z.modus === 'faden' && Math.abs(z.m - 2) < 0.01, tipp: 'Beobachte die Anzeige von $T$ beim Ziehen am Regler.' },
];

function Regler({ label, wert, min, max, schritt, einheit, onChange, anzeige }: { label: string; wert: number; min: number; max: number; schritt: number; einheit?: string; onChange: (v: number) => void; anzeige?: string }) {
  return (
    <label className="regler">
      <span className="regler-kopf">
        <Md text={label} inline />
        <span className="mono">
          {anzeige ?? wert.toLocaleString('de-DE', { maximumFractionDigits: 3 })} {einheit}
        </span>
      </span>
      <input type="range" min={min} max={max} step={schritt} value={wert} onChange={(e) => onChange(Number(e.target.value))} />
    </label>
  );
}

export function Spielwiese() {
  const [z, setZ] = useState<Zustand>(START);
  const [t, setT] = useState(0);
  const [laeuft, setLaeuft] = useState(true);
  const [tempo, setTempo] = useState(1);
  const [zeige, setZeige] = useState({ v: false, a: false, energie: true });
  // Mini-Aufgaben erst prüfen, wenn wirklich etwas eingestellt wurde
  const [beruehrt, setBeruehrt] = useState(false);
  const geloest = useStore((s) => s.spielwiese);
  const loese = useStore((s) => s.spielwieseGeloest);
  const d = useMemo(() => abgeleitet(z), [z]);
  const letzte = useRef<number | null>(null);
  const reduziert = useMemo(() => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches, []);

  useEffect(() => {
    if (reduziert) setLaeuft(false);
  }, [reduziert]);

  useEffect(() => {
    if (!laeuft) {
      letzte.current = null;
      return;
    }
    let id = 0;
    const schritt = (jetzt: number) => {
      if (letzte.current !== null) {
        const dt = Math.min(0.05, (jetzt - letzte.current) / 1000);
        setT((x) => x + dt * tempo);
      }
      letzte.current = jetzt;
      id = requestAnimationFrame(schritt);
    };
    id = requestAnimationFrame(schritt);
    return () => cancelAnimationFrame(id);
  }, [laeuft, tempo]);

  // Mini-Aufgaben prüfen
  useEffect(() => {
    if (!beruehrt) return;
    for (const a of AUFGABEN) if (!geloest.includes(a.id) && a.pruefe(z, d)) loese(a.id);
  }, [z, d, geloest, loese, beruehrt]);

  // Tastatur: Leertaste = Start/Pause, R = zurücksetzen
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' && (e.target as HTMLInputElement).type !== 'range') return;
      if (e.key === ' ') {
        e.preventDefault();
        setLaeuft((l) => !l);
      }
      if (e.key === 'r' || e.key === 'R') setT(0);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const setze = (teil: Partial<Zustand>) => {
    setZ((alt) => ({ ...alt, ...teil }));
    setBeruehrt(true);
    setT(0);
  };

  const s = sVon(z, d, t);
  const v = vVon(z, d, t);
  const phi = d.gedaempft ? d.w * t + z.phi0 : z.phi0;
  const huelle = Math.exp(-z.delta * t);
  const ePot = 0.5 * d.D * s * s;
  const eKin = 0.5 * d.masse * v * v;
  const e0 = 0.5 * d.D * d.amp * d.amp;

  // Graph: Fenster von 2,5 Perioden (min. 2 s)
  const W = Math.max(2, Math.min(12, 2.5 * d.T));
  const t0 = Math.max(0, t - W);
  const graphPfad = (f: (x: number) => number, skal: number) => {
    let p = '';
    const n = 240;
    for (let i = 0; i <= n; i++) {
      const tt = t0 + (W * i) / n;
      if (tt > t) break;
      const x = (i / n) * 100;
      const y = MITTE - f(tt) * skal;
      p += `${i === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`;
    }
    return p;
  };
  const skalS = R / d.amp;
  const skalV = R / Math.max(d.vmax, 1e-9);
  const skalA = R / Math.max(d.amax, 1e-9);
  const aVon = (x: number) => -(d.D / d.masse) * sVon(z, d, x) - 2 * z.delta * vVon(z, d, x);

  // Pendel zeichnen
  const pendel = () => {
    if (z.modus === 'faden') {
      const lPx = 200;
      const alpha = Math.max(-0.6, Math.min(0.6, s / z.l));
      const x = 100 + lPx * Math.sin(alpha) * 0.9;
      const y = 30 + lPx * Math.cos(alpha) * 0.9;
      return (
        <svg viewBox={`0 0 200 ${H}`} className="sw-svg" aria-label="Fadenpendel">
          <line x1={60} x2={140} y1={30} y2={30} stroke="var(--text-3)" strokeWidth={3} strokeLinecap="round" />
          <line x1={100} y1={30} x2={100} y2={30 + lPx * 0.9} stroke="var(--linie-stark)" strokeDasharray="3 5" />
          <line x1={100} y1={30} x2={x} y2={y} stroke="var(--text-2)" strokeWidth={1.5} />
          <circle cx={x} cy={y} r={10 + Math.min(8, z.m * 3)} fill="var(--akzent)" />
          <text x={8} y={H - 10} className="sw-text">
            α ≈ {((alpha * 180) / Math.PI).toFixed(1).replace('.', ',')}°
          </text>
        </svg>
      );
    }
    const yMasse = MITTE - s * skalS;
    const oben = 12;
    const wind = 14;
    const punkte: string[] = [`100,${oben}`];
    const ende = yMasse - 16;
    for (let i = 1; i < wind; i++) {
      const yy = oben + 10 + ((ende - oben - 20) * i) / wind;
      punkte.push(`${i % 2 ? 84 : 116},${yy.toFixed(1)}`);
    }
    punkte.push(`100,${ende - 6}`, `100,${ende}`);
    return (
      <svg viewBox={`0 0 200 ${H}`} className="sw-svg" aria-label="Federpendel">
        <line x1={60} x2={140} y1={oben} y2={oben} stroke="var(--text-3)" strokeWidth={3} strokeLinecap="round" />
        <line x1={0} x2={200} y1={MITTE} y2={MITTE} stroke="var(--linie-stark)" strokeDasharray="3 5" />
        <polyline points={punkte.join(' ')} fill="none" stroke="var(--text-2)" strokeWidth={1.6} strokeLinejoin="round" />
        <rect x={80} y={yMasse - 16} width={40} height={32} rx={6} fill="var(--akzent)" />
        <line x1={150} x2={200} y1={yMasse} y2={yMasse} stroke="var(--koralle)" strokeDasharray="4 4" />
        <text x={8} y={MITTE - 6} className="sw-text">
          Ruhelage
        </text>
      </svg>
    );
  };

  const px = 100 + Math.cos(phi) * R * huelle;
  const py = MITTE - Math.sin(phi) * R * huelle;

  return (
    <div className="inhalt breit">
      <div className="kopf">
        <div>
          <span className="ueber">Spielwiese</span>
          <h1>Pendel, Kreis und Kurve</h1>
          <p>
            <Md inline text="Der Zeiger auf dem Kreis dreht sich mit $\omega$. Seine Höhe ist die Auslenkung – genau die Höhe der Masse und des Graphen. Zieh an den Reglern und schau, was passiert." />
          </p>
        </div>
        <div className="zeile">
          <button className="btn primaer" onClick={() => setLaeuft((l) => !l)}>
            <Icon name={laeuft ? 'pause' : 'play'} size={16} /> {laeuft ? 'Pause' : 'Start'} <Taste>Leertaste</Taste>
          </button>
          <button className="btn" onClick={() => setT(0)}>
            <Icon name="zuruecksetzen" size={16} /> Neu starten <Taste>R</Taste>
          </button>
          <div className="segment">
            {[0.25, 0.5, 1].map((x) => (
              <button key={x} className={tempo === x ? 'an' : ''} onClick={() => setTempo(x)}>
                {x === 1 ? '1×' : `${String(x).replace('.', ',')}×`}
              </button>
            ))}
          </div>
        </div>
      </div>

      <section className="panel sw-buehne">
        <div className="sw-teil">
          <span className="sw-titel">{z.modus === 'faden' ? 'Fadenpendel' : 'Federpendel'}</span>
          {pendel()}
        </div>
        <div className="sw-teil">
          <span className="sw-titel">Zeiger am Kreis</span>
          <svg viewBox={`0 0 200 ${H}`} className="sw-svg" aria-label="Einheitskreis">
            <circle cx={100} cy={MITTE} r={R} fill="none" stroke="var(--linie-stark)" />
            {z.delta > 0 && <circle cx={100} cy={MITTE} r={R * huelle} fill="none" stroke="var(--linie)" strokeDasharray="2 4" />}
            <line x1={100 - R - 8} x2={100 + R + 8} y1={MITTE} y2={MITTE} stroke="var(--linie)" />
            <line x1={100} x2={100} y1={MITTE - R - 8} y2={MITTE + R + 8} stroke="var(--linie)" />
            <path d={`M${100 + 26},${MITTE} A26,26 0 ${((phi % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI) > Math.PI ? 1 : 0},0 ${100 + 26 * Math.cos(phi)},${MITTE - 26 * Math.sin(phi)}`} fill="none" stroke="var(--sand)" strokeWidth={1.5} />
            <line x1={100} y1={MITTE} x2={px} y2={py} stroke="var(--akzent)" strokeWidth={2.5} strokeLinecap="round" />
            <line x1={px} y1={py} x2={200} y2={py} stroke="var(--koralle)" strokeDasharray="4 4" />
            <line x1={px} y1={py} x2={px} y2={MITTE} stroke="var(--blau)" strokeDasharray="2 3" opacity={0.6} />
            <circle cx={px} cy={py} r={6} fill="var(--akzent)" />
            <text x={8} y={H - 10} className="sw-text">
              φ = {(((phi % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)).toFixed(2).replace('.', ',')} rad
            </text>
          </svg>
        </div>
        <div className="sw-teil sw-graph">
          <span className="sw-titel">
            s(t){zeige.v && <span style={{ color: 'var(--blau)' }}> · v(t)</span>}
            {zeige.a && <span style={{ color: 'var(--sand)' }}> · a(t)</span>}
          </span>
          <svg viewBox={`0 0 100 ${H}`} preserveAspectRatio="none" className="sw-svg" aria-label="Zeitverlauf">
            <line x1={0} x2={100} y1={MITTE} y2={MITTE} stroke="var(--linie-stark)" vectorEffect="non-scaling-stroke" />
            <line x1={0} x2={100} y1={MITTE - R} y2={MITTE - R} stroke="var(--linie)" strokeDasharray="2 4" vectorEffect="non-scaling-stroke" />
            <line x1={0} x2={100} y1={MITTE + R} y2={MITTE + R} stroke="var(--linie)" strokeDasharray="2 4" vectorEffect="non-scaling-stroke" />
            {zeige.a && <path d={graphPfad(aVon, skalA)} fill="none" stroke="var(--sand)" strokeWidth={1.6} vectorEffect="non-scaling-stroke" />}
            {zeige.v && <path d={graphPfad((x) => vVon(z, d, x), skalV)} fill="none" stroke="var(--blau)" strokeWidth={1.6} vectorEffect="non-scaling-stroke" />}
            <path d={graphPfad((x) => sVon(z, d, x), skalS)} fill="none" stroke="var(--akzent)" strokeWidth={2.4} vectorEffect="non-scaling-stroke" />
            {z.delta > 0 && <path d={graphPfad((x) => d.amp * Math.exp(-z.delta * x), skalS)} fill="none" stroke="var(--text-3)" strokeDasharray="3 4" strokeWidth={1} vectorEffect="non-scaling-stroke" />}
          </svg>
          <div className="sw-achse mono">
            <span>{t0.toFixed(1).replace('.', ',')} s</span>
            <span>t = {t.toFixed(1).replace('.', ',')} s</span>
          </div>
        </div>
      </section>

      <div className="sw-raster">
        <section className="panel">
          <div className="panel-titel">
            <h3>Einstellungen</h3>
            <div className="segment">
              {(['feder', 'faden', 'frei'] as Modus[]).map((m) => (
                <button key={m} className={z.modus === m ? 'an' : ''} onClick={() => setze({ modus: m })}>
                  {m === 'feder' ? 'Feder' : m === 'faden' ? 'Faden' : 'nur ω'}
                </button>
              ))}
            </div>
          </div>
          <div className="regler-liste">
            <Regler label="Amplitude $\hat s$" wert={z.ampCm} min={1} max={15} schritt={0.5} einheit="cm" onChange={(x) => setze({ ampCm: x })} />
            <Regler label="Nullphase $\varphi_0$" wert={z.phi0} min={0} max={2 * Math.PI - Math.PI / 12} schritt={Math.PI / 12} anzeige={`${phiText(z.phi0)} = ${Math.round((z.phi0 * 180) / Math.PI)}°`} onChange={(x) => setze({ phi0: x })} />
            {z.modus === 'feder' && (
              <>
                <Regler label="Federkonstante $D$" wert={z.D} min={2} max={200} schritt={1} einheit="N/m" onChange={(x) => setze({ D: x })} />
                <Regler label="Masse $m$" wert={z.m} min={0.05} max={2} schritt={0.05} einheit="kg" onChange={(x) => setze({ m: x })} />
              </>
            )}
            {z.modus === 'faden' && (
              <>
                <Regler label="Pendellänge $\ell$" wert={z.l} min={0.1} max={3} schritt={0.01} einheit="m" onChange={(x) => setze({ l: x })} />
                <Regler label="Masse $m$" wert={z.m} min={0.05} max={2} schritt={0.05} einheit="kg" onChange={(x) => setze({ m: x })} />
              </>
            )}
            {z.modus === 'frei' && <Regler label="Periodendauer $T$" wert={z.T} min={0.5} max={6} schritt={0.1} einheit="s" onChange={(x) => setze({ T: x })} />}
            <Regler label="Dämpfung $\delta = \frac{b}{2m}$" wert={z.delta} min={0} max={1.5} schritt={0.01} einheit="1/s" onChange={(x) => setze({ delta: x })} />
          </div>
          <div className="zeile" style={{ marginTop: 12 }}>
            {(['v', 'a', 'energie'] as const).map((k) => (
              <label key={k} className="zeile klein" style={{ gap: 8 }}>
                <button type="button" role="switch" aria-checked={zeige[k]} className="schalter" onClick={() => setZeige((x) => ({ ...x, [k]: !x[k] }))} aria-label={k} />
                {k === 'v' ? 'v(t) zeigen' : k === 'a' ? 'a(t) zeigen' : 'Energien'}
              </label>
            ))}
          </div>
        </section>

        <section className="panel">
          <h3 className="mb">Werte</h3>
          <dl className="kennzahlen sw-werte">
            <div>
              <dt>Periodendauer T</dt>
              <dd className="mono">{d.T.toFixed(3).replace('.', ',')} s</dd>
            </div>
            <div>
              <dt>Frequenz f</dt>
              <dd className="mono">{d.f.toFixed(3).replace('.', ',')} Hz</dd>
            </div>
            <div>
              <dt>Kreisfrequenz ω₀</dt>
              <dd className="mono">{d.w0.toFixed(3).replace('.', ',')} 1/s</dd>
            </div>
            <div>
              <dt>v̂ (ohne Dämpfung)</dt>
              <dd className="mono">{d.vmax.toFixed(3).replace('.', ',')} m/s</dd>
            </div>
            <div>
              <dt>â (ohne Dämpfung)</dt>
              <dd className="mono">{d.amax.toFixed(2).replace('.', ',')} m/s²</dd>
            </div>
            <div>
              <dt>s(t) jetzt</dt>
              <dd className="mono">{(s * 100).toFixed(2).replace('.', ',')} cm</dd>
            </div>
          </dl>
          {!d.gedaempft && <p className="klein" style={{ color: 'var(--koralle)' }}>Die Dämpfung ist so stark, dass keine Schwingung mehr entsteht (δ ≥ ω₀).</p>}
          {zeige.energie && (
            <div className="sw-energie">
              <div>
                <span className="klein">E_pot</span>
                <div className="balken">
                  <span style={{ width: `${(ePot / e0) * 100}%`, background: 'var(--blau)', transition: 'none' }} />
                </div>
              </div>
              <div>
                <span className="klein">E_kin</span>
                <div className="balken">
                  <span style={{ width: `${(eKin / e0) * 100}%`, transition: 'none' }} />
                </div>
              </div>
              <span className="sehr-leise klein">relativ zur Anfangsenergie {(e0 * 1000).toFixed(1).replace('.', ',')} mJ</span>
            </div>
          )}
        </section>

        <section className="panel sw-aufgaben">
          <div className="panel-titel">
            <h3>Mini-Aufgaben</h3>
            <span className="mono sehr-leise klein">
              {AUFGABEN.filter((a) => geloest.includes(a.id)).length}/{AUFGABEN.length}
            </span>
          </div>
          <ul>
            {AUFGABEN.map((a) => {
              const ok = geloest.includes(a.id);
              return (
                <li key={a.id} className={ok ? 'ok' : ''}>
                  <span className="sw-haken">{ok ? <Icon name="check" size={14} /> : null}</span>
                  <div>
                    <Md text={a.text} inline />
                    {!ok && (
                      <details>
                        <summary className="sehr-leise klein">Tipp</summary>
                        <Md text={a.tipp} inline className="klein leise" />
                      </details>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </div>
  );
}
