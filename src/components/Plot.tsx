// SVG-Diagramm mit Raster, Achsen, Kurven und optionalem Klick zum Ablesen.
import { useId, useMemo, useRef, useState, type PointerEvent } from 'react';
import type { KurvenStil, PlotSpec } from '../content/types';

const FARBE: Record<KurvenStil, string> = {
  akzent: 'var(--akzent)',
  koralle: 'var(--koralle)',
  neutral: 'var(--text-2)',
  blau: 'var(--blau)',
  gelb: 'var(--sand)',
};

const B = 640;
const RAND = { l: 56, r: 18, o: 22, u: 40 };

function tickWerte(min: number, max: number, schritt: number): number[] {
  const res: number[] = [];
  const start = Math.ceil(min / schritt - 1e-9) * schritt;
  for (let v = start; v <= max + schritt * 1e-6; v += schritt) res.push(Number(v.toFixed(10)));
  return res;
}

function beschriftung(v: number, nachkomma?: number): string {
  const n = nachkomma ?? (Math.abs(v) < 1e-12 ? 0 : Math.max(0, Math.min(4, -Math.floor(Math.log10(Math.abs(v) + 1e-12)) + 1)));
  const s = Math.abs(v) < 1e-12 ? '0' : v.toFixed(Math.max(0, n));
  return s.replace('.', ',').replace('-', '−');
}

export interface PlotProps {
  spec: PlotSpec;
  hoehe?: number;
  klickbar?: boolean;
  onKlick?: (x: number, y: number) => void;
  /** markierte x-Position (z. B. nach einem Klick) */
  markiertX?: number | null;
  markierungFarbe?: KurvenStil;
  /** zusätzliche Ziel-Markierungen (z. B. richtige Lösung) */
  zielX?: number[];
  label?: string;
}

