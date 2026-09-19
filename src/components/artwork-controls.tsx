"use client";

import { useId } from "react";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { TruckSign } from "@/components/truck-sign";
import {
  ARTWORK_FITS,
  isRasterDataUrl,
} from "@/lib/artwork";
import type { SignFields } from "@/lib/order";
import { uiT } from "@/lib/shop-copy";
import { artworkFitHint, artworkFitLabel } from "@/lib/shop-labels";
import { useShopLang } from "@/lib/shop-lang";
import { cn } from "@/lib/utils";

export function ArtworkControls({
  fields,
  onChange,
}: {
  fields: SignFields;
  onChange: (patch: Partial<SignFields>) => void;
}) {
  const lang = useShopLang();
  if (!fields.logoDataUrl) return null;
  const raster = isRasterDataUrl(fields.originalArtworkUrl || fields.logoDataUrl);
  const existing = fields.artworkRole === "existing-sign";
  const uid = useId();

  return (
    <div className="space-y-3 rounded-lg border bg-muted/30 p-3">
      <div className="space-y-2">
        <Label>{uiT(lang, "howFilePrints")}</Label>
        <div className="grid grid-cols-2 gap-1.5">
          <Button
            type="button"
            size="sm"
            className="h-11 whitespace-normal md:h-8"
            variant={fields.artworkRole !== "existing-sign" ? "default" : "outline"}
            onClick={() => onChange({ artworkRole: "logo" })}
          >
            {uiT(lang, "companyLogo")}
          </Button>
          <Button
            type="button"
            size="sm"
            className="h-11 whitespace-normal md:h-8"
            variant={existing ? "default" : "outline"}
            onClick={() => onChange({ artworkRole: "existing-sign" })}
          >
            {uiT(lang, "existingDoorSign")}
          </Button>
        </div>
      </div>

      {raster ? (
        <Alert>
          <AlertCircle />
          <AlertTitle>{uiT(lang, "flattenedTitle")}</AlertTitle>
          <AlertDescription>{uiT(lang, "flattenedBody")}</AlertDescription>
        </Alert>
      ) : (
        <p className="text-xs text-muted-foreground">
          {uiT(lang, "originalStored")}
        </p>
      )}

      <div className="space-y-2">
        <Label>{uiT(lang, "placeOnBoard")}</Label>
        <div className="grid grid-cols-2 gap-2">
          {ARTWORK_FITS.map((item) => {
            const preview: SignFields = {
              ...fields,
              artworkFit: item.id,
              artworkRole: fields.artworkRole === "none" ? "logo" : fields.artworkRole,
            };
            const selected = fields.artworkFit === item.id;
            return (
              <Button
                key={item.id}
                type="button"
                variant="outline"
                className={cn(
                  "h-auto w-full flex-col items-stretch gap-1.5 p-1.5 text-left whitespace-normal",
                  selected && "border-[var(--navy)] ring-2 ring-[var(--navy)]",
                )}
                onClick={() =>
                  onChange({
                    artworkFit: item.id,
                    artworkOffsetX: item.id === "original" ? 0 : fields.artworkOffsetX,
                    artworkOffsetY: item.id === "original" ? 0 : fields.artworkOffsetY,
                  })
                }
              >
                <div className="w-full min-w-0">
                  <TruckSign
                    fields={preview}
                    className="pointer-events-none w-full shadow-none"
                  />
                </div>
                <span className="px-1 text-xs font-medium">
                  {artworkFitLabel(lang, item.id)}
                </span>
                <span className="px-1 text-[11px] font-normal text-muted-foreground">
                  {artworkFitHint(lang, item.id)}
                </span>
              </Button>
            );
          })}
        </div>
        {fields.artworkFit === "cover" ? (
          <p className="text-xs text-muted-foreground">
            {uiT(lang, "cropFillNote")}
          </p>
        ) : null}
      </div>

      {fields.artworkFit !== "original" ? (
        <div className="space-y-3">
          <div>
            <Label htmlFor={`${uid}-art-x`}>{uiT(lang, "nudgeH")}</Label>
            <Slider
              id={`${uid}-art-x`}
              min={-1}
              max={1}
              step={0.05}
              value={[fields.artworkOffsetX]}
              onValueChange={(next) => onChange({ artworkOffsetX: next[0] ?? 0 })}
              className="py-3"
            />
          </div>
          <div>
            <Label htmlFor={`${uid}-art-y`}>{uiT(lang, "nudgeV")}</Label>
            <Slider
              id={`${uid}-art-y`}
              min={-1}
              max={1}
              step={0.05}
              value={[fields.artworkOffsetY]}
              onValueChange={(next) => onChange({ artworkOffsetY: next[0] ?? 0 })}
              className="py-3"
            />
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() =>
              onChange({
                artworkFit: "contain",
                artworkOffsetX: 0,
                artworkOffsetY: 0,
              })
            }
          >
            {uiT(lang, "resetPlacement")}
          </Button>
        </div>
      ) : null}

      <div className="flex items-center justify-between gap-3">
        <div>
          <Label htmlFor={`${uid}-logo-is-name`}>{uiT(lang, "logoIsName")}</Label>
          <p className="text-xs text-muted-foreground">
            {uiT(lang, "logoIsNameHint")}
          </p>
        </div>
        <Switch
          id={`${uid}-logo-is-name`}
          checked={fields.logoContainsName}
          onCheckedChange={(checked) => onChange({ logoContainsName: checked })}
        />
      </div>
    </div>
  );
}
