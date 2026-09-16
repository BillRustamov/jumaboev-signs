"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { AlertCircle, ArrowLeft, Download, Loader2, Printer } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { PrintSheet } from "@/components/print-sheet";
import { readLocalOrders } from "@/lib/client-session";
import {
  SAMPLE_PRINT_ID,
  samplePrintOrder,
  type SignOrder,
} from "@/lib/order";

export function AdminPrintDesk() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const [order, setOrder] = useState<SignOrder | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (id === SAMPLE_PRINT_ID) {
        if (!cancelled) {
          setOrder(samplePrintOrder());
          setLoading(false);
        }
        return;
      }
      const local = readLocalOrders().find((item) => item.id === id) ?? null;
      try {
        const response = await fetch(`/api/orders/${id}`, { cache: "no-store" });
        if (response.ok) {
          const saved = (await response.json()) as SignOrder;
          if (!cancelled) setOrder(saved);
          return;
        }
        if (!local) {
          throw new Error("This ticket is not on the shop list.");
        }
        if (!cancelled) setOrder(local);
      } catch (err) {
        if (cancelled) return;
        if (local) {
          setOrder(local);
        } else {
          setError(
            err instanceof Error ? err.message : "Could not open that ticket.",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  function downloadSheet() {
    window.print();
  }

  if (loading) {
    return (
      <p className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        Opening print sheet
      </p>
    );
  }

  if (error || !order) {
    return (
      <Alert variant="destructive">
        <AlertCircle />
        <AlertTitle>No ticket to print</AlertTitle>
        <AlertDescription>{error ?? "Unknown order."}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4 print:space-y-0">
      <div className="print-hide flex flex-wrap items-center justify-between gap-3">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin">
            <ArrowLeft className="size-4" />
            Shop print desk
          </Link>
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={downloadSheet}>
            <Printer className="size-4" />
            Print
          </Button>
          <Button onClick={downloadSheet}>
            <Download className="size-4" />
            Download print sheet
          </Button>
        </div>
      </div>
      <p className="print-hide max-w-2xl text-sm text-muted-foreground">
        Two doors, 20 × 10 in each so they fit the 24 in sheet. Customer
        example is 20 × 12 in. Left and right. In the print dialog use 100%
        scale and turn off “fit to page”.
      </p>
      <div className="print-hide overflow-auto rounded-xl border bg-neutral-200 p-3">
        <div className="h-[8.16in] sm:h-[9.12in]">
          <div className="origin-top-left scale-[0.34] sm:scale-[0.38]">
            <PrintSheet fields={order} orderId={order.id} />
          </div>
        </div>
      </div>
      <div className="hidden print:block">
        <PrintSheet fields={order} orderId={order.id} />
      </div>
    </div>
  );
}
