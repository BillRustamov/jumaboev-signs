import { DEFAULT_LOGO_SIZE } from "@/lib/logo-size";

export type NameFont = "serif" | "condensed";

export type SignPalette = {
  face: string;
  name: string;
  legal: string;
  plate: string;
  plateText: string;
  outerBorder: string;
  innerBorder: string;
  rule: string;
  accent: string;
};

export type SignStyle = {
  nameFont: NameFont;
  showChevrons: boolean;
  showMc: boolean;
  paletteId: string;
  colors: SignPalette;
  logoSize: number;
};

function tone(face: string, ink: string, accent: string): SignPalette {
  return {
    face,
    name: ink,
    legal: ink,
    plate: face,
    plateText: ink,
    outerBorder: accent,
    innerBorder: ink,
    rule: accent,
    accent,
  };
}

export const STYLE_PRESETS: {
  id: string;
  label: string;
  hint: string;
  nameFont: NameFont;
  showChevrons: boolean;
  colors: SignPalette;
}[] = [
  {
    id: "gold-navy",
    label: "Navy gold",
    hint: "20 × 12 in · gold on navy",
    nameFont: "condensed",
    showChevrons: false,
    colors: tone("#071a33", "#d4af37", "#d4af37"),
  },
  {
    id: "black",
    label: "Black",
    hint: "20 × 12 in · white on black",
    nameFont: "condensed",
    showChevrons: false,
    colors: tone("#111111", "#ffffff", "#ffffff"),
  },
  {
    id: "red-line",
    label: "Red",
    hint: "20 × 12 in · white on red",
    nameFont: "condensed",
    showChevrons: false,
    colors: tone("#c8102e", "#ffffff", "#ffffff"),
  },
  {
    id: "asphalt",
    label: "Asphalt",
    hint: "20 × 12 in · charcoal with orange",
    nameFont: "condensed",
    showChevrons: true,
    colors: tone("#2c3036", "#ffffff", "#f15a24"),
  },
];

const PRESET_ALIAS: Record<string, string> = {
  highway: "black",
  elbrus: "gold-navy",
  suggested: "gold-navy",
};

export function defaultStyle(): SignStyle {
  return applyPreset("gold-navy");
}

export function applyPreset(id: string): SignStyle {
  const resolved = PRESET_ALIAS[id] ?? id;
  const preset =
    STYLE_PRESETS.find((item) => item.id === resolved) ?? STYLE_PRESETS[0];
  return {
    nameFont: preset.nameFont,
    showChevrons: preset.showChevrons,
    showMc: true,
    paletteId: preset.id,
    colors: { ...preset.colors },
    logoSize: DEFAULT_LOGO_SIZE,
  };
}

function channel(hex: string, offset: number): number {
  const raw = hex.replace("#", "").padEnd(6, "0");
  const value = Number.parseInt(raw.slice(offset, offset + 2), 16) / 255;
  return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
}

export function contrastRatio(a: string, b: string): number {
  const lum = (hex: string) =>
    0.2126 * channel(hex, 0) + 0.7152 * channel(hex, 2) + 0.0722 * channel(hex, 4);
  const l1 = lum(a);
  const l2 = lum(b);
  const hi = Math.max(l1, l2);
  const lo = Math.min(l1, l2);
  return (hi + 0.05) / (lo + 0.05);
}

export function contrastWarnings(colors: SignPalette): string[] {
  const notes: string[] = [];
  if (contrastRatio(colors.name, colors.face) < 3) {
    notes.push("Door name vs background is low contrast for 50-foot daylight reading.");
  }
  if (contrastRatio(colors.legal, colors.face) < 3) {
    notes.push("USDOT and MC vs background is low contrast for 50-foot daylight reading.");
  }
  return notes;
}
