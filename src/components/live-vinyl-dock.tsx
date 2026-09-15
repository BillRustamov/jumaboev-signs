import { TruckSign } from "@/components/truck-sign";
import type { SignFields } from "@/lib/order";

export function LiveVinylDock({ fields }: { fields: SignFields }) {
  const name = fields.companyName.trim().toUpperCase();
  const dot = fields.dotNumber.trim();
  const status = name
    ? `${name}${dot ? ` · USDOT ${dot}` : ""}`
    : "Type your name — the door updates here";

  return (
    <aside
      data-live-dock
      className="sticky top-12 z-30 -mx-4 border-b bg-background/95 px-3 py-2 shadow-sm backdrop-blur lg:top-16 lg:mx-0 lg:border-0 lg:bg-transparent lg:px-0 lg:py-0 lg:shadow-none lg:backdrop-blur-none"
    >
      <div className="mb-3 hidden lg:flex lg:items-end lg:justify-between lg:gap-3">
        <div>
          <p className="text-sm font-medium text-[var(--navy)]">
            Live 24×24 vinyl
          </p>
          <p className="text-xs text-muted-foreground">
            {name || dot
              ? "This is what prints. Finish lettering, colors, and layout on the ticket."
              : "Sample look is on. Type your MCS-150 name and USDOT to replace the ghost type."}
          </p>
        </div>
        <p className="text-xs font-medium tracking-wide text-muted-foreground">
          24 in × 24 in
        </p>
      </div>
      <div className="flex items-center gap-3 lg:block">
        <div className="w-[7.75rem] shrink-0 rounded-lg bg-neutral-100 p-1.5 ring-1 ring-black/10 sm:w-[9rem] lg:w-full lg:max-w-[560px] lg:rounded-xl lg:p-5">
          <TruckSign
            fields={fields}
            className="shadow-md"
            data-testid="live-vinyl"
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
