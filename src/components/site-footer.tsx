import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t bg-[var(--navy)] text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 sm:flex-row sm:items-start sm:justify-between sm:px-6">
        <div>
          <p className="font-heading text-sm font-semibold tracking-wide">
            Jumaboev Signs
          </p>
          <p className="mt-1 max-w-sm text-sm text-white/75">
            Khurshid Jumaboev prints US DOT truck door vinyl for owner-operators
            and small fleets. Telegram is the shop’s main channel.
          </p>
        </div>
        <div className="text-sm text-white/80">
          <p>
            <Link className="underline-offset-4 hover:underline" href="/order">
              Open the print desk
            </Link>
          </p>
          <p className="mt-1">
            <Link className="underline-offset-4 hover:underline" href="/#samples">
              Browse door samples
            </Link>
          </p>
          <p className="mt-1">
            Telegram bot: <code className="text-white/95">npm run bot</code>
          </p>
          <p className="mt-1">Typical print: 24 in × 24 in, set of two</p>
        </div>
      </div>
    </footer>
  );
}
