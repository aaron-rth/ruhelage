// Eigene Karteikarten bearbeiten: Fach mit seinen Sets, und pro Set eine Liste zum schnellen Eintippen.
// Enter springt ins nächste Feld, nach der zweiten Seite entsteht direkt die nächste Karte.
import { useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent, type TextareaHTMLAttributes } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Leer } from '../components/Basis';
import { Dialog } from '../components/Dialog';
import { Icon } from '../components/Icon';
import { LoeschDialog } from '../components/LoeschDialog';
import {
  aendereFach,
  aendereKarte,
  aendereSet,
  erkenneTrenner,
  kartenVon,
  legeKarteAn,
  legeSetAn,
  leseListe,
  loescheFach,
  loescheKarte,
  loescheSet,
  setsVon,
} from '../lib/eigene';
import { useStore, type EigeneKarte, type EigenesSet, type Merkhilfe } from '../store/store';

/** Textfeld, das mit dem Inhalt wächst (einzeilig aussehend, Zeilenumbruch mit Shift+Enter) */
function Feld(props: TextareaHTMLAttributes<HTMLTextAreaElement> & { feldRef?: (el: HTMLTextAreaElement | null) => void }) {
  const { feldRef, ...rest } = props;
  const el = useRef<HTMLTextAreaElement | null>(null);
  useLayoutEffect(() => {
    const t = el.current;
    if (!t) return;
    t.style.height = 'auto';
    t.style.height = `${t.scrollHeight}px`;
  }, [props.value]);
  return (
    <textarea
      rows={1}
      enterKeyHint="next"
      {...rest}
      ref={(x) => {
        el.current = x;
        feldRef?.(x);
      }}
      className={`eingabe karten-feld ${props.className ?? ''}`}
    />
  );
}

const MERK_ARTEN: { id: Merkhilfe['art']; label: string; text: string }[] = [
  { id: 'luecke', label: 'Lückensatz', text: 'Auf der Frageseite steht der Satz mit ___ statt der Antwort, auf der Antwortseite vollständig. Schreib ihn ganz normal – die App blendet das Wort selbst aus.' },
  { id: 'frage', label: 'Tipp bei der Frage', text: 'Auf der Frageseite erst auf Knopfdruck, auf der Antwortseite immer.' },
  { id: 'antwort', label: 'Nur bei der Antwort', text: 'Erscheint erst nach dem Umdrehen.' },
];

function MerkFeld({ merk, onChange }: { merk?: Merkhilfe; onChange: (m: Merkhilfe | undefined) => void }) {
  const art = merk?.art ?? 'luecke';
  return (
    <div className="merk-feld">
      <div className="segment" role="radiogroup" aria-label="Art der Merkhilfe">
        {MERK_ARTEN.map((m) => (
          <button key={m.id} type="button" role="radio" aria-checked={art === m.id} className={art === m.id ? 'an' : ''} onClick={() => onChange({ text: merk?.text ?? '', art: m.id })}>
            {m.label}
          </button>
        ))}
      </div>
      <Feld
        value={merk?.text ?? ''}
        placeholder={art === 'luecke' ? 'Merksatz, z. B. „I live in a house with my family.“' : 'Merkhilfe, z. B. Eselsbrücke'}
        onChange={(e) => onChange(e.target.value ? { text: e.target.value, art } : undefined)}
        aria-label="Merkhilfe"
      />
      <span className="sehr-leise klein">{MERK_ARTEN.find((m) => m.id === art)!.text}</span>
    </div>
  );
}

