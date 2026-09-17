import assert from "node:assert/strict";
import { test } from "node:test";
import {
  WHITE_CASCADIA_DRIVER,
  aabbBottom,
  aabbOfQuad,
  aabbRight,
  containedImageRect,
  cornersForSide,
  fitSignToDoor,
  imagePointToContainer,
  matrix3dFromQuads,
  nudgeStep,
  overlayBoxStyle,
  rectCorners,
  rectForSide,
  rectHitsPolygon,
  SIGN_ASPECT,
  signHeightNorm,
  usableDoorPanel,
} from "./truck-mockups";

const OLD_BAD = { x: 0.23, y: 0.432, width: 0.174 };

test("fitted vinyl keeps a 20 by 12 (5:3) pixel ratio", () => {
  const fit = fitSignToDoor(WHITE_CASCADIA_DRIVER);
  const pxW = fit.rect.width * WHITE_CASCADIA_DRIVER.imageWidthPx;
  const pxH = fit.rect.height * WHITE_CASCADIA_DRIVER.imageHeightPx;
  assert.ok(Math.abs(pxW / pxH - SIGN_ASPECT) < 0.001, `ratio ${pxW / pxH}`);
});

test("sign sits in the usable door panel, not the window or mirror", () => {
  const fit = fitSignToDoor(WHITE_CASCADIA_DRIVER);
  const door = aabbOfQuad(WHITE_CASCADIA_DRIVER.doorZone);
  assert.ok(fit.rect.x >= fit.usable.x - 1e-6);
  assert.ok(aabbRight(fit.rect) <= aabbRight(fit.usable) + 1e-6);
  assert.ok(fit.rect.y >= fit.usable.y - 1e-6);
  assert.ok(aabbBottom(fit.rect) <= aabbBottom(fit.usable) + 1e-6);
  assert.ok(fit.rect.x >= door.x);
  assert.ok(aabbRight(fit.rect) <= aabbRight(door));
  assert.ok(fit.warning === null, fit.warning ?? "");
});

test("sign does not overlap window, mirror, handle, seam, or trim", () => {
  const fit = fitSignToDoor(WHITE_CASCADIA_DRIVER);
  for (const zone of WHITE_CASCADIA_DRIVER.forbiddenZones ?? []) {
    assert.equal(
      rectHitsPolygon(fit.rect, zone.polygon),
      false,
      `overlaps ${zone.type}`,
    );
  }
});

test("recommended placement is right and down of the high-forward regression", () => {
  const fit = fitSignToDoor(WHITE_CASCADIA_DRIVER);
  assert.ok(
    fit.rect.x > OLD_BAD.x + 0.02,
    `expected right of ${OLD_BAD.x}, got ${fit.rect.x}`,
  );
  assert.ok(
    fit.rect.y > OLD_BAD.y + 0.06,
    `expected down from ${OLD_BAD.y}, got ${fit.rect.y}`,
  );
  assert.ok(fit.rect.y > 0.49, "must sit below the window glass");
  assert.ok(fit.rect.x > 0.24, "must sit right of the mirror support");
  assert.ok(aabbRight(fit.rect) < 0.41, "must sit left of the handle");
  assert.ok(aabbBottom(fit.rect) < 0.67, "must sit above the chrome belt");
});

test("sign is a realistic fraction of the usable door, not the whole photo", () => {
  const fit = fitSignToDoor(WHITE_CASCADIA_DRIVER);
  const ofUsable = fit.rect.width / fit.usable.width;
  const ofImage = fit.rect.width;
  assert.ok(ofUsable >= 0.44 && ofUsable <= 0.67, `usable fraction ${ofUsable}`);
  assert.ok(ofImage < 0.22, `must not be % of the whole photo (${ofImage})`);
  assert.ok(fit.scaleOfDoor >= 0.3 && fit.scaleOfDoor <= 0.65);
});

test("object-fit contain mapping letterboxes a wide container", () => {
  const box = containedImageRect(1000, 400, 520, 560);
  assert.ok(box.renderH === 400);
  assert.ok(Math.abs(box.renderW - (400 * 520) / 560) < 0.01);
  assert.ok(box.offsetX > 100);
  assert.ok(Math.abs(box.offsetY) < 1e-6);
  const p = imagePointToContainer(0, 0, box);
  assert.ok(Math.abs(p.x - box.offsetX) < 1e-6);
  assert.ok(Math.abs(p.y) < 1e-6);
});

test("object-fit contain mapping letterboxes a tall container", () => {
  const box = containedImageRect(300, 900, 520, 560);
  assert.ok(box.renderW === 300);
  assert.ok(box.offsetY > 200);
  assert.ok(Math.abs(box.offsetX) < 1e-6);
});

