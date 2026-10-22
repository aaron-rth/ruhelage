// Schreibaufgaben mit Operator: frei formulieren, mit dem Erwartungshorizont vergleichen, Selbstcheck.
// Über den Info-Knopf gibt es die Operator-Erklärung und einen fertigen Prompt für eine KI-Korrektur.
import { useState } from 'react';
import { kursVonThema } from '../../content/kurse';
import { operatorVon } from '../../content/operatoren';
import type { SchreibUebung } from '../../content/types';
import { kiPrompt, punkteSumme } from '../../lib/kiPrompt';
import { liesGemerkt, useGemerkt } from '../../store/laufend';
import { Md, Meldung } from '../Basis';
import { Dialog } from '../Dialog';
import { Icon } from '../Icon';

const textKey = (id: string) => `schreiben:${id}`;
const WERTUNG = [
  { wert: 0, text: 'fehlt' },
  { wert: 0.5, text: 'teilweise' },
  { wert: 1, text: 'erfüllt' },
];

export function woerter(text: string): number {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

/** Operator-Chip mit Info-Knopf – zeigt an, dass es einen KI-Prompt gibt. */
export function OperatorKopf({ u, themaId }: { u: SchreibUebung; themaId: string }) {
  const [offen, setOffen] = useState(false);
  const op = operatorVon(u.operator);
  return (
    <>
      <button type="button" className="operator-knopf" onClick={() => setOffen(true)} aria-haspopup="dialog">
        <span className="chip akzent">{op?.name ?? u.operator}</span>
        <span className="operator-hinweis">
          <Icon name="info" size={15} /> Operator · <Icon name="funke" size={13} /> KI-Prompt
        </span>
      </button>
      {offen && <OperatorInfo u={u} themaId={themaId} onZu={() => setOffen(false)} />}
    </>
  );
}

export function OperatorInfo({ u, themaId, onZu }: { u: SchreibUebung; themaId: string; onZu: () => void }) {
  const op = operatorVon(u.operator);
  const kurs = kursVonThema(themaId) ?? { fach: '', klasse: '' };
  const antwort = liesGemerkt<string>(textKey(u.id)) ?? '';
  const prompt = kiPrompt(u, kurs, antwort);
  const [kopiert, setKopiert] = useState<null | 'ok' | 'fehler'>(null);
  const [zeigen, setZeigen] = useState(false);

  async function kopieren() {
    try {
      await navigator.clipboard.writeText(prompt);
      setKopiert('ok');
    } catch {
      setKopiert('fehler');
      setZeigen(true);
    }
  }

  return (
    <Dialog titel={op ? `Operator „${op.name}“` : 'Operator'} ueber={op ? `Anforderungsbereich ${op.afb}` : undefined} onSchliessen={onZu}>
      <div className="stapel">
        {op && (
          <div className="operator-info">
            <p>{op.bedeutung}</p>
            <p className="leise klein">
              <strong>So gelingt es:</strong> {op.tipp}
            </p>
          </div>
        )}
        <div className="ki-box">
          <h3>
            <Icon name="funke" size={18} /> Von einer KI bewerten lassen
          </h3>
          <p className="leise klein">
            Kopier den Prompt und füg ihn in eine KI deiner Wahl ein (z. B. Claude oder ChatGPT). Er enthält Aufgabe, Operator, Erwartungshorizont und Bewertungskriterien – die KI korrigiert dann wie eine Lehrkraft nach diesen Kriterien.
          </p>
          <p className="leise klein">
            {antwort.trim() ? (
              <>
                Deine Antwort ({woerter(antwort)} Wörter) ist schon eingefügt.
              </>
            ) : (
              <>
                Du hast noch nichts in das Antwortfeld geschrieben – ersetze im Prompt <code>[HIER DEINE ANTWORT EINFÜGEN]</code> durch deinen Text (oder ein Foto deiner Heftseite).
              </>
            )}{' '}
            Achtung: Der Prompt enthält den Erwartungshorizont – erst schreiben, dann kopieren.
          </p>
          <div className="zeile" style={{ gap: 8, flexWrap: 'wrap' }}>
            <button type="button" className="btn primaer" onClick={kopieren}>
              <Icon name={kopiert === 'ok' ? 'check' : 'kopieren'} size={16} /> {kopiert === 'ok' ? 'Kopiert' : 'Prompt kopieren'}
            </button>
            <button type="button" className="btn geist" onClick={() => setZeigen((z) => !z)} aria-expanded={zeigen}>
              <Icon name="auge" size={16} /> {zeigen ? 'Prompt ausblenden' : 'Prompt ansehen'}
            </button>
          </div>
          {kopiert === 'fehler' && <Meldung art="info">Kopieren ging nicht automatisch – markier den Text unten und kopier ihn selbst.</Meldung>}
          {zeigen && <textarea className="eingabe ki-prompt" readOnly value={prompt} rows={12} onFocus={(e) => e.currentTarget.select()} aria-label="KI-Prompt" />}
          <p className="sehr-leise klein">Gib keine persönlichen Daten in die KI ein. Die Bewertung einer KI kann danebenliegen – im Zweifel zählt deine Lehrkraft.</p>
        </div>
      </div>
    </Dialog>
  );
}

export function Schreiben({ u, themaId, geprueft, onPruefen }: { u: SchreibUebung; themaId: string; geprueft: boolean | null; onPruefen: (richtig: boolean) => void }) {
  const [text, setText] = useGemerkt<string>(textKey(u.id), () => '');
  const [vergleich, setVergleich] = useState(false);
  const [wertung, setWertung] = useState<(number | null)[]>(() => u.kriterien.map(() => null));
  const [ki, setKi] = useState(false);
  const fertig = geprueft !== null;
  const summe = punkteSumme(u);
  const punkte = u.kriterien.reduce((a, k, i) => a + k.punkte * (wertung[i] ?? 0), 0);
  const n = woerter(text);

  return (
    <>
      {u.material && (
        <div className="material">
          <span className="ueber-klein">Material</span>
          <Md text={u.material} className="prosa" />
        </div>
      )}
      <label className="schreib-label" htmlFor={`schreiben-${u.id}`}>
        <span className="ueber-klein">Deine Antwort</span>
        <span className="sehr-leise klein">
          {u.umfang ? `${u.umfang} · ` : ''}
          {n} {n === 1 ? 'Wort' : 'Wörter'}
        </span>
      </label>
      <textarea
        id={`schreiben-${u.id}`}
        className="eingabe schreib-feld"
        value={text}
        readOnly={vergleich}
        rows={9}
        placeholder="Schreib hier – oder im Heft und vergleiche danach."
        onChange={(e) => setText(e.target.value)}
      />

      {!vergleich && (
        <div className="aktionen">
          <button type="button" className="btn primaer" onClick={() => setVergleich(true)}>
            <Icon name="check" size={16} /> Fertig – mit Erwartungshorizont vergleichen
          </button>
        </div>
      )}

      {vergleich && (
        <div className="stapel einblenden">
          <div className="erwartung">
            <h4>Das gehört in eine gute Antwort</h4>
            <ul>
              {u.erwartung.map((e, i) => (
                <li key={i}>
                  <Md text={e} inline />
                </li>
              ))}
            </ul>
          </div>
          <div className="selbstcheck">
            <h4>Selbstcheck</h4>
            {u.kriterien.map((k, i) => (
              <div key={i} className="klass-zeile">
                <div className="klass-text">
                  <strong>{k.name}</strong> <span className="sehr-leise klein">({k.punkte} P.)</span>
                  <span className="option-warum">
                    <Md text={k.beschreibung} inline />
                  </span>
                </div>
                <div className="segment" role="radiogroup" aria-label={k.name}>
                  {WERTUNG.map((w) => (
                    <button
                      key={w.wert}
                      type="button"
                      role="radio"
                      aria-checked={wertung[i] === w.wert}
                      className={wertung[i] === w.wert ? 'an' : ''}
                      disabled={fertig}
                      onClick={() => setWertung((alt) => alt.map((x, j) => (j === i ? w.wert : x)))}
                    >
                      {w.text}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          {fertig ? (
            <Meldung art={geprueft ? 'richtig' : 'falsch'}>
              <strong>
                {punkte.toLocaleString('de-DE')} von {summe} Punkten
              </strong>{' '}
              nach deinem Selbstcheck. {geprueft ? 'Gut gemacht.' : 'Schau dir die fehlenden Punkte nochmal an – die Aufgabe landet im Nochmal-Stapel.'}
            </Meldung>
          ) : (
            <div className="aktionen">
              <button type="button" className="btn primaer" disabled={wertung.some((w) => w === null)} onClick={() => onPruefen(punkte >= summe * 0.6)}>
                Auswerten
              </button>
              <button type="button" className="btn geist" onClick={() => setVergleich(false)}>
                Weiter schreiben
              </button>
            </div>
          )}
          <button type="button" className="ki-hinweis" onClick={() => setKi(true)}>
            <Icon name="funke" size={16} />
            <span>
              <strong>Genauer bewerten lassen?</strong> Kopier den fertigen Prompt mit deiner Antwort in eine KI.
            </span>
            <Icon name="rechts" size={16} className="sehr-leise" />
          </button>
        </div>
      )}
      {ki && <OperatorInfo u={u} themaId={themaId} onZu={() => setKi(false)} />}
    </>
  );
}
