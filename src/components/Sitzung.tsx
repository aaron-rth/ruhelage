// Lernsitzung: arbeitet eine Liste aus Karten, Übungen und Aufgaben nacheinander ab.
import { useMemo, useState } from 'react';
import { findeGenerator, findeKarte, findeUebung } from '../content/kurse';
import { genKey, uebKey } from '../lib/fortschritt';
import type { Bewertung } from '../lib/leitner';
import { useStore } from '../store/store';
import { AufgabenAnsicht } from './AufgabenAnsicht';
import { Balken, Leer, Taste } from './Basis';
import { Icon } from './Icon';
import { KartenAnsicht } from './KartenAnsicht';
import { UebungAnsicht } from './uebungen/UebungAnsicht';

export type SitzungsItem = { art: 'karte'; id: string } | { art: 'uebung'; id: string } | { art: 'aufgabe'; id: string; seed: number };

export interface SitzungsBilanz {
  karten: { gewusst: number; halb: number; nicht: number };
  aufgaben: { richtig: number; gesamt: number };
}

export function Sitzung({
  items: start,
  titel,
  nochmalModus,
  onEnde,
  onAbbrechen,
}: {
  items: SitzungsItem[];
  titel: string;
  /** Richtige Antworten entfernen Einträge aus dem Nochmal-Stapel */
  nochmalModus?: boolean;
  onEnde: (b: SitzungsBilanz) => void;
  onAbbrechen: () => void;
}) {
  const [items, setItems] = useState(start);
  const [pos, setPos] = useState(0);
  const [itemFertig, setItemFertig] = useState(false);
  const [bilanz, setBilanz] = useState<SitzungsBilanz>({ karten: { gewusst: 0, halb: 0, nicht: 0 }, aufgaben: { richtig: 0, gesamt: 0 } });
  const [wiederholt] = useState(() => new Set<string>());
  const entferneNochmal = useStore((s) => s.entferneNochmal);

  const item = items[pos];
  const gesamt = items.length;

  const inhalt = useMemo(() => {
    if (!item) return null;
    if (item.art === 'karte') return findeKarte(item.id);
    if (item.art === 'uebung') return findeUebung(item.id);
    return findeGenerator(item.id);
  }, [item]);

  function naechstes(b = bilanz) {
    setItemFertig(false);
    if (pos + 1 >= items.length) onEnde(b);
    else setPos(pos + 1);
  }

  function karteBewertet(r: Bewertung) {
    const b = { ...bilanz, karten: { ...bilanz.karten, [r]: bilanz.karten[r] + 1 } };
    setBilanz(b);
    // „nicht gewusst“ kommt am Ende der Sitzung noch einmal
    if (r === 'nicht' && item && !wiederholt.has(item.id)) {
      wiederholt.add(item.id);
      setItems((alt) => [...alt, item]);
      setPos(pos + 1);
      setItemFertig(false);
      return;
    }
    naechstes(b);
  }

  function ergebnis(richtig: boolean) {
    setBilanz((b) => ({ ...b, aufgaben: { richtig: b.aufgaben.richtig + (richtig ? 1 : 0), gesamt: b.aufgaben.gesamt + 1 } }));
    setItemFertig(true);
    if (richtig && nochmalModus && item) {
      if (item.art === 'uebung') entferneNochmal(uebKey(item.id));
      if (item.art === 'aufgabe') entferneNochmal(`${genKey(item.id)}:${item.seed}`);
    }
  }

  if (!item || !inhalt) {
    return <Leer titel="Nichts zu tun">Diese Sitzung ist leer.</Leer>;
  }

  return (
    <div className="sitzung">
      <div className="sitzung-kopf">
        <button type="button" className="btn geist klein" onClick={onAbbrechen}>
          <Icon name="links" size={16} /> Beenden
        </button>
        <div className="sitzung-fortschritt">
          <span className="sehr-leise klein">{titel}</span>
          <Balken wert={pos / gesamt} duenn label="Fortschritt der Sitzung" />
        </div>
        <span className="mono sehr-leise klein">
          {Math.min(pos + 1, gesamt)} / {gesamt}
        </span>
      </div>
      <div className="sitzung-thema sehr-leise klein">
        <Icon name={item.art === 'karte' ? 'karten' : item.art === 'uebung' ? 'stift' : 'rechner'} size={14} />
        {'thema' in inhalt ? `Thema ${inhalt.thema.nr} · ${inhalt.thema.titel}` : ''}
      </div>

      {item.art === 'karte' && 'karte' in inhalt && (
        <KartenAnsicht key={`${pos}-${item.id}`} karte={inhalt.karte} themaId={inhalt.thema.id} onBewertet={karteBewertet} />
      )}
      {item.art === 'uebung' && 'uebung' in inhalt && (
        <div className="panel">
          <UebungAnsicht key={`${pos}-${item.id}`} uebung={inhalt.uebung} themaId={inhalt.thema.id} onFertig={ergebnis} onWeiter={() => naechstes()} />
        </div>
      )}
      {item.art === 'aufgabe' && 'generator' in inhalt && (
        <div className="panel">
          <AufgabenAnsicht key={`${pos}-${item.id}-${item.seed}`} generator={inhalt.generator} themaId={inhalt.thema.id} seed={item.seed} onFertig={(e) => ergebnis(e.richtig)} />
          {itemFertig && (
            <div className="aktionen">
              <button type="button" className="btn primaer" onClick={() => naechstes()} autoFocus>
                Weiter <Taste>Enter</Taste>
              </button>
            </div>
          )}
        </div>
      )}
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
