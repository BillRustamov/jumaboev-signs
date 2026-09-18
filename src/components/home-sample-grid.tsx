"use client";

import Link from "next/link";
import { WhiteSemiTruck } from "@/components/white-semi-truck";
import { DRIVER_SAMPLES } from "@/lib/samples";
import { uiT } from "@/lib/shop-copy";
import { sampleHintOf, sampleLabelOf } from "@/lib/shop-labels";
import { useShopLang } from "@/lib/shop-lang";

export function HomeSampleGrid() {
  const lang = useShopLang();
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {DRIVER_SAMPLES.map((sample) => (
        <Link
          key={sample.id}
          href={`/order?sample=${sample.id}`}
          className="group overflow-hidden rounded-xl border border-border bg-white shadow-sm transition hover:border-[var(--navy)]/35 hover:shadow-md"
        >
          <WhiteSemiTruck fields={sample.fields} interactive={false} />
          <div className="px-3 pb-3 pt-2.5">
            <p className="font-heading text-sm font-semibold text-[var(--navy)]">
              {sampleLabelOf(lang, sample)}
            </p>
            <p className="text-xs text-muted-foreground">{sampleHintOf(lang, sample)}</p>
            <p className="mt-2 text-xs font-medium text-[var(--navy)] group-hover:underline">
              {uiT(lang, "useThisDoor")}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
