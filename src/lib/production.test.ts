import assert from "node:assert/strict";
import { test } from "node:test";
import { VINYL } from "./vinyl-spec";
import { CANVAS_HEIGHT_IN, CANVAS_WIDTH_IN } from "./design/schema";
import { compileDesign } from "./design/compile";
import { defaultStyle } from "./sign-style";
import { CAB_DOOR, doorOverlayStyle } from "./cab-mockup";

test("customer vinyl is 20 by 12 inches, never 20 by 10 or 24 by 24", () => {
  assert.equal(VINYL.printWIn, 20);
  assert.equal(VINYL.printHIn, 12);
  assert.equal(CANVAS_WIDTH_IN, 20);
  assert.equal(CANVAS_HEIGHT_IN, 12);
  assert.equal(VINYL.size, "20 × 12 in");
  assert.notEqual(VINYL.printHIn, 10);
  assert.notEqual(VINYL.printWIn, 24);
  assert.doesNotMatch(VINYL.size, /24\s*[×x]\s*24/);
  assert.doesNotMatch(VINYL.printSize, /20\s*[×x]\s*10/);
});

test("print pair is two 20x12 doors on a 24 in roll", () => {
  assert.equal(VINYL.sheetIn, 24);
  assert.ok(VINYL.sheetLengthIn >= 12 * 2 + 1);
  const left = (VINYL.sheetIn - VINYL.printWIn) / 2;
  assert.ok(left > 0);
  assert.ok(left + VINYL.printWIn <= VINYL.sheetIn);
});

test("compiled production art matches the 20x12 canvas", () => {
  const colors = defaultStyle().colors;
  const doc = compileDesign({
    companyName: "RIDGE HAULING",
    city: "Dallas",
    state: "TX",
    dotNumber: "3311999",
    mcNumber: "1051888",
    colors,
  });
  assert.equal(doc.widthIn, 20);
  assert.equal(doc.heightIn, 12);
  const usdot = doc.elements.find((el) => el.type === "text" && el.role === "usdot");
  assert.ok(usdot);
  assert.ok(usdot!.yIn + usdot!.heightIn <= 12.08);
});

test("truck overlay keeps a 5:3 vinyl on the door", () => {
  const style = doorOverlayStyle(CAB_DOOR);
  const w = (Number.parseFloat(style.width) / 100) * 520;
  const h = (Number.parseFloat(style.height) / 100) * 560;
  assert.ok(Math.abs(w / h - 20 / 12) < 0.001, `ratio ${w / h}`);
});
