// Fängt Abstürze einer Seite ab: statt weißer Seite eine kurze Meldung mit „Neu laden“ und „Fehler melden“.
import { Component, type ReactNode } from 'react';
import { merkeFehler } from '../lib/fehler';
import { oeffneHilfe } from './Hilfe';
import { Icon } from './Icon';

export class Fehlergrenze extends Component<{ children: ReactNode }, { fehler: string | null }> {
  state = { fehler: null as string | null };
  static getDerivedStateFromError(e: unknown) {
    return { fehler: e instanceof Error ? e.message : String(e) };
  }
  componentDidCatch(e: unknown) {
    merkeFehler(`Absturz: ${e instanceof Error ? `${e.message} ${e.stack?.split('\n')[1]?.trim() ?? ''}` : String(e)}`);
  }
  render() {
    if (!this.state.fehler) return this.props.children;
    return (
      <div className="inhalt schmal">
        <div className="panel fehler-seite">
          <h2>Da ist etwas schiefgelaufen</h2>
          <p className="leise">Dein Fortschritt ist gespeichert. Lade die Seite neu – und wenn es wieder passiert, schick mir kurz eine Meldung.</p>
          <div className="zeile" style={{ gap: 8, flexWrap: 'wrap' }}>
            <button type="button" className="btn primaer" onClick={() => location.reload()}>
              <Icon name="zuruecksetzen" size={16} /> Neu laden
            </button>
            <button type="button" className="btn" onClick={() => oeffneHilfe('fehler')}>
              <Icon name="info" size={16} /> Fehler melden
            </button>
          </div>
        </div>
      </div>
    );
  }
}
