export type LogoSize = 1 | 2 | 3 | 4 | 5;

export const DEFAULT_LOGO_SIZE: LogoSize = 3;

export const LOGO_SIZE_OPTIONS: {
  value: LogoSize;
  short: string;
  label: string;
}[] = [
  { value: 1, short: "S", label: "Small" },
  { value: 2, short: "M", label: "Medium" },
  { value: 3, short: "L", label: "Large" },
  { value: 4, short: "XL", label: "Extra large" },
  { value: 5, short: "Max", label: "Full face" },
];

export function clampLogoSize(value: unknown): LogoSize {
  const n = Number(value);
  if (!Number.isFinite(n)) return DEFAULT_LOGO_SIZE;
  return Math.min(5, Math.max(1, Math.round(n))) as LogoSize;
}

/** How large the mark prints on the 24×24 vinyl (container query units). */
export function logoBox(size: unknown): { maxHeight: string; maxWidth: string } {
  const map: Record<LogoSize, { maxHeight: string; maxWidth: string }> = {
    1: { maxHeight: "11cqw", maxWidth: "36%" },
    2: { maxHeight: "16cqw", maxWidth: "50%" },
    3: { maxHeight: "22cqw", maxWidth: "64%" },
    4: { maxHeight: "28cqw", maxWidth: "76%" },
    5: { maxHeight: "36cqw", maxWidth: "88%" },
  };
  return map[clampLogoSize(size)];
}

export function logoSizeLabel(size: unknown): string {
  const option = LOGO_SIZE_OPTIONS.find((item) => item.value === clampLogoSize(size));
  return option?.label ?? "Large";
}
