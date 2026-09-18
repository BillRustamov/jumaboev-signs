"use client";

import { TruckSign } from "@/components/truck-sign";
import { cn } from "@/lib/utils";
import {
  BLANK_SAMPLE,
  DRIVER_SAMPLES,
  type DriverSample,
} from "@/lib/samples";
import { uiT } from "@/lib/shop-copy";
import { sampleHintOf, sampleLabelOf } from "@/lib/shop-labels";
import { useShopLang } from "@/lib/shop-lang";

const GALLERY: DriverSample[] = [...DRIVER_SAMPLES, BLANK_SAMPLE];

export function SampleGallery({
  activeId,
  onPick,
}: {
  activeId: string | null;
  onPick: (sample: DriverSample) => void;
}) {
  const lang = useShopLang();
  return (
    <section aria-label={uiT(lang, "doorSamplesAria")}>
      <div className="mb-3 flex items-end justify-between gap-3">
        <div>
          <h2 className="font-heading text-base font-semibold text-[var(--navy)] sm:text-lg">
            {uiT(lang, "tapSample")}
          </h2>
          <p className="hidden text-sm text-muted-foreground sm:block">
            {uiT(lang, "tapSampleLead")}
          </p>
          <p className="text-xs text-muted-foreground sm:hidden">
            {uiT(lang, "tapSampleLeadMobile")}
          </p>
        </div>
      </div>
      <div className="-mx-4 flex snap-x snap-mandatory gap-2 overflow-x-auto px-4 pb-2 pt-1 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-5 sm:gap-3 sm:overflow-visible sm:px-0 sm:[&::-webkit-scrollbar]:hidden sm:pb-0">
        {GALLERY.map((sample) => {
          const selected = activeId === sample.id;
          return (
            <button
              key={sample.id}
              type="button"
              onClick={() => onPick(sample)}
              className={cn(
                "min-w-[11.5rem] shrink-0 snap-start overflow-visible rounded-xl border bg-white p-2 text-left shadow-sm transition sm:min-w-0",
                selected
                  ? "border-[var(--navy)] ring-2 ring-[var(--navy)] ring-offset-2"
                  : "border-border hover:border-[var(--navy)]/40 hover:shadow-md",
              )}
              aria-pressed={selected}
            >
              <TruckSign
                fields={sample.fields}
                className="shadow-none"
              />
              <p className="mt-2 text-sm font-medium text-[var(--navy)]">
                {sampleLabelOf(lang, sample)}
                {selected ? (
                  <span className="ml-1.5 text-[11px] font-normal text-muted-foreground">
                    {uiT(lang, "inUse")}
                  </span>
                ) : null}
              </p>
              <p className="text-[11px] leading-snug text-muted-foreground">
                {sampleHintOf(lang, sample)}
              </p>
            </button>
          );
        })}
      </div>
    </section>
  );
}
