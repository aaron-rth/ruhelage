# Ruhelage – Hinweise für Claude

- Öffentliches Repository. **Niemals** PDFs, Bilder oder Textauszüge aus Schulbüchern, Arbeitsblättern
  oder dem privaten Repository `ruhelage-material` hierher kopieren. Alle Inhalte in eigenen Worten.
- **Inhalte erstellen** (neue Fächer/Themen): Lies `INHALTE.md` und ändere ausschließlich Dateien in `inhalte/`.
  Kein Code. Vor dem Abschluss `npm run check:inhalte`.
- **Code ändern:** `npm run typecheck`, `npm test` und `npm run build` müssen grün sein.
- Keine Secrets committen. Der Supabase-Publishable-Key in `src/lib/cloud.ts` ist öffentlich und gewollt.
