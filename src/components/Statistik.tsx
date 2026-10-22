// Statistik: Wochenverlauf, Lernkalender, Karteikarten-Fächer und Themenfortschritt.
import { useState } from 'react';
import { useAktiverKurs } from '../lib/kurs';
import { heute, parseDatum, plusTage } from '../lib/datum';
import { themaFortschritt } from '../lib/fortschritt';
import { laengsteSerie, streak, tagZaehlt, useStore, type TagesStand } from '../store/store';
import { useUi } from '../store/ui';
import { Balken } from './Basis';
import { Dialog } from './Dialog';
import { Icon } from './Icon';

type Metrik = 'minuten' | 'karten' | 'aufgaben';
const METRIK: Record<Metrik, { label: string; einheit: string }> = {
  minuten: { label: 'Lernzeit', einheit: 'min' },
  karten: { label: 'Karteikarten', einheit: 'Karten' },
  aufgaben: { label: 'Aufgaben', einheit: 'Aufgaben' },
};
const WOCHENTAG = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
const LEER: TagesStand = { xp: 0, sekunden: 0, karten: 0, aufgaben: 0, richtig: 0 };

const minuten = (t: TagesStand | undefined) => Math.round((t?.sekunden ?? 0) / 60);
function wert(t: TagesStand | undefined, m: Metrik): number {
  if (m === 'minuten') return minuten(t);
  return (m === 'karten' ? t?.karten : t?.aufgaben) ?? 0;
}

export function montagVon(iso: string): string {
  const tag = parseDatum(iso).getDay(); // 0 = Sonntag
  return plusTage(iso, -((tag + 6) % 7));
}

function kurzDatum(iso: string): string {
  const d = parseDatum(iso);
  return `${d.getDate()}.${d.getMonth() + 1}.`;
}

function dauerText(min: number): string {
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  const rest = min % 60;
  return rest ? `${h} h ${rest} min` : `${h} h`;
}

/** Runde Obergrenze für die y-Achse */
function schoeneMax(x: number): number {
  if (x <= 5) return 5;
  const p = 10 ** Math.floor(Math.log10(x));
  for (const f of [1, 2, 2.5, 5, 10]) if (f * p >= x) return f * p;
  return 10 * p;
}

/** Balken mit abgerundeter Oberkante, unten gerade auf der Grundlinie */
function balkenPfad(x: number, y: number, b: number, h: number): string {
  if (h <= 0) return '';
  const r = Math.min(4, b / 2, h);
  return `M${x},${y + h} V${y + r} Q${x},${y} ${x + r},${y} H${x + b - r} Q${x + b},${y} ${x + b},${y + r} V${y + h} Z`;
}

