import assert from "node:assert/strict";
import { test } from "node:test";
import { compileDesign, templatesDiffer } from "./compile";
import { logoScaleFromSize } from "./logo";
import { CANVAS_HEIGHT_IN, CANVAS_WIDTH_IN } from "./schema";
import { resolveTemplate } from "./migrate";
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
    templateId: "clean-white",
    showChevrons: false,
    showMc: true,
    colors,
    ...over,
  });
}

function bottom(doc: ReturnType<typeof compileDesign>): number {
  return Math.max(...doc.elements.map((el) => el.yIn + el.heightIn), 0);
}

function companySize(doc: ReturnType<typeof compileDesign>): number {
  const el = doc.elements.find((item) => item.type === "text" && item.role === "company");
  return el && el.type === "text" ? el.fontSizeIn : 0;
}

function lineSize(
  doc: ReturnType<typeof compileDesign>,
  role: "usdot" | "mc",
): number {
  const el = doc.elements.find((item) => item.type === "text" && item.role === role);
  return el && el.type === "text" ? el.fontSizeIn : 0;
}

test("canvas is always 20 by 12 inches", () => {
  const doc = base();
  assert.equal(doc.widthIn, 20);
  assert.equal(doc.heightIn, 12);
  assert.equal(CANVAS_WIDTH_IN, 20);
  assert.equal(CANVAS_HEIGHT_IN, 12);
});

test("default style is white vinyl with black lettering", () => {
  const style = defaultStyle();
  assert.equal(style.paletteId, "white-black");
  assert.equal(style.templateId, "clean-white");
  assert.equal(style.colors.face, "#ffffff");
  assert.equal(style.colors.name, "#111111");
});

test("legacy template ids still resolve", () => {
  assert.equal(resolveTemplate("premium-plaque"), "classic-plaque");
  assert.equal(resolveTemplate("classic"), "clean-white");
  assert.equal(resolveTemplate("minimal"), "direct-truck");
  assert.equal(resolveTemplate("clean-white"), "clean-white");
});

test("short names use two-inch-plus lettering on clean white", () => {
  const doc = base({
    companyName: "RIDGE",
    logoDataUrl: "",
    templateId: "clean-white",
  });
  assert.ok(companySize(doc) >= 2.2, `name ${companySize(doc)}`);
  assert.ok(lineSize(doc, "usdot") >= 1.7, `usdot ${lineSize(doc, "usdot")}`);
  assert.ok(lineSize(doc, "mc") >= 1.5, `mc ${lineSize(doc, "mc")}`);
  assert.ok(bottom(doc) > 10, `bottom ${bottom(doc)}`);
});

test("clean white has no ghost logo when none is uploaded", () => {
  const doc = base({ logoDataUrl: "", templateId: "clean-white" });
  assert.equal(
    doc.elements.filter((el) => el.type === "text" && el.role === "ghost-logo").length,
    0,
  );
});

test("classic plaque uses ID bands and fills the board", () => {
  const doc = base({ templateId: "classic-plaque", logoDataUrl: "" });
  const bands = doc.elements.filter((el) => el.type === "band");
  assert.equal(bands.length, 2);
  assert.equal(doc.production, "printed-plaque");
  assert.ok(bottom(doc) > 10.5, `bottom ${bottom(doc)}`);
  assert.ok(companySize(doc) >= 1.8);
});

test("direct truck is cut lettering with no filled face", () => {
  const doc = base({ templateId: "direct-truck" });
  assert.equal(doc.background.fill, "none");
  assert.equal(doc.production, "cut-lettering");
  assert.equal(doc.background.borderIn, 0);
});

test("logo size changes the logo element", () => {
  const small = base({ logoSize: 1, templateId: "logo-spotlight" });
  const large = base({ logoSize: 5, templateId: "logo-spotlight" });
  const s = small.elements.find((el) => el.type === "logo");
  const l = large.elements.find((el) => el.type === "logo");
  assert.ok(s && l);
  const smallArea = s.widthIn * s.heightIn;
  const largeArea = l.widthIn * l.heightIn;
  assert.ok(
    largeArea > smallArea * 1.4,
    `logo area ${smallArea.toFixed(2)} vs ${largeArea.toFixed(2)}`,
  );
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
  const on = base({ showChevrons: true, templateId: "classic-plaque" });
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
  const clean = base({ templateId: "clean-white" });
  const side = base({ templateId: "side-by-side" });
  const spotlight = base({ templateId: "logo-spotlight" });
  const plaque = base({ templateId: "classic-plaque" });
  const direct = base({ templateId: "direct-truck" });
  assert.ok(templatesDiffer(clean, side));
  assert.ok(templatesDiffer(clean, spotlight));
  assert.ok(templatesDiffer(plaque, direct));
  assert.ok(templatesDiffer(side, plaque));
  const logoSpot = spotlight.elements.find((el) => el.type === "logo");
  const logoPlaque = plaque.elements.find((el) => el.type === "logo");
  assert.ok(logoSpot && logoPlaque);
  assert.ok(logoSpot.heightIn > logoPlaque.heightIn);
  assert.ok(plaque.elements.some((el) => el.type === "band"));
  assert.equal(clean.elements.some((el) => el.type === "band"), false);
  assert.equal(direct.background.fill, "none");
});

test("color does not change layout positions", () => {
  const white = base({ templateId: "clean-white" });
  const navy = compileDesign({
    companyName: "HIGHWAY FREIGHT",
    city: "Dallas",
    state: "TX",
    dotNumber: "1234567",
    mcNumber: "123456",
    logoDataUrl: "data:image/png;base64,aaa",
    logoSize: 4,
    nameFont: "condensed",
    templateId: "clean-white",
    showChevrons: false,
    showMc: true,
    colors: {
      ...colors,
      face: "#071a33",
      name: "#d4af37",
      legal: "#d4af37",
    },
  });
  const pos = (doc: typeof white) =>
    doc.elements
      .filter((el) => el.type !== "band")
      .map((el) => `${el.type}:${el.xIn.toFixed(2)}:${el.yIn.toFixed(2)}`)
      .join("|");
  assert.equal(pos(white), pos(navy));
});

test("required IDs stay inside the 12 inch canvas", () => {
  for (const id of [
    "clean-white",
    "logo-spotlight",
    "side-by-side",
    "direct-truck",
    "classic-plaque",
  ] as const) {
    const doc = base({ templateId: id });
    assert.ok(bottom(doc) <= 11.95, `${id} bottom ${bottom(doc)}`);
    assert.ok(
      doc.elements.some((el) => el.type === "text" && el.role === "usdot"),
      `${id} missing USDOT`,
    );
    assert.ok(
      doc.elements.some((el) => el.type === "text" && el.role === "mc"),
      `${id} missing MC`,
    );
  }
});

test("long names wrap instead of using a single unreadable line", () => {
  const doc = base({
    companyName: "AMERICAN CONTINENTAL FREIGHTLINES EXPRESS",
    logoDataUrl: "",
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
  const wide = base({ logoAspect: 3, templateId: "side-by-side" });
  const tall = base({ logoAspect: 0.4, templateId: "logo-spotlight" });
  const wideLogo = wide.elements.find((el) => el.type === "logo");
  const tallLogo = tall.elements.find((el) => el.type === "logo");
  assert.ok(wideLogo && tallLogo);
  assert.ok(wideLogo.widthIn / wideLogo.heightIn > 1.3);
  assert.ok(tallLogo.heightIn / tallLogo.widthIn > 1.1);
});
