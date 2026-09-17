import { applyPreset } from "@/lib/sign-style";
import { DEFAULT_LOGO_SIZE } from "@/lib/logo-size";
import { emptySign, type SignFields } from "@/lib/order";

export type DriverSample = {
  id: string;
  label: string;
  hint: string;
  fields: SignFields;
};

function sampleFields(
  preset: string,
  city: string,
  state: string,
  dot: string,
  mc: string,
): SignFields {
  return {
    companyName: "COMPANY NAME",
    legalName: "",
    city,
    state,
    dotNumber: dot,
    mcNumber: mc,
    fleetNumber: "",
    logoDataUrl: "",
    ...applyPreset(preset),
    logoSize: DEFAULT_LOGO_SIZE,
  };
}

export const SUGGESTED_LAYOUT: DriverSample = {
  id: "gold-navy",
  label: "Navy gold",
  hint: "20 × 12 in example · gold on navy",
  fields: sampleFields("gold-navy", "DALLAS", "TX", "3311300", "1051891"),
};

export const DRIVER_SAMPLES: DriverSample[] = [
  SUGGESTED_LAYOUT,
  {
    id: "black",
    label: "Black",
    hint: "20 × 12 in · white on black",
    fields: sampleFields("black", "HOUSTON", "TX", "91244018", "441902"),
  },
  {
    id: "red-line",
    label: "Red",
    hint: "20 × 12 in · white on red",
    fields: sampleFields("red-line", "PHOENIX", "AZ", "17550331", "628114"),
  },
  {
    id: "asphalt",
    label: "Asphalt",
    hint: "20 × 12 in · charcoal with orange",
    fields: sampleFields("asphalt", "CHICAGO", "IL", "34882106", "901244"),
  },
];

export const BLANK_SAMPLE: DriverSample = {
  id: "blank",
  label: "Blank door",
  hint: "Start with your numbers",
  fields: emptySign(),
};

const SAMPLE_ALIASES: Record<string, string> = {
  suggested: "gold-navy",
  highway: "black",
  elbrus: "gold-navy",
  "gold-plates": "gold-navy",
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
