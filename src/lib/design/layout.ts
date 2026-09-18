import {
  CANVAS_HEIGHT_IN,
  CANVAS_WIDTH_IN,
  type DesignElement,
  type TemplateId,
} from "@/lib/design/schema";

/** Per-template composition knobs. Auto-fit uses shares, then grows leftover into ID rows. */
export type TemplateLayoutConfig = {
  outerPadding: number;
  sectionGap: number;
  titleScale: number;
  subtitleScale: number;
  idRowScale: number;
  nameShare: number;
  placeShare: number;
  idShare: number;
  bands: boolean;
  fullWidthBands: boolean;
  rule: boolean;
  align: "center" | "left";
  idFormat: "inline" | "split";
  logoPlacement: "top" | "spotlight" | "side" | "none";
};

export const TEMPLATE_LAYOUT: Record<TemplateId, TemplateLayoutConfig> = {
  "clean-white": {
    outerPadding: 0.34,
    sectionGap: 0.1,
    titleScale: 1.04,
    subtitleScale: 0.92,
    idRowScale: 1.1,
    nameShare: 0.34,
    placeShare: 0.08,
    idShare: 0.54,
    bands: false,
    fullWidthBands: false,
    rule: true,
    align: "center",
    idFormat: "inline",
    logoPlacement: "top",
  },
  "direct-truck": {
    outerPadding: 0.4,
    sectionGap: 0.12,
    titleScale: 1.02,
    subtitleScale: 0.9,
    idRowScale: 1.06,
    nameShare: 0.36,
    placeShare: 0.08,
    idShare: 0.52,
    bands: false,
    fullWidthBands: false,
    rule: false,
    align: "center",
    idFormat: "inline",
    logoPlacement: "top",
  },
  "classic-plaque": {
    outerPadding: 0.26,
    sectionGap: 0.08,
    titleScale: 1,
    subtitleScale: 0.88,
    idRowScale: 1.14,
    nameShare: 0.26,
    placeShare: 0.07,
    idShare: 0.64,
    bands: true,
    fullWidthBands: true,
    rule: true,
    align: "center",
    idFormat: "split",
    logoPlacement: "top",
  },
  "logo-spotlight": {
    outerPadding: 0.34,
    sectionGap: 0.1,
    titleScale: 1,
    subtitleScale: 0.9,
    idRowScale: 1.04,
    nameShare: 0.32,
    placeShare: 0.08,
    idShare: 0.52,
    bands: false,
    fullWidthBands: false,
    rule: false,
    align: "center",
    idFormat: "inline",
    logoPlacement: "spotlight",
  },
  "side-by-side": {
    outerPadding: 0.34,
    sectionGap: 0.12,
    titleScale: 1,
    subtitleScale: 0.9,
    idRowScale: 1.04,
    nameShare: 0.38,
    placeShare: 0.1,
    idShare: 0.48,
    bands: false,
    fullWidthBands: false,
    rule: false,
    align: "left",
    idFormat: "inline",
    logoPlacement: "side",
  },
};

export type ZoneShares = {
  name: number;
  subtitle: number;
  id: number;
};

export function normalizeShares(
  config: TemplateLayoutConfig,
  flags: { hasPlace: boolean; hasLlc: boolean; showMc: boolean },
): ZoneShares {
  let name = config.nameShare * config.titleScale;
  let subtitle =
    (flags.hasPlace || flags.hasLlc ? config.placeShare : 0) *
    config.subtitleScale;
  let id = config.idShare * config.idRowScale;
  if (!flags.hasPlace && !flags.hasLlc) {
    name += subtitle * 0.35;
    id += subtitle * 0.65;
    subtitle = 0;
  }
  const total = name + subtitle + id;
  return { name: name / total, subtitle: subtitle / total, id: id / total };
}

export function contentOccupancy(elements: DesignElement[]): number {
  const useful = elements.filter((el) => {
    if (!el.visible || el.type === "chevron") return false;
    if (el.type === "text" && el.role === "ghost-logo") return false;
    return true;
  });
  if (!useful.length) return 0;
  const top = Math.min(...useful.map((el) => el.yIn));
  const bottom = Math.max(...useful.map((el) => el.yIn + el.heightIn));
  return (bottom - top) / CANVAS_HEIGHT_IN;
}

export function contentBottom(elements: DesignElement[]): number {
  return Math.max(
    ...elements
      .filter((el) => el.visible && el.type !== "chevron")
      .map((el) => el.yIn + el.heightIn),
    0,
  );
}

export function usableRect(config: TemplateLayoutConfig): {
  x: number;
  y: number;
  w: number;
  h: number;
} {
  const p = config.outerPadding;
  return {
    x: p,
    y: p,
    w: CANVAS_WIDTH_IN - p * 2,
    h: CANVAS_HEIGHT_IN - p * 2,
  };
}
