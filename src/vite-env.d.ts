/// <reference types="vite/client" />

declare module '*.md?raw' {
  const inhalt: string;
  export default inhalt;
}

/** Build-Datum und Commit (für Fehlermeldungen an den Support) */
declare const __BUILD__: string;
