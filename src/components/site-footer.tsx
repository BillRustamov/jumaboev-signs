import Link from "next/link";
import { TELEGRAM_BOT_URL } from "@/lib/telegram";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t bg-[var(--navy)] text-white print:hidden">
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
            <Link className="underline-offset-4 hover:underline" href="/samples">
              Browse door samples
            </Link>
          </p>
          <p className="mt-1">
            <Link className="underline-offset-4 hover:underline" href="/cart">
              Open cart
            </Link>
          </p>
          <p className="mt-1">
            <Link className="underline-offset-4 hover:underline" href="/orders">
              Shop orders
            </Link>
          </p>
          <p className="mt-1">
            <Link className="underline-offset-4 hover:underline" href="/checkout">
              Checkout on the truck
            </Link>
          </p>
          <p className="mt-1">
            <a
              className="underline-offset-4 hover:underline"
              href={TELEGRAM_BOT_URL}
              target="_blank"
              rel="noreferrer"
            >
              Order on Telegram
            </a>
          </p>
          <p className="mt-1">
            <Link className="underline-offset-4 hover:underline" href="/admin">
              Admin print sheets
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
