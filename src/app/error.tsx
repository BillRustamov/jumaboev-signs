"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center px-4 py-16">
      <Alert variant="destructive">
        <AlertCircle />
        <AlertTitle>The print desk hit a snag</AlertTitle>
        <AlertDescription>
          {error.message || "Reload this page or go back to the door designer."}
        </AlertDescription>
      </Alert>
      <div className="mt-4 flex gap-2">
        <Button onClick={reset}>Try again</Button>
        <Button variant="outline" asChild>
          <Link href="/">Home</Link>
        </Button>
      </div>
    </main>
  );
}
