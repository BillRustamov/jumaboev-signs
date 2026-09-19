import { DEFAULT_LOGO_SIZE } from "@/lib/logo-size";
import type { SignFontId, TemplateId } from "@/lib/design/schema";

export type NameFont = SignFontId;

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
  templateId: TemplateId;
};

function tone(
  face: string,
  ink: string,
  accent: string,
  plate = face,
  plateText = ink,
): SignPalette {
  return {
    face,
    name: ink,
    legal: ink,
    plate,
    plateText,
    outerBorder: accent,
    innerBorder: ink,
    rule: accent,
    accent,
  };
}

export const LETTERING_OPTIONS: {
  id: string;
  label: string;
  hint: string;
  ink: string;
}[] = [
  { id: "black", label: "Black lettering", hint: "White vinyl · black type", ink: "#111111" },
  { id: "navy", label: "Navy lettering", hint: "White vinyl · navy type", ink: "#0b1f3a" },
  { id: "green", label: "Dark green lettering", hint: "White vinyl · forest type", ink: "#1b4d3e" },
  { id: "red", label: "Red lettering", hint: "White vinyl · red type", ink: "#b01020" },
];

export const ACCENT_OPTIONS: {
  id: string;
  label: string;
  color: string | null;
}[] = [
  { id: "none", label: "None", color: null },
  { id: "gold", label: "Gold", color: "#c9a227" },
  { id: "red", label: "Red", color: "#c8102e" },
  { id: "navy", label: "Navy", color: "#0b1f3a" },
];

export function composeLetteringAccent(
  letteringId: string,
  accentId: string,
): { paletteId: string; colors: SignPalette } {
  const lettering =
    LETTERING_OPTIONS.find((item) => item.id === letteringId) ?? LETTERING_OPTIONS[0];
  const accent =
    ACCENT_OPTIONS.find((item) => item.id === accentId) ?? ACCENT_OPTIONS[0];
  const accentColor = accent.color ?? lettering.ink;
  return {
    paletteId: `white-${lettering.id}-${accent.id}`,
    colors: tone("#ffffff", lettering.ink, accentColor, lettering.ink, "#ffffff"),
  };
}

export function letteringIdFromColors(colors: SignPalette): string {
  const ink = colors.name.toLowerCase();
  const match = LETTERING_OPTIONS.find((item) => item.ink.toLowerCase() === ink);
  if (match) return match.id;
  if (ink === "#141414" || ink === "#111111") return "black";
  return "black";
}

export function accentIdFromColors(colors: SignPalette): string {
  const accent = colors.accent.toLowerCase();
  const ink = colors.name.toLowerCase();
  if (accent === ink) return "none";
  const match = ACCENT_OPTIONS.find(
    (item) => item.color && item.color.toLowerCase() === accent,
  );
  return match?.id ?? "none";
}

export type StyleGroup = "lettering" | "plaque";

