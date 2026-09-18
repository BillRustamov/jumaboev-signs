import {
  CANVAS_HEIGHT_IN,
  CANVAS_WIDTH_IN,
  DESIGN_VERSION,
  TEMPLATES,
  classifyLogo,
  type BandElement,
  type ChevronElement,
  type DesignDocument,
  type DesignElement,
  type LogoElement,
  type ProductionMode,
  type SignFontId,
  type TextElement,
} from "@/lib/design/schema";
import { suggestedLogoBox, logoScaleFromSize, logoSlotMax } from "@/lib/design/logo";
import {
  parsePlace,
  resolveFont,
  resolvePlace,
  resolveTemplate,
} from "@/lib/design/migrate";
import { fitFontSize, fitToBox, wrapText } from "@/lib/design/typography";
import { TEMPLATE_LAYOUT, normalizeShares } from "@/lib/design/layout";
import { defaultStyle, type SignPalette } from "@/lib/sign-style";
import {
  artworkPlacement,
  existingSignSlot,
  resolveArtworkFit,
  resolveArtworkRole,
  type ArtworkPlacement,
} from "@/lib/artwork";

export type LayoutInput = {
  companyName: string;
  city?: string;
  state?: string;
  legalName?: string;
  dotNumber: string;
  mcNumber: string;
  logoDataUrl?: string;
  logoAspect?: number;
  logoSize?: number;
  nameFont?: unknown;
  templateId?: unknown;
  showChevrons?: boolean;
  showMc?: boolean;
  colors?: SignPalette;
  artworkRole?: unknown;
  artworkFit?: unknown;
  artworkOffsetX?: number;
  artworkOffsetY?: number;
  logoContainsName?: boolean;
};

function uid(prefix: string, index: number): string {
  return `${prefix}-${index}`;
}

function centerX(widthIn: number): number {
  return (CANVAS_WIDTH_IN - widthIn) / 2;
}

function productionOf(templateId: DesignDocument["templateId"]): ProductionMode {
  return TEMPLATES.find((item) => item.id === templateId)?.production ?? "printed-plaque";
}

function textBlock(partial: Omit<TextElement, "type" | "locked">): TextElement {
  return { ...partial, type: "text", locked: partial.role !== "ghost-logo" };
}

function measureName(
  text: string,
  usedFont: SignFontId,
  maxWidth: number,
  startSize: number,
  minSize: number,
  tracking = -0.03,
): { size: number; lines: string[]; height: number; lineH: number } {
  const trial = wrapText(text, usedFont, startSize, maxWidth, tracking);
  const size = fitFontSize(trial, usedFont, maxWidth, startSize, minSize, tracking);
  const lines = wrapText(text, usedFont, size, maxWidth, tracking).slice(0, 3);
  const lineH = size * 0.94;
  return { size, lines, height: lines.length * lineH, lineH };
}

function measureLineSize(
  text: string,
  usedFont: SignFontId,
  maxWidth: number,
  startSize: number,
  minSize: number,
  tracking: number,
): number {
  return fitFontSize([text], usedFont, maxWidth, startSize, minSize, tracking);
}

