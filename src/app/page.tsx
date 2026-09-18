import { HomeEntry } from "@/components/home-entry";
import { HomeRest } from "@/components/home-rest";
import { Localized } from "@/components/localized";
import { WhiteSemiTruck } from "@/components/white-semi-truck";
import { SUGGESTED_LAYOUT } from "@/lib/samples";

export default function HomePage() {
  return (
    <main>
      <section className="border-b bg-[color-mix(in_oklch,var(--navy),white_94%)]">
        <div className="mx-auto grid max-w-6xl items-start gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.9fr)] lg:py-14">
          <HomeEntry />
          <div className="mx-auto w-full max-w-xl">
            <WhiteSemiTruck fields={SUGGESTED_LAYOUT.fields} />
            <Localized
              k="suggestedOnSleeper"
              as="p"
              className="mt-3 text-center text-xs text-muted-foreground"
            />
          </div>
        </div>
      </section>
      <HomeRest />
    </main>
  );
}
