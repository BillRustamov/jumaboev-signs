import { clampLogoSize } from "@/lib/logo-size";
import {
  applyPreset,
  defaultStyle,
  type SignStyle,
} from "@/lib/sign-style";

export type OrderSource = "web" | "telegram";

export type SignFields = {
  companyName: string;
  legalName: string;
  dotNumber: string;
  mcNumber: string;
  fleetNumber: string;
  logoDataUrl: string;
} & SignStyle;

export type SignOrder = SignFields & {
  id: string;
  username: string;
  source: OrderSource;
  language?: string;
  createdAt: string;
  status: "received";
};

export const SAMPLE_SIGN: SignFields = {
  companyName: "ELBRUS",
  legalName: "ELBRUS FREIGHTLINES LLC",
  dotNumber: "20179229",
  mcNumber: "796405",
  fleetNumber: "",
  logoDataUrl: "",
  ...applyPreset("elbrus"),
};

export function emptySign(): SignFields {
  return {
    companyName: "",
    legalName: "",
    dotNumber: "",
    mcNumber: "",
    fleetNumber: "",
    logoDataUrl: "",
    ...defaultStyle(),
  };
}

export function validateUsername(name: string): string | null {
  if (!/^[a-zA-Z0-9_]{3,24}$/.test(name.trim())) {
    return "Username must be 3–24 letters, numbers, or underscores.";
  }
  return null;
}

export function validateSign(fields: SignFields): string[] {
  const errors: string[] = [];
  if (!fields.companyName.trim()) {
    errors.push(
      "Enter the MCS-150 name (legal name or one trade name) for the door.",
    );
  }
  if (!/^\d{4,12}$/.test(fields.dotNumber.trim())) {
    errors.push("USDOT number should be 4–12 digits.");
  }
  if (fields.showMc && !/^\d{4,10}$/.test(fields.mcNumber.trim())) {
    errors.push("MC number should be 4–10 digits, or turn the MC plate off.");
  }
  if (
    fields.fleetNumber.trim() &&
    !/^[A-Za-z0-9-]{1,16}$/.test(fields.fleetNumber.trim())
  ) {
    errors.push("Fleet number should be up to 16 letters, digits, or hyphens.");
  }
  return errors;
}

export function createOrderId(): string {
  const n = Math.floor(100000 + Math.random() * 900000);
  return `JS-${n}`;
}

export function normalizeSign(input: Partial<SignFields>): SignFields {
  const base = emptySign();
  return {
    ...base,
    companyName: String(input.companyName ?? "").trim(),
    legalName: String(input.legalName ?? "").trim(),
    dotNumber: String(input.dotNumber ?? "").trim(),
    mcNumber: String(input.mcNumber ?? "").trim(),
    fleetNumber: String(input.fleetNumber ?? "").trim(),
    logoDataUrl: String(input.logoDataUrl ?? "").trim(),
    nameFont: input.nameFont === "condensed" ? "condensed" : "serif",
    showChevrons: input.showChevrons !== false,
    showMc: input.showMc !== false,
    paletteId: String(input.paletteId ?? base.paletteId),
    colors: { ...base.colors, ...input.colors },
    logoSize: clampLogoSize(input.logoSize ?? base.logoSize),
  };
}
