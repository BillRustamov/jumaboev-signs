"use client";

import { canPreviewAsImage } from "@/lib/print-file";
import type { SignOrder } from "@/lib/order";

export function PrintOrderCard({ order }: { order: SignOrder }) {
  const mime = order.originalMime ?? "";
  const preview =
    canPreviewAsImage(mime) && order.originalArtworkUrl.startsWith("data:image/");

  return (
    <div className="space-y-2 rounded-lg border bg-muted/40 p-3">
      <p className="text-sm font-medium text-[var(--navy)]">
        PRINT_ONLY · {order.originalFileName || "upload"}
      </p>
      <p className="text-xs text-muted-foreground">
        20 × 12 in · 1 pair ·{" "}
        {order.printExact === false && order.printNotes
          ? order.printNotes
          : "Print exactly as sent"}
      </p>
      {preview ? (
        // Raster only — never mount SVG/PDF.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={order.originalArtworkUrl}
          alt={order.originalFileName || "Print file"}
          className="max-h-40 w-full rounded-md object-contain bg-white"
        />
      ) : null}
    </div>
  );
}
