/** Per-photo door-zone calibration. Coords are normalized 0–1 of the image. */

import { VINYL } from "@/lib/vinyl-spec";

export type Point = { x: number; y: number };

export type DoorQuad = {
  topLeft: Point;
  topRight: Point;
  bottomRight: Point;
  bottomLeft: Point;
};

export type ForbiddenType = "window" | "handle" | "mirror" | "seam" | "trim";

export type ForbiddenZone = {
  type: ForbiddenType;
  polygon: Point[];
};

export type TruckMockupConfig = {
  id: string;
  image: string;
  imageWidthPx: number;
  imageHeightPx: number;
  alt: string;
  doorZone: DoorQuad;
  /** Fractions of door AABB width (left/right) and height (top/bottom). */
  safeInset?: { top: number; right: number; bottom: number; left: number };
  /** Max sign size as % of the *usable* door panel (not the photo). */
  maxSignWidthPercent?: number;
  maxSignHeightPercent?: number;
  perspective?: boolean;
  /** Sign width as % of the door-zone AABB, not the whole image. */
  mockupSignScale?: number;
  /**
   * Occupancy of the usable safe panel width (0–1).
   * Primary size lever — not a CSS zoom, not % of the photo.
   */
  recommendedScale?: number;
  forbiddenZones?: ForbiddenZone[];
};

export type AABB = { x: number; y: number; width: number; height: number };

export type PlacementNudge = {
  dx: number;
  dy: number;
  scale: number;
};

export type ContainedImage = {
  offsetX: number;
  offsetY: number;
  renderW: number;
  renderH: number;
  containerW: number;
  containerH: number;
};

export type DoorFit = {
  rect: AABB;
  usable: AABB;
  door: AABB;
  corners: [Point, Point, Point, Point];
  warning: string | null;
  /** Actual sign width / door AABB width. */
  scaleOfDoor: number;
};

export const SIGN_ASPECT = VINYL.printWIn / VINYL.printHIn;

export const IDENTITY_NUDGE: PlacementNudge = { dx: 0, dy: 0, scale: 1 };

export const WHITE_CASCADIA_DRIVER: TruckMockupConfig = {
  id: "white-cascadia-driver",
  image: "/white-cab-door.jpg",
  imageWidthPx: 520,
  imageHeightPx: 560,
  alt: "White truck cab, driver-side door",
  doorZone: {
    topLeft: { x: 0.198, y: 0.27 },
    topRight: { x: 0.478, y: 0.266 },
    bottomRight: { x: 0.478, y: 0.678 },
    bottomLeft: { x: 0.168, y: 0.678 },
  },
  safeInset: { top: 0.04, right: 0.07, bottom: 0.06, left: 0.1 },
  maxSignWidthPercent: 93,
  maxSignHeightPercent: 75,
  perspective: false,
  mockupSignScale: 56,
  recommendedScale: 0.91,
  forbiddenZones: [
    {
      type: "window",
      polygon: [
        { x: 0.175, y: 0.268 },
        { x: 0.448, y: 0.268 },
        { x: 0.438, y: 0.498 },
        { x: 0.168, y: 0.505 },
      ],
    },
    {
      type: "mirror",
      polygon: [
        { x: 0.048, y: 0.39 },
        { x: 0.225, y: 0.375 },
        { x: 0.232, y: 0.545 },
        { x: 0.05, y: 0.56 },
      ],
    },
    {
      type: "handle",
      polygon: [
        { x: 0.408, y: 0.568 },
        { x: 0.462, y: 0.568 },
        { x: 0.462, y: 0.652 },
        { x: 0.408, y: 0.652 },
      ],
    },
    {
      type: "seam",
      polygon: [
        { x: 0.468, y: 0.262 },
        { x: 0.495, y: 0.262 },
        { x: 0.495, y: 0.685 },
        { x: 0.468, y: 0.685 },
      ],
    },
    {
      type: "trim",
      polygon: [
        { x: 0.14, y: 0.668 },
        { x: 0.5, y: 0.668 },
        { x: 0.5, y: 0.72 },
        { x: 0.14, y: 0.72 },
      ],
    },
  ],
};

export const TRUCK_MOCKUPS: Record<string, TruckMockupConfig> = {
  [WHITE_CASCADIA_DRIVER.id]: WHITE_CASCADIA_DRIVER,
};

