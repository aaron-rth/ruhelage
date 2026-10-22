import '@fontsource-variable/inter';
import '@fontsource/jetbrains-mono/400.css';
import '@fontsource/jetbrains-mono/600.css';
import 'katex/dist/katex.min.css';
import './styles/tokens.css';
import './styles/base.css';
import './styles/app.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';

// Als Homescreen-App immer bei „Heute“ starten – iOS merkt sich sonst die Seite, auf der die App
// zum Homescreen hinzugefügt wurde (z. B. die Formelsammlung). Neuladen innerhalb der App bleibt, wo es ist.
try {
  const homescreen = window.matchMedia?.('(display-mode: standalone)').matches || (navigator as unknown as { standalone?: boolean }).standalone === true;
  if (homescreen && !sessionStorage.getItem('ruhelage-gestartet')) {
    sessionStorage.setItem('ruhelage-gestartet', '1');
    if (location.hash && location.hash !== '#/') history.replaceState(null, '', location.pathname + location.search + '#/');
  }
} catch {
  /* kein Speicher – dann eben nicht */
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// Startbild weich ausblenden, sobald die App da ist (beim ersten Start erst nach der Zeichnung)
const start = document.getElementById('start');
if (start) {
  const erstesMal = !document.documentElement.classList.contains('wiederkehr');
  const ruhig = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  window.setTimeout(
    () => {
      start.classList.add('weg');
      window.setTimeout(() => start.remove(), 300);
    },
    erstesMal && !ruhig ? 1300 : 0,
  );
}
