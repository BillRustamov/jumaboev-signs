import assert from "node:assert/strict";
import { test } from "node:test";
import {
  LANGS,
  SHOP_ENTRY,
  shopT,
  type ShopEntryKey,
} from "./shop-entry";

const REQUIRED: ShopEntryKey[] = [
  "howCanWeHelp",
  "printExisting",
  "createDesign",
  "myOrders",
  "contactShop",
  "language",
  "helpMenu",
  "printOnlyAsk",
  "printOnlyPlaced",
];

test("every shop language has two-service entry copy", () => {
  for (const lang of LANGS) {
    for (const key of REQUIRED) {
      assert.ok(SHOP_ENTRY[lang][key].length > 0, `${lang}.${key}`);
    }
    assert.doesNotMatch(SHOP_ENTRY[lang].helpMenu, /\/start/);
    assert.doesNotMatch(SHOP_ENTRY[lang].lead, /\/start/);
  }
});

test("shopT interpolates ticket ids", () => {
  const text = shopT("en", "printOnlyPlaced", { id: "JS-123456" });
  assert.match(text, /JS-123456/);
  assert.doesNotMatch(text, /\{id\}/);
});