export const DEFAULT_TRUCK_ID = WHITE_CASCADIA_DRIVER.id;

export function getTruckMockup(id = DEFAULT_TRUCK_ID): TruckMockupConfig {
  return TRUCK_MOCKUPS[id] ?? WHITE_CASCADIA_DRIVER;
}

export function quadPoints(quad: DoorQuad): Point[] {
  return [quad.topLeft, quad.topRight, quad.bottomRight, quad.bottomLeft];
}

export function aabbOfPoints(points: Point[]): AABB {
  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  const x = Math.min(...xs);
  const y = Math.min(...ys);
  return { x, y, width: Math.max(...xs) - x, height: Math.max(...ys) - y };
}

export function aabbOfQuad(quad: DoorQuad): AABB {
  return aabbOfPoints(quadPoints(quad));
}

export function aabbRight(box: AABB): number {
  return box.x + box.width;
}

export function aabbBottom(box: AABB): number {
  return box.y + box.height;
}

export function insetAabb(
  box: AABB,
  inset: { top: number; right: number; bottom: number; left: number },
): AABB {
  const x = box.x + inset.left * box.width;
  const y = box.y + inset.top * box.height;
  const width = Math.max(0, box.width * (1 - inset.left - inset.right));
  const height = Math.max(0, box.height * (1 - inset.top - inset.bottom));
  return { x, y, width, height };
}

export function aabbsOverlap(a: AABB, b: AABB, pad = 0): boolean {
  return (
    a.x < aabbRight(b) - pad &&
    aabbRight(a) > b.x + pad &&
    a.y < aabbBottom(b) - pad &&
    aabbBottom(a) > b.y + pad
  );
}

export function pointInPolygon(point: Point, polygon: Point[]): boolean {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const a = polygon[i]!;
    const b = polygon[j]!;
    const hit =
      a.y > point.y !== b.y > point.y &&
      point.x < ((b.x - a.x) * (point.y - a.y)) / (b.y - a.y + Number.EPSILON) + a.x;
    if (hit) inside = !inside;
  }
  return inside;
}

function segmentsIntersect(a: Point, b: Point, c: Point, d: Point): boolean {
  const det = (b.x - a.x) * (d.y - c.y) - (b.y - a.y) * (d.x - c.x);
  if (Math.abs(det) < 1e-12) return false;
  const t = ((c.x - a.x) * (d.y - c.y) - (c.y - a.y) * (d.x - c.x)) / det;
  const u = ((c.x - a.x) * (b.y - a.y) - (c.y - a.y) * (b.x - a.x)) / det;
  return t >= 0 && t <= 1 && u >= 0 && u <= 1;
}

export function rectCorners(box: AABB): [Point, Point, Point, Point] {
  return [
    { x: box.x, y: box.y },
    { x: aabbRight(box), y: box.y },
    { x: aabbRight(box), y: aabbBottom(box) },
    { x: box.x, y: aabbBottom(box) },
  ];
}

export function rectHitsPolygon(box: AABB, polygon: Point[]): boolean {
  if (polygon.length < 3) return false;
  if (!aabbsOverlap(box, aabbOfPoints(polygon))) return false;
  const corners = rectCorners(box);
  if (corners.some((p) => pointInPolygon(p, polygon))) return true;
  if (polygon.some((p) => pointInPolygon(p, corners))) return true;
  for (let i = 0; i < corners.length; i++) {
    const a = corners[i]!;
    const b = corners[(i + 1) % corners.length]!;
    for (let j = 0; j < polygon.length; j++) {
      const c = polygon[j]!;
      const d = polygon[(j + 1) % polygon.length]!;
      if (segmentsIntersect(a, b, c, d)) return true;
    }
  }
  return false;
}

export function signHeightNorm(
  widthNorm: number,
  imageWidthPx: number,
  imageHeightPx: number,
): number {
  return widthNorm * (imageWidthPx / imageHeightPx) / SIGN_ASPECT;
}

export function signWidthNorm(
  heightNorm: number,
  imageWidthPx: number,
  imageHeightPx: number,
): number {
  return heightNorm * (imageHeightPx / imageWidthPx) * SIGN_ASPECT;
}

/**
 * object-fit: contain — rendered image size and letterbox offsets
 * inside the container. Overlay coords must use this, not the outer box.
 */
