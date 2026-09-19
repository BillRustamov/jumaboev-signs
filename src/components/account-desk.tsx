"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ShopAccount } from "@/lib/account";
import { notifyAccountChanged, useAccount } from "@/lib/use-account";
import { writeUsername } from "@/lib/client-session";
import { uiT } from "@/lib/shop-copy";
import { localizeNote } from "@/lib/shop-labels";
import { useShopLang } from "@/lib/shop-lang";

function safeNext(raw: string): string {
  if (!raw.startsWith("/") || raw.startsWith("//")) return "/orders";
  return raw;
}

export function AccountDesk() {
  const lang = useShopLang();
  const router = useRouter();
  const { user, loading, setUser } = useAccount();
  const [mode, setMode] = useState<"signin" | "signup">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const nextPath = useMemo(() => {
    if (typeof window === "undefined") return "/orders";
    return safeNext(new URLSearchParams(window.location.search).get("next") ?? "/orders");
  }, []);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const path = mode === "signup" ? "/api/auth/signup" : "/api/auth/login";
      const response = await fetch(path, {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
        }),
      });
      const payload = (await response.json()) as {
        user?: ShopAccount;
        error?: string;
      };
      if (!response.ok || !payload.user) {
        setError(localizeNote(lang, payload.error ?? "Email or password is wrong."));
        return;
      }
      writeUsername(payload.user.username);
      setUser(payload.user);
      notifyAccountChanged();
      router.push(nextPath);
    } catch {
      setError(localizeNote(lang, "Could not reach the shop list."));
    } finally {
      setSubmitting(false);
    }
  }

  async function signOut() {
    setSubmitting(true);
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "same-origin",
      });
      setUser(null);
      notifyAccountChanged();
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{uiT(lang, "accountTitle")}</CardTitle>
          <CardDescription>{uiT(lang, "accountLead")}</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          {uiT(lang, "accountWorking")}
        </CardContent>
      </Card>
    );
  }

  if (user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[var(--navy)]">
            <CheckCircle2 className="size-5 text-[var(--forest)]" />
            {uiT(lang, "accountCreated")}
          </CardTitle>
          <CardDescription>
            {uiT(lang, "accountSignedInAs", { email: user.email })}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
            {uiT(lang, "accountHistoryLead", { user: user.email })}
        </CardContent>
        <CardFooter className="flex-wrap gap-2">
          <Button asChild>
            <Link href="/orders">{uiT(lang, "viewShopOrders")}</Link>
          </Button>
          <Button variant="outline" type="button" onClick={() => void signOut()} disabled={submitting}>
            {uiT(lang, "accountSignOut")}
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-[var(--navy)]">{uiT(lang, "accountTitle")}</CardTitle>
        <CardDescription>{uiT(lang, "accountLead")}</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs
          value={mode}
          onValueChange={(value) => {
            setMode(value as "signin" | "signup");
            setError(null);
          }}
        >
          <TabsList>
            <TabsTrigger value="signup">{uiT(lang, "accountSignUp")}</TabsTrigger>
            <TabsTrigger value="signin">{uiT(lang, "accountSignIn")}</TabsTrigger>
          </TabsList>
          <TabsContent value="signup" />
          <TabsContent value="signin" />
        </Tabs>
        <form className="mt-4 space-y-4" onSubmit={(event) => void submit(event)}>
          {error ? (
            <Alert variant="destructive">
              <AlertCircle />
              <AlertTitle>{uiT(lang, "couldNotCheckout")}</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}
          <div className="space-y-2">
            <Label htmlFor="account-email">{uiT(lang, "accountEmail")}</Label>
            <Input
              id="account-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="account-password">{uiT(lang, "accountPassword")}</Label>
            <Input
              id="account-password"
              type="password"
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              minLength={8}
            />
            <p className="text-xs text-muted-foreground">{uiT(lang, "accountPasswordHint")}</p>
          </div>
          <Button type="submit" disabled={submitting}>
            {submitting ? <Loader2 className="animate-spin" /> : null}
            {submitting
              ? uiT(lang, "accountWorking")
              : mode === "signup"
                ? uiT(lang, "accountSignUp")
                : uiT(lang, "accountSignIn")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
