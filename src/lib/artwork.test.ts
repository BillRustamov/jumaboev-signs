import assert from "node:assert/strict";
import { test } from "node:test";
import {
  artworkPlacement,
  aspectOf,
  defaultArtwork,
  existingSignSlot,
  isRasterDataUrl,
  resolveArtworkFit,
  suggestArtworkRole,
} from "./artwork";
import { CANVAS_HEIGHT_IN, CANVAS_WIDTH_IN } from "./design/schema";

const SLOT = existingSignSlot();
const FOUR_BY_THREE = 4 / 3;

function place(fit: Parameters<typeof artworkPlacement>[0]["fit"], aspect = FOUR_BY_THREE) {
  return artworkPlacement({ ...SLOT, aspect, fit, offsetX: 0, offsetY: 0 });
}

test("default artwork is contain, not crop", () => {
  const art = defaultArtwork();
  assert.equal(art.artworkFit, "contain");
  assert.equal(art.artworkRole, "none");
  assert.equal(art.originalArtworkUrl, "");
  assert.equal(resolveArtworkFit("nope"), "contain");
});

test("wide door photos suggest existing-sign; square marks suggest logo", () => {
  assert.equal(suggestArtworkRole(20 / 12), "existing-sign");
  assert.equal(suggestArtworkRole(4 / 3), "existing-sign");
  assert.equal(suggestArtworkRole(1), "logo");
  assert.equal(suggestArtworkRole(0.5), "logo");
});

test("contain and keep-aspect never crop and never stretch a 4:3 file", () => {
  for (const fit of ["contain", "original", "margins"] as const) {
    const box = place(fit);
    assert.equal(box.cropped, false);
    assert.ok(Math.abs(aspectOf(box) - FOUR_BY_THREE) < 1e-6);
    assert.ok(box.imageX >= box.clipX - 1e-6);
    assert.ok(box.imageY >= box.clipY - 1e-6);
    assert.ok(box.imageX + box.imageW <= box.clipX + box.clipW + 1e-6);
    assert.ok(box.imageY + box.imageH <= box.clipY + box.clipH + 1e-6);
  }
});

test("crop to fill covers the 20x12 slot and is the only cropped mode", () => {
  const cover = place("cover");
  assert.equal(cover.cropped, true);
  assert.ok(cover.imageW + 1e-6 >= cover.clipW);
  assert.ok(cover.imageH + 1e-6 >= cover.clipH);
  assert.ok(Math.abs(aspectOf(cover) - FOUR_BY_THREE) < 1e-6);
  assert.equal(place("contain").cropped, false);
});

test("add margins is a smaller contain", () => {
  const fit = place("contain");
  const padded = place("margins");
  assert.ok(padded.imageW < fit.imageW);
  assert.ok(padded.imageH < fit.imageH);
  assert.equal(padded.cropped, false);
});

test("keep aspect ignores pan so it cannot crop", () => {
  const centered = artworkPlacement({
    ...SLOT,
    aspect: FOUR_BY_THREE,
    fit: "original",
    offsetX: 1,
    offsetY: 1,
  });
  const nudged = artworkPlacement({
    ...SLOT,
    aspect: FOUR_BY_THREE,
    fit: "contain",
    offsetX: 1,
    offsetY: 1,
  });
  assert.equal(centered.imageX, place("original").imageX);
  assert.notEqual(nudged.imageX, place("contain").imageX);
});

test("placement stays on the 20 by 12 board", () => {
  const box = place("contain");
  assert.ok(box.clipX + box.clipW <= CANVAS_WIDTH_IN);
  assert.ok(box.clipY + box.clipH <= CANVAS_HEIGHT_IN);
});

test("flattened raster urls are detected; svg is not", () => {
  assert.equal(isRasterDataUrl("data:image/png;base64,aaa"), true);
  assert.equal(isRasterDataUrl("data:image/jpeg;base64,aaa"), true);
  assert.equal(isRasterDataUrl("data:image/svg+xml;utf8,<svg/>"), false);
});
