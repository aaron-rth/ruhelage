// „Fach anfragen“: erklärt, welche Unterlagen gebraucht werden, und öffnet einen vorbereiteten E-Mail-Entwurf.
import { useState } from 'react';
import { ANFRAGE_EMAIL } from '../config';
import { Dialog } from './Dialog';
import { Icon } from './Icon';

const UNTERLAGEN = [
  'Fach und Klassenstufe',
  'Themenübersicht bzw. was in der Klausur drankommt (falls vorhanden)',
  'Fotos oder Scans deiner Unterrichtsaufschriebe',
  'Schulbuchseiten, Arbeitsblätter und Texte, die ihr benutzt',
  'Vorgaben der Lehrkraft (z. B. Operatoren, Bewertungskriterien) und den Klausurtermin',
];

function entwurf(fach: string, klasse: string): string {
  const betreff = `Ruhelage: Fach-Anfrage ${fach || '…'}${klasse ? ` (${klasse})` : ''}`;
  const text = [
    'Hallo,',
    '',
    `ich würde gern ${fach || '[Fach]'}${klasse ? ` für ${klasse}` : ''} mit Ruhelage lernen.`,
    '',
    'Im Anhang:',
    ...UNTERLAGEN.map((u) => `[ ] ${u}`),
    '',
    'Klausurtermin: ',
    'Themen: ',
    '',
    'Viele Grüße',
  ].join('\n');
  return `mailto:${ANFRAGE_EMAIL}?subject=${encodeURIComponent(betreff)}&body=${encodeURIComponent(text)}`;
}

export function FachAnfrage({ onZu }: { onZu: () => void }) {
  const [fach, setFach] = useState('');
  const [klasse, setKlasse] = useState('');
  return (
    <Dialog titel="Fach anfragen" ueber="Weitere Fächer" onSchliessen={onZu}>
      <p className="leise" style={{ marginTop: 0 }}>
        Neue Fächer entstehen aus euren Unterlagen. Schick sie per E-Mail – nach einer Prüfung kommt das Fach in die App.
      </p>
      <ul className="anfrage-liste">
        {UNTERLAGEN.map((u) => (
          <li key={u}>
            <Icon name="check" size={16} /> {u}
          </li>
        ))}
      </ul>
      {ANFRAGE_EMAIL ? (
        <>
          <div className="konto-zeile">
            <input className="eingabe" placeholder="Fach, z. B. Deutsch" value={fach} onChange={(e) => setFach(e.target.value)} aria-label="Fach" />
            <input className="eingabe" placeholder="Klasse, z. B. K1" value={klasse} onChange={(e) => setKlasse(e.target.value)} aria-label="Klassenstufe" style={{ flexBasis: 120 }} />
          </div>
          <a className="btn primaer" href={entwurf(fach.trim(), klasse.trim())}>
            <Icon name="stift" size={16} /> E-Mail-Entwurf öffnen
          </a>
          <p className="sehr-leise klein">Fotos und Dateien hängst du in deiner Mail-App an. Bitte keine Daten von anderen Personen mitschicken.</p>
        </>
      ) : (
        <p className="sehr-leise klein">Anfragen per E-Mail sind noch nicht eingerichtet. Frag direkt bei der Person nach, die dir Ruhelage gezeigt hat.</p>
      )}
    </Dialog>
  );
}
