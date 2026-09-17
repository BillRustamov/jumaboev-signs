"use client";

import { SignPreview } from "@/components/sign-preview";
import type { SignFields } from "@/lib/order";

export function LiveVinylDock({ fields }: { fields: SignFields }) {
  const name = fields.companyName.trim().toUpperCase();
  const dot = fields.dotNumber.trim();

  return (
    <aside data-live-dock className="sticky top-16">
      <div className="mb-3 flex items-end justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-[var(--navy)]">Live vinyl</p>
          <p className="text-xs text-muted-foreground">
            {name || dot
              ? "This is what prints. Finish lettering, colors, and layout on the ticket."
              : "Sample look is on. Type your MCS-150 name and USDOT to replace the ghost type."}
          </p>
        </div>
        <p className="text-xs font-medium tracking-wide text-muted-foreground">
          20 × 12 in each side
        </p>
      </div>
      <div className="rounded-xl bg-neutral-100 p-4 ring-1 ring-black/10">
        <SignPreview fields={fields} signClassName="shadow-md" />
      </div>
    </aside>
  );
}
