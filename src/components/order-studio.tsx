"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  AlertCircle,
  CheckCircle2,
  ImagePlus,
  Palette,
  Type,
  LayoutTemplate,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { LogoSizeControl } from "@/components/logo-size-control";
import { TruckSign } from "@/components/truck-sign";
import { WhiteSemiTruck } from "@/components/white-semi-truck";
import { LiveVinylDock } from "@/components/live-vinyl-dock";
import { SampleGallery } from "@/components/sample-gallery";
import { addToCart, type CartItem } from "@/lib/cart";
import { clampLogoSize, type LogoSize } from "@/lib/logo-size";
import {
  validateSign,
  type SignFields,
} from "@/lib/order";
import {
  DRIVER_SAMPLES,
  isDemoLettering,
  lookFromSample,
  sampleById,
  type DriverSample,
} from "@/lib/samples";
import {
  STYLE_PRESETS,
  applyPreset,
  contrastWarnings,
  type SignPalette,
} from "@/lib/sign-style";

const MAX_LOGO_BYTES = 4 * 1024 * 1024;
const SAMPLE_QUERY = "sample";

export function OrderStudio() {
  const searchParams = useSearchParams();
  const start =
    sampleById(searchParams.get(SAMPLE_QUERY)) ?? DRIVER_SAMPLES[0];
  const [fields, setFields] = useState<SignFields>(lookFromSample(start));
  const [activeSample, setActiveSample] = useState<string | null>(start.id);
  const [colorPicked, setColorPicked] = useState(false);
  const [layoutReady, setLayoutReady] = useState(false);
  const [logoError, setLogoError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [added, setAdded] = useState<CartItem | null>(null);

  const requestedSample = searchParams.get(SAMPLE_QUERY);

  useEffect(() => {
    const sample = sampleById(requestedSample);
    if (sample) applySample(sample);
  }, [requestedSample]);

  const contrastNotes = useMemo(
    () => contrastWarnings(fields.colors),
    [fields.colors],
  );
  const letteringIssues = useMemo(() => {
    const issues = validateSign(fields);
    if (isDemoLettering(fields)) {
      return [
        "This is still a sample door. Put your MCS-150 name and USDOT before we print.",
      ];
    }
    return issues;
  }, [fields]);
  const letteringDone = letteringIssues.length === 0;
  const canPrint = letteringDone && colorPicked && layoutReady;

  function applySample(sample: DriverSample) {
    setFields(lookFromSample(sample));
    setActiveSample(sample.id);
    setColorPicked(false);
    setLayoutReady(false);
    setFormError(null);
    setLogoError(null);
  }

  function update<K extends keyof SignFields>(key: K, value: SignFields[K]) {
    setFields((current) => ({ ...current, [key]: value }));
    setActiveSample(null);
    setFormError(null);
  }

  function updateColor<K extends keyof SignPalette>(key: K, value: string) {
    setFields((current) => ({
      ...current,
      paletteId: "custom",
      colors: { ...current.colors, [key]: value },
    }));
    setColorPicked(true);
    setActiveSample(null);
    setFormError(null);
  }

  function markLayoutReady() {
    setLayoutReady(true);
    setFormError(null);
  }

  async function onLogo(file: File | undefined) {
    setLogoError(null);
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setLogoError("Upload a PNG, JPG, SVG, or WebP logo.");
      return;
    }
    if (file.size > MAX_LOGO_BYTES) {
      setLogoError("Logo must be 4 MB or smaller.");
      return;
    }
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(new Error("Could not read that file."));
      reader.readAsDataURL(file);
    }).catch((err: Error) => {
      setLogoError(err.message);
      return "";
    });
    if (dataUrl) update("logoDataUrl", dataUrl);
  }

  function onPlaceClick(event: React.FormEvent) {
    event.preventDefault();
    if (!letteringDone) {
      setFormError(letteringIssues[0] ?? "Put your name and USDOT on the door.");
      document.getElementById("must-lettering")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      return;
    }
    if (!colorPicked) {
      setFormError("Tap a color set so we know what to print.");
      document.getElementById("must-colors")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      return;
    }
    if (!layoutReady) {
      setFormError("Set logo size and plates, then mark the layout ready.");
      document.getElementById("must-layout")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      return;
    }
    const item = addToCart({
      ...fields,
      fleetNumber: "",
      logoSize: clampLogoSize(fields.logoSize),
    });
    setAdded(item);
  }

  return (
    <>
    <div className="flex flex-col gap-4 lg:grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:grid-rows-[auto_1fr] lg:gap-8">
      <div className="order-1 lg:order-none lg:col-start-1 lg:row-start-2">
        <LiveVinylDock fields={fields} />
      </div>

      <div className="order-2 lg:order-none lg:col-span-2 lg:row-start-1">
        <SampleGallery activeId={activeSample} onPick={applySample} />
      </div>

      <form
        className="order-3 space-y-4 lg:order-none lg:col-start-2 lg:row-start-2"
        onSubmit={onPlaceClick}
        autoComplete="off"
      >
          <Card>
            <CardHeader className="border-b">
              <CardTitle>Print ticket</CardTitle>
              <CardDescription className="hidden sm:block">
                Do these three, then add the pair to your cart. Unit numbers
                are a separate small print.
              </CardDescription>
              <CardDescription className="sm:hidden">
                Required before the cart.
              </CardDescription>
              <ol className="mt-3 grid grid-cols-3 gap-1 text-xs sm:gap-2 sm:text-sm">
                <CheckItem done={letteringDone} label="1. Lettering" />
                <CheckItem done={colorPicked} label="2. Colors" />
                <CheckItem done={layoutReady} label="3. Layout" />
              </ol>
            </CardHeader>
            <CardContent className="space-y-8 pt-6">
              {formError ? (
                <Alert variant="destructive">
                  <AlertCircle />
                  <AlertTitle>Could not finish that order</AlertTitle>
                  <AlertDescription>{formError}</AlertDescription>
                </Alert>
              ) : null}

              <MustSection
                id="must-lettering"
                step="1"
                icon={<Type className="size-4" />}
                title="Lettering"
                hint="Required. Put the name and USDOT that should actually print — not the sample."
                done={letteringDone}
              >
                <Field
                  id="companyName"
                  label="MCS-150 name (legal or one trade name)"
                  requiredMark
                  hint="Must match the name on the motor carrier identification report."
                  placeholder="Your door name"
                  value={fields.companyName}
                  onChange={(value) => update("companyName", value)}
                />
                <Field
                  id="legalName"
                  label="Second line (optional)"
                  hint="Use this if you print a big trade name and the LLC line under it."
                  placeholder="YOUR COMPANY LLC"
                  value={fields.legalName}
                  onChange={(value) => update("legalName", value)}
                />
                <Field
                  id="dotNumber"
                  label="USDOT number"
                  requiredMark
                  hint="Prints as USDOT plus the digits. Required on both sides."
                  placeholder="Your USDOT"
                  inputMode="numeric"
                  value={fields.dotNumber}
                  onChange={(value) => update("dotNumber", value)}
                />
                <Field
                  id="mcNumber"
                  label="MC number"
                  hint={
                    fields.showMc
                      ? "Required while the MC plate is on. Turn the plate off in Layout if you skip it."
                      : "Plate is off in Layout. Turn it on if you want MC on the door."
                  }
                  placeholder="Your MC"
                  inputMode="numeric"
                  value={fields.mcNumber}
                  onChange={(value) => update("mcNumber", value)}
                />
                <div className="space-y-2">
                  <Label htmlFor="logo">Logo (optional)</Label>
                  <label
                    htmlFor="logo"
                    className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed px-3 py-3 text-sm hover:bg-muted/60"
                  >
                    <ImagePlus className="size-4 shrink-0" />
                    <span className="text-muted-foreground">
                      {fields.logoDataUrl
                        ? "Logo attached — click to replace the sample mark"
                        : "PNG or JPG, sits above the company name"}
                    </span>
                  </label>
                  <Input
                    id="logo"
                    type="file"
                    accept="image/*"
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
                      onClick={() => update("logoDataUrl", "")}
                    >
                      Remove logo
                    </Button>
                  ) : null}
                </div>
              </MustSection>

              <MustSection
                id="must-colors"
                step="2"
                icon={<Palette className="size-4" />}
                title="Colors"
                hint="Required. Tap a look — each card is that color on the door. The truck below matches the cart."
                done={colorPicked}
              >
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
                      showMc: fields.showMc,
                      logoSize: fields.logoSize,
                      logoDataUrl: fields.logoDataUrl,
                    };
                    const selected =
                      colorPicked && fields.paletteId === preset.id;
                    return (
                      <Button
                        key={preset.id}
                        type="button"
                        variant={selected ? "default" : "outline"}
                        className="h-auto flex-col items-stretch gap-2 p-2 text-left"
                        onClick={() => {
                          setFields((current) => ({
                            ...current,
                            ...applyPreset(preset.id),
                            showMc: current.showMc,
                            logoSize: current.logoSize,
                            logoDataUrl: current.logoDataUrl,
                          }));
                          setColorPicked(true);
                          setFormError(null);
                        }}
                      >
                        <TruckSign
                          fields={preview}
                          className="pointer-events-none w-full shadow-none"
                        />
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
                {colorPicked ? (
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-[var(--navy)]">
                      On the cab — same mockup as the cart
                    </p>
                    <WhiteSemiTruck fields={fields} />
                  </div>
                ) : null}
                <p className="text-xs font-medium text-[var(--navy)]">
                  Recut any swatch
                </p>
                <ColorField
                  label="Door name"
                  value={fields.colors.name}
                  onChange={(value) => updateColor("name", value)}
                />
                <ColorField
                  label="Second line"
                  value={fields.colors.legal}
                  onChange={(value) => updateColor("legal", value)}
                />
                <ColorField
                  label="Face"
                  value={fields.colors.face}
                  onChange={(value) => updateColor("face", value)}
                />
                <ColorField
                  label="Number plate"
                  value={fields.colors.plate}
                  onChange={(value) => updateColor("plate", value)}
                />
                <ColorField
                  label="Plate type"
                  value={fields.colors.plateText}
                  onChange={(value) => updateColor("plateText", value)}
                />
                <ColorField
                  label="Outer border"
                  value={fields.colors.outerBorder}
                  onChange={(value) => updateColor("outerBorder", value)}
                />
                <ColorField
                  label="Inner border"
                  value={fields.colors.innerBorder}
                  onChange={(value) => updateColor("innerBorder", value)}
                />
                <ColorField
                  label="Rule"
                  value={fields.colors.rule}
                  onChange={(value) => updateColor("rule", value)}
                />
                <ColorField
                  label="Accent"
                  value={fields.colors.accent}
                  onChange={(value) => updateColor("accent", value)}
                />
              </MustSection>

              <MustSection
                id="must-layout"
                step="3"
                icon={<LayoutTemplate className="size-4" />}
                title="Layout"
                hint="Required. Set how large the logo prints, then confirm the plates."
                done={layoutReady}
              >
                <LogoSizeControl
                  value={fields.logoSize}
                  disabled={!fields.logoDataUrl}
                  onChange={(size: LogoSize) => {
                    setFields((current) => ({ ...current, logoSize: size }));
                    markLayoutReady();
                  }}
                />
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <Label htmlFor="nameFont">Condensed door name</Label>
                    <p className="text-xs text-muted-foreground">
                      Off = Elbrus serif. On = gothic condensed.
                    </p>
                  </div>
                  <Switch
                    id="nameFont"
                    checked={fields.nameFont === "condensed"}
                    onCheckedChange={(checked) => {
                      update("nameFont", checked ? "condensed" : "serif");
                      markLayoutReady();
                    }}
                  />
                </div>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <Label htmlFor="showMc">Print MC plate</Label>
                    <p className="text-xs text-muted-foreground">
                      FMCSA does not require MC on the door.
                    </p>
                  </div>
                  <Switch
                    id="showMc"
                    checked={fields.showMc}
                    onCheckedChange={(checked) => {
                      update("showMc", checked);
                      markLayoutReady();
                    }}
                  />
                </div>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <Label htmlFor="showChevrons">Gold/red chevrons</Label>
                    <p className="text-xs text-muted-foreground">
                      Decorative only. Not part of 390.21.
                    </p>
                  </div>
                  <Switch
                    id="showChevrons"
                    checked={fields.showChevrons}
                    onCheckedChange={(checked) => {
                      update("showChevrons", checked);
                      markLayoutReady();
                    }}
                  />
                </div>
                <Button
                  type="button"
                  variant={layoutReady ? "default" : "outline"}
                  className="w-full"
                  onClick={markLayoutReady}
                >
                  {layoutReady
                    ? "Layout ready for print"
                    : "This layout is ready"}
                </Button>
              </MustSection>
            </CardContent>
            <CardFooter className="flex-col items-stretch gap-2 sm:flex-row sm:items-center">
              <Button
                type="submit"
                className="h-auto min-h-9 whitespace-normal sm:whitespace-nowrap"
              >
                {canPrint ? "Add pair to cart" : "Finish required steps first"}
              </Button>
              {!canPrint ? (
                <p className="text-xs text-muted-foreground">
                  Vinyl does not go in the cart until lettering, colors, and
                  layout are set.
                </p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Checkout shows this door on a white semi.
                </p>
              )}
            </CardFooter>
          </Card>
        </form>
    </div>

      <Dialog open={Boolean(added)} onOpenChange={() => setAdded(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="size-5 text-[var(--forest)]" />
              Pair in the cart
            </DialogTitle>
            <DialogDescription>
              {added
                ? `${added.fields.companyName} · USDOT ${added.fields.dotNumber}. Approximately 10×20 in for each cab side. Checkout shows them on the truck.`
                : null}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" asChild>
              <Link href="/cart">View cart</Link>
            </Button>
            <Button asChild>
              <Link href="/checkout">Checkout</Link>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function CheckItem({ done, label }: { done: boolean; label: string }) {
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

function MustSection({
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
    <section id={id} className="space-y-4 scroll-mt-[11.5rem] lg:scroll-mt-24">
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
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <Label>{label}</Label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          aria-label={label}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-11 w-11 cursor-pointer rounded border bg-transparent p-0.5 md:h-8 md:w-10"
        />
        <Input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-[6.75rem] font-mono text-xs"
        />
      </div>
    </div>
  );
}
