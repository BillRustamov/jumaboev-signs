import assert from "node:assert/strict";
import { test } from "node:test";
import { LANGS } from "./shop-entry";
import { UI, uiT, type UiKey } from "./shop-copy";
import { sampleName, localizeNote } from "./shop-labels";

const REQUIRED: UiKey[] = [
  "pickLookTitle",
  "printTicket",
  "tapSample",
  "liveVinyl",
  "inUse",
  "samplesTitle",
  "customizeThis",
  "cartEmpty",
  "checkoutTitle",
  "adminKicker",
];

test("every shop language has website body copy", () => {
  for (const lang of LANGS) {
    for (const key of REQUIRED) {
      assert.ok(UI[lang][key].length > 0, `${lang}.${key}`);
    }
  }
});

test("Uzbek print-desk strings are not English", () => {
  assert.notEqual(uiT("uz", "pickLookTitle"), uiT("en", "pickLookTitle"));
  assert.notEqual(uiT("uz", "printTicket"), "Print ticket");
  assert.notEqual(uiT("uz", "tapSample"), "Tap a sample");
  assert.match(uiT("uz", "pickLookTitle"), /chipta|Ko‘rinish/i);
});

test("Russian sample names follow locale", () => {
  assert.equal(sampleName("ru", "clean-white"), "Чистый белый");
  assert.equal(sampleName("uz", "blank"), "Bo‘sh eshik");
});

test("uiT interpolates ticket fields", () => {
  const text = uiT("en", "pairInCartLead", { name: "ELBRUS", dot: "123456" });
  assert.match(text, /ELBRUS/);
  assert.match(text, /123456/);
  assert.doesNotMatch(text, /\{name\}|\{dot\}/);
});

test("localizeNote maps validation English", () => {
  const note = localizeNote(
    "uz",
    "USDOT number should be 4–12 digits.",
  );
  assert.notEqual(note, "USDOT number should be 4–12 digits.");
  assert.match(note, /USDOT/);
});
