/** Compatibility wrapper around the calibrated door-zone mockup. */

import {
  WHITE_CASCADIA_DRIVER,
  fitSignToDoor,
} from "@/lib/truck-mockups";

export const CAB_PHOTO = {
  src: WHITE_CASCADIA_DRIVER.image,
  widthPx: WHITE_CASCADIA_DRIVER.imageWidthPx,
  heightPx: WHITE_CASCADIA_DRIVER.imageHeightPx,
  alt: WHITE_CASCADIA_DRIVER.alt,
} as const;

const fitted = fitSignToDoor(WHITE_CASCADIA_DRIVER);

/** Derived from the calibrated door zone — not a one-off CSS nudge. */
export const CAB_DOOR = {
  leftPct: fitted.rect.x * 100,
  topPct: fitted.rect.y * 100,
  widthPct: fitted.rect.width * 100,
} as const;

export function doorOverlayStyle(
  door: { leftPct: number; topPct: number; widthPct: number } = CAB_DOOR,
  photoW = CAB_PHOTO.widthPx,
  photoH = CAB_PHOTO.heightPx,
): { left: string; top: string; width: string; height: string } {
  const heightPct = door.widthPct * (photoW / photoH) * (12 / 20);
  return {
    left: `${door.leftPct}%`,
    top: `${door.topPct}%`,
    width: `${door.widthPct}%`,
    height: `${heightPct}%`,
  };
}
