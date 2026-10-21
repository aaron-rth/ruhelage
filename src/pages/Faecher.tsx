// Fächer: Fach wählen, Kursüberblick und was noch zu tun ist.
import { Link } from 'react-router-dom';
import { Ring, StatusChip } from '../components/Basis';
import { Icon } from '../components/Icon';
import { AKTIVER_KURS } from '../content/kurse';
import { datumLang, heute, tageZwischen } from '../lib/datum';
import { statusVon, themaFortschritt } from '../lib/fortschritt';
import { schwacheThemen } from '../lib/heute';
import { baueLernplan, heuteDran } from '../lib/plan';
import { useStore } from '../store/store';

export function Faecher() {
  const daten = useStore();
  const h = heute();
  const kurs = AKTIVER_KURS;
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
        <div className="fach-kachel an" role="listitem" aria-current="true">
          <span className="modus-icon">
            <Icon name="welle" size={22} />
          </span>
          <strong>Physik</strong>
          <span className="sehr-leise klein">{kurs.titel}</span>
        </div>
        <div className="fach-kachel bald" role="listitem" aria-disabled="true">
          <span className="modus-icon">
            <Icon name="plus" size={22} />
          </span>
          <strong>Weitere Fächer</strong>
          <span className="sehr-leise klein">Kommt bald</span>
        </div>
      </div>

      <section className="panel kurs-karte">
        <div className="kurs-kopf">
          <Ring wert={gesamt} groesse={64} staerke={5}>
            <span className="mono">{Math.round(gesamt * 100)}%</span>
          </Ring>
          <div>
            <span className="ueber-klein">Kurs · {kurs.themen.length} Themen</span>
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
          <Link to="/formeln" className="kurs-weg">
            <Icon name="formel" size={22} />
            <strong>Formelsammlung</strong>
            <span className="sehr-leise klein">alle Formeln zum Nachschlagen</span>
          </Link>
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
