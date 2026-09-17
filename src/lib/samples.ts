import { applyPreset, STYLE_PRESETS } from "@/lib/sign-style";
import { DEFAULT_LOGO_SIZE } from "@/lib/logo-size";
import { emptySign, type SignFields } from "@/lib/order";
import type { TemplateId } from "@/lib/design/schema";
import { defaultArtwork } from "@/lib/artwork";

export type DriverSample = {
  id: string;
  label: string;
  hint: string;
  fields: SignFields;
};

/** Geometric mark for logo-focused samples. Not a customer logo. */
export const SAMPLE_MARK =
  "data:image/svg+xml;charset=utf-8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
      <rect width="120" height="120" rx="16" fill="#0b1f3a"/>
      <polygon points="60,16 102,100 18,100" fill="#f4f4f4"/>
      <rect x="48" y="64" width="24" height="26" fill="#c8102e"/>
    </svg>`,
  );

export const SAMPLE_MARK_WIDE =
  "data:image/svg+xml;charset=utf-8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 84">
      <rect width="240" height="84" rx="10" fill="#111111"/>
      <rect x="16" y="18" width="52" height="48" rx="6" fill="#f4f4f4"/>
      <rect x="80" y="22" width="144" height="16" rx="3" fill="#f4f4f4"/>
      <rect x="80" y="48" width="96" height="12" rx="3" fill="#c9a227"/>
    </svg>`,
  );

function sampleFields(opts: {
  preset: string;
  templateId: TemplateId;
  city: string;
  state: string;
  dot: string;
  mc: string;
  company?: string;
  logo?: string;
  aspect?: number;
  chevrons?: boolean;
}): SignFields {
  const style = applyPreset(opts.preset);
  return {
    companyName: opts.company ?? "COMPANY NAME",
    legalName: "",
    city: opts.city,
    state: opts.state,
    dotNumber: opts.dot,
    mcNumber: opts.mc,
    fleetNumber: "",
    logoDataUrl: opts.logo ?? "",
    logoAspect: opts.aspect,
    ...style,
    ...defaultArtwork(),
    artworkRole: opts.logo ? "logo" : "none",
    originalArtworkUrl: opts.logo ?? "",
    templateId: opts.templateId,
    showChevrons: opts.chevrons ?? style.showChevrons,
    logoSize: DEFAULT_LOGO_SIZE,
  };
}

export const SUGGESTED_LAYOUT: DriverSample = {
  id: "clean-white",
  label: "Clean white",
  hint: "20 × 12 in · white vinyl · black lettering",
  fields: sampleFields({
    preset: "white-black",
    templateId: "clean-white",
    city: "DALLAS",
    state: "TX",
    dot: "3311300",
    mc: "1051891",
  }),
};

export const DRIVER_SAMPLES: DriverSample[] = [
  SUGGESTED_LAYOUT,
  {
    id: "logo-spotlight",
    label: "Logo spotlight",
    hint: "20 × 12 in · large mark, name and IDs below",
    fields: sampleFields({
      preset: "white-navy",
      templateId: "logo-spotlight",
      city: "HOUSTON",
      state: "TX",
      dot: "91244018",
      mc: "441902",
      logo: SAMPLE_MARK,
      aspect: 1,
    }),
  },
  {
    id: "side-by-side",
    label: "Side by side",
    hint: "20 × 12 in · wide mark left, lettering right",
    fields: sampleFields({
      preset: "white-red",
      templateId: "side-by-side",
      city: "PHOENIX",
      state: "AZ",
      dot: "17550331",
      mc: "628114",
      logo: SAMPLE_MARK_WIDE,
      aspect: 240 / 84,
    }),
  },
  {
    id: "direct-truck",
    label: "Direct lettering",
    hint: "20 × 12 in · cut type, no filled plaque",
    fields: sampleFields({
      preset: "cut-black",
      templateId: "direct-truck",
      city: "CHICAGO",
      state: "IL",
      dot: "34882106",
      mc: "901244",
    }),
  },
  {
    id: "classic-plaque",
    label: "Classic plaque",
    hint: "20 × 12 in · navy ID bands on a printed board",
    fields: sampleFields({
      preset: "gold-navy",
      templateId: "classic-plaque",
      city: "ATLANTA",
      state: "GA",
      dot: "20144510",
      mc: "796102",
    }),
  },
];

export const BLANK_SAMPLE: DriverSample = {
  id: "blank",
  label: "Blank door",
  hint: "Start with your numbers",
  fields: emptySign(),
};

