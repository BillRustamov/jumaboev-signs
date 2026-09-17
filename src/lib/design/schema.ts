/** Canonical 20×12 in door-decal design. Inches are the source of truth. */

export const DESIGN_VERSION = 1 as const;
export const CANVAS_WIDTH_IN = 20;
export const CANVAS_HEIGHT_IN = 12;

export type SignFontId = "condensed" | "sans" | "serif";

export type TemplateId =
  | "premium-plaque"
  | "classic"
  | "logo-spotlight"
  | "side-by-side"
  | "minimal";

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
  role: "company" | "place" | "usdot" | "mc" | "ghost-logo";
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
};

export type RuleElement = BaseElement & {
  type: "rule";
  color: string;
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
  | ChevronElement;

export type DesignDocument = {
  version: typeof DESIGN_VERSION;
  widthIn: typeof CANVAS_WIDTH_IN;
  heightIn: typeof CANVAS_HEIGHT_IN;
  templateId: TemplateId;
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
}[] = [
  {
    id: "premium-plaque",
    label: "Premium plaque",
    hint: "Filled board · logo, name, city, USDOT, MC",
  },
  {
    id: "classic",
    label: "Classic professional",
    hint: "Large name, centered identification",
  },
  {
    id: "logo-spotlight",
    label: "Logo spotlight",
    hint: "Large mark above the lettering",
  },
  {
    id: "side-by-side",
    label: "Side by side",
    hint: "Logo left · required text right",
  },
  {
    id: "minimal",
    label: "Minimal",
    hint: "High-contrast type, little decoration",
  },
];

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
