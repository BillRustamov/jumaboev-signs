/** Telegram / bot preview compositor — full cab in frame, vinyl never clipped. */

import { VINYL } from "@/lib/vinyl-spec";
import {
  WHITE_CASCADIA_DRIVER,
  containedImageRect,
  fitSignToDoor,
  overlayBoxStyle,
  type ContainedImage,
} from "@/lib/truck-mockups";

const PHOTO = WHITE_CASCADIA_DRIVER;

/** Viewport matches the cab photo so a screenshot is the whole door, not a landscape crop. */
export const BOT_PREVIEW_VIEWPORT = {
  width: PHOTO.imageWidthPx * 2,
  height: PHOTO.imageHeightPx * 2,
} as const;

export const BOT_PREVIEW_PHOTO = {
  src: PHOTO.image,
  widthPx: PHOTO.imageWidthPx,
  heightPx: PHOTO.imageHeightPx,
  aspect: `${PHOTO.imageWidthPx} / ${PHOTO.imageHeightPx}`,
} as const;

export const BOT_PREVIEW_SIZE_LINE = `Size: ${VINYL.size} each cab side (left + right)`;

export function botPreviewContain(
  containerW: number,
  containerH: number,
): ContainedImage {
  return containedImageRect(
    containerW,
    containerH,
    PHOTO.imageWidthPx,
    PHOTO.imageHeightPx,
  );
}

export function botPreviewSignBox(
  containerW: number,
  containerH: number,
) {
  const contained = botPreviewContain(containerW, containerH);
  const fit = fitSignToDoor(PHOTO);
  const box = overlayBoxStyle(fit.rect, contained);
  return { contained, fit, box };
}

/** True when the full 20×12 overlay sits inside the compositor frame. */
export function vinylFitsInPreviewFrame(
  containerW: number,
  containerH: number,
): boolean {
  const { contained, box } = botPreviewSignBox(containerW, containerH);
  const pad = 0.5;
  return (
    box.width > 0 &&
    box.height > 0 &&
    box.left >= contained.offsetX - pad &&
    box.top >= contained.offsetY - pad &&
    box.left + box.width <= contained.offsetX + contained.renderW + pad &&
    box.top + box.height <= contained.offsetY + contained.renderH + pad &&
    box.left + box.width <= containerW + pad &&
    box.top + box.height <= containerH + pad
  );
}
