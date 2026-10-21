import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Leer, Md, Taste } from '../components/Basis';
import { Icon } from '../components/Icon';
import { AKTIVER_KURS } from '../content/kurse';
import type { Formel, Thema } from '../content/types';

function FormelKarte({ f, thema }: { f: Formel; thema?: Thema }) {
  return (
    <div className="formel-karte">
      <span className="formel-name">
        {thema && <span className="knoten-nr klein-nr">{thema.nr}</span>}
        {f.name}
      </span>
      <Md text={`$$${f.tex}$$`} className="formel-tex" />
      {f.hinweis && <Md text={f.hinweis} inline className="sehr-leise klein formel-hinweis" />}
    </div>
  );
}

export function Formeln() {
  const themen = AKTIVER_KURS.themen.filter((t) => t.formeln.length > 0);
  const [params, setParams] = useSearchParams();
  const [suche, setSuche] = useState('');
  const startIndex = Math.max(0, themen.findIndex((t) => t.id === params.get('thema')));
  const [aktiv, setAktiv] = useState(startIndex);
  const karussell = useRef<HTMLDivElement>(null);
  const chips = useRef<HTMLDivElement>(null);
  const q = suche.trim().toLowerCase();

  // beim Öffnen (und nach dem Suchen) direkt zur aktiven Seite springen
  useEffect(() => {
    const el = karussell.current;
    if (el && !q) el.scrollTo({ left: aktiv * el.clientWidth, behavior: 'instant' as ScrollBehavior });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q === '']);

  function gehe(i: number) {
    const el = karussell.current;
    const ziel = Math.max(0, Math.min(themen.length - 1, i));
    if (el) el.scrollTo({ left: ziel * el.clientWidth, behavior: 'smooth' });
    setAktiv(ziel);
  }

  // aktive Seite aus der Scrollposition (Wischen auf dem Handy / Trackpad)
  function onScroll() {
    const el = karussell.current;
    if (!el) return;
    const i = Math.round(el.scrollLeft / el.clientWidth);
    if (i !== aktiv) setAktiv(i);
  }

  useEffect(() => {
    const t = themen[aktiv];
    if (t && params.get('thema') !== t.id) setParams({ thema: t.id }, { replace: true });
    chips.current?.querySelector<HTMLElement>(`[data-i="${aktiv}"]`)?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aktiv]);

  useEffect(() => {
    if (q) return;
    function onKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || e.altKey || e.metaKey || e.ctrlKey) return;
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        gehe(aktiv + 1);
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        gehe(aktiv - 1);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const treffer = q
    ? themen.flatMap((t) =>
        t.formeln
          .filter((f) => f.name.toLowerCase().includes(q) || (f.hinweis ?? '').toLowerCase().includes(q) || t.titel.toLowerCase().includes(q) || f.tex.toLowerCase().includes(q))
          .map((f) => ({ f, t })),
      )
    : [];

  return (
    <div className="inhalt">
      <div className="kopf">
        <div>
          <span className="ueber">Nachschlagen</span>
          <h1>Formelsammlung</h1>
          <p>
            Ein Thema pro Seite – wisch zur Seite oder blättere mit <Taste>←</Taste> <Taste>→</Taste>. Es gilt g = 9,81 m/s².
          </p>
        </div>
        <div className="suche">
          <Icon name="auge" size={16} />
          <input className="eingabe" placeholder="Suchen, z. B. Periodendauer" value={suche} onChange={(e) => setSuche(e.target.value)} aria-label="Formeln durchsuchen" />
        </div>
      </div>

      {q ? (
        treffer.length === 0 ? (
          <Leer icon="formel" titel="Nichts gefunden">
            Versuch es mit einem anderen Wort.
          </Leer>
        ) : (
          <>
            <p className="sehr-leise klein">
              {treffer.length} {treffer.length === 1 ? 'Formel' : 'Formeln'} gefunden
            </p>
            <div className="formel-gitter">
              {treffer.map(({ f, t }) => (
                <FormelKarte key={`${t.id}-${f.name}`} f={f} thema={t} />
              ))}
            </div>
          </>
        )
      ) : (
        <>
          <div className="formel-chips" ref={chips} role="tablist" aria-label="Themen">
            {themen.map((t, i) => (
              <button key={t.id} type="button" role="tab" aria-selected={i === aktiv} data-i={i} className={`chip-knopf${i === aktiv ? ' an' : ''}`} onClick={() => gehe(i)}>
                <span className="mono">{t.nr}</span> {t.titel}
              </button>
            ))}
          </div>

          <div className="formel-karussell" ref={karussell} onScroll={onScroll}>
            {themen.map((t, i) => (
              <section key={t.id} className="formel-seite" aria-hidden={i !== aktiv} aria-label={`Thema ${t.nr}: ${t.titel}`}>
                <div className="formel-seite-kopf">
                  <h2>
                    <span className="knoten-nr">{t.nr}</span> {t.titel}
                  </h2>
                  <Link to={`/thema/${t.id}`} className="klein" tabIndex={i === aktiv ? 0 : -1}>
                    Zum Thema <Icon name="rechts" size={13} />
                  </Link>
                </div>
                <div className="formel-gitter">
                  {t.formeln.map((f) => (
                    <FormelKarte key={f.name} f={f} />
                  ))}
                </div>
              </section>
            ))}
          </div>

          <div className="formel-nav">
            <button type="button" className="btn geist" onClick={() => gehe(aktiv - 1)} disabled={aktiv === 0}>
              <Icon name="links" size={16} /> {aktiv > 0 ? themen[aktiv - 1].titel : 'Zurück'}
            </button>
            <span className="mono sehr-leise klein">
              {aktiv + 1} / {themen.length}
            </span>
            <button type="button" className="btn geist" onClick={() => gehe(aktiv + 1)} disabled={aktiv === themen.length - 1}>
              {aktiv < themen.length - 1 ? themen[aktiv + 1].titel : 'Weiter'} <Icon name="rechts" size={16} />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