function WochenDiagramm({ tage, montag, metrik, ziel, h }: { tage: Record<string, TagesStand>; montag: string; metrik: Metrik; ziel?: number; h: string }) {
  const [hover, setHover] = useState<number | null>(null);
  const daten = WOCHENTAG.map((_, i) => {
    const d = plusTage(montag, i);
    return { d, t: tage[d], w: wert(tage[d], metrik) };
  });
  const W = 560;
  const H = 210;
  const L = 34;
  const R = 12;
  const O = 18;
  const U = 28;
  const max = schoeneMax(Math.max(1, ...daten.map((x) => x.w), ziel ?? 0));
  const y = (v: number) => O + (H - O - U) * (1 - v / max);
  const slot = (W - L - R) / 7;
  const bb = Math.min(44, slot * 0.56);
  const groesster = daten.reduce((a, x, i) => (x.w > daten[a].w ? i : a), 0);
  const ticks = [0, max / 2, max];

  return (
    <div className="diagramm">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`${METRIK[metrik].label} pro Tag in der Woche ab ${kurzDatum(montag)}`}>
        {ticks.map((t) => (
          <g key={t} className="achse">
            <line x1={L} x2={W - R} y1={y(t)} y2={y(t)} className={t === 0 ? 'grundlinie' : 'gitter'} />
            <text x={L - 8} y={y(t) + 4} textAnchor="end">
              {Number.isInteger(t) ? t : t.toFixed(1).replace('.', ',')}
            </text>
          </g>
        ))}
        {ziel !== undefined && (
          <g className="ziel-linie">
            <line x1={L} x2={W - R} y1={y(ziel)} y2={y(ziel)} />
            <text x={W - R} y={y(ziel) - 6} textAnchor="end">
              Ziel {ziel} min
            </text>
          </g>
        )}
        {daten.map((x, i) => {
          const bx = L + i * slot + (slot - bb) / 2;
          const zukunft = x.d > h;
          return (
            <g
              key={x.d}
              tabIndex={0}
              role="img"
              aria-label={`${WOCHENTAG[i]}, ${kurzDatum(x.d)}: ${x.w} ${METRIK[metrik].einheit}`}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
              onFocus={() => setHover(i)}
              onBlur={() => setHover(null)}
              className={`balken-gruppe${hover === i ? ' hover' : ''}`}
            >
              <rect x={L + i * slot} y={O} width={slot} height={H - O - U} className="treffer" />
              <path d={balkenPfad(bx, y(x.w), bb, y(0) - y(x.w))} className={`balken-mark${x.d === h ? ' heute' : ''}`} />
              {(i === groesster || x.d === h) && x.w > 0 && (
                <text x={bx + bb / 2} y={y(x.w) - 6} textAnchor="middle" className="wert">
                  {x.w}
                </text>
              )}
              <text x={L + i * slot + slot / 2} y={H - 8} textAnchor="middle" className={`x-label${x.d === h ? ' heute' : ''}${zukunft ? ' zukunft' : ''}`}>
                {WOCHENTAG[i]}
              </text>
            </g>
          );
        })}
      </svg>
      {hover !== null && (
        <div className="tooltip" style={{ left: `clamp(84px, ${((L + hover * slot + slot / 2) / W) * 100}%, calc(100% - 84px))` }}>
          <strong>
            {WOCHENTAG[hover]}, {kurzDatum(daten[hover].d)}
          </strong>
          <span>{dauerText(minuten(daten[hover].t))} gelernt</span>
          <span>
            {daten[hover].t?.karten ?? 0} Karten · {daten[hover].t?.aufgaben ?? 0} Aufgaben
          </span>
          {tagZaehlt(daten[hover].t) && <span className="akzent-text">zählt für die Serie</span>}
        </div>
      )}
    </div>
  );
}

function stufe(min: number, ziel: number): number {
  if (min <= 0) return 0;
  const q = min / Math.max(1, ziel);
  return q < 0.34 ? 1 : q < 0.67 ? 2 : q < 1 ? 3 : 4;
}

function Kalender({ tage, h, ziel }: { tage: Record<string, TagesStand>; h: string; ziel: number }) {
  const WOCHEN = 12;
  const start = plusTage(montagVon(h), -7 * (WOCHEN - 1));
  return (
    <div className="kalender-wrap">
      <div className="kalender-tage sehr-leise" aria-hidden>
        {WOCHENTAG.map((w, i) => (
          <span key={w}>{i % 2 === 0 ? w : ''}</span>
        ))}
      </div>
      <div className="kalender" role="img" aria-label={`Lernkalender der letzten ${WOCHEN} Wochen`}>
        {Array.from({ length: WOCHEN }, (_, w) => (
          <div key={w} className="kalender-woche">
            {WOCHENTAG.map((_, i) => {
              const d = plusTage(start, w * 7 + i);
              const t = tage[d];
              const m = minuten(t);
              return (
                <span
                  key={d}
                  className={`kal-zelle s${stufe(m, ziel)}${d > h ? ' zukunft' : ''}${d === h ? ' heute' : ''}${tagZaehlt(t) ? ' zaehlt' : ''}`}
                  title={`${WOCHENTAG[i]}, ${kurzDatum(d)}: ${dauerText(m)}${t ? `, ${t.karten} Karten, ${t.aufgaben} Aufgaben` : ''}`}
                />
              );
            })}
          </div>
        ))}
      </div>
      <div className="kalender-legende sehr-leise klein" aria-hidden>
        weniger
        {[0, 1, 2, 3, 4].map((s) => (
          <span key={s} className={`kal-zelle s${s}`} />
        ))}
        mehr <span className="kal-trenner" /> Stufe 4 = Tagesziel erreicht
      </div>
    </div>
  );
}

