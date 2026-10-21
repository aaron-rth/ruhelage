// „Aktuell“: alles, was angefangen wurde – mit einem Klick weitermachen.
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { setzePausiert } from '../components/Sitzung';
import { Balken, Leer } from '../components/Basis';
import { Icon } from '../components/Icon';
import { heute } from '../lib/datum';
import type { SitzungsStand } from '../lib/sitzung';
import { useLaufend, zeitText, type AktuellArt, type AktuellEintrag } from '../store/laufend';

const ART: Record<AktuellArt, { icon: string; label: string }> = {
  heute: { icon: 'heute', label: 'Tagesrunde' },
  karten: { icon: 'karten', label: 'Karteikarten' },
  nochmal: { icon: 'nochmal', label: 'Nochmal-Stapel' },
  uebungen: { icon: 'stift', label: 'Übungen' },
  rechnen: { icon: 'rechner', label: 'Rechentrainer' },
  lesen: { icon: 'buch', label: 'Zuletzt gelesen' },
};

const SITZUNG: AktuellArt[] = ['heute', 'karten', 'nochmal'];

/** Einträge, die noch wirklich offen sind (beendete Sitzungen und alte Tagesrunden fallen weg). */
export function useOffeneEintraege(): AktuellEintrag[] {
  const aktuell = useLaufend((s) => s.aktuell);
  const merk = useLaufend((s) => s.merk);
  const h = heute();
  return Object.values(aktuell)
    .filter((e) => {
      if (!SITZUNG.includes(e.art)) return true;
      const s = merk[`sitzung:${e.key}`]?.wert as SitzungsStand | undefined;
      if (!s || s.fertig) return false;
      return e.art !== 'heute' || s.datum === h;
    })
    .sort((a, b) => b.zeit - a.zeit);
}

export function Aktuell() {
  const eintraege = useOffeneEintraege();
  const alle = useLaufend((s) => s.aktuell);
  const entferne = useLaufend((s) => s.entferneAktuell);
  const vergiss = useLaufend((s) => s.vergiss);
  const navigate = useNavigate();

  // verwaiste Einträge aufräumen
  useEffect(() => {
    const offen = new Set(eintraege.map((e) => e.key));
    Object.keys(alle).forEach((k) => !offen.has(k) && entferne(k));
  }, [eintraege, alle, entferne]);

  function weiter(e: AktuellEintrag) {
    if (SITZUNG.includes(e.art)) setzePausiert(e.key, false);
    navigate(e.pfad);
  }

  function verwerfen(e: AktuellEintrag) {
    entferne(e.key);
    if (SITZUNG.includes(e.art)) {
      vergiss(`sitzung:${e.key}`);
      vergiss(`aufgabe:${e.key}:`);
    }
    if (e.art === 'uebungen' || e.art === 'rechnen') {
      vergiss(e.key);
      vergiss(`aufgabe:${e.key}`);
    }
  }

  const [erstes, ...rest] = eintraege;

  return (
    <div className="inhalt schmal">
      <div className="kopf">
        <div>
          <span className="ueber">Aktuell</span>
          <h1>Weitermachen, wo du warst</h1>
          <p>Angefangene Karteikarten, Übungen und Aufgaben merkt sich die App – auch wenn du zwischendurch woanders hinklickst oder den Browser schließt.</p>
        </div>
      </div>

      {!erstes ? (
        <div className="panel">
          <Leer icon="play" titel="Gerade ist nichts angefangen">
            Starte eine <Link to="/">Tagesrunde</Link> oder such dir im <Link to="/pfad">Lernpfad</Link> ein Thema aus.
          </Leer>
        </div>
      ) : (
        <div className="stapel">
          <button type="button" className="panel aktuell-gross" onClick={() => weiter(erstes)}>
            <span className="aktuell-icon">
              <Icon name={ART[erstes.art].icon} size={22} />
            </span>
            <span className="aktuell-text">
              <span className="ueber-klein">
                {ART[erstes.art].label} · {zeitText(erstes.zeit)}
              </span>
              <strong>{erstes.titel}</strong>
              {erstes.stand && <span className="sehr-leise klein">{erstes.stand}</span>}
              {erstes.anteil !== undefined && <Balken wert={erstes.anteil} duenn />}
            </span>
            <span className="btn primaer">
              <Icon name="play" size={16} /> Weiter
            </span>
          </button>

          <button type="button" className="btn geist klein" style={{ alignSelf: 'flex-end' }} onClick={() => verwerfen(erstes)} aria-label={`${erstes.titel} verwerfen`}>
            <Icon name="x" size={14} /> Obersten Eintrag verwerfen
          </button>

          {rest.length > 0 && (
            <ul className="aktuell-liste panel">
              {rest.map((e) => (
                <li key={e.key}>
                  <button type="button" className="aktuell-zeile" onClick={() => weiter(e)}>
                    <Icon name={ART[e.art].icon} size={18} className="sehr-leise" />
                    <span className="aktuell-text">
                      <strong>{e.titel}</strong>
                      <span className="sehr-leise klein">
                        {e.stand ? `${e.stand} · ` : ''}
                        {zeitText(e.zeit)}
                      </span>
                    </span>
                    <Icon name="rechts" size={16} className="sehr-leise" />
                  </button>
                  <button type="button" className="btn geist klein" onClick={() => verwerfen(e)} aria-label={`${e.titel} entfernen`} title="Aus der Liste nehmen">
                    <Icon name="x" size={14} />
                  </button>
                </li>
              ))}
            </ul>
          )}

        </div>
      )}
    </div>
  );
}
