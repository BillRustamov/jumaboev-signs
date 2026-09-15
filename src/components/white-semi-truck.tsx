import { TruckSign } from "@/components/truck-sign";
import type { SignFields } from "@/lib/order";
import { cn } from "@/lib/utils";

type Overlay = {
  src: string;
  alt: string;
  left: string;
  top: string;
  width: string;
};

function TruckPhoto({
  fields,
  overlay,
  className,
}: {
  fields: SignFields;
  overlay: Overlay;
  className?: string;
}) {
  return (
    <div className={cn("relative overflow-hidden bg-[#cfd8df]", className)}>
      {/* Static product photo of a white tractor-trailer; next/image is not required here. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={overlay.src}
        alt={overlay.alt}
        className="block h-auto w-full"
      />
      <div
        className="absolute"
        style={{
          left: overlay.left,
          top: overlay.top,
          width: overlay.width,
        }}
      >
        <TruckSign
          fields={fields}
          className="shadow-[0_8px_18px_rgba(20,24,28,0.28)] ring-1 ring-black/15"
        />
      </div>
    </div>
  );
}

export function WhiteSemiTruck({
  fields,
  className,
}: {
  fields: SignFields;
  className?: string;
}) {
  return (
    <div className={cn("overflow-hidden rounded-xl ring-1 ring-black/10", className)}>
      <TruckPhoto
        fields={fields}
        overlay={{
          src: "/white-semi-full.jpg",
          alt: "White full-size semi truck with trailer",
          left: "19.92%",
          top: "52.78%",
          width: "3.75%",
        }}
      />
      <div className="grid gap-0 border-t border-black/10 sm:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <TruckPhoto
          fields={fields}
          overlay={{
          src: "/white-semi-door.jpg",
          alt: "Cab door of a white semi with 24 by 24 vinyl",
          left: "13.1%",
          top: "60.29%",
          width: "11.43%",
          }}
        />
        <div className="flex flex-col justify-center bg-white px-4 py-4 sm:px-5">
          <p className="text-xs font-semibold tracking-[0.14em] text-[var(--gold)] uppercase">
            Cab door
          </p>
          <p className="font-heading mt-1 text-base font-semibold text-[var(--navy)]">
            24×24 vinyl on a white semi
          </p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Matched pair for both sides. Unit numbers stay off this door — they
            are a separate small print.
          </p>
        </div>
      </div>
    </div>
  );
}