export const STYLE_PRESETS: {
  id: string;
  label: string;
  hint: string;
  nameFont: NameFont;
  showChevrons: boolean;
  colors: SignPalette;
  group: StyleGroup;
}[] = [
  {
    id: "white-black",
    label: "Black lettering",
    hint: "White vinyl · black lettering",
    nameFont: "condensed",
    showChevrons: false,
    colors: tone("#ffffff", "#111111", "#111111", "#111111", "#ffffff"),
    group: "lettering",
  },
  {
    id: "white-navy",
    label: "Navy lettering",
    hint: "White vinyl · navy type",
    nameFont: "condensed",
    showChevrons: false,
    colors: tone("#ffffff", "#0b1f3a", "#0b1f3a", "#0b1f3a", "#ffffff"),
    group: "lettering",
  },
  {
    id: "white-green",
    label: "Dark green lettering",
    hint: "White vinyl · forest type",
    nameFont: "condensed",
    showChevrons: false,
    colors: tone("#ffffff", "#1b4d3e", "#1b4d3e", "#1b4d3e", "#ffffff"),
    group: "lettering",
  },
  {
    id: "white-red",
    label: "Red lettering",
    hint: "White vinyl · red type",
    nameFont: "condensed",
    showChevrons: false,
    colors: tone("#ffffff", "#b01020", "#b01020", "#b01020", "#ffffff"),
    group: "lettering",
  },
  {
    id: "white-gold",
    label: "Gold accent",
    hint: "White vinyl · black type · gold rules",
    nameFont: "condensed",
    showChevrons: false,
    colors: tone("#ffffff", "#141414", "#c9a227", "#0b1b33", "#ffffff"),
    group: "lettering",
  },
  {
    id: "white-black-red",
    label: "Black + red accent",
    hint: "White vinyl · black type · red rules",
    nameFont: "condensed",
    showChevrons: false,
    colors: tone("#ffffff", "#111111", "#c8102e", "#111111", "#ffffff"),
    group: "lettering",
  },
  {
    id: "white-navy-red",
    label: "Navy + red accent",
    hint: "White vinyl · navy type · red rules",
    nameFont: "condensed",
    showChevrons: false,
    colors: tone("#ffffff", "#0b1f3a", "#c8102e", "#0b1f3a", "#ffffff"),
    group: "lettering",
  },
  {
    id: "cut-black",
    label: "Cut black",
    hint: "Black lettering · no vinyl plaque",
    nameFont: "condensed",
    showChevrons: false,
    colors: tone("#ffffff", "#111111", "#111111", "#111111", "#ffffff"),
    group: "plaque",
  },
  {
    id: "gold-navy",
    label: "Navy gold",
    hint: "Printed plaque · gold on navy",
    nameFont: "condensed",
    showChevrons: false,
    colors: tone("#071a33", "#d4af37", "#d4af37", "#04101f", "#ffffff"),
    group: "plaque",
  },
  {
    id: "black",
    label: "Black plaque",
    hint: "Printed plaque · white on black",
    nameFont: "condensed",
    showChevrons: false,
    colors: tone("#111111", "#ffffff", "#ffffff", "#000000", "#ffffff"),
    group: "plaque",
  },
  {
    id: "red-line",
    label: "Red plaque",
    hint: "Printed plaque · white on red",
    nameFont: "condensed",
    showChevrons: false,
    colors: tone("#c8102e", "#ffffff", "#ffffff", "#8e0b1f", "#ffffff"),
    group: "plaque",
  },
  {
    id: "asphalt",
    label: "Charcoal",
    hint: "Printed plaque · charcoal with orange",
    nameFont: "condensed",
    showChevrons: true,
    colors: tone("#2c3036", "#ffffff", "#f15a24", "#1c1f24", "#ffffff"),
    group: "plaque",
  },
];

export const LETTERING_PRESETS = STYLE_PRESETS.filter((item) => item.group === "lettering");
export const PLAQUE_PRESETS = STYLE_PRESETS.filter((item) => item.group === "plaque");

const PRESET_ALIAS: Record<string, string> = {
  highway: "black",
  elbrus: "gold-navy",
  suggested: "white-black",
  "navy-gold": "gold-navy",
  white: "white-black",
  "white-black-none": "white-black",
  "white-navy-none": "white-navy",
  "white-green-none": "white-green",
  "white-red-none": "white-red",
  "white-black-gold": "white-gold",
};

export function defaultStyle(): SignStyle {
  return applyPreset("white-black");
}

export function applyPreset(id: string): SignStyle {
  const resolved = PRESET_ALIAS[id] ?? id;
  const composed = /^white-(black|navy|green|red)-(none|gold|red|navy)$/.exec(
    resolved,
  );
  if (composed) {
    const built = composeLetteringAccent(composed[1], composed[2]);
    return {
      nameFont: "condensed",
      showChevrons: false,
      showMc: true,
      paletteId: built.paletteId,
      colors: built.colors,
      logoSize: DEFAULT_LOGO_SIZE,
      templateId: "clean-white",
    };
  }
  const preset =
    STYLE_PRESETS.find((item) => item.id === resolved) ?? STYLE_PRESETS[0];
  return {
    nameFont: preset.nameFont,
    showChevrons: preset.showChevrons,
    showMc: true,
    paletteId: preset.id,
    colors: { ...preset.colors },
    logoSize: DEFAULT_LOGO_SIZE,
    templateId: "clean-white",
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

export function faceLuminance(hex: string): number {
  const raw = hex.replace("#", "").padEnd(6, "0");
  const r = Number.parseInt(raw.slice(0, 2), 16);
  const g = Number.parseInt(raw.slice(2, 4), 16);
  const b = Number.parseInt(raw.slice(4, 6), 16);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function isLightFace(hex: string): boolean {
  return faceLuminance(hex) > 180;
}

export function contrastWarnings(colors: SignPalette): string[] {
  const notes: string[] = [];
  if (contrastRatio(colors.name, colors.face) < 3) {
    notes.push("Door name vs background is low contrast for 50-foot daylight reading.");
  }
  if (contrastRatio(colors.legal, colors.face) < 3) {
    notes.push("USDOT and MC vs background is low contrast for 50-foot daylight reading.");
  }
  if (contrastRatio(colors.plateText, colors.plate) < 3) {
    notes.push("ID band lettering vs the band is low contrast for 50-foot daylight reading.");
  }
  return notes;
}
