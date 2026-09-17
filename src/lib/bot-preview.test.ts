import assert from "node:assert/strict";
import { test } from "node:test";
import { COPY } from "../../bot/i18n";
import { VINYL } from "./vinyl-spec";
import {
  BOT_PREVIEW_SIZE_LINE,
  BOT_PREVIEW_VIEWPORT,
  botPreviewContain,
  botPreviewSignBox,
  vinylFitsInPreviewFrame,
} from "./bot-preview";
import { SIGN_ASPECT } from "./truck-mockups";

const LEGACY_CROP_VIEWPORT = { width: 1340, height: 828 };

test("bot preview viewport matches the cab photo, not a landscape crop", () => {
  assert.equal(BOT_PREVIEW_VIEWPORT.width / BOT_PREVIEW_VIEWPORT.height, 520 / 560);
  assert.ok(BOT_PREVIEW_VIEWPORT.height > BOT_PREVIEW_VIEWPORT.width);
  assert.notEqual(
    BOT_PREVIEW_VIEWPORT.width / BOT_PREVIEW_VIEWPORT.height,
    LEGACY_CROP_VIEWPORT.width / LEGACY_CROP_VIEWPORT.height,
  );
});

test("contain mapping keeps the 20x12 fully inside a landscape Telegram frame", () => {
  assert.equal(
    vinylFitsInPreviewFrame(LEGACY_CROP_VIEWPORT.width, LEGACY_CROP_VIEWPORT.height),
    true,
  );
  const { contained, box } = botPreviewSignBox(
    LEGACY_CROP_VIEWPORT.width,
    LEGACY_CROP_VIEWPORT.height,
  );
  assert.ok(contained.offsetY === 0);
  assert.ok(contained.offsetX > 0);
  assert.ok(box.top + box.height < LEGACY_CROP_VIEWPORT.height);
  assert.ok(Math.abs(box.width / box.height - SIGN_ASPECT) < 0.001);
});

test("full-cab viewport keeps the vinyl off the bottom edge", () => {
  assert.equal(
    vinylFitsInPreviewFrame(BOT_PREVIEW_VIEWPORT.width, BOT_PREVIEW_VIEWPORT.height),
    true,
  );
  const { contained, box } = botPreviewSignBox(
    BOT_PREVIEW_VIEWPORT.width,
    BOT_PREVIEW_VIEWPORT.height,
  );
  assert.equal(contained.offsetX, 0);
  assert.equal(contained.offsetY, 0);
  assert.ok(box.top > BOT_PREVIEW_VIEWPORT.height * 0.45);
  assert.ok(box.top + box.height < BOT_PREVIEW_VIEWPORT.height - 8);
});

test("stretch-to-width landscape crop is the regression (vinyl clipped)", () => {
  const stretched = botPreviewContain(
    LEGACY_CROP_VIEWPORT.width,
    (LEGACY_CROP_VIEWPORT.width * 560) / 520,
  );
  const { box } = botPreviewSignBox(stretched.renderW, stretched.renderH);
  assert.ok(
    box.top + box.height > LEGACY_CROP_VIEWPORT.height,
    "old 1340x828 viewport cut the sign at the bottom",
  );
});

test("confirm copy is 20 x 12, never 20-24 x 10-12", () => {
  assert.ok(COPY.en.confirmBody.includes("20 × 12"));
  assert.ok(COPY.en.confirmBody.startsWith(BOT_PREVIEW_SIZE_LINE));
  assert.equal(BOT_PREVIEW_SIZE_LINE, `Size: ${VINYL.size} each cab side (left + right)`);
  for (const copy of Object.values(COPY)) {
    assert.doesNotMatch(copy.confirmBody, /20\s*[–-]\s*24/);
    assert.doesNotMatch(copy.confirmBody, /10\s*[–-]\s*12/);
    assert.doesNotMatch(copy.confirmTitle, /20\s*[–-]\s*24/);
  }
});
