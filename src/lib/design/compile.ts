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
import { suggestedLogoBox, logoScaleFromSize } from "@/lib/design/logo";
import { resolveFont, resolvePlace, resolveTemplate } from "@/lib/design/migrate";
import { fitFontSize, wrapText } from "@/lib/design/typography";
import type { SignPalette } from "@/lib/sign-style";

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
  colors: SignPalette;
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
  const ink = input.colors;
  const cutLettering = templateId === "direct-truck";

  const background = cutLettering
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

  const elements =
    templateId === "logo-spotlight"
      ? spotlight()
      : templateId === "side-by-side"
        ? sideBySide()
        : templateId === "direct-truck"
          ? stackedLettering({ plaque: false, logoMode: "small" })
          : templateId === "classic-plaque"
            ? classicPlaque()
            : stackedLettering({ plaque: true, logoMode: hasLogo ? "balanced" : "none" });

  if (input.showChevrons && !cutLettering && !elements.some((item) => item.type === "chevron")) {
    elements.push(...chevrons());
  }

  if (hasLogo) {
    const logo = elements.find((item): item is LogoElement => item.type === "logo");
    if (logo && logo.heightIn < 1.1) {
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
  if (cutLettering) {
    warnings.push("Direct lettering is cut vinyl on the truck — no filled plaque prints.");
  }

  return {
    version: DESIGN_VERSION,
    widthIn: CANVAS_WIDTH_IN,
    heightIn: CANVAS_HEIGHT_IN,
    templateId,
    production: productionOf(templateId),
    background,
    elements,
    warnings,
  };

  function stackedLettering(opts: {
    plaque: boolean;
    logoMode: "none" | "small" | "balanced";
  }): DesignElement[] {
    const padX = opts.plaque ? 0.85 : 0.7;
    const textW = CANVAS_WIDTH_IN - padX * 2;
    const stack: DesignElement[] = [];
    let logoW = 0;
    let logoH = 0;
    if (hasLogo && opts.logoMode !== "none") {
      const box = logoBox(opts.logoMode === "small" ? "small" : "balanced");
      logoW = box.widthIn;
      logoH = box.heightIn;
    }

    let nameStart = hasLogo ? 1.95 : 2.72;
    let usdotStart = 2.22;
    let mcStart = 1.92;
    let placeStart = 0.58;

    let nameM = measureName(company, font, textW, nameStart, 1.25);
    let usdotSize = measureLineSize(`USDOT ${dot}`, font, textW, usdotStart, 1.5, 0.05);
    let mcSize = showMc
      ? measureLineSize(`MC ${mc}`, font, textW, mcStart, 1.35, 0.05)
      : 0;
    let placeSize = place ? measureLineSize(placeText, font, textW, placeStart, 0.42, 0.14) : 0;

    const stackHeight = () => {
      const logoBlock = logoH > 0 ? logoH + 0.3 : 0;
      const placeBlock = place ? placeSize * 1.2 + 0.22 : 0;
      const ruleBlock = opts.plaque ? 0.34 : 0.22;
      const mcBlock = showMc ? mcSize * 1.18 + 0.28 : 0;
      return (
        logoBlock +
        nameM.height +
        0.32 +
        placeBlock +
        ruleBlock +
        usdotSize * 1.18 +
        mcBlock
      );
    };

    for (let i = 0; i < 14 && stackHeight() > 10.9; i += 1) {
      nameStart = Math.max(1.25, nameStart - 0.1);
      usdotStart = Math.max(1.5, usdotStart - 0.08);
      mcStart = Math.max(1.3, mcStart - 0.07);
      if (logoH > 2.1) logoH -= 0.12;
      nameM = measureName(company, font, textW, nameStart, 1.2);
      usdotSize = measureLineSize(`USDOT ${dot}`, font, textW, usdotStart, 1.45, 0.05);
      mcSize = showMc
        ? measureLineSize(`MC ${mc}`, font, textW, mcStart, 1.3, 0.05)
        : 0;
    }

    const total = stackHeight();
    let y = Math.max(0.42, Math.min(1.55, (CANVAS_HEIGHT_IN - total) / 2));

    if (hasLogo && logoH > 0) {
      stack.push(logoEl(centerX(logoW), y, logoW, logoH, false));
      y += logoH + 0.3;
    }

    stack.push(
      ...nameLinesFromMeasure(nameM, y, textW, centerX(textW), "center", ghostName, ink.name),
    );
    y += nameM.height + 0.28;

    if (place) {
      stack.push(
        line("place", placeText, y, textW, placeSize, ghostPlace, 0.14, centerX(textW), "center", ink.legal, 600),
      );
      y += placeSize * 1.2 + 0.2;
    }

    if (opts.plaque) {
      stack.push({
        id: uid("rule", 0),
        type: "rule",
        xIn: centerX(8.4),
        yIn: y,
        widthIn: 8.4,
        heightIn: 0.07,
        color: ink.accent,
        visible: true,
        locked: true,
      });
      y += 0.32;
    } else {
      y += 0.18;
    }

    stack.push(
      line(
        "usdot",
        `USDOT ${dot}`,
        y,
        textW,
        usdotSize,
        !input.dotNumber.trim(),
        0.05,
        centerX(textW),
        "center",
        ink.legal,
        700,
      ),
    );
    y += usdotSize * 1.18;

    if (showMc) {
      y += 0.22;
      stack.push(
        line(
          "mc",
          `MC ${mc}`,
          y,
          textW,
          mcSize,
          !input.mcNumber.trim(),
          0.05,
          centerX(textW),
          "center",
          ink.legal,
          700,
        ),
      );
    }

    return stack;
  }

  function spotlight(): DesignElement[] {
    const stack: DesignElement[] = [];
    const box = logoBox("spotlight");
    const reserved =
      5.05 + (place ? 0.55 : 0) + (showMc ? 0 : -1.05);
    const logoH = hasLogo
      ? Math.min(box.heightIn, Math.max(2.8, CANVAS_HEIGHT_IN - reserved))
      : 2.6;
    const logoW = hasLogo ? box.widthIn : 9.2;
    const top = 0.38;
    if (hasLogo) {
      stack.push(logoEl(centerX(logoW), top, logoW, logoH, false));
    } else {
      stack.push(
        textBlock({
          id: uid("ghost", 1),
          role: "ghost-logo",
          xIn: centerX(logoW),
          yIn: top,
          widthIn: logoW,
          heightIn: logoH,
          text: "YOUR LOGO",
          font,
          fontSizeIn: 0.72,
          weight: 600,
          color: ink.name,
          align: "center",
          letterSpacingEm: 0.16,
          uppercase: true,
          visible: true,
          opacity: 0.4,
        }),
      );
    }

    const textW = 18.2;
    let y = top + logoH + 0.2;
    const bottomLimit = 11.58;
    let nameStart = 1.55;
    let nameM = measureName(company, font, textW, nameStart, 1.05);
    let placeSize = place ? 0.46 : 0;
    let usdotStart = 1.2;
    let mcStart = 1.05;

    const textHeight = () =>
      nameM.height +
      0.14 +
      (place ? placeSize * 1.15 + 0.1 : 0) +
      measureLineSize(`USDOT ${dot}`, font, textW, usdotStart, 0.95, 0.04) * 1.12 +
      (showMc
        ? 0.1 +
          measureLineSize(`MC ${mc}`, font, textW, mcStart, 0.88, 0.04) * 1.12
        : 0);

    for (let i = 0; i < 10 && y + textHeight() > bottomLimit; i += 1) {
      nameStart = Math.max(1.05, nameStart - 0.08);
      usdotStart = Math.max(0.95, usdotStart - 0.05);
      mcStart = Math.max(0.85, mcStart - 0.05);
      nameM = measureName(company, font, textW, nameStart, 1.0);
    }

    stack.push(
      ...nameLinesFromMeasure(nameM, y, textW, centerX(textW), "center", ghostName, ink.name),
    );
    y += nameM.height + 0.12;
    if (place) {
      stack.push(
        line("place", placeText, y, textW, placeSize, false, 0.12, centerX(textW), "center", ink.legal, 600),
      );
      y += placeSize * 1.15 + 0.08;
    }
    const usdotSize = measureLineSize(`USDOT ${dot}`, font, textW, usdotStart, 0.95, 0.04);
    stack.push(
      line(
        "usdot",
        `USDOT ${dot}`,
        y,
        textW,
        usdotSize,
        !input.dotNumber.trim(),
        0.04,
        centerX(textW),
        "center",
        ink.legal,
        700,
      ),
    );
    y += usdotSize * 1.12;
    if (showMc) {
      y += 0.08;
      const mcSize = measureLineSize(`MC ${mc}`, font, textW, mcStart, 0.88, 0.04);
      stack.push(
        line(
          "mc",
          `MC ${mc}`,
          y,
          textW,
          mcSize,
          !input.mcNumber.trim(),
          0.04,
          centerX(textW),
          "center",
          ink.legal,
          700,
        ),
      );
    }
    return stack;
  }

  function sideBySide(): DesignElement[] {
    const stack: DesignElement[] = [];
    const box = logoBox("side");
    const logoW = hasLogo ? box.widthIn : 7.6;
    const logoH = hasLogo ? box.heightIn : 8.4;
    const logoX = 0.55;
    const logoY = (CANVAS_HEIGHT_IN - logoH) / 2;
    if (hasLogo) {
      stack.push(logoEl(logoX, logoY, logoW, logoH, false));
    } else {
      stack.push(
        textBlock({
          id: uid("ghost", 2),
          role: "ghost-logo",
          xIn: logoX,
          yIn: logoY,
          widthIn: logoW,
          heightIn: logoH,
          text: "LOGO",
          font: "condensed",
          fontSizeIn: 0.9,
          weight: 600,
          color: ink.name,
          align: "center",
          letterSpacingEm: 0.2,
          uppercase: true,
          visible: true,
          opacity: 0.35,
        }),
      );
    }

    const textX = logoX + logoW + 0.5;
    const textW = CANVAS_WIDTH_IN - textX - 0.55;
    let nameStart = 1.85;
    let usdotStart = 1.45;
    let mcStart = 1.25;
    let nameM = measureName(company, font, textW, nameStart, 1.05);
    let usdotSize = measureLineSize(`USDOT ${dot}`, font, textW, usdotStart, 0.92, 0.03);
    let mcSize = showMc
      ? measureLineSize(`MC ${mc}`, font, textW, mcStart, 0.85, 0.03)
      : 0;
    const placeSize = place ? Math.min(0.5, 0.48) : 0;

    const colHeight = () =>
      nameM.height +
      0.28 +
      (place ? placeSize * 1.2 + 0.22 : 0) +
      usdotSize * 1.18 +
      (showMc ? mcSize * 1.18 + 0.22 : 0);

    for (let i = 0; i < 10 && colHeight() > 10.6; i += 1) {
      nameStart = Math.max(1.05, nameStart - 0.1);
      usdotStart = Math.max(0.92, usdotStart - 0.07);
      mcStart = Math.max(0.85, mcStart - 0.06);
      nameM = measureName(company, font, textW, nameStart, 1.05);
      usdotSize = measureLineSize(`USDOT ${dot}`, font, textW, usdotStart, 0.92, 0.03);
      mcSize = showMc
        ? measureLineSize(`MC ${mc}`, font, textW, mcStart, 0.85, 0.03)
        : 0;
    }

    let y = Math.max(0.7, (CANVAS_HEIGHT_IN - colHeight()) / 2);
    stack.push(
      ...nameLinesFromMeasure(nameM, y, textW, textX, "left", ghostName, ink.name),
    );
    y += nameM.height + 0.28;
    if (place) {
      stack.push(
        line("place", placeText, y, textW, placeSize, false, 0.1, textX, "left", ink.legal, 600),
      );
      y += placeSize * 1.2 + 0.22;
    }
    stack.push(
      line(
        "usdot",
        `USDOT ${dot}`,
        y,
        textW,
        usdotSize,
        !input.dotNumber.trim(),
        0.04,
        textX,
        "left",
        ink.legal,
        700,
      ),
    );
    y += usdotSize * 1.18;
    if (showMc) {
      y += 0.18;
      stack.push(
        line(
          "mc",
          `MC ${mc}`,
          y,
          textW,
          mcSize,
          !input.mcNumber.trim(),
          0.04,
          textX,
          "left",
          ink.legal,
          700,
        ),
      );
    }
    return stack;
  }

  function classicPlaque(): DesignElement[] {
    const stack: DesignElement[] = [];
    const padX = 0.62;
    const textW = CANVAS_WIDTH_IN - padX * 2;
    let y = 0.42;
    let logoH = 0;
    let logoW = 0;
    if (hasLogo) {
      const box = logoBox("small");
      logoW = box.widthIn;
      logoH = box.heightIn;
      stack.push(logoEl(centerX(logoW), y, logoW, logoH, false));
      y += logoH + 0.18;
    }

    let nameStart = hasLogo ? 1.85 : 2.55;
    let nameM = measureName(company, font, textW, nameStart, 1.2);
    const placeSize = place ? 0.46 : 0;
    const ruleBlock = 0.28;
    const bottomPad = 0.32;
    const bandGap = 0.14;
    const bandCount = showMc ? 2 : 1;

    const usedAbove = () =>
      y + nameM.height + 0.16 + (place ? placeSize * 1.15 + 0.12 : 0) + ruleBlock;
    let remaining = CANVAS_HEIGHT_IN - usedAbove() - bottomPad;
    let bandH = (remaining - (bandCount - 1) * bandGap) / bandCount;

    for (let i = 0; i < 10 && bandH < 1.75; i += 1) {
      nameStart = Math.max(1.2, nameStart - 0.12);
      nameM = measureName(company, font, textW, nameStart, 1.15);
      remaining = CANVAS_HEIGHT_IN - usedAbove() - bottomPad;
      bandH = (remaining - (bandCount - 1) * bandGap) / bandCount;
    }

    bandH = Math.max(1.7, bandH);

    stack.push(
      ...nameLinesFromMeasure(nameM, y, textW, centerX(textW), "center", ghostName, ink.name),
    );
    y += nameM.height + 0.14;
    if (place) {
      stack.push(
        line("place", placeText, y, textW, placeSize, ghostPlace, 0.16, centerX(textW), "center", ink.legal, 600),
      );
      y += placeSize * 1.15 + 0.1;
    }

    stack.push({
      id: uid("rule", 0),
      type: "rule",
      xIn: centerX(10.5),
      yIn: y,
      widthIn: 10.5,
      heightIn: 0.08,
      color: ink.accent,
      visible: true,
      locked: true,
    });
    y += 0.22;

    remaining = CANVAS_HEIGHT_IN - y - bottomPad;
    bandH = Math.max(1.7, (remaining - (bandCount - 1) * bandGap) / bandCount);

    const bandW = CANVAS_WIDTH_IN - 1.1;
    const bandX = centerX(bandW);
    const idTextW = bandW - 0.7;

    const usdotLabel = `USDOT ${dot}`;
    const usdotSize = measureLineSize(usdotLabel, font, idTextW, bandH * 0.62, 1.25, 0.04);
    stack.push(bandEl("band-usdot", bandX, y, bandW, bandH));
    stack.push(
      line(
        "usdot",
        usdotLabel,
        y + (bandH - usdotSize * 1.05) / 2,
        idTextW,
        usdotSize,
        !input.dotNumber.trim(),
        0.04,
        centerX(idTextW),
        "center",
        ink.plateText,
        700,
      ),
    );
    y += bandH + bandGap;

    if (showMc) {
      const mcLabel = `MC ${mc}`;
      const mcSize = measureLineSize(mcLabel, font, idTextW, bandH * 0.58, 1.15, 0.04);
      stack.push(bandEl("band-mc", bandX, y, bandW, bandH));
      stack.push(
        line(
          "mc",
          mcLabel,
          y + (bandH - mcSize * 1.05) / 2,
          idTextW,
          mcSize,
          !input.mcNumber.trim(),
          0.04,
          centerX(idTextW),
          "center",
          ink.plateText,
          700,
        ),
      );
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

  function logoEl(
    xIn: number,
    yIn: number,
    widthIn: number,
    heightIn: number,
    boxed: boolean,
  ): LogoElement {
    return {
      id: "logo",
      type: "logo",
      xIn,
      yIn,
      widthIn,
      heightIn,
      src: input.logoDataUrl ?? "",
      boxed,
      boxColor: ink.name,
      visible: true,
      locked: false,
    };
  }

  function nameLinesFromMeasure(
    measured: ReturnType<typeof measureName>,
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
    role: "place" | "usdot" | "mc",
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
  ): TextElement {
    return textBlock({
      id: role,
      role,
      xIn,
      yIn,
      widthIn: maxWidth,
      heightIn: size * 1.15,
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
