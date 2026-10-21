// Lernsitzung: arbeitet eine Liste aus Karten, Übungen und Aufgaben nacheinander ab.
// Der Stand liegt im „laufend“-Speicher – so bleibt man beim Tab- oder Seitenwechsel an derselben Stelle.
import { useEffect, useMemo } from 'react';
import { findeGenerator, findeKarte, findeUebung } from '../content/kurse';
import { heute } from '../lib/datum';
import { genKey, uebKey } from '../lib/fortschritt';
import type { Bewertung } from '../lib/leitner';
import {
  ergebnisMerken,
  kannZurueck,
  karteBewerten,
  neueSitzung,
  standText,
  weiter,
  zurueck,
  type SitzungsBilanz,
  type SitzungsItem,
  type SitzungsStand,
} from '../lib/sitzung';
import { useLaufend, type AktuellArt } from '../store/laufend';
import { useStore } from '../store/store';
import { AufgabenAnsicht } from './AufgabenAnsicht';
import { Balken, Leer, Taste } from './Basis';
import { Icon } from './Icon';
import { KartenAnsicht } from './KartenAnsicht';
import { UebungAnsicht } from './uebungen/UebungAnsicht';

export type { SitzungsBilanz, SitzungsItem } from '../lib/sitzung';

export interface SitzungsInfo {
  art: AktuellArt;
  titel: string;
  pfad: string;
}

const merkKey = (slot: string) => `sitzung:${slot}`;

function aktuellAus(slot: string, info: SitzungsInfo, s: SitzungsStand) {
  return { key: slot, ...info, stand: standText(s), anteil: s.pos / Math.max(1, s.items.length) };
}

export function starteSitzung(slot: string, items: SitzungsItem[], info: SitzungsInfo) {
  const l = useLaufend.getState();
  const s = neueSitzung(items, heute());
  l.vergiss(`aufgabe:${slot}:`);
  l.merke(merkKey(slot), { ...s, info });
  l.setzeAktuell(aktuellAus(slot, info, s));
}

export function beendeSitzung(slot: string) {
  const l = useLaufend.getState();
  l.vergiss(merkKey(slot));
  l.vergiss(`aufgabe:${slot}:`);
  l.entferneAktuell(slot);
}

type GespeicherteSitzung = SitzungsStand & { info: SitzungsInfo };

/** Laufende (nicht beendete) Sitzung in diesem Slot – optional nur, wenn sie heute begonnen wurde. */
export function useSitzungsStand(slot: string, nurHeute = false): GespeicherteSitzung | undefined {
  const s = useLaufend((st) => st.merk[merkKey(slot)]?.wert as GespeicherteSitzung | undefined);
  if (!s || s.fertig || !Array.isArray(s.items) || s.items.length === 0) return undefined;
  if (nurHeute && s.datum !== heute()) return undefined;
  return s;
}

export function setzePausiert(slot: string, pausiert: boolean) {
  const l = useLaufend.getState();
  const s = l.merk[merkKey(slot)]?.wert as GespeicherteSitzung | undefined;
  if (s) l.merke(merkKey(slot), { ...s, pausiert });
}

