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
  const [aktiv, setAktiv] = useState(() => Math.max(0, themen.findIndex((t) => t.id === params.get('thema'))));
  const [zug, setZug] = useState(0);
  const start = useRef<{ x: number; y: number; waagerecht: boolean | null } | null>(null);
  const chips = useRef<HTMLDivElement>(null);
  const q = suche.trim().toLowerCase();

  function gehe(i: number) {
    setAktiv(Math.max(0, Math.min(themen.length - 1, i)));
  }

  useEffect(() => {
    const t = themen[aktiv];
    if (t && params.get('thema') !== t.id) setParams({ thema: t.id }, { replace: true });
    // nur die Themenleiste seitlich mitscrollen – nie die ganze Seite
    const leiste = chips.current;
    const chip = leiste?.querySelector<HTMLElement>(`[data-i="${aktiv}"]`);
    if (leiste && chip) leiste.scrollTo({ left: chip.offsetLeft - leiste.clientWidth / 2 + chip.offsetWidth / 2, behavior: 'smooth' });
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

  // Wischen: waagerecht blättern, senkrecht normal scrollen lassen
  function runter(e: React.PointerEvent) {
    if (e.pointerType === 'mouse') return;
    start.current = { x: e.clientX, y: e.clientY, waagerecht: null };
  }
  function zieh(e: React.PointerEvent) {
    const s0 = start.current;
    if (!s0) return;
    const dx = e.clientX - s0.x;
    const dy = e.clientY - s0.y;
    if (s0.waagerecht === null && (Math.abs(dx) > 10 || Math.abs(dy) > 10)) s0.waagerecht = Math.abs(dx) > Math.abs(dy);
    if (s0.waagerecht) setZug(dx);
  }
  function hoch() {
    const s0 = start.current;
    start.current = null;
    if (!s0?.waagerecht) return setZug(0);
    if (zug < -60) gehe(aktiv + 1);
    else if (zug > 60) gehe(aktiv - 1);
    setZug(0);
  }

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
            Ein Thema pro Karte – wisch zur Seite oder tipp auf eine Karte daneben
            <span className="nur-tastatur">
              , am Laptop auch <Taste>←</Taste> <Taste>→</Taste>
            </span>
            . Es gilt g = 9,81 m/s².
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

          <div className="formel-nav">
            <button type="button" className="btn geist klein" onClick={() => gehe(aktiv - 1)} disabled={aktiv === 0} aria-label="Vorheriges Thema">
              <Icon name="links" size={16} />
            </button>
            <div className="formel-punkte" aria-hidden>
              {themen.map((t, i) => (
                <span key={t.id} className={i === aktiv ? 'an' : ''} />
              ))}
            </div>
            <button type="button" className="btn geist klein" onClick={() => gehe(aktiv + 1)} disabled={aktiv === themen.length - 1} aria-label="Nächstes Thema">
              <Icon name="rechts" size={16} />
            </button>
          </div>

          <div className={`formel-stapel${zug ? ' zieht' : ''}`} onPointerDown={runter} onPointerMove={zieh} onPointerUp={hoch} onPointerCancel={hoch}>
            {themen.map((t, i) => {
              const d = i - aktiv;
              if (Math.abs(d) > 2) return null;
              const a = Math.abs(d);
              const stil = {
                transform: `translateX(calc(${d * (a === 1 ? 15 : 13.5)}% + ${zug}px)) scale(${1 - a * 0.07})`,
                opacity: d === 0 ? 1 : a === 1 ? 0.5 : 0,
                zIndex: 10 - a,
              };
              return (
                <section
                  key={t.id}
                  className={`formel-seite${d === 0 ? ' vorne' : ' hinten'}`}
                  style={stil}
                  aria-hidden={d !== 0}
                  aria-label={`Thema ${t.nr}: ${t.titel}`}
                  onClick={d !== 0 ? () => gehe(i) : undefined}
                >
                  <div className="formel-seite-kopf">
                    <h2>
                      <span className="knoten-nr">{t.nr}</span> {t.titel}
                    </h2>
                    <Link to={`/thema/${t.id}`} className="klein" tabIndex={d === 0 ? 0 : -1}>
                      Zum Thema <Icon name="rechts" size={13} />
                    </Link>
                  </div>
                  <div className="formel-gitter">
                    {t.formeln.map((f) => (
                      <FormelKarte key={f.name} f={f} />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
