export function formatUsd(amountMinor: number | null | undefined): string {
  if (typeof amountMinor !== "number" || !Number.isFinite(amountMinor)) {
    return "";
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amountMinor / 100);
}

/** Rejects zero and non-numeric input. Shop price is never a fake $0. */
export function parseUsdToMinor(value: string): number | null {
  const trimmed = value.trim().replace(/[$,\s]/g, "");
  if (!trimmed) return null;
  const n = Number(trimmed);
  if (!Number.isFinite(n) || n <= 0) return null;
  return Math.round(n * 100);
}

export function isPriced(amountMinor: number | null | undefined): boolean {
  return typeof amountMinor === "number" && Number.isFinite(amountMinor) && amountMinor > 0;
}
