import assert from "node:assert/strict";
import { test } from "node:test";
import { CAB_DOOR, CAB_PHOTO, doorOverlayStyle } from "./cab-mockup";

test("door overlay stays 20 by 12 inches", () => {
  const box = doorOverlayStyle();
  const w = (Number.parseFloat(box.width) / 100) * CAB_PHOTO.widthPx;
  const h = (Number.parseFloat(box.height) / 100) * CAB_PHOTO.heightPx;
  assert.ok(Math.abs(w / h - 20 / 12) < 0.001, `ratio ${w / h}`);
  assert.ok(CAB_DOOR.widthPct > 10);
  assert.ok(CAB_DOOR.leftPct > 15);
  assert.ok(CAB_DOOR.leftPct + CAB_DOOR.widthPct < 55);
});
