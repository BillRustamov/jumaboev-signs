import type { Metadata } from "next";
import { AccountDesk } from "@/components/account-desk";
import { Localized } from "@/components/localized";

export const metadata: Metadata = {
  title: "Account",
};

export default function AccountPage() {
  return (
    <main className="mx-auto w-full max-w-xl px-4 py-8 sm:px-6 sm:py-10">
      <div className="mb-8">
        <Localized
          k="accountKicker"
          as="p"
          className="text-xs font-semibold tracking-[0.14em] text-[var(--gold)] uppercase"
        />
        <Localized
          k="accountTitle"
          as="h1"
          className="font-heading mt-1 text-3xl font-semibold tracking-tight text-[var(--navy)]"
        />
        <Localized k="accountLead" as="p" className="mt-2 text-muted-foreground" />
      </div>
      <AccountDesk />
    </main>
  );
}
