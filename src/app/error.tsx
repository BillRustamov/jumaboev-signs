"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { uiT } from "@/lib/shop-copy";
import { useShopLang } from "@/lib/shop-lang";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const lang = useShopLang();
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center px-4 py-16">
      <Alert variant="destructive">
        <AlertCircle />
        <AlertTitle>{uiT(lang, "printDeskHitSnag")}</AlertTitle>
        <AlertDescription>
          {error.message || uiT(lang, "reloadOrBack")}
        </AlertDescription>
      </Alert>
      <div className="mt-4 flex gap-2">
        <Button onClick={reset}>{uiT(lang, "tryAgain")}</Button>
        <Button variant="outline" asChild>
          <Link href="/">{uiT(lang, "home")}</Link>
        </Button>
      </div>
    </main>
  );
}
