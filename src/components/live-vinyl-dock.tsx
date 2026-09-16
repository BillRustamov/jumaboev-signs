"use client";

import { SignPreview } from "@/components/sign-preview";
import type { SignFields } from "@/lib/order";

export function LiveVinylDock({ fields }: { fields: SignFields }) {
  const name = fields.companyName.trim().toUpperCase();
  const dot = fields.dotNumber.trim();
  const status = name
    ? `${name}${dot ? ` · ${dot}` : ""}`
    : "Your door name here";

  return (
    <aside
      data-live-dock
      className="max-lg:fixed max-lg:inset-x-0 max-lg:top-12 max-lg:z-30 max-lg:border-b max-lg:bg-background/95 max-lg:px-3 max-lg:py-2 max-lg:shadow-sm max-lg:backdrop-blur lg:sticky lg:top-16"
    >
      <div className="mb-3 hidden lg:flex lg:items-end lg:justify-between lg:gap-3">
        <div>
          <p className="text-sm font-medium text-[var(--navy)]">
            Live vinyl
          </p>
          <p className="text-xs text-muted-foreground">
            {name || dot
              ? "This is what prints. Finish lettering, colors, and layout on the ticket."
              : "Sample look is on. Type your MCS-150 name and USDOT to replace the ghost type."}
          </p>
        </div>
        <p className="text-xs font-medium tracking-wide text-muted-foreground">
          ~10×20 in each side
        </p>
      </div>
      <div className="flex items-center gap-3 lg:block">
        <div className="w-[9.25rem] shrink-0 rounded-lg bg-neutral-100 p-1 ring-1 ring-black/10 sm:w-[11rem] lg:w-full lg:max-w-[34rem] lg:rounded-xl lg:bg-neutral-100 lg:p-4">
          <SignPreview
            fields={fields}
            signClassName="shadow-md"
          />
        </div>
        <div className="min-w-0 lg:hidden">
          <p className="text-sm font-semibold text-[var(--navy)]">Live door</p>
          <p className="text-xs text-muted-foreground">Updates as you type</p>
          <p className="mt-1 truncate text-sm font-medium text-[var(--navy)]">
            {status}
          </p>
        </div>
      </div>
    </aside>
  );
}
