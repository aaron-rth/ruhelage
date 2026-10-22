import { useEffect, useMemo, useState } from 'react';
import { Link, NavLink, useParams } from 'react-router-dom';
import { AufgabenAnsicht } from '../components/AufgabenAnsicht';
import { Balken, Leer, Md, Ring, STATUS_TEXT, StatusWahl, Taste } from '../components/Basis';
import { Icon } from '../components/Icon';
import { PausenKarte, Sitzung, SitzungsEnde, starteSitzung, useSitzungsStand, type SitzungsBilanz } from '../components/Sitzung';
import { UebungAnsicht } from '../components/uebungen/UebungAnsicht';
import { VollbildRahmen } from '../components/Vollbild';
import { findeThema } from '../content/kurse';
import { operatorVon } from '../content/operatoren';
import type { Generator, Thema } from '../content/types';
import { heute } from '../lib/datum';
import { genKey, quote, statusVon, themaFortschritt, uebKey, vorschlag } from '../lib/fortschritt';
import { intervallText, istFaellig, TAKTE } from '../lib/leitner';
import { useIstHandy } from '../lib/geraet';
import { neuerSeed } from '../lib/rng';
import { useGemerkt, useLaufend } from '../store/laufend';
import { useStore } from '../store/store';

const TABS = [
  { id: 'erklaert', label: 'Kurz erklärt', icon: 'buch' },
  { id: 'karten', label: 'Karteikarten', icon: 'karten' },
  { id: 'uebungen', label: 'Übungen', icon: 'stift' },
  { id: 'rechnen', label: 'Rechentrainer', icon: 'rechner' },
];

export function ThemaSeite() {
  const { id = '', tab = 'erklaert' } = useParams();
  const t = findeThema(id);
  const daten = useStore();
  if (!t) return <Leer titel="Thema nicht gefunden" />;
  const status = statusVon(t, daten);
  const f = themaFortschritt(t, daten, heute());
  const vs = vorschlag(f);

  return (
    <div className="inhalt">
      <Link to="/pfad" className="zurueck sehr-leise klein">
        <Icon name="links" size={14} /> Lernpfad
      </Link>
      <div className="kopf thema-kopf">
        <div>
          <span className="ueber">
            Thema {t.nr}
            {t.neu && <span className="chip akzent" style={{ marginLeft: 8 }}>neu im Unterricht</span>}
          </span>
          <h1>{t.titel}</h1>
          <p>{t.untertitel}</p>
        </div>
        <div className="thema-status">
          <Ring wert={f.gesamt} groesse={52} staerke={4}>
            <span className="mono">{Math.round(f.gesamt * 100)}%</span>
          </Ring>
          <div className="stapel" style={{ gap: 6 }}>
            <StatusWahl wert={status} onChange={(s) => daten.setzeStatus(t.id, s)} />
            {f.versucht > 0 && vs !== status && (
              <span className="sehr-leise klein">Deine Ergebnisse sagen eher: {STATUS_TEXT[vs]}</span>
            )}
          </div>
        </div>
      </div>

      <nav className="tabs" aria-label="Bereiche">
        {TABS.filter((tb) => tb.id !== 'rechnen' || tab === 'rechnen' || t.generatoren.some((g) => g.art === 'rechnen')).map((tb) => (
          <NavLink key={tb.id} to={`/thema/${t.id}/${tb.id}`} className={() => (tab === tb.id ? 'aktiv' : '')}>
            <Icon name={tb.icon} size={16} />
            {tb.label}
            {tb.id === 'karten' && f.kartenFaellig > 0 && <span className="badge akzent">{f.kartenFaellig}</span>}
          </NavLink>
        ))}
      </nav>

      {tab === 'erklaert' && <Erklaert t={t} />}
      {tab === 'karten' && <KartenTab t={t} />}
      {tab === 'uebungen' && <UebungenTab t={t} />}
      {tab === 'rechnen' && <RechenTab t={t} />}
    </div>
  );
}

