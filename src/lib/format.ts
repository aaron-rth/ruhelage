// Zahlen deutsch formatieren – als Klartext und als TeX (Dezimalkomma ohne Zusatzabstand).

function rundeSig(x: number, sig: number): number {
  if (x === 0 || !Number.isFinite(x)) return x;
  return Number(x.toPrecision(sig));
}

function festkomma(x: number, sig: number, nullenBehalten: boolean): { mantisse: string; exp: number } {
  if (x === 0) return { mantisse: '0', exp: 0 };
  const abs = Math.abs(x);
  const exp = Math.floor(Math.log10(abs));
  // Normaler Bereich: ohne Zehnerpotenz
  if (exp >= -3 && exp < 6) {
    const dec = Math.max(0, sig - 1 - exp);
    let s = rundeSig(x, sig).toFixed(dec);
    if (!nullenBehalten && s.includes('.')) s = s.replace(/0+$/, '').replace(/\.$/, '');
    return { mantisse: s, exp: 0 };
  }
  let m = (x / 10 ** exp).toFixed(Math.max(0, sig - 1));
  if (Math.abs(Number(m)) >= 10) {
    // Rundung auf 10,0 → Exponent anpassen
    return festkomma(Number(m) / 10 * 10 ** (exp + 1), sig, nullenBehalten);
  }
  if (!nullenBehalten && m.includes('.')) m = m.replace(/0+$/, '').replace(/\.$/, '');
  return { mantisse: m, exp };
}

/** Ergebnis mit `sig` signifikanten Stellen, z. B. 0.4413 → "0,441". */
export function zahl(x: number, sig = 3): string {
  const { mantisse, exp } = festkomma(x, sig, true);
  const m = mantisse.replace('.', ',').replace('-', '−');
  return exp === 0 ? m : `${m}·10^${exp}`;
}

/** Gegebener Wert ohne überflüssige Nullen, z. B. 0.25 → "0,25". */
export function wert(x: number, sig = 4): string {
  const { mantisse, exp } = festkomma(x, sig, false);
  const m = mantisse.replace('.', ',').replace('-', '−');
  return exp === 0 ? m : `${m}·10^${exp}`;
}

function texAus(mantisse: string, exp: number): string {
  const m = mantisse.replace('.', '{,}');
  return exp === 0 ? m : `${m}\\cdot 10^{${exp}}`;
}

/** TeX-Zahl (Ergebnis), z. B. 0.4413 → "0{,}441" */
export function tz(x: number, sig = 3): string {
  const { mantisse, exp } = festkomma(x, sig, true);
  return texAus(mantisse, exp);
}

/** TeX-Zahl (gegebener Wert, ohne überflüssige Nullen) */
export function tw(x: number, sig = 4): string {
  const { mantisse, exp } = festkomma(x, sig, false);
  return texAus(mantisse, exp);
}

const TEX_EINHEIT: Record<string, string> = {
  '1/s': '\\tfrac{1}{\\mathrm{s}}',
  '°': '^\\circ',
  'µm': '\\mu\\mathrm{m}',
  'µs': '\\mu\\mathrm{s}',
  '%': '\\,\\%',
  's/√m': '\\tfrac{\\mathrm{s}}{\\sqrt{\\mathrm{m}}}',
  '': '',
};

/** Einheit als TeX, z. B. "m/s^2" → "\mathrm{m/s^{2}}" */
export function te(einheit: string): string {
  if (einheit in TEX_EINHEIT) return TEX_EINHEIT[einheit];
  return `\\mathrm{${einheit.replace(/\^(-?\d+)/g, '^{$1}').replace(/·/g, '\\cdot ')}}`;
}

/** Größe mit Einheit als TeX: "0{,}441\,\mathrm{s}" */
export function tg(x: number, einheit: string, sig = 3): string {
  const e = te(einheit);
  if (!e) return tz(x, sig);
  if (einheit === '°' || einheit === '%') return `${tz(x, sig)}${e}`;
  return `${tz(x, sig)}\\,${e}`;
}

/** Gegebene Größe mit Einheit als TeX (ohne überflüssige Nullen) */
export function tgw(x: number, einheit: string, sig = 4): string {
  const e = te(einheit);
  if (!e) return tw(x, sig);
  if (einheit === '°' || einheit === '%') return `${tw(x, sig)}${e}`;
  return `${tw(x, sig)}\\,${e}`;
}

/** Inline-Mathe für Fließtext: "$m = 0{,}25\,\mathrm{kg}$" */
export function g(symbol: string, x: number, einheit: string, sig = 4): string {
  return `$${symbol} = ${tgw(x, einheit, sig)}$`;
}
