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
          Production and payment stay in sync with the shop store.
        </p>
      </div>
      <AdminDesk />
    </main>
  );
}
