"use client";

import {
  AlertCircle,
  CheckCircle2,
  ImagePlus,
  LayoutTemplate,
  Palette,
  Type,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { LogoSizeControl } from "@/components/logo-size-control";
import { ArtworkControls } from "@/components/artwork-controls";
import { TruckSign } from "@/components/truck-sign";
import { WhiteSemiTruck } from "@/components/white-semi-truck";
import { clampLogoSize, type LogoSize } from "@/lib/logo-size";
import { digitsOnly, type SignFields } from "@/lib/order";
import {
  STYLE_PRESETS,
  applyPreset,
  type SignPalette,
} from "@/lib/sign-style";
import { TEMPLATES, type SignFontId, type TemplateId } from "@/lib/design";
import { formatPlace, parsePlace } from "@/lib/design/migrate";
import { cn } from "@/lib/utils";

export type TicketApi = {
  fields: SignFields;
  setFields: React.Dispatch<React.SetStateAction<SignFields>>;
  update: <K extends keyof SignFields>(key: K, value: SignFields[K]) => void;
  updateColor: <K extends keyof SignPalette>(key: K, value: string) => void;
  onLogo: (file: File | undefined) => Promise<void> | void;
  logoError: string | null;
  contrastNotes: string[];
  colorPicked: boolean;
  setColorPicked: (value: boolean) => void;
  layoutReady: boolean;
  markLayoutReady: () => void;
  onEdit?: () => void;
  idPrefix?: string;
  showTruck?: boolean;
};

function uid(prefix: string | undefined, id: string) {
  return prefix ? `${prefix}-${id}` : id;
}

export function LetteringFields({
  fields,
  setFields,
  update,
  onLogo,
  logoError,
  onEdit,
  idPrefix = "",
}: Pick<
  TicketApi,
  | "fields"
  | "setFields"
  | "update"
  | "onLogo"
  | "logoError"
  | "onEdit"
  | "idPrefix"
>) {
  return (
    <div className="space-y-3">
      <Field
        id={uid(idPrefix, "companyName")}
        label="MCS-150 name (legal or one trade name)"
        requiredMark
        hint="Must match the name on the motor carrier identification report."
        placeholder="Your door name"
        value={fields.companyName}
        onChange={(value) => update("companyName", value)}
      />
      <Field
        id={uid(idPrefix, "legalName")}
        label="City, State"
        hint="Optional. Prints under the company name. Not a federal marking field."
        placeholder="DALLAS, TX"
        value={formatPlace(fields.city, fields.state)}
        onChange={(value) => {
          const parsed = parsePlace(value);
          setFields((current) => ({
            ...current,
            city: parsed?.city ?? value.trim(),
            state: parsed?.state ?? "",
          }));
          onEdit?.();
        }}
      />
      <Field
        id={uid(idPrefix, "dotNumber")}
        label="USDOT number"
        requiredMark
        hint="Prints as USDOT plus the digits. Required on both sides."
        placeholder="Your USDOT"
        inputMode="numeric"
        value={fields.dotNumber}
        onChange={(value) => update("dotNumber", digitsOnly(value, 12))}
      />
      <Field
        id={uid(idPrefix, "mcNumber")}
        label="MC (FMCSA) number"
        requiredMark
        hint="Prints as MC plus the digits under USDOT. Required on this shop ticket. FMCSA does not require MC on the truck."
        placeholder="Your MC"
        inputMode="numeric"
        value={fields.mcNumber}
        onChange={(value) => update("mcNumber", digitsOnly(value, 10))}
      />
      <div className="space-y-2">
        <Label htmlFor={uid(idPrefix, "logo")}>Logo or existing door sign</Label>
        <label
          htmlFor={uid(idPrefix, "logo")}
          className="flex min-h-11 cursor-pointer items-center gap-3 rounded-lg border border-dashed px-3 py-3 text-sm hover:bg-muted/60"
        >
          <ImagePlus className="size-4 shrink-0" />
          <span className="text-muted-foreground">
            {fields.logoDataUrl
              ? "File attached — tap to replace. Original is kept."
              : "PNG, JPG, SVG, or WebP. Fits 20 × 12 in — never stretched."}
          </span>
        </label>
        <Input
          id={uid(idPrefix, "logo")}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/svg+xml"
          className="sr-only"
          onChange={(event) => {
            void onLogo(event.target.files?.[0]);
            event.target.value = "";
          }}
        />
        {logoError ? (
          <p className="text-sm text-destructive">{logoError}</p>
        ) : null}
        {fields.logoDataUrl ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              setFields((current) => ({
                ...current,
                logoDataUrl: "",
                logoAspect: undefined,
                originalArtworkUrl: "",
                artworkRole: "none",
                artworkFit: "contain",
                artworkOffsetX: 0,
                artworkOffsetY: 0,
                logoContainsName: false,
              }));
              onEdit?.();
            }}
          >
            Remove file
          </Button>
        ) : null}
      {fields.logoDataUrl ? (
        <ArtworkControls
          fields={fields}
          onChange={(patch) => {
            setFields((current) => ({ ...current, ...patch }));
            onEdit?.();
          }}
        />
      ) : null}
      </div>
    </div>
  );
}

