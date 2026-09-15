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
import { SignPair } from "@/components/truck-sign";
import { SAMPLE_SIGN } from "@/lib/order";

export default function HomePage() {
  return (
    <main>
      <section className="border-b bg-[color-mix(in_oklch,var(--navy),white_94%)]">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:py-16">
          <div>
            <Badge variant="secondary">Set of two · 24 in × 24 in</Badge>
            <h1 className="font-heading mt-4 text-3xl font-semibold tracking-tight text-[var(--navy)] sm:text-5xl">
              USDOT doors that follow FMCSA 390.21.
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
              Jumaboev Signs prints a matched 24×24 pair for both sides of the
              cab: MCS-150 name, USDOT number, and optional MC, fleet, and logo.
              Recolor the Elbrus gold-and-navy layout live — letters still have
              to read from 50 feet in daylight.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" asChild>
                <Link href="/order">Design your doors</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#telegram">Order on Telegram</Link>
              </Button>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Most customers already write on Telegram. Instagram sends traffic;
              the shop answers in Telegram.
            </p>
          </div>
          <div className="mx-auto w-full max-w-md">
            <SignPair fields={SAMPLE_SIGN} />
            <p className="mt-3 text-center text-xs text-muted-foreground">
              Sample layout: ELBRUS / ELBRUS FREIGHTLINES LLC · USDOT 20179229 ·
              MC 796405
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <h2 className="font-heading text-2xl font-semibold text-[var(--navy)]">
          What prints on the vinyl
        </h2>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Required by FMCSA on both sides: the MCS-150 name and USDOT. MC,
          fleet, and logo are extra. Typical print is 24×24 outdoor vinyl, two
          copies. Recolor the shop layout in the designer.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Spec
            title="MCS-150 name"
            body="Legal name or one trade name, as filed with FMCSA. Optional second line for the LLC under a trade mark."
          />
          <Spec
            title="USDOT number"
            body="Prints as USDOT plus the digits. Required. Letters must stay readable from 50 feet in daylight."
          />
          <Spec
            title="MC, fleet, logo"
            body="Optional. FMCSA does not require an MC plate. Turn it off if you only run USDOT."
          />
          <Spec
            title="Colors you can recut"
            body="Elbrus, Highway, Gold plates, Red line, or pick every swatch. The designer warns if contrast is too weak for 50-foot reading."
          />
          <Spec
            title="Pair of doors"
            body="One design, two prints. Left and right cab doors match."
          />
          <Spec
            title="Outdoor vinyl"
            body="Cut for truck doors. Khurshid confirms material and ship-to in Telegram after the order."
          />
        </div>
      </section>

      <Separator />

      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-12 sm:px-6 md:grid-cols-3">
        <Step
          icon={<Printer className="size-4" />}
          title="1. Put the lettering in"
          body="Create a username, paste the MCS-150 name and USDOT, then recolor the 24×24 door."
        />
        <Step
          icon={<Smartphone className="size-4" />}
          title="2. Confirm the pair"
          body="Place the order on this site or finish the same questions in the Telegram bot. You get an order ID either way."
        />
        <Step
          icon={<MessageCircle className="size-4" />}
          title="3. Print with Khurshid"
          body="The shop prints from that ticket. Questions, address, and payment stay on Telegram — the channel drivers already use."
        />
      </section>

      <section
        id="telegram"
        className="border-t bg-[var(--navy)] text-white"
      >
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <h2 className="font-heading text-2xl font-semibold">
            Telegram is the main counter
          </h2>
          <p className="mt-3 max-w-2xl text-white/80">
            The bot asks for language first, then the same print fields as this
            site. It runs in English, Uzbek, Tajik, Russian, Kazakh, Kyrgyz, and
            Ukrainian. If no bot token is set, it still runs locally as a mock
            chat so you can walk the flow without Telegram credentials.
          </p>
          <p className="mt-4 font-mono text-sm text-[var(--gold)]">
            npm run bot
          </p>
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
