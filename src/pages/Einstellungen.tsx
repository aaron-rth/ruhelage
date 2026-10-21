import { useRef, useState } from 'react';
import { Meldung } from '../components/Basis';
import { EINFUEHRUNG } from '../components/Einfuehrung';
import { Icon } from '../components/Icon';
import { heute } from '../lib/datum';
import { useIstHandy } from '../lib/geraet';
import { intervallText, TAKTE, type Takt } from '../lib/leitner';
import { exportiere, liesImport, useStore } from '../store/store';

function Zahl({ label, wert, min, max, schritt = 1, einheit, onChange }: { label: string; wert: number; min: number; max: number; schritt?: number; einheit: string; onChange: (n: number) => void }) {
  return (
    <div className="einst-zeile">
      <label>{label}</label>
      <div className="zahl-stepper">
        <button className="btn klein" onClick={() => onChange(Math.max(min, wert - schritt))} aria-label={`${label} verringern`}>
          −
        </button>
        <span className="mono">
          {wert} {einheit}
        </span>
        <button className="btn klein" onClick={() => onChange(Math.min(max, wert + schritt))} aria-label={`${label} erhöhen`}>
          +
        </button>
      </div>
    </div>
  );
}

function Schalter({ label, an, onChange, text }: { label: string; an: boolean; onChange: (b: boolean) => void; text?: string }) {
  return (
    <div className="einst-zeile">
      <div>
        <label>{label}</label>
        {text && <p className="sehr-leise klein" style={{ margin: 0 }}>{text}</p>}
      </div>
      <button type="button" role="switch" aria-checked={an} aria-label={label} className="schalter" onClick={() => onChange(!an)} />
    </div>
  );
}

