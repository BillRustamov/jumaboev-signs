"use client";

import { SignPreview } from "@/components/sign-preview";
import type { SignFields } from "@/lib/order";
import { uiT } from "@/lib/shop-copy";
import { useShopLang } from "@/lib/shop-lang";

export function LiveVinylDock({ fields }: { fields: SignFields }) {
  const lang = useShopLang();
  const name = fields.companyName.trim().toUpperCase();
  const dot = fields.dotNumber.trim();

  return (
    <aside data-live-dock className="sticky top-16">
      <div className="mb-3 flex items-end justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-[var(--navy)]">
            {uiT(lang, "liveVinyl")}
          </p>
          <p className="text-xs text-muted-foreground">
            {name || dot
              ? uiT(lang, "liveVinylHasName")
              : uiT(lang, "liveVinylGhost")}
          </p>
        </div>
        <p className="text-xs font-medium tracking-wide text-muted-foreground">
          {uiT(lang, "sizeEachSide")}
        </p>
      </div>
      <div className="rounded-xl bg-neutral-100 p-4 ring-1 ring-black/10">
        <SignPreview fields={fields} signClassName="shadow-md" />
      </div>
    </aside>
  );
}
