/** Canonical 20×12 in door-decal design. Inches are the source of truth. */

export const DESIGN_VERSION = 1 as const;
export const CANVAS_WIDTH_IN = 20;
export const CANVAS_HEIGHT_IN = 12;

export type SignFontId = "condensed" | "sans" | "serif";

export type TemplateId =
  | "clean-white"
  | "logo-spotlight"
  | "white-minimal"
  | "white-premium"
  | "side-by-side"
  | "direct-truck"
  | "classic-plaque";

export type ProductionMode = "printed-plaque" | "transparent" | "cut-lettering";

export type TextAlign = "left" | "center" | "right";

export type LogoShape = "wide" | "square" | "tall" | "unknown";

type BaseElement = {
  id: string;
  xIn: number;
  yIn: number;
  widthIn: number;
  heightIn: number;
  visible: boolean;
  locked: boolean;
  rotationDeg?: number;
};

export type TextElement = BaseElement & {
  type: "text";
  role: "company" | "place" | "llc" | "usdot" | "mc" | "id-label" | "ghost-logo";
  text: string;
  font: SignFontId;
  fontSizeIn: number;
  weight: 500 | 600 | 700;
  color: string;
  align: TextAlign;
  letterSpacingEm?: number;
  uppercase?: boolean;
  opacity?: number;
};

export type LogoElement = BaseElement & {
  type: "logo";
  src: string;
  boxed: boolean;
  boxColor: string;
  opacity?: number;
  /** Bitmap rect. When omitted, same as the element box. */
  imageXIn?: number;
  imageYIn?: number;
  imageWidthIn?: number;
  imageHeightIn?: number;
  /** True only when the customer chose crop-to-fill. */
  cropped?: boolean;
};

export type RuleElement = BaseElement & {
  type: "rule";
  color: string;
};

export type BandElement = BaseElement & {
  type: "band";
  fill: string;
  radiusIn: number;
};

export type ChevronElement = BaseElement & {
  type: "chevron";
  color: string;
  direction: "left" | "right";
};

export type DesignElement =
  | TextElement
  | LogoElement
  | RuleElement
  | BandElement
  | ChevronElement;

export type DesignDocument = {
  version: typeof DESIGN_VERSION;
  widthIn: typeof CANVAS_WIDTH_IN;
  heightIn: typeof CANVAS_HEIGHT_IN;
  templateId: TemplateId;
  production: ProductionMode;
  background: {
    fill: string;
    radiusIn: number;
    borderColor: string;
    borderIn: number;
  };
  elements: DesignElement[];
  warnings: string[];
};

export const TEMPLATES: {
  id: TemplateId;
  label: string;
  hint: string;
  production: ProductionMode;
  group: "primary" | "more";
}[] = [
  {
    id: "clean-white",
    label: "Clean White",
    hint: "White vinyl · strong name, protected USDOT and MC",
    production: "printed-plaque",
    group: "primary",
  },
  {
    id: "logo-spotlight",
    label: "White with Logo",
    hint: "Logo on top · name and locked USDOT / MC below",
    production: "printed-plaque",
    group: "primary",
  },
  {
    id: "white-minimal",
    label: "White Minimal",
    hint: "Little decoration · larger DOT and MC block",
    production: "printed-plaque",
    group: "primary",
  },
  {
    id: "white-premium",
    label: "White Premium Accent",
    hint: "White vinyl · accent rule and border · locked IDs",
    production: "printed-plaque",
    group: "primary",
  },
  {
    id: "side-by-side",
    label: "Logo left",
    hint: "Wide mark left · name and IDs right",
    production: "printed-plaque",
    group: "more",
  },
  {
    id: "direct-truck",
    label: "Direct lettering",
    hint: "Dark type on the truck — no filled plaque",
    production: "cut-lettering",
    group: "more",
  },
  {
    id: "classic-plaque",
    label: "Classic plaque",
    hint: "Printed board · huge USDOT and MC bars",
    production: "printed-plaque",
    group: "more",
  },
];

export const PRIMARY_TEMPLATES = TEMPLATES.filter((item) => item.group === "primary");
export const MORE_TEMPLATES = TEMPLATES.filter((item) => item.group === "more");

const TEMPLATE_ALIAS: Record<string, TemplateId> = {
  "premium-plaque": "classic-plaque",
  classic: "clean-white",
  minimal: "direct-truck",
  suggested: "clean-white",
  plaque: "classic-plaque",
  "logo-header": "logo-spotlight",
  "white-accent": "white-premium",
  "white-standard": "clean-white",
  "white-regulatory": "white-minimal",
};

export function isTemplateId(value: unknown): value is TemplateId {
  return TEMPLATES.some((item) => item.id === value);
}

export function isSignFontId(value: unknown): value is SignFontId {
  return value === "condensed" || value === "sans" || value === "serif";
}

export function classifyLogo(width: number, height: number): LogoShape {
  if (!(width > 0) || !(height > 0)) return "unknown";
  const ratio = width / height;
  if (ratio >= 1.45) return "wide";
  if (ratio <= 0.72) return "tall";
  return "square";
}

export function aliasTemplate(value: unknown): TemplateId | null {
  if (isTemplateId(value)) return value;
  if (typeof value === "string" && TEMPLATE_ALIAS[value]) {
    return TEMPLATE_ALIAS[value];
  }
  return null;
}
