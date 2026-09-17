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
import { cn } from "@/lib/utils";

export function ArtworkControls({
  fields,
  onChange,
}: {
  fields: SignFields;
  onChange: (patch: Partial<SignFields>) => void;
}) {
  if (!fields.logoDataUrl) return null;
  const raster = isRasterDataUrl(fields.originalArtworkUrl || fields.logoDataUrl);
  const existing = fields.artworkRole === "existing-sign";
  const uid = useId();

  return (
    <div className="space-y-3 rounded-lg border bg-muted/30 p-3">
      <div className="space-y-2">
        <Label>How should this file print?</Label>
        <div className="grid grid-cols-2 gap-1.5">
          <Button
            type="button"
            size="sm"
            className="h-11 whitespace-normal md:h-8"
            variant={fields.artworkRole !== "existing-sign" ? "default" : "outline"}
            onClick={() => onChange({ artworkRole: "logo" })}
          >
            Company logo
          </Button>
          <Button
            type="button"
            size="sm"
            className="h-11 whitespace-normal md:h-8"
            variant={existing ? "default" : "outline"}
            onClick={() => onChange({ artworkRole: "existing-sign" })}
          >
            Existing door sign
          </Button>
        </div>
      </div>

      {raster ? (
        <Alert>
          <AlertCircle />
          <AlertTitle>Flattened artwork is not live type</AlertTitle>
          <AlertDescription>
            JPG and PNG lettering cannot be edited as vinyl type. Put the MCS-150
            name and USDOT on the ticket if they are missing from this photo. The
            original file is kept — fit and crop never overwrite it.
          </AlertDescription>
        </Alert>
      ) : (
        <p className="text-xs text-muted-foreground">
          Original file is stored. Fitting never stretches or overwrites it.
        </p>
      )}

      <div className="space-y-2">
        <Label>Place on the 20 × 12 in board</Label>
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
                <span className="px-1 text-xs font-medium">{item.label}</span>
                <span className="px-1 text-[11px] font-normal text-muted-foreground">
                  {item.hint}
                </span>
              </Button>
            );
          })}
        </div>
        {fields.artworkFit === "cover" ? (
          <p className="text-xs text-muted-foreground">
            Crop to fill is an explicit choice. Edges of the file will not print.
          </p>
        ) : null}
      </div>

      {fields.artworkFit !== "original" ? (
        <div className="space-y-3">
          <div>
            <Label htmlFor={`${uid}-art-x`}>Nudge horizontally</Label>
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
            <Label htmlFor={`${uid}-art-y`}>Nudge vertically</Label>
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
            Reset placement
          </Button>
        </div>
      ) : null}

      <div className="flex items-center justify-between gap-3">
        <div>
          <Label htmlFor={`${uid}-logo-is-name`}>Logo is my company name</Label>
          <p className="text-xs text-muted-foreground">
            Keep the registered name readable. Do not print it as a second giant
            headline.
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
