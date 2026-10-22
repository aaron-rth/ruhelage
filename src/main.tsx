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
