"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { AlertCircle, ArrowLeft, Download, Loader2, Printer } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { PrintSheet } from "@/components/print-sheet";
import { readLocalOrders } from "@/lib/client-session";
import { PrintOrderCard } from "@/components/print-order-card";
import {
  SAMPLE_PRINT_ID,
  isPrintOnly,
  samplePrintOrder,
  type SignOrder,
} from "@/lib/order";
import { uiT } from "@/lib/shop-copy";
import { useShopLang } from "@/lib/shop-lang";

export function AdminPrintDesk() {
  const lang = useShopLang();
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
          throw new Error(uiT(lang, "ticketNotOnList"));
        }
        if (!cancelled) setOrder(local);
      } catch (err) {
        if (cancelled) return;
        if (local) {
          setOrder(local);
        } else {
          setError(
            err instanceof Error ? err.message : uiT(lang, "couldNotOpenTicket"),
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
        {uiT(lang, "openingSheet")}
      </p>
    );
  }

  if (order && isPrintOnly(order)) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin">
            <ArrowLeft className="size-4" />
            {uiT(lang, "shopPrintDesk")}
          </Link>
        </Button>
        <Alert>
          <AlertCircle />
          <AlertTitle>{uiT(lang, "printOriginalTitle")}</AlertTitle>
          <AlertDescription>
            {uiT(lang, "printOriginalBody", { id: order.id })}
          </AlertDescription>
        </Alert>
        <PrintOrderCard order={order} />
      </div>
    );
  }

  if (error || !order) {
    return (
      <Alert variant="destructive">
        <AlertCircle />
        <AlertTitle>{uiT(lang, "noTicketPrint")}</AlertTitle>
        <AlertDescription>{error ?? uiT(lang, "unknownOrder")}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4 print:space-y-0">
      <div className="print-hide flex flex-wrap items-center justify-between gap-3">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin">
            <ArrowLeft className="size-4" />
            {uiT(lang, "shopPrintDesk")}
          </Link>
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={downloadSheet}>
            <Printer className="size-4" />
            {uiT(lang, "printSheet")}
          </Button>
          <Button onClick={downloadSheet}>
            <Download className="size-4" />
            {uiT(lang, "downloadPrintSheet")}
          </Button>
        </div>
      </div>
      <p className="print-hide max-w-2xl text-sm text-muted-foreground">
        {uiT(lang, "cutterSheetLead")}
      </p>
      <div className="print-hide overflow-auto rounded-xl border bg-neutral-200 p-3">
        <div className="h-[9.2in] sm:h-[10.2in]">
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