export function Plot({ spec, hoehe = 270, klickbar, onKlick, markiertX, markierungFarbe = 'akzent', zielX, label }: PlotProps) {
  const id = useId().replace(/:/g, '');
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoverX, setHoverX] = useState<number | null>(null);
  const H = hoehe;
  const [x0, x1] = spec.x;
  const [y0, y1] = spec.y;
  const sx = (x: number) => RAND.l + ((x - x0) / (x1 - x0)) * (B - RAND.l - RAND.r);
  const sy = (y: number) => H - RAND.u - ((y - y0) / (y1 - y0)) * (H - RAND.o - RAND.u);
  const ix = (px: number) => x0 + ((px - RAND.l) / (B - RAND.l - RAND.r)) * (x1 - x0);
  const iy = (py: number) => y0 + ((H - RAND.u - py) / (H - RAND.o - RAND.u)) * (y1 - y0);

  const pfade = useMemo(
    () =>
      spec.kurven.map((k) => {
        const von = Math.max(x0, k.von ?? x0);
        const bis = Math.min(x1, k.bis ?? x1);
        const n = 700;
        let d = '';
        let stift = false;
        for (let i = 0; i <= n; i++) {
          const x = von + ((bis - von) * i) / n;
          const y = k.f(x);
          if (!Number.isFinite(y)) {
            stift = false;
            continue;
          }
          const yy = Math.max(y0 - (y1 - y0), Math.min(y1 + (y1 - y0), y));
          d += `${stift ? 'L' : 'M'}${sx(x).toFixed(2)},${sy(yy).toFixed(2)}`;
          stift = true;
        }
        return d;
      }),
    [spec, H],
  );

  const xFein = spec.xFein ? tickWerte(x0, x1, spec.xFein) : [];
  const yFein = spec.yFein ? tickWerte(y0, y1, spec.yFein) : [];
  const xT = tickWerte(x0, x1, spec.xSchritt);
  const yT = tickWerte(y0, y1, spec.ySchritt);
  const nullY = y0 <= 0 && y1 >= 0 ? sy(0) : sy(y0);
  const nullX = x0 <= 0 && x1 >= 0 ? sx(0) : sx(x0);

  function punktAus(e: PointerEvent<SVGSVGElement>) {
    const svg = svgRef.current;
    if (!svg) return null;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const ctm = svg.getScreenCTM();
    if (!ctm) return null;
    const p = pt.matrixTransform(ctm.inverse());
    if (p.x < RAND.l - 4 || p.x > B - RAND.r + 4) return null;
    return { x: Math.max(x0, Math.min(x1, ix(p.x))), y: iy(p.y) };
  }

  return (
    <svg
      ref={svgRef}
      className={klickbar ? 'plot klickbar' : 'plot'}
      viewBox={`0 0 ${B} ${H}`}
      role="img"
      aria-label={label ?? `Diagramm: ${spec.yLabel} gegen ${spec.xLabel}`}
      onPointerMove={klickbar ? (e) => setHoverX(punktAus(e)?.x ?? null) : undefined}
      onPointerLeave={klickbar ? () => setHoverX(null) : undefined}
      onPointerDown={
        klickbar
          ? (e) => {
              const p = punktAus(e);
              if (p) onKlick?.(p.x, p.y);
            }
          : undefined
      }
    >
      <defs>
        <clipPath id={`clip${id}`}>
          <rect x={RAND.l} y={RAND.o} width={B - RAND.l - RAND.r} height={H - RAND.o - RAND.u} />
        </clipPath>
      </defs>
      {/* Feinraster */}
      <g stroke="var(--raster)" strokeWidth={1}>
        {xFein.map((v) => (
          <line key={`xf${v}`} x1={sx(v)} x2={sx(v)} y1={RAND.o} y2={H - RAND.u} />
        ))}
        {yFein.map((v) => (
          <line key={`yf${v}`} y1={sy(v)} y2={sy(v)} x1={RAND.l} x2={B - RAND.r} />
        ))}
      </g>
      <g stroke="var(--raster-stark)" strokeWidth={1}>
        {xT.map((v) => (
          <line key={`x${v}`} x1={sx(v)} x2={sx(v)} y1={RAND.o} y2={H - RAND.u} />
        ))}
        {yT.map((v) => (
          <line key={`y${v}`} y1={sy(v)} y2={sy(v)} x1={RAND.l} x2={B - RAND.r} />
        ))}
      </g>
      {/* Achsen */}
      <g stroke="var(--text-3)" strokeWidth={1.25}>
        <line x1={RAND.l} x2={B - RAND.r} y1={nullY} y2={nullY} />
        <line x1={nullX} x2={nullX} y1={RAND.o} y2={H - RAND.u} />
      </g>
      <g className="plot-text" fill="var(--text-3)">
        {xT.map((v) => (
          <text key={`xt${v}`} x={sx(v)} y={H - RAND.u + 17} textAnchor="middle">
            {beschriftung(v, spec.xNachkomma)}
          </text>
        ))}
        {yT.map((v) => (
          <text key={`yt${v}`} x={RAND.l - 8} y={sy(v) + 4} textAnchor="end">
            {beschriftung(v, spec.yNachkomma)}
          </text>
        ))}
        <text x={B - RAND.r} y={H - 6} textAnchor="end" className="plot-achse">
          {spec.xLabel}
        </text>
        <text x={RAND.l - 8} y={13} textAnchor="start" className="plot-achse">
          {spec.yLabel}
        </text>
      </g>
      {/* Kurven */}
      <g clipPath={`url(#clip${id})`} fill="none" strokeLinecap="round" strokeLinejoin="round">
        {spec.kurven.map((k, i) => (
          <path key={i} d={pfade[i]} stroke={FARBE[k.stil ?? 'akzent']} strokeWidth={2.25} strokeDasharray={k.gestrichelt ? '6 6' : undefined} />
        ))}
        {spec.punkte?.map((p, i) => (
          <g key={`p${i}`} stroke="var(--text)" strokeWidth={1.5}>
            <line x1={sx(p.x) - 4} x2={sx(p.x) + 4} y1={sy(p.y) - 4} y2={sy(p.y) + 4} />
            <line x1={sx(p.x) - 4} x2={sx(p.x) + 4} y1={sy(p.y) + 4} y2={sy(p.y) - 4} />
          </g>
        ))}
      </g>
      {spec.kurven.some((k) => k.label) && (
        <g className="plot-text">
          {spec.kurven
            .filter((k) => k.label)
            .map((k, i) => (
              <g key={`l${i}`} transform={`translate(${RAND.l + 10 + i * 120}, ${RAND.o + 4})`}>
                <line x1={0} x2={18} y1={0} y2={0} stroke={FARBE[k.stil ?? 'akzent']} strokeWidth={2.5} strokeDasharray={k.gestrichelt ? '4 4' : undefined} />
                <text x={24} y={4} fill="var(--text-2)">
                  {k.label}
                </text>
              </g>
            ))}
        </g>
      )}
      {spec.markierungen?.map((m, i) => (
        <g key={`m${i}`}>
          <circle cx={sx(m.x)} cy={sy(m.y)} r={4.5} fill="var(--bg)" stroke="var(--akzent)" strokeWidth={2} />
          {m.label && (
            <text x={sx(m.x) + 8} y={sy(m.y) - 8} className="plot-text" fill="var(--text)">
              {m.label}
            </text>
          )}
        </g>
      ))}
      {zielX?.map((x, i) => (
        <line key={`z${i}`} x1={sx(x)} x2={sx(x)} y1={RAND.o} y2={H - RAND.u} stroke="var(--akzent)" strokeWidth={1.5} strokeDasharray="3 4" />
      ))}
      {klickbar && hoverX !== null && (
        <line x1={sx(hoverX)} x2={sx(hoverX)} y1={RAND.o} y2={H - RAND.u} stroke="var(--text-3)" strokeWidth={1} strokeDasharray="2 3" pointerEvents="none" />
      )}
      {markiertX !== null && markiertX !== undefined && (
        <g pointerEvents="none">
          <line x1={sx(markiertX)} x2={sx(markiertX)} y1={RAND.o} y2={H - RAND.u} stroke={FARBE[markierungFarbe]} strokeWidth={2} />
          <text x={sx(markiertX) + 6} y={RAND.o + 12} className="plot-text" fill={FARBE[markierungFarbe]}>
            {beschriftung(markiertX, 2)}
          </text>
        </g>
      )}
    </svg>
  );
}
