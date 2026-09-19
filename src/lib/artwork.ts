import {
  CANVAS_HEIGHT_IN,
  CANVAS_WIDTH_IN,
} from "@/lib/design/schema";

export type ArtworkFit = "contain" | "cover" | "margins" | "original";
export type ArtworkRole = "none" | "logo" | "existing-sign";

export const ARTWORK_FITS: {
  id: ArtworkFit;
  label: string;
  hint: string;
}[] = [
  {
    id: "contain",
    label: "Fit entire",
    hint: "Whole file visible on the 20 × 12 in board. No stretch.",
  },
  {
    id: "cover",
    label: "Crop to fill",
    hint: "Fills the board. Edges are cropped — only if you choose this.",
  },
  {
    id: "margins",
    label: "Add margins",
    hint: "Whole file visible with extra vinyl around it.",
  },
  {
    id: "original",
    label: "Keep aspect",
    hint: "Native proportions, letterboxed. Never stretched or cropped.",
  },
];

export function isArtworkFit(value: unknown): value is ArtworkFit {
  return ARTWORK_FITS.some((item) => item.id === value);
}

export function isArtworkRole(value: unknown): value is ArtworkRole {
  return value === "none" || value === "logo" || value === "existing-sign";
}

export function resolveArtworkFit(value: unknown): ArtworkFit {
  return isArtworkFit(value) ? value : "contain";
}

export function resolveArtworkRole(value: unknown): ArtworkRole {
  return isArtworkRole(value) ? value : "none";
}

export function defaultArtwork(): {
  artworkRole: ArtworkRole;
  artworkFit: ArtworkFit;
  artworkOffsetX: number;
  artworkOffsetY: number;
  originalArtworkUrl: string;
  logoContainsName: boolean;
} {
  return {
    artworkRole: "none",
    artworkFit: "contain",
    artworkOffsetX: 0,
    artworkOffsetY: 0,
    originalArtworkUrl: "",
    logoContainsName: false,
  };
}

/** Landscape door photos and plaques sit near 5:3. Marks usually do not. */
export function suggestArtworkRole(aspect?: number): ArtworkRole {
  if (!(typeof aspect === "number") || !Number.isFinite(aspect) || aspect <= 0) {
    return "logo";
  }
  if (aspect >= 1.3 && aspect <= 2.1) return "existing-sign";
  return "logo";
}

export function isRasterDataUrl(url: string): boolean {
  const value = url.trim().toLowerCase();
  if (!value) return false;
  if (value.startsWith("data:image/svg")) return false;
  return (
    value.startsWith("data:image/jpeg") ||
    value.startsWith("data:image/jpg") ||
    value.startsWith("data:image/png") ||
    value.startsWith("data:image/webp") ||
    value.startsWith("data:image/gif") ||
    /\.(jpe?g|png|webp|gif)(\?|$)/.test(value)
  );
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export type ArtworkPlacement = {
  clipX: number;
  clipY: number;
  clipW: number;
  clipH: number;
  imageX: number;
  imageY: number;
  imageW: number;
  imageH: number;
  cropped: boolean;
};

export function artworkPlacement(opts: {
  slotX: number;
  slotY: number;
  slotW: number;
  slotH: number;
  aspect: number;
  fit?: ArtworkFit;
  offsetX?: number;
  offsetY?: number;
}): ArtworkPlacement {
  const aspect =
    typeof opts.aspect === "number" && opts.aspect > 0.05 && Number.isFinite(opts.aspect)
      ? opts.aspect
      : CANVAS_WIDTH_IN / CANVAS_HEIGHT_IN;
  const fit = resolveArtworkFit(opts.fit);
  const pad = fit === "margins" ? 0.1 : 0;
  const innerW = Math.max(0.5, opts.slotW * (1 - 2 * pad));
  const innerH = Math.max(0.5, opts.slotH * (1 - 2 * pad));
  const innerX = opts.slotX + (opts.slotW - innerW) / 2;
  const innerY = opts.slotY + (opts.slotH - innerH) / 2;
  const ox = fit === "original" ? 0 : clamp(opts.offsetX ?? 0, -1, 1);
  const oy = fit === "original" ? 0 : clamp(opts.offsetY ?? 0, -1, 1);
  const cover = fit === "cover";

  let imageW = innerW;
  let imageH = innerW / aspect;
  if (cover) {
    if (imageH < innerH) {
      imageH = innerH;
      imageW = innerH * aspect;
    }
  } else if (imageH > innerH) {
    imageH = innerH;
    imageW = innerH * aspect;
  }

  const slackX = innerW - imageW;
  const slackY = innerH - imageH;
  const imageX = innerX + slackX / 2 + ox * (Math.abs(slackX) / 2);
  const imageY = innerY + slackY / 2 + oy * (Math.abs(slackY) / 2);

  return {
    clipX: innerX,
    clipY: innerY,
    clipW: innerW,
    clipH: innerH,
    imageX,
    imageY,
    imageW,
    imageH,
    cropped: cover,
  };
}

export function aspectOf(placement: ArtworkPlacement): number {
  return placement.imageW / placement.imageH;
}

export function existingSignSlot(): {
  slotX: number;
  slotY: number;
  slotW: number;
  slotH: number;
} {
  const inset = 0.14;
  return {
    slotX: inset,
    slotY: inset,
    slotW: CANVAS_WIDTH_IN - inset * 2,
    slotH: CANVAS_HEIGHT_IN - inset * 2,
  };
}

/** 4:3 existing-door stand-in so contain vs crop is obvious. Not a customer file. */
export const DEMO_EXISTING_SIGN =
  "data:image/svg+xml;charset=utf-8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1200">
      <rect width="1600" height="1200" fill="#9aa3ad"/>
      <rect x="70" y="90" width="1460" height="1020" rx="18" fill="#f4f4f4" stroke="#1a1a1a" stroke-width="18"/>
      <text x="800" y="430" text-anchor="middle" font-family="Arial Black, Arial, sans-serif" font-size="118" font-weight="700" fill="#111">EXISTING SIGN</text>
      <text x="800" y="560" text-anchor="middle" font-family="Arial, sans-serif" font-size="42" fill="#333">DALLAS, TX</text>
      <rect x="280" y="620" width="1040" height="8" fill="#111"/>
      <text x="800" y="760" text-anchor="middle" font-family="Arial Black, Arial, sans-serif" font-size="96" font-weight="700" fill="#111">USDOT 0000000</text>
      <text x="800" y="900" text-anchor="middle" font-family="Arial Black, Arial, sans-serif" font-size="88" font-weight="700" fill="#111">MC 000000</text>
    </svg>`,
  );