export function Einstellungen() {
  const s = useStore();
  const handy = useIstHandy();
  const e = s.einstellungen;
  const datei = useRef<HTMLInputElement>(null);
  const [meldung, setMeldung] = useState<{ art: 'richtig' | 'falsch'; text: string } | null>(null);
  const [sicher, setSicher] = useState(false);

  function herunterladen() {
    const blob = new Blob([JSON.stringify(exportiere(s), null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ruhelage-fortschritt-${heute()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setMeldung({ art: 'richtig', text: 'Sicherung heruntergeladen.' });
  }

  async function hochladen(f: File) {
    try {
      const d = liesImport(await f.text());
      s.importiere(d);
      setMeldung({ art: 'richtig', text: 'Fortschritt wiederhergestellt.' });
    } catch (err) {
      setMeldung({ art: 'falsch', text: err instanceof Error ? err.message : 'Die Datei konnte nicht gelesen werden.' });
    }
  }

  return (
    <div className="inhalt schmal">
      <div className="kopf">
        <div>
          <span className="ueber">Einstellungen</span>
          <h1>Deine App</h1>
          <p>Alles bleibt lokal in diesem Browser gespeichert. Mit einer Sicherung kannst du deinen Fortschritt auf ein anderes Gerät mitnehmen.</p>
        </div>
      </div>

      <section className="panel">
        <h3 className="mb">Tagesziel</h3>
        <Zahl label="Lernzeit" wert={e.zielMinuten} min={5} max={90} schritt={5} einheit="min" onChange={(n) => s.setzeEinstellung('zielMinuten', n)} />
        <Zahl label="Karteikarten pro Runde" wert={e.zielKarten} min={5} max={60} schritt={5} einheit="" onChange={(n) => s.setzeEinstellung('zielKarten', n)} />
        <Zahl label="Aufgaben pro Runde" wert={e.zielAufgaben} min={1} max={15} einheit="" onChange={(n) => s.setzeEinstellung('zielAufgaben', n)} />
      </section>

      <section className="panel">
        <h3 className="mb">Karteikarten</h3>
        <div className="einst-zeile einst-spalte">
          <div>
            <label>Wiederholungsabstand</label>
            <p className="sehr-leise klein" style={{ margin: 0 }}>
              Nach wie vielen Tagen eine Karte in Fach 1 bis 5 wiederkommt: <span className="mono">{intervallText(TAKTE[e.takt].intervalle)}</span> – {TAKTE[e.takt].text}. Gilt sofort auch für schon gelernte Karten.
            </p>
          </div>
          <div className="segment">
            {(Object.keys(TAKTE) as Takt[]).map((t) => (
              <button key={t} className={e.takt === t ? 'an' : ''} aria-pressed={e.takt === t} onClick={() => s.setzeTakt(t)}>
                {TAKTE[t].label}
              </button>
            ))}
          </div>
        </div>
        {handy && (
        <Schalter
          label="Wischgesten"
          an={e.wischen}
          onChange={(b) => s.setzeEinstellung('wischen', b)}
          text="Tippen dreht die Karte um. Danach: nach rechts = wusste ich, nach oben = so halb, nach links = nicht. Vor dem Umdrehen blätterst du mit Wischen. Ausgeschaltet gibt es nur Knöpfe."
        />
        )}
      </section>

      <section className="panel">
        <h3 className="mb">Anzeige</h3>
        <Schalter label="Countdown bis zur Klausur" an={e.countdown} onChange={(b) => s.setzeEinstellung('countdown', b)} text="Ein dezenter Hinweis, wie viele Tage noch bleiben." />
        <div className="einst-zeile">
          <label htmlFor="klausurdatum">Klausurtermin</label>
          <input id="klausurdatum" type="date" className="eingabe" value={e.klausurDatum} onChange={(ev) => ev.target.value && s.setzeEinstellung('klausurDatum', ev.target.value)} />
        </div>
        <Schalter
          label="Einführung und Hinweise"
          an={e.hinweise}
          onChange={(b) => {
            s.setzeEinstellung('hinweise', b);
            if (b) s.hinweiseZuruecksetzen();
          }}
          text="Kurze Erklärungen beim ersten Öffnen, z. B. wo was ist und wie die Selbsteinschätzung funktioniert. Beim Einschalten werden alle Hinweise wieder gezeigt."
        />
        <div className="einst-zeile">
          <label>Einführung</label>
          <button
            className="btn klein"
            onClick={() => {
              s.setzeEinstellung('hinweise', true);
              useStore.setState((st) => ({ gesehen: st.gesehen.filter((g) => g !== EINFUEHRUNG) }));
            }}
          >
            <Icon name="play" size={14} /> Jetzt ansehen
          </button>
        </div>
        <div className="einst-zeile">
          <label>Farbschema</label>
          <div className="segment">
            <button className={e.theme === 'dark' ? 'an' : ''} onClick={() => s.setzeEinstellung('theme', 'dark')}>
              <Icon name="mond" size={14} /> Dunkel
            </button>
            <button className={e.theme === 'light' ? 'an' : ''} onClick={() => s.setzeEinstellung('theme', 'light')}>
              <Icon name="sonne" size={14} /> Hell
            </button>
          </div>
        </div>
      </section>

      <section className="panel">
        <h3 className="mb">Sicherung</h3>
        <p className="leise klein">Exportiere deinen Fortschritt als JSON-Datei, zum Beispiel einmal pro Woche.</p>
        <div className="zeile">
          <button className="btn" onClick={herunterladen}>
            <Icon name="upload" size={16} /> Exportieren
          </button>
          <button className="btn" onClick={() => datei.current?.click()}>
            <Icon name="download" size={16} /> Importieren
          </button>
          <input
            ref={datei}
            type="file"
            accept="application/json,.json"
            hidden
            onChange={(ev) => {
              const f = ev.target.files?.[0];
              if (f) hochladen(f);
              ev.target.value = '';
            }}
          />
        </div>
        {meldung && (
          <div style={{ marginTop: 12 }}>
            <Meldung art={meldung.art}>{meldung.text}</Meldung>
          </div>
        )}
      </section>

      <section className="panel">
        <h3 className="mb">Neu anfangen</h3>
        <p className="leise klein">Setzt Karten, Ergebnisse, Nochmal-Stapel und Einstellungen zurück. Das lässt sich nicht rückgängig machen – exportiere vorher eine Sicherung.</p>
        {!sicher ? (
          <button className="btn" onClick={() => setSicher(true)}>
            <Icon name="muell" size={16} /> Fortschritt zurücksetzen …
          </button>
        ) : (
          <div className="zeile">
            <button
              className="btn gefahr"
              onClick={() => {
                s.zuruecksetzen();
                setSicher(false);
                setMeldung({ art: 'richtig', text: 'Alles zurückgesetzt.' });
              }}
            >
              Ja, wirklich zurücksetzen
            </button>
            <button className="btn geist" onClick={() => setSicher(false)}>
              Abbrechen
            </button>
          </div>
        )}
      </section>

      {!handy && (
      <section className="panel">
        <h3 className="mb">Tastatur</h3>
        <dl className="tasten-liste">
          <div><dt><kbd className="taste">Leertaste</kbd></dt><dd>Karte umdrehen</dd></div>
          <div><dt><kbd className="taste">1</kbd> <kbd className="taste">2</kbd> <kbd className="taste">3</kbd></dt><dd>wusste ich / so halb / nicht</dd></div>
          <div><dt><kbd className="taste">←</kbd> <kbd className="taste">→</kbd></dt><dd>vorherige / nächste Karte, Formelsammlung blättern</dd></div>
          <div><dt><kbd className="taste">E</kbd></dt><dd>Genauer erklärt (nach dem Umdrehen bzw. Prüfen)</dd></div>
          <div><dt><kbd className="taste">Enter</kbd></dt><dd>prüfen, weiter, Runde starten</dd></div>
          <div><dt><kbd className="taste">F</kbd></dt><dd>Fokusmodus an/aus (Seitenleiste ausblenden)</dd></div>
          <div><dt><kbd className="taste">Esc</kbd></dt><dd>Eingabefeld verlassen (danach gehen H, L, N)</dd></div>
          <div><dt><kbd className="taste">H</kbd></dt><dd>nächste Hilfestufe</dd></div>
          <div><dt><kbd className="taste">L</kbd></dt><dd>Lösungsweg (nach allen Hilfen)</dd></div>
          <div><dt><kbd className="taste">N</kbd></dt><dd>neue Aufgabe</dd></div>
          <div><dt><kbd className="taste">1</kbd>–<kbd className="taste">4</kbd></dt><dd>Antwort bei Multiple Choice wählen</dd></div>
        </dl>
      </section>
      )}
    </div>
  );
}
