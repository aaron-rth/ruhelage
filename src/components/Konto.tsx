// Optionales Konto im Profil: Anmeldung per E-Mail-Code, Status der Synchronisierung.
import { useState } from 'react';
import { abmelden, cloudLoeschen, codePruefen, codeSenden, syncSofort, useKonto } from '../lib/cloud';
import { zeitText } from '../store/laufend';
import { Meldung } from './Basis';
import { Icon } from './Icon';
import { LoeschDialog } from './LoeschDialog';

export function KontoKarte() {
  const k = useKonto();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [schritt, setSchritt] = useState<'email' | 'code'>('email');
  const [laedt, setLaedt] = useState(false);
  const [meldung, setMeldung] = useState<{ art: 'richtig' | 'falsch' | 'info'; text: string } | null>(null);
  const [loeschen, setLoeschen] = useState(false);

  async function senden() {
    if (!/^\S+@\S+\.\S+$/.test(email)) return setMeldung({ art: 'info', text: 'Bitte eine gültige E-Mail-Adresse eingeben.' });
    setLaedt(true);
    const f = await codeSenden(email.trim());
    setLaedt(false);
    if (f) return setMeldung({ art: 'falsch', text: f });
    setSchritt('code');
    setMeldung({ art: 'info', text: 'Wir haben dir eine E-Mail geschickt. Gib den Code hier ein oder tipp auf den Link in der Mail.' });
  }

  async function pruefen() {
    setLaedt(true);
    const f = await codePruefen(email.trim(), code);
    setLaedt(false);
    if (f) return setMeldung({ art: 'falsch', text: f });
    setMeldung({ art: 'richtig', text: 'Angemeldet – dein Fortschritt wird jetzt synchronisiert.' });
    setCode('');
    setSchritt('email');
  }

  if (k.status !== 'aus') {
    return (
      <section className="panel konto">
        <div className="panel-titel">
          <h3>
            <Icon name="check" size={18} /> Konto
          </h3>
          <span className={`chip${k.status === 'fehler' ? ' koralle' : k.status === 'offline' ? ' sand' : ' akzent'}`}>
            {k.status === 'sync' ? 'synchronisiert …' : k.status === 'fehler' ? 'Fehler' : k.status === 'offline' ? 'offline' : k.zuletzt ? `synchron · ${zeitText(k.zuletzt)}` : 'angemeldet'}
          </span>
        </div>
        <p className="leise klein" style={{ marginTop: 0 }}>
          Angemeldet als <strong>{k.email}</strong>. Dein Fortschritt wird automatisch zwischen deinen Geräten abgeglichen.
        </p>
        {k.status === 'offline' && (
          <Meldung art="info">Keine Internetverbindung. Du bleibst angemeldet, dein Fortschritt ist auf diesem Gerät sicher und wird abgeglichen, sobald du wieder online bist.</Meldung>
        )}
        {k.fehler && <Meldung art="falsch">{k.fehler}</Meldung>}
        {meldung && <Meldung art={meldung.art}>{meldung.text}</Meldung>}
        <div className="zeile" style={{ marginTop: 12 }}>
          <button className="btn" onClick={syncSofort} disabled={k.status === 'sync'}>
            <Icon name="nochmal" size={16} /> Jetzt synchronisieren
          </button>
          <button className="btn geist" onClick={() => void abmelden()}>
            Abmelden
          </button>
        </div>
        <div style={{ marginTop: 12 }}>
          <button className="btn geist klein" onClick={() => setLoeschen(true)}>
            <Icon name="muell" size={16} /> Cloud-Daten löschen …
          </button>
          {loeschen && (
            <LoeschDialog
              titel="Cloud-Daten wirklich löschen?"
              weg={['Dein gesamter Lernfortschritt in der Cloud (Karten, Ergebnisse, Statistik)', 'Der Abgleich mit deinen anderen Geräten', 'Du wirst auf diesem Gerät abgemeldet']}
              bleibt={['Der Fortschritt auf diesem Gerät', 'Auf anderen Geräten: was dort lokal gespeichert ist']}
              knopf="Cloud-Daten endgültig löschen"
              onZu={() => setLoeschen(false)}
              onLoeschen={async () => {
                const f = await cloudLoeschen();
                setLoeschen(false);
                setMeldung(f ? { art: 'falsch', text: f } : { art: 'richtig', text: 'Cloud-Daten gelöscht und abgemeldet. Auf diesem Gerät bleibt alles erhalten.' });
              }}
            />
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="panel konto">
      <h3 className="mb">Konto (optional)</h3>
      <p className="leise klein" style={{ marginTop: 0 }}>
        Mit einem Konto wird dein Fortschritt zwischen Handy und Laptop synchronisiert. Ohne Konto funktioniert alles genauso – dann bleibt alles nur in diesem Browser.
      </p>
      {schritt === 'email' ? (
        <div className="konto-zeile">
          <input
            className="eingabe"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="deine@email.de"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && void senden()}
            aria-label="E-Mail-Adresse"
          />
          <button className="btn primaer" onClick={() => void senden()} disabled={laedt}>
            {laedt ? 'Sende …' : 'Code senden'}
          </button>
        </div>
      ) : (
        <div className="konto-zeile">
          <input
            className="eingabe mono"
            inputMode="numeric"
            autoComplete="one-time-code"
            placeholder="Code aus der E-Mail"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && void pruefen()}
            aria-label="Code aus der E-Mail"
          />
          <button className="btn primaer" onClick={() => void pruefen()} disabled={laedt || code.trim().length < 6}>
            {laedt ? 'Prüfe …' : 'Anmelden'}
          </button>
          <button className="btn geist" onClick={() => setSchritt('email')}>
            Andere E-Mail
          </button>
        </div>
      )}
      {meldung && <Meldung art={meldung.art}>{meldung.text}</Meldung>}
      <p className="sehr-leise klein" style={{ marginBottom: 0 }}>
        Gespeichert werden nur deine E-Mail-Adresse und dein Lernfortschritt (Server in der EU). Du kannst die Cloud-Daten jederzeit löschen.
      </p>
    </section>
  );
}
