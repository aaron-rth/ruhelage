import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Balken, Ring, Taste } from '../components/Basis';
import { Dialog } from '../components/Dialog';
import { Icon } from '../components/Icon';
import { setzePausiert, Sitzung, SitzungsEnde, starteSitzung, useSitzungsStand, type SitzungsBilanz, type SitzungsItem } from '../components/Sitzung';
import { AKTIVER_KURS } from '../content/kurse';
import { datumLang, heute, tageZwischen } from '../lib/datum';
import { themaFortschritt } from '../lib/fortschritt';
import { baueHeute, mischAufgaben, mischKarten, schwacheThemen } from '../lib/heute';
import { baueLernplan, heuteDran } from '../lib/plan';
import { neuerSeed } from '../lib/rng';
import { zeitText } from '../store/laufend';
import { streak, useStore } from '../store/store';
import { AKTUELL_ART, useOffeneEintraege, weiterMachen } from './Aktuell';

type Modus = 'karten' | 'uebungen' | 'rechnen';
const MODUS: Record<Modus, { titel: string; icon: string; tab: string; text: string; gemischt: string }> = {
  karten: { titel: 'Karteikarten', icon: 'karten', tab: 'karten', text: 'Begriffe, Formeln, Warum-Fragen', gemischt: 'Fällige und neue Karten aus allen Themen' },
  uebungen: { titel: 'Übungen', icon: 'stift', tab: 'uebungen', text: 'Verstehen, begründen, Diagramme', gemischt: 'Gemischt aus deinen schwächsten Themen' },
  rechnen: { titel: 'Rechentrainer', icon: 'rechner', tab: 'rechnen', text: 'Rechnen mit gestufter Hilfe', gemischt: 'Gemischt aus deinen schwächsten Themen' },
};
const MISCH_SLOTS = ['heute', 'mix-karten', 'mix-uebungen', 'mix-rechnen'] as const;

/** Auswahl: gemischt üben oder ein Thema wählen */
function ModusWahl({ modus, onZu }: { modus: Modus; onZu: () => void }) {
  const daten = useStore();
  const navigate = useNavigate();
  const h = heute();
  const m = MODUS[modus];
  const themen = schwacheThemen(AKTIVER_KURS, daten, h);

  function gemischt() {
    let items: SitzungsItem[];
    if (modus === 'karten') items = mischKarten(AKTIVER_KURS, daten, h, daten.einstellungen.zielKarten);
    else items = mischAufgaben(AKTIVER_KURS, daten, h, neuerSeed(), modus, Math.max(5, daten.einstellungen.zielAufgaben));
    if (items.length === 0) return;
    starteSitzung(`mix-${modus}`, items, { art: 'mischung', titel: `${m.titel} · gemischt`, pfad: '/' });
    onZu();
  }

  return (
    <Dialog titel={m.titel} ueber="Gezielt üben" onSchliessen={onZu}>
      <button type="button" className="modus-gemischt" onClick={gemischt}>
        <span className="modus-icon">
          <Icon name="zufall" size={22} />
        </span>
        <span>
          <strong>Gemischt</strong>
          <span className="sehr-leise klein">{m.gemischt}</span>
        </span>
        <Icon name="rechts" size={18} className="sehr-leise" />
      </button>
      <p className="ueber-klein" style={{ margin: '16px 0 8px' }}>
        Oder ein Thema – schwächste zuerst
      </p>
      <ul className="modus-themen">
        {themen.map((t) => {
          const f = themaFortschritt(t, daten, h);
          return (
            <li key={t.id}>
              <button
                type="button"
                onClick={() => {
                  onZu();
                  navigate(`/thema/${t.id}/${m.tab}`);
                }}
              >
                <span className="knoten-nr klein-nr">{t.nr}</span>
                <span className="modus-thema-titel">{t.titel}</span>
                {modus === 'karten' && f.kartenFaellig > 0 && <span className="badge akzent">{f.kartenFaellig}</span>}
                <Ring wert={f.gesamt} groesse={24} staerke={3} />
              </button>
            </li>
          );
        })}
      </ul>
    </Dialog>
  );
}

function gruss(): string {
  const h = new Date().getHours();
  if (h < 11) return 'Guten Morgen';
  if (h < 17) return 'Hallo';
  return 'Guten Abend';
}

