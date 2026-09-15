"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AlertCircle, CheckCircle2, ImagePlus, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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
import { TruckSign } from "@/components/truck-sign";
import {
  useIsClient,
  useUsername,
  writeLocalOrder,
  writeUsername,
} from "@/lib/client-session";
import {
  SAMPLE_SIGN,
  createOrderId,
  emptySign,
  validateSign,
  validateUsername,
  type SignFields,
  type SignOrder,
} from "@/lib/order";

const MAX_LOGO_BYTES = 4 * 1024 * 1024;

export function OrderStudio() {
  const storedUsername = useUsername();
  const isClient = useIsClient();
  const [createdUsername, setCreatedUsername] = useState("");
  const username = createdUsername || storedUsername;
  const [usernameDraft, setUsernameDraft] = useState("");
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [fields, setFields] = useState<SignFields>(emptySign());
  const [logoError, setLogoError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [placed, setPlaced] = useState<SignOrder | null>(null);

  const previewReady = useMemo(
    () =>
      Boolean(
        fields.companyName.trim() ||
          fields.legalName.trim() ||
          fields.dotNumber.trim() ||
          fields.mcNumber.trim(),
      ),
    [fields],
  );

  function update<K extends keyof SignFields>(key: K, value: SignFields[K]) {
    setFields((current) => ({ ...current, [key]: value }));
    setFormError(null);
  }

  function saveUsername(event: React.FormEvent) {
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

  async function submitOrder(event: React.FormEvent) {
    event.preventDefault();
    const issues = validateSign(fields);
    if (issues.length) {
      setFormError(issues[0] ?? "Check the print fields.");
      return;
    }
    setSubmitting(true);
    setFormError(null);
    const order: SignOrder = {
      ...fields,
      id: createOrderId(),
      username,
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

  if (!isClient) {
    return (
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
        <Card>
          <CardHeader>
            <CardTitle>Loading your desk</CardTitle>
            <CardDescription>
              Restoring the last username used in this browser.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="h-8 animate-pulse rounded-lg bg-muted" />
            <div className="h-8 animate-pulse rounded-lg bg-muted" />
            <div className="h-8 animate-pulse rounded-lg bg-muted" />
          </CardContent>
        </Card>
        <div className="aspect-square animate-pulse rounded-[4%] bg-muted" />
      </div>
    );
  }

  if (!username) {
    return (
      <Card className="mx-auto max-w-lg">
        <CardHeader>
          <CardTitle>Create a shop username</CardTitle>
          <CardDescription>
            No account password. This name tags your order so Khurshid can find
            it in Telegram or on this site.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={saveUsername}>
            {usernameError ? (
              <Alert variant="destructive">
                <AlertCircle />
                <AlertTitle>Username not accepted</AlertTitle>
                <AlertDescription>{usernameError}</AlertDescription>
              </Alert>
            ) : null}
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
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
            <Button type="submit">Continue to the door design</Button>
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] xl:grid-cols-[minmax(0,24rem)_minmax(0,1fr)]">
      <form className="space-y-4" onSubmit={submitOrder}>
        <Card>
          <CardHeader>
            <CardTitle>Print fields</CardTitle>
            <CardDescription>
              Signed in as <span className="font-medium text-foreground">{username}</span>
              . Type below and the 24×24 door updates live.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {formError ? (
              <Alert variant="destructive">
                <AlertCircle />
                <AlertTitle>Could not finish that order</AlertTitle>
                <AlertDescription>{formError}</AlertDescription>
              </Alert>
            ) : null}
            <Field
              id="companyName"
              label="Company name on the door"
              placeholder="ELBRUS"
              value={fields.companyName}
              onChange={(value) => update("companyName", value)}
            />
            <Field
              id="legalName"
              label="Legal name"
              placeholder="ELBRUS FREIGHTLINES LLC"
              value={fields.legalName}
              onChange={(value) => update("legalName", value)}
            />
            <Field
              id="dotNumber"
              label="DOT number"
              placeholder="20179229"
              inputMode="numeric"
              value={fields.dotNumber}
              onChange={(value) => update("dotNumber", value)}
            />
            <Field
              id="mcNumber"
              label="MC number"
              placeholder="796405"
              inputMode="numeric"
              value={fields.mcNumber}
              onChange={(value) => update("mcNumber", value)}
            />
            <Field
              id="fleetNumber"
              label="Fleet / unit number (optional)"
              placeholder="104"
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
            <div className="flex flex-wrap gap-2 pt-1">
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
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setFields(SAMPLE_SIGN);
                  setFormError(null);
                  setLogoError(null);
                }}
              >
                Load ELBRUS sample
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>

      <div className="lg:sticky lg:top-6">
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <p className="text-sm font-medium">Live 24×24 door</p>
            <p className="text-xs text-muted-foreground">
              {previewReady
                ? "Printed as a matched pair, one for each cab door."
                : "Empty sign — start typing and the gold/navy layout fills in."}
            </p>
          </div>
        </div>
        <TruckSign fields={fields} className="max-w-[520px] shadow-lg" />
      </div>

      <Dialog open={Boolean(placed)} onOpenChange={() => setPlaced(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="size-5 text-[var(--forest)]" />
              Order {placed?.id} received
            </DialogTitle>
            <DialogDescription>
              {placed
                ? `${placed.companyName} · DOT ${placed.dotNumber} · MC ${placed.mcNumber}. Khurshid will print two 24×24 vinyl doors for @${placed.username}.`
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
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        value={value}
        placeholder={placeholder}
        inputMode={inputMode}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}
