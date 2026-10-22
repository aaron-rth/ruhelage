// Profil: Konto und Schnellzugriff auf Statistik, Einstellungen und Einführung.
import { Link } from 'react-router-dom';
import { starteTour } from '../components/Tour';
import { Icon } from '../components/Icon';
import { KontoKarte } from '../components/Konto';
import { StatistikInhalt } from '../components/Statistik';
import { heute, plusTage } from '../lib/datum';
import { streak, useStore } from '../store/store';

export function Profil() {
  const tage = useStore((s) => s.tage);
  const h = heute();
  const serie = streak(tage, h);
  let min = 0;
  for (let i = 0; i < 7; i++) min += Math.round((tage[plusTage(h, -i)]?.sekunden ?? 0) / 60);

  return (
    <div className="inhalt schmal">
      <div className="kopf">
        <div>
          <span className="ueber">Profil</span>
          <h1>Dein Profil</h1>
          <p>Konto, Fortschritt und Einstellungen an einem Ort.</p>
        </div>
      </div>
      <KontoKarte />
      <div className="profil-links">
        <Link to="/statistik" className="kurs-weg">
          <Icon name="ziel" size={22} />
          <strong>Statistik</strong>
          <span className="sehr-leise klein">
            {serie} {serie === 1 ? 'Tag' : 'Tage'} in Folge · {min} min in 7 Tagen
          </span>
        </Link>
        <Link to="/einstellungen" className="kurs-weg">
          <Icon name="einstellungen" size={22} />
          <strong>Einstellungen</strong>
          <span className="sehr-leise klein">Tagesziel, Karteikarten, Ton, Sicherung</span>
        </Link>
        <button type="button" className="kurs-weg" onClick={starteTour}>
          <Icon name="info" size={22} />
          <strong>Einführung</strong>
          <span className="sehr-leise klein">zeigt dir in der App, wo was ist</span>
        </button>
      </div>
    </div>
  );
}

export function StatistikSeite() {
  return (
    <div className="inhalt schmal">
      <div className="kopf">
        <div>
          <span className="ueber">Profil</span>
          <h1>Statistik</h1>
          <p>Wie viel du gelernt hast und wie es in den Themen steht.</p>
        </div>
      </div>
      <section className="panel">
        <StatistikInhalt />
      </section>
    </div>
  );
}
