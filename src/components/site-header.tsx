import Link from "next/link";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="border-b bg-white/95 backdrop-blur">
      <div className="h-0.5 bg-[var(--gold)]" />
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3.5 sm:px-6">
        <Link href="/" className="min-w-0">
          <p className="font-heading text-[13px] font-semibold tracking-[0.12em] text-[var(--navy)] uppercase sm:text-sm">
            Jumaboev Signs
          </p>
          <p className="hidden truncate text-[11px] text-muted-foreground sm:block">
            24×24 USDOT door vinyl · FMCSA 390.21
          </p>
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/#samples">Samples</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/orders">Orders</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/order">Print desk</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
