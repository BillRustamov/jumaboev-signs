import type { Metadata } from "next";
import { ContactDesk } from "@/components/contact-desk";

export const metadata: Metadata = {
  title: "Contact the shop",
};

export default function ContactPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
      <ContactDesk />
    </main>
  );
}