export function Sitzung({
  slot,
  nochmalModus,
  onEnde,
}: {
  slot: string;
  /** Richtige Antworten entfernen Einträge aus dem Nochmal-Stapel */
  nochmalModus?: boolean;
  onEnde: (b: SitzungsBilanz) => void;
}) {
  const stand = useSitzungsStand(slot);
  const merke = useLaufend((s) => s.merke);
  const setzeAktuell = useLaufend((s) => s.setzeAktuell);
  const entferneNochmal = useStore((s) => s.entferneNochmal);
  const bewerteKarte = useStore((s) => s.bewerteKarte);

  const item = stand?.items[stand.pos];
  const inhalt = useMemo(() => {
    if (!item) return null;
    if (item.art === 'karte') return findeKarte(item.id);
    if (item.art === 'uebung') return findeUebung(item.id);
    return findeGenerator(item.id);
  }, [item]);

  function setze(neu: SitzungsStand) {
    if (!stand) return;
    if (neu.fertig) {
      beendeSitzung(slot);
      onEnde(neu.bilanz);
      return;
    }
    merke(merkKey(slot), { ...neu, info: stand.info });
    setzeAktuell(aktuellAus(slot, stand.info, neu));
  }

  function karteBewertet(b: Bewertung) {
    if (!stand || !item || item.art !== 'karte' || !inhalt || !('karte' in inhalt)) return;
    const alt = stand.bewertet[stand.pos];
    const vorher = useStore.getState().karten[item.id] ?? null;
    bewerteKarte(item.id, inhalt.thema.id, b, alt ? { vorher: alt.vorher } : undefined);
    setze(karteBewerten(stand, b, vorher));
  }

  function ergebnis(richtig: boolean) {
    if (!stand || !item) return;
    setze(ergebnisMerken(stand, richtig));
    if (richtig && nochmalModus) {
      if (item.art === 'uebung') entferneNochmal(uebKey(item.id));
      if (item.art === 'aufgabe') entferneNochmal(`${genKey(item.id)}:${item.seed}`);
    }
  }

  // ← / → blättern (nicht beim Tippen)
  useEffect(() => {
    if (!stand) return;
    function onKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || e.altKey || e.metaKey || e.ctrlKey) return;
      if (e.key === 'ArrowLeft' && stand && kannZurueck(stand)) {
        e.preventDefault();
        setze(zurueck(stand));
      }
      if (e.key === 'ArrowRight' && stand) {
        e.preventDefault();
        setze(weiter(stand));
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  if (!stand || !item || !inhalt) {
    return <Leer titel="Nichts zu tun">Diese Sitzung ist leer.</Leer>;
  }

  const gesamt = stand.items.length;
  const erledigt = stand.erledigt.includes(stand.pos);
  const frueher = stand.bewertet[stand.pos]?.b;
  const istLetztes = stand.pos + 1 >= gesamt;

  return (
    <div className="sitzung">
      <div className="sitzung-kopf">
        <button type="button" className="btn geist klein" onClick={() => setzePausiert(slot, true)} title="Später an derselben Stelle weitermachen">
          <Icon name="pause" size={16} /> Pause
        </button>
        <div className="sitzung-fortschritt">
          <span className="sehr-leise klein">{stand.info.titel}</span>
          <Balken wert={stand.pos / gesamt} duenn label="Fortschritt der Sitzung" />
        </div>
        <span className="mono sehr-leise klein">
          {Math.min(stand.pos + 1, gesamt)} / {gesamt}
        </span>
      </div>
      <div className="sitzung-thema sehr-leise klein">
        <Icon name={item.art === 'karte' ? 'karten' : item.art === 'uebung' ? 'stift' : 'rechner'} size={14} />
        {'thema' in inhalt ? `Thema ${inhalt.thema.nr} · ${inhalt.thema.titel}` : ''}
      </div>

      {item.art === 'karte' && 'karte' in inhalt && (
        <KartenAnsicht key={`${stand.pos}-${item.id}`} karte={inhalt.karte} themaId={inhalt.thema.id} onBewertet={karteBewertet} frueher={frueher} />
      )}
      {item.art === 'uebung' && 'uebung' in inhalt && (
        <div className="panel">
          <UebungAnsicht key={`${stand.pos}-${item.id}`} uebung={inhalt.uebung} themaId={inhalt.thema.id} onFertig={ergebnis} onWeiter={() => setze(weiter(stand))} />
        </div>
      )}
      {item.art === 'aufgabe' && 'generator' in inhalt && (
        <div className="panel">
          <AufgabenAnsicht
            key={`${stand.pos}-${item.id}-${item.seed}`}
            generator={inhalt.generator}
            themaId={inhalt.thema.id}
            seed={item.seed}
            speicherKey={`aufgabe:${slot}:${stand.pos}`}
            onFertig={(e) => ergebnis(e.richtig)}
          />
          {erledigt && (
            <div className="aktionen">
              <button type="button" className="btn primaer" onClick={() => setze(weiter(stand))} autoFocus>
                Weiter <Taste>Enter</Taste>
              </button>
            </div>
          )}
        </div>
      )}

      <div className="sitzung-nav">
        <button type="button" className="btn geist klein" onClick={() => setze(zurueck(stand))} disabled={!kannZurueck(stand)} aria-label="Vorherige Karte">
          <Icon name="links" size={16} /> Vorherige <Taste>←</Taste>
        </button>
        <button type="button" className="btn geist klein" onClick={() => setze(weiter(stand))} aria-label={istLetztes ? 'Sitzung beenden' : 'Nächste'}>
          {istLetztes ? 'Beenden' : frueher || erledigt ? 'Nächste' : 'Überspringen'} <Taste>→</Taste> <Icon name="rechts" size={16} />
        </button>
      </div>
    </div>
  );
}

export function SitzungsEnde({ bilanz, onFertig, extra }: { bilanz: SitzungsBilanz; onFertig: () => void; extra?: React.ReactNode }) {
  const k = bilanz.karten;
  const kGesamt = k.gewusst + k.halb + k.nicht;
  return (
    <div className="panel sitzungs-ende einblenden">
      <Icon name="welle" size={36} className="akzent-icon" />
      <h2>Geschafft.</h2>
      <p className="leise">Schön, dass du drangeblieben bist. Hier ist dein kurzer Überblick:</p>
      <div className="bilanz">
        {kGesamt > 0 && (
          <div>
            <span className="bilanz-zahl">{kGesamt}</span>
            <span className="sehr-leise klein">Karten</span>
            <span className="klein">
              <span className="status-punkt kann" /> {k.gewusst} &nbsp; <span className="status-punkt halb" /> {k.halb} &nbsp; <span className="status-punkt nicht" /> {k.nicht}
            </span>
          </div>
        )}
        {bilanz.aufgaben.gesamt > 0 && (
          <div>
            <span className="bilanz-zahl">
              {bilanz.aufgaben.richtig}/{bilanz.aufgaben.gesamt}
            </span>
            <span className="sehr-leise klein">Aufgaben sauber gelöst</span>
          </div>
        )}
      </div>
      {extra}
      <button type="button" className="btn primaer" onClick={onFertig} autoFocus>
        Zurück zur Übersicht
      </button>
    </div>
  );
}

/** Hinweis „Du warst bei Karte 7 von 26“ mit Weitermachen / Neu anfangen. */
export function PausenKarte({ slot, stand, onNeu }: { slot: string; stand: GespeicherteSitzung; onNeu?: () => void }) {
  return (
    <div className="panel pausen-karte einblenden">
      <div className="zeile zwischen">
        <div>
          <span className="ueber-klein">Angefangen</span>
          <h3 style={{ margin: '2px 0 4px' }}>{stand.info.titel}</h3>
          <span className="sehr-leise klein">{standText(stand)}</span>
        </div>
        <div className="zeile">
          <button className="btn primaer" onClick={() => setzePausiert(slot, false)}>
            <Icon name="play" size={16} /> Weitermachen
          </button>
          <button
            className="btn geist"
            onClick={() => {
              beendeSitzung(slot);
              onNeu?.();
            }}
          >
            Verwerfen
          </button>
        </div>
      </div>
      <Balken wert={stand.pos / Math.max(1, stand.items.length)} duenn />
    </div>
  );
}
