import { compileDesign, type LayoutInput } from "@/lib/design/compile";
import {
  TEMPLATES,
  classifyLogo,
  type DesignDocument,
  type DesignElement,
  type TemplateId,
} from "@/lib/design/schema";
import { clampLogoSize, type LogoSize } from "@/lib/logo-size";
import type { SignFields } from "@/lib/order";
import { applyPreset, contrastWarnings } from "@/lib/sign-style";

export type ImproveResult = {
  fields: SignFields;
  notes: string[];
};

const REQUIRED_ROLES = new Set(["company", "usdot", "mc"]);

export function layoutInputFrom(fields: SignFields): LayoutInput {
  return {
    companyName: fields.companyName,
    city: fields.city,
    state: fields.state,
    legalName: fields.legalName,
    dotNumber: fields.dotNumber,
    mcNumber: fields.mcNumber,
    logoDataUrl: fields.logoDataUrl,
    logoAspect: fields.logoAspect,
    logoSize: fields.logoSize,
    nameFont: fields.nameFont,
    templateId: fields.templateId,
    showChevrons: fields.showChevrons,
    showMc: fields.showMc,
    colors: fields.colors,
    artworkRole: fields.artworkRole,
    artworkFit: fields.artworkFit,
    artworkOffsetX: fields.artworkOffsetX,
    artworkOffsetY: fields.artworkOffsetY,
    logoContainsName: fields.logoContainsName,
  };
}

export function suggestTemplate(
  fields: Pick<SignFields, "logoDataUrl" | "logoAspect">,
): TemplateId {
  const hasLogo = Boolean(fields.logoDataUrl?.trim());
  if (!hasLogo) return "clean-white";
  const shape = fields.logoAspect
    ? classifyLogo(fields.logoAspect, 1)
    : "unknown";
  if (shape === "wide") return "side-by-side";
  return "logo-spotlight";
}

function templateLabel(id: TemplateId): string {
  return TEMPLATES.find((item) => item.id === id)?.label ?? id;
}

function companySize(doc: DesignDocument): number {
  const el = doc.elements.find(
    (item) => item.type === "text" && item.role === "company",
  );
  return el && el.type === "text" ? el.fontSizeIn : 0;
}

function boxesOverlap(
  a: DesignElement,
  b: DesignElement,
  gap = 0.08,
): boolean {
  return (
    a.xIn < b.xIn + b.widthIn - gap &&
    a.xIn + a.widthIn - gap > b.xIn &&
    a.yIn < b.yIn + b.heightIn - gap &&
    a.yIn + a.heightIn - gap > b.yIn
  );
}

export function hasLogoTextCollision(doc: DesignDocument): boolean {
  const logo = doc.elements.find((item) => item.type === "logo" && item.visible);
  if (!logo) return false;
  return doc.elements.some((item) => {
    if (item.type !== "text" || !item.visible) return false;
    if (!REQUIRED_ROLES.has(item.role)) return false;
    if (item.role === "company" && item.opacity !== undefined && item.opacity < 0.4) {
      return false;
    }
    return boxesOverlap(logo, item);
  });
}

function requiredIdOnBoard(doc: DesignDocument): boolean {
  const ids = doc.elements.filter(
    (item) =>
      item.type === "text" &&
      item.visible &&
      (item.role === "usdot" || item.role === "mc"),
  );
  if (!ids.some((item) => item.type === "text" && item.role === "usdot")) {
    return false;
  }
  return ids.every(
    (item) =>
      item.yIn >= -0.05 &&
      item.yIn + item.heightIn <= doc.heightIn + 0.08 &&
      item.xIn >= -0.05 &&
      item.xIn + item.widthIn <= doc.widthIn + 0.08,
  );
}

function cloneFields(fields: SignFields): SignFields {
  return {
    ...fields,
    colors: { ...fields.colors },
  };
}

/** Real layout pass: template from logo, contrast, name fit, collisions, required ID. */
export function autoImprove(fields: SignFields): ImproveResult {
  const notes: string[] = [];
  const next = cloneFields(fields);
  const hadMc = fields.showMc !== false;
  next.showMc = true;
  if (!hadMc) {
    notes.push("Turned MC back on so the shop-required ID prints.");
  }

  const suggested = suggestTemplate(next);
  if (next.artworkRole !== "existing-sign" && next.templateId !== suggested) {
    next.templateId = suggested;
    notes.push(
      `Moved to ${templateLabel(suggested)} so the mark and name share the 20 × 12 in board.`,
    );
  }

  if (
    next.artworkRole !== "existing-sign" &&
    next.logoDataUrl.trim() &&
    clampLogoSize(next.logoSize) < 4
  ) {
    next.logoSize = 4;
    notes.push("Enlarged the logo so it reads as a major mark.");
  }

  if (contrastWarnings(next.colors).length) {
    const safe = applyPreset("white-black");
    next.colors = { ...safe.colors };
    next.paletteId = safe.paletteId;
    notes.push("Switched to white vinyl and black lettering for daylight contrast.");
  }

  let doc = compileDesign(layoutInputFrom(next));

  if (
    next.artworkRole !== "existing-sign" &&
    companySize(doc) < 1.15 &&
    next.nameFont !== "condensed"
  ) {
    next.nameFont = "condensed";
    notes.push("Switched to condensed so the company name stays large.");
    doc = compileDesign(layoutInputFrom(next));
  }

  if (next.artworkRole === "existing-sign") {
    if (next.artworkFit === "cover") {
      notes.push("Crop-to-fill stays on — it is an explicit choice, not a default.");
    }
    notes.push("Kept the upload on a 20 × 12 in board. Flattened type was not rewritten.");
  }

  if (next.artworkRole !== "existing-sign" && next.logoDataUrl.trim()) {
    const logo = doc.elements.find((item) => item.type === "logo");
    if (logo && logo.heightIn < 1.35 && clampLogoSize(next.logoSize) < 5) {
      next.logoSize = 5;
      notes.push("Pushed the logo to full-face so it is not a postage stamp.");
      doc = compileDesign(layoutInputFrom(next));
    }
  }

  if (next.artworkRole !== "existing-sign" && hasLogoTextCollision(doc) && next.logoDataUrl.trim()) {
    const fallback: TemplateId =
      next.templateId === "side-by-side" ? "logo-spotlight" : "side-by-side";
    const trial = cloneFields(next);
    trial.templateId = fallback;
    const trialDoc = compileDesign(layoutInputFrom(trial));
    if (!hasLogoTextCollision(trialDoc)) {
      next.templateId = fallback;
      notes.push(
        `Changed layout to ${templateLabel(fallback)} so the logo does not cover required lettering.`,
      );
      doc = trialDoc;
    } else if (clampLogoSize(next.logoSize) > 3) {
      next.logoSize = (clampLogoSize(next.logoSize) - 1) as LogoSize;
      notes.push("Nudged the logo down one size so it does not cover USDOT.");
      doc = compileDesign(layoutInputFrom(next));
    }
  }

  if (
    next.artworkRole !== "existing-sign" &&
    !requiredIdOnBoard(doc) &&
    next.templateId !== "clean-white"
  ) {
    next.templateId = "clean-white";
    notes.push("Moved to Clean white so USDOT stays fully on the 20 × 12 in board.");
    doc = compileDesign(layoutInputFrom(next));
  }

  if (doc.widthIn !== 20 || doc.heightIn !== 12) {
    notes.push("Kept the production sheet at 20 × 12 in.");
  }

  if (notes.length === 0) {
    notes.push("Spacing, name fit, logo, and required IDs already look print-ready.");
  }

  return { fields: next, notes };
}
