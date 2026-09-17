import assert from "node:assert/strict";
import { test } from "node:test";
import { compileDesign, templatesDiffer } from "./compile";
import { logoScaleFromSize } from "./logo";
import { CANVAS_HEIGHT_IN, CANVAS_WIDTH_IN } from "./schema";
import { defaultStyle } from "../sign-style";

const colors = defaultStyle().colors;

function base(over: Partial<Parameters<typeof compileDesign>[0]> = {}) {
  return compileDesign({
    companyName: "HIGHWAY FREIGHT",
    city: "Dallas",
    state: "TX",
    dotNumber: "1234567",
    mcNumber: "123456",
    logoDataUrl: "data:image/png;base64,aaa",
    logoSize: 4,
    nameFont: "condensed",
    templateId: "premium-plaque",
    showChevrons: false,
    showMc: true,
    colors,
    ...over,
  });
}

test("canvas is always 20 by 12 inches", () => {
  const doc = base();
  assert.equal(doc.widthIn, 20);
  assert.equal(doc.heightIn, 12);
  assert.equal(CANVAS_WIDTH_IN, 20);
  assert.equal(CANVAS_HEIGHT_IN, 12);
});

test("logo size changes the logo element", () => {
  const small = base({ logoSize: 1 });
  const large = base({ logoSize: 5 });
  const s = small.elements.find((el) => el.type === "logo");
  const l = large.elements.find((el) => el.type === "logo");
  assert.ok(s && l);
  const smallArea = s.widthIn * s.heightIn;
  const largeArea = l.widthIn * l.heightIn;
  assert.ok(largeArea > smallArea * 1.4);
  assert.ok(logoScaleFromSize(5) > logoScaleFromSize(1));
});

test("serif and condensed produce different font ids", () => {
  const condensed = base({ nameFont: "condensed" });
  const serif = base({ nameFont: "serif" });
  const sans = base({ nameFont: "sans" });
  const fontOf = (doc: typeof condensed) => {
    const el = doc.elements.find((item) => item.type === "text" && item.role === "company");
    return el && el.type === "text" ? el.font : undefined;
  };
  assert.equal(fontOf(condensed), "condensed");
  assert.equal(fontOf(serif), "serif");
  assert.equal(fontOf(sans), "sans");
});

test("chevrons render only when requested", () => {
  const off = base({ showChevrons: false });
  const on = base({ showChevrons: true });
  assert.equal(
    off.elements.filter((el) => el.type === "chevron").length,
    0,
  );
  assert.equal(
    on.elements.filter((el) => el.type === "chevron").length,
    2,
  );
});

test("templates are genuinely different compositions", () => {
  const plaque = base({ templateId: "premium-plaque" });
  const side = base({ templateId: "side-by-side" });
  const spotlight = base({ templateId: "logo-spotlight" });
  const classic = base({ templateId: "classic" });
  const minimal = base({ templateId: "minimal" });
  assert.ok(templatesDiffer(plaque, side));
  assert.ok(templatesDiffer(plaque, spotlight));
  assert.ok(templatesDiffer(classic, minimal));
  const logoSpot = spotlight.elements.find((el) => el.type === "logo");
  const logoClassic = classic.elements.find((el) => el.type === "logo");
  assert.ok(logoSpot && logoClassic);
  assert.ok(logoSpot.heightIn > logoClassic.heightIn);
});

test("long names wrap instead of using a single unreadable line", () => {
  const doc = base({
    companyName: "AMERICAN CONTINENTAL FREIGHTLINES EXPRESS",
  });
  const names = doc.elements.filter(
    (el) => el.type === "text" && el.role === "company",
  );
  assert.ok(names.length >= 2);
  for (const line of names) {
    if (line.type === "text") assert.ok(line.fontSizeIn >= 0.8);
  }
});

test("logo is never stretched by layout boxes using contain semantics", () => {
  const wide = base({ logoAspect: 3 });
  const tall = base({ logoAspect: 0.4 });
  const wideLogo = wide.elements.find((el) => el.type === "logo");
  const tallLogo = tall.elements.find((el) => el.type === "logo");
  assert.ok(wideLogo && tallLogo);
  assert.ok(wideLogo.widthIn / wideLogo.heightIn > 1.3);
  assert.ok(tallLogo.heightIn / tallLogo.widthIn > 1.1);
});
