// Lernplan bis zur Klausur: welche Themen an welchem Tag, und wie viel Zeit das ungefähr braucht.
import { Link } from 'react-router-dom';
import { AKTIVER_KURS } from '../content/kurse';
import { datumLang, heute, parseDatum, plusTage } from '../lib/datum';
import { baueLernplan } from '../lib/plan';
import { useStore } from '../store/store';
import { Leer } from './Basis';
import { Icon } from './Icon';

const TAG = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];

function tagName(iso: string, h: string): string {
  if (iso === h) return 'Heute';
  if (iso === plusTage(h, 1)) return 'Morgen';
  const d = parseDatum(iso);
  return `${TAG[d.getDay()]}, ${d.getDate()}.${d.getMonth() + 1}.`;
}

export function Lernplan() {
  const daten = useStore();
  const h = heute();
  const e = daten.einstellungen;
  const plan = baueLernplan(AKTIVER_KURS, daten, h, e.klausurDatum);

  if (!plan) {
    return (
      <div className="panel">
        <Leer icon="kalender" titel="Kein Klausurtermin in der Zukunft">
          Trag in den <Link to="/einstellungen">Einstellungen</Link> den nächsten Klausurtermin ein, dann verteilt die App die Themen bis dahin.
        </Leer>
      </div>
    );
  }

  const offen = new Set(plan.tage.flatMap((t) => (t.art === 'lernen' ? t.eintraege.map((x) => x.thema.id) : []))).size;
  const zuWenig = plan.minutenProTag > e.zielMinuten + 5;

  return (
    <div className="stapel">
      <div className="panel plan-kopf">
        <div className="plan-zahlen">
          <div>
            <span className="stat-zahl">{plan.restTage}</span>
            <span className="sehr-leise klein">{plan.restTage === 1 ? 'Tag' : 'Tage'} bis zur Klausur</span>
          </div>
          <div>
            <span className="stat-zahl">{offen}</span>
            <span className="sehr-leise klein">{offen === 1 ? 'Thema' : 'Themen'} noch zu lernen</span>
          </div>
          <div>
            <span className="stat-zahl">ca. {plan.minutenProTag} min</span>
            <span className="sehr-leise klein">pro Tag nötig</span>
          </div>
        </div>
        <p className="leise klein" style={{ margin: 0 }}>
          {zuWenig ? (
            <>
              Dein Tagesziel ist {e.zielMinuten} min – für alle Themen reicht das knapp nicht.{' '}
              <button type="button" className="text-knopf" onClick={() => daten.setzeEinstellung('zielMinuten', Math.min(90, Math.ceil(plan.minutenProTag / 5) * 5))}>
                Tagesziel auf {Math.min(90, Math.ceil(plan.minutenProTag / 5) * 5)} min setzen
              </button>{' '}
              oder dich auf die wichtigsten Themen konzentrieren.
            </>
          ) : (
            <>Mit deinem Tagesziel von {e.zielMinuten} min schaffst du das. </>
          )}{' '}
          Der Plan richtet sich nach deiner Selbsteinschätzung und deinen Ergebnissen und passt sich jeden Tag an.
        </p>
      </div>

      <ol className="plan-liste">
        {plan.tage.map((t) => (
          <li key={t.datum} className={`plan-tag${t.datum === h ? ' heute' : ''}${t.art === 'wiederholen' ? ' wdh' : ''}`}>
            <div className="plan-datum">
              <strong>{tagName(t.datum, h)}</strong>
              {t.minuten > 0 && <span className="sehr-leise klein">ca. {Math.round(t.minuten)} min</span>}
            </div>
            <div className="plan-inhalt">
              {t.art === 'wiederholen' ? (
                <>
                  <span className="plan-art">
                    <Icon name="nochmal" size={14} /> Wiederholen: <Link to="/nochmal">Nochmal-Stapel</Link>, eine <Link to="/klausur">Probeklausur</Link> und die schwächsten Themen
                  </span>
                  <div className="plan-themen">
                    {t.eintraege.map((x) => (
                      <Link key={x.thema.id} to={`/thema/${x.thema.id}`} className="chip-knopf">
                        <span className="mono">{x.thema.nr}</span> {x.thema.titel}
                      </Link>
                    ))}
                  </div>
                </>
              ) : t.eintraege.length === 0 ? (
                <span className="sehr-leise klein">Puffer – fällige Karteikarten und was im Nochmal-Stapel liegt</span>
              ) : (
                <div className="plan-themen">
                  {t.eintraege.map((x) => (
                    <Link key={x.thema.id} to={`/thema/${x.thema.id}`} className="chip-knopf">
                      <span className="mono">{x.thema.nr}</span> {x.thema.titel}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </li>
        ))}
        <li className="plan-tag klausur">
          <div className="plan-datum">
            <strong>{tagName(plan.klausur, h)}</strong>
          </div>
          <div className="plan-inhalt">
            <span className="plan-art">
              <Icon name="kalender" size={14} /> Klausur – {datumLang(plan.klausur)}
            </span>
          </div>
        </li>
      </ol>

      {plan.fertig.length > 0 && (
        <div className="panel">
          <h3 className="mb">Sitzt schon gut</h3>
          <div className="plan-themen">
            {plan.fertig.map((t) => (
              <Link key={t.id} to={`/thema/${t.id}`} className="chip-knopf an">
                <Icon name="check" size={13} /> {t.titel}
              </Link>
            ))}
          </div>
          <p className="sehr-leise klein" style={{ margin: '8px 0 0' }}>
            Diese Themen kommen nur noch über fällige Karteikarten vor.
          </p>
        </div>
      )}
    </div>
  );
}
