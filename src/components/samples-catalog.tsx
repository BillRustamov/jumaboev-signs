"use client";

import { useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { ImagePlus, Truck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { TruckSign } from "@/components/truck-sign";
import { WhiteSemiTruck } from "@/components/white-semi-truck";
import { VINYL } from "@/lib/vinyl-spec";
import { cn } from "@/lib/utils";
import {
  CATALOG_FILTERS,
  GALLERY_SAMPLES,
  SAMPLE_CATEGORIES,
  filterCatalog,
  sampleCategory,
  sampleColorLabel,
  sampleProductType,
  type CatalogFilter,
  type DriverSample,
  type SampleCategory,
} from "@/lib/samples";

type Peek = { sample: DriverSample; mode: "sign" | "truck" } | null;

export function SamplesCatalog() {
  const [category, setCategory] = useState<SampleCategory | "all">("all");
  const [filter, setFilter] = useState<CatalogFilter>("all");
  const [peek, setPeek] = useState<Peek>(null);

  const items = useMemo(
    () => filterCatalog(GALLERY_SAMPLES, category, filter),
    [category, filter],
  );
  const heading =
    category === "all"
      ? "All looks"
      : (SAMPLE_CATEGORIES.find((item) => item.id === category)?.label ?? "Looks");
  const blurb =
    category === "all"
      ? "Each card is a different 20 × 12 in composition. Color is separate from layout."
      : SAMPLE_CATEGORIES.find((item) => item.id === category)?.blurb;

  return (
    <div>
      <div className="-mx-4 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:overflow-visible sm:px-0">
        <div className="flex w-max gap-2 sm:w-full sm:flex-wrap">
          <CategoryChip
            selected={category === "all"}
            onClick={() => setCategory("all")}
          >
            All looks
          </CategoryChip>
          {SAMPLE_CATEGORIES.map((item) => (
            <CategoryChip
              key={item.id}
              selected={category === item.id}
              onClick={() => setCategory(item.id)}
            >
              {item.label}
            </CategoryChip>
          ))}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Filter
        </p>
        {CATALOG_FILTERS.map((item) => (
          <Button
            key={item.id}
            type="button"
            size="sm"
            variant={filter === item.id ? "default" : "outline"}
            onClick={() => setFilter(item.id)}
          >
            {item.label}
          </Button>
        ))}
      </div>

      <div className="mt-8 mb-4">
        <h2 className="font-heading text-xl font-semibold text-[var(--navy)]">
          {heading}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">{blurb}</p>
      </div>

      {items.length === 0 ? (
        <div className="rounded-xl border border-dashed bg-white px-6 py-14 text-center">
          <p className="font-heading text-lg font-semibold text-[var(--navy)]">
            No doors match that filter
          </p>
          <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
            Try All, or pick White / Dark / logo on a different category. Every
            look is still {VINYL.size}.
          </p>
          <Button
            className="mt-5"
            type="button"
            onClick={() => {
              setCategory("all");
              setFilter("all");
            }}
          >
            Clear filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {items.map((sample) => (
            <SampleCard
              key={sample.id}
              sample={sample}
              onInspect={() => setPeek({ sample, mode: "sign" })}
              onTruck={() => setPeek({ sample, mode: "truck" })}
            />
          ))}
        </div>
      )}

      <InspectDialog peek={peek} onClose={() => setPeek(null)} />
    </div>
  );
}

function CategoryChip({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1.5 text-sm font-medium whitespace-nowrap transition",
        selected
          ? "border-[var(--navy)] bg-[var(--navy)] text-white"
          : "border-border bg-white text-[var(--navy)] hover:border-[var(--navy)]/40",
      )}
    >
      {children}
    </button>
  );
}

function SampleCard({
  sample,
  onInspect,
  onTruck,
}: {
  sample: DriverSample;
  onInspect: () => void;
  onTruck: () => void;
}) {
  const upload = sampleCategory(sample) === "upload";
  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-border bg-white shadow-sm">
      <button
        type="button"
        onClick={onInspect}
        className="relative block w-full bg-neutral-100 p-3 text-left sm:p-4"
        aria-label={`Inspect ${sample.label}, ${VINYL.size}`}
      >
        {upload ? (
          <div className="flex aspect-[20/12] flex-col items-center justify-center rounded-md border border-dashed border-neutral-300 bg-white">
            <ImagePlus className="size-8 text-[var(--navy)]" />
            <p className="mt-2 text-sm font-medium text-[var(--navy)]">
              Your logo or door photo
            </p>
            <p className="mt-1 max-w-[16rem] text-center text-xs text-muted-foreground">
              Fit on {VINYL.size}. We never stretch it to fill.
            </p>
          </div>
        ) : (
          <TruckSign fields={sample.fields} className="shadow-none" />
        )}
      </button>
      <div className="flex flex-1 flex-col gap-3 px-4 pt-3 pb-4">
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge variant="secondary">{sampleProductType(sample)}</Badge>
          <Badge variant="outline">{sampleColorLabel(sample)}</Badge>
          <span className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
            {VINYL.size}
          </span>
        </div>
        <div>
          <h3 className="font-heading text-lg font-semibold text-[var(--navy)]">
            {sample.label}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">{sample.hint}</p>
        </div>
        <div className="mt-auto flex flex-col gap-2 sm:flex-row">
          <Button asChild className="sm:flex-1">
            <Link href={`/order?sample=${sample.id}`}>Customize this design</Link>
          </Button>
          {upload ? null : (
            <Button type="button" variant="outline" onClick={onTruck}>
              <Truck className="size-4" />
              On a truck
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}

function InspectDialog({
  peek,
  onClose,
}: {
  peek: Peek;
  onClose: () => void;
}) {
  const sample = peek?.sample;
  const sign = peek?.mode === "sign";
  return (
    <Dialog open={Boolean(peek)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="max-h-[min(92vh,52rem)] overflow-y-auto sm:max-w-[min(52rem,calc(100%-2rem))]"
        showCloseButton
      >
        {sample ? (
          <>
            <DialogTitle className="font-heading text-xl text-[var(--navy)]">
              {sample.label}
            </DialogTitle>
            <DialogDescription>
              {sampleProductType(sample)} · {sampleColorLabel(sample)} ·{" "}
              {VINYL.size}. Looks only — put your MCS-150 name and numbers on
              the print ticket.
            </DialogDescription>
            <div className="mt-2">
              {sign ? (
                <div className="rounded-md bg-neutral-100 p-3">
                  <TruckSign fields={sample.fields} />
                </div>
              ) : (
                <WhiteSemiTruck fields={sample.fields} interactive={false} />
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {sign
                ? "This is the artwork. Truck placement is a separate preview."
                : "On-truck placement is a look only. The vinyl we cut is still 20 × 12 in."}
            </p>
            <Button asChild>
              <Link href={`/order?sample=${sample.id}`}>
                Customize this design
              </Link>
            </Button>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
