// Rechenausdrücke in Antworten: 3/4, 2^3, 10^-3, 4,2·10^-3, √2, sqrt(2), 2π/5, (1+2)·3 …
// Gelesen wird nur der Anfang der Eingabe; was danach kommt (z. B. „m/s“), ist die Einheit.

type Token =
  | { t: 'zahl'; v: number; a: number; b: number }
  | { t: 'op'; v: '+' | '-' | '*' | '/' | '^'; a: number; b: number }
  | { t: 'auf' | 'zu'; a: number; b: number }
  | { t: 'konst'; v: number; a: number; b: number }
  | { t: 'fn'; v: (x: number) => number; a: number; b: number }
  | { t: 'wort'; a: number; b: number };

const HOCH: Record<string, string> = { '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9', '⁻': '-' };

const FUNKTIONEN: Record<string, (x: number) => number> = {
  sqrt: Math.sqrt,
  wurzel: Math.sqrt,
  sin: Math.sin,
  cos: Math.cos,
  tan: Math.tan,
  arcsin: Math.asin,
  asin: Math.asin,
  arccos: Math.acos,
  acos: Math.acos,
  arctan: Math.atan,
  atan: Math.atan,
  ln: Math.log,
  lg: Math.log10,
  log: Math.log10,
  exp: Math.exp,
};
const KONSTANTEN: Record<string, number> = { pi: Math.PI };

function tokens(s: string): Token[] {
  const out: Token[] = [];
  let i = 0;
  while (i < s.length) {
    const c = s[i];
    if (/\s/.test(c)) {
      i++;
      continue;
    }
    const zahl = /^(\d+(?:[.,]\d*)?|[.,]\d+)(?:[eE][+\-−]?\d+)?/.exec(s.slice(i));
    if (zahl) {
      out.push({ t: 'zahl', v: Number(zahl[0].replace(',', '.').replace('−', '-')), a: i, b: i + zahl[0].length });
      i += zahl[0].length;
      continue;
    }
    if (c in HOCH) {
      let j = i;
      let txt = '';
      while (j < s.length && s[j] in HOCH) txt += HOCH[s[j++]];
      out.push({ t: 'op', v: '^', a: i, b: i });
      if (txt.startsWith('-')) out.push({ t: 'op', v: '-', a: i, b: i + 1 });
      const ziffern = txt.replace('-', '');
      if (ziffern) out.push({ t: 'zahl', v: Number(ziffern), a: i, b: j });
      i = j;
      continue;
    }
    if ('+'.includes(c)) out.push({ t: 'op', v: '+', a: i, b: i + 1 });
    else if ('-−–'.includes(c)) out.push({ t: 'op', v: '-', a: i, b: i + 1 });
    else if ('*·×⋅'.includes(c) || ((c === 'x' || c === 'X') && /^\s*\d/.test(s.slice(i + 1)))) out.push({ t: 'op', v: '*', a: i, b: i + 1 });
    else if ('/:÷'.includes(c)) out.push({ t: 'op', v: '/', a: i, b: i + 1 });
    else if (c === '^') out.push({ t: 'op', v: '^', a: i, b: i + 1 });
    else if ('([{'.includes(c)) out.push({ t: 'auf', a: i, b: i + 1 });
    else if (')]}'.includes(c)) out.push({ t: 'zu', a: i, b: i + 1 });
    else if (c === 'π') out.push({ t: 'konst', v: Math.PI, a: i, b: i + 1 });
    else if (c === '√') out.push({ t: 'fn', v: Math.sqrt, a: i, b: i + 1 });
    else if (s.startsWith('\\cdot', i)) {
      out.push({ t: 'op', v: '*', a: i, b: i + 5 });
      i += 5;
      continue;
    } else {
      const w = /^[A-Za-zÄÖÜäöüßµ°%]+/.exec(s.slice(i));
      const laenge = w ? w[0].length : 1;
      const name = w?.[0].toLowerCase() ?? '';
      if (name in FUNKTIONEN) out.push({ t: 'fn', v: FUNKTIONEN[name], a: i, b: i + laenge });
      else if (name in KONSTANTEN) out.push({ t: 'konst', v: KONSTANTEN[name], a: i, b: i + laenge });
      else out.push({ t: 'wort', a: i, b: i + laenge });
      i += laenge;
      continue;
    }
    i++;
  }
  return out;
}