function Faecher() {
  const kurs = useAktiverKurs();
  const karten = useStore((s) => s.karten);
  const alle = kurs.themen.flatMap((t) => t.karten);
  const n = [0, 1, 2, 3, 4, 5].map((f) => alle.filter((k) => (karten[k.id]?.fach ?? 0) === f && (f > 0 || !karten[k.id])).length);
  const segmente = [
    { label: 'neu', n: n[0], cls: 'neu' },
    ...[1, 2, 3, 4, 5].map((f) => ({ label: `Fach ${f}`, n: n[f], cls: `f${f}` })),
  ];
  const gesamt = alle.length;
  const sicher = n[3] + n[4] + n[5];
  return (
    <div>
      <div className="faecher-balken" role="img" aria-label={segmente.map((s) => `${s.label}: ${s.n}`).join(', ')}>
        {segmente.map((s) => s.n > 0 && <span key={s.label} className={`seg ${s.cls}`} style={{ flexGrow: s.n }} title={`${s.label}: ${s.n} Karten`} />)}
      </div>
      <div className="faecher-legende klein">
        {segmente.map((s) => (
          <span key={s.label}>
            <span className={`swatch ${s.cls}`} /> {s.label} <strong className="mono">{s.n}</strong>
          </span>
        ))}
      </div>
      <p className="sehr-leise klein" style={{ margin: '8px 0 0' }}>
        {sicher} von {gesamt} Karten sind mindestens in Fach 3 – die sitzen schon ziemlich gut.
      </p>
    </div>
  );
}

function Themen() {
  const kurs = useAktiverKurs();
  const daten = useStore();
  const h = heute();
  return (
    <ul className="themen-balken">
      {kurs.themen.map((t) => {
        const f = themaFortschritt(t, daten, h);
        return (
          <li key={t.id}>
            <span className="knoten-nr klein-nr">{t.nr}</span>
            <span className="themen-name">{t.titel}</span>
            <Balken wert={f.gesamt} duenn label={`${t.titel}: ${Math.round(f.gesamt * 100)} %`} />
            <span className="mono sehr-leise klein">{Math.round(f.gesamt * 100)} %</span>
          </li>
        );
      })}
    </ul>
  );
}

function summe(tage: Record<string, TagesStand>, von: string, anzahl: number) {
  let min = 0;
  let karten = 0;
  let aufgaben = 0;
  let richtig = 0;
  let aktiv = 0;
  for (let i = 0; i < anzahl; i++) {
    const t = tage[plusTage(von, i)] ?? LEER;
    min += minuten(t);
    karten += t.karten;
    aufgaben += t.aufgaben;
    richtig += t.richtig ?? 0;
    if (tagZaehlt(t)) aktiv++;
  }
  return { min, karten, aufgaben, richtig, aktiv };
}

function vergleich(jetzt: number, vorher: number, einheit: string, bis?: string): string {
  const d = jetzt - vorher;
  const bezug = bis ? (bis === 'Mo' ? 'am Montag der Vorwoche' : `Mo–${bis} der Vorwoche`) : 'in der Woche davor';
  if (d === 0) return `genauso viel wie ${bezug}`;
  return `${Math.abs(d)} ${einheit} ${d > 0 ? 'mehr' : 'weniger'} als ${bezug}`;
}

export function Statistik() {
  const zu = useUi((s) => s.zeigeStatistik);
  return (
    <Dialog titel="Deine Statistik" ueber="Insights" art="seite" onSchliessen={() => zu(false)}>
      <StatistikInhalt />
    </Dialog>
  );
}

