import { applyPreset } from "@/lib/sign-style";
import { DEFAULT_LOGO_SIZE } from "@/lib/logo-size";
import { emptySign, type SignFields } from "@/lib/order";

/** Simple mountain mark so drivers can see logo size on the Elbrus sample. */
export const ELBRUS_MARK = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 92">
    <path fill="#1a2744" d="M8 84 L46 22 L68 48 L96 8 L152 84 Z"/>
    <path fill="#c6a23a" d="M46 22 L62 42 L68 48 L54 36 Z"/>
    <path fill="#f4f0e4" d="M96 8 L112 28 L104 22 Z"/>
  </svg>`,
)}`;

export type DriverSample = {
  id: string;
  label: string;
  hint: string;
  fields: SignFields;
};

export const DRIVER_SAMPLES: DriverSample[] = [
  {
    id: "elbrus",
    label: "Elbrus",
    hint: "Gold/navy · MC · mark",
    fields: {
      companyName: "ELBRUS",
      legalName: "ELBRUS FREIGHTLINES LLC",
      dotNumber: "20179229",
      mcNumber: "796405",
      fleetNumber: "",
      logoDataUrl: ELBRUS_MARK,
      ...applyPreset("elbrus"),
      logoSize: DEFAULT_LOGO_SIZE,
    },
  },
  {
    id: "usdot-only",
    label: "USDOT only",
    hint: "No MC plate",
    fields: {
      companyName: "HIGHWAY",
      legalName: "HIGHWAY LOGISTICS LLC",
      dotNumber: "34882106",
      mcNumber: "",
      fleetNumber: "",
      logoDataUrl: "",
      ...applyPreset("highway"),
      showMc: false,
      logoSize: DEFAULT_LOGO_SIZE,
    },
  },
  {
    id: "gold-plates",
    label: "Gold plates",
    hint: "Navy name · gold USDOT",
    fields: {
      companyName: "GOLD LINE",
      legalName: "GOLD LINE CARRIERS LLC",
      dotNumber: "91244018",
      mcNumber: "441902",
      fleetNumber: "104",
      logoDataUrl: "",
      ...applyPreset("gold-navy"),
      logoSize: DEFAULT_LOGO_SIZE,
    },
  },
  {
    id: "red-line",
    label: "Red line",
    hint: "Black type · red plates",
    fields: {
      companyName: "REDLINE",
      legalName: "REDLINE HAUL INC",
      dotNumber: "17550331",
      mcNumber: "628114",
      fleetNumber: "",
      logoDataUrl: "",
      ...applyPreset("red-line"),
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

export function sampleById(id: string | null | undefined): DriverSample | undefined {
  if (!id) return undefined;
  if (id === BLANK_SAMPLE.id) return BLANK_SAMPLE;
  return DRIVER_SAMPLES.find((sample) => sample.id === id);
}

/** Keep the sample look (colors, logo, plates) but clear shop lettering. */
export function lookFromSample(sample: DriverSample): SignFields {
  return {
    ...sample.fields,
    companyName: "",
    legalName: "",
    dotNumber: "",
    mcNumber: "",
    fleetNumber: "",
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
