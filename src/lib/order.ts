import { clampLogoSize } from "@/lib/logo-size";
import {
  applyPreset,
  defaultStyle,
  type SignStyle,
} from "@/lib/sign-style";
import { compileDesign } from "@/lib/design/compile";
import {
  migrateCityState,
  resolveFont,
  resolveTemplate,
} from "@/lib/design/migrate";
import type { DesignDocument } from "@/lib/design/schema";
import {
  defaultArtwork,
  resolveArtworkFit,
  resolveArtworkRole,
  type ArtworkFit,
  type ArtworkRole,
} from "@/lib/artwork";
import type { PaymentStatus, ProductionStatus } from "@/lib/order-status";

export type OrderSource = "web" | "telegram";

export type ShopService = "PRINT_ONLY" | "CUSTOM_DESIGN";

export function resolveService(value: unknown): ShopService {
  return value === "PRINT_ONLY" ? "PRINT_ONLY" : "CUSTOM_DESIGN";
}

export function isPrintOnly(order: { service?: ShopService }): boolean {
  return order.service === "PRINT_ONLY";
}

export type SignFields = {
  companyName: string;
  /** Registered legal name. Never store city/state here. */
  legalName: string;
  city: string;
  state: string;
  dotNumber: string;
  mcNumber: string;
  fleetNumber: string;
  logoDataUrl: string;
  logoAspect?: number;
  artworkRole: ArtworkRole;
  artworkFit: ArtworkFit;
  artworkOffsetX: number;
  artworkOffsetY: number;
  /** Untouched upload. Fitting and crop never overwrite this. */
  originalArtworkUrl: string;
  logoContainsName: boolean;
  design?: DesignDocument;
} & SignStyle;

export type SignOrder = SignFields & {
  id: string;
  username: string;
  source: OrderSource;
  language?: string;
  telegramChatId?: number;
  telegramUserId?: number;
  createdAt: string;
  updatedAt?: string;
  /** Legacy alias. Prefer productionStatus. */
  status: "received" | ProductionStatus;
  /** Existing tickets without this field are custom designs. */
  service?: ShopService;
  productionStatus?: ProductionStatus;
  paymentStatus?: PaymentStatus;
  quantity?: number;
  widthIn?: number;
  heightIn?: number;
  /** Shop price in USD cents. Null means not priced — never a fake $0. */
  amountMinor?: number | null;
  currency?: string;
  accessTokenHash?: string;
  stripeCheckoutSessionId?: string;
  stripePaymentIntentId?: string;
  printExact?: boolean;
  printNotes?: string;
  originalFileName?: string;
  originalMime?: string;
};

export const SAMPLE_SIGN: SignFields = {
  companyName: "COMPANY NAME",
  legalName: "",
  city: "DALLAS",
  state: "TX",
  dotNumber: "3311300",
  mcNumber: "1051891",
  fleetNumber: "",
  logoDataUrl: "",
  ...defaultArtwork(),
  ...applyPreset("white-black"),
  templateId: "clean-white",
};

export const SAMPLE_PRINT_ID = "sample";

export function samplePrintOrder(): SignOrder {
  return {
    ...SAMPLE_SIGN,
    id: SAMPLE_PRINT_ID,
    username: "shop",
    source: "web",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    status: "received",
    service: "CUSTOM_DESIGN",
    productionStatus: "RECEIVED",
    paymentStatus: "UNPAID",
    quantity: 1,
    widthIn: 20,
    heightIn: 12,
    amountMinor: null,
    currency: "usd",
  };
}

export function emptySign(): SignFields {
  return {
    companyName: "",
    legalName: "",
    city: "",
    state: "",
    dotNumber: "",
    mcNumber: "",
    fleetNumber: "",
    logoDataUrl: "",
    ...defaultArtwork(),
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
  if (!/^\d{4,10}$/.test(fields.mcNumber.trim())) {
    errors.push("MC (FMCSA) number should be 4–10 digits.");
  }
  return errors;
}

export function digitsOnly(value: string, max: number): string {
  return value.replace(/\D/g, "").slice(0, max);
}

export function createOrderId(): string {
  const n = Math.floor(100000 + Math.random() * 900000);
  return `JS-${n}`;
}

export function normalizeSign(input: Partial<SignFields>): SignFields {
  const base = emptySign();
  const place = migrateCityState({
    city: input.city,
    state: input.state,
    legalName: input.legalName,
  });
  const fields: SignFields = {
    ...base,
    companyName: String(input.companyName ?? "").trim(),
    legalName: place.legalName,
    city: place.city,
    state: place.state,
    dotNumber: String(input.dotNumber ?? "").trim(),
    mcNumber: String(input.mcNumber ?? "").trim(),
    fleetNumber: String(input.fleetNumber ?? "").trim(),
    logoDataUrl: String(input.logoDataUrl ?? "").trim(),
    logoAspect:
      typeof input.logoAspect === "number" && Number.isFinite(input.logoAspect)
        ? input.logoAspect
        : undefined,
    nameFont: resolveFont(input.nameFont ?? base.nameFont),
    showChevrons: input.showChevrons ?? base.showChevrons,
    showMc: input.showMc !== false,
    paletteId: String(input.paletteId ?? base.paletteId),
    colors: { ...base.colors, ...input.colors },
    logoSize: clampLogoSize(input.logoSize ?? base.logoSize),
    templateId: resolveTemplate(input.templateId ?? base.templateId),
    artworkRole: resolveArtworkRole(input.artworkRole ?? base.artworkRole),
    artworkFit: resolveArtworkFit(input.artworkFit ?? base.artworkFit),
    artworkOffsetX:
      typeof input.artworkOffsetX === "number" && Number.isFinite(input.artworkOffsetX)
        ? input.artworkOffsetX
        : 0,
    artworkOffsetY:
      typeof input.artworkOffsetY === "number" && Number.isFinite(input.artworkOffsetY)
        ? input.artworkOffsetY
        : 0,
    originalArtworkUrl: String(
      input.originalArtworkUrl ?? input.logoDataUrl ?? "",
    ).trim(),
    logoContainsName: Boolean(input.logoContainsName),
  };
  fields.design = compileDesign({
    companyName: fields.companyName,
    city: fields.city,
    state: fields.state,
    legalName: fields.legalName,
    dotNumber: fields.dotNumber,
    mcNumber: fields.mcNumber,
    logoDataUrl: fields.logoDataUrl,
    logoAspect: fields.logoAspect,
    logoSize: fields.logoSize,
    nameFont: fields.nameFont,
    templateId: fields.templateId,
    showChevrons: fields.showChevrons,
    showMc: fields.showMc,
    colors: fields.colors,
    artworkRole: fields.artworkRole,
    artworkFit: fields.artworkFit,
    artworkOffsetX: fields.artworkOffsetX,
    artworkOffsetY: fields.artworkOffsetY,
    logoContainsName: fields.logoContainsName,
  });
  return fields;
}