/** Wochenverlauf, Kalender, Fächer, Themen – im Profil und im Dialog. */
export function StatistikInhalt() {
  const tage = useStore((s) => s.tage);
  const ziel = useStore((s) => s.einstellungen.zielMinuten);
  const h = heute();
  const dieseWoche = montagVon(h);
  const [montag, setMontag] = useState(dieseWoche);
  const [metrik, setMetrik] = useState<Metrik>('minuten');

  const istAktuell = montag === dieseWoche;
  // laufende Woche fair vergleichen: nur dieselben Wochentage der Vorwoche
  const tageBisher = istAktuell ? WOCHENTAG.findIndex((_, i) => plusTage(montag, i) === h) + 1 : 7;
  const w = summe(tage, montag, 7);
  const vorher = summe(tage, plusTage(montag, -7), tageBisher);
  const bis = tageBisher < 7 ? WOCHENTAG[tageBisher - 1] : undefined;
  const serie = streak(tage, h);
  const rekord = laengsteSerie(tage);
  const gesamtMin = Object.values(tage).reduce((a, t) => a + minuten(t), 0);
  const letzte7 = summe(tage, plusTage(h, -6), 7);
  const quote = letzte7.aufgaben > 0 ? Math.round((letzte7.richtig / letzte7.aufgaben) * 100) : null;

  return (
    <>
      <div className="stat-kacheln">
        <div className="stat-kachel">
          <span className="stat-zahl">{serie}</span>
          <span className="sehr-leise klein">{serie === 1 ? 'Tag' : 'Tage'} in Folge</span>
        </div>
        <div className="stat-kachel">
          <span className="stat-zahl">{rekord}</span>
          <span className="sehr-leise klein">längste Serie</span>
        </div>
        <div className="stat-kachel">
          <span className="stat-zahl">{dauerText(letzte7.min)}</span>
          <span className="sehr-leise klein">in den letzten 7 Tagen</span>
        </div>
        <div className="stat-kachel">
          <span className="stat-zahl">{quote === null ? '–' : `${quote} %`}</span>
          <span className="sehr-leise klein">Aufgaben richtig (7 Tage)</span>
        </div>
      </div>

      <section className="stat-abschnitt">
        <div className="stat-kopf">
          <h3>Wochenverlauf</h3>
          <div className="zeile" style={{ gap: 4 }}>
            <button type="button" className="btn geist klein" onClick={() => setMontag(plusTage(montag, -7))} aria-label="Vorherige Woche">
              <Icon name="links" size={15} />
            </button>
            <span className="klein mono woche-label">
              {istAktuell ? 'diese Woche' : `${kurzDatum(montag)}–${kurzDatum(plusTage(montag, 6))}`}
            </span>
            <button type="button" className="btn geist klein" onClick={() => setMontag(plusTage(montag, 7))} disabled={istAktuell} aria-label="Nächste Woche">
              <Icon name="rechts" size={15} />
            </button>
          </div>
        </div>
        <div className="segment klein-segment" role="group" aria-label="Was anzeigen?">
          {(Object.keys(METRIK) as Metrik[]).map((m) => (
            <button key={m} type="button" className={metrik === m ? 'an' : ''} aria-pressed={metrik === m} onClick={() => setMetrik(m)}>
              {METRIK[m].label}
            </button>
          ))}
        </div>
        <WochenDiagramm tage={tage} montag={montag} metrik={metrik} ziel={metrik === 'minuten' ? ziel : undefined} h={h} />
        <p className="leise klein stat-satz">
          {metrik === 'minuten' && (
            <>
              <strong>{dauerText(w.min)}</strong> gelernt an {w.aktiv} {w.aktiv === 1 ? 'Tag' : 'Tagen'} – {vergleich(w.min, vorher.min, 'min', bis)}.
            </>
          )}
          {metrik === 'karten' && (
            <>
              <strong>{w.karten}</strong> Karteikarten bewertet – {vergleich(w.karten, vorher.karten, 'Karten', bis)}.
            </>
          )}
          {metrik === 'aufgaben' && (
            <>
              <strong>{w.aufgaben}</strong> Übungen und Aufgaben bearbeitet{w.aufgaben > 0 && w.richtig > 0 ? `, davon ${w.richtig} sauber gelöst` : ''} – {vergleich(w.aufgaben, vorher.aufgaben, 'Aufgaben', bis)}.
            </>
          )}
        </p>
      </section>

      <section className="stat-abschnitt">
        <div className="stat-kopf">
          <h3>Lernkalender</h3>
          <span className="sehr-leise klein">insgesamt {dauerText(gesamtMin)}</span>
        </div>
        <Kalender tage={tage} h={h} ziel={ziel} />
      </section>

      <section className="stat-abschnitt">
        <h3>Karteikarten</h3>
        <Faecher />
      </section>

      <section className="stat-abschnitt">
        <h3>Themen</h3>
        <Themen />
      </section>

      <div className="stat-info klein">
        <Icon name="info" size={16} />
        <div>
          <strong>So zählt die Serie:</strong> Ein Tag zählt, sobald du mindestens <strong>3 Karteikarten</strong> bewertet oder <strong>eine Übung bzw. Aufgabe</strong> bearbeitet hast. Die App nur zu öffnen reicht nicht. Die Lernzeit läuft nur, solange du die App wirklich benutzt (Tab sichtbar, in den letzten 90 Sekunden aktiv).
        </div>
      </div>
    </>
  );
}
