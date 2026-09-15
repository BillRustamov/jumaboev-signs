import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center px-4 py-16">
      <h1 className="font-heading text-2xl font-semibold text-[var(--navy)]">
        That page is not in the shop
      </h1>
      <p className="mt-2 text-muted-foreground">
        Use the door designer or the order list. Nothing else is wired in this
        first slice.
      </p>
      <div className="mt-4 flex gap-2">
        <Button asChild>
          <Link href="/order">Design doors</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/">Home</Link>
        </Button>
      </div>
    </main>
  );
}