export function compileDesign(input: LayoutInput): DesignDocument {
  const templateId = resolveTemplate(input.templateId);
  const font = resolveFont(input.nameFont);
  const company = input.companyName.trim().toUpperCase() || "COMPANY NAME";
  const ghostName = !input.companyName.trim();
  const place = resolvePlace(input);
  const ghostPlace = !place;
  const placeText = place || "CITY, STATE";
  const dot = input.dotNumber.trim() || "0000000";
  const mc = input.mcNumber.trim() || "000000";
  const showMc = input.showMc !== false;
  const hasLogo = Boolean(input.logoDataUrl?.trim());
  const scale = logoScaleFromSize(input.logoSize);
  const shape = input.logoAspect
    ? classifyLogo(input.logoAspect, 1)
    : hasLogo
      ? "unknown"
      : "wide";
  const warnings: string[] = [];
  const ink = input.colors ?? defaultStyle().colors;
  const cutLettering = templateId === "direct-truck";

  const artworkRole = resolveArtworkRole(input.artworkRole);
  const artworkFit = resolveArtworkFit(input.artworkFit);
  const artworkOffsetX =
    typeof input.artworkOffsetX === "number" && Number.isFinite(input.artworkOffsetX)
      ? input.artworkOffsetX
      : 0;
  const artworkOffsetY =
    typeof input.artworkOffsetY === "number" && Number.isFinite(input.artworkOffsetY)
      ? input.artworkOffsetY
      : 0;
  const logoContainsName = Boolean(input.logoContainsName);
  const existingSign = artworkRole === "existing-sign" && hasLogo;
  const llcRaw = (input.legalName ?? "").trim();
  const llc = llcRaw && !parsePlace(llcRaw) ? llcRaw.toUpperCase() : "";
  const nameCap = logoContainsName ? 0.78 : 1;

  const background = cutLettering && !existingSign
    ? {
        fill: "none",
        radiusIn: 0,
        borderColor: "transparent",
        borderIn: 0,
      }
    : {
        fill: ink.face,
        radiusIn: templateId === "classic-plaque" ? 0.28 : 0.22,
        borderColor: ink.accent,
        borderIn: templateId === "classic-plaque" ? 0.12 : 0.07,
      };

  function companyMeasure(maxWidth: number, startSize: number, minSize: number) {
    return measureName(
      company,
      font,
      maxWidth,
      startSize * nameCap,
      logoContainsName ? Math.max(0.85, minSize * 0.72) : minSize,
    );
  }

  function logoBox(mode: "spotlight" | "balanced" | "side" | "small") {
    return suggestedLogoBox(
      CANVAS_WIDTH_IN,
      CANVAS_HEIGHT_IN,
      shape,
      scale,
      mode,
      input.logoAspect,
    );
  }

  const elements = existingSign ? existingSignLayout() : composePanel();

  if (
    input.showChevrons &&
    !cutLettering &&
    !existingSign &&
    !elements.some((item) => item.type === "chevron")
  ) {
    elements.push(...chevrons());
  }

  if (hasLogo) {
    const logo = elements.find((item): item is LogoElement => item.type === "logo");
    if (logo && logo.heightIn < 1.1 && !existingSign) {
      warnings.push("Logo is small on this layout. Increase size or pick Logo spotlight.");
    }
  }

  const nameEl = elements.find(
    (item): item is TextElement => item.type === "text" && item.role === "company",
  );
  if (nameEl && nameEl.fontSizeIn < 1) {
    warnings.push(
      "Company name is under 1 in. Check 50-foot daylight reading before you approve.",
    );
  }
  if (existingSign) {
    warnings.push(
      "Flattened JPG/PNG type is not editable. Add MCS-150 name and USDOT on the ticket if they are missing from the photo.",
    );
  }
  if (logoContainsName && hasLogo && !existingSign) {
    warnings.push(
      "The mark already includes the company name. Registered name still prints at a readable size.",
    );
  }
  if (cutLettering && !existingSign) {
    warnings.push("Direct lettering is cut vinyl on the truck — no filled plaque prints.");
  }

  return {
    version: DESIGN_VERSION,
    widthIn: CANVAS_WIDTH_IN,
    heightIn: CANVAS_HEIGHT_IN,
    templateId,
    production: existingSign ? "printed-plaque" : productionOf(templateId),
    background,
    elements,
    warnings,
  };

  function composePanel(): DesignElement[] {
    const config = TEMPLATE_LAYOUT[templateId];
    const stack: DesignElement[] = [];
    const pad = config.outerPadding;
    const gap = config.sectionGap;
    const side = config.logoPlacement === "side";
    const spotlight = config.logoPlacement === "spotlight";
    const boxMode =
      spotlight ? "spotlight" : side ? "side" : templateId === "classic-plaque" ? "small" : "balanced";

    let logoW = 0;
    let logoH = 0;
    if (hasLogo) {
      const box = logoBox(boxMode);
      logoW = box.widthIn;
      logoH = box.heightIn;
    } else if (spotlight) {
      logoW = 9.4;
      logoH = 2.35;
    } else if (side) {
      logoW = 6.6;
      logoH = 8.0;
    }

    const textX = side ? pad + logoW + 0.4 : pad;
    const textW = CANVAS_WIDTH_IN - textX - pad;
    const boxX = textX;
    const canvasTop = pad;
    const canvasBottom = CANVAS_HEIGHT_IN - pad;

    if (hasLogo && !side) {
      stack.push(logoEl(centerX(logoW), canvasTop, logoW, logoH, false, boxMode));
    } else if (spotlight && !hasLogo) {
      stack.push(
        textBlock({
          id: uid("ghost", 1),
          role: "ghost-logo",
          xIn: centerX(logoW),
          yIn: canvasTop,
          widthIn: logoW,
          heightIn: logoH,
          text: "YOUR LOGO",
          font,
          fontSizeIn: 0.7,
          weight: 600,
          color: ink.name,
          align: "center",
          letterSpacingEm: 0.16,
          uppercase: true,
          visible: true,
          opacity: 0.4,
        }),
      );
    } else if (side) {
      const logoY = Math.max(canvasTop, (CANVAS_HEIGHT_IN - logoH) / 2);
      if (hasLogo) {
        stack.push(logoEl(pad, logoY, logoW, logoH, false, "side"));
      } else {
        stack.push(
          textBlock({
            id: uid("ghost", 2),
            role: "ghost-logo",
            xIn: pad,
            yIn: logoY,
            widthIn: logoW,
            heightIn: logoH,
            text: "LOGO",
            font: "condensed",
            fontSizeIn: 0.86,
            weight: 600,
            color: ink.name,
            align: "center",
            letterSpacingEm: 0.18,
            uppercase: true,
            visible: true,
            opacity: 0.35,
          }),
        );
      }
    }

    const textTop =
      side || (!hasLogo && !spotlight)
        ? canvasTop
        : canvasTop + logoH + gap;

    const shares = normalizeShares(config, {
      hasPlace: Boolean(place),
      hasLlc: Boolean(llc),
      showMc,
    });
    const ruleH = config.rule ? 0.075 : 0;
    const idRows = showMc ? 2 : 1;
    const identityReserve = (llc ? 0.42 : 0) + (place ? 0.42 : 0) + ruleH + gap * (2 + idRows);
    const flexH = Math.max(2.8, canvasBottom - textTop - identityReserve);

    const nameMin = logoContainsName ? 0.82 : 1.05;
    const nameM = fitToBox(company, font, textW, flexH * shares.name, {
      tracking: -0.03,
      minSize: nameMin,
      maxLines: 3,
      wrap: true,
    });
    const llcM = llc
      ? fitToBox(llc, font, textW, Math.max(0.32, flexH * shares.subtitle * (place ? 0.45 : 1)), {
          tracking: 0.18,
          minSize: 0.3,
          maxLines: 1,
          wrap: false,
        })
      : null;
    const placeM = place
      ? fitToBox(placeText, font, textW, Math.max(0.32, flexH * shares.subtitle * (llc ? 0.55 : 1)), {
          tracking: 0.14,
          minSize: 0.3,
          maxLines: 1,
          wrap: false,
        })
      : null;

    const usdotInline = `USDOT ${dot}`;
    const mcInline = `MC ${mc}`;
    const split = config.idFormat === "split";
    const idTracking = split ? 0.02 : 0.04;
    const labelH = (box: number) => Math.min(0.52, Math.max(0.34, box * 0.22));
    const numberH = (box: number) =>
      split ? Math.max(0.85, box - labelH(box) - 0.12) : box;

    const inkId = config.bands ? ink.plateText : ink.legal;
    let y = textTop;

    stack.push(
      ...nameLinesFromMeasure(
        nameM,
        y,
        textW,
        boxX,
        config.align,
        ghostName,
        ink.name,
      ),
    );
    y += nameM.height + gap;

    if (llcM) {
      stack.push(
        line(
          "llc",
          llc,
          y,
          textW,
          llcM.size,
          false,
          0.18,
          boxX,
          config.align,
          ink.legal,
          600,
        ),
      );
      y += llcM.height + gap * 0.7;
    }
    if (placeM) {
      stack.push(
        line(
          "place",
          placeText,
          y,
          textW,
          placeM.size,
          ghostPlace,
          0.14,
          boxX,
          config.align,
          ink.legal,
          600,
        ),
      );
      y += placeM.height + gap * 0.7;
    }

    if (config.rule) {
      const ruleW = Math.min(textW, config.bands ? 11.2 : 9.2);
      stack.push({
        id: uid("rule", 0),
        type: "rule",
        xIn: boxX + (textW - ruleW) / 2,
        yIn: y,
        widthIn: ruleW,
        heightIn: ruleH,
        color: ink.accent,
        visible: true,
        locked: true,
      });
      y += ruleH + gap;
    }

    const bandX = config.fullWidthBands ? Math.min(pad, 0.2) : boxX;
    const bandW = config.fullWidthBands ? CANVAS_WIDTH_IN - bandX * 2 : textW;
    const idInnerGap = showMc ? gap : 0;
    const remaining = Math.max(1.6, canvasBottom - y);
    let usdotBoxH = showMc ? (remaining - idInnerGap) / 2 : remaining;
    let mcBoxH = showMc ? (remaining - idInnerGap) / 2 : 0;

    const usdotFit = fitToBox(split ? dot : usdotInline, font, textW, numberH(usdotBoxH), {
      tracking: idTracking,
      minSize: 1.05,
      maxLines: 1,
      wrap: false,
    });
    const mcFit = showMc
      ? fitToBox(split ? mc : mcInline, font, textW, numberH(mcBoxH), {
          tracking: idTracking,
          minSize: 0.95,
          maxLines: 1,
          wrap: false,
        })
      : null;

    const paintIdRow = (
      role: "usdot" | "mc",
      fitted: ReturnType<typeof fitToBox>,
      boxH: number,
      label: string,
      ghost: boolean,
    ) => {
      const rowTop = y;
      boxH = Math.min(boxH, Math.max(0.85, canvasBottom - rowTop));
      if (config.bands) {
        stack.push(bandEl(`band-${role}`, bandX, rowTop, bandW, boxH));
      }
      if (split) {
        const lh = labelH(boxH);
        stack.push(
          line(
            "id-label",
            label,
            rowTop + 0.1,
            textW,
            lh,
            ghost,
            0.22,
            boxX,
            "left",
            inkId,
            600,
            `${role}-label`,
          ),
        );
        const numY = Math.min(rowTop + lh + 0.06, canvasBottom - fitted.size);
        stack.push(
          line(
            role,
            fitted.lines[0] ?? "",
            numY,
            textW,
            fitted.size,
            ghost,
            idTracking,
            boxX,
            config.align,
            inkId,
            700,
          ),
        );
      } else {
        const numY = Math.min(
          rowTop + Math.max(0, (boxH - fitted.height) / 2),
          canvasBottom - fitted.size,
        );
        stack.push(
          line(
            role,
            fitted.lines[0] ?? "",
            numY,
            textW,
            fitted.size,
            ghost,
            idTracking,
            boxX,
            config.align,
            inkId,
            700,
          ),
        );
      }
      y += boxH + gap;
    };

    paintIdRow(
      "usdot",
      usdotFit,
      usdotBoxH,
      "USDOT",
      !input.dotNumber.trim(),
    );
    if (mcFit) {
      paintIdRow("mc", mcFit, mcBoxH, "MC", !input.mcNumber.trim());
    }

    const limit = CANVAS_HEIGHT_IN - 0.1;
    for (const el of stack) {
      if (el.yIn + el.heightIn > limit) {
        el.heightIn = Math.max(0.28, limit - el.yIn);
      }
      if (el.yIn < 0.08) {
        const extra = 0.08 - el.yIn;
        el.yIn = 0.08;
        el.heightIn = Math.max(0.28, el.heightIn - extra);
      }
    }

    return stack;
  }

  function bandEl(
    id: string,
    xIn: number,
    yIn: number,
    widthIn: number,
    heightIn: number,
  ): BandElement {
    return {
      id,
      type: "band",
      xIn,
      yIn,
      widthIn,
      heightIn,
      fill: ink.plate,
      radiusIn: 0.16,
      visible: true,
      locked: true,
    };
  }

  function logoFromPlacement(placed: ArtworkPlacement, boxed: boolean): LogoElement {
    const box = placed.cropped
      ? {
          xIn: placed.clipX,
          yIn: placed.clipY,
          widthIn: placed.clipW,
          heightIn: placed.clipH,
        }
      : {
          xIn: placed.imageX,
          yIn: placed.imageY,
          widthIn: placed.imageW,
          heightIn: placed.imageH,
        };
    return {
      id: "logo",
      type: "logo",
      ...box,
      src: input.logoDataUrl ?? "",
      boxed,
      boxColor: ink.name,
      visible: true,
      locked: false,
      imageXIn: placed.imageX,
      imageYIn: placed.imageY,
      imageWidthIn: placed.imageW,
      imageHeightIn: placed.imageH,
      cropped: placed.cropped,
    };
  }

  function fittedLogo(
    xIn: number,
    yIn: number,
    widthIn: number,
    heightIn: number,
    mode: "spotlight" | "balanced" | "side" | "small",
    boxed: boolean,
  ): LogoElement {
    const max = logoSlotMax(CANVAS_WIDTH_IN, CANVAS_HEIGHT_IN, scale, mode);
    const aspect =
      typeof input.logoAspect === "number" && input.logoAspect > 0.05
        ? input.logoAspect
        : widthIn / Math.max(0.2, heightIn);
    if (artworkFit === "cover") {
      const slotX = xIn - (max.maxW - widthIn) / 2;
      const slotY = yIn;
      return logoFromPlacement(
        artworkPlacement({
          slotX,
          slotY,
          slotW: max.maxW,
          slotH: Math.max(heightIn, max.maxH),
          aspect,
          fit: "cover",
          offsetX: artworkOffsetX,
          offsetY: artworkOffsetY,
        }),
        boxed,
      );
    }
    return logoFromPlacement(
      artworkPlacement({
        slotX: xIn,
        slotY: yIn,
        slotW: widthIn,
        slotH: heightIn,
        aspect,
        fit: artworkFit,
        offsetX: artworkOffsetX,
        offsetY: artworkOffsetY,
      }),
      boxed,
    );
  }

  function existingSignLayout(): DesignElement[] {
    const slot = existingSignSlot();
    const aspect =
      typeof input.logoAspect === "number" && input.logoAspect > 0.05
        ? input.logoAspect
        : CANVAS_WIDTH_IN / CANVAS_HEIGHT_IN;
    const placed = artworkPlacement({
      ...slot,
      aspect,
      fit: artworkFit,
      offsetX: artworkOffsetX,
      offsetY: artworkOffsetY,
    });
    const stack: DesignElement[] = [logoFromPlacement(placed, false)];
    const hasName = Boolean(input.companyName.trim());
    const hasDot = Boolean(input.dotNumber.trim());
    const hasMc = Boolean(input.mcNumber.trim()) && showMc;
    if (!hasName && !hasDot && !hasMc) return stack;

    const bandH = 2.42;
    const bandY = CANVAS_HEIGHT_IN - 0.22 - bandH;
    const bandX = 0.35;
    const bandW = CANVAS_WIDTH_IN - 0.7;
    stack.push(bandEl("overlay-band", bandX, bandY, bandW, bandH));
    let y = bandY + 0.22;
    const textW = bandW - 0.5;
    const textX = bandX + 0.25;
    if (hasName && !logoContainsName) {
      const nameM = companyMeasure(textW, 0.72, 0.48);
      stack.push(
        ...nameLinesFromMeasure(
          nameM,
          y,
          textW,
          textX,
          "center",
          false,
          ink.plateText,
        ),
      );
      y += nameM.height + 0.08;
    }
    if (hasDot) {
      const usdotSize = measureLineSize(`USDOT ${dot}`, font, textW, 0.7, 0.48, 0.04);
      stack.push(
        line(
          "usdot",
          `USDOT ${dot}`,
          y,
          textW,
          usdotSize,
          false,
          0.04,
          textX,
          "center",
          ink.plateText,
          700,
        ),
      );
      y += usdotSize * 1.12;
    }
    if (hasMc) {
      const mcSize = measureLineSize(`MC ${mc}`, font, textW, 0.62, 0.42, 0.04);
      stack.push(
        line(
          "mc",
          `MC ${mc}`,
          y,
          textW,
          mcSize,
          false,
          0.04,
          textX,
          "center",
          ink.plateText,
          700,
        ),
      );
    }
    return stack;
  }

  function logoEl(
    xIn: number,
    yIn: number,
    widthIn: number,
    heightIn: number,
    boxed: boolean,
    mode: "spotlight" | "balanced" | "side" | "small" = "balanced",
  ): LogoElement {
    return fittedLogo(xIn, yIn, widthIn, heightIn, mode, boxed);
  }

  function nameLinesFromMeasure(
    measured: { size: number; lines: string[]; lineH: number },
    yIn: number,
    maxWidth: number,
    xIn: number,
    align: TextElement["align"],
    ghost: boolean,
    color: string,
  ): TextElement[] {
    return measured.lines.map((lineText, index) =>
      textBlock({
        id: uid("name", index),
        role: "company",
        xIn,
        yIn: yIn + index * measured.lineH,
        widthIn: maxWidth,
        heightIn: measured.lineH,
        text: lineText,
        font,
        fontSizeIn: measured.size,
        weight: 700,
        color,
        align,
        letterSpacingEm: -0.03,
        uppercase: true,
        visible: true,
        opacity: ghost ? 0.4 : 1,
      }),
    );
  }

  function line(
    role: "place" | "llc" | "usdot" | "mc" | "id-label",
    text: string,
    yIn: number,
    maxWidth: number,
    size: number,
    ghost: boolean,
    tracking: number,
    xIn: number,
    align: TextElement["align"],
    color: string,
    weight: 600 | 700,
    id: string = role,
  ): TextElement {
    return textBlock({
      id,
      role,
      xIn,
      yIn,
      widthIn: maxWidth,
      heightIn: size,
      text,
      font,
      fontSizeIn: size,
      weight,
      color,
      align,
      letterSpacingEm: tracking,
      uppercase: true,
      visible: true,
      opacity: ghost ? 0.4 : 1,
    });
  }

  function chevrons(): ChevronElement[] {
    const h = 3.6;
    const w = 0.62;
    const y = (CANVAS_HEIGHT_IN - h) / 2;
    return [
      {
        id: "chevron-left",
        type: "chevron",
        xIn: 0.22,
        yIn: y,
        widthIn: w,
        heightIn: h,
        color: ink.accent,
        direction: "right",
        visible: true,
        locked: true,
      },
      {
        id: "chevron-right",
        type: "chevron",
        xIn: CANVAS_WIDTH_IN - w - 0.22,
        yIn: y,
        widthIn: w,
        heightIn: h,
        color: ink.accent,
        direction: "left",
        visible: true,
        locked: true,
      },
    ];
  }
}

export function templatesDiffer(
  a: DesignDocument,
  b: DesignDocument,
): boolean {
  if (a.templateId === b.templateId) return false;
  const pos = (doc: DesignDocument) =>
    doc.elements.map((el) => `${el.type}:${el.xIn.toFixed(2)}:${el.yIn.toFixed(2)}`).join("|");
  return pos(a) !== pos(b);
}
