import type { SignFontId } from "@/lib/design/schema";

/** Approximate glyph width as a fraction of font size (inches).
 * Condensed is Oswald/Impact — closer to 0.55em than a true compressed gothic. */
const WIDTH_EM: Record<SignFontId, number> = {
  condensed: 0.56,
  sans: 0.58,
  serif: 0.56,
};

export function fontFamily(font: SignFontId): string {
  if (font === "serif") {
    return 'var(--font-sign-serif-face), "Libre Baskerville", "Times New Roman", serif';
  }
  if (font === "sans") {
    return "var(--font-geist-sans), Geist, Arial, sans-serif";
  }
  return 'var(--font-sign-condensed-face), Oswald, Impact, "Arial Narrow", sans-serif';
}

export function fontClass(font: SignFontId): string {
  if (font === "serif") return "font-sign-serif";
  if (font === "sans") return "font-sans";
  return "font-sign-condensed";
}

export function measureLine(
  text: string,
  font: SignFontId,
  fontSizeIn: number,
  letterSpacingEm = 0,
): number {
  const spacing = Math.max(0, text.length - 1) * letterSpacingEm * fontSizeIn;
  return text.length * fontSizeIn * WIDTH_EM[font] + spacing;
}

export function wrapText(
  text: string,
  font: SignFontId,
  fontSizeIn: number,
  maxWidthIn: number,
  letterSpacingEm = 0,
): string[] {
  const clean = text.trim().replace(/\s+/g, " ");
  if (!clean) return [""];
  if (measureLine(clean, font, fontSizeIn, letterSpacingEm) <= maxWidthIn) {
    return [clean];
  }
  const words = clean.split(" ");
  if (words.length === 1) {
    return splitLongToken(clean, font, fontSizeIn, maxWidthIn, letterSpacingEm);
  }
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (measureLine(next, font, fontSizeIn, letterSpacingEm) <= maxWidthIn) {
      current = next;
    } else {
      if (current) lines.push(current);
      if (measureLine(word, font, fontSizeIn, letterSpacingEm) > maxWidthIn) {
        const parts = splitLongToken(
          word,
          font,
          fontSizeIn,
          maxWidthIn,
          letterSpacingEm,
        );
        lines.push(...parts.slice(0, -1));
        current = parts[parts.length - 1] ?? "";
      } else {
        current = word;
      }
    }
  }
  if (current) lines.push(current);
  return lines.length ? lines : [clean];
}

function splitLongToken(
  token: string,
  font: SignFontId,
  fontSizeIn: number,
  maxWidthIn: number,
  letterSpacingEm: number,
): string[] {
  const lines: string[] = [];
  let rest = token;
  while (rest.length) {
    let take = rest.length;
    while (
      take > 1 &&
      measureLine(rest.slice(0, take), font, fontSizeIn, letterSpacingEm) >
        maxWidthIn
    ) {
      take -= 1;
    }
    lines.push(rest.slice(0, take));
    rest = rest.slice(take);
  }
  return lines;
}

export function fitFontSize(
  lines: string[],
  font: SignFontId,
  maxWidthIn: number,
  startSizeIn: number,
  minSizeIn: number,
  letterSpacingEm = 0,
): number {
  let size = startSizeIn;
  while (size > minSizeIn) {
    const widest = Math.max(
      ...lines.map((line) => measureLine(line, font, size, letterSpacingEm)),
      0,
    );
    if (widest <= maxWidthIn) return size;
    size -= 0.05;
  }
  return minSizeIn;
}

export type FittedBlock = {
  size: number;
  lines: string[];
  height: number;
  lineH: number;
};

/** Largest type that fits width and height. Scales up, then down if needed. */
export function fitToBox(
  text: string,
  font: SignFontId,
  maxWidthIn: number,
  maxHeightIn: number,
  opts?: {
    tracking?: number;
    minSize?: number;
    maxLines?: number;
    wrap?: boolean;
    lineHeight?: number;
  },
): FittedBlock {
  const tracking = opts?.tracking ?? 0;
  const minSize = opts?.minSize ?? 0.36;
  const maxLines = opts?.maxLines ?? 3;
  const wrap = opts?.wrap !== false;
  const lineHeight = opts?.lineHeight ?? 0.96;
  const boxH = Math.max(minSize, maxHeightIn);
  const boxW = Math.max(0.5, maxWidthIn * 0.96);

  function trial(size: number): FittedBlock & { overflow: boolean } {
    const raw = wrap
      ? wrapText(text, font, size, boxW, tracking)
      : [text];
    const lines = raw.slice(0, maxLines);
    const lineH = size * (lines.length > 1 ? lineHeight : 1);
    const height = lines.length * lineH;
    const widest = Math.max(
      ...lines.map((line) => measureLine(line, font, size, tracking)),
      0,
    );
    const overflow =
      height > boxH + 0.02 ||
      widest > boxW + 0.02 ||
      raw.length > maxLines;
    return { size, lines, height, lineH, overflow };
  }

  let lo = minSize;
  let hi = boxH;
  let best = trial(minSize);
  for (let i = 0; i < 24; i += 1) {
    const mid = (lo + hi) / 2;
    const fitted = trial(mid);
    if (!fitted.overflow) {
      best = fitted;
      lo = mid;
    } else {
      hi = mid;
    }
  }
  return {
    size: best.size,
    lines: best.lines,
    height: best.height,
    lineH: best.lineH,
  };
}