export function Heute() {
  const daten = useStore();
  const h = heute();
  const navigate = useNavigate();
  const [seed, setSeed] = useState(neuerSeed);
  const [modus, setModus] = useState<Modus | null>(null);
  const stand = useSitzungsStand('heute', true);
  const misch = [stand, useSitzungsStand('mix-karten'), useSitzungsStand('mix-uebungen'), useSitzungsStand('mix-rechnen')];
  const laufIndex = misch.findIndex((x) => x && !x.pausiert);
  const laeuft = laufIndex >= 0;
  const offen = useOffeneEintraege().filter((x) => x.art !== 'lesen');
  const weiterEintrag = offen[0];
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
        <Sitzung slot={MISCH_SLOTS[laufIndex]} onEnde={setBilanz} />
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
          <p>Mach da weiter, wo du warst, starte deine Tagesrunde oder üb gezielt.</p>
        </div>
        {e.countdown && rest >= 0 && (
          <span className="chip">
            <Icon name="kalender" size={13} /> {rest === 0 ? 'Heute ist Klausur – viel Erfolg!' : `noch ${rest} ${rest === 1 ? 'Tag' : 'Tage'} bis zur Klausur`}
          </span>
        )}
      </div>

      {weiterEintrag && (
        <button type="button" className="panel weiter-karte einblenden" onClick={() => weiterMachen(weiterEintrag, navigate)}>
          <span className="aktuell-icon">
            <Icon name={AKTUELL_ART[weiterEintrag.art].icon} size={22} />
          </span>
          <span className="aktuell-text">
            <span className="ueber-klein">Weitermachen · {zeitText(weiterEintrag.zeit)}</span>
            <strong>{weiterEintrag.titel}</strong>
            {weiterEintrag.stand && <span className="sehr-leise klein">{weiterEintrag.stand}</span>}
            {weiterEintrag.anteil !== undefined && <Balken wert={weiterEintrag.anteil} duenn />}
          </span>
          <span className="btn primaer">
            <Icon name="play" size={16} /> Weiter
          </span>
        </button>
      )}
      {offen.length > 1 && (
        <Link to="/aktuell" className="klein weitere-link">
          {offen.length - 1} weitere angefangene {offen.length - 1 === 1 ? 'Sache' : 'Sachen'} <Icon name="rechts" size={14} />
        </Link>
      )}

      <div className="heute-raster">
        <section className="panel heute-start" data-tour="runde">
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
          <Link to="/statistik" className="btn geist klein" style={{ alignSelf: 'flex-start' }}>
            <Icon name="ziel" size={16} /> Statistik ansehen
          </Link>
        </section>
      </div>

      <section className="ueben-bereich" data-tour="gezielt">
        <h2 className="abschnitt-titel">Gezielt üben</h2>
        <div className="modus-kacheln">
          {(Object.keys(MODUS) as Modus[]).map((k) => (
            <button key={k} type="button" className="modus-kachel" onClick={() => setModus(k)}>
              <span className="modus-icon">
                <Icon name={MODUS[k].icon} size={22} />
              </span>
              <strong>{MODUS[k].titel}</strong>
              <span className="sehr-leise klein">{MODUS[k].text}</span>
            </button>
          ))}
          <Link to="/klausur" className="modus-kachel">
            <span className="modus-icon">
              <Icon name="klausur" size={22} />
            </span>
            <strong>Probeklausur</strong>
            <span className="sehr-leise klein">Ohne Hilfen, mit Timer</span>
          </Link>
          <Link to="/nochmal" className="modus-kachel">
            <span className="modus-icon">
              <Icon name="nochmal" size={22} />
            </span>
            <strong>
              Nochmal {daten.nochmal.length > 0 && <span className="badge akzent">{daten.nochmal.length}</span>}
            </strong>
            <span className="sehr-leise klein">Was danebenging</span>
          </Link>
          <Link to="/spielwiese" className="modus-kachel">
            <span className="modus-icon">
              <Icon name="welle" size={22} />
            </span>
            <strong>Spielwiese</strong>
            <span className="sehr-leise klein">Pendel und Graphen ausprobieren</span>
          </Link>
        </div>
      </section>
      {modus && <ModusWahl modus={modus} onZu={() => setModus(null)} />}
    </div>
  );
}
