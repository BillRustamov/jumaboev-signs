import assert from "node:assert/strict";
import { test } from "node:test";
import { CAB_DOOR, CAB_PHOTO, doorOverlayStyle } from "./cab-mockup";
import { fitSignToDoor, WHITE_CASCADIA_DRIVER } from "./truck-mockups";

test("door overlay stays 20 by 12 inches", () => {
  const box = doorOverlayStyle();
  const w = (Number.parseFloat(box.width) / 100) * CAB_PHOTO.widthPx;
  const h = (Number.parseFloat(box.height) / 100) * CAB_PHOTO.heightPx;
  assert.ok(Math.abs(w / h - 20 / 12) < 0.001, `ratio ${w / h}`);
  assert.ok(CAB_DOOR.widthPct > 14);
  assert.ok(CAB_DOOR.leftPct > 23);
  assert.ok(CAB_DOOR.topPct > 50);
  assert.ok(CAB_DOOR.leftPct + CAB_DOOR.widthPct < 42);
});

test("cab overlay percents come from the calibrated door zone", () => {
  const fit = fitSignToDoor(WHITE_CASCADIA_DRIVER);
  assert.ok(Math.abs(CAB_DOOR.leftPct - fit.rect.x * 100) < 1e-6);
  assert.ok(Math.abs(CAB_DOOR.topPct - fit.rect.y * 100) < 1e-6);
});
