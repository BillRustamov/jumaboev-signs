import {
  CANVAS_HEIGHT_IN,
  CANVAS_WIDTH_IN,
  DESIGN_VERSION,
  classifyLogo,
  type ChevronElement,
  type DesignDocument,
  type DesignElement,
  type LogoElement,
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

function textBlock(partial: Omit<TextElement, "type" | "locked">): TextElement {
  return { ...partial, type: "text", locked: partial.role !== "ghost-logo" };
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

  const background = {
    fill: input.colors.face,
    radiusIn: templateId === "minimal" ? 0.18 : 0.42,
    borderColor: input.colors.accent,
    borderIn: templateId === "minimal" ? 0.06 : 0.1,
  };

  const elements =
    templateId === "side-by-side"
      ? sideBySide()
      : templateId === "logo-spotlight"
        ? spotlight()
        : templateId === "classic"
          ? classic()
          : templateId === "minimal"
            ? minimal()
            : plaque();

  if (input.showChevrons && !elements.some((item) => item.type === "chevron")) {
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
  if (nameEl && nameEl.fontSizeIn < 0.85) {
    warnings.push(
      "Company name is under 0.85 in. Check 50-foot daylight reading before you approve.",
    );
  }

  return {
    version: DESIGN_VERSION,
    widthIn: CANVAS_WIDTH_IN,
    heightIn: CANVAS_HEIGHT_IN,
    templateId,
    background,
    elements,
    warnings,
  };

  function plaque(): DesignElement[] {
    const box = suggestedLogoBox(
      CANVAS_WIDTH_IN,
      CANVAS_HEIGHT_IN,
      shape,
      scale,
      "balanced",
    );
    const logoW = hasLogo ? box.widthIn : 5.4;
    const logoH = hasLogo ? box.heightIn : 1.35;
    const top = 0.55;
    const stack: DesignElement[] = [];
    if (hasLogo) {
      stack.push(logoEl(centerX(logoW), top, logoW, logoH, false));
    } else {
      stack.push(
        textBlock({
          id: uid("ghost", 0),
          role: "ghost-logo",
          xIn: centerX(5.6),
          yIn: top,
          widthIn: 5.6,
          heightIn: 1.35,
          text: "LOGO",
          font: "condensed",
          fontSizeIn: 0.72,
          weight: 600,
          color: input.colors.name,
          align: "center",
          letterSpacingEm: 0.22,
          uppercase: true,
          visible: true,
          opacity: 1,
        }),
      );
    }
    let y = top + (hasLogo ? logoH : 1.35) + 0.28;
    stack.push(
      ...nameLines(company, font, y, 18.2, 1.55, 0.9, ghostName),
    );
    const nameHeight = nameBlockHeight(company, font, 18.2, 1.55, 0.9);
    y += nameHeight + 0.22;
    stack.push({
      id: uid("rule", 0),
      type: "rule",
      xIn: centerX(7.2),
      yIn: y,
      widthIn: 7.2,
      heightIn: 0.06,
      color: input.colors.accent,
      visible: true,
      locked: true,
    });
    y += 0.32;
    stack.push(
      line("place", placeText, y, 16, 0.62, 0.48, ghostPlace, 0.18),
    );
    y += 0.78;
    stack.push(
      line(
        "usdot",
        `USDOT ${dot}`,
        y,
        16,
        0.72,
        0.55,
        !input.dotNumber.trim(),
        0.08,
      ),
    );
    y += 0.78;
    if (showMc) {
      stack.push(
        line(
          "mc",
          `MC ${mc}`,
          y,
          16,
          0.72,
          0.55,
          !input.mcNumber.trim(),
          0.08,
        ),
      );
    }
    return stack;
  }

  function classic(): DesignElement[] {
    const stack: DesignElement[] = [];
    let y = 0.7;
    if (hasLogo) {
      const box = suggestedLogoBox(
        CANVAS_WIDTH_IN,
        CANVAS_HEIGHT_IN,
        shape,
        scale,
        "small",
      );
      stack.push(logoEl(centerX(box.widthIn), y, box.widthIn, box.heightIn, false));
      y += box.heightIn + 0.35;
    }
    const names = nameLines(company, font, y, 18.4, 1.85, 1.05, ghostName);
    stack.push(...names);
    y += nameBlockHeight(company, font, 18.4, 1.85, 1.05) + 0.45;
    if (place) {
      stack.push(line("place", placeText, y, 16, 0.48, 0.4, false, 0.16));
      y += 0.7;
    }
    stack.push(
      line(
        "usdot",
        `USDOT ${dot}`,
        y,
        18,
        0.7,
        0.55,
        !input.dotNumber.trim(),
        0.12,
      ),
    );
    y += 0.85;
    if (showMc) {
      stack.push(
        line(
          "mc",
          `MC ${mc}`,
          y,
          18,
          0.62,
          0.5,
          !input.mcNumber.trim(),
          0.12,
        ),
      );
    }
    return stack;
  }

  function spotlight(): DesignElement[] {
    const stack: DesignElement[] = [];
    const box = suggestedLogoBox(
      CANVAS_WIDTH_IN,
      CANVAS_HEIGHT_IN,
      shape,
      Math.max(scale, hasLogo ? 1.05 : 0.8),
      "spotlight",
    );
    const top = 0.45;
    if (hasLogo) {
      stack.push(logoEl(centerX(box.widthIn), top, box.widthIn, box.heightIn, false));
    } else {
      stack.push(
        textBlock({
          id: uid("ghost", 1),
          role: "ghost-logo",
          xIn: centerX(8),
          yIn: top,
          widthIn: 8,
          heightIn: 2.4,
          text: "YOUR LOGO",
          font,
          fontSizeIn: 0.7,
          weight: 600,
          color: input.colors.name,
          align: "center",
          letterSpacingEm: 0.14,
          uppercase: true,
          visible: true,
          opacity: 0.45,
        }),
      );
    }
    let y = top + (hasLogo ? box.heightIn : 2.4) + 0.32;
    stack.push(...nameLines(company, font, y, 18.2, 1.25, 0.8, ghostName));
    y += nameBlockHeight(company, font, 18.2, 1.25, 0.8) + 0.28;
    if (place) {
      stack.push(line("place", placeText, y, 16, 0.5, 0.4, false, 0.14));
      y += 0.62;
    }
    stack.push(
      line(
        "usdot",
        `USDOT ${dot}`,
        y,
        16,
        0.62,
        0.5,
        !input.dotNumber.trim(),
        0.08,
      ),
    );
    y += 0.7;
    if (showMc) {
      stack.push(
        line(
          "mc",
          `MC ${mc}`,
          y,
          16,
          0.58,
          0.48,
          !input.mcNumber.trim(),
          0.08,
        ),
      );
    }
    return stack;
  }

  function sideBySide(): DesignElement[] {
    if (!hasLogo) return classic();
    const box = suggestedLogoBox(
      CANVAS_WIDTH_IN,
      CANVAS_HEIGHT_IN,
      shape,
      scale,
      "side",
    );
    const logoX = 0.7;
    const logoY = (CANVAS_HEIGHT_IN - box.heightIn) / 2;
    const textX = logoX + box.widthIn + 0.55;
    const textW = CANVAS_WIDTH_IN - textX - 0.7;
    const stack: DesignElement[] = [
      logoEl(logoX, logoY, box.widthIn, box.heightIn, false),
    ];
    let y = 1.5;
    stack.push(...nameLines(company, font, y, textW, 1.35, 0.8, ghostName, textX, "left"));
    y += nameBlockHeight(company, font, textW, 1.35, 0.8) + 0.4;
    if (place) {
      stack.push(
        line("place", placeText, y, textW, 0.5, 0.4, false, 0.12, textX, "left"),
      );
      y += 0.7;
    }
    stack.push(
      line(
        "usdot",
        `USDOT ${dot}`,
        y,
        textW,
        0.68,
        0.52,
        !input.dotNumber.trim(),
        0.08,
        textX,
        "left",
      ),
    );
    y += 0.82;
    if (showMc) {
      stack.push(
        line(
          "mc",
          `MC ${mc}`,
          y,
          textW,
          0.62,
          0.5,
          !input.mcNumber.trim(),
          0.08,
          textX,
          "left",
        ),
      );
    }
    return stack;
  }

  function minimal(): DesignElement[] {
    const stack: DesignElement[] = [];
    let y = 1.15;
    if (hasLogo) {
      const box = suggestedLogoBox(
        CANVAS_WIDTH_IN,
        CANVAS_HEIGHT_IN,
        shape,
        scale,
        "small",
      );
      stack.push(logoEl(0.85, 0.7, box.widthIn, box.heightIn, false));
      y = Math.max(y, 0.7 + box.heightIn + 0.35);
    }
    stack.push(...nameLines(company, font, y, 18.3, 1.7, 0.95, ghostName));
    y += nameBlockHeight(company, font, 18.3, 1.7, 0.95) + 0.55;
    stack.push(
      line(
        "usdot",
        `USDOT ${dot}`,
        y,
        18,
        0.7,
        0.55,
        !input.dotNumber.trim(),
        0.16,
      ),
    );
    y += 0.9;
    if (showMc) {
      stack.push(
        line(
          "mc",
          `MC ${mc}`,
          y,
          18,
          0.62,
          0.5,
          !input.mcNumber.trim(),
          0.16,
        ),
      );
    }
    if (place) {
      y += 0.85;
      stack.push(line("place", placeText, y, 16, 0.42, 0.36, false, 0.18));
    }
    return stack;
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
      boxColor: input.colors.name,
      visible: true,
      locked: false,
    };
  }

  function nameLines(
    text: string,
    usedFont: SignFontId,
    yIn: number,
    maxWidth: number,
    startSize: number,
    minSize: number,
    ghost: boolean,
    xIn = centerX(maxWidth),
    align: TextElement["align"] = "center",
  ): TextElement[] {
    const trial = wrapText(text, usedFont, startSize, maxWidth, -0.03);
    const size = fitFontSize(trial, usedFont, maxWidth, startSize, minSize, -0.03);
    const lines = wrapText(text, usedFont, size, maxWidth, -0.03).slice(0, 3);
    const lineH = size * 0.92;
    return lines.map((lineText, index) =>
      textBlock({
        id: uid("name", index),
        role: "company",
        xIn,
        yIn: yIn + index * lineH,
        widthIn: maxWidth,
        heightIn: lineH,
        text: lineText,
        font: usedFont,
        fontSizeIn: size,
        weight: 700,
        color: input.colors.name,
        align,
        letterSpacingEm: -0.03,
        uppercase: true,
        visible: true,
        opacity: ghost ? 0.4 : 1,
      }),
    );
  }

  function nameBlockHeight(
    text: string,
    usedFont: SignFontId,
    maxWidth: number,
    startSize: number,
    minSize: number,
  ): number {
    const trial = wrapText(text, usedFont, startSize, maxWidth, -0.03);
    const size = fitFontSize(trial, usedFont, maxWidth, startSize, minSize, -0.03);
    const lines = wrapText(text, usedFont, size, maxWidth, -0.03).slice(0, 3);
    return lines.length * size * 0.92;
  }

  function line(
    role: "place" | "usdot" | "mc",
    text: string,
    yIn: number,
    maxWidth: number,
    startSize: number,
    minSize: number,
    ghost: boolean,
    tracking: number,
    xIn = centerX(maxWidth),
    align: TextElement["align"] = "center",
  ): TextElement {
    const size = fitFontSize([text], font, maxWidth, startSize, minSize, tracking);
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
      weight: 600,
      color: input.colors.legal,
      align,
      letterSpacingEm: tracking,
      uppercase: true,
      visible: true,
      opacity: ghost ? 0.4 : 1,
    });
  }

  function chevrons(): ChevronElement[] {
    const h = 3.4;
    const w = 0.72;
    const y = (CANVAS_HEIGHT_IN - h) / 2;
    return [
      {
        id: "chevron-left",
        type: "chevron",
        xIn: 0.28,
        yIn: y,
        widthIn: w,
        heightIn: h,
        color: input.colors.accent,
        direction: "right",
        visible: true,
        locked: true,
      },
      {
        id: "chevron-right",
        type: "chevron",
        xIn: CANVAS_WIDTH_IN - w - 0.28,
        yIn: y,
        widthIn: w,
        heightIn: h,
        color: input.colors.accent,
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