export function containedImageRect(
  containerW: number,
  containerH: number,
  imageW: number,
  imageH: number,
): ContainedImage {
  if (containerW <= 0 || containerH <= 0 || imageW <= 0 || imageH <= 0) {
    return {
      offsetX: 0,
      offsetY: 0,
      renderW: 0,
      renderH: 0,
      containerW,
      containerH,
    };
  }
  const imageAspect = imageW / imageH;
  const containerAspect = containerW / containerH;
  let renderW: number;
  let renderH: number;
  if (containerAspect > imageAspect) {
    renderH = containerH;
    renderW = containerH * imageAspect;
  } else {
    renderW = containerW;
    renderH = containerW / imageAspect;
  }
  return {
    offsetX: (containerW - renderW) / 2,
    offsetY: (containerH - renderH) / 2,
    renderW,
    renderH,
    containerW,
    containerH,
  };
}

export function imagePointToContainer(
  nx: number,
  ny: number,
  box: ContainedImage,
): Point {
  return {
    x: box.offsetX + nx * box.renderW,
    y: box.offsetY + ny * box.renderH,
  };
}

export function containerPointToImage(
  x: number,
  y: number,
  box: ContainedImage,
): Point {
  return {
    x: box.renderW === 0 ? 0 : (x - box.offsetX) / box.renderW,
    y: box.renderH === 0 ? 0 : (y - box.offsetY) / box.renderH,
  };
}

export function lerpPoint(a: Point, b: Point, t: number): Point {
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
}

/** Bilinear map of door-local u,v (0–1) onto the calibrated quad. */
export function quadMap(quad: DoorQuad, u: number, v: number): Point {
  const top = lerpPoint(quad.topLeft, quad.topRight, u);
  const bottom = lerpPoint(quad.bottomLeft, quad.bottomRight, u);
  return lerpPoint(top, bottom, v);
}

export function aabbToUv(box: AABB, door: AABB): AABB {
  return {
    x: door.width === 0 ? 0 : (box.x - door.x) / door.width,
    y: door.height === 0 ? 0 : (box.y - door.y) / door.height,
    width: door.width === 0 ? 0 : box.width / door.width,
    height: door.height === 0 ? 0 : box.height / door.height,
  };
}

export function projectRectToQuad(
  rect: AABB,
  door: AABB,
  quad: DoorQuad,
): [Point, Point, Point, Point] {
  const uv = aabbToUv(rect, door);
  return [
    quadMap(quad, uv.x, uv.y),
    quadMap(quad, uv.x + uv.width, uv.y),
    quadMap(quad, uv.x + uv.width, uv.y + uv.height),
    quadMap(quad, uv.x, uv.y + uv.height),
  ];
}

function clipUsableByZone(usable: AABB, zone: ForbiddenZone): AABB {
  const hit = aabbOfPoints(zone.polygon);
  if (!aabbsOverlap(usable, hit)) return usable;
  const next = { ...usable };
  switch (zone.type) {
    case "window":
      next.y = Math.max(next.y, aabbBottom(hit));
      next.height = aabbBottom(usable) - next.y;
      break;
    case "trim":
      next.height = Math.min(aabbBottom(next), hit.y) - next.y;
      break;
    case "mirror":
      next.x = Math.max(next.x, aabbRight(hit));
      next.width = aabbRight(usable) - next.x;
      break;
    case "handle":
    case "seam":
      next.width = Math.min(aabbRight(next), hit.x) - next.x;
      break;
    default:
      break;
  }
  next.width = Math.max(0, next.width);
  next.height = Math.max(0, next.height);
  return next;
}

function collidingZones(rect: AABB, zones: ForbiddenZone[]): ForbiddenZone[] {
  return zones.filter((zone) => rectHitsPolygon(rect, zone.polygon));
}

function centerRectIn(usable: AABB, width: number, height: number): AABB {
  return {
    x: usable.x + Math.max(0, usable.width - width) / 2,
    y: usable.y + Math.max(0, usable.height - height) / 2,
    width,
    height,
  };
}

function clampRectTo(usable: AABB, rect: AABB): AABB {
  const width = Math.min(rect.width, usable.width);
  const height = Math.min(rect.height, usable.height);
  const x = Math.min(
    Math.max(rect.x, usable.x),
    aabbRight(usable) - width,
  );
  const y = Math.min(
    Math.max(rect.y, usable.y),
    aabbBottom(usable) - height,
  );
  return { x, y, width, height };
}