function Erklaert({ t }: { t: Thema }) {
  const setzeAktuell = useLaufend((s) => s.setzeAktuell);
  useEffect(() => {
    setzeAktuell({ key: 'lesen', art: 'lesen', titel: `Kurz erklärt · ${t.titel}`, pfad: `/thema/${t.id}/erklaert` });
  }, [t, setzeAktuell]);
  return (
    <div className="raster-erklaert">
      <article className="panel">
        <Md text={t.erklaerung} />
        {t.quelleErklaerung && <p className="sehr-leise klein quelle-zeile">Quellen: {t.quelleErklaerung}</p>}
      </article>
      <aside className="stapel">
        {t.formeln.length > 0 && (
          <div className="panel">
            <h3 className="mb">Formeln</h3>
            <dl className="formel-liste kompakt">
              {t.formeln.map((fo) => (
                <div key={fo.name}>
                  <dt>{fo.name}</dt>
                  <dd>
                    <Md text={`$${fo.tex}$`} inline />
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        )}
        <div className="panel">
          <h3 className="mb">Weiter üben</h3>
          <div className="stapel">
            <Link className="btn" to={`/thema/${t.id}/karten`}>
              <Icon name="karten" size={16} /> {t.karten.length} Karteikarten
            </Link>
            <Link className="btn" to={`/thema/${t.id}/uebungen`}>
              <Icon name="stift" size={16} /> {t.uebungen.length + t.generatoren.filter((g) => g.art === 'diagramm').length} Übungen
            </Link>
            {t.generatoren.some((g) => g.art === 'rechnen') && (
              <Link className="btn" to={`/thema/${t.id}/rechnen`}>
                <Icon name="rechner" size={16} /> {t.generatoren.filter((g) => g.art === 'rechnen').length} Rechentrainer
              </Link>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
}

function KartenTab({ t }: { t: Thema }) {
  const daten = useStore();
  const h = heute();
  const slot = `karten:${t.id}`;
  const stand = useSitzungsStand(slot);
  const [bilanz, setBilanz] = useState<SitzungsBilanz | null>(null);
  const faellig = t.karten.filter((k) => istFaellig(daten.karten[k.id], h));
  const neu = t.karten.filter((k) => !daten.karten[k.id]);
  const faecher = [1, 2, 3, 4, 5].map((f) => t.karten.filter((k) => daten.karten[k.id]?.fach === f).length);

  if (bilanz) return <SitzungsEnde bilanz={bilanz} onFertig={() => setBilanz(null)} />;
  if (stand && !stand.pausiert) return <Sitzung slot={slot} onEnde={setBilanz} />;
  if (t.karten.length === 0) return <Leer icon="karten" titel="Noch keine Karten">Für dieses Thema gibt es noch keine Karteikarten.</Leer>;

  const starte = (liste: typeof t.karten) =>
    starteSitzung(
      slot,
      liste.map((k) => ({ art: 'karte' as const, id: k.id })),
      { art: 'karten', titel: `Karteikarten · ${t.titel}`, pfad: `/thema/${t.id}/karten` },
    );
  return (
    <div className="stapel">
      {stand?.pausiert && <PausenKarte slot={slot} stand={stand} />}
      <div className="panel">
        <div className="zeile zwischen">
          <div>
            <h3>Leitner-Fächer</h3>
            <p className="sehr-leise klein" style={{ margin: 0 }}>
              Gewusst → ein Fach weiter. Nicht gewusst → zurück in Fach 1. Wiederholung nach {intervallText(TAKTE[daten.einstellungen.takt].intervalle)} Tagen ({TAKTE[daten.einstellungen.takt].label.toLowerCase()}, <Link to="/einstellungen">ändern</Link>).
            </p>
          </div>
          <div className="zeile">
            <button className="btn primaer" disabled={faellig.length + neu.length === 0} onClick={() => starte([...faellig, ...neu])}>
              <Icon name="play" size={16} /> Lernen ({faellig.length + neu.length})
            </button>
            <button className="btn" onClick={() => starte(t.karten)}>
              Alle {t.karten.length} durchgehen
            </button>
          </div>
        </div>
        <div className="faecher">
          <div className="fach neu">
            <span className="fach-zahl">{neu.length}</span>
            <span className="sehr-leise klein">neu</span>
          </div>
          {faecher.map((n, i) => (
            <div key={i} className="fach">
              <span className="fach-zahl">{n}</span>
              <span className="sehr-leise klein">Fach {i + 1}</span>
              <Balken wert={t.karten.length ? n / t.karten.length : 0} duenn />
            </div>
          ))}
        </div>
        {faellig.length === 0 && neu.length === 0 && (
          <p className="leise klein" style={{ marginTop: 16, marginBottom: 0 }}>
            Heute ist nichts fällig. Du kannst trotzdem alle Karten durchgehen.
          </p>
        )}
      </div>
      <details className="panel karten-liste">
        <summary>Alle Karten ansehen</summary>
        <p className="sehr-leise klein">Klick auf eine Karte, um ab dort durchzublättern.</p>
        <ul>
          {t.karten.map((k, i) => (
            <li key={k.id}>
              <button type="button" onClick={() => starte([...t.karten.slice(i), ...t.karten.slice(0, i)])}>
                <Md text={k.vorne} inline />
                <span className="sehr-leise klein mono">{daten.karten[k.id] ? `Fach ${daten.karten[k.id].fach}` : 'neu'}</span>
              </button>
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
}

type UebEintrag = { art: 'uebung'; id: string; frage: string; typ: string } | { art: 'gen'; id: string; frage: string; typ: string; g: Generator };

function ErgebnisPunkt({ q }: { q: number | undefined }) {
  if (q === undefined) return <span className="ergebnis-punkt offen" title="noch nicht bearbeitet" />;
  return <span className={`ergebnis-punkt ${q >= 0.75 ? 'gut' : q >= 0.4 ? 'mittel' : 'schwach'}`} title={`${Math.round(q * 100)} % richtig`} />;
}

function UebungenTab({ t }: { t: Thema }) {
  const daten = useStore();
  const eintraege: UebEintrag[] = useMemo(
    () => [
      ...t.uebungen.map((u) => ({ art: 'uebung' as const, id: u.id, frage: u.frage.split('\n')[0], typ: u.typ === 'schreiben' ? (operatorVon(u.operator)?.name ?? 'Schreiben') : u.typ })),
      ...t.generatoren.filter((g) => g.art === 'diagramm').map((g) => ({ art: 'gen' as const, id: g.id, frage: g.titel, typ: 'diagramm', g })),
    ],
    [t],
  );
  const key = `uebungen:${t.id}`;
  const [pos, setPos] = useGemerkt<{ aktiv: number | null; seed: number }>(key, () => ({ aktiv: null, seed: neuerSeed() }));
  const aktiv = pos.aktiv !== null && pos.aktiv < eintraege.length ? pos.aktiv : null;
  const seed = pos.seed;
  const setzeAktuell = useLaufend((s) => s.setzeAktuell);
  const entferneAktuell = useLaufend((s) => s.entferneAktuell);

  useEffect(() => {
    if (aktiv === null) entferneAktuell(key);
    else
      setzeAktuell({
        key,
        art: 'uebungen',
        titel: `Übungen · ${t.titel}`,
        stand: `Übung ${aktiv + 1} von ${eintraege.length}`,
        anteil: aktiv / eintraege.length,
        pfad: `/thema/${t.id}/uebungen`,
      });
  }, [aktiv, key, t, eintraege.length, setzeAktuell, entferneAktuell]);

  const setAktiv = (a: number | null) => setPos({ aktiv: a, seed: neuerSeed() });
  const handy = useIstHandy();

  if (eintraege.length === 0) return <Leer icon="stift" titel="Noch keine Übungen" />;

  if (aktiv !== null) {
    const e = eintraege[aktiv];
    const weiter = () => setAktiv(aktiv + 1 < eintraege.length ? aktiv + 1 : null);
    const weiterText = aktiv + 1 < eintraege.length ? 'Nächste Übung' : 'Fertig';
    const inhalt =
      e.art === 'uebung' ? (
        <UebungAnsicht key={e.id} uebung={t.uebungen.find((u) => u.id === e.id)!} themaId={t.id} onWeiter={weiter} weiterText={weiterText} />
      ) : (
        <>
          <AufgabenAnsicht key={`${e.id}-${seed}`} generator={e.g} themaId={t.id} seed={seed} speicherKey={`aufgabe:${key}`} onNeu={() => setPos({ aktiv, seed: neuerSeed() })} />
          <div className="aktionen">
            <button className="btn" onClick={weiter}>
              {weiterText} <Icon name="rechts" size={16} />
            </button>
          </div>
        </>
      );
    if (handy)
      return (
        <VollbildRahmen
          titel={`Übungen · ${t.titel}`}
          stand={`${aktiv + 1}/${eintraege.length}`}
          anteil={aktiv / eintraege.length}
          wechsel={`${e.id}-${seed}`}
          onZu={() => setAktiv(null)}
          fuss={
            <div className="sitzung-nav">
              <button type="button" className="btn geist klein" onClick={() => aktiv > 0 && setAktiv(aktiv - 1)} disabled={aktiv === 0}>
                <Icon name="links" size={16} /> Vorherige
              </button>
              <button type="button" className="btn geist klein" onClick={weiter}>
                {aktiv + 1 < eintraege.length ? 'Überspringen' : 'Beenden'} <Icon name="rechts" size={16} />
              </button>
            </div>
          }
        >
          <div className="panel">{inhalt}</div>
        </VollbildRahmen>
      );
    return (
      <div className="stapel">
        <div className="zeile zwischen">
          <button className="btn geist klein" onClick={() => setAktiv(null)}>
            <Icon name="links" size={16} /> Alle Übungen
          </button>
          <span className="mono sehr-leise klein">
            {aktiv + 1} / {eintraege.length}
          </span>
        </div>
        <div className="panel">{inhalt}</div>
      </div>
    );
  }

  return (
    <div className="stapel">
      <div className="zeile zwischen">
        <p className="leise" style={{ margin: 0 }}>
          Verständnisaufgaben im Klausurstil. Nach dem Prüfen siehst du zu jeder Antwort, warum sie stimmt oder nicht.
        </p>
        <button className="btn primaer" onClick={() => setAktiv(0)}>
          <Icon name="play" size={16} /> Der Reihe nach
        </button>
      </div>
      <ul className="aufgaben-liste">
        {eintraege.map((e, i) => (
          <li key={e.id}>
            <button type="button" onClick={() => setAktiv(i)}>
              <ErgebnisPunkt q={quote(daten, e.art === 'uebung' ? uebKey(e.id) : genKey(e.id))} />
              <span className="aufgabe-titel">
                <Md text={e.frage} inline />
              </span>
              <span className="chip">{TYP_LABEL[e.typ] ?? e.typ}</span>
              <Icon name="rechts" size={16} className="sehr-leise" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

const TYP_LABEL: Record<string, string> = {
  mc: 'Begründen',
  reihenfolge: 'Reihenfolge',
  luecke: 'Lücken',
  fehler: 'Fehler finden',
  zuordnen: 'Zuordnen',
  klassifizieren: 'Klassifizieren',
  diagramm: 'Diagramm',
};

function RechenTab({ t }: { t: Thema }) {
  const daten = useStore();
  const gens = t.generatoren.filter((g) => g.art === 'rechnen');
  const key = `rechnen:${t.id}`;
  const [pos, setPos] = useGemerkt<{ gen: string | null; seed: number }>(key, () => ({ gen: null, seed: neuerSeed() }));
  const aktiv = gens.find((g) => g.id === pos.gen) ?? null;
  const seed = pos.seed;
  const setzeAktuell = useLaufend((s) => s.setzeAktuell);
  const entferneAktuell = useLaufend((s) => s.entferneAktuell);

  useEffect(() => {
    if (!aktiv) entferneAktuell(key);
    else setzeAktuell({ key, art: 'rechnen', titel: `Rechentrainer · ${t.titel}`, stand: aktiv.titel, pfad: `/thema/${t.id}/rechnen` });
  }, [aktiv, key, t, setzeAktuell, entferneAktuell]);

  const setAktiv = (g: Generator | null) => setPos({ gen: g?.id ?? null, seed: neuerSeed() });
  const handy = useIstHandy();

  if (gens.length === 0) return <Leer icon="rechner" titel="Noch keine Rechenaufgaben" />;
  if (aktiv && handy)
    return (
      <VollbildRahmen titel={`Rechentrainer · ${aktiv.titel}`} wechsel={`${aktiv.id}-${seed}`} onZu={() => setAktiv(null)}>
        <div className="panel">
          <AufgabenAnsicht key={seed} generator={aktiv} themaId={t.id} seed={seed} speicherKey={`aufgabe:${key}`} onNeu={() => setAktiv(aktiv)} />
        </div>
      </VollbildRahmen>
    );
  if (aktiv)
    return (
      <div className="stapel">
        <div className="zeile zwischen">
          <button className="btn geist klein" onClick={() => setAktiv(null)}>
            <Icon name="links" size={16} /> Alle Aufgabentypen
          </button>
          <span className="sehr-leise klein">
            Rechne im Heft, tippe nur das Ergebnis ein – Brüche wie 3/4 gehen auch.
            <span className="nur-tastatur">
              {' '}
              <Taste>H</Taste> Hilfe
            </span>
          </span>
        </div>
        <div className="panel">
          <AufgabenAnsicht key={seed} generator={aktiv} themaId={t.id} seed={seed} speicherKey={`aufgabe:${key}`} onNeu={() => setAktiv(aktiv)} />
        </div>
      </div>
    );

  return (
    <div className="stapel">
      <p className="leise" style={{ margin: 0 }}>
        Jede Runde hat neue Zahlen. Rechne im Heft und tippe nur das Ergebnis ein – Komma oder Punkt, die Einheit wählst du im Menü oder schreibst sie dahinter. Bei Fehlern kommen die Hilfen Schritt für Schritt.
      </p>
      <ul className="aufgaben-liste">
        {gens.map((g) => (
          <li key={g.id}>
            <button type="button" onClick={() => setAktiv(g)}>
              <ErgebnisPunkt q={quote(daten, genKey(g.id))} />
              <span className="aufgabe-titel">{g.titel}</span>
              <span className="schwierigkeit" title={`Schwierigkeit ${g.schwierigkeit} von 3`}>
                {[1, 2, 3].map((s) => (
                  <span key={s} className={s <= g.schwierigkeit ? 'an' : ''} />
                ))}
              </span>
              <span className="sehr-leise klein quelle-kurz">{g.quelle}</span>
              <Icon name="rechts" size={16} className="sehr-leise" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