class Leser {
  i = 0;
  constructor(private ts: Token[]) {}
  get jetzt(): Token | undefined {
    return this.ts[this.i];
  }
  /** beginnt an Position i ein Operand? */
  operandAb(i: number): boolean {
    const t = this.ts[i];
    if (!t) return false;
    if (t.t === 'zahl' || t.t === 'auf' || t.t === 'konst' || t.t === 'fn') return true;
    // Vorzeichen: -3, -(…)
    return t.t === 'op' && (t.v === '-' || t.v === '+') && this.operandAb(i + 1);
  }
  ausdruck(): number {
    let x = this.term();
    for (;;) {
      const t = this.jetzt;
      if (t?.t === 'op' && (t.v === '+' || t.v === '-') && this.operandAb(this.i + 1)) {
        this.i++;
        const y = this.term();
        x = t.v === '+' ? x + y : x - y;
      } else return x;
    }
  }
  term(): number {
    let x = this.vorzeichen();
    for (;;) {
      const t = this.jetzt;
      if (t?.t === 'op' && (t.v === '*' || t.v === '/') && this.operandAb(this.i + 1)) {
        this.i++;
        const y = this.vorzeichen();
        x = t.v === '*' ? x * y : x / y;
      } else if (t && (t.t === 'auf' || t.t === 'konst' || t.t === 'fn')) {
        // 2π, 3√2, 2(1+x) – Malpunkt weggelassen
        x *= this.potenz();
      } else return x;
    }
  }
  vorzeichen(): number {
    const t = this.jetzt;
    if (t?.t === 'op' && (t.v === '-' || t.v === '+')) {
      this.i++;
      const x = this.vorzeichen();
      return t.v === '-' ? -x : x;
    }
    return this.potenz();
  }
  potenz(): number {
    const basis = this.atom();
    const t = this.jetzt;
    if (t?.t === 'op' && t.v === '^' && this.operandAb(this.i + 1)) {
      this.i++;
      return basis ** this.vorzeichen(); // rechtsassoziativ, 10^-3 erlaubt
    }
    return basis;
  }
  atom(): number {
    const t = this.jetzt;
    if (!t) throw new Error('fehlt');
    if (t.t === 'zahl' || t.t === 'konst') {
      this.i++;
      return t.v;
    }
    if (t.t === 'auf') {
      this.i++;
      const x = this.ausdruck();
      if (this.jetzt?.t !== 'zu') throw new Error('Klammer');
      this.i++;
      return x;
    }
    if (t.t === 'fn') {
      this.i++;
      return t.v(this.potenz());
    }
    throw new Error('unerwartet');
  }
}

export interface Gelesen {
  wert: number;
  /** Anzahl Zeichen, die zum Ausdruck gehören (danach beginnt die Einheit) */
  laenge: number;
}

/** Liest einen Rechenausdruck am Anfang von `s`. null, wenn dort keiner steht oder er nicht auswertbar ist. */
export function leseAusdruck(s: string): Gelesen | null {
  const ts = tokens(s);
  if (ts.length === 0) return null;
  const l = new Leser(ts);
  if (!l.operandAb(0)) return null;
  let wert: number;
  try {
    wert = l.ausdruck();
  } catch {
    return null;
  }
  if (!Number.isFinite(wert)) return null;
  const letztes = ts[l.i - 1];
  return { wert, laenge: letztes ? letztes.b : 0 };
}