function pushRectOffZones(
  rect: AABB,
  usable: AABB,
  zones: ForbiddenZone[],
): AABB {
  let next = { ...rect };
  for (const zone of collidingZones(next, zones)) {
    const hit = aabbOfPoints(zone.polygon);
    const cx = next.x + next.width / 2;
    const cy = next.y + next.height / 2;
    const zx = hit.x + hit.width / 2;
    const zy = hit.y + hit.height / 2;
    if (zone.type === "window" || (cy > zy && zone.type === "trim")) {
      next.y += zone.type === "window" ? aabbBottom(hit) - next.y + 0.002 : 0;
    } else if (zone.type === "trim") {
      next.y = hit.y - next.height - 0.002;
    } else if (cx < zx) {
      next.x = hit.x - next.width - 0.002;
    } else {
      next.x = aabbRight(hit) + 0.002;
    }
  }
  return clampRectTo(usable, next);
}

export function usableDoorPanel(config: TruckMockupConfig): AABB {
  const door = aabbOfQuad(config.doorZone);
  const inset = config.safeInset ?? { top: 0.06, right: 0.06, bottom: 0.06, left: 0.06 };
  let usable = insetAabb(door, inset);
  for (const zone of config.forbiddenZones ?? []) {
    usable = clipUsableByZone(usable, zone);
  }
  return usable;
}

export function fitSignToDoor(
  config: TruckMockupConfig,
  nudge: PlacementNudge = IDENTITY_NUDGE,
): DoorFit {
  const door = aabbOfQuad(config.doorZone);
  const usable = usableDoorPanel(config);
  const zones = config.forbiddenZones ?? [];
  const scalePct = config.mockupSignScale ?? 55;
  const maxWPct = config.maxSignWidthPercent ?? 92;
  const maxHPct = config.maxSignHeightPercent ?? 72;
  const occupancy = Math.min(0.96, Math.max(0.45, config.recommendedScale ?? 0.9));

  let warning: string | null = null;
  if (usable.width <= 0.01 || usable.height <= 0.01) {
    warning = "Not enough clear door for a realistic mockup.";
    const fallback = {
      x: door.x + door.width * 0.3,
      y: door.y + door.height * 0.55,
      width: door.width * 0.35,
      height: signHeightNorm(door.width * 0.35, config.imageWidthPx, config.imageHeightPx),
    };
    return {
      rect: fallback,
      usable: door,
      door,
      corners: rectCorners(fallback),
      warning,
      scaleOfDoor: fallback.width / door.width,
    };
  }

  const desired = door.width * (scalePct / 100);
  const occupancyW = usable.width * occupancy;
  const maxW = usable.width * (maxWPct / 100);
  const maxH = usable.height * (maxHPct / 100);
  let width = Math.min(desired, occupancyW, maxW, usable.width);
  let height = signHeightNorm(width, config.imageWidthPx, config.imageHeightPx);
  if (height > maxH || height > usable.height) {
    height = Math.min(maxH, usable.height);
    width = signWidthNorm(height, config.imageWidthPx, config.imageHeightPx);
  }

  const scale = Math.max(0.35, Math.min(1.45, nudge.scale || 1));
  width *= scale;
  height = signHeightNorm(width, config.imageWidthPx, config.imageHeightPx);
  if (width > usable.width) {
    width = usable.width;
    height = signHeightNorm(width, config.imageWidthPx, config.imageHeightPx);
  }
  if (height > usable.height) {
    height = usable.height;
    width = signWidthNorm(height, config.imageWidthPx, config.imageHeightPx);
  }

  let rect = centerRectIn(usable, width, height);
  rect = {
    ...rect,
    x: rect.x + nudge.dx,
    y: rect.y + nudge.dy,
  };
  rect = clampRectTo(usable, rect);

  for (let step = 0; step < 10; step++) {
    const hits = collidingZones(rect, zones);
    if (hits.length === 0) break;
    rect = pushRectOffZones(rect, usable, hits);
    if (collidingZones(rect, zones).length === 0) break;
    const shrink = 0.94;
    const nextW = rect.width * shrink;
    const nextH = signHeightNorm(nextW, config.imageWidthPx, config.imageHeightPx);
    if (nextW < usable.width * 0.28) {
      warning = "Not enough clear door for a realistic mockup.";
      break;
    }
    rect = clampRectTo(usable, centerRectIn(usable, nextW, nextH));
    rect = {
      ...rect,
      x: rect.x + nudge.dx,
      y: rect.y + nudge.dy,
    };
    rect = clampRectTo(usable, rect);
  }

  if (!warning && collidingZones(rect, zones).length > 0) {
    warning = "Not enough clear door for a realistic mockup.";
  }

  const corners = config.perspective
    ? projectRectToQuad(rect, door, config.doorZone)
    : rectCorners(rect);

  return {
    rect,
    usable,
    door,
    corners,
    warning,
    scaleOfDoor: door.width === 0 ? 0 : rect.width / door.width,
  };
}

