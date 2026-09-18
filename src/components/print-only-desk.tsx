"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AlertCircle, CheckCircle2, FileUp, Loader2 } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { writeLocalOrder, writeUsername, useUsername } from "@/lib/client-session";
import {
  createOrderId,
  emptySign,
  validateUsername,
  type SignOrder,
} from "@/lib/order";
import {
  PRINT_FILE_MAX_BYTES,
  canPreviewAsImage,
  isPrintFile,
  resolvePrintMime,
} from "@/lib/print-file";
import { shopT } from "@/lib/shop-entry";
import { useShopLang } from "@/lib/shop-lang";

type FileDraft = {
  name: string;
  mime: string;
  dataUrl: string;
  bytes: number;
};

export function PrintOnlyDesk() {
  const lang = useShopLang();
  const storedUsername = useUsername();
  const [usernameDraft, setUsernameDraft] = useState<string | null>(null);
  const username = usernameDraft ?? storedUsername;
  const [file, setFile] = useState<FileDraft | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [exact, setExact] = useState(true);
  const [notes, setNotes] = useState("");
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [placed, setPlaced] = useState<SignOrder | null>(null);

  const modeLabel = useMemo(() => {
    if (exact) return shopT(lang, "printExactMode");
    return shopT(lang, "printNotesMode", {
      notes: notes.trim() || "—",
    });
  }, [exact, lang, notes]);

  async function onPick(list: FileList | null) {
    setFileError(null);
    setPlaced(null);
    const picked = list?.[0];
    if (!picked) return;
    if (!isPrintFile(picked.type, picked.name)) {
      setFile(null);
      setFileError(shopT(lang, "printOnlyBad"));
      return;
    }
    if (picked.size > PRINT_FILE_MAX_BYTES) {
      setFile(null);
      setFileError(shopT(lang, "printOnlyBad"));
      return;
    }
    const mime = resolvePrintMime(picked.type, picked.name);
    if (!mime) {
      setFile(null);
      setFileError(shopT(lang, "printOnlyBad"));
      return;
    }
    const dataUrl = await readAsDataUrl(picked);
    setFile({
      name: picked.name,
      mime,
      dataUrl,
      bytes: picked.size,
    });
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setFormError(null);
    setUsernameError(null);
    if (!file) {
      setFormError(shopT(lang, "printOnlyNeedFile"));
      return;
    }
    const nameError = validateUsername(username);
    if (nameError) {
      setUsernameError(shopT(lang, "printOnlyNeedContact"));
      return;
    }
    setSubmitting(true);
    writeUsername(username.trim());
    const order: SignOrder = {
      ...emptySign(),
      originalArtworkUrl: file.dataUrl,
      id: createOrderId(),
      username: username.trim(),
      source: "web",
      language: lang,
      createdAt: new Date().toISOString(),
      status: "received",
      service: "PRINT_ONLY",
      printExact: exact,
      printNotes: exact ? undefined : notes.trim() || undefined,
      originalFileName: file.name,
      originalMime: file.mime,
    };
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order),
      });
      const saved = response.ok
        ? ((await response.json()) as SignOrder)
        : order;
      if (!response.ok) {
        setFormError(shopT(lang, "printOnlyError"));
      }
      writeLocalOrder(saved);
      setPlaced(saved);
    } catch {
      writeLocalOrder(order);
      setPlaced(order);
      setFormError(shopT(lang, "printOnlyError"));
    } finally {
      setSubmitting(false);
    }
  }

  if (placed && !formError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[var(--navy)]">
            <CheckCircle2 className="size-5" />
            {shopT(lang, "printOnlyPlaced", { id: placed.id })}
          </CardTitle>
          <CardDescription>{shopT(lang, "printOnlySize")}</CardDescription>
        </CardHeader>
        <CardFooter className="flex flex-wrap gap-2">
          <Button asChild>
            <Link href="/orders">{shopT(lang, "myOrders")}</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">{shopT(lang, "backToMenu")}</Link>
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{shopT(lang, "printOnlyTitle")}</CardTitle>
          <CardDescription>{shopT(lang, "printOnlyDrop")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <label className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-[var(--navy)]/20 bg-[color-mix(in_oklch,var(--navy),white_96%)] px-4 py-10 text-center">
            <FileUp className="size-8 text-[var(--navy)]" />
            <span className="text-sm text-muted-foreground">
              {shopT(lang, "printOnlyDrop")}
            </span>
            <Input
              type="file"
              accept=".pdf,.svg,.png,.jpg,.jpeg,.webp,application/pdf,image/svg+xml,image/png,image/jpeg,image/webp"
              className="max-w-xs"
              onChange={(event) => void onPick(event.target.files)}
            />
          </label>
          {fileError ? (
            <Alert variant="destructive">
              <AlertCircle />
              <AlertTitle>{shopT(lang, "printOnlyBad")}</AlertTitle>
              <AlertDescription>{fileError}</AlertDescription>
            </Alert>
          ) : null}
          {file ? (
            <div className="space-y-3 rounded-xl border bg-white p-4">
              <p className="text-sm font-medium text-[var(--navy)]">
                {file.name} · {(file.bytes / 1024).toFixed(0)} KB
              </p>
              {canPreviewAsImage(file.mime) ? (
                // Raster preview only — SVG/PDF are never mounted as live docs.
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={file.dataUrl}
                  alt={file.name}
                  className="max-h-64 w-full rounded-lg object-contain bg-muted"
                />
              ) : (
                <p className="text-sm text-muted-foreground">
                  {file.mime} · {shopT(lang, "printOnlySize")}
                </p>
              )}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setFile(null);
                  setPlaced(null);
                }}
              >
                {shopT(lang, "printOnlyReplace")}
              </Button>
            </div>
          ) : null}
        </CardContent>
      </Card>

      {file ? (
        <Card>
          <CardHeader>
            <CardTitle>{shopT(lang, "printOnlyGot")}</CardTitle>
            <CardDescription>{shopT(lang, "printOnlySize")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                type="button"
                variant={exact ? "default" : "outline"}
                onClick={() => setExact(true)}
              >
                {shopT(lang, "printOnlyExact")}
              </Button>
              <Button
                type="button"
                variant={!exact ? "default" : "outline"}
                onClick={() => setExact(false)}
              >
                {shopT(lang, "printOnlyNotes")}
              </Button>
            </div>
            {!exact ? (
              <Textarea
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                rows={4}
                placeholder={shopT(lang, "printOnlyNotes")}
              />
            ) : null}
            <p className="text-sm text-muted-foreground">{modeLabel}</p>
            <div className="space-y-2">
              <Label htmlFor="print-username">
                {shopT(lang, "printOnlyUsername")}
              </Label>
              <Input
                id="print-username"
                value={username}
                onChange={(event) => {
                  setUsernameDraft(event.target.value);
                  setUsernameError(null);
                }}
                autoComplete="username"
              />
              {usernameError ? (
                <p className="text-sm text-destructive">{usernameError}</p>
              ) : null}
            </div>
          </CardContent>
          <CardFooter className="flex flex-wrap gap-2">
            <Button type="submit" disabled={submitting}>
              {submitting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : null}
              {submitting
                ? shopT(lang, "printOnlyWorking")
                : shopT(lang, "printOnlySubmit")}
            </Button>
            <Button type="button" variant="outline" asChild>
              <Link href="/">{shopT(lang, "backToMenu")}</Link>
            </Button>
          </CardFooter>
        </Card>
      ) : null}

      {formError ? (
        <Alert variant="destructive">
          <AlertCircle />
          <AlertTitle>{formError}</AlertTitle>
        </Alert>
      ) : null}
    </form>
  );
}

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("read failed"));
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.readAsDataURL(file);
  });
}
