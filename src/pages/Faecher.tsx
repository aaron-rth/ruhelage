// Fächer: Fach wählen, Kursüberblick und was noch zu tun ist.
import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Ring, StatusChip } from '../components/Basis';
import { FachAnfrage } from '../components/FachAnfrage';
import { FachHinzu } from '../components/FachHinzu';
import { Icon } from '../components/Icon';
import { datumLang, heute, tageZwischen } from '../lib/datum';
import { statusVon, themaFortschritt } from '../lib/fortschritt';
import { schwacheThemen } from '../lib/heute';
import { hatFormeln, setzeKursFertig, useAktiverKurs, useMeineKurse, wechsleKurs } from '../lib/kurs';
import { baueLernplan, heuteDran } from '../lib/plan';
import { useStore } from '../store/store';

export function Faecher() {
  const daten = useStore();
  const [params, setParams] = useSearchParams();
  const [anfrage, setAnfrage] = useState(params.get('anfrage') === '1');
  const [hinzu, setHinzu] = useState(params.get('hinzu') === '1');
  const { laufend, fertig } = useMeineKurse();
  // Links aus der Seitenleiste öffnen die Dialoge auch, wenn man schon auf der Seite ist
  useEffect(() => {
    if (params.get('hinzu') === '1') setHinzu(true);
    if (params.get('anfrage') === '1') setAnfrage(true);
  }, [params]);
  const h = heute();
  const kurs = useAktiverKurs();
  const e = daten.einstellungen;
  const rest = tageZwischen(h, e.klausurDatum);
  const fs = kurs.themen.map((t) => themaFortschritt(t, daten, h));
  const gesamt = fs.reduce((a, f) => a + f.gesamt, 0) / Math.max(1, fs.length);
  const faellig = fs.reduce((a, f) => a + f.kartenFaellig, 0);
  const dran = heuteDran(baueLernplan(kurs, daten, h, e.klausurDatum), h);
  const schwach = schwacheThemen(kurs, daten, h).slice(0, 5);

  return (
    <div className="inhalt">
      <div className="kopf">
        <div>
          <span className="ueber">Fächer</span>
          <h1>Deine Fächer</h1>
        </div>
      </div>

      <div className="fach-liste" role="list">
        {laufend.map((k) => {
          const an = k.id === kurs.id;
          return (
            <div key={k.id} className={`fach-reihe-wrap${an ? ' an' : ''}`} role="listitem">
              <button type="button" className="fach-reihe" aria-current={an ? 'true' : undefined} onClick={() => wechsleKurs(k.id)}>
                <span className="modus-icon">
                  <Icon name={k.fach === 'Physik' ? 'welle' : 'buch'} size={20} />
                </span>
                <span className="fach-reihe-text">
                  <span className="fach-name">
                    <strong>{k.fach}</strong>
                    <span className="chip klein-chip">{k.klasse}</span>
                    {k.entwurf && <span className="chip klein-chip">Entwurf</span>}
                  </span>
                  <span className="sehr-leise klein">{k.titel}</span>
                </span>
              </button>
              <button type="button" className="btn geist klein symbol-knopf" onClick={() => setzeKursFertig(k.id, true)} title="Als fertig markieren (ausblenden)" aria-label={`${k.fach} als fertig markieren`}>
                <Icon name="check" size={18} />
              </button>
            </div>
          );
        })}
        <button type="button" className="fach-reihe fach-neu" onClick={() => setHinzu(true)}>
          <span className="modus-icon">
            <Icon name="plus" size={20} />
          </span>
          <span className="fach-reihe-text">
            <strong>Fach hinzufügen</strong>
            <span className="sehr-leise klein">Stufe und Fach auswählen – oder ein neues anfragen</span>
          </span>
        </button>
      </div>
      {fertig.length > 0 && (
        <details className="fertige-faecher">
          <summary className="sehr-leise klein">Fertige Fächer ({fertig.length})</summary>
          <ul>
            {fertig.map((k) => (
              <li key={k.id}>
                <span>
                  <strong>{k.fach}</strong> <span className="chip klein-chip">{k.klasse}</span> <span className="sehr-leise klein">{k.titel}</span>
                </span>
                <button type="button" className="btn geist klein" onClick={() => setzeKursFertig(k.id, false)}>
                  <Icon name="zuruecksetzen" size={16} /> Zurückholen
                </button>
              </li>
            ))}
          </ul>
        </details>
      )}
      {hinzu && (
        <FachHinzu
          onZu={() => {
            setHinzu(false);
            if (params.get('hinzu')) setParams({}, { replace: true });
          }}
          onAnfrage={() => {
            setHinzu(false);
            setAnfrage(true);
          }}
        />
      )}
      {anfrage && (
        <FachAnfrage
          onZu={() => {
            setAnfrage(false);
            if (params.get('anfrage')) setParams({}, { replace: true });
          }}
        />
      )}

      <section className="panel kurs-karte" data-tour="kurs">
        <div className="kurs-kopf">
          <Ring wert={gesamt} groesse={64} staerke={5}>
            <span className="mono">{Math.round(gesamt * 100)}%</span>
          </Ring>
          <div>
            <span className="ueber-klein">
              {kurs.fach} · {kurs.klasse} · {kurs.themen.length} {kurs.themen.length === 1 ? 'Thema' : 'Themen'}
            </span>
            <h2>{kurs.titel}</h2>
            {rest >= 0 && (
              <span className="sehr-leise klein">
                <Icon name="kalender" size={14} /> {kurs.klausur?.titel ?? 'Klausur'} am {datumLang(e.klausurDatum)} – {rest === 0 ? 'heute' : `noch ${rest} ${rest === 1 ? 'Tag' : 'Tage'}`}
              </span>
            )}
          </div>
        </div>
        <div className="kurs-wege">
          <Link to="/pfad" className="kurs-weg">
            <Icon name="pfad" size={22} />
            <strong>Lernpfad</strong>
            <span className="sehr-leise klein">alle Themen, Selbsteinschätzung</span>
          </Link>
          <Link to="/pfad?ansicht=plan" className="kurs-weg">
            <Icon name="kalender" size={22} />
            <strong>Lernplan</strong>
            <span className="sehr-leise klein">{dran.length ? `heute: ${dran.map((t) => t.titel).join(', ')}` : 'Themen bis zur Klausur verteilt'}</span>
          </Link>
          {hatFormeln(kurs) && (
            <Link to="/formeln" className="kurs-weg">
              <Icon name="formel" size={22} />
              <strong>Formelsammlung</strong>
              <span className="sehr-leise klein">alle Formeln zum Nachschlagen</span>
            </Link>
          )}
        </div>
      </section>

      <section className="panel">
        <div className="panel-titel">
          <h2>Was noch zu tun ist</h2>
          {faellig > 0 && (
            <span className="chip akzent">
              <Icon name="karten" size={13} /> {faellig} Karten fällig
            </span>
          )}
        </div>
        <ul className="themen-kurzliste">
          {schwach.map((t) => {
            const f = themaFortschritt(t, daten, h);
            return (
              <li key={t.id}>
                <Link to={`/thema/${t.id}`}>
                  <span className="knoten-nr">{t.nr}</span>
                  <span className="knoten-text">
                    <span className="knoten-titel">{t.titel}</span>
                    <span className="knoten-unter">{t.untertitel}</span>
                  </span>
                  <StatusChip status={statusVon(t, daten)} />
                  <Ring wert={f.gesamt} groesse={30} staerke={3} />
                </Link>
              </li>
            );
          })}
        </ul>
        <Link to="/pfad" className="btn geist klein" style={{ marginTop: 12 }}>
          Alle Themen im Lernpfad <Icon name="rechts" size={16} />
        </Link>
      </section>
    </div>
  );
}