/**
 * Other-side preview: flip the photo, then mirror overlay X in image space
 * so lettering is never mirrored.
 */
export function rectForSide(
  rect: AABB,
  side: "driver" | "other",
): AABB {
  if (side === "driver") return rect;
  return { ...rect, x: 1 - rect.x - rect.width };
}

export function cornersForSide(
  corners: [Point, Point, Point, Point],
  side: "driver" | "other",
): [Point, Point, Point, Point] {
  if (side === "driver") return corners;
  const mirrored = corners.map((p) => ({ x: 1 - p.x, y: p.y }));
  return [mirrored[1]!, mirrored[0]!, mirrored[3]!, mirrored[2]!];
}

export function overlayBoxStyle(
  rect: AABB,
  contained: ContainedImage,
  side: "driver" | "other" = "driver",
): { left: number; top: number; width: number; height: number } {
  const placed = rectForSide(rect, side);
  const origin = imagePointToContainer(placed.x, placed.y, contained);
  return {
    left: origin.x,
    top: origin.y,
    width: placed.width * contained.renderW,
    height: placed.height * contained.renderH,
  };
}

/** Homography mapping src quad → dst quad as a CSS matrix3d string. */
export function matrix3dFromQuads(
  src: [Point, Point, Point, Point],
  dst: [Point, Point, Point, Point],
): string {
  const [a, b, c, d, e, f, g, hh, i] = homography(src, dst);
  return `matrix3d(${a},${d},0,${g},${b},${e},0,${hh},0,0,1,0,${c},${f},0,${i})`;
}

function homography(
  src: [Point, Point, Point, Point],
  dst: [Point, Point, Point, Point],
): number[] {
  const aug: number[][] = [];
  for (let n = 0; n < 4; n++) {
    const { x, y } = src[n]!;
    const { x: u, y: v } = dst[n]!;
    aug.push([x, y, 1, 0, 0, 0, -u * x, -u * y, u]);
    aug.push([0, 0, 0, x, y, 1, -v * x, -v * y, v]);
  }
  for (let col = 0; col < 8; col++) {
    let pivot = col;
    for (let r = col + 1; r < 8; r++) {
      if (Math.abs(aug[r]![col]!) > Math.abs(aug[pivot]![col]!)) pivot = r;
    }
    const swap = aug[col]!;
    aug[col] = aug[pivot]!;
    aug[pivot] = swap;
    const diag = aug[col]![col]!;
    if (Math.abs(diag) < 1e-12) continue;
    for (let k = col; k < 9; k++) aug[col]![k]! /= diag;
    for (let r = 0; r < 8; r++) {
      if (r === col) continue;
      const f = aug[r]![col]!;
      for (let k = col; k < 9; k++) aug[r]![k]! -= f * aug[col]![k]!;
    }
  }
  return [...Array.from({ length: 8 }, (_, i) => aug[i]![8] ?? 0), 1];
}

export function nudgeStep(
  current: PlacementNudge,
  action: "left" | "right" | "up" | "down" | "smaller" | "larger" | "reset",
): PlacementNudge {
  if (action === "reset") return { ...IDENTITY_NUDGE };
  const d = 0.008;
  const s = 0.06;
  switch (action) {
    case "left":
      return { ...current, dx: current.dx - d };
    case "right":
      return { ...current, dx: current.dx + d };
    case "up":
      return { ...current, dy: current.dy - d };
    case "down":
      return { ...current, dy: current.dy + d };
    case "smaller":
      return { ...current, scale: Math.max(0.4, current.scale - s) };
    case "larger":
      return { ...current, scale: Math.min(1.4, current.scale + s) };
    default:
      return current;
  }
}

export function calibrationJson(config: TruckMockupConfig): string {
  return `${JSON.stringify(config, null, 2)}\n`;
}
