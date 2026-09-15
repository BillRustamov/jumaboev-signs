"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AlertCircle, CheckCircle2, ImagePlus, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { sampleById, DRIVER_SAMPLES, type DriverSample } from "@/lib/samples";
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
  const [fields, setFields] = useState<SignFields>(start.fields);
  const [activeSample, setActiveSample] = useState<string | null>(start.id);
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

  function applySample(sample: DriverSample) {
    setFields(sample.fields);
    setActiveSample(sample.id);
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
    setActiveSample(null);
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
    const issues = validateSign(fields);
    if (issues.length) {
      setFormError(issues[0] ?? "Check the print fields.");
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
                  ? "Matched pair for both cab doors. Change logo size in Lettering or Layout."
                  : "Tap a sample above, or type your MCS-150 name and USDOT."}
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
                49 CFR 390.21 needs the MCS-150 name and{" "}
                <span className="font-medium text-foreground">USDOT</span> on
                both doors. MC, fleet, and logo are extra.
                {username ? (
                  <>
                    {" "}
                    Ticket as{" "}
                    <span className="font-medium text-foreground">
                      @{username}
                    </span>
                    .
                  </>
                ) : (
                  " Add a shop handle when you place the order."
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="lettering">
                <TabsList className="w-full">
                  <TabsTrigger value="lettering">Lettering</TabsTrigger>
                  <TabsTrigger value="colors">Colors</TabsTrigger>
                  <TabsTrigger value="layout">Layout</TabsTrigger>
                </TabsList>
                <TabsContent value="lettering" className="space-y-3 pt-4">
                  {formError ? (
                    <Alert variant="destructive">
                      <AlertCircle />
                      <AlertTitle>Could not finish that order</AlertTitle>
                      <AlertDescription>{formError}</AlertDescription>
                    </Alert>
                  ) : null}
                  <Field
                    id="companyName"
                    label="MCS-150 name (legal or one trade name)"
                    hint="Must match the name on the motor carrier identification report."
                    placeholder="ELBRUS"
                    value={fields.companyName}
                    onChange={(value) => update("companyName", value)}
                  />
                  <Field
                    id="legalName"
                    label="Second line (optional)"
                    hint="Use this if you print a big trade name and the LLC line under it."
                    placeholder="ELBRUS FREIGHTLINES LLC"
                    value={fields.legalName}
                    onChange={(value) => update("legalName", value)}
                  />
                  <Field
                    id="dotNumber"
                    label="USDOT number"
                    hint="Prints as USDOT plus the digits. Required on both sides."
                    placeholder="20179229"
                    inputMode="numeric"
                    value={fields.dotNumber}
                    onChange={(value) => update("dotNumber", value)}
                  />
                  <Field
                    id="mcNumber"
                    label="MC number (optional)"
                    hint="Not required by FMCSA. Turn the plate off in Layout if you skip it."
                    placeholder="796405"
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
                          ? "Logo attached — click to replace"
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
                  <LogoSizeControl
                    value={fields.logoSize}
                    disabled={!fields.logoDataUrl}
                    onChange={(size: LogoSize) => {
                      setFields((current) => ({ ...current, logoSize: size }));
                      setFormError(null);
                    }}
                  />
                </TabsContent>
                <TabsContent value="colors" className="space-y-3 pt-4">
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
                          fields.paletteId === preset.id ? "default" : "outline"
                        }
                        className="h-auto flex-col items-start gap-0.5 py-2 text-left"
                        onClick={() =>
                          setFields((current) => ({
                            ...current,
                            ...applyPreset(preset.id),
                            showMc: current.showMc,
                            logoSize: current.logoSize,
                          }))
                        }
                      >
                        <span>{preset.label}</span>
                        <span className="text-[11px] font-normal text-muted-foreground">
                          {preset.hint}
                        </span>
                      </Button>
                    ))}
                  </div>
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
                </TabsContent>
                <TabsContent value="layout" className="space-y-4 pt-4">
                  <LogoSizeControl
                    value={fields.logoSize}
                    disabled={!fields.logoDataUrl}
                    onChange={(size: LogoSize) => {
                      setFields((current) => ({ ...current, logoSize: size }));
                      setFormError(null);
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
                      onCheckedChange={(checked) =>
                        update("nameFont", checked ? "condensed" : "serif")
                      }
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
                      onCheckedChange={(checked) => update("showMc", checked)}
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
                      onCheckedChange={(checked) =>
                        update("showChevrons", checked)
                      }
                    />
                  </div>
                </TabsContent>
            </Tabs>
            </CardContent>
            <CardFooter className="justify-start gap-2">
              <Button type="submit" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="animate-spin" />
                    Sending to the shop
                  </>
                ) : (
                  "Place vinyl order"
                )}
              </Button>
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

function Field({
  id,
  label,
  value,
  onChange,
  placeholder,
  inputMode,
  hint,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  hint?: string;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
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
