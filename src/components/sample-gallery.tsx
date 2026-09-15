"use client";

import { TruckSign } from "@/components/truck-sign";
import { cn } from "@/lib/utils";
import {
  BLANK_SAMPLE,
  DRIVER_SAMPLES,
  type DriverSample,
} from "@/lib/samples";

const GALLERY: DriverSample[] = [...DRIVER_SAMPLES, BLANK_SAMPLE];

export function SampleGallery({
  activeId,
  onPick,
}: {
  activeId: string | null;
  onPick: (sample: DriverSample) => void;
}) {
  return (
    <section aria-label="Door samples">
      <div className="mb-3 flex items-end justify-between gap-3">
        <div>
          <h2 className="font-heading text-lg font-semibold text-[var(--navy)]">
            Tap a sample
          </h2>
          <p className="text-sm text-muted-foreground">
            Start from a shop door, then put your name and USDOT on it.
          </p>
        </div>
      </div>
      <div className="-mx-1 flex gap-3 overflow-x-auto pb-2 pt-1 sm:mx-0 sm:grid sm:grid-cols-5 sm:overflow-visible sm:pb-0">
        {GALLERY.map((sample) => {
          const selected = activeId === sample.id;
          return (
            <button
              key={sample.id}
              type="button"
              onClick={() => onPick(sample)}
              className={cn(
                "min-w-[9.5rem] shrink-0 rounded-xl border bg-white p-2 text-left shadow-sm transition sm:min-w-0",
                selected
                  ? "border-[var(--navy)] ring-2 ring-[var(--navy)] ring-offset-2"
                  : "border-border hover:border-[var(--navy)]/40 hover:shadow-md",
              )}
              aria-pressed={selected}
            >
              <TruckSign fields={sample.fields} className="shadow-none" />
              <p className="mt-2 text-sm font-medium text-[var(--navy)]">
                {sample.label}
                {selected ? (
                  <span className="ml-1.5 text-[11px] font-normal text-muted-foreground">
                    in use
                  </span>
                ) : null}
              </p>
              <p className="text-[11px] leading-snug text-muted-foreground">
                {sample.hint}
              </p>
            </button>
          );
        })}
      </div>
    </section>
  );
}
