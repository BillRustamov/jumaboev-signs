/** Cropped white Cascadia cab — driver door. 20×12 overlay stays 5:3. */

export const CAB_PHOTO = {
  src: "/white-cab-door.jpg",
  widthPx: 520,
  heightPx: 560,
  alt: "White truck cab, driver-side door",
} as const;

/** Percent of the cab photo. Height is derived so the vinyl never squashes. */
export const CAB_DOOR = {
  leftPct: 22.4,
  topPct: 39.6,
  widthPct: 16.6,
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
