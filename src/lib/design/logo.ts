import { clampLogoSize, type LogoSize } from "@/lib/logo-size";
import type { LogoShape } from "@/lib/design/schema";

/** Maps the 1–5 control onto a multiplier of the template’s suggested logo box. */
const SCALE: Record<LogoSize, number> = {
  1: 0.62,
  2: 0.82,
  3: 1,
  4: 1.22,
  5: 1.48,
};

export function logoScaleFromSize(size: unknown): number {
  return SCALE[clampLogoSize(size)];
}

export function logoSlotMax(
  canvasW: number,
  canvasH: number,
  scale: number,
  mode: "spotlight" | "balanced" | "side" | "small",
): { maxW: number; maxH: number } {
  const clamped = Math.min(1.55, Math.max(0.5, scale));
  let maxW: number;
  let maxH: number;
  if (mode === "side") {
    maxW = canvasW * 0.38;
    maxH = canvasH * 0.78;
  } else if (mode === "spotlight") {
    maxW = canvasW * 0.72;
    maxH = canvasH * 0.46;
  } else if (mode === "small") {
    maxW = canvasW * 0.44;
    maxH = canvasH * 0.26;
  } else {
    maxW = canvasW * 0.62;
    maxH = canvasH * 0.32;
  }
  maxW = Math.min(canvasW - 0.9, maxW * clamped);
  maxH = Math.min(canvasH - 0.9, maxH * clamped);
  return { maxW: Math.max(1.2, maxW), maxH: Math.max(1.1, maxH) };
}

function aspectFor(shape: LogoShape, ratio?: number): number {
  if (typeof ratio === "number" && ratio > 0.05 && Number.isFinite(ratio)) {
    return ratio;
  }
  if (shape === "wide") return 2.5;
  if (shape === "tall") return 0.52;
  if (shape === "unknown") return 1.15;
  return 1;
}

function fitAspect(
  maxW: number,
  maxH: number,
  aspect: number,
): { widthIn: number; heightIn: number } {
  let widthIn = maxW;
  let heightIn = maxW / aspect;
  if (heightIn > maxH) {
    heightIn = maxH;
    widthIn = maxH * aspect;
  }
  return { widthIn, heightIn };
}

/** Contain a logo in a slot. Never stretch. Never grow past the slot. */
export function containLogo(
  maxW: number,
  maxH: number,
  aspect: number,
): { widthIn: number; heightIn: number } {
  const safeAspect = aspect > 0.05 && Number.isFinite(aspect) ? aspect : 1;
  return fitAspect(Math.max(0.8, maxW), Math.max(0.8, maxH), safeAspect);
}

export function suggestedLogoBox(
  canvasW: number,
  canvasH: number,
  shape: LogoShape,
  scale: number,
  mode: "spotlight" | "balanced" | "side" | "small",
  ratio?: number,
): { widthIn: number; heightIn: number } {
  const { maxW, maxH } = logoSlotMax(canvasW, canvasH, scale, mode);
  const aspect = aspectFor(shape, ratio);
  return fitAspect(maxW, maxH, aspect);
}