test("overlay pixel box tracks the rendered image, not the outer container", () => {
  const fit = fitSignToDoor(WHITE_CASCADIA_DRIVER);
  const wide = containedImageRect(1200, 500, 520, 560);
  const tall = containedImageRect(360, 900, 520, 560);
  const a = overlayBoxStyle(fit.rect, wide);
  const b = overlayBoxStyle(fit.rect, tall);
  const nxA = (a.left - wide.offsetX) / wide.renderW;
  const nxB = (b.left - tall.offsetX) / tall.renderW;
  const nyA = (a.top - wide.offsetY) / wide.renderH;
  const nyB = (b.top - tall.offsetY) / tall.renderH;
  assert.ok(Math.abs(nxA - nxB) < 1e-9);
  assert.ok(Math.abs(nyA - nyB) < 1e-9);
  assert.ok(Math.abs(nxA - fit.rect.x) < 1e-9);
  assert.ok(Math.abs(a.width / a.height - SIGN_ASPECT) < 0.001);
  assert.ok(Math.abs(b.width / b.height - SIGN_ASPECT) < 0.001);
});

test("normalized placement does not drift across desktop, tablet, and phone boxes", () => {
  const fit = fitSignToDoor(WHITE_CASCADIA_DRIVER);
  const viewports = [
    [1440, 900],
    [1024, 768],
    [768, 1024],
    [390, 844],
  ] as const;
  for (const [w, h] of viewports) {
    const contained = containedImageRect(w, h, 520, 560);
    const box = overlayBoxStyle(fit.rect, contained);
    const nx = (box.left - contained.offsetX) / contained.renderW;
    const ny = (box.top - contained.offsetY) / contained.renderH;
    assert.ok(Math.abs(nx - fit.rect.x) < 1e-9, `${w}x${h} x drift`);
    assert.ok(Math.abs(ny - fit.rect.y) < 1e-9, `${w}x${h} y drift`);
  }
});

test("other-side mirrors overlay X but keeps the same size and y", () => {
  const fit = fitSignToDoor(WHITE_CASCADIA_DRIVER);
  const other = rectForSide(fit.rect, "other");
  assert.ok(Math.abs(other.x - (1 - fit.rect.x - fit.rect.width)) < 1e-9);
  assert.equal(other.y, fit.rect.y);
  assert.equal(other.width, fit.rect.width);
  assert.equal(other.height, fit.rect.height);
  const corners = cornersForSide(fit.corners, "other");
  assert.ok(Math.abs(corners[0]!.x - (1 - fit.corners[1]!.x)) < 1e-9);
});

test("manual nudge stays inside the usable panel and keeps 5:3", () => {
  const far = fitSignToDoor(WHITE_CASCADIA_DRIVER, {
    dx: 0.4,
    dy: -0.4,
    scale: 1.8,
  });
  assert.ok(far.rect.x >= far.usable.x - 1e-6);
  assert.ok(aabbRight(far.rect) <= aabbRight(far.usable) + 1e-6);
  assert.ok(far.rect.y >= far.usable.y - 1e-6);
  assert.ok(aabbBottom(far.rect) <= aabbBottom(far.usable) + 1e-6);
  const pxW = far.rect.width * WHITE_CASCADIA_DRIVER.imageWidthPx;
  const pxH = far.rect.height * WHITE_CASCADIA_DRIVER.imageHeightPx;
  assert.ok(Math.abs(pxW / pxH - SIGN_ASPECT) < 0.001);
  const reset = nudgeStep(far.rect && { dx: 0.1, dy: 0.1, scale: 1.2 }, "reset");
  assert.deepEqual(reset, { dx: 0, dy: 0, scale: 1 });
});

test("each truck mockup has its own door zone, not a shared pixel box", () => {
  assert.equal(WHITE_CASCADIA_DRIVER.id, "white-cascadia-driver");
  assert.ok(WHITE_CASCADIA_DRIVER.image.endsWith("white-cab-door.jpg"));
  const door = aabbOfQuad(WHITE_CASCADIA_DRIVER.doorZone);
  assert.ok(door.width < 0.4, "door is a slice of the photo, not the frame");
  const usable = usableDoorPanel(WHITE_CASCADIA_DRIVER);
  assert.ok(usable.y > door.y, "usable panel is below the window");
});

test("signHeightNorm matches 20x12 in image pixels", () => {
  const h = signHeightNorm(0.2, 520, 560);
  const pxW = 0.2 * 520;
  const pxH = h * 560;
  assert.ok(Math.abs(pxW / pxH - 20 / 12) < 1e-9);
});

test("homography maps a rectangle onto destination corners", () => {
  const src = rectCorners({ x: 0, y: 0, width: 100, height: 60 });
  const dst: typeof src = [
    { x: 10, y: 20 },
    { x: 110, y: 24 },
    { x: 108, y: 84 },
    { x: 12, y: 80 },
  ];
  const css = matrix3dFromQuads(src, dst);
  assert.match(css, /^matrix3d\(/);
});
