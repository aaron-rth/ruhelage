// Große, deutliche Rückfrage vor unwiderruflichem Löschen: Was passiert, was bleibt –
// und man muss das Wort LÖSCHEN eintippen, damit der Knopf aktiv wird.
import { useState, type ReactNode } from 'react';
import { Dialog } from './Dialog';
import { Icon } from './Icon';

const WORT = 'LÖSCHEN';

export function LoeschDialog({
  titel,
  weg,
  bleibt,
  knopf,
  onLoeschen,
  onZu,
}: {
  titel: string;
  /** was unwiderruflich gelöscht wird */
  weg: ReactNode[];
  /** was erhalten bleibt */
  bleibt?: ReactNode[];
  knopf: string;
  onLoeschen: () => void | Promise<void>;
  onZu: () => void;
}) {
  const [eingabe, setEingabe] = useState('');
  const [laeuft, setLaeuft] = useState(false);
  const ok = eingabe.trim().toUpperCase() === WORT;

  return (
    <Dialog titel={titel} ueber="Endgültig löschen" onSchliessen={onZu}>
      <div className="stapel loesch-dialog">
        <div className="loesch-warnung">
          <Icon name="muell" size={26} />
          <strong>Das lässt sich nicht rückgängig machen.</strong>
        </div>
        <div>
          <h4>Wird gelöscht</h4>
          <ul className="loesch-liste weg">
            {weg.map((x, i) => (
              <li key={i}>
                <Icon name="x" size={15} /> <span>{x}</span>
              </li>
            ))}
          </ul>
        </div>
        {bleibt && bleibt.length > 0 && (
          <div>
            <h4>Bleibt erhalten</h4>
            <ul className="loesch-liste bleibt">
              {bleibt.map((x, i) => (
                <li key={i}>
                  <Icon name="check" size={15} /> <span>{x}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        <label className="stapel" style={{ gap: 6 }}>
          <span className="klein">
            Zum Bestätigen <strong>{WORT}</strong> eintippen:
          </span>
          <input className="eingabe" value={eingabe} onChange={(e) => setEingabe(e.target.value)} autoComplete="off" autoCapitalize="characters" spellCheck={false} placeholder={WORT} aria-label={`Zum Bestätigen ${WORT} eintippen`} />
        </label>
        <div className="loesch-knoepfe">
          <button type="button" className="btn primaer" onClick={onZu} autoFocus>
            Nein, behalten
          </button>
          <button
            type="button"
            className="btn gefahr"
            disabled={!ok || laeuft}
            onClick={async () => {
              setLaeuft(true);
              try {
                await onLoeschen();
              } finally {
                setLaeuft(false);
              }
            }}
          >
            <Icon name="muell" size={16} /> {laeuft ? 'Wird gelöscht …' : knopf}
          </button>
        </div>
      </div>
    </Dialog>
  );
}
