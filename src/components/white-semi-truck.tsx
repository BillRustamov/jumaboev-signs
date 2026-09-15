import { TruckSign } from "@/components/truck-sign";
import type { SignFields } from "@/lib/order";
import { cn } from "@/lib/utils";

export function WhiteSemiTruck({
  fields,
  className,
}: {
  fields: SignFields;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl bg-[#eceff2] ring-1 ring-black/10",
        className,
      )}
    >
      <div className="relative">
        {/* Studio photo of a white Cascadia; next/image is not required for this overlay. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/white-cascadia-side.jpg"
          alt="White Freightliner Cascadia with 24 by 24 vinyl on the sleeper door"
          className="block h-auto w-full"
        />
        <div
          className="absolute"
          style={{ left: "47.97%", top: "56.11%", width: "3.28%" }}
        >
          <TruckSign
            fields={fields}
            className="shadow-[0_3px_8px_rgba(20,24,28,0.18)] ring-1 ring-black/10"
          />
        </div>
        <div className="absolute right-3 top-3 z-10 hidden w-[min(26%,15rem)] sm:block">
          <VinylCallout fields={fields} />
        </div>
      </div>
      <div className="border-t border-black/10 bg-white p-3 sm:hidden">
        <VinylCallout fields={fields} />
      </div>
    </div>
  );
}

function VinylCallout({ fields }: { fields: SignFields }) {
  return (
    <div className="rounded-lg border-2 border-[var(--navy)] bg-white p-1.5 shadow-lg">
      <TruckSign fields={fields} className="shadow-none" />
      <p className="px-1 pb-0.5 pt-1.5 text-center text-[11px] font-medium text-[var(--navy)]">
        24×24 sleeper door · set of two
      </p>
    </div>
  );
}