/** Eine bestehende Karte: zwei Felder in Eintipp-Reihenfolge, Merkhilfe, Löschen */
function KartenZeile({
  karte,
  set,
  nr,
  registriere,
  weiter,
}: {
  karte: EigeneKarte;
  set: EigenesSet;
  nr: number;
  registriere: (id: string, i: 0 | 1, el: HTMLTextAreaElement | null) => void;
  weiter: (id: string, i: 0 | 1) => void;
}) {
  const [merkOffen, setMerkOffen] = useState(false);
  const seiten: ('vorne' | 'hinten')[] = set.zuerst === 'hinten' ? ['hinten', 'vorne'] : ['vorne', 'hinten'];
  const name = (s: 'vorne' | 'hinten') => (s === 'vorne' ? set.namen[0] : set.namen[1]);
  const taste = (i: 0 | 1) => (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      weiter(karte.id, i);
    }
  };
  return (
    <li className="karten-zeile">
      <span className="karten-nr mono sehr-leise">{nr}</span>
      <div className="karten-felder">
        {seiten.map((s, i) => (
          <Feld
            key={s}
            value={karte[s]}
            placeholder={name(s)}
            aria-label={`${name(s)} (Karte ${nr})`}
            onChange={(e) => aendereKarte(karte.id, { [s]: e.target.value })}
            onKeyDown={taste(i as 0 | 1)}
            feldRef={(el) => registriere(karte.id, i as 0 | 1, el)}
          />
        ))}
        {(merkOffen || karte.merk) && <MerkFeld merk={karte.merk} onChange={(m) => aendereKarte(karte.id, { merk: m })} />}
      </div>
      <div className="karten-zeile-knoepfe">
        <button type="button" className={`btn geist klein symbol-knopf${karte.merk ? ' an' : ''}`} onClick={() => setMerkOffen((o) => !o)} title="Merkhilfe" aria-label="Merkhilfe" aria-expanded={merkOffen || !!karte.merk}>
          <Icon name="licht" size={16} />
        </button>
        <button type="button" className="btn geist klein symbol-knopf" onClick={() => loescheKarte(karte.id)} title="Karte löschen" aria-label={`Karte ${nr} löschen`}>
          <Icon name="muell" size={16} />
        </button>
      </div>
    </li>
  );
}

function ListeEinfuegen({ set, onZu }: { set: EigenesSet; onZu: () => void }) {
  const [text, setText] = useState('');
  const [tausch, setTausch] = useState(set.zuerst === 'hinten');
  const trenner = erkenneTrenner(text);
  const paare = leseListe(text, trenner);
  const sichtbar = (t: string) => (t === '\t' ? 'Tab' : `„${t.trim() || t}“`);
  return (
    <Dialog titel="Liste einfügen" onSchliessen={onZu}>
      <div className="stapel">
        <p className="leise klein" style={{ margin: 0 }}>
          Eine Karte pro Zeile, die Seiten getrennt durch Tab, „–“, „-“, „=“, „;“ oder „:“ – so, wie man es aus einer Tabelle oder Vokabelliste kopiert.
        </p>
        <textarea className="eingabe liste-feld" rows={8} value={text} onChange={(e) => setText(e.target.value)} placeholder={'house – Haus\ntree – Baum\nto go – gehen'} autoFocus aria-label="Liste" />
        <label className="hilfe-info">
          <input type="checkbox" checked={tausch} onChange={(e) => setTausch(e.target.checked)} />
          <span className="klein">
            Erste Spalte ist „{set.namen[1]}“ (sonst „{set.namen[0]}“)
          </span>
        </label>
        {text.trim() && (
          <p className="klein" style={{ margin: 0 }}>
            {paare.length ? (
              <>
                {paare.length} {paare.length === 1 ? 'Karte' : 'Karten'} erkannt (Trenner {sichtbar(trenner!)}), z. B. <strong>{tausch ? paare[0][1] : paare[0][0]}</strong> → <strong>{tausch ? paare[0][0] : paare[0][1]}</strong>
              </>
            ) : (
              'Kein Trennzeichen erkannt – jede Zeile braucht zwei Teile.'
            )}
          </p>
        )}
        <button
          type="button"
          className="btn primaer"
          disabled={!paare.length}
          onClick={() => {
            for (const [a, b] of paare) tausch ? legeKarteAn(set.id, b, a) : legeKarteAn(set.id, a, b);
            onZu();
          }}
        >
          <Icon name="plus" size={16} /> {paare.length || ''} Karten hinzufügen
        </button>
      </div>
    </Dialog>
  );
}

