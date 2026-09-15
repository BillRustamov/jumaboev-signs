"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  AlertCircle,
  CheckCircle2,
  ImagePlus,
  Loader2,
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
import { SampleGallery } from "@/components/sample-gallery";
import { TruckSign } from "@/components/truck-sign";
import {
  useUsername,
  writeLocalOrder,
  writeUsername,
} from "@/lib/client-session";
import { clampLogoSize, type LogoSize } from "@/lib/logo-size";
import {
  createOrderId,
  emptySign,
  validateSign,
  validateUsername,
  type SignFields,
  type SignOrder,
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
  const storedUsername = useUsername();
  const [createdUsername, setCreatedUsername] = useState("");
  const username = createdUsername || storedUsername;
  const [usernameDraft, setUsernameDraft] = useState("");
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [askUsername, setAskUsername] = useState(false);
  const [fields, setFields] = useState<SignFields>(lookFromSample(start));
  const [activeSample, setActiveSample] = useState<string | null>(start.id);
  const [colorPicked, setColorPicked] = useState(false);
  const [layoutReady, setLayoutReady] = useState(false);
  const [logoError, setLogoError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [placed, setPlaced] = useState<SignOrder | null>(null);

  const requestedSample = searchParams.get(SAMPLE_QUERY);

  useEffect(() => {
    const sample = sampleById(requestedSample);
    if (sample) applySample(sample);
  }, [requestedSample]);

  const previewReady = useMemo(
    () =>
      Boolean(
        fields.companyName.trim() ||
          fields.legalName.trim() ||
          fields.dotNumber.trim() ||
          fields.mcNumber.trim() ||
          fields.logoDataUrl,
      ),
    [fields],
  );
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
  const remaining = [
    !letteringDone ? "lettering" : null,
    !colorPicked ? "colors" : null,
    !layoutReady ? "layout" : null,
  ].filter(Boolean) as string[];

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

  function saveUsernameFromDialog(event: React.FormEvent) {
    event.preventDefault();
    const error = validateUsername(usernameDraft);
    if (error) {
      setUsernameError(error);
      return;
    }
    const next = usernameDraft.trim();
    writeUsername(next);
    setCreatedUsername(next);
    setUsernameError(null);
    setAskUsername(false);
    void placeOrder(next);
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
    if (!username) {
      setAskUsername(true);
      return;
    }
    void placeOrder(username);
  }

  async function placeOrder(ticketName: string) {
    setSubmitting(true);
    setFormError(null);
    const order: SignOrder = {
      ...fields,
      logoSize: clampLogoSize(fields.logoSize),
      id: createOrderId(),
      username: ticketName,
      source: "web",
      createdAt: new Date().toISOString(),
      status: "received",
    };
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order),
      });
      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as
          | { error?: string }
          | null;
        throw new Error(payload?.error ?? "The shop could not take that order.");
      }
      const saved = (await response.json()) as SignOrder;
      writeLocalOrder(saved);
      setPlaced(saved);
    } catch (err) {
      writeLocalOrder(order);
      setPlaced(order);
      setFormError(
        err instanceof Error
          ? `${err.message} Saved on this device so the shop copy is not lost.`
          : "Saved on this device after a network error.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-8">
      <SampleGallery activeId={activeSample} onPick={applySample} />

      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <div className="lg:sticky lg:top-6">
          <div className="mb-3 flex items-end justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-[var(--navy)]">
                Live 24×24 vinyl
              </p>
              <p className="text-xs text-muted-foreground">
                {previewReady
                  ? "This is what prints. Finish lettering, colors, and layout on the ticket."
                  : "Sample look is on. Type your MCS-150 name and USDOT to replace the ghost type."}
              </p>
            </div>
            <p className="hidden text-xs font-medium tracking-wide text-muted-foreground sm:block">
              24 in × 24 in
            </p>
          </div>
          <div className="rounded-xl bg-neutral-100 p-3 shadow-inner ring-1 ring-black/10 sm:p-5">
            <TruckSign
              fields={fields}
              className="mx-auto max-w-[560px] shadow-lg"
              data-testid="live-vinyl"
            />
          </div>
        </div>

        <form className="space-y-4" onSubmit={onPlaceClick} autoComplete="off">
          <Card>
            <CardHeader className="border-b">
              <CardTitle>Print ticket</CardTitle>
              <CardDescription>
                Do these three before we cut vinyl. A sample is only a look —
                your MCS-150 name, USDOT, colors, and layout have to be set
                here.
                {username ? (
                  <>
                    {" "}
                    Ticket as{" "}
                    <span className="font-medium text-foreground">
                      @{username}
                    </span>
                    .
                  </>
                ) : null}
              </CardDescription>
              <ol className="mt-3 grid gap-2 text-sm sm:grid-cols-3">
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
                <Field
                  id="fleetNumber"
                  label="Fleet / unit number (optional)"
                  placeholder="A12"
                  value={fields.fleetNumber}
                  onChange={(value) => update("fleetNumber", value)}
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
                hint="Required. Tap the set that should print, even if you keep the sample look."
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
                  {STYLE_PRESETS.map((preset) => (
                    <Button
                      key={preset.id}
                      type="button"
                      variant={
                        colorPicked && fields.paletteId === preset.id
                          ? "default"
                          : "outline"
                      }
                      className="h-auto flex-col items-start gap-2 py-3 text-left"
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
                      <span className="flex gap-1" aria-hidden>
                        {[
                          preset.colors.face,
                          preset.colors.name,
                          preset.colors.plate,
                          preset.colors.outerBorder,
                        ].map((swatch, index) => (
                          <span
                            key={`${preset.id}-${index}`}
                            className="size-4 rounded-full ring-1 ring-black/15"
                            style={{ backgroundColor: swatch }}
                          />
                        ))}
                      </span>
                      <span>{preset.label}</span>
                      <span className="text-[11px] font-normal text-muted-foreground">
                        {preset.hint}
                      </span>
                    </Button>
                  ))}
                </div>
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
              <Button type="submit" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="animate-spin" />
                    Sending to the shop
                  </>
                ) : canPrint ? (
                  "Place vinyl order"
                ) : (
                  `Finish ${remaining.join(", ")} first`
                )}
              </Button>
              {!canPrint ? (
                <p className="text-xs text-muted-foreground">
                  Vinyl does not cut until lettering, colors, and layout are
                  set.
                </p>
              ) : null}
            </CardFooter>
          </Card>
        </form>
      </div>

      <Dialog open={askUsername} onOpenChange={setAskUsername}>
        <DialogContent>
          <form onSubmit={saveUsernameFromDialog}>
            <DialogHeader>
              <DialogTitle>Tag this ticket</DialogTitle>
              <DialogDescription>
                No password. Khurshid uses this handle to find the pair in
                Telegram or on this site.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 py-4">
              {usernameError ? (
                <Alert variant="destructive">
                  <AlertCircle />
                  <AlertTitle>Username not accepted</AlertTitle>
                  <AlertDescription>{usernameError}</AlertDescription>
                </Alert>
              ) : null}
              <div className="space-y-2">
                <Label htmlFor="username">Shop username</Label>
                <Input
                  id="username"
                  autoComplete="username"
                  placeholder="elbrus_dispatch"
                  value={usernameDraft}
                  onChange={(event) => {
                    setUsernameDraft(event.target.value);
                    setUsernameError(null);
                  }}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setAskUsername(false)}
              >
                Keep designing
              </Button>
              <Button type="submit">Place order</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(placed)} onOpenChange={() => setPlaced(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="size-5 text-[var(--forest)]" />
              Order {placed?.id} received
            </DialogTitle>
            <DialogDescription>
              {placed
                ? `${placed.companyName} · USDOT ${placed.dotNumber}${
                    placed.showMc && placed.mcNumber
                      ? ` · MC ${placed.mcNumber}`
                      : ""
                  }. Two 24×24 vinyl doors for @${placed.username}.`
                : null}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" asChild>
              <Link href="/orders">View shop orders</Link>
            </Button>
            <Button
              onClick={() => {
                setPlaced(null);
                setFields(emptySign());
                setActiveSample("blank");
                setColorPicked(false);
                setLayoutReady(false);
              }}
            >
              Design another door
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
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
    <section id={id} className="space-y-4 scroll-mt-6">
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
          className="h-8 w-10 cursor-pointer rounded border bg-transparent p-0.5"
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
