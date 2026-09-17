import assert from "node:assert/strict";
import { test } from "node:test";
import {
  DRIVER_SAMPLES,
  GALLERY_SAMPLES,
  filterCatalog,
  sampleById,
  sampleCategory,
  sampleHasLogo,
  sampleProductType,
  sampleTone,
} from "./samples";

test("gallery has unique ids and one card per layout", () => {
  const ids = GALLERY_SAMPLES.map((sample) => sample.id);
  assert.equal(new Set(ids).size, ids.length);
  const layouts = DRIVER_SAMPLES.map((sample) => sample.fields.templateId);
  assert.equal(new Set(layouts).size, layouts.length);
  assert.equal(layouts.length, 5);
});

test("categories cover the five layouts plus upload", () => {
  assert.equal(sampleCategory(sampleById("clean-white")!), "white-minimal");
  assert.equal(sampleCategory(sampleById("logo-spotlight")!), "logo-focused");
  assert.equal(sampleCategory(sampleById("side-by-side")!), "logo-focused");
  assert.equal(sampleCategory(sampleById("direct-truck")!), "classic-lettering");
  assert.equal(sampleCategory(sampleById("classic-plaque")!), "premium-plaque");
  assert.equal(sampleCategory(sampleById("blank")!), "upload");
});

test("filters split white, dark, and logo without duplicates", () => {
  const white = filterCatalog(GALLERY_SAMPLES, "all", "white");
  const dark = filterCatalog(GALLERY_SAMPLES, "all", "dark");
  assert.ok(white.length >= 3);
  assert.ok(dark.length >= 1);
  assert.ok(white.every((sample) => sampleTone(sample) === "white"));
  assert.ok(dark.every((sample) => sampleTone(sample) === "dark"));
  const logos = filterCatalog(GALLERY_SAMPLES, "all", "with-logo");
  assert.ok(logos.every(sampleHasLogo));
  assert.equal(logos.length, 2);
  const none = filterCatalog(GALLERY_SAMPLES, "logo-focused", "no-logo");
  assert.equal(none.length, 0);
  const plaques = filterCatalog(GALLERY_SAMPLES, "premium-plaque", "all");
  assert.equal(plaques.length, 1);
  assert.equal(sampleProductType(plaques[0]), "Printed plaque");
});
