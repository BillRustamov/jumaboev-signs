import Link from "next/link";
import { CartButton } from "@/components/cart-button";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-white/95 backdrop-blur">
      <div className="h-0.5 bg-[var(--gold)]" />
      <div className="mx-auto flex h-11 max-w-6xl items-center justify-between gap-2 px-3 sm:h-12 sm:px-6">
        <Link href="/" className="min-w-0">
          <p className="font-heading text-[12px] font-semibold tracking-[0.12em] text-[var(--navy)] uppercase sm:text-sm">
            Jumaboev Signs
          </p>
          <p className="hidden truncate text-[11px] text-muted-foreground sm:block">
            24×24 USDOT door vinyl · FMCSA 390.21
          </p>
        </Link>
        <nav className="flex items-center gap-1">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/samples">Samples</Link>
          </Button>
          <Button variant="ghost" size="sm" className="hidden sm:inline-flex" asChild>
            <Link href="/orders">Orders</Link>
          </Button>
          <CartButton />
          <Button size="sm" asChild>
            <Link href="/order">Print desk</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
