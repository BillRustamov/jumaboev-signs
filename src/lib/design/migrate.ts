import type { SignFontId, TemplateId } from "@/lib/design/schema";
import { isSignFontId, isTemplateId } from "@/lib/design/schema";

const PLACE_RE = /^([A-Za-z .'-]+),\s*([A-Za-z]{2})$/;

export function parsePlace(value: string): { city: string; state: string } | null {
  const match = value.trim().match(PLACE_RE);
  if (!match) return null;
  return { city: match[1].trim(), state: match[2].trim().toUpperCase() };
}

export function formatPlace(city: string, state: string): string {
  const c = city.trim();
  const s = state.trim();
  if (c && s) return `${c}, ${s}`;
  return c || s;
}

export function resolvePlace(input: {
  city?: string;
  state?: string;
  legalName?: string;
}): string {
  const fromFields = formatPlace(input.city ?? "", input.state ?? "");
  if (fromFields) return fromFields.toUpperCase();
  const legacy = parsePlace(input.legalName ?? "");
  if (legacy) return formatPlace(legacy.city, legacy.state).toUpperCase();
  return "";
}

export function migrateCityState(input: {
  city?: string;
  state?: string;
  legalName?: string;
}): { city: string; state: string; legalName: string } {
  const city = String(input.city ?? "").trim();
  const state = String(input.state ?? "").trim();
  const legalName = String(input.legalName ?? "").trim();
  if (city || state) {
    const leftover = parsePlace(legalName) ? "" : legalName;
    return { city, state: state.toUpperCase(), legalName: leftover };
  }
  const parsed = parsePlace(legalName);
  if (parsed) {
    return { city: parsed.city, state: parsed.state, legalName: "" };
  }
  return { city: "", state: "", legalName };
}

export function resolveFont(value: unknown): SignFontId {
  if (isSignFontId(value)) return value;
  if (value === "gothic") return "condensed";
  return "condensed";
}

export function resolveTemplate(value: unknown): TemplateId {
  if (isTemplateId(value)) return value;
  return "premium-plaque";
}
