import type { Metadata } from "next";
import { PayReturnDesk } from "@/components/pay-return-desk";

export const metadata: Metadata = {
  title: "Returned from Stripe",
};

export default async function PayReturnPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ token?: string; session_id?: string }>;
}) {
  const { id } = await params;
  const { token } = await searchParams;
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
      <PayReturnDesk id={id} token={token ?? ""} />
    </main>
  );
}
