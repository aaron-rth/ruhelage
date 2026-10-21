// Kurze Einführung beim ersten Start: wo was ist. Lässt sich in den Einstellungen wieder einschalten.
import { useEffect, useState } from 'react';
import { useStore } from '../store/store';
import { Md, Taste } from './Basis';
import { Dialog } from './Dialog';
import { Icon } from './Icon';

export const EINFUEHRUNG = 'einfuehrung';

const SCHRITTE: { titel: string; icon: string; ziel?: string; text: string }[] = [
  {
    titel: 'Willkommen bei Ruhelage',
    icon: 'welle',
    text: 'Hier lernst du für die Klausur über **mechanische Schwingungen**. Gerechnet wird im Heft – die App prüft dein Ergebnis, gibt dir Hilfen in kleinen Schritten und merkt sich, was noch nicht sitzt.\n\nDie App hat drei Bereiche: **Fächer**, **Lernen** und **Profil**.',
  },
  {
    titel: 'Lernen',
    icon: 'play',
    ziel: '/',
    text: 'Hier startest du: **Weitermachen**, wo du aufgehört hast, deine **Tagesrunde** (etwa 20 Minuten, gemischt aus Karteikarten und Aufgaben) oder **gezielt üben** – Karteikarten, Übungen, Rechentrainer, Probeklausur oder der Nochmal-Stapel.',
  },
  {
    titel: 'Fächer',
    icon: 'buch',
    ziel: '/faecher',
    text: 'Der Überblick über dein Fach: **Lernpfad** mit allen Themen, **Lernplan** bis zur Klausur und die **Formelsammlung**. Schätz dich im Lernpfad zuerst selbst ein (✓ ~ ✗) – danach richten sich Tagesrunde und Lernplan.',
  },
  {
    titel: 'Karteikarten und Hilfen',
    icon: 'karten',
    text: 'Karte antippen zum Umdrehen, dann bewerten. Auf dem Handy geht das auch per Wischen: rechts = wusste ich, oben = so halb, links = nicht.\n\nNach dem Umdrehen oder Prüfen öffnet **„Genauer erklärt“** eine ausführlichere Erklärung. Im Rechentrainer gibt es drei Hilfestufen und den Lösungsweg – und Brüche wie `3/4` darfst du direkt eintippen.',
  },
  {
    titel: 'Profil',
    icon: 'ziel',
    ziel: '/profil',
    text: 'Deine **Statistik** (Lernzeit, Serie, Kalender) und die **Einstellungen**. Alles wird nur in diesem Browser gespeichert – mit Export und Import nimmst du deinen Fortschritt auf ein anderes Gerät mit.\n\nDiese Einführung findest du jederzeit wieder im Profil.',
  },
];

export function Einfuehrung() {
  const [i, setI] = useState(0);
  const gesehen = useStore((s) => s.hinweisGesehen);
  const s = SCHRITTE[i];
  const letzter = i === SCHRITTE.length - 1;
  const fertig = () => gesehen(EINFUEHRUNG);

  // Navigationspunkt hervorheben, um den es gerade geht
  useEffect(() => {
    if (s.ziel) document.body.dataset.tour = s.ziel;
    else delete document.body.dataset.tour;
    return () => {
      delete document.body.dataset.tour;
    };
  }, [s.ziel]);

  return (
    <Dialog
      titel={s.titel}
      ueber={`Einführung · ${i + 1} von ${SCHRITTE.length}`}
      onSchliessen={fertig}
      onTaste={(e) => {
        if (e.key === 'ArrowRight' || (e.key === 'Enter' && (e.target as HTMLElement).tagName !== 'BUTTON')) letzter ? fertig() : setI(i + 1);
        if (e.key === 'ArrowLeft' && i > 0) setI(i - 1);
      }}
      fuss={
        <>
          <div className="tour-punkte" aria-hidden>
            {SCHRITTE.map((_, j) => (
              <span key={j} className={j === i ? 'an' : ''} />
            ))}
          </div>
          <div className="zeile">
            {i > 0 ? (
              <button type="button" className="btn geist" onClick={() => setI(i - 1)}>
                <Icon name="links" size={16} /> Zurück
              </button>
            ) : (
              <button type="button" className="btn geist" onClick={fertig}>
                Überspringen
              </button>
            )}
            <button type="button" className="btn primaer" onClick={() => (letzter ? fertig() : setI(i + 1))} autoFocus>
              {letzter ? 'Los geht’s' : 'Weiter'} <Taste>→</Taste>
            </button>
          </div>
        </>
      }
    >
      <div className="tour-schritt einblenden" key={i}>
        <span className="tour-icon">
          <Icon name={s.icon} size={26} />
        </span>
        <Md text={s.text} className="prosa" />
      </div>
    </Dialog>
  );
}
