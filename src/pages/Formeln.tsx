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
  const leiste = useRef<HTMLDivElement>(null);
  const q = suche.trim().toLowerCase();

  // Das Wischen übernimmt der Browser (Scroll-Snap) – wir lesen nur ab, welche Karte vorne ist.
  function karteBei(i: number): HTMLElement | null {
    return leiste.current?.querySelector<HTMLElement>(`[data-i="${i}"]`) ?? null;
  }
  function gehe(i: number, sanft = true) {
    const ziel = Math.max(0, Math.min(themen.length - 1, i));
    const el = leiste.current;
    const karte = karteBei(ziel);
    if (el && karte) el.scrollTo({ left: karte.offsetLeft - (el.clientWidth - karte.offsetWidth) / 2, behavior: sanft ? 'smooth' : ('instant' as ScrollBehavior) });
  }

  // Start (und nach dem Suchen): direkt zur gemerkten Karte
  useEffect(() => {
    if (!q) requestAnimationFrame(() => gehe(aktiv, false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q === '']);

  useEffect(() => {
    const el = leiste.current;
    if (!el || q) return;
    const io = new IntersectionObserver(
      (eintraege) => {
        for (const e of eintraege) if (e.intersectionRatio > 0.6) setAktiv(Number((e.target as HTMLElement).dataset.i));
      },
      { root: el, threshold: [0.6] },
    );
    el.querySelectorAll('.formel-seite').forEach((k) => io.observe(k));
    return () => io.disconnect();
  }, [q, themen.length]);

  useEffect(() => {
    const t = themen[aktiv];
    if (t && params.get('thema') !== t.id) setParams({ thema: t.id }, { replace: true });
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
            Ein Thema pro Karte – zur Seite wischen
            <span className="nur-tastatur">
              {' '}
              oder mit <Taste>←</Taste> <Taste>→</Taste> blättern
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
          <div className="formel-nav">
            <button type="button" className="btn geist klein symbol-knopf" onClick={() => gehe(aktiv - 1)} disabled={aktiv === 0} aria-label="Vorheriges Thema">
              <Icon name="links" size={18} />
            </button>
            <span className="klein formel-position">
              <span className="mono">{themen[aktiv]?.nr}</span> · {themen[aktiv]?.titel}
              <span className="sehr-leise"> ({aktiv + 1}/{themen.length})</span>
            </span>
            <button type="button" className="btn geist klein symbol-knopf" onClick={() => gehe(aktiv + 1)} disabled={aktiv === themen.length - 1} aria-label="Nächstes Thema">
              <Icon name="rechts" size={18} />
            </button>
          </div>

          <div className="formel-leiste" ref={leiste}>
            {themen.map((t, i) => (
              <section
                key={t.id}
                data-i={i}
                className={`formel-seite${i === aktiv ? ' vorne' : ''}`}
                aria-label={`Thema ${t.nr}: ${t.titel}`}
                onClick={i !== aktiv ? () => gehe(i) : undefined}
              >
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
          <div className="formel-punkte" aria-hidden>
            {themen.map((t, i) => (
              <span key={t.id} className={i === aktiv ? 'an' : ''} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
