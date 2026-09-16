export type LogoSize = 1 | 2 | 3 | 4 | 5;

export const DEFAULT_LOGO_SIZE: LogoSize = 4;

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

/** How large the mark prints on the vinyl (container query units). */
export function logoBox(size: unknown): { maxHeight: string; maxWidth: string } {
  const map: Record<LogoSize, { maxHeight: string; maxWidth: string }> = {
    1: { maxHeight: "7cqw", maxWidth: "18%" },
    2: { maxHeight: "9cqw", maxWidth: "22%" },
    3: { maxHeight: "11cqw", maxWidth: "26%" },
    4: { maxHeight: "13cqw", maxWidth: "30%" },
    5: { maxHeight: "16cqw", maxWidth: "36%" },
  };
  return map[clampLogoSize(size)];
}

export function logoSizeLabel(size: unknown): string {
  const option = LOGO_SIZE_OPTIONS.find((item) => item.value === clampLogoSize(size));
  return option?.label ?? "Large";
}
