"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
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
import { WhiteSemiTruck } from "@/components/white-semi-truck";
import { clearCart, useCart } from "@/lib/cart";
import { writeLocalOrder, writeUsername, useUsername } from "@/lib/client-session";
import {
  createOrderId,
  validateSign,
  validateUsername,
  type SignOrder,
} from "@/lib/order";
import { uiT } from "@/lib/shop-copy";
import { localizeNote } from "@/lib/shop-labels";
import { useAccount } from "@/lib/use-account";
import { useShopLang } from "@/lib/shop-lang";

export function CheckoutDesk() {
  const lang = useShopLang();
  const items = useCart();
  const storedUsername = useUsername();
  const { user } = useAccount();
  const [usernameDraft, setUsernameDraft] = useState<string | null>(null);
  const username = user?.username ?? usernameDraft ?? storedUsername;
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [placed, setPlaced] = useState<SignOrder[]>([]);

  const ready = useMemo(
    () =>
      items.filter((item) => validateSign(item.fields).length === 0),
    [items],
  );

  async function checkout(event: React.FormEvent) {
    event.preventDefault();
    const nameError = validateUsername(username);
    if (nameError) {
      setUsernameError(localizeNote(lang, nameError));
      return;
    }
    if (!ready.length) {
      setFormError(uiT(lang, "cartNoComplete"));
      return;
    }
    setSubmitting(true);
    setFormError(null);
    writeUsername(username.trim());
    const created: SignOrder[] = [];
    try {
      for (const item of ready) {
        const order: SignOrder = {
          ...item.fields,
          fleetNumber: "",
          id: createOrderId(),
          username: username.trim(),
          source: "web",
          createdAt: new Date().toISOString(),
          status: "received",
          service: "CUSTOM_DESIGN",
        };
        const response = await fetch("/api/orders", {
          method: "POST",
          credentials: "same-origin",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(order),
        });
        const saved = response.ok
          ? ((await response.json()) as SignOrder)
          : order;
        writeLocalOrder(saved);
        created.push(saved);
      }
      clearCart();
      setPlaced(created);
    } catch {
      for (const order of created) writeLocalOrder(order);
      setPlaced(created);
      setFormError(uiT(lang, "savedAfterNetwork"));
    } finally {
      setSubmitting(false);
    }
  }

  if (placed.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="size-5 text-[var(--forest)]" />
            {uiT(lang, "orderReceived")}
          </CardTitle>
          <CardDescription>
            {uiT(lang, "orderReceivedLead", {
              ids: placed.map((order) => order.id).join(", "),
              user: placed[0]?.username ?? "",
            })}
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex-wrap gap-2">
          <Button asChild>
            <Link href="/orders">{uiT(lang, "viewShopOrders")}</Link>
          </Button>
        </CardFooter>
      </Card>
    );
  }

  if (!items.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{uiT(lang, "nothingCheckout")}</CardTitle>
          <CardDescription>{uiT(lang, "nothingCheckoutLead")}</CardDescription>
        </CardHeader>
        <CardFooter className="gap-2">
          <Button asChild>
            <Link href="/order">{uiT(lang, "printDesk")}</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/cart">{uiT(lang, "openCart")}</Link>
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {items.map((item) => (
        <section key={item.id} className="space-y-2">
          <div>
            <h2 className="font-heading text-lg font-semibold text-[var(--navy)]">
              {item.fields.companyName.trim().toUpperCase() || uiT(lang, "doorPair")}
            </h2>
            <p className="text-sm text-muted-foreground">
              {uiT(lang, "checkoutPreviewNote")}
            </p>
          </div>
          <WhiteSemiTruck fields={item.fields} />
        </section>
      ))}

      <Card>
        <CardHeader>
          <CardTitle>{uiT(lang, "sendToShop")}</CardTitle>
          <CardDescription>{uiT(lang, "sendToShopLead")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={checkout} autoComplete="off">
            {formError ? (
              <Alert variant="destructive">
                <AlertCircle />
                <AlertTitle>{uiT(lang, "couldNotCheckout")}</AlertTitle>
                <AlertDescription>{formError}</AlertDescription>
              </Alert>
            ) : null}
            {usernameError ? (
              <Alert variant="destructive">
                <AlertCircle />
                <AlertTitle>{uiT(lang, "usernameRejected")}</AlertTitle>
                <AlertDescription>{usernameError}</AlertDescription>
              </Alert>
            ) : null}
            {user ? (
              <p className="text-sm text-muted-foreground">
                {uiT(lang, "checkoutSignedIn", { email: user.email })}
              </p>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="checkout-username">{uiT(lang, "accountEmail")}</Label>
                  <Input
                    id="checkout-username"
                    type="email"
                    value={username}
                    autoComplete="email"
                    onChange={(event) => {
                      setUsernameDraft(event.target.value);
                      setUsernameError(null);
                    }}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  <Link href="/account?next=/checkout" className="underline underline-offset-2">
                    {uiT(lang, "checkoutCreateAccount")}
                  </Link>
                </p>
              </>
            )}
            <Button type="submit" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="animate-spin" />
                  {uiT(lang, "sendingToShop")}
                </>
              ) : ready.length === 1 ? (
                uiT(lang, "placeOnePair")
              ) : (
                uiT(lang, "placeManyPairs", { n: String(ready.length) })
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
