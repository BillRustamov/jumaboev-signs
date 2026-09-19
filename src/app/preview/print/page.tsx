import { HideShopChrome } from "@/components/hide-shop-chrome";
import { PrintSheet } from "@/components/print-sheet";
import { DimensionedSign } from "@/components/truck-sign";
import { SUGGESTED_LAYOUT } from "@/lib/samples";
import { VINYL } from "@/lib/vinyl-spec";
import { SAMPLE_PRINT_ID } from "@/lib/order";

export const dynamic = "force-dynamic";

export default function PrintPreviewPage() {
  const fields = SUGGESTED_LAYOUT.fields;
  return (
    <main className="min-h-screen bg-neutral-200 p-6">
      <HideShopChrome />
      <p className="mb-2 font-sans text-sm font-semibold tracking-wide text-neutral-700 uppercase">
        Production · {VINYL.printSize} each side · 24 in roll · never 20 × 10
      </p>
      <div className="mb-8 max-w-xl bg-white p-4 shadow-md">
        <DimensionedSign fields={fields} />
      </div>
      <div className="overflow-auto rounded-xl bg-neutral-300 p-4">
        <div className="origin-top-left scale-[0.32]">
          <PrintSheet fields={fields} orderId={SAMPLE_PRINT_ID} />
        </div>
      </div>
    </main>
  );
}
