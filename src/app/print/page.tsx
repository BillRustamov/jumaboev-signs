import type { Metadata } from "next";
import { PrintOnlyDesk } from "@/components/print-only-desk";

export const metadata: Metadata = {
  title: "Print an existing design",
};

export default function PrintPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
      <PrintOnlyDesk />
    </main>
  );
}
