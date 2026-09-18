"use client";

import type { ReactNode } from "react";
import { MessageCircle, Printer, Smartphone } from "lucide-react";
import { HomeSampleGrid } from "@/components/home-sample-grid";
import { VinylSpecPanel } from "@/components/vinyl-spec-panel";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { uiT } from "@/lib/shop-copy";
import { useShopLang } from "@/lib/shop-lang";
import { TELEGRAM_BOT_URL } from "@/lib/telegram";

export function HomeRest() {
  const lang = useShopLang();

  return (
    <>
      <section id="samples" className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="mb-6 max-w-2xl">
          <p className="text-xs font-semibold tracking-[0.14em] text-[var(--gold)] uppercase">
            {uiT(lang, "forDrivers")}
          </p>
          <h2 className="font-heading mt-2 text-2xl font-semibold text-[var(--navy)]">
            {uiT(lang, "startFromSample")}
          </h2>
          <p className="mt-2 text-muted-foreground">{uiT(lang, "startFromSampleLead")}</p>
        </div>
        <HomeSampleGrid />
      </section>

      <Separator />

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <h2 className="font-heading text-2xl font-semibold text-[var(--navy)]">
          {uiT(lang, "layoutAndFederal")}
        </h2>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          {uiT(lang, "layoutAndFederalLead")}
        </p>
        <div className="mt-8">
          <VinylSpecPanel />
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Spec title={uiT(lang, "specCompany")} body={uiT(lang, "specCompanyBody")} />
          <Spec title={uiT(lang, "specUsdot")} body={uiT(lang, "specUsdotBody")} />
          <Spec title={uiT(lang, "specMc")} body={uiT(lang, "specMcBody")} />
          <Spec title={uiT(lang, "specLogo")} body={uiT(lang, "specLogoBody")} />
          <Spec title={uiT(lang, "specColors")} body={uiT(lang, "specColorsBody")} />
          <Spec title={uiT(lang, "specPair")} body={uiT(lang, "specPairBody")} />
        </div>
      </section>

      <Separator />

      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-12 sm:px-6 md:grid-cols-3">
        <Step
          icon={<Printer className="size-4" />}
          title={uiT(lang, "step1")}
          body={uiT(lang, "step1Body")}
        />
        <Step
          icon={<Smartphone className="size-4" />}
          title={uiT(lang, "step2")}
          body={uiT(lang, "step2Body")}
        />
        <Step
          icon={<MessageCircle className="size-4" />}
          title={uiT(lang, "step3")}
          body={uiT(lang, "step3Body")}
        />
      </section>

      <section id="telegram" className="border-t bg-[var(--navy)] text-white">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <h2 className="font-heading text-2xl font-semibold">
            {uiT(lang, "telegramSame")}
          </h2>
          <p className="mt-3 max-w-2xl text-white/80">{uiT(lang, "telegramSameLead")}</p>
          <div className="mt-6">
            <Button
              size="lg"
              className="bg-[var(--gold)] text-[var(--navy)] hover:bg-[var(--gold)]/90"
              asChild
            >
              <a href={TELEGRAM_BOT_URL} target="_blank" rel="noreferrer">
                {uiT(lang, "openTelegram")}
              </a>
            </Button>
          </div>
        </div>
      </section>
    </>
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
