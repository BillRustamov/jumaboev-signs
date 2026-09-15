import Link from "next/link";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="border-b bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link href="/" className="min-w-0">
          <p className="font-heading text-sm font-semibold tracking-wide text-[var(--navy)] sm:text-base">
            Jumaboev Signs
          </p>
          <p className="hidden truncate text-[11px] text-muted-foreground sm:block sm:text-xs">
            24×24 vinyl DOT door decals
          </p>
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/orders">Orders</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/order">Design doors</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
