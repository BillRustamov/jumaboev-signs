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
  PLAQUE_PRESETS,
  LETTERING_OPTIONS,
  ACCENT_OPTIONS,
  applyPreset,
  composeLetteringAccent,
  letteringIdFromColors,
  accentIdFromColors,
  type SignPalette,
} from "@/lib/sign-style";
import { PRIMARY_TEMPLATES, MORE_TEMPLATES, compileDesign, type SignFontId, type TemplateId } from "@/lib/design";
import { formatPlace, parsePlace } from "@/lib/design/migrate";
import { uiT } from "@/lib/shop-copy";
import {
  artworkFitHint,
  artworkFitLabel,
  localizeNotes,
  presetHint,
  presetName,
  templateName,
} from "@/lib/shop-labels";
import { useShopLang } from "@/lib/shop-lang";
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
  const lang = useShopLang();
  return (
    <div className="space-y-3">
      <Field
        id={uid(idPrefix, "companyName")}
        label={uiT(lang, "mcs150Name")}
        requiredMark
        hint={uiT(lang, "mcs150Hint")}
        placeholder={uiT(lang, "doorNamePlaceholder")}
        value={fields.companyName}
        onChange={(value) => update("companyName", value)}
      />
      <Field
        id={uid(idPrefix, "legalName")}
        label={uiT(lang, "cityState")}
        hint={uiT(lang, "cityStateHint")}
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
        label={uiT(lang, "usdotNumber")}
        requiredMark
        hint={uiT(lang, "usdotHint")}
        placeholder={uiT(lang, "usdotPlaceholder")}
        inputMode="numeric"
        value={fields.dotNumber}
        onChange={(value) => update("dotNumber", digitsOnly(value, 12))}
      />
      <Field
        id={uid(idPrefix, "mcNumber")}
        label={uiT(lang, "mcNumber")}
        requiredMark
        hint={uiT(lang, "mcHint")}
        placeholder={uiT(lang, "mcPlaceholder")}
        inputMode="numeric"
        value={fields.mcNumber}
        onChange={(value) => update("mcNumber", digitsOnly(value, 10))}
      />
      <div className="space-y-2">
        <Label htmlFor={uid(idPrefix, "logo")}>{uiT(lang, "logoOrDoor")}</Label>
        <label
          htmlFor={uid(idPrefix, "logo")}
          className="flex min-h-11 cursor-pointer items-center gap-3 rounded-lg border border-dashed px-3 py-3 text-sm hover:bg-muted/60"
        >
          <ImagePlus className="size-4 shrink-0" />
          <span className="text-muted-foreground">
            {fields.logoDataUrl
              ? uiT(lang, "logoAttached")
              : uiT(lang, "logoEmpty")}
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
            {uiT(lang, "removeFile")}
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
      {fields.logoDataUrl ? (
        <p className="text-xs text-muted-foreground">{uiT(lang, "logoKeepsIds")}</p>
      ) : null}
      {fields.logoDataUrl
        ? localizeNotes(lang, compileDesign({
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
          }).warnings).map((note) => (
            <p key={note} className="text-xs text-[var(--navy)]">
              {note}
            </p>
          ))
        : null}
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
  const lang = useShopLang();
  const contrast = localizeNotes(lang, contrastNotes);
  const letteringId = letteringIdFromColors(fields.colors);
  const accentId = accentIdFromColors(fields.colors);

  function applyLettering(nextLettering: string) {
    const built = composeLetteringAccent(nextLettering, accentId);
    setFields((current) => ({
      ...current,
      paletteId: built.paletteId,
      colors: built.colors,
      showChevrons: false,
    }));
    setColorPicked(true);
  }

  function applyAccent(nextAccent: string) {
    const built = composeLetteringAccent(letteringId, nextAccent);
    setFields((current) => ({
      ...current,
      paletteId: built.paletteId,
      colors: built.colors,
    }));
    setColorPicked(true);
  }

  return (
    <div className="space-y-4">
      {contrast.length ? (
        <Alert>
          <AlertCircle />
          <AlertTitle>{uiT(lang, "checkContrast")}</AlertTitle>
          <AlertDescription>{contrast[0]}</AlertDescription>
        </Alert>
      ) : null}
      <div className="space-y-2">
        <Label>{uiT(lang, "letteringColor")}</Label>
        <div className="grid grid-cols-2 gap-2">
          {LETTERING_OPTIONS.map((option) => {
            const selected = colorPicked && letteringId === option.id;
            return (
              <Button
                key={option.id}
                type="button"
                variant="outline"
                className={cn(
                  "h-11 justify-start gap-2",
                  selected && "border-[var(--navy)] ring-2 ring-[var(--navy)]",
                )}
                onClick={() => applyLettering(option.id)}
              >
                <span
                  className="size-4 rounded-full ring-1 ring-black/15"
                  style={{ backgroundColor: option.ink }}
                />
                <span>{option.label}</span>
              </Button>
            );
          })}
        </div>
      </div>
      <div className="space-y-2">
        <Label>{uiT(lang, "accentColor")}</Label>
        <div className="grid grid-cols-4 gap-2">
          {ACCENT_OPTIONS.map((option) => {
            const selected = colorPicked && accentId === option.id;
            return (
              <Button
                key={option.id}
                type="button"
                variant="outline"
                className={cn(
                  "h-11 flex-col gap-1 px-1",
                  selected && "border-[var(--navy)] ring-2 ring-[var(--navy)]",
                )}
                onClick={() => applyAccent(option.id)}
              >
                <span
                  className="size-3 rounded-full ring-1 ring-black/15"
                  style={{
                    backgroundColor: option.color ?? "#ffffff",
                    boxShadow: option.color ? undefined : "inset 0 0 0 1px #bbb",
                  }}
                />
                <span className="text-[11px] font-normal">
                  {option.id === "none" ? uiT(lang, "accentNone") : option.label}
                </span>
              </Button>
            );
          })}
        </div>
      </div>
      <div className="space-y-2">
        <Label>{uiT(lang, "moreBackgrounds")}</Label>
        <div className="grid grid-cols-2 gap-2">
          {PLAQUE_PRESETS.filter((preset) => preset.id !== "cut-black").map((preset) => {
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
                <span className="px-1">{presetName(lang, preset.id)}</span>
                <span className="px-1 text-[11px] font-normal text-muted-foreground">
                  {presetHint(lang, preset.id)}
                </span>
              </Button>
            );
          })}
        </div>
      </div>
      {showTruck && colorPicked ? (
        <div className="space-y-2">
          <p className="text-xs font-medium text-[var(--navy)]">{uiT(lang, "onCabDoor")}</p>
          <WhiteSemiTruck fields={fields} defaultView="truck" />
        </div>
      ) : null}
      <p className="text-xs font-medium text-[var(--navy)]">{uiT(lang, "recutSwatch")}</p>
      <ColorField
        id={uid(idPrefix, "color-name")}
        label={uiT(lang, "colorDoorName")}
        value={fields.colors.name}
        onChange={(value) => updateColor("name", value)}
      />
      <ColorField
        id={uid(idPrefix, "color-legal")}
        label={uiT(lang, "colorUsdotMc")}
        value={fields.colors.legal}
        onChange={(value) => updateColor("legal", value)}
      />
      <ColorField
        id={uid(idPrefix, "color-face")}
        label={uiT(lang, "colorFace")}
        value={fields.colors.face}
        onChange={(value) => updateColor("face", value)}
      />
      <ColorField
        id={uid(idPrefix, "color-border")}
        label={uiT(lang, "colorBorder")}
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
  const lang = useShopLang();
  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <Label>{uiT(lang, "layoutLabel")}</Label>
        <p className="text-xs text-muted-foreground">
          {uiT(lang, "layoutCardsHint")}
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-2">
          {PRIMARY_TEMPLATES.map((template) => {
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
                <span className="px-1 text-xs font-medium">
                  {templateName(lang, template.id)}
                </span>
              </Button>
            );
          })}
        </div>
        <p className="pt-1 text-xs font-medium text-[var(--navy)]">
          {uiT(lang, "moreLayouts")}
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {MORE_TEMPLATES.map((template) => {
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
                <span className="px-1 text-xs font-medium">
                  {templateName(lang, template.id)}
                </span>
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
        <Label>{uiT(lang, "doorFont")}</Label>
        <div className="grid grid-cols-3 gap-1.5">
          {(
            [
              ["condensed", uiT(lang, "fontCondensed")],
              ["sans", uiT(lang, "fontSans")],
              ["serif", uiT(lang, "fontSerif")],
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
          <Label htmlFor={uid(idPrefix, "chevrons")}>{uiT(lang, "sideChevrons")}</Label>
          <p className="text-xs text-muted-foreground">
            {uiT(lang, "sideChevronsHint")}
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
          ? uiT(lang, "layoutMarkedReady")
          : uiT(lang, "layoutTapToLock")}
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
  const lang = useShopLang();
  return (
    <section id={id} className="space-y-4 scroll-mt-24">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2">
          <span className="mt-0.5 text-[var(--navy)]">{icon}</span>
          <div>
            <h3 className="font-heading flex items-center gap-2 text-base font-semibold text-[var(--navy)]">
              {step}. {title}
              {done ? (
                <Badge variant="secondary">{uiT(lang, "done")}</Badge>
              ) : (
                <Badge>{uiT(lang, "must")}</Badge>
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
