// Kleiner Formel-Rechner für Rechenaufgaben aus Inhaltspaketen: Zahlen, Variablen, + − · / ^,
// Klammern, Funktionen und Vergleiche. Bewusst ohne eval – Inhalte sind Daten, kein Code.

const FUNKTIONEN: Record<string, (...x: number[]) => number> = {
  sqrt: Math.sqrt,
  abs: Math.abs,
  sin: Math.sin,
  cos: Math.cos,
  tan: Math.tan,
  asin: Math.asin,
  acos: Math.acos,
  atan: Math.atan,
  ln: Math.log,
  log: Math.log10,
  exp: Math.exp,
  min: Math.min,
  max: Math.max,
  /** runde(x, n): auf n Nachkommastellen */
  runde: (x, n = 0) => Math.round(x * 10 ** n) / 10 ** n,
  /** Grad ↔ Bogenmaß */
  grad: (x) => (x * 180) / Math.PI,
  rad: (x) => (x * Math.PI) / 180,
};
const KONSTANTEN: Record<string, number> = { pi: Math.PI, e: Math.E };

export class FormelFehler extends Error {}

type Tok = { t: 'zahl'; v: number } | { t: 'name'; v: string } | { t: 'op'; v: string };

function zerlege(s: string): Tok[] {
  const out: Tok[] = [];
  let i = 0;
  while (i < s.length) {
    const c = s[i];
    if (/\s/.test(c)) i++;
    else if (/[0-9.]/.test(c)) {
      const m = /^[0-9]*\.?[0-9]+(e[+-]?[0-9]+)?/i.exec(s.slice(i))!;
      out.push({ t: 'zahl', v: Number(m[0]) });
      i += m[0].length;
    } else if (/[A-Za-z_]/.test(c)) {
      const m = /^[A-Za-z_][A-Za-z_0-9]*/.exec(s.slice(i))!;
      out.push({ t: 'name', v: m[0] });
      i += m[0].length;
    } else {
      const zwei = s.slice(i, i + 2);
      if (['<=', '>=', '==', '!=', '&&', '||'].includes(zwei)) {
        out.push({ t: 'op', v: zwei });
        i += 2;
      } else if ('+-*/^(),<>!'.includes(c)) {
        out.push({ t: 'op', v: c });
        i++;
      } else throw new FormelFehler(`unbekanntes Zeichen „${c}“ in „${s}“`);
    }
  }
  return out;
}

/** Rechnet `ausdruck` mit den Werten aus `werte` aus. Vergleiche ergeben 1 (wahr) oder 0 (falsch). */
export function rechne(ausdruck: string, werte: Record<string, number> = {}): number {
  const t = zerlege(ausdruck);
  let p = 0;
  const sieh = () => t[p];
  const ist = (v: string) => sieh()?.t === 'op' && sieh().v === v;
  const nimm = (v: string) => {
    if (!ist(v)) throw new FormelFehler(`„${v}“ erwartet in „${ausdruck}“`);
    p++;
  };

  function oder(): number {
    let a = und();
    while (ist('||')) {
      p++;
      const b = und();
      a = a || b ? 1 : 0;
    }
    return a;
  }
  function und(): number {
    let a = vergleich();
    while (ist('&&')) {
      p++;
      const b = vergleich();
      a = a && b ? 1 : 0;
    }
    return a;
  }
  function vergleich(): number {
    const a = summe();
    for (const op of ['<=', '>=', '==', '!=', '<', '>']) {
      if (ist(op)) {
        p++;
        const b = summe();
        const r = { '<=': a <= b, '>=': a >= b, '==': Math.abs(a - b) < 1e-9, '!=': Math.abs(a - b) >= 1e-9, '<': a < b, '>': a > b }[op]!;
        return r ? 1 : 0;
      }
    }
    return a;
  }
  function summe(): number {
    let a = produkt();
    while (ist('+') || ist('-')) {
      const op = (t[p++] as { v: string }).v;
      const b = produkt();
      a = op === '+' ? a + b : a - b;
    }
    return a;
  }
  function produkt(): number {
    let a = vorzeichen();
    while (ist('*') || ist('/')) {
      const op = (t[p++] as { v: string }).v;
      const b = vorzeichen();
      a = op === '*' ? a * b : a / b;
    }
    return a;
  }
  function vorzeichen(): number {
    if (ist('-')) {
      p++;
      return -vorzeichen();
    }
    if (ist('+')) {
      p++;
      return vorzeichen();
    }
    if (ist('!')) {
      p++;
      return vorzeichen() ? 0 : 1;
    }
    return potenz();
  }
  function potenz(): number {
    const a = atom();
    if (ist('^')) {
      p++;
      return a ** vorzeichen();
    }
    return a;
  }
  function atom(): number {
    const x = sieh();
    if (!x) throw new FormelFehler(`unvollständig: „${ausdruck}“`);
    if (x.t === 'zahl') {
      p++;
      return x.v;
    }
    if (x.t === 'op' && x.v === '(') {
      p++;
      const v = oder();
      nimm(')');
      return v;
    }
    if (x.t === 'name') {
      p++;
      if (ist('(')) {
        const f = FUNKTIONEN[x.v];
        if (!f) throw new FormelFehler(`unbekannte Funktion „${x.v}“`);
        p++;
        const args = [oder()];
        while (ist(',')) {
          p++;
          args.push(oder());
        }
        nimm(')');
        return f(...args);
      }
      if (x.v in werte) return werte[x.v];
      if (x.v in KONSTANTEN) return KONSTANTEN[x.v];
      throw new FormelFehler(`unbekannte Variable „${x.v}“`);
    }
    throw new FormelFehler(`unerwartet „${x.v}“ in „${ausdruck}“`);
  }

  const v = oder();
  if (p < t.length) throw new FormelFehler(`unerwartet „${(t[p] as { v: string | number }).v}“ in „${ausdruck}“`);
  return v;
}

/** Zahl für die Anzeige: höchstens 4 Nachkommastellen, Komma statt Punkt (in Formeln als {,}). */
export function zahlText(x: number, inFormel: boolean): string {
  const r = Math.round(x * 1e4) / 1e4;
  const s = String(Object.is(r, -0) ? 0 : r);
  return s.replace('.', inFormel ? '{,}' : ',');
}

/**
 * Setzt `{ausdruck}` in einen Text ein. `{+ausdruck}` schreibt das Vorzeichen immer mit (für „x^2 {+b}x“).
 * Innerhalb von $…$ wird das Dezimalkomma als {,} gesetzt, damit KaTeX es richtig zeigt.
 */
export function fuelle(text: string, werte: Record<string, number>): string {
  let out = '';
  let inFormel = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === '\\' && text[i + 1] === '$') {
      out += '\\$';
      i++;
      continue;
    }
    if (c === '$') inFormel = !inFormel;
    // {…} nur als Platzhalter, wenn es kein TeX-Argument ist (z. B. \frac{1}{2}, x^{2})
    if (c === '{' && !/[\\\w^_}]$/.test(text.slice(0, i))) {
      const ende = text.indexOf('}', i);
      const roh = ende > i ? text.slice(i + 1, ende) : '';
      if (roh && !roh.includes('{') && /^[+]?[\w\s.+\-*/^(),<>=!&|]+$/.test(roh) && /[A-Za-z]/.test(roh)) {
        const mitVz = roh.startsWith('+');
        const v = rechne(mitVz ? roh.slice(1) : roh, werte);
        const z = zahlText(v, inFormel);
        out += mitVz && v >= 0 ? `+${z}` : z;
        i = ende;
        continue;
      }
    }
    out += c;
  }
  return out;
}