const SAMPLE_ALIASES: Record<string, string> = {
  suggested: "clean-white",
  highway: "direct-truck",
  elbrus: "classic-plaque",
  "gold-navy": "classic-plaque",
  "gold-plates": "classic-plaque",
  black: "direct-truck",
  "red-line": "side-by-side",
  asphalt: "logo-spotlight",
};

export function sampleById(id: string | null | undefined): DriverSample | undefined {
  if (!id) return undefined;
  const resolved = SAMPLE_ALIASES[id] ?? id;
  if (resolved === BLANK_SAMPLE.id) return BLANK_SAMPLE;
  return DRIVER_SAMPLES.find((sample) => sample.id === resolved);
}

export function lookFromSample(sample: DriverSample): SignFields {
  return {
    ...sample.fields,
    companyName: "",
    legalName: "",
    city: "",
    state: "",
    dotNumber: "",
    mcNumber: "",
    fleetNumber: "",
    showMc: true,
  };
}

export function isDemoLettering(fields: SignFields): boolean {
  const name = fields.companyName.trim().toUpperCase();
  const dot = fields.dotNumber.trim();
  if (!name || !dot) return false;
  return DRIVER_SAMPLES.some(
    (sample) =>
      sample.fields.companyName.toUpperCase() === name &&
      sample.fields.dotNumber === dot,
  );
}

export type SampleCategory =
  | "white-minimal"
  | "logo-focused"
  | "classic-lettering"
  | "premium-plaque"
  | "upload";

export type CatalogFilter = "all" | "white" | "dark" | "with-logo" | "no-logo";

export const SAMPLE_CATEGORIES: {
  id: SampleCategory;
  label: string;
  blurb: string;
}[] = [
  {
    id: "white-minimal",
    label: "White & Minimal",
    blurb: "White vinyl, large black type, no extra box.",
  },
  {
    id: "logo-focused",
    label: "Logo-Focused",
    blurb: "The mark leads. Name and USDOT stay readable.",
  },
  {
    id: "classic-lettering",
    label: "Classic Lettering",
    blurb: "Cut type on the truck — no filled plaque.",
  },
  {
    id: "premium-plaque",
    label: "Premium Plaques",
    blurb: "Solid printed board with large ID bands.",
  },
  {
    id: "upload",
    label: "Upload Your Own",
    blurb: "Start blank and drop in a logo or existing door photo.",
  },
];

export const CATALOG_FILTERS: { id: CatalogFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "white", label: "White" },
  { id: "dark", label: "Dark" },
  { id: "with-logo", label: "With logo" },
  { id: "no-logo", label: "No logo" },
];

/** Five layouts plus the blank upload card. No color duplicates. */
export const GALLERY_SAMPLES: DriverSample[] = [...DRIVER_SAMPLES, BLANK_SAMPLE];

function faceLuminance(hex: string): number {
  const raw = hex.replace("#", "").padEnd(6, "0");
  const r = Number.parseInt(raw.slice(0, 2), 16);
  const g = Number.parseInt(raw.slice(2, 4), 16);
  const b = Number.parseInt(raw.slice(4, 6), 16);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function sampleCategory(sample: DriverSample): SampleCategory {
  if (sample.id === "blank") return "upload";
  const id = sample.fields.templateId;
  if (id === "clean-white") return "white-minimal";
  if (id === "logo-spotlight" || id === "side-by-side") return "logo-focused";
  if (id === "direct-truck") return "classic-lettering";
  return "premium-plaque";
}

export function sampleTone(sample: DriverSample): "white" | "dark" {
  return faceLuminance(sample.fields.colors.face) > 180 ? "white" : "dark";
}

export function sampleHasLogo(sample: DriverSample): boolean {
  return Boolean(sample.fields.logoDataUrl?.trim());
}

export function sampleProductType(sample: DriverSample): string {
  if (sample.id === "blank") return "Your artwork";
  if (sample.fields.templateId === "direct-truck") return "Cut lettering";
  if (sample.fields.templateId === "classic-plaque") return "Printed plaque";
  return "White vinyl";
}

export function sampleColorLabel(sample: DriverSample): string {
  const preset = STYLE_PRESETS.find((item) => item.id === sample.fields.paletteId);
  return preset?.label ?? "Custom";
}

export function filterCatalog(
  samples: DriverSample[],
  category: SampleCategory | "all",
  filter: CatalogFilter,
): DriverSample[] {
  return samples.filter((sample) => {
    if (category !== "all" && sampleCategory(sample) !== category) return false;
    if (filter === "white") return sampleTone(sample) === "white";
    if (filter === "dark") return sampleTone(sample) === "dark";
    if (filter === "with-logo") return sampleHasLogo(sample);
    if (filter === "no-logo") return !sampleHasLogo(sample);
    return true;
  });
}
