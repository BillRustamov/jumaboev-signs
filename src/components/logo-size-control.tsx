"use client";

import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  LOGO_SIZE_OPTIONS,
  clampLogoSize,
  type LogoSize,
} from "@/lib/logo-size";
import { uiT } from "@/lib/shop-copy";
import { logoSizeName } from "@/lib/shop-labels";
import { useShopLang } from "@/lib/shop-lang";

export function LogoSizeControl({
  value,
  onChange,
  disabled,
  id = "logo-size",
}: {
  value: number;
  onChange: (size: LogoSize) => void;
  disabled?: boolean;
  id?: string;
}) {
  const lang = useShopLang();
  const size = clampLogoSize(value);

  return (
    <div className={disabled ? "space-y-3 opacity-50" : "space-y-3"}>
      <div className="flex items-end justify-between gap-3">
        <div>
          <Label htmlFor={id}>{uiT(lang, "logoSizeVinyl")}</Label>
          <p className="text-xs text-muted-foreground">
            {disabled
              ? uiT(lang, "logoSizeNeedUpload")
              : uiT(lang, "logoSizeHowLarge")}
          </p>
        </div>
        <p className="text-sm font-medium text-[var(--navy)]">{logoSizeName(lang, size)}</p>
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
        id={id}
        min={1}
        max={5}
        step={1}
        disabled={disabled}
        value={[size]}
        onValueChange={(next) => onChange(clampLogoSize(next[0]))}
        aria-label={uiT(lang, "logoSizeVinyl")}
        className="py-3 md:py-0"
      />
    </div>
  );
}
