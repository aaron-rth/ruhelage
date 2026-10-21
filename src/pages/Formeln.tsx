import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Leer, Md } from '../components/Basis';
import { Icon } from '../components/Icon';
import { AKTIVER_KURS } from '../content/kurse';

export function Formeln() {
  const [suche, setSuche] = useState('');
  const q = suche.trim().toLowerCase();
  const themen = AKTIVER_KURS.themen
    .map((t) => ({ t, formeln: t.formeln.filter((f) => !q || f.name.toLowerCase().includes(q) || (f.hinweis ?? '').toLowerCase().includes(q) || t.titel.toLowerCase().includes(q)) }))
    .filter((x) => x.formeln.length);

  return (
    <div className="inhalt">
      <div className="kopf">
        <div>
          <span className="ueber">Nachschlagen</span>
          <h1>Formelsammlung</h1>
          <p>Alle Formeln nach Themen. Es gilt g = 9,81 m/s².</p>
        </div>
        <div className="suche">
          <Icon name="auge" size={16} />
          <input className="eingabe" placeholder="Suchen, z. B. Periodendauer" value={suche} onChange={(e) => setSuche(e.target.value)} aria-label="Formeln durchsuchen" />
        </div>
      </div>
      {themen.length === 0 ? (
        <Leer icon="formel" titel="Nichts gefunden">Versuch es mit einem anderen Wort.</Leer>
      ) : (
        <div className="formel-raster">
          {themen.map(({ t, formeln }) => (
            <section key={t.id} className="panel">
              <div className="panel-titel">
                <h3>
                  <span className="knoten-nr klein-nr">{t.nr}</span> {t.titel}
                </h3>
                <Link to={`/thema/${t.id}`} className="klein">
                  Thema <Icon name="rechts" size={13} />
                </Link>
              </div>
              <dl className="formel-liste">
                {formeln.map((f) => (
                  <div key={f.name}>
                    <dt>{f.name}</dt>
                    <dd>
                      <Md text={`$$${f.tex}$$`} className="formel-tex" />
                      {f.hinweis && <Md text={f.hinweis} inline className="sehr-leise klein" />}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
