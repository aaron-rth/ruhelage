// Formeln ($…$) als lesbarer Klartext – für Stellen, an denen KaTeX nicht geht (z. B. <option> in Auswahllisten).
const HOCH: Record<string, string> = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '-': '⁻', '+': '⁺', n: 'ⁿ', x: 'ˣ' };
const TIEF: Record<string, string> = { '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄', '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉', n: 'ₙ', x: 'ₓ' };
const BEFEHLE: Record<string, string> = {
  cdot: '·', times: '×', div: ':', pm: '±', mp: '∓', le: '≤', leq: '≤', ge: '≥', geq: '≥', ne: '≠', neq: '≠', approx: '≈',
  infty: '∞', pi: 'π', alpha: 'α', beta: 'β', gamma: 'γ', delta: 'δ', Delta: 'Δ', varphi: 'φ', phi: 'φ', omega: 'ω', lambda: 'λ', mu: 'μ', sigma: 'σ', tau: 'τ',
  Rightarrow: '⇒', Leftrightarrow: '⇔', iff: '⇔', to: '→', rightarrow: '→', in: '∈', mid: '|', quad: ' ', qquad: '  ', ',': ' ', ';': ' ', '!': '', left: '', right: '', mathbb: '', mathrm: '', text: '', operatorname: '',
};

/** Argument ab Position i: {…}-Gruppe oder ein einzelnes Zeichen (wie bei \frac12) */
function gruppe(s: string, i: number): [string, number] {
  while (s[i] === ' ') i++;
  if (s[i] !== '{') return [s[i] ?? '', Math.min(s.length, i + 1)];
  let tiefe = 0;
  for (let j = i; j < s.length; j++) {
    if (s[j] === '{') tiefe++;
    else if (s[j] === '}' && --tiefe === 0) return [s.slice(i + 1, j), j + 1];
  }
  return [s.slice(i + 1), s.length];
}

/** Braucht der Ausdruck Klammern, wenn er Zähler/Nenner/Wurzelinhalt ist? (Leerzeichen, + oder − außerhalb von Klammern) */
function atomar(x: string): boolean {
  let tiefe = 0;
  for (const [i, c] of [...x].entries()) {
    if (c === '(') tiefe++;
    else if (c === ')') tiefe--;
    else if (tiefe === 0 && (c === ' ' || c === '+' || (c === '-' && i > 0) || c === '·' || c === '/')) return false;
  }
  return true;
}

const FUNKTIONEN = ['sin', 'cos', 'tan', 'ln', 'log', 'exp', 'arcsin', 'arccos', 'arctan'];

function hochTief(inhalt: string, tabelle: Record<string, string>, zeichen: string): string {
  const ok = [...inhalt].every((c) => tabelle[c]);
  return ok ? [...inhalt].map((c) => tabelle[c]).join('') : `${zeichen}(${inhalt})`;
}

/** TeX-Formel (ohne $) → Klartext */
export function texKlartext(tex: string): string {
  let out = '';
  let i = 0;
  while (i < tex.length) {
    const c = tex[i];
    if (c === '\\') {
      const m = /^\\([A-Za-z]+|.)/.exec(tex.slice(i))!;
      const name = m[1];
      i += m[0].length;
      if (name === 'frac' || name === 'dfrac' || name === 'tfrac') {
        const [z, i1] = gruppe(tex, i);
        const [n, i2] = gruppe(tex, i1);
        const zt = texKlartext(z);
        const nt = texKlartext(n);
        const klammer = (x: string) => (atomar(x) ? x : `(${x})`);
        // Nenner: auch „2√z“ oder „3x“ klammern, sonst liest man 1/2√z als (1/2)·√z
        const einzeln = /^(-?\d+([.,]\d+)?|[A-Za-zπ][²³⁴⁻¹ⁿ]*|√?\([^()]*\)[²³⁴]*|√[\w,.]+)$/;
        const bruch = `${klammer(zt)}/${einzeln.test(nt) ? nt : `(${nt})`}`;
        // „\frac{1}{3}x“ nicht als 1/3x (= 1/(3x)) schreiben
        out += /^\s*[\w(\\]/.test(tex.slice(i2)) ? `(${bruch})` : bruch;
        i = i2;
      } else if (name === 'sqrt') {
        const [r, i1] = gruppe(tex, i);
        const rt = texKlartext(r);
        out += /^[\w.,]+$/.test(rt) || /^\(.*\)$/.test(rt) ? `√${rt}` : `√(${rt})`;
        i = i1;
      } else if (FUNKTIONEN.includes(name)) out += `${/[\w)²³]$/.test(out) ? ' ' : ''}${name}`;
      else out += BEFEHLE[name] ?? name;
    } else if (c === '^' || c === '_') {
      const tabelle = c === '^' ? HOCH : TIEF;
      if (tex[i + 1] === '{') {
        const [g, i1] = gruppe(tex, i + 1);
        out += hochTief(texKlartext(g), tabelle, c);
        i = i1;
      } else {
        out += hochTief(tex[i + 1] ?? '', tabelle, c);
        i += 2;
      }
    } else if (c === '{') {
      const [g, i1] = gruppe(tex, i);
      out += g === ',' ? ',' : texKlartext(g);
      i = i1;
    } else if (c === '}') i++;
    else {
      out += c;
      i++;
    }
  }
  return out.replace(/\s+/g, ' ').trim();
}

/** Text mit $…$-Formeln → Klartext (Markdown-Sternchen fallen weg) */
export function klartext(text: string): string {
  return text
    .split(/(?<!\\)\$/)
    .map((teil, i) => (i % 2 ? texKlartext(teil) : teil.replace(/\*\*|__/g, '')))
    .join('')
    .replace(/\\\$/g, '$')
    .trim();
}
