import type { ReactNode } from "react";
import Link from "next/link";
import { MessageCircle, Printer, Smartphone } from "lucide-react";
import { HomeEntry } from "@/components/home-entry";
import { HomeSampleGrid } from "@/components/home-sample-grid";
import { VinylSpecPanel } from "@/components/vinyl-spec-panel";
import { WhiteSemiTruck } from "@/components/white-semi-truck";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SUGGESTED_LAYOUT } from "@/lib/samples";
import { TELEGRAM_BOT_URL } from "@/lib/telegram";
import { VINYL } from "@/lib/vinyl-spec";

export default function HomePage() {
  return (
    <main>
      <section className="border-b bg-[color-mix(in_oklch,var(--navy),white_94%)]">
        <div className="mx-auto grid max-w-6xl items-start gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.9fr)] lg:py-14">
          <HomeEntry />
          <div className="mx-auto w-full max-w-xl">
            <WhiteSemiTruck fields={SUGGESTED_LAYOUT.fields} />
            <p className="mt-3 text-center text-xs text-muted-foreground">
              Suggested layout on a white sleeper · {VINYL.sizeEach}
            </p>
          </div>
        </div>
      </section>

      <section
        id="samples"
        className="mx-auto max-w-6xl px-4 py-12 sm:px-6"
      >
        <div className="mb-6 max-w-2xl">
          <p className="text-xs font-semibold tracking-[0.14em] text-[var(--gold)] uppercase">
            For drivers
          </p>
          <h2 className="font-heading mt-2 text-2xl font-semibold text-[var(--navy)]">
            Creating a new design? Start from a sample
          </h2>
          <p className="mt-2 text-muted-foreground">
            Each card is a 20 × 12 in color on a white sleeper — same truck
            the cart uses. Tap one to open the designer. If you already have
            artwork, use I already have a design instead.
          </p>
        </div>
        <HomeSampleGrid />
      </section>

      <Separator />

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <h2 className="font-heading text-2xl font-semibold text-[var(--navy)]">
          Layout and federal marking
        </h2>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          One 20 × 12 in plaque on each cab door: logo, company name, city and
          state, USDOT, then MC. FMCSA does not set a letter height — it has
          to read from {VINYL.readabilityFt} feet, on both sides of the power
          unit, in strong contrast. MC is not required on the truck; this shop
          still prints it.
        </p>
        <div className="mt-8">
          <VinylSpecPanel />
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Spec
            title="Company name"
            body="Legal name or one trade name, as filed with FMCSA. Prints large on the 20 × 12 in plaque. City and state print under the name."
          />
          <Spec
            title="USDOT number"
            body="Prints as USDOT plus the digits under city and state. Required. Letters 2–3 in, readable from 50 feet."
          />
          <Spec
            title="MC number"
            body="Prints as MC plus the digits under USDOT, 2 in letters. Not required on the truck by 49 CFR § 390.21 — required on this shop ticket."
          />
          <Spec
            title="Logo"
            body="Optional. Set how large the mark prints above the name. Unit numbers are not on this vinyl."
          />
          <Spec
            title="Colors you can recut"
            body="Navy gold is the example. Black, red, and asphalt recut the same 20 × 12 in stack. The designer warns if contrast is too weak for 50-foot reading."
          />
          <Spec
            title="Pair of doors"
            body="One design, two prints. Left and right cab doors match. Example size is 20 × 12 in."
          />
        </div>
      </section>

      <Separator />

      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-12 sm:px-6 md:grid-cols-3">
        <Step
          icon={<Printer className="size-4" />}
          title="1. Pick a service"
          body="Print a file you already have, or create a new USDOT door in the designer. You tap — you do not type commands."
        />
        <Step
          icon={<Smartphone className="size-4" />}
          title="2. Confirm the pair"
          body="Print-existing sends the original file at 20 × 12 in. New designs go through the cart and a white-cab preview."
        />
        <Step
          icon={<MessageCircle className="size-4" />}
          title="3. Print with Khurshid"
          body="Tickets land on the print desk. Questions stay on Telegram or the contact page — the Start button opens the same menu."
        />
      </section>

      <section id="telegram" className="border-t bg-[var(--navy)] text-white">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <h2 className="font-heading text-2xl font-semibold">
            Telegram is the same counter
          </h2>
          <p className="mt-3 max-w-2xl text-white/80">
            Open the shop bot and tap Start. The first screen is How can we
            help you today? — print an existing file, create a new design, my
            orders, contact, or language. You do not type commands. English,
            Uzbek, Tajik, Russian, Kazakh, Kyrgyz, and Ukrainian.
          </p>
          <div className="mt-6">
            <Button
              size="lg"
              className="bg-[var(--gold)] text-[var(--navy)] hover:bg-[var(--gold)]/90"
              asChild
            >
              <a href={TELEGRAM_BOT_URL} target="_blank" rel="noreferrer">
                Open the shop on Telegram
              </a>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}

function Spec({ title, body }: { title: string; body: string }) {
  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{body}</CardDescription>
      </CardHeader>
    </Card>
  );
}

function Step({
  icon,
  title,
  body,
}: {
  icon: ReactNode;
  title: string;
  body: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{body}</p>
      </CardContent>
    </Card>
  );
}
