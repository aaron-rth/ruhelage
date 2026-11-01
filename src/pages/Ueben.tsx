// „Üben“: alles zum gezielten Üben an einem Ort – Modi oben, darunter jedes Thema mit direktem Einstieg.
import { Link } from 'react-router-dom';
import { Ring } from '../components/Basis';
import { Icon } from '../components/Icon';
import { heute } from '../lib/datum';
import { themaFortschritt } from '../lib/fortschritt';
import { schwacheThemen } from '../lib/heute';
import { hatRechnen, useAktiverKurs } from '../lib/kurs';
import { useStore } from '../store/store';
import { GezieltUeben } from './Heute';

export function Ueben() {
  const kurs = useAktiverKurs();
  const daten = useStore();
  const h = heute();
  const themen = schwacheThemen(kurs, daten, h);
  const rechnen = hatRechnen(kurs);
  return (
    <div className="inhalt">
      <div className="kopf">
        <div>
          <span className="ueber">Üben · {kurs.fach}</span>
          <h1>Gezielt üben</h1>
          <p>Gemischt aus deinen schwächsten Themen – oder direkt in ein Thema springen.</p>
        </div>
      </div>
      <section className="ueben-bereich">
        <GezieltUeben />
      </section>
      <section className="panel">
        <div className="panel-titel">
          <h2>Nach Thema</h2>
          <span className="sehr-leise klein">schwächste zuerst</span>
        </div>
        <ul className="ueben-themen">
          {themen.map((t) => {
            const f = themaFortschritt(t, daten, h);
            return (
              <li key={t.id}>
                <Link to={`/thema/${t.id}`} className="ueben-thema-titel">
                  <span className="knoten-nr klein-nr">{t.nr}</span>
                  <span>{t.titel}</span>
                </Link>
                <span className="ueben-thema-wege">
                  <Link to={`/thema/${t.id}/karten`} className="btn geist klein" title="Karteikarten">
                    <Icon name="karten" size={16} />
                    {f.kartenFaellig > 0 && <span className="badge akzent">{f.kartenFaellig}</span>}
                  </Link>
                  <Link to={`/thema/${t.id}/uebungen`} className="btn geist klein" title="Übungen">
                    <Icon name="stift" size={16} />
                  </Link>
                  {rechnen && t.generatoren.some((g) => g.art === 'rechnen') && (
                    <Link to={`/thema/${t.id}/rechnen`} className="btn geist klein" title="Rechentrainer">
                      <Icon name="rechner" size={16} />
                    </Link>
                  )}
                  <Ring wert={f.gesamt} groesse={26} staerke={3} />
                </span>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
