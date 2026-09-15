export type OrderSource = "web" | "telegram";

export type SignFields = {
  companyName: string;
  legalName: string;
  dotNumber: string;
  mcNumber: string;
  fleetNumber: string;
  logoDataUrl: string;
};

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
};

export function emptySign(): SignFields {
  return {
    companyName: "",
    legalName: "",
    dotNumber: "",
    mcNumber: "",
    fleetNumber: "",
    logoDataUrl: "",
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
    errors.push("Enter the company name as it should read on the door.");
  }
  if (!fields.legalName.trim()) {
    errors.push("Enter the legal business name (LLC, INC, sole prop).");
  }
  if (!/^\d{4,12}$/.test(fields.dotNumber.trim())) {
    errors.push("DOT number should be 4–12 digits.");
  }
  if (!/^\d{4,10}$/.test(fields.mcNumber.trim())) {
    errors.push("MC number should be 4–10 digits.");
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

export function normalizeSign(fields: SignFields): SignFields {
  return {
    companyName: fields.companyName.trim(),
    legalName: fields.legalName.trim(),
    dotNumber: fields.dotNumber.trim(),
    mcNumber: fields.mcNumber.trim(),
    fleetNumber: fields.fleetNumber.trim(),
    logoDataUrl: fields.logoDataUrl.trim(),
  };
}
