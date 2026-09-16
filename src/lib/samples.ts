import { applyPreset } from "@/lib/sign-style";
import { DEFAULT_LOGO_SIZE } from "@/lib/logo-size";
import { emptySign, type SignFields } from "@/lib/order";

export type DriverSample = {
  id: string;
  label: string;
  hint: string;
  fields: SignFields;
};

export const SUGGESTED_LAYOUT: DriverSample = {
  id: "gold-navy",
  label: "Navy gold",
  hint: "20 × 12 in example · gold on navy",
  fields: {
    companyName: "COMPANY NAME",
    legalName: "DALLAS, TX",
    dotNumber: "3311300",
    mcNumber: "1051891",
    fleetNumber: "",
    logoDataUrl: "",
    ...applyPreset("gold-navy"),
    logoSize: DEFAULT_LOGO_SIZE,
  },
};

export const DRIVER_SAMPLES: DriverSample[] = [
  SUGGESTED_LAYOUT,
  {
    id: "black",
    label: "Black",
    hint: "20 × 12 in · white on black",
    fields: {
      companyName: "COMPANY NAME",
      legalName: "HOUSTON, TX",
      dotNumber: "91244018",
      mcNumber: "441902",
      fleetNumber: "",
      logoDataUrl: "",
      ...applyPreset("black"),
      logoSize: DEFAULT_LOGO_SIZE,
    },
  },
  {
    id: "red-line",
    label: "Red",
    hint: "20 × 12 in · white on red",
    fields: {
      companyName: "COMPANY NAME",
      legalName: "PHOENIX, AZ",
      dotNumber: "17550331",
      mcNumber: "628114",
      fleetNumber: "",
      logoDataUrl: "",
      ...applyPreset("red-line"),
      logoSize: DEFAULT_LOGO_SIZE,
    },
  },
  {
    id: "asphalt",
    label: "Asphalt",
    hint: "20 × 12 in · charcoal with orange",
    fields: {
      companyName: "COMPANY NAME",
      legalName: "CHICAGO, IL",
      dotNumber: "34882106",
      mcNumber: "901244",
      fleetNumber: "",
      logoDataUrl: "",
      ...applyPreset("asphalt"),
      logoSize: DEFAULT_LOGO_SIZE,
    },
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