export function SetBearbeiten() {
  const { fachId = '', setId = '' } = useParams();
  const eigene = useStore((s) => s.eigene);
  const set = eigene.sets[setId];
  const fach = eigene.faecher[fachId];
  const karten = set ? kartenVon(eigene, setId) : [];
  const felder = useRef(new Map<string, HTMLTextAreaElement | null>());
  const [neu, setNeu] = useState<[string, string]>(['', '']);
  const neuFelder = useRef<(HTMLTextAreaElement | null)[]>([]);
  const [liste, setListe] = useState(false);
  const [einstellungen, setEinstellungen] = useState(karten.length === 0);
  const navigate = useNavigate();

  // neues Set: gleich ins erste Feld
  useEffect(() => {
    if (karten.length === 0) neuFelder.current[0]?.focus();
    // nur beim Öffnen
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setId]);

  if (!set || set.geloescht || !fach || fach.geloescht) return <Leer titel="Set nicht gefunden" />;

  const reihe: ('vorne' | 'hinten')[] = set.zuerst === 'hinten' ? ['hinten', 'vorne'] : ['vorne', 'hinten'];
  const name = (s: 'vorne' | 'hinten') => (s === 'vorne' ? set.namen[0] : set.namen[1]);
  const registriere = (id: string, i: 0 | 1, el: HTMLTextAreaElement | null) => felder.current.set(`${id}:${i}`, el);
  const weiter = (id: string, i: 0 | 1) => {
    if (i === 0) return felder.current.get(`${id}:1`)?.focus();
    const pos = karten.findIndex((k) => k.id === id);
    const naechste = karten[pos + 1];
    (naechste ? felder.current.get(`${naechste.id}:0`) : neuFelder.current[0])?.focus();
  };
  function neueKarte() {
    const werte = { [reihe[0]]: neu[0], [reihe[1]]: neu[1] } as Record<'vorne' | 'hinten', string>;
    if (!werte.vorne.trim() || !werte.hinten.trim()) return;
    legeKarteAn(setId, werte.vorne, werte.hinten);
    setNeu(['', '']);
    neuFelder.current[0]?.focus();
  }
  const neuTaste = (i: 0 | 1) => (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key !== 'Enter' || e.shiftKey || e.nativeEvent.isComposing) return;
    e.preventDefault();
    if (i === 0) {
      if (neu[0].trim()) neuFelder.current[1]?.focus();
    } else if (!neu[0].trim()) neuFelder.current[0]?.focus();
    else neueKarte();
  };

  const [n1, n2] = set.namen;
  return (
    <div className="inhalt schmal">
      <Link to={`/eigen/${fachId}`} className="zurueck sehr-leise klein">
        <Icon name="links" size={14} /> {fach.name}
      </Link>
      <div className="kopf">
        <div style={{ flex: 1, minWidth: 0 }}>
          <span className="ueber">Eigene Karteikarten · {fach.name}</span>
          <input className="titel-feld" value={set.titel} onChange={(e) => aendereSet(setId, { titel: e.target.value })} aria-label="Name des Sets" placeholder="Name des Sets" />
          <p>
            {karten.length} {karten.length === 1 ? 'Karte' : 'Karten'}
          </p>
        </div>
      </div>

      <div className="zeile set-aktionen">
        <Link to={`/thema/${setId}/karten`} className={`btn primaer${karten.length ? '' : ' deaktiviert'}`} aria-disabled={!karten.length} onClick={(e) => !karten.length && e.preventDefault()}>
          <Icon name="play" size={16} /> Lernen
        </Link>
        <button type="button" className="btn" onClick={() => setListe(true)}>
          <Icon name="upload" size={16} /> Liste einfügen
        </button>
        <button type="button" className="btn geist" onClick={() => setEinstellungen((x) => !x)} aria-expanded={einstellungen}>
          <Icon name="einstellungen" size={16} /> Einstellungen
        </button>
      </div>

      {einstellungen && (
        <section className="panel set-einstellungen">
          <div className="set-einst-zeile">
            <span className="klein">Namen der Seiten</span>
            <div className="zeile" style={{ gap: 6 }}>
              <input className="eingabe" value={n1} onChange={(e) => aendereSet(setId, { namen: [e.target.value, n2] })} aria-label="Name der Vorderseite" placeholder="z. B. Englisch" />
              <input className="eingabe" value={n2} onChange={(e) => aendereSet(setId, { namen: [n1, e.target.value] })} aria-label="Name der Rückseite" placeholder="z. B. Deutsch" />
            </div>
          </div>
          <div className="set-einst-zeile">
            <span className="klein">Beim Eintippen zuerst</span>
            <div className="segment" role="radiogroup">
              {(['vorne', 'hinten'] as const).map((s) => (
                <button key={s} type="button" role="radio" aria-checked={set.zuerst === s} className={set.zuerst === s ? 'an' : ''} onClick={() => aendereSet(setId, { zuerst: s })}>
                  {name(s)}
                </button>
              ))}
            </div>
          </div>
          <div className="set-einst-zeile">
            <span className="klein">Abfrage</span>
            <div className="segment" role="radiogroup">
              {(
                [
                  ['vor', `${n1} → ${n2}`],
                  ['rueck', `${n2} → ${n1}`],
                  ['gemischt', 'Gemischt'],
                ] as const
              ).map(([r, t]) => (
                <button key={r} type="button" role="radio" aria-checked={set.richtung === r} className={set.richtung === r ? 'an' : ''} onClick={() => aendereSet(setId, { richtung: r })}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="set-einst-zeile">
            <span className="klein">Beim Lernen</span>
            <div className="segment" role="radiogroup">
              {(
                [
                  ['umdrehen', 'Umdrehen'],
                  ['tippen', 'Antwort eintippen'],
                ] as const
              ).map(([m, t]) => (
                <button key={m} type="button" role="radio" aria-checked={set.modus === m} className={set.modus === m ? 'an' : ''} onClick={() => aendereSet(setId, { modus: m })}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <p className="sehr-leise klein" style={{ margin: 0 }}>
            Bei „Gemischt“ wird jede Richtung einzeln gelernt – wer „house → Haus“ kann, kann nicht automatisch „Haus → house“.
          </p>
        </section>
      )}

      <div className="karten-spalten sehr-leise klein" aria-hidden>
        <span />
        <span>{name(reihe[0])}</span>
        <span>{name(reihe[1])}</span>
      </div>
      <ol className="eigene-kartenliste">
        {karten.map((k, i) => (
          <KartenZeile key={k.id} karte={k} set={set} nr={i + 1} registriere={registriere} weiter={weiter} />
        ))}
        <li className="karten-zeile neu">
          <span className="karten-nr mono sehr-leise">
            <Icon name="plus" size={14} />
          </span>
          <div className="karten-felder">
            {[0, 1].map((i) => (
              <Feld
                key={i}
                value={neu[i]}
                placeholder={`${name(reihe[i])}${i === 0 ? ' – Enter für die andere Seite' : ' – Enter für die nächste Karte'}`}
                aria-label={`Neue Karte: ${name(reihe[i])}`}
                onChange={(e) => setNeu((alt) => (i === 0 ? [e.target.value, alt[1]] : [alt[0], e.target.value]))}
                onKeyDown={neuTaste(i as 0 | 1)}
                feldRef={(el) => (neuFelder.current[i] = el)}
              />
            ))}
          </div>
          <div className="karten-zeile-knoepfe">
            <button type="button" className="btn geist klein symbol-knopf" onClick={neueKarte} disabled={!neu[0].trim() || !neu[1].trim()} title="Karte hinzufügen" aria-label="Karte hinzufügen">
              <Icon name="check" size={16} />
            </button>
          </div>
        </li>
      </ol>
      <p className="sehr-leise klein">
        Enter springt ins nächste Feld, Shift+Enter macht einen Zeilenumbruch. Alles wird sofort gespeichert. Die 💡-Taste fügt eine Merkhilfe hinzu.
      </p>
      {liste && <ListeEinfuegen set={set} onZu={() => setListe(false)} />}
      <button
        type="button"
        className="btn geist klein"
        style={{ marginTop: 16 }}
        onClick={() => {
          if (karten.length && !window.confirm(`„${set.titel}“ mit ${karten.length} Karten löschen?`)) return;
          loescheSet(setId);
          navigate(`/eigen/${fachId}`);
        }}
      >
        <Icon name="muell" size={16} /> Set löschen
      </button>
    </div>
  );
}

export function EigenesFach() {
  const { fachId = '' } = useParams();
  const eigene = useStore((s) => s.eigene);
  const fach = eigene.faecher[fachId];
  const navigate = useNavigate();
  const [loeschen, setLoeschen] = useState(false);
  if (!fach || fach.geloescht) return <Leer titel="Fach nicht gefunden" />;
  const sets = setsVon(eigene, fachId);
  const anzahl = (id: string) => kartenVon(eigene, id).length;
  const gesamt = sets.reduce((a, s) => a + anzahl(s.id), 0);

  return (
    <div className="inhalt schmal">
      <Link to="/faecher" className="zurueck sehr-leise klein">
        <Icon name="links" size={14} /> Fächer
      </Link>
      <div className="kopf">
        <div style={{ flex: 1, minWidth: 0 }}>
          <span className="ueber">Eigenes Karteikarten-Fach</span>
          <input className="titel-feld" value={fach.name} onChange={(e) => aendereFach(fachId, { name: e.target.value })} aria-label="Name des Fachs" placeholder="Name des Fachs" />
          <p>
            {sets.length} {sets.length === 1 ? 'Set' : 'Sets'} · {gesamt} {gesamt === 1 ? 'Karte' : 'Karten'}
          </p>
        </div>
      </div>
      <div className="set-einst-zeile panel" style={{ marginBottom: 16 }}>
        <span className="klein">Stufe (optional)</span>
        <input className="eingabe" style={{ maxWidth: 160 }} value={fach.klasse} onChange={(e) => aendereFach(fachId, { klasse: e.target.value })} placeholder="z. B. K1" aria-label="Stufe" />
      </div>
      <ul className="eigene-sets">
        {sets.map((s) => (
          <li key={s.id}>
            <Link to={`/eigen/${fachId}/${s.id}`} className="eigenes-set">
              <span className="modus-icon">
                <Icon name="karten" size={20} />
              </span>
              <span className="fach-reihe-text">
                <strong>{s.titel || 'Ohne Namen'}</strong>
                <span className="sehr-leise klein">
                  {anzahl(s.id)} Karten · {s.namen[0]} / {s.namen[1]}
                </span>
              </span>
              <Icon name="stift" size={16} className="sehr-leise" />
            </Link>
            <Link to={`/thema/${s.id}/karten`} className="btn geist klein" title="Lernen" aria-label={`${s.titel} lernen`}>
              <Icon name="play" size={16} />
            </Link>
          </li>
        ))}
      </ul>
      <button type="button" className="btn" onClick={() => navigate(`/eigen/${fachId}/${legeSetAn(fachId)}`)}>
        <Icon name="plus" size={16} /> Neues Set
      </button>
      <div style={{ marginTop: 32 }}>
        <button type="button" className="btn geist klein" onClick={() => setLoeschen(true)}>
          <Icon name="muell" size={16} /> Fach löschen …
        </button>
      </div>
      {loeschen && (
        <LoeschDialog
          titel={`„${fach.name}“ wirklich löschen?`}
          weg={[`${sets.length} ${sets.length === 1 ? 'Set' : 'Sets'} mit ${gesamt} selbst eingetippten Karten`, 'Der Lernstand dieser Karten', 'Auch auf deinen anderen Geräten (nach dem Abgleich)']}
          bleibt={['Alle anderen Fächer und ihr Fortschritt']}
          knopf="Fach endgültig löschen"
          onZu={() => setLoeschen(false)}
          onLoeschen={() => {
            loescheFach(fachId);
            setLoeschen(false);
            navigate('/faecher');
          }}
        />
      )}
    </div>
  );
}
