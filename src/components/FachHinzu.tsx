// „Fach hinzufügen“: Stufe wählen, dann aus den vorhandenen Kursen wählen. Fehlt das Fach, geht es zur Anfrage.
import { useState } from 'react';
import { KURSE } from '../content/kurse';
import { fuegeKursHinzu, useMeineKurse } from '../lib/kurs';
import { Dialog } from './Dialog';
import { Icon } from './Icon';

/** „K1 · LF“ → „K1“ */
const stufeVon = (klasse: string) => klasse.split('·')[0].trim();

export function FachHinzu({ onZu, onAnfrage }: { onZu: () => void; onAnfrage: () => void }) {
  const { laufend, fertig } = useMeineKurse();
  const stufen = [...new Set(KURSE.map((k) => stufeVon(k.klasse)))].sort();
  const [stufe, setStufe] = useState<string>('alle');
  const vorhanden = new Set(laufend.map((k) => k.id));
  const istFertig = new Set(fertig.map((k) => k.id));
  const angebot = KURSE.filter((k) => !vorhanden.has(k.id) && (stufe === 'alle' || stufeVon(k.klasse) === stufe));

  return (
    <Dialog titel="Fach hinzufügen" onSchliessen={onZu}>
      <div className="stapel">
        <div className="segment stufen-wahl" role="radiogroup" aria-label="Klassenstufe">
          {['alle', ...stufen].map((s) => (
            <button key={s} type="button" role="radio" aria-checked={stufe === s} className={stufe === s ? 'an' : ''} onClick={() => setStufe(s)}>
              {s === 'alle' ? 'Alle Stufen' : s}
            </button>
          ))}
        </div>
        {angebot.length === 0 ? (
          <p className="leise klein" style={{ margin: 0 }}>
            {stufe === 'alle' ? 'Du hast schon alle verfügbaren Fächer.' : 'Für diese Stufe gibt es noch keine weiteren Fächer.'}
          </p>
        ) : (
          <ul className="fach-angebot">
            {angebot.map((k) => (
              <li key={k.id}>
                <button
                  type="button"
                  className="fach-reihe"
                  onClick={() => {
                    fuegeKursHinzu(k.id);
                    onZu();
                  }}
                >
                  <span className="modus-icon">
                    <Icon name={k.fach === 'Physik' ? 'welle' : 'buch'} size={20} />
                  </span>
                  <span className="fach-reihe-text">
                    <span className="fach-name">
                      <strong>{k.fach}</strong>
                      <span className="chip klein-chip">{k.klasse}</span>
                    </span>
                    <span className="sehr-leise klein">
                      {k.titel}
                      {istFertig.has(k.id) ? ' · als fertig markiert' : ''}
                    </span>
                  </span>
                  <Icon name="plus" size={18} className="sehr-leise" />
                </button>
              </li>
            ))}
          </ul>
        )}
        <div className="fach-fehlt">
          <span className="leise klein">Dein Fach ist nicht dabei?</span>
          <button type="button" className="btn geist klein" onClick={onAnfrage}>
            <Icon name="plus" size={16} /> Fach anfragen
          </button>
        </div>
      </div>
    </Dialog>
  );
}
