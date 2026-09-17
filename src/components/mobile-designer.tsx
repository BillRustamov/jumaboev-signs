"use client";

import { CheckCircle2, RotateCcw, Sparkles } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { TruckSign } from "@/components/truck-sign";
import { cn } from "@/lib/utils";
import type { SignFields } from "@/lib/order";
import {
  DRIVER_SAMPLES,
  BLANK_SAMPLE,
  type DriverSample,
} from "@/lib/samples";
import {
  ColorFields,
  LayoutFields,
  LetteringFields,
  type TicketApi,
} from "@/components/designer-ticket";

export type WizardStep = "lettering" | "colors" | "layout";

const STEPS: { id: WizardStep; n: string; label: string }[] = [
  { id: "lettering", n: "1", label: "Lettering" },
  { id: "colors", n: "2", label: "Colors" },
  { id: "layout", n: "3", label: "Layout" },
];

const LOOKS: DriverSample[] = [...DRIVER_SAMPLES, BLANK_SAMPLE];

export function MobileDesigner({
  fields,
  step,
  onStep,
  letteringDone,
  colorPicked,
  layoutReady,
  formError,
  improveNotes,
  activeSample,
  onPickSample,
  onContinue,
  onAutoImprove,
  onReset,
  ticket,
}: {
  fields: SignFields;
  step: WizardStep;
  onStep: (step: WizardStep) => void;
  letteringDone: boolean;
  colorPicked: boolean;
  layoutReady: boolean;
  formError: string | null;
  improveNotes: string[];
  activeSample: string | null;
  onPickSample: (sample: DriverSample) => void;
  onContinue: () => void;
  onAutoImprove: () => void;
  onReset: () => void;
  ticket: TicketApi;
}) {
  const continueLabel =
    step === "lettering"
      ? "Continue"
      : step === "colors"
        ? "Continue"
        : letteringDone && colorPicked
          ? "Add pair to cart"
          : "Continue";

  const doneFor = (id: WizardStep) =>
    id === "lettering" ? letteringDone : id === "colors" ? colorPicked : layoutReady;

  return (
    <div
      data-mobile-designer={step}
      className="fixed inset-x-0 top-[var(--shop-header)] bottom-0 z-20 flex flex-col bg-background lg:hidden"
    >
      <nav
        aria-label="Print ticket progress"
        className="shrink-0 border-b bg-background px-3 py-2"
      >
        <ol className="grid grid-cols-3 gap-1">
          {STEPS.map((item) => {
            const current = item.id === step;
            const done = doneFor(item.id);
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => onStep(item.id)}
                  className={cn(
                    "flex w-full items-center justify-center gap-1 rounded-md px-1 py-2 text-xs font-medium",
                    current
                      ? "bg-[var(--navy)] text-white"
                      : done
                        ? "text-[var(--forest)]"
                        : "text-muted-foreground",
                  )}
                  aria-current={current ? "step" : undefined}
                >
                  {done && !current ? (
                    <CheckCircle2 className="size-3.5 shrink-0" />
                  ) : (
                    <span className="tabular-nums">{item.n}</span>
                  )}
                  {item.label}
                </button>
              </li>
            );
          })}
        </ol>
      </nav>

      <div className="shrink-0 border-b bg-neutral-100 px-3 py-2">
        <div
          className="mx-auto w-full"
          style={{ maxWidth: "min(100%, calc(28vh * 20 / 12))" }}
        >
          <p className="mb-1 flex items-center justify-between text-[11px] font-medium tracking-[0.14em] text-neutral-600 uppercase">
            <span>Live vinyl</span>
            <span>20 × 12 in</span>
          </p>
          <TruckSign fields={fields} className="shadow-md" />
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-3">
        {formError ? (
          <Alert variant="destructive" className="mb-3">
            <AlertTitle>Could not continue</AlertTitle>
            <AlertDescription>{formError}</AlertDescription>
          </Alert>
        ) : null}
        {improveNotes.length ? (
          <Alert className="mb-3">
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

        {step === "lettering" ? (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Put the name and numbers that should actually print. The 20 × 12
              in door stays on screen.
            </p>
            <div className="-mx-4 overflow-x-auto px-4 [scrollbar-width:none]">
              <div className="flex gap-2 pb-1">
                {LOOKS.map((sample) => {
                  const selected = activeSample === sample.id;
                  return (
                    <button
                      key={sample.id}
                      type="button"
                      onClick={() => onPickSample(sample)}
                      className={cn(
                        "w-[7.25rem] shrink-0 rounded-lg border bg-white p-1.5 text-left",
                        selected
                          ? "border-[var(--navy)] ring-2 ring-[var(--navy)]"
                          : "border-border",
                      )}
                    >
                      <TruckSign
                        fields={sample.fields}
                        className="pointer-events-none shadow-none"
                      />
                      <p className="mt-1 truncate text-[11px] font-medium text-[var(--navy)]">
                        {sample.label}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
            <LetteringFields {...ticket} idPrefix="m" />
          </div>
        ) : null}

        {step === "colors" ? (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Tap a set. Continue keeps the colors on the live door — including
              the white default.
            </p>
            <ColorFields {...ticket} idPrefix="m" showTruck={false} />
          </div>
        ) : null}

        {step === "layout" ? (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Pick a composition. Logo size and font stay on this step so the
              artwork above does not jump away.
            </p>
            <LayoutFields {...ticket} idPrefix="m" />
          </div>
        ) : null}
      </div>

      <div className="shrink-0 border-t bg-background px-3 pt-2 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="mb-2 flex gap-2">
          <Button
            type="button"
            variant="outline"
            className="h-11 flex-1"
            onClick={onAutoImprove}
          >
            <Sparkles className="size-4" />
            Auto Improve
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-11 flex-1"
            onClick={onReset}
          >
            <RotateCcw className="size-4" />
            Reset
          </Button>
        </div>
        <Button type="button" className="h-12 w-full text-base" onClick={onContinue}>
          {continueLabel}
        </Button>
      </div>
    </div>
  );
}
