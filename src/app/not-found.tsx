import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center px-4 py-16">
      <h1 className="font-heading text-2xl font-semibold text-[var(--navy)]">
        That page is not in the shop
      </h1>
      <p className="mt-2 text-muted-foreground">
        Use samples, the print desk, the cart, or the order list.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button asChild>
          <Link href="/samples">Samples</Link>
        </Button>
        <Button asChild>
          <Link href="/order">Print desk</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/cart">Cart</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/">Home</Link>
        </Button>
      </div>
    </main>
  );
}
