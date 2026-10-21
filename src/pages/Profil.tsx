// Profil: Statistik, Einstellungen, Einführung.
import { Link } from 'react-router-dom';
import { EINFUEHRUNG } from '../components/Einfuehrung';
import { Icon } from '../components/Icon';
import { KontoKarte } from '../components/Konto';
import { StatistikInhalt } from '../components/Statistik';
import { useStore } from '../store/store';

export function Profil() {
  return (
    <div className="inhalt schmal">
      <div className="kopf">
        <div>
          <span className="ueber">Profil</span>
          <h1>Dein Lernen</h1>
          <p>Wie viel du gelernt hast, wie es in den Themen steht – und alles zum Einstellen.</p>
        </div>
      </div>
      <div className="profil-links">
        <Link to="/einstellungen" className="kurs-weg">
          <Icon name="einstellungen" size={22} />
          <strong>Einstellungen</strong>
          <span className="sehr-leise klein">Tagesziel, Wiederholung, Sicherung</span>
        </Link>
        <button
          type="button"
          className="kurs-weg"
          onClick={() => useStore.setState((st) => ({ gesehen: st.gesehen.filter((g) => g !== EINFUEHRUNG), einstellungen: { ...st.einstellungen, hinweise: true } }))}
        >
          <Icon name="info" size={22} />
          <strong>Einführung</strong>
          <span className="sehr-leise klein">nochmal zeigen, wo was ist</span>
        </button>
      </div>
      <KontoKarte />
      <section className="panel">
        <h2 className="abschnitt-titel" style={{ marginTop: 0 }}>
          Statistik
        </h2>
        <StatistikInhalt />
      </section>
    </div>
  );
}
