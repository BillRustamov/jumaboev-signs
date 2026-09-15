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

export const ELBRUS_PALETTE: SignPalette = {
  face: "#ffffff",
  name: "#3d5c38",
  legal: "#1a2744",
  plate: "#1a2744",
  plateText: "#ffffff",
  outerBorder: "#c6a23a",
  innerBorder: "#1a2744",
  rule: "#c6a23a",
  accent: "#b83a2f",
};

export const STYLE_PRESETS: {
  id: string;
  label: string;
  hint: string;
  nameFont: NameFont;
  showChevrons: boolean;
  colors: SignPalette;
}[] = [
  {
    id: "elbrus",
    label: "Elbrus",
    hint: "Forest green serif, gold/navy doors",
    nameFont: "serif",
    showChevrons: true,
    colors: ELBRUS_PALETTE,
  },
  {
    id: "highway",
    label: "Highway",
    hint: "Black lettering, white face, max contrast",
    nameFont: "condensed",
    showChevrons: false,
    colors: {
      face: "#ffffff",
      name: "#111111",
      legal: "#111111",
      plate: "#111111",
      plateText: "#ffffff",
      outerBorder: "#111111",
      innerBorder: "#111111",
      rule: "#111111",
      accent: "#111111",
    },
  },
  {
    id: "gold-navy",
    label: "Gold plates",
    hint: "Navy name, gold number plates",
    nameFont: "serif",
    showChevrons: true,
    colors: {
      face: "#ffffff",
      name: "#1a2744",
      legal: "#1a2744",
      plate: "#c6a23a",
      plateText: "#1a2744",
      outerBorder: "#c6a23a",
      innerBorder: "#1a2744",
      rule: "#c6a23a",
      accent: "#1a2744",
    },
  },
  {
    id: "red-line",
    label: "Red line",
    hint: "Black type, red rules and plates",
    nameFont: "condensed",
    showChevrons: true,
    colors: {
      face: "#ffffff",
      name: "#1a1a1a",
      legal: "#1a1a1a",
      plate: "#8b1e1e",
      plateText: "#ffffff",
      outerBorder: "#1a1a1a",
      innerBorder: "#8b1e1e",
      rule: "#8b1e1e",
      accent: "#c6a23a",
    },
  },
];

export function defaultStyle(): SignStyle {
  return {
    nameFont: "serif",
    showChevrons: true,
    showMc: true,
    paletteId: "elbrus",
    colors: { ...ELBRUS_PALETTE },
    logoSize: DEFAULT_LOGO_SIZE,
  };
}

export function applyPreset(id: string): SignStyle {
  const preset = STYLE_PRESETS.find((item) => item.id === id) ?? STYLE_PRESETS[0];
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
  if (contrastRatio(colors.plateText, colors.plate) < 3) {
    notes.push("USDOT plate type vs plate color is low contrast.");
  }
  return notes;
}
