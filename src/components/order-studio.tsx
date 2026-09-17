"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AlertCircle, CheckCircle2, RotateCcw, Sparkles } from "lucide-react";
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
import { LiveVinylDock } from "@/components/live-vinyl-dock";
import { SampleGallery } from "@/components/sample-gallery";
import {
  CheckItem,
  ColorFields,
  LayoutFields,
  LetteringFields,
  MustSection,
  TICKET_ICONS,
  type TicketApi,
} from "@/components/designer-ticket";
import {
  MobileDesigner,
  type WizardStep,
} from "@/components/mobile-designer";
import { addToCart, type CartItem } from "@/lib/cart";
import { autoImprove } from "@/lib/auto-improve";
import { suggestArtworkRole } from "@/lib/artwork";
import { clampLogoSize } from "@/lib/logo-size";
import { validateSign, type SignFields } from "@/lib/order";
import {
  DRIVER_SAMPLES,
  isDemoLettering,
  lookFromSample,
  sampleById,
  type DriverSample,
} from "@/lib/samples";
import { contrastWarnings, type SignPalette } from "@/lib/sign-style";

const MAX_LOGO_BYTES = 4 * 1024 * 1024;
const SAMPLE_QUERY = "sample";

export function OrderStudio() {
  const searchParams = useSearchParams();
  const start =
    sampleById(searchParams.get(SAMPLE_QUERY)) ?? DRIVER_SAMPLES[0];
  const [fields, setFields] = useState<SignFields>(lookFromSample(start));
  const [activeSample, setActiveSample] = useState<string | null>(start.id);
  const [resetSampleId, setResetSampleId] = useState(start.id);
  const [colorPicked, setColorPicked] = useState(false);
  const [layoutReady, setLayoutReady] = useState(false);
  const [logoError, setLogoError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [improveNotes, setImproveNotes] = useState<string[]>([]);
  const [wizardStep, setWizardStep] = useState<WizardStep>("lettering");
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
        "This is still a sample door. Put your MCS-150 name, USDOT, and MC before we print.",
      ];
    }
    return issues;
  }, [fields]);
  const letteringDone = letteringIssues.length === 0;
  const canPrint = letteringDone && colorPicked && layoutReady;

  function touch() {
    setActiveSample(null);
    setFormError(null);
    setImproveNotes([]);
  }

  function applySample(sample: DriverSample) {
    setFields(lookFromSample(sample));
    setActiveSample(sample.id);
    setResetSampleId(sample.id);
    setColorPicked(false);
    setLayoutReady(false);
    setFormError(null);
    setLogoError(null);
    setImproveNotes([]);
    setWizardStep("lettering");
  }

  function update<K extends keyof SignFields>(key: K, value: SignFields[K]) {
    setFields((current) => ({ ...current, [key]: value }));
    touch();
  }

  function updateColor<K extends keyof SignPalette>(key: K, value: string) {
    setFields((current) => ({
      ...current,
      paletteId: "custom",
      colors: { ...current.colors, [key]: value },
    }));
    setColorPicked(true);
    touch();
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
    if (dataUrl) {
      const image = new Image();
      image.onload = () => {
        const aspect =
          image.naturalHeight > 0
            ? image.naturalWidth / image.naturalHeight
            : undefined;
        setFields((current) => ({
          ...current,
          logoDataUrl: dataUrl,
          originalArtworkUrl: dataUrl,
          logoAspect: aspect,
          artworkRole:
            current.artworkRole === "existing-sign" || current.artworkRole === "logo"
              ? current.artworkRole
              : suggestArtworkRole(aspect),
          artworkFit: current.artworkFit || "contain",
        }));
        touch();
      };
      image.onerror = () => {
        setFields((current) => ({
          ...current,
          logoDataUrl: dataUrl,
          originalArtworkUrl: dataUrl,
        }));
        touch();
      };
      image.src = dataUrl;
    }
  }

  function placePair() {
    const item = addToCart({
      ...fields,
      fleetNumber: "",
      logoSize: clampLogoSize(fields.logoSize),
    });
    setAdded(item);
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
      setFormError("Set logo size if you have a mark, then mark the layout ready.");
      document.getElementById("must-layout")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      return;
    }
    placePair();
  }

  function onWizardContinue() {
    if (wizardStep === "lettering") {
      if (!letteringDone) {
        setFormError(letteringIssues[0] ?? "Put your name and USDOT on the door.");
        return;
      }
      setFormError(null);
      setWizardStep("colors");
      return;
    }
    if (wizardStep === "colors") {
      setColorPicked(true);
      setFormError(null);
      setWizardStep("layout");
      return;
    }
    if (!letteringDone) {
      setFormError(letteringIssues[0] ?? "Put your name and USDOT on the door.");
      setWizardStep("lettering");
      return;
    }
    setColorPicked(true);
    setLayoutReady(true);
    setFormError(null);
    placePair();
  }

  function onAutoImprove() {
    const result = autoImprove(fields);
    setFields(result.fields);
    setImproveNotes(result.notes);
    setFormError(null);
    setActiveSample(null);
    if (result.fields.paletteId) setColorPicked(true);
    setLayoutReady(true);
  }

  function onReset() {
    const sample = sampleById(resetSampleId) ?? DRIVER_SAMPLES[0];
    applySample(sample);
  }

  const ticket: TicketApi = {
    fields,
    setFields,
    update,
    updateColor,
    onLogo,
    logoError,
    contrastNotes,
    colorPicked,
    setColorPicked: (value) => {
      setColorPicked(value);
      setFormError(null);
      setImproveNotes([]);
    },
    layoutReady,
    markLayoutReady,
    onEdit: touch,
  };

  return (
    <>
      <MobileDesigner
        fields={fields}
        step={wizardStep}
        onStep={(next) => {
          setWizardStep(next);
          setFormError(null);
        }}
        letteringDone={letteringDone}
        colorPicked={colorPicked}
        layoutReady={layoutReady}
        formError={formError}
        improveNotes={improveNotes}
        activeSample={activeSample}
        onPickSample={applySample}
        onContinue={onWizardContinue}
        onAutoImprove={onAutoImprove}
        onReset={onReset}
        ticket={ticket}
      />

      <div className="hidden lg:block">
        <div className="flex flex-col gap-4 lg:grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:grid-rows-[auto_1fr] lg:gap-8">
          <div className="lg:col-start-1 lg:row-start-2">
            <LiveVinylDock fields={fields} />
          </div>

          <div className="lg:col-span-2 lg:row-start-1">
            <SampleGallery activeId={activeSample} onPick={applySample} />
          </div>

          <form
            className="space-y-4 lg:col-start-2 lg:row-start-2"
            onSubmit={onPlaceClick}
            autoComplete="off"
          >
            <Card>
              <CardHeader className="border-b">
                <CardTitle>Print ticket</CardTitle>
                <CardDescription>
                  Do these three, then add the pair to your cart. Unit numbers
                  are a separate small print.
                </CardDescription>
                <ol className="mt-3 grid grid-cols-3 gap-2 text-sm">
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
                {improveNotes.length ? (
                  <Alert>
                    <Sparkles />
                    <AlertTitle>Auto Improve</AlertTitle>
                    <AlertDescription>
                      <ul className="list-disc pl-4">
                        {improveNotes.map((note) => (
                          <li key={note}>{note}</li>
                        ))}
                      </ul>
                    </AlertDescription>
                  </Alert>
                ) : null}

                <MustSection
                  id="must-lettering"
                  step="1"
                  icon={TICKET_ICONS.lettering}
                  title="Lettering"
                  hint="Required. Put the name, USDOT, and MC that should actually print — not the sample."
                  done={letteringDone}
                >
                  <LetteringFields {...ticket} />
                </MustSection>

                <MustSection
                  id="must-colors"
                  step="2"
                  icon={TICKET_ICONS.colors}
                  title="Colors"
                  hint="Required. Tap a look — each card is that color on the door. The truck below matches the cart."
                  done={colorPicked}
                >
                  <ColorFields {...ticket} showTruck />
                </MustSection>

                <MustSection
                  id="must-layout"
                  step="3"
                  icon={TICKET_ICONS.layout}
                  title="Layout"
                  hint="Required. Pick a layout, set logo size, and choose a door font. What you see is what prints."
                  done={layoutReady}
                >
                  <LayoutFields {...ticket} />
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
                <Button type="button" variant="outline" onClick={onAutoImprove}>
                  <Sparkles className="size-4" />
                  Auto Improve
                </Button>
                <Button type="button" variant="outline" onClick={onReset}>
                  <RotateCcw className="size-4" />
                  Reset
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
                ? `${added.fields.companyName} · USDOT ${added.fields.dotNumber}. Example cut is 20 × 12 in for each cab side. Checkout shows them on the truck.`
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
