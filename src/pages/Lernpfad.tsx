import { useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Ring, StatusWahl } from '../components/Basis';
import { Dialog } from '../components/Dialog';
import { EINFUEHRUNG } from '../components/Einfuehrung';
import { Icon } from '../components/Icon';
import { AKTIVER_KURS, findeThema } from '../content/kurse';
import type { Thema } from '../content/types';
import { heute, tageZwischen } from '../lib/datum';
import { statusVon, themaFortschritt } from '../lib/fortschritt';
import { useStore } from '../store/store';

interface Linie {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  key: string;
}

function Knoten({ t }: { t: Thema }) {
  const daten = useStore();
  const status = statusVon(t, daten);
  const f = themaFortschritt(t, daten, heute());
  return (
    <div className={`knoten status-${status}`} data-id={t.id}>
      <Link to={`/thema/${t.id}`} className="knoten-link">
        <span className="knoten-nr">{t.nr}</span>
        <span className="knoten-text">
          <span className="knoten-titel">
            {t.titel}
            {t.neu && <span className="chip akzent knoten-neu">neu</span>}
          </span>
          <span className="knoten-unter">{t.untertitel}</span>
        </span>
        <Ring wert={f.gesamt} groesse={34} staerke={3}>
          <span className="mono">{Math.round(f.gesamt * 100)}</span>
        </Ring>
      </Link>
      <div className="knoten-fuss">
        <StatusWahl wert={status} onChange={(s) => daten.setzeStatus(t.id, s)} kompakt />
        {f.kartenFaellig > 0 && (
          <span className="sehr-leise klein" title="fällige Karteikarten">
            <Icon name="karten" size={13} /> {f.kartenFaellig} fällig
          </span>
        )}
      </div>
    </div>
  );
}

const HINWEIS = 'lernpfad-einschaetzen';

function EinschaetzHinweis({ onZu }: { onZu: () => void }) {
  return (
    <Dialog
      titel="Schätz dich zuerst selbst ein"
      ueber="Kurzer Hinweis"
      onSchliessen={onZu}
      fuss={
        <button type="button" className="btn primaer" onClick={onZu} autoFocus>
          Verstanden
        </button>
      }
    >
      <p>
        Bei jedem Thema findest du unten drei Knöpfe. Klick an, wie sicher du dich gerade fühlst – ehrlich ist hier am hilfreichsten:
      </p>
      <ul className="einschaetz-liste">
        <li>
          <span className="status-knopf kann">
            <Icon name="check" size={15} />
          </span>
          <span>
            <strong>kann ich</strong> – das sitzt, nur noch ab und zu wiederholen
          </span>
        </li>
        <li>
          <span className="status-knopf halb">
            <Icon name="tilde" size={15} />
          </span>
          <span>
            <strong>so halb</strong> – grob verstanden, aber noch unsicher
          </span>
        </li>
        <li>
          <span className="status-knopf nicht">
            <Icon name="x" size={15} />
          </span>
          <span>
            <strong>kann ich nicht</strong> – hier brauche ich am meisten Übung
          </span>
        </li>
      </ul>
      <p className="leise klein">
        Die Tagesrunde nimmt dann zuerst Aufgaben aus deinen schwachen Themen. Du kannst die Einschätzung jederzeit ändern – der Ring zeigt zusätzlich, was deine Ergebnisse sagen.
      </p>
    </Dialog>
  );
}

export function Lernpfad() {
  const kurs = AKTIVER_KURS;
  const daten = useStore();
  const offen = kurs.themen.filter((t) => statusVon(t, daten) === 'offen').length;
  const zeigeHinweis = daten.einstellungen.hinweise && daten.gesehen.includes(EINFUEHRUNG) && !daten.gesehen.includes(HINWEIS) && offen > 0;
  const box = useRef<HTMLDivElement>(null);
  const [linien, setLinien] = useState<Linie[]>([]);
  const [groesse, setGroesse] = useState({ b: 0, h: 0 });
  const einst = useStore((s) => s.einstellungen);
  const rest = tageZwischen(heute(), einst.klausurDatum);

  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    const messen = () => {
      const r0 = el.getBoundingClientRect();
      const pos = new Map<string, DOMRect>();
      el.querySelectorAll<HTMLElement>('.knoten').forEach((k) => pos.set(k.dataset.id!, k.getBoundingClientRect()));
      const ls: Linie[] = [];
      for (const t of kurs.themen) {
        const ziel = pos.get(t.id);
        if (!ziel) continue;
        for (const dep of t.abhaengig) {
          const von = pos.get(dep);
          if (!von) continue;
          ls.push({
            key: `${dep}-${t.id}`,
            x1: von.left + von.width / 2 - r0.left,
            y1: von.bottom - r0.top,
            x2: ziel.left + ziel.width / 2 - r0.left,
            y2: ziel.top - r0.top,
          });
        }
      }
      setLinien(ls);
      setGroesse({ b: r0.width, h: r0.height });
    };
    messen();
    const ro = new ResizeObserver(messen);
    ro.observe(el);
    return () => ro.disconnect();
  }, [kurs]);

  return (
    <div className="inhalt">
      <div className="kopf">
        <div>
          <span className="ueber">Lernpfad</span>
          <h1>{kurs.titel}</h1>
          <p>Von oben nach unten bauen die Themen aufeinander auf. Deine Einschätzung ✓ ~ ✗ kannst du jederzeit ändern; der Ring zeigt, was deine Ergebnisse sagen.</p>
        </div>
        {einst.countdown && rest >= 0 && kurs.klausur && (
          <span className="chip">
            <Icon name="kalender" size={13} /> {kurs.klausur.titel}: noch {rest} {rest === 1 ? 'Tag' : 'Tage'}
          </span>
        )}
      </div>

      {offen > 0 && (
        <div className="hinweis-band einblenden">
          <Icon name="info" size={16} />
          <span>
            {offen === kurs.themen.length ? 'Noch kein Thema eingeschätzt.' : `Noch ${offen} ${offen === 1 ? 'Thema' : 'Themen'} nicht eingeschätzt.`} Klick bei jedem Thema auf ✓, ~ oder ✗ – danach richtet sich die Tagesrunde.
          </span>
        </div>
      )}

      <div className="pfad" ref={box}>
        <svg className="pfad-linien" width={groesse.b} height={groesse.h} aria-hidden>
          {linien.map((l) => {
            const my = (l.y1 + l.y2) / 2;
            return <path key={l.key} d={`M${l.x1},${l.y1} C${l.x1},${my} ${l.x2},${my} ${l.x2},${l.y2}`} />;
          })}
        </svg>
        {kurs.pfad.map((zeile, i) => (
          <div key={i} className={`pfad-zeile n${zeile.length}`}>
            {zeile.map((id) => {
              const t = findeThema(id);
              return t ? <Knoten key={id} t={t} /> : null;
            })}
          </div>
        ))}
      </div>

      <div className="legende sehr-leise klein">
        <span>
          <span className="status-punkt kann" /> kann ich
        </span>
        <span>
          <span className="status-punkt halb" /> so halb
        </span>
        <span>
          <span className="status-punkt nicht" /> kann ich nicht
        </span>
        <span>
          <span className="status-punkt offen" /> noch nicht eingeschätzt
        </span>
        <span>Ring = Fortschritt aus Karten und Aufgaben</span>
      </div>
      {zeigeHinweis && <EinschaetzHinweis onZu={() => daten.hinweisGesehen(HINWEIS)} />}
    </div>
  );
}
