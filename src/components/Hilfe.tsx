// „Hilfe & Feedback“: Fehler melden, Idee oder Frage schicken – per vorausgefüllter Mail.
import { useState } from 'react';
import { create } from 'zustand';
import { SUPPORT_EMAIL } from '../config';
import { supportLink, technikInfo, type MeldungsArt } from '../lib/fehler';
import { Meldung } from './Basis';
import { Dialog } from './Dialog';
import { Icon } from './Icon';

export const useHilfe = create<{ offen: boolean; art: MeldungsArt }>()(() => ({ offen: false, art: 'fehler' }));
export const oeffneHilfe = (art: MeldungsArt = 'fehler') => useHilfe.setState({ offen: true, art });

const ARTEN: { id: MeldungsArt; label: string; icon: string; platzhalter: string }[] = [
  { id: 'fehler', label: 'Fehler', icon: 'x', platzhalter: 'Was ist passiert? Was hast du davor gemacht?' },
  { id: 'idee', label: 'Idee', icon: 'funke', platzhalter: 'Was würde dir helfen?' },
  { id: 'frage', label: 'Frage', icon: 'info', platzhalter: 'Was möchtest du wissen?' },
];

export function HilfeDialog() {
  const { offen, art } = useHilfe();
  const [text, setText] = useState('');
  const [mitInfo, setMitInfo] = useState(true);
  const [zeigeInfo, setZeigeInfo] = useState(false);
  const [gesendet, setGesendet] = useState(false);
  if (!offen) return null;
  const zu = () => {
    useHilfe.setState({ offen: false });
    setGesendet(false);
  };
  const a = ARTEN.find((x) => x.id === art)!;

  if (!SUPPORT_EMAIL)
    return (
      <Dialog titel="Hilfe & Feedback" onSchliessen={zu}>
        <p className="leise">Der Kontakt ist noch nicht eingerichtet.</p>
      </Dialog>
    );

  return (
    <Dialog titel="Hilfe & Feedback" ueber="Schreib mir" onSchliessen={zu}>
      <div className="stapel">
        <div className="segment" role="radiogroup" aria-label="Art der Meldung">
          {ARTEN.map((x) => (
            <button key={x.id} type="button" role="radio" aria-checked={art === x.id} className={art === x.id ? 'an' : ''} onClick={() => useHilfe.setState({ art: x.id })}>
              <Icon name={x.icon} size={15} /> {x.label}
            </button>
          ))}
        </div>
        <textarea className="eingabe hilfe-text" rows={5} value={text} onChange={(e) => setText(e.target.value)} placeholder={a.platzhalter} aria-label="Deine Nachricht" />
        <label className="hilfe-info">
          <input type="checkbox" checked={mitInfo} onChange={(e) => setMitInfo(e.target.checked)} />
          <span className="klein">
            Technische Infos anhängen (Version, Gerät, aktuelle Seite, letzte Fehlermeldungen – kein Lernfortschritt){' '}
            <button type="button" className="link-knopf" onClick={() => setZeigeInfo((z) => !z)}>
              {zeigeInfo ? 'ausblenden' : 'ansehen'}
            </button>
          </span>
        </label>
        {zeigeInfo && <pre className="hilfe-technik">{technikInfo()}</pre>}
        <a className="btn primaer" href={supportLink(art, text, mitInfo)} onClick={() => setGesendet(true)}>
          <Icon name="rechts" size={16} /> In der Mail-App öffnen
        </a>
        {gesendet && <Meldung art="info">Deine Mail-App sollte sich geöffnet haben – dort nur noch auf Senden tippen. Danke!</Meldung>}
        <p className="sehr-leise klein" style={{ margin: 0 }}>
          Geht an {SUPPORT_EMAIL}. Öffnet sich keine Mail-App, schreib einfach direkt an diese Adresse.
        </p>
      </div>
    </Dialog>
  );
}
