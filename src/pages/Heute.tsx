import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Balken, Ring, StatusChip, Taste } from '../components/Basis';
import { Icon } from '../components/Icon';
import { PausenKarte, setzePausiert, Sitzung, SitzungsEnde, starteSitzung, useSitzungsStand, type SitzungsBilanz } from '../components/Sitzung';
import { AKTIVER_KURS } from '../content/kurse';
import { datumLang, heute, tageZwischen } from '../lib/datum';
import { statusVon, themaFortschritt } from '../lib/fortschritt';
import { baueHeute, schwacheThemen } from '../lib/heute';
import { baueLernplan, heuteDran } from '../lib/plan';
import { neuerSeed } from '../lib/rng';
import { streak, useStore } from '../store/store';
import { useUi } from '../store/ui';

function gruss(): string {
  const h = new Date().getHours();
  if (h < 11) return 'Guten Morgen';
  if (h < 17) return 'Hallo';
  return 'Guten Abend';
}

export function Heute() {
  const daten = useStore();
  const h = heute();
  const [seed, setSeed] = useState(neuerSeed);
  const stand = useSitzungsStand('heute', true);
  const laeuft = !!stand && !stand.pausiert;
  const [bilanz, setBilanz] = useState<SitzungsBilanz | null>(null);
  // Plan nur beim Öffnen bzw. nach einer Sitzung neu bauen, nicht bei jeder Bewertung
  const [planVersion, setPlanVersion] = useState(0);
  const dran = useMemo(() => heuteDran(baueLernplan(AKTIVER_KURS, daten, h, daten.einstellungen.klausurDatum), h), [planVersion, h, daten.einstellungen.klausurDatum]);
  const plan = useMemo(() => baueHeute(AKTIVER_KURS, daten, h, seed, dran), [planVersion, seed, h, dran]);
  const tag = daten.tage[h] ?? { xp: 0, sekunden: 0, karten: 0, aufgaben: 0 };
  const e = daten.einstellungen;
  const minuten = Math.floor(tag.sekunden / 60);
  const rest = tageZwischen(h, e.klausurDatum);
  const s = streak(daten.tage, h);
  const schwach = schwacheThemen(AKTIVER_KURS, daten, h).slice(0, 3);

  const starte = () => starteSitzung('heute', plan.items, { art: 'heute', titel: 'Heute-Runde', pfad: '/' });

  useEffect(() => {
    if (laeuft || bilanz) return;
    function onKey(ev: KeyboardEvent) {
      if (ev.key === 'Enter' && (ev.target as HTMLElement)?.tagName === 'BODY') {
        if (stand?.pausiert) {
          ev.preventDefault();
          setzePausiert('heute', false);
        } else if (plan.items.length) {
          ev.preventDefault();
          starte();
        }
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  if (laeuft) {
    return (
      <div className="inhalt schmal">
        <Sitzung slot="heute" onEnde={setBilanz} />
      </div>
    );
  }

  if (bilanz) {
    return (
      <div className="inhalt schmal">
        <SitzungsEnde
          bilanz={bilanz}
          onFertig={() => {
            setBilanz(null);
            setSeed(neuerSeed());
            setPlanVersion((v) => v + 1);
          }}
          extra={
            <p className="leise klein">
              Heute insgesamt: {Math.floor((daten.tage[h]?.sekunden ?? 0) / 60)} von {e.zielMinuten} Minuten.{' '}
              {(daten.tage[h]?.sekunden ?? 0) / 60 >= e.zielMinuten ? 'Tagesziel erreicht – gönn dir eine Pause.' : 'Wenn du magst, gibt es gleich eine neue Runde.'}
            </p>
          }
        />
      </div>
    );
  }

  return (
    <div className="inhalt">
      <div className="kopf">
        <div>
          <span className="ueber">{datumLang(h)}</span>
          <h1>{gruss()}.</h1>
          <p>Eine kurze, gemischte Runde: fällige Karten, ein paar Aufgaben aus deinen schwächeren Themen und was im Nochmal-Stapel liegt.</p>
        </div>
        {e.countdown && rest >= 0 && (
          <span className="chip">
            <Icon name="kalender" size={13} /> {rest === 0 ? 'Heute ist Klausur – viel Erfolg!' : `noch ${rest} ${rest === 1 ? 'Tag' : 'Tage'} bis zur Klausur`}
          </span>
        )}
      </div>

      {stand?.pausiert && <PausenKarte slot="heute" stand={stand} onNeu={() => setPlanVersion((v) => v + 1)} />}

      <div className="heute-raster">
        <section className="panel heute-start">
          <div className="panel-titel">
            <h2>
              <Icon name="funke" size={18} /> Deine Runde
            </h2>
            <span className="sehr-leise klein">ca. {Math.max(1, plan.minuten)} min</span>
          </div>
          {plan.items.length === 0 ? (
            <p className="leise">Heute ist alles erledigt. Wenn du magst, schau in den Lernpfad oder auf die Spielwiese.</p>
          ) : (
            <>
              {dran.length > 0 && (
                <p className="leise klein laut-plan">
                  <Icon name="kalender" size={14} /> Laut <Link to="/pfad?ansicht=plan">Lernplan</Link> heute dran: {dran.map((t) => t.titel).join(', ')}
                </p>
              )}
              <ul className="runde-liste">
                {plan.faellig > 0 && (
                  <li>
                    <Icon name="karten" size={16} /> <strong>{plan.faellig}</strong> fällige Karteikarten
                  </li>
                )}
                {plan.neu > 0 && (
                  <li>
                    <Icon name="plus" size={16} /> <strong>{plan.neu}</strong> neue Karten
                  </li>
                )}
                {plan.aufgaben > 0 && (
                  <li>
                    <Icon name="rechner" size={16} /> <strong>{plan.aufgaben}</strong> Aufgaben aus {plan.themen.map((t) => t.titel).join(', ')}
                  </li>
                )}
                {plan.nochmal > 0 && (
                  <li>
                    <Icon name="nochmal" size={16} /> <strong>{plan.nochmal}</strong> aus dem Nochmal-Stapel
                  </li>
                )}
              </ul>
              <div className="aktionen">
                <button className={`btn gross${stand?.pausiert ? '' : ' primaer'}`} onClick={starte}>
                  <Icon name="play" size={16} /> {stand?.pausiert ? 'Neue Runde' : 'Los geht’s'} {!stand?.pausiert && <Taste>Enter</Taste>}
                </button>
                <button className="btn geist" onClick={() => setSeed(neuerSeed())} title="Andere Aufgaben auswählen">
                  <Icon name="zufall" size={16} /> neu mischen
                </button>
              </div>
            </>
          )}
        </section>

        <section className="panel heute-ziel">
          <div className="ziel-ring">
            <Ring wert={minuten / e.zielMinuten} groesse={92} staerke={6}>
              <span className="ziel-zahl mono">{minuten}</span>
              <span className="sehr-leise klein">von {e.zielMinuten} min</span>
            </Ring>
          </div>
          <dl className="kennzahlen">
            <div>
              <dt>Karten heute</dt>
              <dd className="mono">{tag.karten}</dd>
            </div>
            <div>
              <dt>Aufgaben heute</dt>
              <dd className="mono">{tag.aufgaben}</dd>
            </div>
            <div>
              <dt>Tage in Folge</dt>
              <dd className="mono">{s}</dd>
            </div>
            <div>
              <dt>XP gesamt</dt>
              <dd className="mono">{daten.xp}</dd>
            </div>
          </dl>
          <Balken wert={tag.karten / Math.max(1, e.zielKarten)} duenn label="Karten-Ziel" />
          <span className="sehr-leise klein">
            Ziel: {e.zielMinuten} min · {e.zielKarten} Karten · {e.zielAufgaben} Aufgaben – <Link to="/einstellungen">anpassen</Link>
          </span>
          <button type="button" className="btn geist klein" style={{ alignSelf: 'flex-start' }} onClick={() => useUi.getState().zeigeStatistik(true)}>
            <Icon name="ziel" size={14} /> Statistik ansehen
          </button>
        </section>
      </div>

      <section className="panel">
        <div className="panel-titel">
          <h2>Hier lohnt sich Üben gerade am meisten</h2>
          <Link to="/pfad" className="klein">
            Zum Lernpfad <Icon name="rechts" size={14} />
          </Link>
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
      </section>
    </div>
  );
}
