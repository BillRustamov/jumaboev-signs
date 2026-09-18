import type { Metadata } from "next";
import { PayDesk } from "@/components/pay-desk";

export const metadata: Metadata = {
  title: "Pay for a ticket",
};

export default async function PayPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ token?: string }>;
}) {
  const { id } = await params;
  const { token } = await searchParams;
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
      <PayDesk id={id} token={token ?? ""} />
    </main>
  );
}