export function ColorFields({
  fields,
  setFields,
  updateColor,
  contrastNotes,
  colorPicked,
  setColorPicked,
  idPrefix = "",
  showTruck = true,
}: Pick<
  TicketApi,
  | "fields"
  | "setFields"
  | "updateColor"
  | "contrastNotes"
  | "colorPicked"
  | "setColorPicked"
  | "idPrefix"
  | "showTruck"
>) {
  return (
    <div className="space-y-3">
      {contrastNotes.length ? (
        <Alert>
          <AlertCircle />
          <AlertTitle>Check daylight contrast</AlertTitle>
          <AlertDescription>{contrastNotes[0]}</AlertDescription>
        </Alert>
      ) : null}
      <div className="grid grid-cols-2 gap-2">
        {STYLE_PRESETS.map((preset) => {
          const preview = {
            ...fields,
            ...applyPreset(preset.id),
            showMc: true,
            logoSize: fields.logoSize,
            logoDataUrl: fields.logoDataUrl,
            logoAspect: fields.logoAspect,
            templateId: fields.templateId,
            nameFont: fields.nameFont,
          };
          const selected = colorPicked && fields.paletteId === preset.id;
          return (
            <Button
              key={preset.id}
              type="button"
              variant="outline"
              className={cn(
                "h-auto w-full flex-col items-stretch gap-2 p-2 text-left whitespace-normal",
                selected && "border-[var(--navy)] ring-2 ring-[var(--navy)]",
              )}
              onClick={() => {
                setFields((current) => ({
                  ...current,
                  ...applyPreset(preset.id),
                  showMc: true,
                  nameFont: current.nameFont,
                  logoSize: current.logoSize,
                  templateId: current.templateId,
                  logoDataUrl: current.logoDataUrl,
                  logoAspect: current.logoAspect,
                }));
                setColorPicked(true);
              }}
            >
              <div className="w-full min-w-0">
                <TruckSign
                  fields={preview}
                  className="pointer-events-none w-full shadow-none"
                />
              </div>
              <span className="flex gap-1 px-1" aria-hidden>
                {[
                  preset.colors.face,
                  preset.colors.name,
                  preset.colors.plate,
                  preset.colors.outerBorder,
                ].map((swatch, index) => (
                  <span
                    key={`${preset.id}-${index}`}
                    className="size-3 rounded-full ring-1 ring-black/15"
                    style={{ backgroundColor: swatch }}
                  />
                ))}
              </span>
              <span className="px-1">{preset.label}</span>
              <span className="px-1 text-[11px] font-normal text-muted-foreground">
                {preset.hint}
              </span>
            </Button>
          );
        })}
      </div>
      {showTruck && colorPicked ? (
        <div className="space-y-2">
          <p className="text-xs font-medium text-[var(--navy)]">On the cab door</p>
          <WhiteSemiTruck fields={fields} defaultView="truck" />
        </div>
      ) : null}
      <p className="text-xs font-medium text-[var(--navy)]">Recut any swatch</p>
      <ColorField
        id={uid(idPrefix, "color-name")}
        label="Door name"
        value={fields.colors.name}
        onChange={(value) => updateColor("name", value)}
      />
      <ColorField
        id={uid(idPrefix, "color-legal")}
        label="USDOT and MC"
        value={fields.colors.legal}
        onChange={(value) => updateColor("legal", value)}
      />
      <ColorField
        id={uid(idPrefix, "color-face")}
        label="Face"
        value={fields.colors.face}
        onChange={(value) => updateColor("face", value)}
      />
      <ColorField
        id={uid(idPrefix, "color-border")}
        label="Border"
        value={fields.colors.innerBorder}
        onChange={(value) => updateColor("innerBorder", value)}
      />
    </div>
  );
}

