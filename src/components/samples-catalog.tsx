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
  type CatalogFilter,
  type DriverSample,
  type SampleCategory,
} from "@/lib/samples";
import { uiT } from "@/lib/shop-copy";
import {
  categoryBlurb,
  categoryLabel,
  colorNameOf,
  filterLabel,
  productTypeName,
  sampleHintOf,
  sampleLabelOf,
} from "@/lib/shop-labels";
import { useShopLang } from "@/lib/shop-lang";

type Peek = { sample: DriverSample; mode: "sign" | "truck" } | null;

export function SamplesCatalog() {
  const lang = useShopLang();
  const [category, setCategory] = useState<SampleCategory | "all">("all");
  const [filter, setFilter] = useState<CatalogFilter>("all");
  const [peek, setPeek] = useState<Peek>(null);

  const items = useMemo(
    () => filterCatalog(GALLERY_SAMPLES, category, filter),
    [category, filter],
  );
  const heading =
    category === "all" ? uiT(lang, "allLooks") : categoryLabel(lang, category);
  const blurb =
    category === "all"
      ? uiT(lang, "allLooksBlurb")
      : categoryBlurb(lang, category);

  return (
    <div>
      <div className="-mx-4 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:overflow-visible sm:px-0">
        <div className="flex w-max gap-2 sm:w-full sm:flex-wrap">
          <CategoryChip
            selected={category === "all"}
            onClick={() => setCategory("all")}
          >
            {uiT(lang, "allLooks")}
          </CategoryChip>
          {SAMPLE_CATEGORIES.map((item) => (
            <CategoryChip
              key={item.id}
              selected={category === item.id}
              onClick={() => setCategory(item.id)}
            >
              {categoryLabel(lang, item.id)}
            </CategoryChip>
          ))}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          {uiT(lang, "filter")}
        </p>
        {CATALOG_FILTERS.map((item) => (
          <Button
            key={item.id}
            type="button"
            size="sm"
            variant={filter === item.id ? "default" : "outline"}
            onClick={() => setFilter(item.id)}
          >
            {filterLabel(lang, item.id)}
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
            {uiT(lang, "noDoorsMatch")}
          </p>
          <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
            {uiT(lang, "noDoorsMatchLead")}
          </p>
          <Button
            className="mt-5"
            type="button"
            onClick={() => {
              setCategory("all");
              setFilter("all");
            }}
          >
            {uiT(lang, "clearFilters")}
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {items.map((sample) => (
            <SampleCard
              key={sample.id}
              sample={sample}
              lang={lang}
              onInspect={() => setPeek({ sample, mode: "sign" })}
              onTruck={() => setPeek({ sample, mode: "truck" })}
            />
          ))}
        </div>
      )}

      <InspectDialog peek={peek} lang={lang} onClose={() => setPeek(null)} />
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
  lang,
  onInspect,
  onTruck,
}: {
  sample: DriverSample;
  lang: import("@/lib/shop-entry").ShopLang;
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
        aria-label={`${uiT(lang, "inspectArtwork")}, ${sampleLabelOf(lang, sample)}`}
      >
        {upload ? (
          <div className="flex aspect-[20/12] flex-col items-center justify-center rounded-md border border-dashed border-neutral-300 bg-white">
            <ImagePlus className="size-8 text-[var(--navy)]" />
            <p className="mt-2 text-sm font-medium text-[var(--navy)]">
              {uiT(lang, "yourLogoOrPhoto")}
            </p>
            <p className="mt-1 max-w-[16rem] text-center text-xs text-muted-foreground">
              {uiT(lang, "uploadCardHint")}
            </p>
          </div>
        ) : (
          <TruckSign fields={sample.fields} className="shadow-none" />
        )}
      </button>
      <div className="flex flex-1 flex-col gap-3 px-4 pt-3 pb-4">
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge variant="secondary">{productTypeName(lang, sample)}</Badge>
          <Badge variant="outline">{colorNameOf(lang, sample)}</Badge>
          <span className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
            {VINYL.size}
          </span>
        </div>
        <div>
          <h3 className="font-heading text-lg font-semibold text-[var(--navy)]">
            {sampleLabelOf(lang, sample)}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {sampleHintOf(lang, sample)}
          </p>
        </div>
        <div className="mt-auto flex flex-col gap-2 sm:flex-row">
          <Button asChild className="sm:flex-1">
            <Link href={`/order?sample=${sample.id}`}>
              {uiT(lang, "customizeThis")}
            </Link>
          </Button>
          {upload ? null : (
            <Button type="button" variant="outline" onClick={onTruck}>
              <Truck className="size-4" />
              {uiT(lang, "onATruck")}
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}

function InspectDialog({
  peek,
  lang,
  onClose,
}: {
  peek: Peek;
  lang: import("@/lib/shop-entry").ShopLang;
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
              {sampleLabelOf(lang, sample)}
            </DialogTitle>
            <DialogDescription>
              {uiT(lang, "inspectLooksOnly", {
                type: productTypeName(lang, sample),
                color: colorNameOf(lang, sample),
              })}
            </DialogDescription>
            <div className="mt-2">
              {sign ? (
                <div className="rounded-md bg-neutral-100 p-3">
                  <TruckSign fields={sample.fields} />
                </div>
              ) : (
                <WhiteSemiTruck
                  fields={sample.fields}
                  interactive={false}
                  showChrome={false}
                />
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {sign ? uiT(lang, "inspectArt") : uiT(lang, "inspectTruck")}
            </p>
            <Button asChild>
              <Link href={`/order?sample=${sample.id}`}>
                {uiT(lang, "customizeThis")}
              </Link>
            </Button>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
