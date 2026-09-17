import { applyPreset } from "@/lib/sign-style";
import { DEFAULT_LOGO_SIZE } from "@/lib/logo-size";
import { emptySign, type SignFields } from "@/lib/order";
import type { TemplateId } from "@/lib/design/schema";

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