export function LayoutFields({
  fields,
  update,
  markLayoutReady,
  layoutReady,
  idPrefix = "",
}: Pick<
  TicketApi,
  "fields" | "update" | "markLayoutReady" | "layoutReady" | "idPrefix"
>) {
  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <Label>Layout</Label>
        <p className="text-xs text-muted-foreground">
          Each card is a different composition, not a recolor.
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {TEMPLATES.map((template) => {
            const preview = {
              ...fields,
              templateId: template.id as TemplateId,
              showMc: true,
            };
            const selected = fields.templateId === template.id;
            return (
              <Button
                key={template.id}
                type="button"
                variant="outline"
                className={cn(
                  "h-auto w-full flex-col items-stretch gap-1.5 p-1.5 text-left whitespace-normal",
                  selected && "border-[var(--navy)] ring-2 ring-[var(--navy)]",
                )}
                onClick={() => {
                  update("templateId", template.id);
                  markLayoutReady();
                }}
              >
                <div className="w-full min-w-0">
                  <TruckSign
                    fields={preview}
                    className="pointer-events-none w-full shadow-none"
                  />
                </div>
                <span className="px-1 text-xs font-medium">{template.label}</span>
              </Button>
            );
          })}
        </div>
      </div>
      <LogoSizeControl
        id={uid(idPrefix, "logo-size")}
        value={fields.logoSize}
        disabled={!fields.logoDataUrl}
        onChange={(size: LogoSize) => {
          update("logoSize", clampLogoSize(size));
          markLayoutReady();
        }}
      />
      <div className="space-y-2">
        <Label>Door font</Label>
        <div className="grid grid-cols-3 gap-1.5">
          {(
            [
              ["condensed", "Condensed"],
              ["sans", "Bold sans"],
              ["serif", "Serif"],
            ] as const
          ).map(([id, label]) => (
            <Button
              key={id}
              type="button"
              size="sm"
              className="h-11 md:h-8"
              variant={fields.nameFont === id ? "default" : "outline"}
              onClick={() => {
                update("nameFont", id as SignFontId);
                markLayoutReady();
              }}
            >
              {label}
            </Button>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between gap-3">
        <div>
          <Label htmlFor={uid(idPrefix, "chevrons")}>Side chevrons</Label>
          <p className="text-xs text-muted-foreground">
            Accent marks on the left and right of the plaque.
          </p>
        </div>
        <Switch
          id={uid(idPrefix, "chevrons")}
          checked={fields.showChevrons}
          onCheckedChange={(checked) => {
            update("showChevrons", checked);
            markLayoutReady();
          }}
        />
      </div>
      <p className="text-xs text-muted-foreground">
        {layoutReady
          ? "Layout is marked ready for print."
          : "Tap a layout or Continue to lock this 20 × 12 in composition."}
      </p>
    </div>
  );
}

export function CheckItem({ done, label }: { done: boolean; label: string }) {
  return (
    <li
      className={
        done
          ? "flex items-center gap-1.5 font-medium text-[var(--forest)]"
          : "flex items-center gap-1.5 text-muted-foreground"
      }
    >
      {done ? (
        <CheckCircle2 className="size-3.5 shrink-0" />
      ) : (
        <span className="size-3.5 shrink-0 rounded-full border border-current" />
      )}
      {label}
    </li>
  );
}

export function MustSection({
  id,
  step,
  icon,
  title,
  hint,
  done,
  children,
}: {
  id: string;
  step: string;
  icon: React.ReactNode;
  title: string;
  hint: string;
  done: boolean;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="space-y-4 scroll-mt-24">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2">
          <span className="mt-0.5 text-[var(--navy)]">{icon}</span>
          <div>
            <h3 className="font-heading flex items-center gap-2 text-base font-semibold text-[var(--navy)]">
              {step}. {title}
              {done ? (
                <Badge variant="secondary">Done</Badge>
              ) : (
                <Badge>Must</Badge>
              )}
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
          </div>
        </div>
      </div>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

export const TICKET_ICONS = {
  lettering: <Type className="size-4" />,
  colors: <Palette className="size-4" />,
  layout: <LayoutTemplate className="size-4" />,
};

function Field({
  id,
  label,
  value,
  onChange,
  placeholder,
  inputMode,
  hint,
  requiredMark,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  hint?: string;
  requiredMark?: boolean;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>
        {label}
        {requiredMark ? (
          <span className="ml-1 text-destructive">*</span>
        ) : null}
      </Label>
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
      <Input
        id={id}
        name={`vinyl-${id}`}
        value={value}
        placeholder={placeholder}
        inputMode={inputMode}
        autoComplete="off"
        className="h-11 md:h-8"
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}

function ColorField({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <Label htmlFor={id}>{label}</Label>
      <div className="flex items-center gap-2">
        <input
          id={id}
          type="color"
          aria-label={label}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-11 w-11 cursor-pointer rounded border bg-transparent p-0.5 md:h-8 md:w-10"
        />
        <Input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-11 w-[6.75rem] font-mono text-xs md:h-8"
        />
      </div>
    </div>
  );
}
