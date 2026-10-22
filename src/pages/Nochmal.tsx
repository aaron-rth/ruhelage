import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Leer, Md } from '../components/Basis';
import { Icon } from '../components/Icon';
import { PausenKarte, Sitzung, SitzungsEnde, starteSitzung, useSitzungsStand, type SitzungsBilanz, type SitzungsItem } from '../components/Sitzung';
import { useAktiverKurs } from '../lib/kurs';
import { findeGenerator, findeKarte, findeUebung } from '../content/kurse';
import { useStore, type NochmalEintrag } from '../store/store';

function titelVon(n: NochmalEintrag): string {
  if (n.art === 'karte') return findeKarte(n.ref)?.karte.vorne ?? n.ref;
  if (n.art === 'uebung') return findeUebung(n.ref)?.uebung.frage.split('\n')[0] ?? n.ref;
  return findeGenerator(n.ref)?.generator.titel ?? n.ref;
}

const ART: Record<NochmalEintrag['art'], { label: string; icon: string }> = {
  karte: { label: 'Karte', icon: 'karten' },
  uebung: { label: 'Übung', icon: 'stift' },
  aufgabe: { label: 'Aufgabe', icon: 'rechner' },
};

function alsItem(n: NochmalEintrag): SitzungsItem {
  return n.art === 'aufgabe' ? { art: 'aufgabe', id: n.ref, seed: n.seed ?? 1 } : { art: n.art, id: n.ref };
}

export function Nochmal() {
  const kurs = useAktiverKurs();
  const liste = useStore((s) => s.nochmal);
  const entferne = useStore((s) => s.entferneNochmal);
  const stand = useSitzungsStand('nochmal');
  const [bilanz, setBilanz] = useState<SitzungsBilanz | null>(null);
  const setSitzung = (items: SitzungsItem[]) => starteSitzung('nochmal', items, { art: 'nochmal', titel: 'Nochmal-Stapel', pfad: '/nochmal' });

  if (stand && !stand.pausiert)
    return (
      <div className="inhalt schmal">
        <Sitzung slot="nochmal" nochmalModus onEnde={setBilanz} />
      </div>
    );
  if (bilanz)
    return (
      <div className="inhalt schmal">
        <SitzungsEnde bilanz={bilanz} onFertig={() => setBilanz(null)} extra={<p className="leise klein">Was du jetzt richtig hattest, ist aus dem Stapel verschwunden.</p>} />
      </div>
    );

  const gueltig = liste.filter((n) => (n.art === 'karte' ? findeKarte(n.ref) : n.art === 'uebung' ? findeUebung(n.ref) : findeGenerator(n.ref)));
  const nachThema = kurs.themen.map((t) => ({ t, eintraege: gueltig.filter((n) => n.themaId === t.id) })).filter((x) => x.eintraege.length);

  return (
    <div className="inhalt">
      <div className="kopf">
        <div>
          <span className="ueber">Fehlerheft</span>
          <h1>Nochmal</h1>
          <p>Alles, was du falsch hattest, landet automatisch hier – Aufgaben mit denselben Zahlen. Sobald du es richtig hast, verschwindet es wieder.</p>
        </div>
        {gueltig.length > 0 && (
          <button className="btn primaer gross" onClick={() => setSitzung(gueltig.map(alsItem))}>
            <Icon name="play" size={16} /> Alle {gueltig.length} üben
          </button>
        )}
      </div>
      {stand?.pausiert && <PausenKarte slot="nochmal" stand={stand} />}
      {gueltig.length === 0 ? (
        <div className="panel">
          <Leer icon="nochmal" titel="Der Stapel ist leer">
            Gerade gibt es nichts nachzuholen. Wenn dir etwas danebengeht, findest du es hier wieder.
          </Leer>
        </div>
      ) : (
        <div className="stapel">
          {nachThema.map(({ t, eintraege }) => (
            <section key={t.id} className="panel">
              <div className="panel-titel">
                <h3>
                  <span className="knoten-nr klein-nr">{t.nr}</span> {t.titel}
                </h3>
                <div className="zeile">
                  <button className="btn klein" onClick={() => setSitzung(eintraege.map(alsItem))}>
                    <Icon name="play" size={14} /> Üben
                  </button>
                  <Link className="btn geist klein" to={`/thema/${t.id}`}>
                    Thema öffnen
                  </Link>
                </div>
              </div>
              <ul className="nochmal-liste">
                {eintraege.map((n) => (
                  <li key={n.key}>
                    <Icon name={ART[n.art].icon} size={16} className="sehr-leise" />
                    <span className="nochmal-text">
                      <Md text={titelVon(n)} inline />
                    </span>
                    <span className="sehr-leise klein">{ART[n.art].label}</span>
                    <button className="btn geist klein" onClick={() => entferne(n.key)} title="Aus dem Stapel nehmen" aria-label="Aus dem Stapel nehmen">
                      <Icon name="x" size={18} />
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
