#!/usr/bin/env node
// Prüft, dass kein Lernmaterial (PDFs, Scans, Fotos, kopierte Textpassagen)
// im öffentlichen Repo landet. Läuft lokal vor jedem Commit und in der CI.
//
// Optional: RUHELAGE_FINGERPRINTS=/pfad/zu/fingerprints.json
// enthält SHA-256-Hashes von 7-Wort-Folgen aus dem privaten Material.
// Die Datei liegt bewusst NICHT im Repo; ohne sie entfällt der Textabgleich.
import { execSync } from 'node:child_process';
import { readFileSync, statSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';

const VERBOTENE_ENDUNGEN = /\.(pdf|docx?|pptx?|xlsx?|heic|jpe?g|png|gif|webp|tiff?|bmp|zip)$/i;
const VERBOTENE_ORDNER = /(^|\/)(material|ruhelage-material)\//i;
const MAX_BYTES = 400 * 1024;
const ERLAUBTE_GROSSE = /^package-lock\.json$/;
const SHINGLE = 7;

function dateien() {
  const out = execSync('git ls-files --cached --others --exclude-standard', { encoding: 'utf8' });
  return out.split('\n').filter(Boolean).filter((f) => existsSync(f));
}

export function normalisiere(text) {
  return text
    .toLowerCase()
    .normalize('NFKC')
    .replace(/[^a-zäöüß0-9]+/g, ' ')
    .trim()
    .split(' ')
    .filter((w) => w.length > 1);
}

export function shingles(text) {
  const w = normalisiere(text);
  const res = new Set();
  for (let i = 0; i + SHINGLE <= w.length; i++) {
    res.add(createHash('sha256').update(w.slice(i, i + SHINGLE).join(' ')).digest('hex').slice(0, 24));
  }
  return res;
}

// Hilfsmodus: Fingerprint-Datei aus Textdateien bauen (nur lokal benutzen!)
if (process.argv[2] === '--build') {
  const out = process.argv[3];
  const quellen = process.argv.slice(4);
  const alle = new Set();
  for (const q of quellen) for (const h of shingles(readFileSync(q, 'utf8'))) alle.add(h);
  const { writeFileSync } = await import('node:fs');
  writeFileSync(out, JSON.stringify([...alle]));
  console.log(`${alle.size} Fingerabdrücke geschrieben nach ${out}`);
  process.exit(0);
}

const fehler = [];
const files = dateien();
for (const f of files) {
  if (VERBOTENE_ENDUNGEN.test(f)) fehler.push(`Binär-/Materialdatei im Repo: ${f}`);
  if (VERBOTENE_ORDNER.test(f)) fehler.push(`Datei im Material-Ordner: ${f}`);
  const size = statSync(f).size;
  if (size > MAX_BYTES && !ERLAUBTE_GROSSE.test(f)) fehler.push(`Ungewöhnlich große Datei (${Math.round(size / 1024)} KB): ${f}`);
}

const fpPfad = process.env.RUHELAGE_FINGERPRINTS;
if (fpPfad && existsSync(fpPfad)) {
  const fp = new Set(JSON.parse(readFileSync(fpPfad, 'utf8')));
  for (const f of files) {
    if (!/\.(ts|tsx|md|json|html|css|mjs|js|txt|yml)$/.test(f) || f === 'package-lock.json') continue;
    const treffer = [...shingles(readFileSync(f, 'utf8'))].filter((h) => fp.has(h)).length;
    if (treffer > 0) fehler.push(`${treffer} Textstelle(n) stimmen wörtlich mit dem Material überein: ${f}`);
  }
  console.log(`Textabgleich mit ${fp.size} Fingerabdrücken durchgeführt.`);
}

if (fehler.length) {
  console.error('✗ Material-Check fehlgeschlagen:\n  ' + fehler.join('\n  '));
  process.exit(1);
}
console.log(`✓ Material-Check ok (${files.length} Dateien geprüft).`);
