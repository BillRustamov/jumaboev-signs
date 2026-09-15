import type { Metadata } from "next";
import { AdminDesk } from "@/components/admin-desk";

export const metadata: Metadata = {
  title: "Shop print desk",
};

export default function AdminPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <div className="mb-8 max-w-2xl">
        <p className="text-xs font-semibold tracking-[0.14em] text-[var(--gold)] uppercase">
          Admin
        </p>
        <h1 className="font-heading mt-1 text-3xl font-semibold tracking-tight text-[var(--navy)]">
          Print sheets
        </h1>
        <p className="mt-2 text-muted-foreground">
          Each download is a matched pair — approximately 10×20 in for the
          left cab and 10×20 in for the right cab.
        </p>
      </div>
      <AdminDesk />
    </main>
  );
}
