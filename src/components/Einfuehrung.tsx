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
    text: 'Hier lernst du für die Klausur über **mechanische Schwingungen**. Gerechnet wird im Heft – die App prüft dein Ergebnis, gibt dir Hilfen in kleinen Schritten und merkt sich, was noch nicht sitzt.\n\nIn einer Minute zeige ich dir, wo was ist.',
  },
  {
    titel: 'Heute',
    icon: 'heute',
    ziel: '/',
    text: 'Jeden Tag eine gemischte Runde von etwa 20 Minuten: fällige Karteikarten, neue Karten und Aufgaben aus deinen schwächsten Themen.\n\nWenn du nicht weißt, womit du anfangen sollst: **hier**.',
  },
  {
    titel: 'Lernpfad',
    icon: 'pfad',
    ziel: '/pfad',
    text: 'Alle Themen in der Reihenfolge, in der sie aufeinander aufbauen. Schätz dich dort zuerst selbst ein (✓ kann ich · ~ so halb · ✗ kann ich nicht) – danach richtet sich die Tagesrunde.\n\nJedes Thema hat vier Bereiche: **Kurz erklärt**, **Karteikarten**, **Übungen** und den **Rechentrainer**.',
  },
  {
    titel: 'Genauer erklärt',
    icon: 'buch',
    text: 'Nach dem Umdrehen einer Karteikarte oder nach dem Prüfen einer Aufgabe öffnet **„Genauer erklärt“** (Taste E) eine ausführlichere Erklärung mit dem passenden Abschnitt aus „Kurz erklärt“.\n\nIm Rechentrainer gibt es drei Hilfestufen und danach den kompletten Lösungsweg. Bei Karteikarten blätterst du mit ← und →.',
  },
  {
    titel: 'Aktuell',
    icon: 'play',
    ziel: '/aktuell',
    text: 'Angefangene Karteikarten, Übungen und Aufgaben bleiben gespeichert – auch wenn du zwischendurch den Bereich wechselst. Unter **Aktuell** machst du mit einem Klick dort weiter, wo du aufgehört hast.',
  },
  {
    titel: 'Nochmal, Klausurmodus, Spielwiese',
    icon: 'nochmal',
    ziel: '/nochmal',
    text: '**Nochmal** sammelt alles, was danebenging – Aufgaben kommen mit denselben Zahlen wieder.\n\nIm **Klausurmodus** übst du ohne Hilfen und mit Timer. Auf der **Spielwiese** siehst du Pendel, Einheitskreis und Graph gleichzeitig. Die **Formelsammlung** hat alles zum Nachschlagen.',
  },
  {
    titel: 'Dein Fortschritt gehört dir',
    icon: 'einstellungen',
    ziel: '/einstellungen',
    text: 'Alles wird nur **in diesem Browser** gespeichert, niemand sonst sieht es. In den **Einstellungen** kannst du deinen Fortschritt exportieren und auf einem anderen Gerät importieren.\n\nDort kannst du auch diese Einführung jederzeit wieder ansehen.',
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
