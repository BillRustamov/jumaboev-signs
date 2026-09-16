import type { ReactNode } from "react";
import Link from "next/link";
import { MessageCircle, Printer, Smartphone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { HomeSampleGrid } from "@/components/home-sample-grid";
import { VinylSpecPanel } from "@/components/vinyl-spec-panel";
import { WhiteSemiTruck } from "@/components/white-semi-truck";
import { SUGGESTED_LAYOUT } from "@/lib/samples";
import { TELEGRAM_BOT_URL } from "@/lib/telegram";
import { VINYL } from "@/lib/vinyl-spec";

export default function HomePage() {
  return (
    <main>
      <section className="border-b bg-[color-mix(in_oklch,var(--navy),white_94%)]">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.9fr)] lg:py-14">
          <div>
            <Badge variant="secondary">Set of two · {VINYL.size} each side</Badge>
            <h1 className="font-heading mt-4 text-3xl font-semibold tracking-tight text-[var(--navy)] sm:text-4xl lg:text-[2.75rem] lg:leading-tight">
              Tap a shop door. Put your USDOT on it.
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
              Jumaboev Signs prints a matched pair — recommended {VINYL.size}{" "}
              for each side of the cab. Company name and USDOT are required by{" "}
              {VINYL.cfr}. This shop also prints MC on the plaque and requires
              it on the ticket. Logo size is yours to set. Unit numbers are a
              separate small print. Letters still have to read from{" "}
              {VINYL.readabilityFt} feet in daylight.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" asChild>
                <Link href="/order">Open the print desk</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/samples">Browse samples</Link>
              </Button>
            </div>
          </div>
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
            Pick a sample, then swap in your numbers
          </h2>
          <p className="mt-2 text-muted-foreground">
            Each card is a 20 × 12 in color on a white sleeper — same truck
            the cart uses. Navy gold is the example: logo, company name, city
            and state, USDOT, then MC. Tap one to open the designer.
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
          title="1. Tap a sample"
          body="Open a shop door that is close to yours. Swap the name, USDOT, and MC. Set logo size on the vinyl."
        />
        <Step
          icon={<Smartphone className="size-4" />}
          title="2. Add to cart"
          body="The pair goes in your cart. Checkout shows it on a white semi before you send it to the shop."
        />
        <Step
          icon={<MessageCircle className="size-4" />}
          title="3. Print with Khurshid"
          body="The shop prints from that ticket. Questions, address, and payment stay on Telegram."
        />
      </section>

      <section id="telegram" className="border-t bg-[var(--navy)] text-white">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <h2 className="font-heading text-2xl font-semibold">
            Telegram is the main counter
          </h2>
          <p className="mt-3 max-w-2xl text-white/80">
            The bot asks for language first, then the same print fields as this
            site. Color picks send photos of this 20 × 12 in plaque on a white
            cab.
            It runs in English, Uzbek, Tajik, Russian, Kazakh, Kyrgyz, and
            Ukrainian. Confirmed tickets land on the shop print desk.
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
