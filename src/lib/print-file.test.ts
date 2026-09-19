import assert from "node:assert/strict";
import { test } from "node:test";
import {
  canPreviewAsImage,
  isPrintFile,
  printFileFromDataUrl,
  resolvePrintMime,
  telegramPrintUsername,
} from "./print-file";

test("accepts print documents and rejects random types", () => {
  assert.equal(isPrintFile("application/pdf", "door.pdf"), true);
  assert.equal(isPrintFile("image/svg+xml", "mark.svg"), true);
  assert.equal(isPrintFile("image/png", "door.png"), true);
  assert.equal(isPrintFile("application/zip", "door.zip"), false);
  assert.equal(resolvePrintMime(undefined, "pair.webp"), "image/webp");
});

test("never treats SVG or PDF as live image previews", () => {
  assert.equal(canPreviewAsImage("image/png"), true);
  assert.equal(canPreviewAsImage("image/svg+xml"), false);
  assert.equal(canPreviewAsImage("application/pdf"), false);
});

test("telegram print username stays in the shop username alphabet", () => {
  assert.equal(telegramPrintUsername(8846092422), "tg8846092422");
  assert.match(telegramPrintUsername(-100123), /^tg[a-zA-Z0-9_]{2,23}$/);
});

test("data URL parser reads mime and size", () => {
  const parsed = printFileFromDataUrl("data:image/png;base64,QQ==");
  assert.ok(parsed);
  assert.equal(parsed?.mime, "image/png");
  assert.ok((parsed?.bytes ?? 0) > 0);
});
