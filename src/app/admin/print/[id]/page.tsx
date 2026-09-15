import type { Metadata } from "next";
import { AdminPrintDesk } from "@/components/admin-print-desk";

export const metadata: Metadata = {
  title: "24×24 print sheet",
};

export default function AdminPrintPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 print:mx-0 print:max-w-none print:p-0">
      <AdminPrintDesk />
    </main>
  );
}
