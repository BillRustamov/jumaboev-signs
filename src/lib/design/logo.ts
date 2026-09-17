import { clampLogoSize, type LogoSize } from "@/lib/logo-size";

/** Maps the 1–5 control onto a multiplier of the template’s suggested logo box. */
const SCALE: Record<LogoSize, number> = {
  1: 0.55,
  2: 0.78,
  3: 1,
  4: 1.32,
  5: 1.68,
};

export function logoScaleFromSize(size: unknown): number {
  return SCALE[clampLogoSize(size)];
}

export function suggestedLogoBox(
  canvasW: number,
  canvasH: number,
  shape: "wide" | "square" | "tall" | "unknown",
  scale: number,
  mode: "spotlight" | "balanced" | "side" | "small",
): { widthIn: number; heightIn: number } {
  const clamped = Math.min(2.1, Math.max(0.4, scale));
  if (mode === "side") {
    const heightIn = Math.min(canvasH * 0.78, 9.4) * Math.min(clamped, 1.2);
    const widthIn =
      shape === "wide"
        ? Math.min(8.4, canvasW * 0.42)
        : shape === "tall"
          ? heightIn * 0.62
          : heightIn * 0.92;
    return { widthIn, heightIn };
  }
  if (mode === "spotlight") {
    const widthIn = Math.min(canvasW * 0.78, 15.2) * Math.min(clamped, 1.35);
    const heightIn =
      shape === "wide"
        ? Math.min(canvasH * 0.38, widthIn / 2.1)
        : shape === "tall"
          ? Math.min(canvasH * 0.52, 6.2) * clamped
          : Math.min(canvasH * 0.46, 5.6) * clamped;
    return { widthIn, heightIn };
  }
  if (mode === "small") {
    const widthIn = (shape === "wide" ? 4.4 : 3.1) * clamped;
    const heightIn = (shape === "wide" ? 1.35 : 2.2) * clamped;
    return { widthIn, heightIn };
  }
  const widthIn = (shape === "wide" ? 7.6 : shape === "tall" ? 3.4 : 5.4) * clamped;
  const heightIn = (shape === "wide" ? 2.1 : shape === "tall" ? 3.8 : 2.4) * clamped;
  return {
    widthIn: Math.min(widthIn, canvasW * 0.72),
    heightIn: Math.min(heightIn, canvasH * 0.42),
  };
}
