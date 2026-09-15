"use client";

import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  LOGO_SIZE_OPTIONS,
  clampLogoSize,
  logoSizeLabel,
  type LogoSize,
} from "@/lib/logo-size";

export function LogoSizeControl({
  value,
  onChange,
  disabled,
}: {
  value: number;
  onChange: (size: LogoSize) => void;
  disabled?: boolean;
}) {
  const size = clampLogoSize(value);

  return (
    <div className={disabled ? "space-y-3 opacity-50" : "space-y-3"}>
      <div className="flex items-end justify-between gap-3">
        <div>
          <Label htmlFor="logo-size">Logo size on the vinyl</Label>
          <p className="text-xs text-muted-foreground">
            {disabled
              ? "Upload a logo first, then set how large it prints on the 24×24 door."
              : "How large the mark prints on the 24×24 door."}
          </p>
        </div>
        <p className="text-sm font-medium text-[var(--navy)]">{logoSizeLabel(size)}</p>
      </div>
      <div className="grid grid-cols-5 gap-1.5">
        {LOGO_SIZE_OPTIONS.map((option) => (
          <Button
            key={option.value}
            type="button"
            size="sm"
            variant={size === option.value ? "default" : "outline"}
            disabled={disabled}
            className="h-11 px-0 md:h-9"
            onClick={() => onChange(option.value)}
          >
            {option.short}
          </Button>
        ))}
      </div>
      <Slider
        id="logo-size"
        min={1}
        max={5}
        step={1}
        disabled={disabled}
        value={[size]}
        onValueChange={(next) => onChange(clampLogoSize(next[0]))}
        aria-label="Logo size on the vinyl"
        className="py-3 md:py-0"
      />
    </div>
  );
}
