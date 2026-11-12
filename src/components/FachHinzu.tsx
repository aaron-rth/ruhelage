// „Fach hinzufügen“: Stufe wählen, dann aus den vorhandenen Kursen wählen. Fehlt das Fach, geht es zur Anfrage.
import { useState } from 'react';
import { KURSE } from '../content/kurse';
import { useNavigate } from 'react-router-dom';
import { legeFachAn } from '../lib/eigene';
import { fuegeKursHinzu, useMeineKurse } from '../lib/kurs';
import { Dialog } from './Dialog';
import { Icon } from './Icon';

/** „K1 · LF“ → „K1“ */
const stufeVon = (klasse: string) => klasse.split('·')[0].trim();

export { stufeVon };

export function FachHinzu({ onZu, onAnfrage }: { onZu: () => void; onAnfrage: () => void }) {
  const { laufend, fertig } = useMeineKurse();
  const echte = KURSE.filter((k) => !k.beispiel);
  // eigene Fächer gehören immer zu „Meine Fächer“ – hier nur wieder aufnehmen, falls als fertig markiert
  const stufen = [...new Set(echte.map((k) => stufeVon(k.klasse)))].sort();
  const [stufe, setStufe] = useState<string>('alle');
  const [eigen, setEigen] = useState(false);
  const [name, setName] = useState('');
  const [stufeEigen, setStufeEigen] = useState('');
  const navigate = useNavigate();
  const vorhanden = new Set(laufend.map((k) => k.id));
  const istFertig = new Set(fertig.map((k) => k.id));
  const angebot = echte.filter((k) => !vorhanden.has(k.id) && (stufe === 'alle' || stufeVon(k.klasse) === stufe));

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
        <div className="eigenes-anlegen">
          {!eigen ? (
            <button type="button" className="fach-reihe fach-neu" onClick={() => setEigen(true)}>
              <span className="modus-icon">
                <Icon name="karten" size={20} />
              </span>
              <span className="fach-reihe-text">
                <strong>Eigenes Karteikarten-Fach</strong>
                <span className="sehr-leise klein">z. B. Englisch-Vokabeln – Karten selbst eintippen</span>
              </span>
              <Icon name="plus" size={18} className="sehr-leise" />
            </button>
          ) : (
            <form
              className="stapel eigenes-form"
              onSubmit={(e) => {
                e.preventDefault();
                if (!name.trim()) return;
                const { fachId, setId } = legeFachAn(name, stufeEigen);
                fuegeKursHinzu(fachId);
                onZu();
                navigate(`/eigen/${fachId}/${setId}`);
              }}
            >
              <strong>Eigenes Karteikarten-Fach</strong>
              <div className="zeile" style={{ gap: 6, flexWrap: 'nowrap' }}>
                <input className="eingabe" style={{ flex: 1, minWidth: 0 }} value={name} onChange={(e) => setName(e.target.value)} placeholder="Name, z. B. Englisch" autoFocus aria-label="Name des Fachs" />
                <input className="eingabe" style={{ width: 90 }} value={stufeEigen} onChange={(e) => setStufeEigen(e.target.value)} placeholder="Stufe" aria-label="Stufe (optional)" />
              </div>
              <button type="submit" className="btn primaer" disabled={!name.trim()}>
                Anlegen und Karten eintippen <Icon name="rechts" size={16} />
              </button>
            </form>
          )}
        </div>
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
