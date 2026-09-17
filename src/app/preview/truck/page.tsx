import { WhiteSemiTruck } from "@/components/white-semi-truck";
import { HideShopChrome } from "@/components/hide-shop-chrome";
import { DRIVER_SAMPLES } from "@/lib/samples";

export const dynamic = "force-dynamic";

export default function TruckPreviewPage() {
  const fields = DRIVER_SAMPLES[0].fields;
  return (
    <main className="mx-auto min-h-screen max-w-3xl bg-neutral-200 p-6">
      <HideShopChrome />
      <p className="mb-3 font-sans text-sm font-semibold tracking-wide text-neutral-700 uppercase">
        Cab mockup · 20 × 12 in on the door
      </p>
      <WhiteSemiTruck fields={fields} />
    </main>
  );
}
