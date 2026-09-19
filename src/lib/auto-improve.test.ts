import assert from "node:assert/strict";
import { test } from "node:test";
import {
  autoImprove,
  hasLogoTextCollision,
  layoutInputFrom,
  suggestTemplate,
} from "./auto-improve";
import { compileDesign } from "./design/compile";
import { emptySign } from "./order";
import { applyPreset } from "./sign-style";
import { SAMPLE_MARK, SAMPLE_MARK_WIDE } from "./samples";

test("no logo suggests clean white", () => {
  assert.equal(suggestTemplate(emptySign()), "clean-white");
});

test("wide logo suggests side-by-side and square suggests spotlight", () => {
  assert.equal(
    suggestTemplate({ logoDataUrl: SAMPLE_MARK_WIDE, logoAspect: 240 / 84 }),
    "side-by-side",
  );
  assert.equal(
    suggestTemplate({ logoDataUrl: SAMPLE_MARK, logoAspect: 1 }),
    "logo-spotlight",
  );
});

test("auto improve turns a square logo into spotlight without shrinking USDOT", () => {
  const start = {
    ...emptySign(),
    companyName: "RIDGE HAULING",
    city: "Dallas",
    state: "TX",
    dotNumber: "3311999",
    mcNumber: "1051888",
    logoDataUrl: SAMPLE_MARK,
    logoAspect: 1,
    logoSize: 5,
    templateId: "clean-white" as const,
    showMc: false,
  };
  const { fields, notes } = autoImprove(start);
  assert.equal(fields.templateId, "logo-spotlight");
  assert.ok(fields.logoSize <= 5);
  assert.equal(fields.showMc, true);
  assert.ok(notes.some((note) => /spotlight|MC|logo/i.test(note)));
  const doc = compileDesign(layoutInputFrom(fields));
  assert.equal(doc.widthIn, 20);
  assert.equal(doc.heightIn, 12);
  assert.equal(hasLogoTextCollision(doc), false);
  const usdot = doc.elements.find((item) => item.type === "text" && item.role === "usdot");
  const mc = doc.elements.find((item) => item.type === "text" && item.role === "mc");
  assert.ok(usdot && usdot.type === "text" && usdot.fontSizeIn >= 1.75);
  assert.ok(mc && mc.type === "text" && mc.fontSizeIn >= 1.55);
});

test("auto improve sends a wide logo to side-by-side", () => {
  const start = {
    ...emptySign(),
    companyName: "WESTERN LINE TRANSPORT",
    dotNumber: "91244018",
    mcNumber: "441902",
    logoDataUrl: SAMPLE_MARK_WIDE,
    logoAspect: 240 / 84,
    templateId: "clean-white" as const,
  };
  const { fields } = autoImprove(start);
  assert.equal(fields.templateId, "side-by-side");
  const doc = compileDesign(layoutInputFrom(fields));
  assert.equal(doc.widthIn, 20);
  assert.equal(doc.heightIn, 12);
  const usdot = doc.elements.find(
    (item) => item.type === "text" && item.role === "usdot",
  );
  assert.ok(usdot);
  assert.ok(usdot!.yIn + usdot!.heightIn <= 12.08);
});

test("low-contrast colors snap back to white vinyl black lettering", () => {
  const start = {
    ...emptySign(),
    companyName: "RIDGE",
    dotNumber: "1234567",
    mcNumber: "123456",
    colors: {
      ...emptySign().colors,
      face: "#f4f4f4",
      name: "#e8e8e8",
      legal: "#dedede",
      plate: "#f4f4f4",
      plateText: "#eeeeee",
    },
    paletteId: "custom",
  };
  const { fields, notes } = autoImprove(start);
  assert.equal(fields.paletteId, "white-black");
  assert.equal(fields.colors.face, "#ffffff");
  assert.equal(fields.colors.name, "#111111");
  assert.ok(notes.some((note) => /contrast/i.test(note)));
});

test("auto improve does not rewrite a ready white door", () => {
  const style = applyPreset("white-black");
  const start = {
    ...emptySign(),
    ...style,
    companyName: "RIDGE",
    dotNumber: "1234567",
    mcNumber: "123456",
    templateId: "clean-white" as const,
    nameFont: "condensed" as const,
    logoSize: 4,
  };
  const { fields, notes } = autoImprove(start);
  assert.equal(fields.templateId, "clean-white");
  assert.equal(fields.paletteId, "white-black");
  assert.equal(notes.length, 1);
  assert.match(notes[0], /print-ready/);
});
