// Markdown + KaTeX: $…$ inline, $$…$$ als eigene Zeile.
import katex from 'katex';
import { marked } from 'marked';

marked.setOptions({ gfm: true, breaks: false });

const cacheBlock = new Map<string, string>();
const cacheInline = new Map<string, string>();

function mathe(src: string): { text: string; teile: string[] } {
  const teile: string[] = [];
  const platz = (html: string) => {
    teile.push(html);
    return `MATHXX${teile.length - 1}XXENDE`;
  };
  let text = src.replace(/\$\$([\s\S]+?)\$\$/g, (_, tex: string) =>
    platz(katex.renderToString(tex.trim(), { displayMode: true, throwOnError: false, strict: false })),
  );
  // Brüche im Fließtext gut lesbar setzen (wie im Heft), statt winzig
  text = text.replace(/(^|[^\\])\$([^$\n]+?)\$/g, (_, vor: string, tex: string) =>
    vor + platz(katex.renderToString(/\\frac/.test(tex) ? `\\displaystyle ${tex}` : tex, { displayMode: false, throwOnError: false, strict: false })),
  );
  return { text, teile };
}

function einsetzen(html: string, teile: string[]): string {
  return html.replace(/MATHXX(\d+)XXENDE/g, (_, i: string) => teile[Number(i)]);
}

export function renderBlock(src: string): string {
  const c = cacheBlock.get(src);
  if (c !== undefined) return c;
  const { text, teile } = mathe(src);
  const html = einsetzen(marked.parse(text, { async: false }) as string, teile);
  cacheBlock.set(src, html);
  return html;
}

export function renderInline(src: string): string {
  const c = cacheInline.get(src);
  if (c !== undefined) return c;
  const { text, teile } = mathe(src);
  const html = einsetzen(marked.parseInline(text, { async: false }) as string, teile);
  cacheInline.set(src, html);
  return html;
}

export function renderTex(tex: string, display = false): string {
  return katex.renderToString(tex, { displayMode: display, throwOnError: false, strict: false });
}
